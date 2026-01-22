#!/usr/bin/env python3
"""
Script principal para importação da Base CNPJ Brasil
Processa ~60 milhões de CNPJs da Receita Federal

Execução:
    python app/scripts/import_cnpj.py [--skip-auxiliares] [--skip-cleanup]

Flags:
    --skip-auxiliares: Pula importação de tabelas auxiliares
    --skip-cleanup: Não remove arquivos .zip após importação
    --only-auxiliares: Importa apenas tabelas auxiliares
    --test-mode: Processa apenas 1000 linhas de cada arquivo (teste)
"""

import sys
import os
import argparse
import logging
import logging.config
from pathlib import Path
from typing import List, Dict, Any
import time
from datetime import datetime
import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_values

# Adicionar diretório do app ao path para imports funcionarem
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Importar configurações e utilitários
from app.scripts.import_config import (
    CNPJ_DATA_DIR,
    LOG_FILE,
    LOGGING_CONFIG,
    TABELAS_AUXILIARES,
    EMPRESAS_PATTERN,
    ESTABELECIMENTOS_PATTERN,
    SOCIOS_PATTERN,
    SIMPLES_FILE,
    EMPRESAS_COLUMNS,
    ESTABELECIMENTOS_COLUMNS,
    SOCIOS_COLUMNS,
    SIMPLES_COLUMNS,
    BATCH_SIZE,
    COMMIT_FREQUENCY,
    count_available_files,
    PG_OPTIMIZATION_SETTINGS,
    SCHEMA_PRINCIPAL,
    SCHEMA_OUTRAS_SITUACOES,
)

from app.scripts.import_utils import (
    read_zip_file_stream,
    parse_csv_line,
    safe_date_conversion,
    safe_decimal_conversion,
    safe_string,
    get_schema_for_situacao,
    is_cnpj_ativo,
    validate_cnpj_basico,
    chunk_iterator,
    ImportStats,
    remove_zip_file_safely,
    parse_cnaes_secundarios
)

# Importar conexão do banco
from app.core.database import engine

# Configurar logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger('cnpj_import')


# ============================================
# CONEXÃO E OTIMIZAÇÃO DO BANCO
# ============================================

def get_db_connection():
    """Obtém conexão raw do PostgreSQL"""
    connection_string = str(engine.url)
    # Converter SQLAlchemy URL para psycopg2
    conn = psycopg2.connect(
        host=engine.url.host or 'localhost',
        port=engine.url.port or 5432,
        database=engine.url.database,
        user=engine.url.username,
        password=engine.url.password
    )
    conn.autocommit = False
    return conn


def optimize_database_for_import(conn):
    """Aplica configurações de otimização para importação em massa"""
    logger.info("Aplicando otimizações temporárias no PostgreSQL...")
    
    cursor = conn.cursor()
    has_error = False
    
    for setting, value in PG_OPTIMIZATION_SETTINGS.items():
        try:
            cursor.execute(sql.SQL("SET {} = %s").format(sql.Identifier(setting)), [value])
            logger.debug(f"  {setting} = {value}")
        except Exception as e:
            logger.warning(f"Não foi possível definir {setting}: {e}")
            has_error = True
    
    # Se houve erro, fazer rollback e tentar novamente sem as configurações problemáticas
    if has_error:
        conn.rollback()
        logger.info("Tentando aplicar apenas configurações compatíveis...")
        cursor = conn.cursor()
        # Aplicar apenas configurações que geralmente funcionam
        safe_settings = {
            'maintenance_work_mem': '2GB',
            'work_mem': '256MB'
        }
        for setting, value in safe_settings.items():
            try:
                cursor.execute(sql.SQL("SET {} = %s").format(sql.Identifier(setting)), [value])
                logger.debug(f"  {setting} = {value}")
            except Exception as e:
                logger.warning(f"Não foi possível definir {setting}: {e}")
        conn.commit()
    else:
        conn.commit()
    
    logger.info("Otimizações aplicadas com sucesso")


# ============================================
# IMPORTAÇÃO DE TABELAS AUXILIARES
# ============================================

def import_tabelas_auxiliares(conn):
    """Importa tabelas auxiliares (CNAEs, Municípios, etc)"""
    logger.info("\n" + "="*80)
    logger.info("FASE 2: IMPORTAÇÃO DE TABELAS AUXILIARES")
    logger.info("="*80 + "\n")
    
    for nome_tabela, config in TABELAS_AUXILIARES.items():
        zip_path = CNPJ_DATA_DIR / config['arquivo']
        
        if not zip_path.exists():
            logger.warning(f"Arquivo não encontrado: {zip_path}")
            continue
        
        logger.info(f"Importando {nome_tabela} de {config['arquivo']}...")
        stats = ImportStats(config['arquivo'])
        
        try:
            cursor = conn.cursor()
            
            # Limpar tabela antes de importar
            delete_query = sql.SQL("DELETE FROM {}.{}").format(
                sql.Identifier(config['schema']),
                sql.Identifier(config['tabela'])
            )
            cursor.execute(delete_query)
            
            # Processar arquivo
            batch = []
            for line in read_zip_file_stream(str(zip_path)):
                if not line:
                    continue
                
                row = parse_csv_line(line, len(config['colunas']))
                batch.append(tuple(row))
                
                if len(batch) >= BATCH_SIZE:
                    # Bulk insert
                    insert_query = sql.SQL("INSERT INTO {}.{} ({}) VALUES %s").format(
                        sql.Identifier(config['schema']),
                        sql.Identifier(config['tabela']),
                        sql.SQL(', ').join(map(sql.Identifier, config['colunas']))
                    )
                    execute_values(cursor, insert_query, batch)
                    stats.total_processados += len(batch)
                    batch = []
            
            # Inserir últimos registros
            if batch:
                insert_query = sql.SQL("INSERT INTO {}.{} ({}) VALUES %s").format(
                    sql.Identifier(config['schema']),
                    sql.Identifier(config['tabela']),
                    sql.SQL(', ').join(map(sql.Identifier, config['colunas']))
                )
                execute_values(cursor, insert_query, batch)
                stats.total_processados += len(batch)
            
            conn.commit()
            stats.log_final()
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao importar {nome_tabela}: {e}", exc_info=True)
            raise


# ============================================
# IMPORTAÇÃO DE EMPRESAS
# ============================================

def process_empresas_row(row: List[str]) -> Dict[str, Any]:
    """Processa uma linha de Empresas"""
    return {
        'cnpj_basico': row[0],
        'razao_social': safe_string(row[1], 200),
        'natureza_juridica': safe_string(row[2], 4),
        'qualificacao_responsavel': safe_string(row[3], 2),
        'capital_social': safe_decimal_conversion(row[4]),
        'porte_empresa': safe_string(row[5], 2),
        'ente_federativo_responsavel': safe_string(row[6], 100)
    }


def import_empresas(conn, test_mode=False):
    """Importa arquivos de Empresas"""
    logger.info("\n" + "="*80)
    logger.info("FASE 3: IMPORTAÇÃO DE EMPRESAS")
    logger.info("="*80 + "\n")
    
    # Arquivos de empresas
    empresas_files = sorted(CNPJ_DATA_DIR.glob(EMPRESAS_PATTERN))
    
    if not empresas_files:
        logger.error("Nenhum arquivo de Empresas encontrado!")
        return
    
    logger.info(f"Encontrados {len(empresas_files)} arquivos de Empresas")
    
    # Inserir todas as empresas no schema cnpj_brasil
    # A separação para outras situações será feita na fase final
    
    for zip_path in empresas_files:
        logger.info(f"\nProcessando: {zip_path.name}")
        stats = ImportStats(zip_path.name)
        
        try:
            cursor = conn.cursor()
            batch = []
            line_num = 0
            
            for line in read_zip_file_stream(str(zip_path)):
                line_num += 1
                
                if test_mode and line_num > 1000:
                    break
                
                if not line:
                    continue
                
                try:
                    row = parse_csv_line(line, len(EMPRESAS_COLUMNS))
                    data = process_empresas_row(row)
                    
                    # Validar CNPJ básico
                    if not validate_cnpj_basico(data['cnpj_basico']):
                        stats.registrar_erro(line_num, "CNPJ básico inválido")
                        continue
                    
                    # Inserir no schema principal
                    batch.append((
                        data['cnpj_basico'],
                        data['razao_social'],
                        data['natureza_juridica'],
                        data['qualificacao_responsavel'],
                        data['capital_social'],
                        data['porte_empresa'],
                        data['ente_federativo_responsavel']
                    ))
                    
                    stats.registrar_processado(is_ativo=False)
                    
                    # Bulk insert em batches
                    if len(batch) >= BATCH_SIZE:
                        try:
                            insert_query = sql.SQL(
                                "INSERT INTO {}.empresas ({}) VALUES %s ON CONFLICT (cnpj_basico) DO NOTHING"
                            ).format(
                                sql.Identifier(SCHEMA_PRINCIPAL),
                                sql.SQL(', ').join(map(sql.Identifier, EMPRESAS_COLUMNS))
                            )
                            execute_values(cursor, insert_query, batch)
                            batch = []
                        except Exception as batch_error:
                            conn.rollback()
                            logger.error(f"Erro no batch insert empresas (linha ~{line_num}): {batch_error}")
                            batch = []
                            stats.registrar_erro(line_num, f"Batch insert failed: {batch_error}")
                        
                        # Commit periódico
                        if stats.total_processados % COMMIT_FREQUENCY == 0:
                            try:
                                conn.commit()
                            except Exception as commit_error:
                                conn.rollback()
                                logger.error(f"Erro no commit empresas (linha ~{line_num}): {commit_error}")
                    
                    stats.log_progresso()
                    
                except Exception as e:
                    stats.registrar_erro(line_num, str(e))
                    continue
            
            # Inserir últimos registros
            if batch:
                try:
                    insert_query = sql.SQL(
                        "INSERT INTO {}.empresas ({}) VALUES %s ON CONFLICT (cnpj_basico) DO NOTHING"
                    ).format(
                        sql.Identifier(SCHEMA_PRINCIPAL),
                        sql.SQL(', ').join(map(sql.Identifier, EMPRESAS_COLUMNS))
                    )
                    execute_values(cursor, insert_query, batch)
                except Exception as final_batch_error:
                    conn.rollback()
                    logger.error(f"Erro no batch final empresas: {final_batch_error}")
            
            try:
                conn.commit()
                stats.log_final()
            except Exception as final_commit_error:
                conn.rollback()
                logger.error(f"Erro no commit final empresas: {final_commit_error}")
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao processar {zip_path.name}: {e}", exc_info=True)
            raise


# ============================================
# IMPORTAÇÃO DE ESTABELECIMENTOS
# ============================================

def process_estabelecimento_row(row: List[str]) -> Dict[str, Any]:
    """Processa uma linha de Estabelecimentos"""
    return {
        'cnpj_basico': row[0],
        'cnpj_ordem': row[1],
        'cnpj_dv': row[2],
        'identificador_matriz_filial': safe_string(row[3], 1),
        'nome_fantasia': safe_string(row[4], 200),
        'situacao_cadastral': safe_string(row[5], 2),
        'data_situacao_cadastral': safe_date_conversion(row[6]),
        'motivo_situacao_cadastral': safe_string(row[7], 2),
        'nome_cidade_exterior': safe_string(row[8], 100),
        'pais': safe_string(row[9], 3),
        'data_inicio_atividade': safe_date_conversion(row[10]),
        'cnae_fiscal_principal': safe_string(row[11], 7),
        'cnae_fiscal_secundaria': parse_cnaes_secundarios(row[12]),
        'tipo_logradouro': safe_string(row[13], 50),
        'logradouro': safe_string(row[14], 200),
        'numero': safe_string(row[15], 20),
        'complemento': safe_string(row[16], 200),
        'bairro': safe_string(row[17], 100),
        'cep': safe_string(row[18], 8),
        'uf': safe_string(row[19], 2),
        'municipio': safe_string(row[20], 4),
        'ddd_1': safe_string(row[21], 4),
        'telefone_1': safe_string(row[22], 20),
        'ddd_2': safe_string(row[23], 4),
        'telefone_2': safe_string(row[24], 20),
        'ddd_fax': safe_string(row[25], 4),
        'fax': safe_string(row[26], 20),
        'email': safe_string(row[27], 200),
        'situacao_especial': safe_string(row[28], 100),
        'data_situacao_especial': safe_date_conversion(row[29])
    }


def import_estabelecimentos(conn, test_mode=False):
    """Importa arquivos de Estabelecimentos"""
    logger.info("\n" + "="*80)
    logger.info("FASE 4: IMPORTAÇÃO DE ESTABELECIMENTOS")
    logger.info("="*80 + "\n")
    
    estabelecimentos_files = sorted(CNPJ_DATA_DIR.glob(ESTABELECIMENTOS_PATTERN))
    
    if not estabelecimentos_files:
        logger.error("Nenhum arquivo de Estabelecimentos encontrado!")
        return
    
    logger.info(f"Encontrados {len(estabelecimentos_files)} arquivos de Estabelecimentos")
    
    for zip_path in estabelecimentos_files:
        logger.info(f"\nProcessando: {zip_path.name}")
        stats = ImportStats(zip_path.name)
        
        try:
            cursor = conn.cursor()
            # Inserir todos os estabelecimentos no schema cnpj_brasil
            # A separação para outras situações será feita na fase final
            batch = []
            line_num = 0
            
            for line in read_zip_file_stream(str(zip_path)):
                line_num += 1
                
                if test_mode and line_num > 1000:
                    break
                
                if not line:
                    continue
                
                try:
                    row = parse_csv_line(line, len(ESTABELECIMENTOS_COLUMNS))
                    data = process_estabelecimento_row(row)
                    
                    # Validar CNPJ
                    if not validate_cnpj_basico(data['cnpj_basico']):
                        stats.registrar_erro(line_num, "CNPJ básico inválido")
                        continue
                    
                    # Preparar tupla para insert
                    values = tuple(data[col] for col in ESTABELECIMENTOS_COLUMNS)
                    
                    # Rastrear se é ativo para estatísticas
                    is_ativo = is_cnpj_ativo(data['situacao_cadastral'] or '')
                    stats.registrar_processado(is_ativo=is_ativo)
                    
                    # Inserir no schema principal
                    batch.append(values)
                    
                    # Bulk insert quando atingir tamanho do batch
                    if len(batch) >= BATCH_SIZE:
                        logger.debug(f"Inserindo batch de {len(batch)} estabelecimentos...")
                        try:
                            insert_query = sql.SQL(
                                "INSERT INTO {}.estabelecimentos ({}) VALUES %s ON CONFLICT (cnpj_basico, cnpj_ordem, cnpj_dv) DO NOTHING"
                            ).format(
                                sql.Identifier(SCHEMA_PRINCIPAL),
                                sql.SQL(', ').join(map(sql.Identifier, ESTABELECIMENTOS_COLUMNS))
                            )
                            execute_values(cursor, insert_query, batch)
                            logger.debug(f"Batch inserido com sucesso")
                            batch = []
                        except Exception as e:
                            logger.error(f"Erro ao inserir batch: {e}")
                            conn.rollback()
                            raise
                    
                    # Commit periódico
                    if stats.total_processados % COMMIT_FREQUENCY == 0:
                        try:
                            logger.debug(f"Fazendo commit em {stats.total_processados} registros...")
                            conn.commit()
                            logger.debug("Commit realizado com sucesso")
                        except Exception as commit_error:
                            conn.rollback()
                            logger.error(f"Erro no commit estabelecimentos (linha ~{line_num}): {commit_error}")
                    
                    stats.log_progresso()
                    
                except Exception as e:
                    stats.registrar_erro(line_num, str(e))
                    continue
            
            # Inserir registros restantes
            if batch:
                try:
                    insert_query = sql.SQL(
                        "INSERT INTO {}.estabelecimentos ({}) VALUES %s ON CONFLICT (cnpj_basico, cnpj_ordem, cnpj_dv) DO NOTHING"
                    ).format(
                        sql.Identifier(SCHEMA_PRINCIPAL),
                        sql.SQL(', ').join(map(sql.Identifier, ESTABELECIMENTOS_COLUMNS))
                    )
                    execute_values(cursor, insert_query, batch)
                except Exception as final_batch_error:
                    conn.rollback()
                    logger.error(f"Erro no batch final estabelecimentos: {final_batch_error}")
            
            try:
                conn.commit()
                stats.log_final()
            except Exception as final_commit_error:
                conn.rollback()
                logger.error(f"Erro no commit final estabelecimentos: {final_commit_error}")
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao processar {zip_path.name}: {e}", exc_info=True)
            raise


# ============================================
# AJUSTE DE EMPRESAS (REMOVIDO - não mais necessário)
# ============================================
# Com a nova arquitetura de schema único (cnpj_brasil), 
# todas as empresas ficam no mesmo local.
# A separação para cnpj_outras_situacoes será feita na fase final,
# após toda a importação estar completa.

# def adjust_empresas_schemas(conn):
#     """FUNÇÃO DESABILITADA - não mais necessária com schema único"""
#     logger.info("\n" + "="*80)
#     logger.info("FASE 5: PULADA - Schema único em uso")
#     logger.info("="*80 + "\n")
#     pass


# ============================================
# IMPORTAÇÃO DE SÓCIOS
# ============================================

def process_socio_row(row: List[str]) -> Dict[str, Any]:
    """Processa uma linha de Sócios"""
    return {
        'cnpj_basico': row[0],
        'identificador_socio': safe_string(row[1], 1),
        'nome_socio': safe_string(row[2], 200),
        'cnpj_cpf_socio': safe_string(row[3], 14),  # Corrigido: banco usa cnpj_cpf_socio
        'qualificacao_socio': safe_string(row[4], 2),
        'data_entrada_sociedade': safe_date_conversion(row[5]),
        'pais': safe_string(row[6], 3),
        'representante_legal': safe_string(row[7], 14),
        'nome_representante': safe_string(row[8], 200),
        'qualificacao_representante': safe_string(row[9], 2),
        'faixa_etaria': safe_string(row[10], 1)
    }


def import_socios(conn, test_mode=False):
    """Importa arquivos de Sócios"""
    logger.info("\n" + "="*80)
    logger.info("FASE 6: IMPORTAÇÃO DE SÓCIOS")
    logger.info("="*80 + "\n")
    
    socios_files = sorted(CNPJ_DATA_DIR.glob(SOCIOS_PATTERN))
    
    if not socios_files:
        logger.warning("Nenhum arquivo de Sócios encontrado")
        return
    
    logger.info(f"Encontrados {len(socios_files)} arquivos de Sócios")
    
    # Não precisamos mais de cache - todos vão para o mesmo schema
    
    for zip_path in socios_files:
        logger.info(f"\nProcessando: {zip_path.name}")
        stats = ImportStats(zip_path.name)
        
        try:
            cursor = conn.cursor()
            batch = []
            line_num = 0
            
            for line in read_zip_file_stream(str(zip_path)):
                line_num += 1
                
                if test_mode and line_num > 1000:
                    break
                
                if not line:
                    continue
                
                try:
                    row = parse_csv_line(line, len(SOCIOS_COLUMNS))
                    data = process_socio_row(row)
                    
                    values = tuple(data[col] for col in SOCIOS_COLUMNS)
                    
                    # Rastrear ativo para estatísticas (baseado em situacao_cadastral se disponível)
                    is_ativo = False  # Sócios não tem campo direto, assume false para stats
                    stats.registrar_processado(is_ativo=is_ativo)
                    
                    batch.append(values)
                    
                    # Bulk insert
                    if len(batch) >= BATCH_SIZE:
                        try:
                            insert_query = sql.SQL(
                                "INSERT INTO {}.socios ({}) VALUES %s ON CONFLICT DO NOTHING"
                            ).format(
                                sql.Identifier(SCHEMA_PRINCIPAL),
                                sql.SQL(', ').join(map(sql.Identifier, SOCIOS_COLUMNS))
                            )
                            execute_values(cursor, insert_query, batch)
                            batch = []
                        except Exception as batch_error:
                            conn.rollback()
                            logger.error(f"Erro no batch insert sócios (linha ~{line_num}): {batch_error}")
                            batch = []
                            stats.registrar_erro(line_num, f"Batch insert failed: {batch_error}")
                    
                    if stats.total_processados % COMMIT_FREQUENCY == 0:
                        try:
                            conn.commit()
                        except Exception as commit_error:
                            conn.rollback()
                            logger.error(f"Erro no commit sócios (linha ~{line_num}): {commit_error}")
                    
                    stats.log_progresso()
                    
                except Exception as e:
                    stats.registrar_erro(line_num, str(e))
                    continue
            
            # Inserir restantes
            if batch:
                try:
                    insert_query = sql.SQL(
                        "INSERT INTO {}.socios ({}) VALUES %s ON CONFLICT DO NOTHING"
                    ).format(
                        sql.Identifier(SCHEMA_PRINCIPAL),
                        sql.SQL(', ').join(map(sql.Identifier, SOCIOS_COLUMNS))
                    )
                    execute_values(cursor, insert_query, batch)
                except Exception as final_batch_error:
                    conn.rollback()
                    logger.error(f"Erro no batch final sócios: {final_batch_error}")
            
            try:
                conn.commit()
                stats.log_final()
            except Exception as final_commit_error:
                conn.rollback()
                logger.error(f"Erro no commit final sócios: {final_commit_error}")
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao processar {zip_path.name}: {e}", exc_info=True)
            raise


# ============================================
# IMPORTAÇÃO SIMPLES NACIONAL
# ============================================

def process_simples_row(row: List[str]) -> Dict[str, Any]:
    """Processa uma linha de Simples Nacional"""
    return {
        'cnpj_basico': row[0],
        'opcao_simples': safe_string(row[1], 1),
        'data_opcao_simples': safe_date_conversion(row[2]),
        'data_exclusao_simples': safe_date_conversion(row[3]),
        'opcao_mei': safe_string(row[4], 1),
        'data_opcao_mei': safe_date_conversion(row[5]),
        'data_exclusao_mei': safe_date_conversion(row[6])
    }


def import_simples_nacional(conn, test_mode=False):
    """Importa arquivo do Simples Nacional"""
    logger.info("\n" + "="*80)
    logger.info("FASE 7: IMPORTAÇÃO SIMPLES NACIONAL")
    logger.info("="*80 + "\n")
    
    zip_path = CNPJ_DATA_DIR / SIMPLES_FILE
    
    if not zip_path.exists():
        logger.warning(f"Arquivo não encontrado: {SIMPLES_FILE}")
        return
    
    logger.info(f"Processando: {SIMPLES_FILE}")
    stats = ImportStats(SIMPLES_FILE)
    
    # Não precisamos mais de cache - todos vão para o mesmo schema
    
    try:
        cursor = conn.cursor()
        batch = []
        line_num = 0
        
        for line in read_zip_file_stream(str(zip_path)):
            line_num += 1
            
            if test_mode and line_num > 1000:
                break
            
            if not line:
                continue
            
            try:
                row = parse_csv_line(line, len(SIMPLES_COLUMNS))
                data = process_simples_row(row)
                
                values = tuple(data[col] for col in SIMPLES_COLUMNS)
                
                is_ativo = False  # Assume false para estatísticas
                stats.registrar_processado(is_ativo=is_ativo)
                
                batch.append(values)
                
                # Bulk insert
                if len(batch) >= BATCH_SIZE:
                    try:
                        insert_query = sql.SQL(
                            "INSERT INTO {}.simples_nacional ({}) VALUES %s ON CONFLICT (cnpj_basico) DO NOTHING"
                        ).format(
                            sql.Identifier(SCHEMA_PRINCIPAL),
                            sql.SQL(', ').join(map(sql.Identifier, SIMPLES_COLUMNS))
                        )
                        execute_values(cursor, insert_query, batch)
                        batch = []
                    except Exception as batch_error:
                        conn.rollback()
                        logger.error(f"Erro no batch insert (linha ~{line_num}): {batch_error}")
                        batch = []
                        stats.registrar_erro(line_num, f"Batch insert failed: {batch_error}")
                
                if stats.total_processados % COMMIT_FREQUENCY == 0:
                    try:
                        conn.commit()
                    except Exception as commit_error:
                        conn.rollback()
                        logger.error(f"Erro no commit (linha ~{line_num}): {commit_error}")
                
                stats.log_progresso()
                
            except Exception as e:
                stats.registrar_erro(line_num, str(e))
                continue
        
        # Inserir restantes
        if batch:
            try:
                insert_query = sql.SQL(
                    "INSERT INTO {}.simples_nacional ({}) VALUES %s ON CONFLICT (cnpj_basico) DO NOTHING"
                ).format(
                    sql.Identifier(SCHEMA_PRINCIPAL),
                    sql.SQL(', ').join(map(sql.Identifier, SIMPLES_COLUMNS))
                )
                execute_values(cursor, insert_query, batch)
            except Exception as final_batch_error:
                conn.rollback()
                logger.error(f"Erro no batch final: {final_batch_error}")
        
        try:
            conn.commit()
            stats.log_final()
        except Exception as final_commit_error:
            conn.rollback()
            logger.error(f"Erro no commit final: {final_commit_error}")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Erro ao processar {SIMPLES_FILE}: {e}", exc_info=True)
        raise


# ============================================
# OTIMIZAÇÕES PÓS-IMPORTAÇÃO
# ============================================

def run_post_import_optimizations(conn):
    """Executa VACUUM ANALYZE e coleta estatísticas"""
    logger.info("\n" + "="*80)
    logger.info("FASE 8: OTIMIZAÇÕES PÓS-IMPORTAÇÃO")
    logger.info("="*80 + "\n")
    
    cursor = conn.cursor()
    
    tabelas = [
        (SCHEMA_PRINCIPAL, 'empresas'),
        (SCHEMA_PRINCIPAL, 'estabelecimentos'),
        (SCHEMA_PRINCIPAL, 'socios'),
        (SCHEMA_PRINCIPAL, 'simples_nacional'),
    ]
    
    # VACUUM ANALYZE precisa de autocommit
    old_autocommit = conn.autocommit
    conn.autocommit = True
    
    for schema, tabela in tabelas:
        logger.info(f"VACUUM ANALYZE {schema}.{tabela}...")
        try:
            cursor.execute(sql.SQL("VACUUM ANALYZE {}.{}").format(
                sql.Identifier(schema),
                sql.Identifier(tabela)
            ))
            logger.info(f"  ✓ Concluído")
        except Exception as e:
            logger.warning(f"  ⚠ Erro: {e}")
    
    conn.autocommit = old_autocommit
    logger.info("\nOtimizações concluídas!\n")


# ============================================
# RELATÓRIO FINAL
# ============================================

def generate_final_report(conn):
    """Gera relatório final com estatísticas"""
    logger.info("\n" + "="*80)
    logger.info("RELATÓRIO FINAL DE IMPORTAÇÃO")
    logger.info("="*80 + "\n")
    
    cursor = conn.cursor()
    
    # Contar registros no schema principal
    logger.info(f"\nSchema: {SCHEMA_PRINCIPAL}")
    logger.info("-" * 40)
    
    for tabela in ['empresas', 'estabelecimentos', 'socios', 'simples_nacional']:
        try:
            cursor.execute(sql.SQL("SELECT COUNT(*) FROM {}.{}").format(
                sql.Identifier(SCHEMA_PRINCIPAL),
                sql.Identifier(tabela)
            ))
            count = cursor.fetchone()[0]
            logger.info(f"  {tabela:20s}: {count:>15,}")
        except Exception as e:
            logger.warning(f"  {tabela:20s}: Erro ao contar - {e}")
    
    # Espaço em disco
    logger.info("\n" + "-" * 40)
    logger.info("Espaço em Disco:")
    logger.info("-" * 40)
    
    cursor.execute("""
        SELECT 
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables
        WHERE schemaname = %s
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    """, (SCHEMA_PRINCIPAL,))
    
    for row in cursor.fetchall():
        logger.info(f"  {row[0]}.{row[1]:20s}: {row[2]:>10s}")
    
    logger.info("\n" + "="*80 + "\n")


# ============================================
# LIMPEZA DE ARQUIVOS
# ============================================

def cleanup_zip_files(confirm=True):
    """
    Remove arquivos .zip após importação bem-sucedida
    
    Args:
        confirm: Se True, solicita confirmação antes de remover
    """
    logger.info("\n" + "="*80)
    logger.info("LIMPEZA DE ARQUIVOS .ZIP")
    logger.info("="*80 + "\n")
    
    zip_files = list(CNPJ_DATA_DIR.glob("*.zip"))
    
    if not zip_files:
        logger.info("Nenhum arquivo .zip encontrado para remover.\n")
        return
    
    total_size = sum(f.stat().st_size for f in zip_files)
    
    logger.warning(f"⚠️  ATENÇÃO: {len(zip_files)} arquivo(s) .zip serão removidos!")
    logger.warning(f"⚠️  Espaço total: {total_size / (1024**3):.2f} GB")
    logger.warning("⚠️  Esta ação NÃO pode ser desfeita!\n")
    
    if confirm:
        logger.info("Para remover os arquivos, execute novamente com a flag: --confirm-cleanup")
        logger.info("Limpeza cancelada por segurança.\n")
        return
    
    total_removed = 0
    total_size_freed = 0
    
    for zip_file in zip_files:
        size = zip_file.stat().st_size
        if remove_zip_file_safely(str(zip_file)):
            total_removed += 1
            total_size_freed += size
    
    logger.info(f"\n✓ Arquivos removidos: {total_removed}")
    logger.info(f"✓ Espaço liberado: {total_size_freed / (1024**3):.2f} GB\n")


# ============================================
# FUNÇÃO PRINCIPAL
# ============================================

def main():
    """Função principal de execução"""
    parser = argparse.ArgumentParser(description='Importação Base CNPJ Brasil')
    parser.add_argument('--skip-auxiliares', action='store_true', help='Pula tabelas auxiliares')
    parser.add_argument('--skip-empresas', action='store_true', help='Pula importação de empresas')
    parser.add_argument('--skip-estabelecimentos', action='store_true', help='Pula importação de estabelecimentos')
    parser.add_argument('--skip-cleanup', action='store_true', help='Não remove arquivos .zip')
    parser.add_argument('--confirm-cleanup', action='store_true', help='Confirma remoção dos arquivos .zip')
    parser.add_argument('--only-auxiliares', action='store_true', help='Importa apenas tabelas auxiliares')
    parser.add_argument('--test-mode', action='store_true', help='Modo teste (apenas 1000 linhas)')
    
    args = parser.parse_args()
    
    logger.info("="*80)
    logger.info("IMPORTAÇÃO BASE CNPJ BRASIL")
    logger.info("="*80)
    logger.info(f"Início: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"Modo teste: {'SIM' if args.test_mode else 'NÃO'}")
    logger.info(f"Log: {LOG_FILE}")
    logger.info("="*80 + "\n")
    
    # Verificar arquivos disponíveis
    counts = count_available_files()
    logger.info("Arquivos disponíveis:")
    for tipo, count in counts.items():
        logger.info(f"  {tipo:20s}: {count}")
    logger.info("")
    
    start_time = time.time()
    
    try:
        # Conectar ao banco
        conn = get_db_connection()
        logger.info("✓ Conexão com PostgreSQL estabelecida\n")
        
        # Otimizar banco
        optimize_database_for_import(conn)
        
        # Executar fases
        if not args.skip_auxiliares:
            import_tabelas_auxiliares(conn)
        
        if args.only_auxiliares:
            logger.info("Apenas tabelas auxiliares importadas (--only-auxiliares)")
        else:
            if not args.skip_empresas:
                import_empresas(conn, test_mode=args.test_mode)
            else:
                logger.info("\n==> FASE 3 PULADA: Empresas (--skip-empresas)")
            
            if not args.skip_estabelecimentos:
                import_estabelecimentos(conn, test_mode=args.test_mode)
            else:
                logger.info("\n==> FASE 4 PULADA: Estabelecimentos (--skip-estabelecimentos)")
            
            # Fase 5: REMOVIDA - adjust_empresas_schemas() não mais necessária com schema único
            
            import_socios(conn, test_mode=args.test_mode)
            import_simples_nacional(conn, test_mode=args.test_mode)
            run_post_import_optimizations(conn)
        
        # Relatório final
        generate_final_report(conn)
        
        # Limpeza - AGORA COM CONFIRMAÇÃO OBRIGATÓRIA
        if not args.skip_cleanup and not args.test_mode:
            # Só remove se --confirm-cleanup for explicitamente passado
            cleanup_zip_files(confirm=not args.confirm_cleanup)
        
        # Fechar conexão
        conn.close()
        
        # Tempo total
        duration = time.time() - start_time
        logger.info("="*80)
        logger.info(f"IMPORTAÇÃO CONCLUÍDA COM SUCESSO!")
        logger.info(f"Tempo total: {duration:.2f}s ({duration/60:.2f} minutos)")
        logger.info(f"Término: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info("="*80)
        
        return 0
        
    except Exception as e:
        logger.error("\n" + "="*80)
        logger.error("ERRO DURANTE IMPORTAÇÃO")
        logger.error("="*80)
        logger.error(str(e), exc_info=True)
        logger.error("="*80 + "\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())
