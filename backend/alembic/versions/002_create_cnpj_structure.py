"""create cnpj structure with schemas

Revision ID: 002
Revises: 001
Create Date: 2026-01-02 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_cnpj_structure'
down_revision = '001_insights_cache'
branch_labels = None
depends_on = None


def upgrade():
    # Criar schemas
    op.execute('CREATE SCHEMA IF NOT EXISTS cnpjs_ativos')
    op.execute('CREATE SCHEMA IF NOT EXISTS demais_cnpjs')
    
    # ======================
    # TABELAS AUXILIARES (public schema)
    # ======================
    
    # CNAEs
    op.create_table(
        'cnaes',
        sa.Column('codigo', sa.String(7), primary_key=True),
        sa.Column('descricao', sa.String(200), nullable=False),
        schema='public'
    )
    
    # Municípios
    op.create_table(
        'municipios',
        sa.Column('codigo', sa.String(4), primary_key=True),
        sa.Column('descricao', sa.String(100), nullable=False),
        schema='public'
    )
    
    # Países
    op.create_table(
        'paises',
        sa.Column('codigo', sa.String(3), primary_key=True),
        sa.Column('descricao', sa.String(100), nullable=False),
        schema='public'
    )
    
    # Naturezas Jurídicas
    op.create_table(
        'naturezas_juridicas',
        sa.Column('codigo', sa.String(4), primary_key=True),
        sa.Column('descricao', sa.String(200), nullable=False),
        schema='public'
    )
    
    # Qualificações de Sócios
    op.create_table(
        'qualificacoes_socios',
        sa.Column('codigo', sa.String(2), primary_key=True),
        sa.Column('descricao', sa.String(200), nullable=False),
        schema='public'
    )
    
    # Motivos de Situação Cadastral
    op.create_table(
        'motivos_situacao_cadastral',
        sa.Column('codigo', sa.String(2), primary_key=True),
        sa.Column('descricao', sa.String(200), nullable=False),
        schema='public'
    )
    
    # ======================
    # FUNÇÃO AUXILIAR PARA CRIAR TABELAS NOS 2 SCHEMAS
    # ======================
    
    def create_cnpj_tables(schema_name):
        """Cria as tabelas de CNPJ em um schema específico"""
        
        # TABELA: EMPRESAS
        op.create_table(
            'empresas',
            sa.Column('cnpj_basico', sa.String(8), primary_key=True),
            sa.Column('razao_social', sa.String(200), nullable=False),
            sa.Column('natureza_juridica', sa.String(4), nullable=True),
            sa.Column('qualificacao_responsavel', sa.String(2), nullable=True),
            sa.Column('capital_social', sa.Numeric(15, 2), nullable=True),
            sa.Column('porte_empresa', sa.String(2), nullable=True),
            sa.Column('ente_federativo_responsavel', sa.String(100), nullable=True),
            sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
            schema=schema_name
        )
        
        # TABELA: ESTABELECIMENTOS
        op.create_table(
            'estabelecimentos',
            sa.Column('id', sa.BigInteger, primary_key=True, autoincrement=True),
            sa.Column('cnpj_basico', sa.String(8), nullable=False),
            sa.Column('cnpj_ordem', sa.String(4), nullable=False),
            sa.Column('cnpj_dv', sa.String(2), nullable=False),
            sa.Column('identificador_matriz_filial', sa.String(1), nullable=True),
            sa.Column('nome_fantasia', sa.String(200), nullable=True),
            sa.Column('situacao_cadastral', sa.String(2), nullable=True),
            sa.Column('data_situacao_cadastral', sa.Date, nullable=True),
            sa.Column('motivo_situacao_cadastral', sa.String(2), nullable=True),
            sa.Column('nome_cidade_exterior', sa.String(100), nullable=True),
            sa.Column('pais', sa.String(3), nullable=True),
            sa.Column('data_inicio_atividade', sa.Date, nullable=True),
            sa.Column('cnae_fiscal_principal', sa.String(7), nullable=True),
            sa.Column('cnae_fiscal_secundaria', sa.Text, nullable=True),
            sa.Column('tipo_logradouro', sa.String(50), nullable=True),
            sa.Column('logradouro', sa.String(200), nullable=True),
            sa.Column('numero', sa.String(20), nullable=True),
            sa.Column('complemento', sa.String(200), nullable=True),
            sa.Column('bairro', sa.String(100), nullable=True),
            sa.Column('cep', sa.String(8), nullable=True),
            sa.Column('uf', sa.String(2), nullable=True),
            sa.Column('municipio', sa.String(4), nullable=True),
            sa.Column('ddd_1', sa.String(4), nullable=True),
            sa.Column('telefone_1', sa.String(20), nullable=True),
            sa.Column('ddd_2', sa.String(4), nullable=True),
            sa.Column('telefone_2', sa.String(20), nullable=True),
            sa.Column('ddd_fax', sa.String(4), nullable=True),
            sa.Column('fax', sa.String(20), nullable=True),
            sa.Column('email', sa.String(200), nullable=True),
            sa.Column('situacao_especial', sa.String(100), nullable=True),
            sa.Column('data_situacao_especial', sa.Date, nullable=True),
            sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
            schema=schema_name
        )
        
        # Índice único para CNPJ completo
        op.create_index(
            f'idx_{schema_name}_est_cnpj_unique',
            'estabelecimentos',
            ['cnpj_basico', 'cnpj_ordem', 'cnpj_dv'],
            unique=True,
            schema=schema_name
        )
        
        # Foreign key para empresas
        op.create_foreign_key(
            f'fk_{schema_name}_est_empresa',
            'estabelecimentos', 'empresas',
            ['cnpj_basico'], ['cnpj_basico'],
            source_schema=schema_name,
            referent_schema=schema_name,
            ondelete='CASCADE'
        )
        
        # TABELA: SOCIOS
        op.create_table(
            'socios',
            sa.Column('id', sa.BigInteger, primary_key=True, autoincrement=True),
            sa.Column('cnpj_basico', sa.String(8), nullable=False),
            sa.Column('identificador_socio', sa.String(1), nullable=True),
            sa.Column('nome_socio', sa.String(200), nullable=False),
            sa.Column('cpf_cnpj_socio', sa.String(14), nullable=True),
            sa.Column('qualificacao_socio', sa.String(2), nullable=True),
            sa.Column('data_entrada_sociedade', sa.Date, nullable=True),
            sa.Column('pais', sa.String(3), nullable=True),
            sa.Column('representante_legal', sa.String(14), nullable=True),
            sa.Column('nome_representante', sa.String(200), nullable=True),
            sa.Column('qualificacao_representante', sa.String(2), nullable=True),
            sa.Column('faixa_etaria', sa.String(1), nullable=True),
            sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
            schema=schema_name
        )
        
        # Foreign key para empresas
        op.create_foreign_key(
            f'fk_{schema_name}_socios_empresa',
            'socios', 'empresas',
            ['cnpj_basico'], ['cnpj_basico'],
            source_schema=schema_name,
            referent_schema=schema_name,
            ondelete='CASCADE'
        )
        
        # TABELA: SIMPLES NACIONAL
        op.create_table(
            'simples_nacional',
            sa.Column('cnpj_basico', sa.String(8), primary_key=True),
            sa.Column('opcao_simples', sa.String(1), nullable=True),
            sa.Column('data_opcao_simples', sa.Date, nullable=True),
            sa.Column('data_exclusao_simples', sa.Date, nullable=True),
            sa.Column('opcao_mei', sa.String(1), nullable=True),
            sa.Column('data_opcao_mei', sa.Date, nullable=True),
            sa.Column('data_exclusao_mei', sa.Date, nullable=True),
            sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
            schema=schema_name
        )
        
        # Foreign key para empresas
        op.create_foreign_key(
            f'fk_{schema_name}_simples_empresa',
            'simples_nacional', 'empresas',
            ['cnpj_basico'], ['cnpj_basico'],
            source_schema=schema_name,
            referent_schema=schema_name,
            ondelete='CASCADE'
        )
    
    # Criar tabelas nos 2 schemas
    create_cnpj_tables('cnpjs_ativos')
    create_cnpj_tables('demais_cnpjs')
    
    # ======================
    # ÍNDICES PARA SCHEMA cnpjs_ativos (Performance crítica)
    # ======================
    
    # Empresas
    op.create_index('idx_cnpjs_ativos_emp_razao', 'empresas', ['razao_social'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_emp_natureza', 'empresas', ['natureza_juridica'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_emp_porte', 'empresas', ['porte_empresa'], schema='cnpjs_ativos')
    
    # Estabelecimentos
    op.create_index('idx_cnpjs_ativos_est_fantasia', 'estabelecimentos', ['nome_fantasia'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_est_municipio', 'estabelecimentos', ['municipio'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_est_cnae', 'estabelecimentos', ['cnae_fiscal_principal'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_est_uf', 'estabelecimentos', ['uf'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_est_situacao', 'estabelecimentos', ['situacao_cadastral', 'data_situacao_cadastral'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_est_cep', 'estabelecimentos', ['cep'], schema='cnpjs_ativos')
    
    # Índices compostos para buscas complexas
    op.create_index('idx_cnpjs_ativos_est_mun_cnae', 'estabelecimentos', ['municipio', 'cnae_fiscal_principal'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_est_uf_cnae', 'estabelecimentos', ['uf', 'cnae_fiscal_principal'], schema='cnpjs_ativos')
    
    # Sócios
    op.create_index('idx_cnpjs_ativos_soc_nome', 'socios', ['nome_socio'], schema='cnpjs_ativos')
    op.create_index('idx_cnpjs_ativos_soc_cpf', 'socios', ['cpf_cnpj_socio'], schema='cnpjs_ativos')
    
    # ======================
    # ÍNDICES PARA SCHEMA demais_cnpjs (Básicos)
    # ======================
    
    op.create_index('idx_demais_cnpjs_est_cnpj_basico', 'estabelecimentos', ['cnpj_basico'], schema='demais_cnpjs')
    op.create_index('idx_demais_cnpjs_est_situacao', 'estabelecimentos', ['situacao_cadastral'], schema='demais_cnpjs')
    op.create_index('idx_demais_cnpjs_est_uf', 'estabelecimentos', ['uf'], schema='demais_cnpjs')


def downgrade():
    # Remover schemas (CASCADE remove todas as tabelas)
    op.execute('DROP SCHEMA IF EXISTS cnpjs_ativos CASCADE')
    op.execute('DROP SCHEMA IF EXISTS demais_cnpjs CASCADE')
    
    # Remover tabelas auxiliares
    op.drop_table('motivos_situacao_cadastral', schema='public')
    op.drop_table('qualificacoes_socios', schema='public')
    op.drop_table('naturezas_juridicas', schema='public')
    op.drop_table('paises', schema='public')
    op.drop_table('municipios', schema='public')
    op.drop_table('cnaes', schema='public')
