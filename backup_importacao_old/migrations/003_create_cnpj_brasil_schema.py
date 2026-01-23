"""create cnpj_brasil schema

Revision ID: 003_cnpj_brasil
Revises: 002_create_cnpj_structure
Create Date: 2026-01-03 21:00:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003_cnpj_brasil'
down_revision = '002_cnpj_structure'
branch_labels = None
depends_on = None


def upgrade():
    # Dropar schemas antigos se existirem
    op.execute("DROP SCHEMA IF EXISTS cnpjs_ativos CASCADE")
    op.execute("DROP SCHEMA IF EXISTS demais_cnpjs CASCADE")
    
    # Criar schema único cnpj_brasil
    op.execute("CREATE SCHEMA IF NOT EXISTS cnpj_brasil")
    
    # ========================================
    # TABELA: cnpj_brasil.empresas
    # ========================================
    op.execute("""
        CREATE TABLE cnpj_brasil.empresas (
            cnpj_basico VARCHAR(8) PRIMARY KEY,
            razao_social VARCHAR(255),
            natureza_juridica VARCHAR(4),
            qualificacao_responsavel VARCHAR(2),
            capital_social DECIMAL(15,2),
            porte_empresa VARCHAR(2),
            ente_federativo_responsavel VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Índices para empresas
    op.execute("CREATE INDEX idx_cnpj_brasil_empresas_razao ON cnpj_brasil.empresas(razao_social)")
    op.execute("CREATE INDEX idx_cnpj_brasil_empresas_natureza ON cnpj_brasil.empresas(natureza_juridica)")
    
    # ========================================
    # TABELA: cnpj_brasil.estabelecimentos
    # ========================================
    op.execute("""
        CREATE TABLE cnpj_brasil.estabelecimentos (
            cnpj_basico VARCHAR(8) NOT NULL,
            cnpj_ordem VARCHAR(4) NOT NULL,
            cnpj_dv VARCHAR(2) NOT NULL,
            cnpj_completo VARCHAR(14) GENERATED ALWAYS AS (cnpj_basico || cnpj_ordem || cnpj_dv) STORED,
            identificador_matriz_filial VARCHAR(1),
            nome_fantasia VARCHAR(255),
            situacao_cadastral VARCHAR(2),
            data_situacao_cadastral DATE,
            motivo_situacao_cadastral VARCHAR(2),
            nome_cidade_exterior VARCHAR(100),
            pais VARCHAR(3),
            data_inicio_atividade DATE,
            cnae_fiscal_principal VARCHAR(7),
            cnae_fiscal_secundaria TEXT,
            tipo_logradouro VARCHAR(50),
            logradouro VARCHAR(255),
            numero VARCHAR(20),
            complemento VARCHAR(255),
            bairro VARCHAR(100),
            cep VARCHAR(8),
            uf VARCHAR(2),
            municipio VARCHAR(4),
            ddd_1 VARCHAR(4),
            telefone_1 VARCHAR(20),
            ddd_2 VARCHAR(4),
            telefone_2 VARCHAR(20),
            ddd_fax VARCHAR(4),
            fax VARCHAR(20),
            correio_eletronico VARCHAR(255),
            situacao_especial VARCHAR(100),
            data_situacao_especial DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (cnpj_basico, cnpj_ordem, cnpj_dv),
            CONSTRAINT fk_cnpj_brasil_est_empresa FOREIGN KEY (cnpj_basico) 
                REFERENCES cnpj_brasil.empresas(cnpj_basico) ON DELETE CASCADE
        )
    """)
    
    # Índices para estabelecimentos
    op.execute("CREATE INDEX idx_cnpj_brasil_est_completo ON cnpj_brasil.estabelecimentos(cnpj_completo)")
    op.execute("CREATE INDEX idx_cnpj_brasil_est_situacao ON cnpj_brasil.estabelecimentos(situacao_cadastral)")
    op.execute("CREATE INDEX idx_cnpj_brasil_est_nome_fantasia ON cnpj_brasil.estabelecimentos(nome_fantasia)")
    op.execute("CREATE INDEX idx_cnpj_brasil_est_municipio ON cnpj_brasil.estabelecimentos(municipio)")
    op.execute("CREATE INDEX idx_cnpj_brasil_est_uf ON cnpj_brasil.estabelecimentos(uf)")
    op.execute("CREATE INDEX idx_cnpj_brasil_est_cnae ON cnpj_brasil.estabelecimentos(cnae_fiscal_principal)")
    
    # ========================================
    # TABELA: cnpj_brasil.socios
    # ========================================
    op.execute("""
        CREATE TABLE cnpj_brasil.socios (
            cnpj_basico VARCHAR(8) NOT NULL,
            identificador_socio VARCHAR(1),
            nome_socio VARCHAR(255),
            cnpj_cpf_socio VARCHAR(14),
            qualificacao_socio VARCHAR(2),
            data_entrada_sociedade DATE,
            pais VARCHAR(3),
            representante_legal VARCHAR(14),
            nome_representante VARCHAR(255),
            qualificacao_representante VARCHAR(2),
            faixa_etaria VARCHAR(1),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_cnpj_brasil_soc_empresa FOREIGN KEY (cnpj_basico) 
                REFERENCES cnpj_brasil.empresas(cnpj_basico) ON DELETE CASCADE
        )
    """)
    
    # Índices para sócios
    op.execute("CREATE INDEX idx_cnpj_brasil_soc_basico ON cnpj_brasil.socios(cnpj_basico)")
    op.execute("CREATE INDEX idx_cnpj_brasil_soc_nome ON cnpj_brasil.socios(nome_socio)")
    op.execute("CREATE INDEX idx_cnpj_brasil_soc_cpf_cnpj ON cnpj_brasil.socios(cnpj_cpf_socio)")
    
    # ========================================
    # TABELA: cnpj_brasil.simples_nacional
    # ========================================
    op.execute("""
        CREATE TABLE cnpj_brasil.simples_nacional (
            cnpj_basico VARCHAR(8) PRIMARY KEY,
            opcao_simples VARCHAR(1),
            data_opcao_simples DATE,
            data_exclusao_simples DATE,
            opcao_mei VARCHAR(1),
            data_opcao_mei DATE,
            data_exclusao_mei DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_cnpj_brasil_simples_empresa FOREIGN KEY (cnpj_basico) 
                REFERENCES cnpj_brasil.empresas(cnpj_basico) ON DELETE CASCADE
        )
    """)


def downgrade():
    op.execute("DROP SCHEMA IF EXISTS cnpj_brasil CASCADE")
    # Recriar schemas antigos se necessário
    op.execute("CREATE SCHEMA IF NOT EXISTS cnpjs_ativos")
    op.execute("CREATE SCHEMA IF NOT EXISTS demais_cnpjs")
