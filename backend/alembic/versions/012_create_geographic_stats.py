"""create geographic_stats table

Revision ID: 012
Revises: 011
Create Date: 2025-01-XX

Tabela para estatísticas agregadas por município/estado.
Suporta visualização no Mapa Interativo (F04).
Pré-calcula métricas para performance.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '012_geographic_stats'
down_revision = '011_favorite_categories'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create geographic_stats table for municipality-level aggregated statistics"""
    
    op.create_table(
        'geographic_stats',
        
        # Primary Key
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        
        # Geographic Identifiers
        sa.Column('municipio_ibge', sa.String(7), nullable=True, comment='Código IBGE do município (7 dígitos)'),
        sa.Column('municipio_nome', sa.String(100), nullable=True, comment='Nome do município'),
        sa.Column('estado_uf', sa.String(2), nullable=False, comment='UF do estado'),
        sa.Column('estado_nome', sa.String(50), nullable=False, comment='Nome completo do estado'),
        sa.Column('regiao', sa.String(20), nullable=False, comment='Região: Norte, Nordeste, Centro-Oeste, Sudeste, Sul'),
        sa.Column('is_capital', sa.Boolean, default=False, comment='Se é capital estadual'),
        
        # Statistics
        sa.Column('total_empresas', sa.Integer, nullable=False, default=0, comment='Total de empresas ativas'),
        sa.Column('total_capital_social', sa.Numeric(18, 2), nullable=True, comment='Soma do capital social'),
        sa.Column('cnae_principal', sa.String(10), nullable=True, comment='CNAE mais comum na região'),
        sa.Column('cnae_principal_count', sa.Integer, nullable=True, comment='Quantidade de empresas no CNAE principal'),
        sa.Column('natureza_juridica_principal', sa.String(4), nullable=True, comment='Natureza jurídica mais comum'),
        sa.Column('porte_predominante', sa.String(2), nullable=True, comment='Porte predominante: ME, EPP, DEMAIS'),
        
        # Growth Metrics
        sa.Column('growth_rate_30d', sa.Numeric(5, 2), nullable=True, comment='Taxa de crescimento últimos 30 dias (%)'),
        sa.Column('growth_rate_90d', sa.Numeric(5, 2), nullable=True, comment='Taxa de crescimento últimos 90 dias (%)'),
        sa.Column('growth_rate_1y', sa.Numeric(5, 2), nullable=True, comment='Taxa de crescimento último ano (%)'),
        
        # Additional Data
        sa.Column('metadata', JSONB, nullable=True, comment='Dados adicionais: população, PIB, setores, etc.'),
        
        # Timestamps
        sa.Column('calculated_at', sa.DateTime, nullable=False, default=datetime.utcnow, comment='Quando foi calculado'),
        sa.Column('created_at', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_at', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow),
    )
    
    # Indexes for performance
    op.create_index('idx_geographic_stats_municipio_ibge', 'geographic_stats', ['municipio_ibge'])
    op.create_index('idx_geographic_stats_estado_uf', 'geographic_stats', ['estado_uf'])
    op.create_index('idx_geographic_stats_regiao', 'geographic_stats', ['regiao'])
    op.create_index('idx_geographic_stats_is_capital', 'geographic_stats', ['is_capital'])
    op.create_index('idx_geographic_stats_total_empresas', 'geographic_stats', ['total_empresas'], postgresql_using='btree')
    op.create_index('idx_geographic_stats_calculated_at', 'geographic_stats', ['calculated_at'], postgresql_using='btree')
    
    # Composite indexes for common queries
    op.create_index('idx_geographic_stats_estado_municipio', 'geographic_stats', ['estado_uf', 'municipio_ibge'])
    op.create_index('idx_geographic_stats_regiao_estado', 'geographic_stats', ['regiao', 'estado_uf'])
    
    # Unique constraint: One record per município or estado
    op.create_index('idx_geographic_stats_unique_municipio', 'geographic_stats', ['municipio_ibge'], unique=True, postgresql_where=sa.text("municipio_ibge IS NOT NULL"))
    op.create_index('idx_geographic_stats_unique_estado', 'geographic_stats', ['estado_uf'], unique=True, postgresql_where=sa.text("municipio_ibge IS NULL"))
    
    # GIN index for JSONB metadata
    op.create_index('idx_geographic_stats_metadata', 'geographic_stats', ['metadata'], postgresql_using='gin')


def downgrade() -> None:
    """Drop geographic_stats table"""
    op.drop_table('geographic_stats')
