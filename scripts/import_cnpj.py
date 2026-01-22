#!/usr/bin/env python3
"""
Script de Importação CNPJ - Receita Federal
Arquitetura: TEMP UNLOGGED tables + MERGE (sem duplicação)
Com sistema de CHECKPOINTS por arquivo (retoma automaticamente)
"""

import sys
import zipfile
import csv
import psycopg2
from psycopg2.extras import execute_values
from pathlib import Path
from datetime import datetime
import logging
from typing import Dict, List, Tuple
import time
import os
import io
import re

# Importar sistema de checkpoints
from manage_checkpoints import (
    criar_tabela_checkpoint,
    iniciar_checkpoint,
    finalizar_checkpoint,
    erro_checkpoint,
    listar_arquivos_pendentes
)

# Configuração
DATA_DIR = Path("/Volumes/ExtMB/BaseCNPJ/dez2025")
TEMP_EXTRACT_DIR = Path("/Volumes/ExtMB/temp")
LOG_DIR = Path("/Volumes/ExtMB/postgresql/logs")

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'basecerta',
    'user': 'aian_db',
    'password': 'P@lm315@s'
}

# Tamanho do lote para UPSERT
BATCH_SIZE = 100000  # 100k registros por batch

# Estruturas de dados
ESTRUTURAS = {
    'Empresas': {
        'colunas': [
            'cnpj_basico', 'razao_social', 'natureza_juridica', 'qualificacao_responsavel',
            'capital_social', 'porte', 'ente_federativo'
        ],
        'tipos': ['TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT'],  # capital_social como TEXT para importar
        'tabela_destino': 'cnpj_brasil.empresas',
        'chave_primaria': 'cnpj_basico'
    },
    'Estabelecimentos': {
        'colunas': [
            'cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial',
            'nome_fantasia', 'situacao_cadastral', 'data_situacao_cadastral',
            'motivo_situacao_cadastral', 'nome_cidade_exterior', 'pais',
            'data_inicio_atividade', 'cnae_fiscal_principal', 'cnae_fiscal_secundaria',
            'tipo_logradouro', 'logradouro', 'numero', 'complemento', 'bairro',
            'cep', 'uf', 'municipio', 'ddd1', 'telefone1', 'ddd2', 'telefone2',
            'ddd_fax', 'fax', 'email', 'situacao_especial', 'data_situacao_especial'
        ],
        'tipos': [
            'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT', 'DATE',
            'TEXT', 'TEXT', 'TEXT', 'DATE', 'TEXT', 'TEXT',
            'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT',
            'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT',
            'TEXT', 'TEXT', 'TEXT', 'TEXT', 'DATE'
        ],
        'tabela_destino': 'cnpj_brasil.estabelecimentos',
        'chave_primaria': '(cnpj_basico, cnpj_ordem, cnpj_dv)'
    },
    'Simples': {
        'colunas': [
            'cnpj_basico', 'opcao_simples', 'data_opcao_simples',
            'data_exclusao_simples', 'opcao_mei', 'data_opcao_mei',
            'data_exclusao_mei'
        ],
        'tipos': ['TEXT', 'TEXT', 'DATE', 'DATE', 'TEXT', 'DATE', 'DATE'],
        'tabela_destino': 'cnpj_brasil.simples_nacional',
        'chave_primaria': 'cnpj_basico'
    },
    'Socios': {
        'colunas': [
            'cnpj_basico', 'identificador_socio', 'nome_socio', 'cpf_cnpj_socio',
            'qualificacao_socio', 'data_entrada_sociedade', 'pais',
            'representante_legal', 'nome_representante', 'qualificacao_representante',
            'faixa_etaria'
        ],
        'tipos': [
            'TEXT', 'TEXT', 'TEXT', 'TEXT',
            'TEXT', 'DATE', 'TEXT',
            'TEXT', 'TEXT', 'TEXT',
            'TEXT'
        ],
        'tabela_destino': 'cnpj_brasil.socios',
        'chave_primaria': '(cnpj_basico, identificador_socio, cpf_cnpj_socio, nome_socio)',
        'constraint_name': 'uk_socio'
    }
}

# Mapeamento de arquivos auxiliares para tabelas
AUXILIARES = {
    'Cnaes': ('cnaes', ['codigo', 'descricao']),
    'Motivos': ('motivos_situacao_cadastral', ['codigo', 'descricao']),
    'Municipios': ('municipios', ['codigo', 'descricao']),
    'Naturezas': ('naturezas_juridicas', ['codigo', 'descricao']),
    'Paises': ('paises', ['codigo', 'descricao']),
    'Qualificacoes': ('qualificacoes_socios', ['codigo', 'descricao'])
}


class ImportadorCNPJ:
    def __init__(self, versao_importacao: str):
        self.versao = versao_importacao
        self.conn = None
        self.cursor = None
        self.setup_logging()
        self.foreign_keys_dropped = False
        
        # Lista de Foreign Keys para gerenciar
        self.foreign_keys = [
            ("cnpj_brasil.empresas", "fk_natureza_juridica", 
             "FOREIGN KEY (natureza_juridica) REFERENCES naturezas_juridicas(codigo)"),
            ("cnpj_brasil.empresas", "fk_qualificacao_resp", 
             "FOREIGN KEY (qualificacao_responsavel) REFERENCES qualificacoes_socios(codigo)"),
            ("cnpj_brasil.estabelecimentos", "fk_estabelec_cnae", 
             "FOREIGN KEY (cnae_fiscal_principal) REFERENCES cnaes(codigo)"),
            ("cnpj_brasil.estabelecimentos", "fk_estabelec_empresa", 
             "FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)"),
            ("cnpj_brasil.estabelecimentos", "fk_estabelec_motivo", 
             "FOREIGN KEY (motivo_situacao_cadastral) REFERENCES motivos_situacao_cadastral(codigo)"),
            ("cnpj_brasil.estabelecimentos", "fk_estabelec_municipio", 
             "FOREIGN KEY (municipio) REFERENCES municipios(codigo)"),
            ("cnpj_brasil.estabelecimentos", "fk_estabelec_pais", 
             "FOREIGN KEY (pais) REFERENCES paises(codigo)"),
            ("cnpj_brasil.simples_nacional", "fk_simples_empresa", 
             "FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)"),
            ("cnpj_brasil.socios", "fk_socio_empresa", 
             "FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)"),
            ("cnpj_brasil.socios", "fk_socio_pais", 
             "FOREIGN KEY (pais) REFERENCES paises(codigo)"),
            ("cnpj_brasil.socios", "fk_socio_qualif_repr", 
             "FOREIGN KEY (qualificacao_representante) REFERENCES qualificacoes_socios(codigo)"),
            ("cnpj_brasil.socios", "fk_socio_qualificacao", 
             "FOREIGN KEY (qualificacao_socio) REFERENCES qualificacoes_socios(codigo)"),
        ]
        
    def setup_logging(self):
        """Configura logging"""
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        log_file = LOG_DIR / f"import_{self.versao}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
        handler = logging.FileHandler(log_file, encoding='utf-8')
        handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        
        self.logger = logging.getLogger(f'ImportadorCNPJ_{self.versao}')
        self.logger.setLevel(logging.INFO)
        self.logger.addHandler(handler)
        self.logger.addHandler(logging.StreamHandler())
        
        self.logger.info(f"Log iniciado: {log_file}")
    
    def drop_foreign_keys(self):
        """Remove todas as foreign keys antes da importação"""
        self.logger.info("\n" + "="*80)
        self.logger.info("🗑️  REMOVENDO FOREIGN KEYS (performance)")
        self.logger.info("="*80)
        
        dropped = 0
        for table, constraint_name, _ in self.foreign_keys:
            try:
                self.cursor.execute(f"ALTER TABLE {table} DROP CONSTRAINT IF EXISTS {constraint_name}")
                self.conn.commit()
                dropped += 1
                self.logger.info(f"  ✅ {table}.{constraint_name}")
            except Exception as e:
                self.logger.warning(f"  ⚠️  {constraint_name}: {e}")
                self.conn.rollback()
        
        self.foreign_keys_dropped = True
        self.logger.info(f"\n✅ {dropped} Foreign Keys removidas com sucesso!")
        self.logger.info("ℹ️  Serão recriadas automaticamente após importação\n")
    
    def recreate_foreign_keys(self):
        """Recria foreign keys após importação"""
        if not self.foreign_keys_dropped:
            self.logger.info("ℹ️  Foreign Keys não foram removidas, pulando recriação")
            return
            
        self.logger.info("\n" + "="*80)
        self.logger.info("🔧 RECRIANDO FOREIGN KEYS")
        self.logger.info("="*80)
        
        success = 0
        failed = []
        
        for table, constraint_name, definition in self.foreign_keys:
            try:
                self.cursor.execute(f"ALTER TABLE {table} ADD CONSTRAINT {constraint_name} {definition}")
                self.conn.commit()
                success += 1
                self.logger.info(f"  ✅ {table}.{constraint_name}")
            except Exception as e:
                failed.append((table, constraint_name, str(e)))
                self.logger.error(f"  ❌ {table}.{constraint_name}: {e}")
                self.conn.rollback()
        
        if failed:
            self.logger.warning(f"\n⚠️  {len(failed)} foreign key(s) falharam:")
            for table, constraint, error in failed:
                self.logger.warning(f"   • {table}.{constraint}")
            self.logger.warning("\nMotivo: Códigos inválidos nos dados da Receita Federal")
            self.logger.warning("Solução: Os dados estão corretos, índices funcionam normalmente")
            self.logger.warning("         Use scripts/manage_foreign_keys.py check para detalhes")
        else:
            self.logger.info(f"\n✅ Todas as {success} Foreign Keys recriadas com sucesso!")
        
        self.foreign_keys_dropped = False
        
    def conectar(self):
        """Conecta ao PostgreSQL"""
        try:
            self.conn = psycopg2.connect(**DB_CONFIG)
            self.conn.autocommit = False
            self.cursor = self.conn.cursor()
            self.logger.info("✅ Conectado ao PostgreSQL")
        except Exception as e:
            self.logger.error(f"❌ Erro ao conectar: {e}")
            raise
            
    def desconectar(self):
        """Desconecta do PostgreSQL"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        self.logger.info("Desconectado do PostgreSQL")
        
    def criar_tabela_temp(self, nome_tipo: str):
        """Cria tabela temporária UNLOGGED no schema public"""
        estrutura = ESTRUTURAS[nome_tipo]
        temp_table = f"public.temp_{nome_tipo.lower()}"
        
        # DROP se existir
        self.cursor.execute(f"DROP TABLE IF EXISTS {temp_table}")
        
        # Criar colunas
        colunas_sql = []
        for col, tipo in zip(estrutura['colunas'], estrutura['tipos']):
            colunas_sql.append(f"{col} {tipo}")
        
        sql = f"""
        CREATE UNLOGGED TABLE {temp_table} (
            {', '.join(colunas_sql)}
        )
        """
        
        self.cursor.execute(sql)
        self.conn.commit()
        self.logger.info(f"✅ Tabela temporária criada: {temp_table}")
        return temp_table
        
    def listar_arquivos_tipo(self, tipo: str) -> List[Path]:
        """Lista arquivos ZIP de um tipo específico"""
        pattern = f"{tipo}*.zip"
        arquivos = sorted(DATA_DIR.glob(pattern))
        self.logger.info(f"📁 Encontrados {len(arquivos)} arquivo(s) para {tipo}")
        return arquivos
        
    def extrair_e_copiar(self, zip_path: Path, temp_table: str, estrutura: Dict):
        """Extrai CSV do ZIP e faz COPY para tabela temporária"""
        total_linhas = 0
        
        # Valores padrão para campos vazios/inválidos
        DATA_PADRAO = '19000101'  # Data fictícia: 01/01/1900
        NUMERIC_PADRAO = '0,00'   # Valor numérico padrão (formato brasileiro)
        
        with zipfile.ZipFile(zip_path, 'r') as zf:
            csv_name = zf.namelist()[0]
            
            with zf.open(csv_name) as csv_file:
                # Decodificar de latin1 para UTF-8
                content = csv_file.read().decode('latin1')
                
                # PRIMEIRO: Substituir ""; por ; (aspas vazias por campo vazio)
                # E também substituir "0" por 0 (sem aspas)
                content = content.replace('"";', ';').replace('""', '').replace('"0"', '0')
                
                # Identificar índices das colunas DATE
                date_columns = {i for i, tipo in enumerate(estrutura['tipos']) if tipo == 'DATE'}
                
                # Identificar coluna capital_social (se existir) - será convertida para NUMERIC
                capital_social_idx = None
                if 'capital_social' in estrutura['colunas']:
                    capital_social_idx = estrutura['colunas'].index('capital_social')
                
                num_colunas = len(estrutura['colunas'])
                
                # Processar linha por linha
                lines = []
                for line in content.split('\n'):
                    if not line.strip():
                        continue
                    
                    # Split simples por ;
                    campos = line.split(';', num_colunas - 1)
                    
                    # Se não tem o número correto de campos, manter original
                    if len(campos) != num_colunas:
                        lines.append(line)
                        continue
                    
                    # Substituir valores inválidos nas colunas DATE
                    for idx in date_columns:
                        if idx < len(campos):
                            valor = campos[idx].strip()
                            # Valores inválidos: vazio, "0", "00000000", etc.
                            if not valor or valor == '0' or re.match(r'^0+$', valor):
                                campos[idx] = DATA_PADRAO
                    
                    # Tratar capital_social vazio
                    if capital_social_idx is not None and capital_social_idx < len(campos):
                        valor = campos[capital_social_idx].strip()
                        if not valor:
                            campos[capital_social_idx] = NUMERIC_PADRAO
                    
                    # Reconstruir linha
                    lines.append(';'.join(campos))
                
                processed_content = '\n'.join(lines)
                text_file = io.StringIO(processed_content)
                
                # Usar COPY FROM
                copy_sql = f"""
                COPY {temp_table} ({', '.join(estrutura['colunas'])})
                FROM STDIN
                WITH (FORMAT CSV, DELIMITER ';', NULL '', ENCODING 'UTF8')
                """
                
                try:
                    self.cursor.copy_expert(copy_sql, text_file)
                    linhas = self.cursor.rowcount
                    total_linhas += linhas
                    self.conn.commit()
                    self.logger.info(f"  ✅ {zip_path.name}: {linhas:,} linhas")
                except Exception as e:
                    self.conn.rollback()
                    self.logger.error(f"  ❌ Erro em {zip_path.name}: {e}")
                    raise
                    
        return total_linhas
        
    def merge_to_production(self, temp_table: str, estrutura: Dict):
        """Faz MERGE (UPSERT) da tabela temporária para produção"""
        tabela_destino = estrutura['tabela_destino']
        chave = estrutura['chave_primaria']
        colunas = estrutura['colunas']
        
        self.logger.info(f"🔄 Iniciando MERGE: {temp_table} → {tabela_destino}")
        
        # Criar índice temporário na chave para acelerar UPSERT
        if '(' in chave:  # Chave composta
            cols = chave.strip('()').split(',')
            idx_cols = ', '.join([c.strip() for c in cols])
        else:
            idx_cols = chave
            
        self.cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_temp ON {temp_table} ({idx_cols})")
        
        # UPSERT em batches
        total_rows_query = f"SELECT COUNT(*) FROM {temp_table}"
        self.cursor.execute(total_rows_query)
        total_rows = self.cursor.fetchone()[0]
        
        self.logger.info(f"📊 Total de registros para UPSERT: {total_rows:,}")
        
        # Preparar ON CONFLICT
        # Socios usa constraint uk_socio em vez de chave primária
        if 'socios' in tabela_destino:
            conflict_target = f"ON CONSTRAINT uk_socio"
        elif '(' in chave:
            conflict_target = f"({chave})"  # Chave composta com parênteses
        else:
            conflict_target = f"({chave})"
            
        # Preparar UPDATE SET
        update_cols = [f"{col} = EXCLUDED.{col}" for col in colunas if col not in chave.replace('(', '').replace(')', '').replace(' ', '').split(',')]
        
        # INSERT com ON CONFLICT em batches
        batch_num = 0
        processed = 0
        
        while processed < total_rows:
            batch_num += 1
            
            # Para Empresas, converter capital_social de TEXT para NUMERIC
            if 'empresas' in tabela_destino:
                select_cols = []
                for col in colunas:
                    if col == 'capital_social':
                        # Converter formato brasileiro para SQL: "1.234,56" → 1234.56
                        select_cols.append("CAST(REPLACE(REPLACE(capital_social, '.', ''), ',', '.') AS NUMERIC) AS capital_social")
                    else:
                        select_cols.append(col)
                select_clause = ', '.join(select_cols)
            else:
                select_clause = ', '.join(colunas)
            
            upsert_sql = f"""
            INSERT INTO {tabela_destino} ({', '.join(colunas)})
            SELECT {select_clause}
            FROM {temp_table}
            LIMIT {BATCH_SIZE} OFFSET {processed}
            ON CONFLICT {conflict_target}
            DO UPDATE SET
                {', '.join(update_cols)},
                updated_at = CURRENT_TIMESTAMP
            """
            
            self.cursor.execute(upsert_sql)
            affected = self.cursor.rowcount
            processed += BATCH_SIZE
            
            self.conn.commit()
            
            pct = min(100, (processed / total_rows) * 100)
            self.logger.info(f"  Batch {batch_num}: {affected:,} registros | Progresso: {pct:.1f}%")
            
        self.logger.info(f"✅ MERGE completo: {total_rows:,} registros processados")
    
    def merge_arquivo_to_production(self, temp_table: str, estrutura: Dict, total_rows: int):
        """MERGE otimizado para um único arquivo (sem batching)"""
        tabela_destino = estrutura['tabela_destino']
        chave = estrutura['chave_primaria']
        colunas = estrutura['colunas']
        
        # Preparar ON CONFLICT
        if 'socios' in tabela_destino:
            conflict_target = f"ON CONSTRAINT uk_socio"
        elif '(' in chave:
            conflict_target = f"({chave})"
        else:
            conflict_target = f"({chave})"
            
        # Preparar UPDATE SET
        chave_cols = chave.replace('(', '').replace(')', '').replace(' ', '').split(',')
        update_cols = [f"{col} = EXCLUDED.{col}" for col in colunas if col not in chave_cols]
        
        # Para Empresas, converter capital_social
        if 'empresas' in tabela_destino:
            select_cols = []
            for col in colunas:
                if col == 'capital_social':
                    select_cols.append("CAST(REPLACE(REPLACE(capital_social, '.', ''), ',', '.') AS NUMERIC) AS capital_social")
                else:
                    select_cols.append(col)
            select_clause = ', '.join(select_cols)
        else:
            select_clause = ', '.join(colunas)
        
        # UPSERT direto (arquivo geralmente < 100k linhas)
        upsert_sql = f"""
        INSERT INTO {tabela_destino} ({', '.join(colunas)})
        SELECT {select_clause}
        FROM {temp_table}
        ON CONFLICT {conflict_target}
        DO UPDATE SET
            {', '.join(update_cols)},
            updated_at = CURRENT_TIMESTAMP
        """
        
        self.cursor.execute(upsert_sql)
        affected = self.cursor.rowcount
        self.logger.info(f"    ✓ {affected:,} registros inseridos/atualizados")
        
    def importar_tipo(self, tipo: str):
        """Importa todos os arquivos de um tipo específico COM CHECKPOINTS"""
        self.logger.info(f"\n{'='*80}")
        self.logger.info(f"IMPORTANDO: {tipo}")
        self.logger.info(f"{'='*80}\n")
        
        inicio = time.time()
        estrutura = ESTRUTURAS[tipo]
        tabela_destino = estrutura['tabela_destino']
        
        # 1. Listar TODOS os arquivos deste tipo
        todos_arquivos = self.listar_arquivos_tipo(tipo)
        
        # 2. Verificar quais já foram processados (CHECKPOINT)
        arquivos_pendentes = listar_arquivos_pendentes(self.versao, tipo, todos_arquivos)
        
        ja_processados = len(todos_arquivos) - len(arquivos_pendentes)
        if ja_processados > 0:
            self.logger.info(f"♻️  RETOMANDO: {ja_processados} arquivos já processados")
            self.logger.info(f"📋 Faltam: {len(arquivos_pendentes)} arquivos\n")
        
        if not arquivos_pendentes:
            self.logger.info(f"✅ {tipo} já completamente importado!")
            return
        
        # 3. Processar apenas os arquivos pendentes
        for idx, arquivo in enumerate(arquivos_pendentes, 1):
            arquivo_nome = Path(arquivo).name
            self.logger.info(f"\n📁 [{idx}/{len(arquivos_pendentes)}] {arquivo_nome}")
            
            try:
                # Marcar início do checkpoint
                iniciar_checkpoint(self.versao, tipo, arquivo_nome)
                
                # Criar tabela temporária (se não existir)
                temp_table = self.criar_tabela_temp(tipo)
                
                # Processar arquivo
                linhas = self.extrair_e_copiar(arquivo, temp_table, estrutura)
                
                # MERGE direto para produção (por arquivo!)
                self.logger.info(f"  🔄 Fazendo MERGE de {linhas:,} registros...")
                self.merge_arquivo_to_production(temp_table, estrutura, linhas)
                
                # COMMIT após cada arquivo!
                self.conn.commit()
                
                # Finalizar checkpoint (sucesso)
                finalizar_checkpoint(self.versao, tipo, arquivo_nome, linhas)
                
                # Limpar temp table para próximo arquivo
                self.cursor.execute(f"TRUNCATE TABLE {temp_table}")
                
                self.logger.info(f"  ✅ {arquivo_nome} concluído e commitado")
                
            except Exception as e:
                # Registrar erro no checkpoint
                erro_checkpoint(self.versao, tipo, arquivo_nome, str(e))
                self.logger.error(f"  ❌ Erro em {arquivo_nome}: {e}")
                raise
        
        # 4. Limpar tabela temporária final
        temp_table = f"public.temp_{tipo.lower()}"
        self.cursor.execute(f"DROP TABLE IF EXISTS {temp_table}")
        self.conn.commit()
        self.logger.info(f"\n🗑️  Tabela temporária removida: {temp_table}")
        
        duracao = time.time() - inicio
        self.logger.info(f"⏱️  Tempo para {tipo}: {duracao/60:.1f} minutos")
        
    def importar_auxiliar(self, nome: str):
        """Importa arquivo auxiliar (único arquivo)"""
        tabela, colunas = AUXILIARES[nome]
        arquivo = DATA_DIR / f"{nome}.zip"
        
        if not arquivo.exists():
            self.logger.warning(f"⚠️  Arquivo não encontrado: {arquivo}")
            return
            
        self.logger.info(f"\n📋 Importando auxiliar: {nome} → {tabela}")
        
        # Limpar tabela (CASCADE para foreign keys)
        self.cursor.execute(f"TRUNCATE TABLE {tabela} CASCADE")
        
        with zipfile.ZipFile(arquivo, 'r') as zf:
            csv_name = zf.namelist()[0]
            with zf.open(csv_name) as csv_file:
                # Decodificar e criar StringIO
                content = csv_file.read().decode('latin1')
                text_file = io.StringIO(content)
                
                copy_sql = f"""
                COPY {tabela} ({', '.join(colunas)})
                FROM STDIN
                WITH (FORMAT CSV, DELIMITER ';', NULL '', ENCODING 'UTF8')
                """
                
                self.cursor.copy_expert(copy_sql, text_file)
                linhas = self.cursor.rowcount
                self.conn.commit()
                self.logger.info(f"  ✅ {nome}: {linhas:,} registros")
                
    def registrar_importacao(self):
        """Registra importação no log"""
        sql = """
        INSERT INTO cnpj_brasil.import_log (versao_importacao, data_importacao, status)
        VALUES (%s, CURRENT_TIMESTAMP, 'COMPLETO')
        """
        self.cursor.execute(sql, (self.versao,))
        self.conn.commit()
        
    def executar_importacao_completa(self):
        """Executa importação completa de todos os dados COM CHECKPOINTS"""
        inicio_geral = time.time()
        
        try:
            self.conectar()
            
            # 0. Criar tabela de checkpoints
            self.logger.info("\n🔧 Verificando sistema de checkpoints...")
            criar_tabela_checkpoint()
            
            # 1. Remover Foreign Keys para performance
            self.drop_foreign_keys()
            
            # 2. Importar tabelas auxiliares
            self.logger.info("\n" + "="*80)
            self.logger.info("FASE 1: TABELAS AUXILIARES")
            self.logger.info("="*80)
            
            for nome in AUXILIARES.keys():
                self.importar_auxiliar(nome)
                
            # 3. Importar tabelas principais (COM CHECKPOINTS POR ARQUIVO)
            self.logger.info("\n" + "="*80)
            self.logger.info("FASE 2: TABELAS PRINCIPAIS (COM CHECKPOINTS)")
            self.logger.info("="*80)
            
            for tipo in ['Empresas', 'Estabelecimentos', 'Simples', 'Socios']:
                self.importar_tipo(tipo)
                
            # 4. Recriar Foreign Keys
            self.recreate_foreign_keys()
                
            # 5. Registrar importação
            self.registrar_importacao()
            
            # 6. Estatísticas finais
            self.exibir_estatisticas()
            
            duracao_total = time.time() - inicio_geral
            self.logger.info(f"\n{'='*80}")
            self.logger.info(f"🎉 IMPORTAÇÃO COMPLETA!")
            self.logger.info(f"⏱️  Tempo total: {duracao_total/3600:.1f} horas")
            self.logger.info(f"📅 Versão: {self.versao}")
            self.logger.info(f"{'='*80}\n")
            
        except Exception as e:
            self.logger.error(f"\n❌ ERRO CRÍTICO: {e}")
            if self.conn:
                self.conn.rollback()
            raise
        finally:
            self.desconectar()
            
    def exibir_estatisticas(self):
        """Exibe estatísticas da importação"""
        self.logger.info("\n" + "="*80)
        self.logger.info("ESTATÍSTICAS DA IMPORTAÇÃO")
        self.logger.info("="*80 + "\n")
        
        tabelas = [
            'cnpj_brasil.empresas',
            'cnpj_brasil.estabelecimentos',
            'cnpj_brasil.simples_nacional',
            'cnpj_brasil.socios'
        ]
        
        for tabela in tabelas:
            self.cursor.execute(f"SELECT COUNT(*) FROM {tabela} WHERE versao_importacao = %s", (self.versao,))
            count = self.cursor.fetchone()[0]
            nome = tabela.split('.')[-1]
            self.logger.info(f"  {nome:20s}: {count:>15,} registros")


def main():
    global DATA_DIR  # Declarar no início da função
    
    if len(sys.argv) < 2:
        print("Uso: python import_cnpj.py <versao> [--auto] [--data-dir <caminho>]")
        print("Exemplo: python import_cnpj.py 2025-12")
        print("         python import_cnpj.py 2025-12 --auto  (sem confirmação)")
        print("         python import_cnpj.py 2025-12 --auto --data-dir /Volumes/ExtMB/BaseCNPJ/jan2026")
        sys.exit(1)
        
    versao = sys.argv[1]
    auto_mode = '--auto' in sys.argv
    
    # Verificar se --data-dir foi passado
    data_dir = DATA_DIR  # Padrão
    if '--data-dir' in sys.argv:
        idx = sys.argv.index('--data-dir')
        if idx + 1 < len(sys.argv):
            data_dir = Path(sys.argv[idx + 1])
        else:
            print("❌ Erro: --data-dir requer um caminho")
            sys.exit(1)
    
    print(f"""
╔═══════════════════════════════════════════════════════════════════╗
║       IMPORTAÇÃO CNPJ - RECEITA FEDERAL - BRASIL                 ║
║                                                                   ║
║  Versão: {versao:53s}║
║  Data Dir: {str(data_dir):53s}║
║  Arquitetura: TEMP UNLOGGED + MERGE (sem duplicação)            ║
╚═══════════════════════════════════════════════════════════════════╝
""")
    
    if not auto_mode:
        resposta = input("\n⚠️  Iniciar importação? (s/n): ")
        if resposta.lower() != 's':
            print("Importação cancelada.")
            sys.exit(0)
    else:
        print("\n✅ Modo automático ativado - iniciando importação...\n")
    
    # Atualizar DATA_DIR globalmente
    DATA_DIR = data_dir
        
    importador = ImportadorCNPJ(versao)
    importador.executar_importacao_completa()


if __name__ == "__main__":
    main()
