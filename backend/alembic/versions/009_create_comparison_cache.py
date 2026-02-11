"""create comparison_cache table

Revision ID: 009_comparison_cache
Revises: 008_comparisons_history
Create Date: 2026-02-09 23:00:06.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, ARRAY

# revision identifiers, used by Alembic.
revision = '009_comparison_cache'
down_revision = '008_comparisons_history'
branch_labels = None
depends_on = None


def upgrade():
    """Create comparison_cache table for caching Gemini AI analysis"""
    op.create_table(
        'comparison_cache',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('comparison_key', sa.String(255), nullable=False, unique=True,
                  comment='Hash of comparison parameters (type + items + metrics)'),
        sa.Column('comparison_type', sa.String(50), nullable=False,
                  comment='Type: sectors, states, companies, time_periods'),
        sa.Column('items_compared', ARRAY(sa.String()), nullable=False,
                  comment='Array of item keys being compared'),
        sa.Column('ai_analysis', sa.Text(), nullable=True,
                  comment='Gemini AI generated analysis text'),
        sa.Column('insights', JSONB(), nullable=True, default=[],
                  comment='Structured insights from AI'),
        sa.Column('recommendations', JSONB(), nullable=True, default=[],
                  comment='AI recommendations based on comparison'),
        sa.Column('data_snapshot', JSONB(), nullable=True, default={},
                  comment='Cached comparison data'),
        sa.Column('model_version', sa.String(50), nullable=True,
                  comment='Gemini model version used (e.g., "gemini-1.5-flash")'),
        sa.Column('tokens_used', sa.Integer(), nullable=True,
                  comment='API tokens consumed'),
        sa.Column('generation_time_ms', sa.Integer(), nullable=True,
                  comment='Time taken to generate analysis'),
        sa.Column('expires_at', sa.DateTime(), nullable=True,
                  comment='Cache expiration (24-48 hours)'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_comparison_cache_key', 'comparison_cache', ['comparison_key'], unique=True)
    op.create_index('idx_comparison_cache_type', 'comparison_cache', ['comparison_type'])
    op.create_index('idx_comparison_cache_expires', 'comparison_cache', ['expires_at'],
                    postgresql_using='btree', postgresql_ops={'expires_at': 'ASC'})
    
    # GIN indexes for arrays and JSONB
    op.create_index('idx_comparison_cache_items_gin', 'comparison_cache', ['items_compared'],
                    postgresql_using='gin')
    op.create_index('idx_comparison_cache_insights_gin', 'comparison_cache', ['insights'],
                    postgresql_using='gin')
    op.create_index('idx_comparison_cache_data_gin', 'comparison_cache', ['data_snapshot'],
                    postgresql_using='gin')
    
    # Full-text search index on AI analysis
    op.execute('CREATE INDEX idx_comparison_cache_analysis_fts ON comparison_cache USING gin(to_tsvector(\'portuguese\', ai_analysis))')


def downgrade():
    """Drop comparison_cache table and all indexes"""
    op.execute('DROP INDEX idx_comparison_cache_analysis_fts')
    op.drop_index('idx_comparison_cache_data_gin', table_name='comparison_cache')
    op.drop_index('idx_comparison_cache_insights_gin', table_name='comparison_cache')
    op.drop_index('idx_comparison_cache_items_gin', table_name='comparison_cache')
    op.drop_index('idx_comparison_cache_expires', table_name='comparison_cache')
    op.drop_index('idx_comparison_cache_type', table_name='comparison_cache')
    op.drop_index('idx_comparison_cache_key', table_name='comparison_cache')
    op.drop_table('comparison_cache', schema='public')
