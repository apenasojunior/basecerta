"""create insights_cache table

Revision ID: 001_insights_cache
Revises: 
Create Date: 2026-02-09 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers, used by Alembic.
revision = '001_insights_cache'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create insights_cache table for storing pre-calculated insights"""
    op.create_table(
        'insights_cache',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('insight_key', sa.String(255), nullable=False, unique=True, 
                  comment='Unique identifier for the insight (e.g., "setor_tecnologia")'),
        sa.Column('categoria', sa.String(50), nullable=False,
                  comment='Category: setor, estado, capital, idade, etc.'),
        sa.Column('titulo', sa.String(255), nullable=False,
                  comment='Human-readable title'),
        sa.Column('descricao', sa.Text(), nullable=True,
                  comment='Detailed description of the insight'),
        sa.Column('total_empresas', sa.Integer(), nullable=False, default=0,
                  comment='Total number of companies in this segment'),
        sa.Column('percentual', sa.Float(), nullable=False, default=0.0,
                  comment='Percentage of total companies'),
        sa.Column('valor_medio', sa.Float(), nullable=True,
                  comment='Average value (capital, employees, etc.)'),
        sa.Column('taxa_crescimento', sa.Float(), nullable=True,
                  comment='Growth rate (%)'),
        sa.Column('classificacao_anomalia', sa.String(50), nullable=True,
                  comment='Anomaly classification: high_growth, attention, emerging'),
        sa.Column('z_score', sa.Float(), nullable=True,
                  comment='Z-score for anomaly detection'),
        sa.Column('prioridade_score', sa.Float(), nullable=True,
                  comment='Priority score for ranking (0-100)'),
        sa.Column('metadata', JSONB(), nullable=True, default={},
                  comment='Additional metadata (CNAEs, regions, etc.)'),
        sa.Column('filtros', JSONB(), nullable=True, default={},
                  comment='Filters used to generate this insight'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), 
                  onupdate=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes for better query performance
    op.create_index('idx_insights_cache_key', 'insights_cache', ['insight_key'], unique=True)
    op.create_index('idx_insights_cache_categoria', 'insights_cache', ['categoria'])
    op.create_index('idx_insights_cache_prioridade', 'insights_cache', ['prioridade_score'], 
                    postgresql_using='btree', postgresql_ops={'prioridade_score': 'DESC'})
    op.create_index('idx_insights_cache_created', 'insights_cache', ['created_at'])
    
    # GIN index for JSONB columns for efficient querying
    op.create_index('idx_insights_cache_metadata_gin', 'insights_cache', ['metadata'],
                    postgresql_using='gin')
    op.create_index('idx_insights_cache_filtros_gin', 'insights_cache', ['filtros'],
                    postgresql_using='gin')


def downgrade():
    """Drop insights_cache table and all indexes"""
    op.drop_index('idx_insights_cache_filtros_gin', table_name='insights_cache')
    op.drop_index('idx_insights_cache_metadata_gin', table_name='insights_cache')
    op.drop_index('idx_insights_cache_created', table_name='insights_cache')
    op.drop_index('idx_insights_cache_prioridade', table_name='insights_cache')
    op.drop_index('idx_insights_cache_categoria', table_name='insights_cache')
    op.drop_index('idx_insights_cache_key', table_name='insights_cache')
    op.drop_table('insights_cache', schema='public')
