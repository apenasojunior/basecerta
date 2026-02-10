"""create search_history table

Revision ID: 005_search_history
Revises: 004_user_preferences
Create Date: 2026-02-09 23:00:02.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '005_search_history'
down_revision = '004_user_preferences'
branch_labels = None
depends_on = None


def upgrade():
    """Create search_history table for ML personalization"""
    op.create_table(
        'search_history',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('query', sa.String(500), nullable=False,
                  comment='Search query text'),
        sa.Column('filters', JSONB(), nullable=True, default={},
                  comment='Applied filters (CNAE, state, capital range)'),
        sa.Column('results_count', sa.Integer(), nullable=False, default=0,
                  comment='Number of results returned'),
        sa.Column('clicked_result', sa.String(255), nullable=True,
                  comment='Which result was clicked (CNPJ or insight_key)'),
        sa.Column('session_id', sa.String(100), nullable=True,
                  comment='Browser session identifier'),
        sa.Column('ip_address', sa.String(45), nullable=True,
                  comment='User IP address (IPv4/IPv6)'),
        sa.Column('user_agent', sa.String(500), nullable=True,
                  comment='Browser user agent'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False,
                  comment='Search timestamp'),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_search_history_user_id', 'search_history', ['user_id'])
    op.create_index('idx_search_history_created_at', 'search_history', ['created_at'],
                    postgresql_using='btree', postgresql_ops={'created_at': 'DESC'})
    op.create_index('idx_search_history_session', 'search_history', ['session_id'])
    
    # Full-text search index on query
    op.execute('CREATE INDEX idx_search_history_query_fts ON search_history USING gin(to_tsvector(\'portuguese\', query))')
    
    # GIN index for JSONB filters
    op.create_index('idx_search_history_filters_gin', 'search_history', ['filters'],
                    postgresql_using='gin')
    
    # Foreign key to users table
    op.create_foreign_key(
        'fk_search_history_user',
        'search_history', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade():
    """Drop search_history table and all indexes"""
    op.drop_constraint('fk_search_history_user', 'search_history', type_='foreignkey')
    op.drop_index('idx_search_history_filters_gin', table_name='search_history')
    op.execute('DROP INDEX idx_search_history_query_fts')
    op.drop_index('idx_search_history_session', table_name='search_history')
    op.drop_index('idx_search_history_created_at', table_name='search_history')
    op.drop_index('idx_search_history_user_id', table_name='search_history')
    op.drop_table('search_history', schema='public')
