"""create ml_recommendations table

Revision ID: 007_ml_recommendations
Revises: 006_insights_views
Create Date: 2026-02-09 23:00:04.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '007_ml_recommendations'
down_revision = '006_insights_views'
branch_labels = None
depends_on = None


def upgrade():
    """Create ml_recommendations table for cached ML predictions"""
    op.create_table(
        'ml_recommendations',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('recommendation_type', sa.String(50), nullable=False,
                  comment='Type: insights, sectors, companies, searches'),
        sa.Column('recommended_items', JSONB(), nullable=False, default=[],
                  comment='Array of recommended items with scores'),
        sa.Column('model_version', sa.String(20), nullable=False,
                  comment='ML model version used (e.g., "v1.2.3")'),
        sa.Column('confidence_score', sa.Numeric(5, 4), nullable=True,
                  comment='Overall confidence (0-1)'),
        sa.Column('algorithm', sa.String(50), nullable=True,
                  comment='Algorithm used: collaborative_filtering, content_based, hybrid'),
        sa.Column('features_used', JSONB(), nullable=True, default={},
                  comment='Features that influenced recommendations'),
        sa.Column('expires_at', sa.DateTime(), nullable=True,
                  comment='When to recalculate (TTL)'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), 
                  onupdate=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_ml_recommendations_user_id', 'ml_recommendations', ['user_id'])
    op.create_index('idx_ml_recommendations_type', 'ml_recommendations', ['recommendation_type'])
    op.create_index('idx_ml_recommendations_expires', 'ml_recommendations', ['expires_at'],
                    postgresql_using='btree', postgresql_ops={'expires_at': 'ASC'})
    
    # Composite index for quick lookups
    op.create_index('idx_ml_recommendations_user_type', 'ml_recommendations',
                    ['user_id', 'recommendation_type'], unique=True)
    
    # GIN indexes for JSONB
    op.create_index('idx_ml_recommendations_items_gin', 'ml_recommendations', ['recommended_items'],
                    postgresql_using='gin')
    op.create_index('idx_ml_recommendations_features_gin', 'ml_recommendations', ['features_used'],
                    postgresql_using='gin')
    
    # Foreign key to users table
    op.create_foreign_key(
        'fk_ml_recommendations_user',
        'ml_recommendations', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade():
    """Drop ml_recommendations table and all indexes"""
    op.drop_constraint('fk_ml_recommendations_user', 'ml_recommendations', type_='foreignkey')
    op.drop_index('idx_ml_recommendations_features_gin', table_name='ml_recommendations')
    op.drop_index('idx_ml_recommendations_items_gin', table_name='ml_recommendations')
    op.drop_index('idx_ml_recommendations_user_type', table_name='ml_recommendations')
    op.drop_index('idx_ml_recommendations_expires', table_name='ml_recommendations')
    op.drop_index('idx_ml_recommendations_type', table_name='ml_recommendations')
    op.drop_index('idx_ml_recommendations_user_id', table_name='ml_recommendations')
    op.drop_table('ml_recommendations', schema='public')
