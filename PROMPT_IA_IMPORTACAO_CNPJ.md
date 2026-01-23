# 🤖 PROMPT PARA IA - Sistema de Importação CNPJ Receita Federal

> **Objetivo**: Criar sistema completo de importação e atualização mensal de dados CNPJ da Receita Federal do Brasil com foco em performance, resiliência e manutenibilidade.

---

## 📋 CONTEXTO DO PROJETO

### Infraestrutura Disponível

**PostgreSQL**:
- Versão: 17.7 (Homebrew)
- Localização: SSD Externo Samsung T7 (`/Volumes/ExtMB/postgresql/data/`)
- Banco: `basecerta` (vazio, sem tabelas)
- Usuários disponíveis:
  - `code4us` (superuser, sem senha)
  - `aian_db` (owner, sem senha)
  - `dev4us` (app, senha: `P@lm315@s`)

**Hardware**:
- MacBook Air M2/M3
- RAM: **16GB total** (⚠️ LIMITAÇÃO CRÍTICA)
- Sistema + apps: ~13-15GB em uso
- **Disponível para importação: ~3-4GB máximo**

**Arquivos Fonte**:
- Localização: `/Volumes/ExtMB/BaseCNPJ/dez2025/`
- Formato: Arquivos ZIP da Receita Federal
- Tipos: Empresas (10 files), Estabelecimentos (~20 files), Sócios (~10 files), Auxiliares
- Total: ~7GB compactados, ~300GB+ descompactados
- Metadata: `backup_importacao_old/receitafederal/cnpj-metadados.pdf`

**Referências Disponíveis**:
- Schemas anteriores: `backup_importacao_old/migrations/002_create_cnpj_structure.py`
- SQL direto: `backup_importacao_old/create_database_schema.sql`
- Scripts de importação (com problemas de RAM): `backup_importacao_old/import_cnpj.py`

---

## 🎯 REQUISITOS DO SISTEMA

### 1️⃣ ANÁLISE E COMPREENSÃO DOS DADOS

#### 1.1 Estudar Metadados da Receita Federal

**Tarefa**: Ler e interpretar `backup_importacao_old/receitafederal/cnpj-metadados.pdf`

**Objetivo**:
- Entender estrutura de CADA arquivo (Empresas, Estabelecimentos, Sócios, etc.)
- Identificar campos obrigatórios vs opcionais
- Mapear tipos de dados (texto, número, data, código)
- Compreender relacionamentos (CNPJ básico x CNPJ completo)
- Entender encoding (provavelmente ISO-8859-1 ou UTF-8)
- Identificar separadores (`;` ou outro)

**Resultado esperado**: Documento markdown com:
```markdown
# Estrutura dos Arquivos CNPJ

## Empresas
- Arquivo: Empresas*.zip
- Campos: cnpj_basico (8 dígitos), razão_social, natureza_jurídica, ...
- Tipos: TEXT, INTEGER, DATE, ...
- Chave primária: cnpj_basico
- Relacionamentos: 1:N com estabelecimentos e sócios

## Estabelecimentos
- Arquivo: Estabelecimentos*.zip
- Campos: cnpj_basico, cnpj_ordem, cnpj_dv, ...
- Chave primária: (cnpj_basico, cnpj_ordem, cnpj_dv)
...
```

#### 1.2 Análise de Arquivos ZIP

**Tarefa**: Criar script Python para:

```python
# análise_arquivos_rfb.py
# Objetivos:
# 1. Listar todos os ZIPs em /Volumes/ExtMB/BaseCNPJ/dez2025/
# 2. Para CADA ZIP:
#    - Extrair PRIMEIRO arquivo (sample)
#    - Ler primeiras 100 linhas
#    - Identificar cabeçalho (se existir)
#    - Detectar separador (;, |, tab)
#    - Contar colunas
#    - Detectar encoding
#    - Identificar tipos de dados por coluna (sample de 1000 linhas)
#    - Detectar valores vazios/null (0, "", "00000000", etc.)
# 3. Gerar relatório JSON com metadados de cada arquivo
```

**Resultado esperado**: 
- `metadados_arquivos_rfb.json` com estrutura completa
- Script reutilizável para novas versões mensais

---

### 2️⃣ DESIGN DO SCHEMA DO BANCO DE DADOS

#### 2.1 Criação de Schema Otimizado

**Requisitos**:

1. **Schema separado**: `cnpj_brasil` (não use `public`)

2. **Nomenclatura inteligente**:
   - Tabelas: `cnpj_brasil.empresas`, `cnpj_brasil.estabelecimentos`, `cnpj_brasil.socios`
   - Colunas: snake_case, nomes descritivos (`razao_social`, não `rs`)
   - Evitar abreviações confusas

3. **Tipos de dados otimizados para VELOCIDADE**:
   ```sql
   -- ❌ EVITAR (lento em importações massivas):
   - VARCHAR(n) com constraints complexos
   - NUMERIC com alta precisão desnecessária
   - JSON para campos simples
   
   -- ✅ PREFERIR (rápido):
   - TEXT para strings (sem limite, mais rápido que VARCHAR)
   - BIGINT para números grandes (CNPJ, CPF)
   - INTEGER para códigos pequenos
   - DATE para datas (não TIMESTAMP se não precisar hora)
   - CHAR(n) para campos fixos (UF, DV)
   ```

4. **Chaves primárias**:
   ```sql
   -- Empresas
   PRIMARY KEY (cnpj_basico)
   
   -- Estabelecimentos (CNPJ completo = 14 dígitos)
   PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv)
   -- Ou criar coluna calculada cnpj_completo
   
   -- Sócios
   PRIMARY KEY (cnpj_basico, identificador_socio, tipo_socio)
   ```

5. **Foreign Keys**: 
   - ⚠️ **NÃO CRIAR durante importação** (muito lento)
   - Criar DEPOIS da importação completa
   - Documentar relacionamentos em comentários

#### 2.2 Estratégia de Índices

**CRÍTICO**: Índices impactam velocidade de importação vs queries

**Estratégia recomendada**:

```sql
-- FASE 1: Durante importação (apenas PK)
CREATE TABLE cnpj_brasil.empresas (
    cnpj_basico BIGINT PRIMARY KEY,  -- Único índice durante import
    razao_social TEXT,
    ...
);

-- FASE 2: Após importação completa (índices de busca)
CREATE INDEX CONCURRENTLY idx_empresas_razao_social 
    ON cnpj_brasil.empresas USING gin(to_tsvector('portuguese', razao_social));

CREATE INDEX CONCURRENTLY idx_estabelecimentos_uf_municipio 
    ON cnpj_brasil.estabelecimentos(uf, municipio);

CREATE INDEX CONCURRENTLY idx_estabelecimentos_cnae_principal 
    ON cnpj_brasil.estabelecimentos(cnae_fiscal_principal);

-- Índices compostos para queries comuns
CREATE INDEX CONCURRENTLY idx_estabelecimentos_situacao_uf 
    ON cnpj_brasil.estabelecimentos(situacao_cadastral, uf) 
    WHERE situacao_cadastral = '02';  -- Apenas ativos
```

**Tarefa**: Analisar queries do frontend (em `frontend/src/`) e criar índices específicos

---

### 3️⃣ TRATAMENTO INTELIGENTE DE DADOS

#### 3.1 Normalização de Valores Vazios/Nulos

**Problema**: Receita Federal usa múltiplas representações de "vazio":
- `0` para datas inválidas
- `00000000` para CNAEs vazios
- `""` (string vazia)
- `;` (campo ausente entre separadores)
- `"00"` para códigos inválidos

**Solução**: Criar funções de normalização

```python
# data_cleaner.py

def normalizar_data(valor: str) -> Optional[str]:
    """
    Converte datas da RFB para formato PostgreSQL ou NULL
    
    Entradas vazias/inválidas:
    - '0', '00000000', '', None → NULL
    
    Formato RFB: YYYYMMDD → YYYY-MM-DD
    Valida se data é real (não aceita 2025-02-30)
    """
    if not valor or valor in ('0', '00000000', ''):
        return None
    
    try:
        ano = int(valor[:4])
        mes = int(valor[4:6])
        dia = int(valor[6:8])
        
        # Validar data
        datetime(ano, mes, dia)
        return f"{ano:04d}-{mes:02d}-{dia:02d}"
    except:
        return None

def normalizar_codigo(valor: str, tamanho_esperado: int) -> Optional[str]:
    """
    Normaliza códigos (CNAE, Natureza Jurídica, etc)
    
    Códigos inválidos: '0', '00', '0000000' → NULL
    Códigos válidos: padroniza com zeros à esquerda
    """
    if not valor or valor == '0' * len(valor):
        return None
    return valor.zfill(tamanho_esperado)

def normalizar_texto(valor: str) -> Optional[str]:
    """
    Limpa e normaliza textos
    
    - Remove espaços extras
    - Converte para uppercase (padrão RFB)
    - '' → NULL
    """
    if not valor or not valor.strip():
        return None
    return ' '.join(valor.strip().upper().split())
```

#### 3.2 Validações por Tipo de Dado

```python
# Criar classe validadora para cada tipo de tabela
class EmpresaValidator:
    @staticmethod
    def validar_linha(campos: List[str]) -> Dict[str, Any]:
        """
        Valida e converte linha de Empresas
        
        Retorna dict pronto para INSERT
        Lança exceção se dados críticos inválidos
        """
        return {
            'cnpj_basico': int(campos[0]),  # Obrigatório
            'razao_social': normalizar_texto(campos[1]),
            'natureza_juridica': normalizar_codigo(campos[2], 4),
            'qualificacao_responsavel': normalizar_codigo(campos[3], 2),
            'capital_social': Decimal(campos[4].replace(',', '.')) if campos[4] else None,
            'porte_empresa': normalizar_codigo(campos[5], 2),
            'ente_federativo': normalizar_texto(campos[6]),
        }
```

---

### 4️⃣ SISTEMA DE IMPORTAÇÃO COM CHUNKS E CHECKPOINTS

#### 4.1 Arquitetura de Importação

**Problema identificado**: Importação de 4.5M registros em MERGE causa OOM (Out of Memory)

**Solução**: Importação em chunks de 100k-500k registros

```python
# import_manager.py

class ImportadorCNPJ:
    """
    Gerenciador de importação com chunks e checkpoints
    """
    
    CHUNK_SIZE = 100_000  # Ajustar conforme testes de memória
    
    def importar_arquivo(self, zip_path: Path, tabela: str):
        """
        Importa arquivo ZIP em chunks com checkpoint
        
        Estratégia:
        1. Extrair ZIP em stream (não descompactar tudo)
        2. Processar em chunks de CHUNK_SIZE linhas
        3. COPY para tabela temporária
        4. UPSERT (INSERT ... ON CONFLICT) da temp para prod
        5. COMMIT após cada chunk
        6. Salvar checkpoint
        7. TRUNCATE temp table
        8. Próximo chunk
        """
        
        checkpoint_id = self.iniciar_checkpoint(zip_path, tabela)
        linhas_processadas = self.recuperar_posicao_checkpoint(checkpoint_id)
        
        with zipfile.ZipFile(zip_path) as zf:
            with zf.open(zf.namelist()[0]) as arquivo:
                # Stream processing
                for chunk in self.ler_em_chunks(arquivo, linhas_processadas):
                    try:
                        self.processar_chunk(chunk, tabela)
                        linhas_processadas += len(chunk)
                        self.atualizar_checkpoint(checkpoint_id, linhas_processadas)
                    except Exception as e:
                        self.marcar_erro_checkpoint(checkpoint_id, str(e))
                        raise
        
        self.finalizar_checkpoint(checkpoint_id)
    
    def processar_chunk(self, linhas: List[str], tabela: str):
        """
        Processa chunk de linhas
        
        1. Valida e normaliza dados
        2. COPY para temp table
        3. UPSERT para tabela final
        4. COMMIT
        """
        dados_validados = [
            self.validar_linha(linha, tabela) 
            for linha in linhas
        ]
        
        # Tabela temporária (recriada a cada chunk)
        temp_table = f"temp_{tabela}_{os.getpid()}"
        self.criar_temp_table(temp_table, tabela)
        
        # COPY (mais rápido que INSERT múltiplo)
        with self.conn.cursor() as cur:
            # Criar StringIO com dados
            buffer = self.criar_copy_buffer(dados_validados)
            cur.copy_expert(
                f"COPY {temp_table} FROM STDIN WITH CSV",
                buffer
            )
        
        # UPSERT
        self.upsert_from_temp(temp_table, tabela)
        
        # COMMIT
        self.conn.commit()
```

#### 4.2 Tabela de Checkpoints

```sql
CREATE TABLE cnpj_brasil.importacao_controle (
    id SERIAL PRIMARY KEY,
    versao_mes VARCHAR(7) NOT NULL,  -- '2025-12', '2026-01'
    tipo_importacao VARCHAR(20) NOT NULL,  -- 'full', 'incremental'
    tabela VARCHAR(50) NOT NULL,
    arquivo VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,  -- 'processando', 'concluido', 'erro'
    
    -- Progresso
    total_linhas BIGINT,
    linhas_processadas BIGINT DEFAULT 0,
    linhas_inseridas BIGINT DEFAULT 0,
    linhas_atualizadas BIGINT DEFAULT 0,
    linhas_erro BIGINT DEFAULT 0,
    
    -- Timestamps
    data_inicio TIMESTAMP DEFAULT NOW(),
    data_fim TIMESTAMP,
    tempo_decorrido INTERVAL GENERATED ALWAYS AS (data_fim - data_inicio) STORED,
    
    -- Velocidade
    velocidade_linhas_seg INTEGER,  -- Linhas por segundo
    
    -- Erro
    erro_mensagem TEXT,
    erro_linha BIGINT,
    
    -- Metadados
    tamanho_arquivo_mb NUMERIC(10,2),
    hash_arquivo VARCHAR(64),  -- SHA256 para detectar mudanças
    
    UNIQUE(versao_mes, tabela, arquivo)
);

-- Índices
CREATE INDEX idx_importacao_controle_versao ON cnpj_brasil.importacao_controle(versao_mes);
CREATE INDEX idx_importacao_controle_status ON cnpj_brasil.importacao_controle(status);
```

#### 4.3 Proteção Contra Duplicação

```python
def verificar_duplicacao(self, versao_mes: str, arquivo: str) -> bool:
    """
    Verifica se arquivo já foi importado
    
    Estratégias:
    1. Consultar tabela importacao_controle
    2. Comparar hash SHA256 do arquivo
    3. Se hash diferente, permitir reimport (arquivo atualizado)
    """
    cur = self.conn.cursor()
    cur.execute("""
        SELECT status, hash_arquivo 
        FROM cnpj_brasil.importacao_controle
        WHERE versao_mes = %s AND arquivo = %s AND status = 'concluido'
    """, (versao_mes, arquivo))
    
    resultado = cur.fetchone()
    if not resultado:
        return False  # Nunca importado
    
    hash_atual = self.calcular_hash_arquivo(arquivo)
    hash_registrado = resultado[1]
    
    if hash_atual == hash_registrado:
        print(f"⚠️  Arquivo {arquivo} já importado (hash idêntico)")
        return True
    else:
        print(f"🔄 Arquivo {arquivo} mudou (hash diferente), reimportando...")
        return False
```

---

### 5️⃣ PAINEL DE ACOMPANHAMENTO

#### 5.1 Dashboard em Tempo Real

**Requisito**: Script Python com interface visual (TUI ou Web)

**Opções**:
1. **TUI (Terminal)**: Rich, Textual (recomendado para simplicidade)
2. **Web**: Flask/FastAPI com WebSockets

**Funcionalidades**:

```python
# dashboard.py usando Rich

from rich.console import Console
from rich.table import Table
from rich.live import Live
from rich.progress import Progress, BarColumn, TextColumn, TimeRemainingColumn

class DashboardImportacao:
    def __init__(self):
        self.console = Console()
    
    def exibir_progresso_geral(self):
        """
        Exibe progresso de TODOS os arquivos
        
        ┌─ Importação CNPJ - Dezembro/2025 ───────────────────┐
        │ Status Geral: Processando                           │
        │ Início: 23/01/2026 10:15:32                         │
        │ Tempo decorrido: 2h 35m 18s                         │
        │                                                      │
        │ Tabela         Arquivo          Progresso   Status  │
        │ ──────────────────────────────────────────────────  │
        │ empresas       Empresas0.zip    ████████  80%  ✓    │
        │ empresas       Empresas1.zip    ██░░░░░░  25%  ⟳    │
        │ estabelecim... Estabelec0.zip   ░░░░░░░░   0%  ⏸    │
        │                                                      │
        │ Total: 125.3M linhas | Velocidade: 15.2k/s          │
        └──────────────────────────────────────────────────────┘
        """
        pass
    
    def exibir_detalhes_arquivo(self, arquivo: str):
        """
        Detalhes de arquivo específico
        
        ┌─ Empresas1.zip ──────────────────────────────────────┐
        │ Linhas: 1.250.000 / 5.000.000 (25%)                  │
        │ ████████░░░░░░░░░░░░░░░░░░░░                         │
        │                                                       │
        │ Inseridas: 1.125.340                                 │
        │ Atualizadas: 124.660                                 │
        │ Erros: 0                                             │
        │                                                       │
        │ Velocidade: 18.500 linhas/seg                        │
        │ Tempo restante: ~3h 25min                            │
        │                                                       │
        │ Último checkpoint: 23/01 12:45:32 (30 seg atrás)     │
        └───────────────────────────────────────────────────────┘
        """
        pass
```

#### 5.2 Logs Estruturados

```python
# logger_config.py

import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Formata logs em JSON para análise posterior"""
    
    def format(self, record):
        log_obj = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Adicionar extras se existirem
        if hasattr(record, 'arquivo'):
            log_obj['arquivo'] = record.arquivo
        if hasattr(record, 'linhas_processadas'):
            log_obj['linhas_processadas'] = record.linhas_processadas
        
        return json.dumps(log_obj, ensure_ascii=False)

# Configurar logger
logger = logging.getLogger('importacao_cnpj')
handler = logging.FileHandler('/Volumes/ExtMB/postgresql/logs/import_2025_12.jsonl')
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Uso
logger.info(
    'Chunk processado com sucesso',
    extra={
        'arquivo': 'Empresas0.zip',
        'linhas_processadas': 100000,
        'tempo_chunk_segundos': 45.2
    }
)
```

---

### 6️⃣ INTERFACE DE USUÁRIO (UI)

#### 6.1 Script CLI Interativo

**Requisito**: Script fácil de usar para especificar mês e localização

```python
# import_ui.py

import questionary
from pathlib import Path

class ImportacaoUI:
    def iniciar(self):
        """UI interativa para configurar importação"""
        
        print("╔═══════════════════════════════════════════╗")
        print("║  Sistema de Importação CNPJ - RFB         ║")
        print("╚═══════════════════════════════════════════╝")
        print()
        
        # 1. Tipo de importação
        tipo = questionary.select(
            "Tipo de importação:",
            choices=[
                "🆕 Importação Full (primeira vez ou reprocessamento completo)",
                "🔄 Importação Incremental (atualização mensal)"
            ]
        ).ask()
        
        tipo_importacao = 'full' if '🆕' in tipo else 'incremental'
        
        # 2. Versão/Mês
        versao_mes = questionary.text(
            "Versão/Mês (formato YYYY-MM):",
            default="2025-12",
            validate=lambda x: len(x) == 7 and '-' in x
        ).ask()
        
        # 3. Diretório dos arquivos
        diretorio_padrao = f"/Volumes/ExtMB/BaseCNPJ/{versao_mes.replace('-', '')}/"
        diretorio = questionary.path(
            "Diretório com arquivos ZIP:",
            default=diretorio_padrao,
            only_directories=True
        ).ask()
        
        # 4. Validar arquivos
        arquivos = self.validar_arquivos(diretorio)
        print(f"\n✓ {len(arquivos)} arquivos encontrados")
        
        # 5. Configurações avançadas
        if questionary.confirm("Configurar opções avançadas?").ask():
            chunk_size = questionary.text(
                "Tamanho do chunk (linhas):",
                default="100000"
            ).ask()
            
            criar_indices = questionary.confirm(
                "Criar índices após importação?",
                default=True
            ).ask()
        else:
            chunk_size = 100000
            criar_indices = True
        
        # 6. Confirmação
        print("\n" + "="*50)
        print("RESUMO DA IMPORTAÇÃO:")
        print(f"  Tipo: {tipo_importacao}")
        print(f"  Versão: {versao_mes}")
        print(f"  Diretório: {diretorio}")
        print(f"  Arquivos: {len(arquivos)}")
        print(f"  Chunk size: {chunk_size:,}")
        print(f"  Criar índices: {'Sim' if criar_indices else 'Não'}")
        print("="*50)
        
        if questionary.confirm("Iniciar importação?").ask():
            self.executar_importacao(
                tipo=tipo_importacao,
                versao=versao_mes,
                diretorio=diretorio,
                chunk_size=int(chunk_size),
                criar_indices=criar_indices
            )
        else:
            print("❌ Importação cancelada")
```

---

### 7️⃣ ESTRATÉGIA DE ATUALIZAÇÃO MENSAL (INCREMENTAL)

#### 7.1 Análise de Mudanças

**Conceito**: Após primeira importação full, meses seguintes são incrementais

**O que muda mensalmente na RFB**:
1. **Empresas novas**: Novos CNPJs abertos
2. **Empresas alteradas**: Mudança de razão social, capital, etc.
3. **Estabelecimentos novos**: Novas filiais
4. **Estabelecimentos alterados**: Mudança de endereço, situação cadastral
5. **Sócios novos/alterados**: Entrada/saída de sócios
6. **Baixas**: Empresas/estabelecimentos encerrados

**Estratégia**:

```python
class ImportadorIncremental:
    """
    Importador inteligente que identifica mudanças
    """
    
    def importar_incremental(self, versao_nova: str, versao_anterior: str):
        """
        Compara versão nova com versão anterior
        
        Tabelas de comparação:
        - cnpj_brasil.empresas_202512
        - cnpj_brasil.empresas_202601
        
        Ou usar colunas:
        - versao_primeira_importacao
        - versao_ultima_atualizacao
        - data_ultima_atualizacao
        """
        
        # 1. Importar versão nova para staging
        self.importar_para_staging(versao_nova)
        
        # 2. Identificar mudanças
        mudancas = self.identificar_mudancas(versao_nova, versao_anterior)
        
        # 3. Registrar em tabela de auditoria
        self.registrar_mudancas(mudancas)
        
        # 4. Aplicar mudanças na tabela principal
        self.aplicar_mudancas(mudancas)
    
    def identificar_mudancas(self, nova: str, antiga: str):
        """
        Identifica diferenças entre versões
        
        SQL:
        -- Novos registros
        SELECT * FROM staging WHERE cnpj_basico NOT IN (SELECT cnpj_basico FROM producao)
        
        -- Alterados (hash de todos campos)
        SELECT s.* FROM staging s
        JOIN producao p ON s.cnpj_basico = p.cnpj_basico
        WHERE md5(s.*::text) != md5(p.*::text)
        
        -- Removidos (não vieram na nova versão)
        SELECT * FROM producao WHERE cnpj_basico NOT IN (SELECT cnpj_basico FROM staging)
        """
        pass
```

#### 7.2 Tabela de Auditoria Mensal

```sql
CREATE TABLE cnpj_brasil.auditoria_mudancas_mensais (
    id BIGSERIAL PRIMARY KEY,
    versao_mes VARCHAR(7) NOT NULL,
    tabela VARCHAR(50) NOT NULL,
    tipo_mudanca VARCHAR(20) NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'
    
    -- Identificadores
    cnpj_basico BIGINT,
    cnpj_completo VARCHAR(14),
    
    -- Dados da mudança
    campos_alterados JSONB,  -- {"razao_social": {"de": "ABC", "para": "XYZ"}}
    
    -- Metadados
    data_mudanca TIMESTAMP DEFAULT NOW(),
    hash_antes VARCHAR(64),
    hash_depois VARCHAR(64),
    
    -- Índices
    INDEX idx_auditoria_versao (versao_mes),
    INDEX idx_auditoria_cnpj (cnpj_basico),
    INDEX idx_auditoria_tipo (tipo_mudanca)
);

-- Resumo mensal otimizado
CREATE MATERIALIZED VIEW cnpj_brasil.resumo_mudancas_mensais AS
SELECT 
    versao_mes,
    tabela,
    tipo_mudanca,
    COUNT(*) as total_mudancas,
    COUNT(DISTINCT cnpj_basico) as cnpjs_afetados
FROM cnpj_brasil.auditoria_mudancas_mensais
GROUP BY versao_mes, tabela, tipo_mudanca
WITH DATA;

CREATE UNIQUE INDEX ON cnpj_brasil.resumo_mudancas_mensais(versao_mes, tabela, tipo_mudanca);

-- Atualizar materialized view mensalmente
REFRESH MATERIALIZED VIEW CONCURRENTLY cnpj_brasil.resumo_mudancas_mensais;
```

#### 7.3 Estratégia de Versionamento

**Opção 1: Particionamento por Mês** (Recomendado)

```sql
-- Tabela particionada
CREATE TABLE cnpj_brasil.empresas (
    cnpj_basico BIGINT,
    razao_social TEXT,
    ...
    versao_mes VARCHAR(7) NOT NULL,
    data_atualizacao DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (cnpj_basico, versao_mes)
) PARTITION BY LIST (versao_mes);

-- Partições mensais
CREATE TABLE cnpj_brasil.empresas_202512 PARTITION OF cnpj_brasil.empresas
    FOR VALUES IN ('2025-12');

CREATE TABLE cnpj_brasil.empresas_202601 PARTITION OF cnpj_brasil.empresas
    FOR VALUES IN ('2026-01');

-- View com dados mais recentes
CREATE VIEW cnpj_brasil.v_empresas_atual AS
SELECT DISTINCT ON (cnpj_basico) *
FROM cnpj_brasil.empresas
ORDER BY cnpj_basico, versao_mes DESC;
```

**Opção 2: Colunas de Versionamento** (Mais simples)

```sql
CREATE TABLE cnpj_brasil.empresas (
    cnpj_basico BIGINT PRIMARY KEY,
    razao_social TEXT,
    ...
    versao_primeira_importacao VARCHAR(7) NOT NULL,  -- Quando entrou na base
    versao_ultima_atualizacao VARCHAR(7) NOT NULL,   -- Última vez que mudou
    data_ultima_atualizacao TIMESTAMP DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE  -- FALSE se não veio na última versão (baixa)
);
```

---

### 8️⃣ OTIMIZAÇÕES DE PERFORMANCE

#### 8.1 Configurações PostgreSQL para Importação

```python
def configurar_postgres_para_importacao(conn):
    """
    Aplica configurações temporárias para maximizar velocidade
    
    ⚠️ REVERTE após importação
    """
    with conn.cursor() as cur:
        # Desabilitar autovacuum durante importação
        cur.execute("ALTER TABLE cnpj_brasil.empresas SET (autovacuum_enabled = false)")
        
        # Aumentar checkpoint_timeout (evitar checkpoints frequentes)
        cur.execute("SET checkpoint_timeout = '30min'")
        
        # Aumentar shared_buffers temporariamente (se possível)
        # Já está em 1536MB no postgresql.auto.conf
        
        # Desabilitar synchronous_commit (mais rápido, menos seguro)
        cur.execute("SET synchronous_commit = OFF")
        
        # Aumentar work_mem para COPY
        cur.execute("SET work_mem = '256MB'")
        
        # Aumentar maintenance_work_mem para índices
        cur.execute("SET maintenance_work_mem = '1GB'")
    
    conn.commit()

def restaurar_configuracoes_postgres(conn):
    """Reverte configurações após importação"""
    with conn.cursor() as cur:
        cur.execute("ALTER TABLE cnpj_brasil.empresas SET (autovacuum_enabled = true)")
        cur.execute("RESET checkpoint_timeout")
        cur.execute("SET synchronous_commit = ON")
        cur.execute("RESET work_mem")
        cur.execute("RESET maintenance_work_mem")
    
    conn.commit()
    
    # Executar VACUUM ANALYZE
    with conn.cursor() as cur:
        cur.execute("VACUUM ANALYZE cnpj_brasil.empresas")
```

#### 8.2 Uso de COPY ao invés de INSERT

```python
def usar_copy_otimizado(conn, dados: List[Dict], tabela: str):
    """
    COPY é 10-100x mais rápido que INSERT múltiplo
    """
    from io import StringIO
    
    # Criar buffer CSV
    buffer = StringIO()
    writer = csv.DictWriter(buffer, fieldnames=dados[0].keys())
    writer.writerows(dados)
    buffer.seek(0)
    
    # COPY direto
    with conn.cursor() as cur:
        cur.copy_expert(
            f"""
            COPY {tabela} ({','.join(dados[0].keys())})
            FROM STDIN WITH (FORMAT CSV, HEADER FALSE)
            """,
            buffer
        )
    
    conn.commit()
```

---

### 9️⃣ VALIDAÇÕES E COMPLETUDE

#### Checklist de Implementação

**Você esqueceu de mencionar (incluir também)**:

1. **Testes unitários**: Criar testes para validadores de dados
2. **Testes de integração**: Testar importação com arquivo sample
3. **Documentação**: README com instruções de uso
4. **Monitoramento de memória**: Alert se RAM > 90%
5. **Backup automático**: Snapshot antes de importação incremental
6. **Rollback**: Estratégia para reverter importação com erro
7. **Notificações**: Email/Telegram quando importação concluir
8. **Métricas**: Prometheus/Grafana para monitoramento longo prazo
9. **Logs de erro detalhados**: Salvar linhas com erro em arquivo separado
10. **Comparação pós-importação**: Validar totais com dados RFB oficiais

#### 9.1 Sistema de Rollback

```sql
-- Tabela de snapshots
CREATE TABLE cnpj_brasil.importacao_snapshots (
    id SERIAL PRIMARY KEY,
    versao_mes VARCHAR(7) NOT NULL,
    data_snapshot TIMESTAMP DEFAULT NOW(),
    
    -- Contadores antes da importação
    total_empresas BIGINT,
    total_estabelecimentos BIGINT,
    total_socios BIGINT,
    
    -- Hash do banco (para validação)
    hash_empresas VARCHAR(64),
    hash_estabelecimentos VARCHAR(64),
    
    -- Backup location
    backup_path TEXT
);

-- Função de rollback
CREATE FUNCTION cnpj_brasil.rollback_importacao(p_versao VARCHAR(7)) 
RETURNS VOID AS $$
BEGIN
    -- Deletar dados da versão
    DELETE FROM cnpj_brasil.empresas WHERE versao_mes = p_versao;
    DELETE FROM cnpj_brasil.estabelecimentos WHERE versao_mes = p_versao;
    DELETE FROM cnpj_brasil.socios WHERE versao_mes = p_versao;
    
    -- Marcar checkpoint como 'revertido'
    UPDATE cnpj_brasil.importacao_controle
    SET status = 'revertido'
    WHERE versao_mes = p_versao;
    
    -- Log
    INSERT INTO cnpj_brasil.auditoria_mudancas_mensais (versao_mes, tabela, tipo_mudanca)
    VALUES (p_versao, 'TODAS', 'ROLLBACK');
END;
$$ LANGUAGE plpgsql;
```

#### 9.2 Validação Pós-Importação

```python
def validar_importacao(conn, versao_mes: str):
    """
    Valida importação comparando com totais oficiais da RFB
    """
    validacoes = {
        'empresas': {
            'total_esperado': 50_000_000,  # Consultar site RFB
            'tolerancia_pct': 1.0  # 1% de diferença aceitável
        },
        'estabelecimentos': {
            'total_esperado': 65_000_000,
            'tolerancia_pct': 1.0
        }
    }
    
    erros = []
    
    for tabela, config in validacoes.items():
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM cnpj_brasil.{tabela} WHERE versao_mes = %s", (versao_mes,))
        total_importado = cur.fetchone()[0]
        
        diferenca_pct = abs(total_importado - config['total_esperado']) / config['total_esperado'] * 100
        
        if diferenca_pct > config['tolerancia_pct']:
            erros.append(
                f"❌ {tabela}: esperado ~{config['total_esperado']:,}, "
                f"importado {total_importado:,} (diferença {diferenca_pct:.2f}%)"
            )
        else:
            print(f"✓ {tabela}: {total_importado:,} registros (OK)")
    
    if erros:
        print("\n⚠️  VALIDAÇÃO FALHOU:")
        for erro in erros:
            print(erro)
        return False
    
    return True
```

---

## 📦 ENTREGÁVEIS ESPERADOS

### Scripts Python

1. **`analise_metadados.py`**
   - Lê `cnpj-metadados.pdf`
   - Gera `estrutura_arquivos_rfb.md`

2. **`analise_arquivos.py`**
   - Analisa ZIPs em `/Volumes/ExtMB/BaseCNPJ/dez2025/`
   - Gera `metadados_arquivos_rfb.json`

3. **`criar_schema.py`**
   - Cria schemas PostgreSQL otimizados
   - SQL em `migrations/001_create_cnpj_schema.sql`

4. **`data_cleaner.py`**
   - Funções de normalização de dados
   - Validadores por tipo de tabela

5. **`import_manager.py`**
   - Classe `ImportadorCNPJ` com chunks e checkpoints
   - Métodos de importação full e incremental

6. **`import_ui.py`**
   - Interface CLI interativa (questionary)
   - Configuração de importações

7. **`dashboard.py`**
   - Painel de acompanhamento (Rich)
   - Exibição de progresso em tempo real

8. **`validador.py`**
   - Validações pós-importação
   - Comparação com totais RFB

9. **`main.py`**
   - Orquestrador principal
   - Integra todos os módulos

### Arquivos SQL

1. **`001_create_schema.sql`**
   - Schema `cnpj_brasil`
   - Tabelas principais

2. **`002_create_indexes.sql`**
   - Índices otimizados
   - Executar APÓS importação

3. **`003_create_views.sql`**
   - Views úteis (dados atuais, estatísticas)

4. **`004_create_functions.sql`**
   - Funções auxiliares (rollback, validações)

### Documentação

1. **`README.md`**
   - Instruções de uso
   - Requisitos e instalação

2. **`ARQUITETURA.md`**
   - Decisões técnicas
   - Diagramas

3. **`TROUBLESHOOTING.md`**
   - Problemas comuns
   - Soluções

---

## 🎯 CRITÉRIOS DE SUCESSO

1. ✅ **Performance**: Importação de 300GB+ em menos de 24 horas
2. ✅ **Resiliência**: Recuperação automática de erros (checkpoints)
3. ✅ **Precisão**: 99.9%+ dos dados importados corretamente
4. ✅ **Memória**: Consumo máximo 3-4GB (não exceder 16GB total do sistema)
5. ✅ **Manutenibilidade**: Código limpo, documentado, testado
6. ✅ **Usabilidade**: UI simples para usuário não-técnico
7. ✅ **Auditoria**: Rastreabilidade completa de mudanças mensais
8. ✅ **Escalabilidade**: Suporta crescimento de 10%+ ao ano nos dados RFB

---

## 🚨 RESTRIÇÕES E CUIDADOS

1. **RAM Limitada**: NUNCA processar mais de 500k linhas por vez
2. **SSD Externo**: SEMPRE verificar se `/Volumes/ExtMB` está montado
3. **Não criar FK durante import**: Criar apenas após importação completa
4. **Não criar índices durante import**: Apenas PRIMARY KEY
5. **Usar COPY, não INSERT**: 10-100x mais rápido
6. **Commitar após cada chunk**: Evitar transações gigantes
7. **Logs estruturados**: JSON para análise posterior
8. **Validar encoding**: RFB usa ISO-8859-1 ou UTF-8

---

## 📚 REFERÊNCIAS

- **Metadados RFB**: `backup_importacao_old/receitafederal/cnpj-metadados.pdf`
- **Schema anterior**: `backup_importacao_old/migrations/002_create_cnpj_structure.py`
- **Configurações PostgreSQL**: `ACESSO_POSTGRESQL.md`
- **Arquivos fonte**: `/Volumes/ExtMB/BaseCNPJ/dez2025/`

---

## 🤝 EXPECTATIVAS

Crie um sistema **robusto, eficiente e manutenível** que:
- Seja executado mensalmente sem intervenção
- Documente claramente todas as mudanças
- Permita auditoria completa
- Seja fácil de debugar quando houver problemas
- Escale conforme crescimento dos dados da RFB

**Foco em**: Performance, Resiliência e Simplicidade de Uso.

Boa sorte! 🚀
