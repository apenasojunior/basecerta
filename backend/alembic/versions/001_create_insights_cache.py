"""create insights cache table

Revision ID: 001_insights_cache
Revises: 
Create Date: 2025-10-25 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers
revision = '001_insights_cache'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Cria tabela insights_cache para armazenar estatísticas pré-calculadas"""
    op.create_table(
        'insights_cache',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('insight_key', sa.String(50), unique=True, nullable=False),
        sa.Column('categoria', sa.String(20), nullable=False),
        sa.Column('titulo', sa.String(200), nullable=False),
        sa.Column('total_empresas', sa.Integer(), nullable=False),
        sa.Column('percentual', sa.Numeric(5, 2), nullable=True),
        sa.Column('metadata', JSONB, nullable=False),
        sa.Column('filters', JSONB, nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_by', sa.String(100), server_default='system'),
        schema='public'
    )
    
    # Criar índices para performance
    op.create_index(
        'idx_insights_categoria',
        'insights_cache',
        ['categoria'],
        schema='public'
    )
    
    op.create_index(
        'idx_insights_updated',
        'insights_cache',
        ['updated_at'],
        schema='public'
    )
    
    op.create_index(
        'idx_insights_key',
        'insights_cache',
        ['insight_key'],
        unique=True,
        schema='public'
    )
    
    # Constraint para validar categoria
    op.create_check_constraint(
        'categoria_check',
        'insights_cache',
        "categoria IN ('setor', 'estado', 'capital')",
        schema='public'
    )


def downgrade():
    """Remove tabela insights_cache"""
    op.drop_table('insights_cache', schema='public')
