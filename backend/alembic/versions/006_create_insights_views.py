"""create insights_views table

Revision ID: 006_insights_views
Revises: 005_search_history
Create Date: 2026-02-09 23:00:03.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '006_insights_views'
down_revision = '005_search_history'
branch_labels = None
depends_on = None


def upgrade():
    """Create insights_views table for ML tracking"""
    op.create_table(
        'insights_views',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('insight_key', sa.String(255), nullable=False,
                  comment='Reference to insights_cache.insight_key'),
        sa.Column('view_duration_seconds', sa.Integer(), nullable=True,
                  comment='How long user viewed the insight'),
        sa.Column('interaction_type', sa.String(50), nullable=True,
                  comment='Type: view, click, drill_down, export, favorite'),
        sa.Column('exported_format', sa.String(10), nullable=True,
                  comment='If exported: pdf, png, csv'),
        sa.Column('drill_down_section', sa.String(50), nullable=True,
                  comment='If drill-down: evolucao, cnaes, geografia, capital, saude'),
        sa.Column('metadata', JSONB(), nullable=True, default={},
                  comment='Additional tracking data'),
        sa.Column('session_id', sa.String(100), nullable=True,
                  comment='Browser session identifier'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False,
                  comment='View timestamp'),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_insights_views_user_id', 'insights_views', ['user_id'])
    op.create_index('idx_insights_views_insight_key', 'insights_views', ['insight_key'])
    op.create_index('idx_insights_views_interaction', 'insights_views', ['interaction_type'])
    op.create_index('idx_insights_views_created_at', 'insights_views', ['created_at'],
                    postgresql_using='btree', postgresql_ops={'created_at': 'DESC'})
    
    # Composite index for ML queries (user + insight for recommendations)
    op.create_index('idx_insights_views_user_insight', 'insights_views', 
                    ['user_id', 'insight_key'])
    
    # GIN index for JSONB metadata
    op.create_index('idx_insights_views_metadata_gin', 'insights_views', ['metadata'],
                    postgresql_using='gin')
    
    # Foreign keys
    op.create_foreign_key(
        'fk_insights_views_user',
        'insights_views', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )
    op.create_foreign_key(
        'fk_insights_views_insight',
        'insights_views', 'insights_cache',
        ['insight_key'], ['insight_key'],
        ondelete='CASCADE'
    )


def downgrade():
    """Drop insights_views table and all indexes"""
    op.drop_constraint('fk_insights_views_insight', 'insights_views', type_='foreignkey')
    op.drop_constraint('fk_insights_views_user', 'insights_views', type_='foreignkey')
    op.drop_index('idx_insights_views_metadata_gin', table_name='insights_views')
    op.drop_index('idx_insights_views_user_insight', table_name='insights_views')
    op.drop_index('idx_insights_views_created_at', table_name='insights_views')
    op.drop_index('idx_insights_views_interaction', table_name='insights_views')
    op.drop_index('idx_insights_views_insight_key', table_name='insights_views')
    op.drop_index('idx_insights_views_user_id', table_name='insights_views')
    op.drop_table('insights_views', schema='public')
