"""
Configurações para importação da base CNPJ Brasil
"""
import os
from pathlib import Path

# =======================
# CAMINHOS
# =======================

# Diretório base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Diretório onde estão os arquivos .zip do CNPJ
# Verificar se estamos rodando no Docker ou localmente
if os.path.exists('/app') and os.path.exists('/docs'):
    # Rodando no Docker - usar caminho montado
    CNPJ_DATA_DIR = Path('/docs/baseCNPJ')
else:
    # Rodando localmente
    CNPJ_DATA_DIR = BASE_DIR.parent / "docs" / "baseCNPJ"

# Diretório para logs
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "import_cnpj.log"

# =======================
# PARÂMETROS DE PERFORMANCE
# =======================

# Tamanho do batch para processamento em memória
# REDUZIDO para 1000 para evitar OOM (Out of Memory) com 16GB RAM
# Estabelecimentos tem ~60M registros com dados grandes (nome fantasia, endereço, etc)
BATCH_SIZE = 1000

# Quantos registros processar antes de fazer commit
# REDUZIDO para 25k para evitar transações muito longas que consomem RAM
COMMIT_FREQUENCY = 25000

# Encoding dos arquivos da Receita Federal
SOURCE_ENCODING = 'iso-8859-1'  # ou 'latin1'
TARGET_ENCODING = 'utf-8'

# =======================
# MAPEAMENTO DE ARQUIVOS
# =======================

# Tabelas auxiliares
TABELAS_AUXILIARES = {
    'cnaes': {
        'arquivo': 'Cnaes.zip',
        'tabela': 'cnaes',
        'schema': 'public',
        'colunas': ['codigo', 'descricao']
    },
    'municipios': {
        'arquivo': 'Municipios.zip',
        'tabela': 'municipios',
        'schema': 'public',
        'colunas': ['codigo', 'descricao']
    },
    'paises': {
        'arquivo': 'Paises.zip',
        'tabela': 'paises',
        'schema': 'public',
        'colunas': ['codigo', 'descricao']
    },
    'naturezas_juridicas': {
        'arquivo': 'Naturezas.zip',
        'tabela': 'naturezas_juridicas',
        'schema': 'public',
        'colunas': ['codigo', 'descricao']
    },
    'qualificacoes_socios': {
        'arquivo': 'Qualificacoes.zip',
        'tabela': 'qualificacoes_socios',
        'schema': 'public',
        'colunas': ['codigo', 'descricao']
    },
    'motivos_situacao_cadastral': {
        'arquivo': 'Motivos.zip',
        'tabela': 'motivos_situacao_cadastral',
        'schema': 'public',
        'colunas': ['codigo', 'descricao']
    }
}

# Arquivos de dados principais
EMPRESAS_PATTERN = 'Empresas*.zip'
ESTABELECIMENTOS_PATTERN = 'Estabelecimentos*.zip'
SOCIOS_PATTERN = 'Socios*.zip'
SIMPLES_FILE = 'Simples.zip'

# =======================
# ESTRUTURA DOS DADOS
# =======================

# Colunas da tabela Empresas (7 colunas)
EMPRESAS_COLUMNS = [
    'cnpj_basico',
    'razao_social',
    'natureza_juridica',
    'qualificacao_responsavel',
    'capital_social',
    'porte_empresa',
    'ente_federativo_responsavel'
]

# Colunas da tabela Estabelecimentos (30 colunas)
ESTABELECIMENTOS_COLUMNS = [
    'cnpj_basico',
    'cnpj_ordem',
    'cnpj_dv',
    'identificador_matriz_filial',
    'nome_fantasia',
    'situacao_cadastral',
    'data_situacao_cadastral',
    'motivo_situacao_cadastral',
    'nome_cidade_exterior',
    'pais',
    'data_inicio_atividade',
    'cnae_fiscal_principal',
    'cnae_fiscal_secundaria',
    'tipo_logradouro',
    'logradouro',
    'numero',
    'complemento',
    'bairro',
    'cep',
    'uf',
    'municipio',
    'ddd_1',
    'telefone_1',
    'ddd_2',
    'telefone_2',
    'ddd_fax',
    'fax',
    'email',
    'situacao_especial',
    'data_situacao_especial'
]

# Colunas da tabela Sócios (11 colunas)
SOCIOS_COLUMNS = [
    'cnpj_basico',
    'identificador_socio',
    'nome_socio',
    'cnpj_cpf_socio',  # Corrigido: banco usa cnpj_cpf_socio, não cpf_cnpj_socio
    'qualificacao_socio',
    'data_entrada_sociedade',
    'pais',
    'representante_legal',
    'nome_representante',
    'qualificacao_representante',
    'faixa_etaria'
]

# Colunas da tabela Simples Nacional (7 colunas)
SIMPLES_COLUMNS = [
    'cnpj_basico',
    'opcao_simples',
    'data_opcao_simples',
    'data_exclusao_simples',
    'opcao_mei',
    'data_opcao_mei',
    'data_exclusao_mei'
]

# =======================
# CÓDIGOS E MAPEAMENTOS
# =======================

# Código de situação cadastral ATIVA
SITUACAO_ATIVA = '02'

# Outros códigos de situação
SITUACAO_NULA = '01'
SITUACAO_SUSPENSA = '03'
SITUACAO_INAPTA = '04'
SITUACAO_BAIXADA = '08'

# Delimitadores CSV
CSV_DELIMITER = ';'
CSV_QUOTE_CHAR = '"'

# =======================
# BANCO DE DADOS
# =======================

# Schemas
# Schema único para TODOS os CNPJs (inicialmente)
SCHEMA_PRINCIPAL = 'cnpj_brasil'

# Schema que será criado NO FINAL para CNPJs não-ativos (situacao_cadastral != '02')
SCHEMA_OUTRAS_SITUACOES = 'cnpj_outras_situacoes'

# Configurações PostgreSQL para otimização durante import
PG_OPTIMIZATION_SETTINGS = {
    'maintenance_work_mem': '2GB',
    'work_mem': '256MB',
    'checkpoint_completion_target': '0.9',
    'wal_buffers': '16MB',
    'max_wal_size': '4GB',
    'synchronous_commit': 'off'  # Apenas durante importação!
}

# =======================
# VALIDAÇÕES
# =======================

# Validar que o diretório de dados existe
if not CNPJ_DATA_DIR.exists():
    raise FileNotFoundError(
        f"Diretório de dados CNPJ não encontrado: {CNPJ_DATA_DIR}\\n"
        f"Certifique-se de que os arquivos .zip estão em: {CNPJ_DATA_DIR}"
    )

# Contar arquivos disponíveis
def count_available_files():
    """Retorna quantidade de arquivos por tipo"""
    from glob import glob
    
    counts = {
        'empresas': len(list(CNPJ_DATA_DIR.glob(EMPRESAS_PATTERN))),
        'estabelecimentos': len(list(CNPJ_DATA_DIR.glob(ESTABELECIMENTOS_PATTERN))),
        'socios': len(list(CNPJ_DATA_DIR.glob(SOCIOS_PATTERN))),
        'simples': 1 if (CNPJ_DATA_DIR / SIMPLES_FILE).exists() else 0,
        'auxiliares': sum(1 for t in TABELAS_AUXILIARES.values() 
                         if (CNPJ_DATA_DIR / t['arquivo']).exists())
    }
    
    return counts

# =======================
# CONFIGURAÇÕES DE LOG
# =======================

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'detailed': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        },
        'simple': {
            'format': '%(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': str(LOG_FILE),
            'mode': 'a',
            'formatter': 'detailed',
            'level': 'DEBUG'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
            'level': 'INFO'
        }
    },
    'loggers': {
        'cnpj_import': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': False
        }
    }
}
