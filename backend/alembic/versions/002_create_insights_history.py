"""create insights_history table

Revision ID: 002_insights_history
Revises: 001_insights_cache
Create Date: 2026-02-09 00:00:01.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_insights_history'
down_revision = '001_insights_cache'
branch_labels = None
depends_on = None


def upgrade():
    """Create insights_history table for storing 12+ months of evolution data"""
    op.create_table(
        'insights_history',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('insight_key', sa.String(255), nullable=False,
                  comment='Reference to insights_cache.insight_key'),
        sa.Column('data_referencia', sa.Date(), nullable=False,
                  comment='Reference date for this snapshot (monthly)'),
        sa.Column('total_empresas', sa.Integer(), nullable=False, default=0,
                  comment='Total companies at this point in time'),
        sa.Column('percentual', sa.Float(), nullable=False, default=0.0,
                  comment='Percentage at this point in time'),
        sa.Column('valor_medio', sa.Float(), nullable=True,
                  comment='Average value at this point'),
        sa.Column('variacao_mensal', sa.Float(), nullable=True,
                  comment='Monthly change (%)'),
        sa.Column('variacao_anual', sa.Float(), nullable=True,
                  comment='Year-over-year change (%)'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes for efficient time-series queries
    op.create_index('idx_insights_history_key_date', 'insights_history', 
                    ['insight_key', 'data_referencia'], unique=True)
    op.create_index('idx_insights_history_key', 'insights_history', ['insight_key'])
    op.create_index('idx_insights_history_date', 'insights_history', ['data_referencia'],
                    postgresql_using='btree', postgresql_ops={'data_referencia': 'DESC'})
    
    # Foreign key constraint to insights_cache (optional, for data integrity)
    # Note: We don't enforce FK here to allow historical data even if cache is cleared
    # op.create_foreign_key(
    #     'fk_insights_history_cache',
    #     'insights_history', 'insights_cache',
    #     ['insight_key'], ['insight_key'],
    #     ondelete='CASCADE'
    # )


def downgrade():
    """Drop insights_history table and all indexes"""
    op.drop_index('idx_insights_history_date', table_name='insights_history')
    op.drop_index('idx_insights_history_key', table_name='insights_history')
    op.drop_index('idx_insights_history_key_date', table_name='insights_history')
    op.drop_table('insights_history', schema='public')
