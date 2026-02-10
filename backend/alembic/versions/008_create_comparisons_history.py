"""create comparisons_history table

Revision ID: 008_comparisons_history
Revises: 007_ml_recommendations
Create Date: 2026-02-09 23:00:05.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

# revision identifiers, used by Alembic.
revision = '008_comparisons_history'
down_revision = '007_ml_recommendations'
branch_labels = None
depends_on = None


def upgrade():
    """Create comparisons_history table for tracking user comparisons"""
    op.create_table(
        'comparisons_history',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('comparison_type', sa.String(50), nullable=False,
                  comment='Type: sectors, states, companies, time_periods'),
        sa.Column('items_compared', ARRAY(sa.String()), nullable=False,
                  comment='Array of item keys being compared'),
        sa.Column('metrics_selected', ARRAY(sa.String()), nullable=True,
                  comment='Metrics chosen: total_empresas, crescimento, capital_medio'),
        sa.Column('time_range', sa.String(20), nullable=True,
                  comment='Time period: 1m, 3m, 6m, 12m, ytd'),
        sa.Column('filters_applied', JSONB(), nullable=True, default={},
                  comment='Additional filters used'),
        sa.Column('view_duration_seconds', sa.Integer(), nullable=True,
                  comment='How long user spent viewing comparison'),
        sa.Column('exported', sa.Boolean(), nullable=False, default=False,
                  comment='Whether comparison was exported'),
        sa.Column('session_id', sa.String(100), nullable=True,
                  comment='Browser session identifier'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_comparisons_history_user_id', 'comparisons_history', ['user_id'])
    op.create_index('idx_comparisons_history_type', 'comparisons_history', ['comparison_type'])
    op.create_index('idx_comparisons_history_created', 'comparisons_history', ['created_at'],
                    postgresql_using='btree', postgresql_ops={'created_at': 'DESC'})
    
    # GIN indexes for arrays and JSONB
    op.create_index('idx_comparisons_history_items_gin', 'comparisons_history', ['items_compared'],
                    postgresql_using='gin')
    op.create_index('idx_comparisons_history_filters_gin', 'comparisons_history', ['filters_applied'],
                    postgresql_using='gin')
    
    # Foreign key to users table
    op.create_foreign_key(
        'fk_comparisons_history_user',
        'comparisons_history', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade():
    """Drop comparisons_history table and all indexes"""
    op.drop_constraint('fk_comparisons_history_user', 'comparisons_history', type_='foreignkey')
    op.drop_index('idx_comparisons_history_filters_gin', table_name='comparisons_history')
    op.drop_index('idx_comparisons_history_items_gin', table_name='comparisons_history')
    op.drop_index('idx_comparisons_history_created', table_name='comparisons_history')
    op.drop_index('idx_comparisons_history_type', table_name='comparisons_history')
    op.drop_index('idx_comparisons_history_user_id', table_name='comparisons_history')
    op.drop_table('comparisons_history', schema='public')
