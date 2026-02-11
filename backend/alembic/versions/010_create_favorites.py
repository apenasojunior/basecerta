"""create favorites table

Revision ID: 010_create_favorites
Revises: 009_comparison_cache
Create Date: 2026-02-09 23:00:07.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

# revision identifiers, used by Alembic.
revision = '010_create_favorites'
down_revision = '009_comparison_cache'
branch_labels = None
depends_on = None


def upgrade():
    """Create favorites table for user bookmarks"""
    op.create_table(
        'favorites',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('favorite_type', sa.String(50), nullable=False,
                  comment='Type: insight, company, person, search'),
        sa.Column('item_key', sa.String(255), nullable=False,
                  comment='Identifier: insight_key, CNPJ, CPF, or search_hash'),
        sa.Column('item_title', sa.String(500), nullable=True,
                  comment='Display title for UI'),
        sa.Column('item_metadata', JSONB(), nullable=True, default={},
                  comment='Cached metadata about the item'),
        sa.Column('category_id', sa.Integer(), nullable=True,
                  comment='Reference to favorite_categories.id (optional)'),
        sa.Column('notes', sa.Text(), nullable=True,
                  comment='User notes about this favorite'),
        sa.Column('tags', sa.ARRAY(sa.String()), nullable=True, default=[],
                  comment='User-defined tags'),
        sa.Column('notification_enabled', sa.Boolean(), nullable=False, default=False,
                  comment='Alert on changes to this item'),
        sa.Column('is_pinned', sa.Boolean(), nullable=False, default=False,
                  comment='Pinned to top of list'),
        sa.Column('accessed_count', sa.Integer(), nullable=False, default=0,
                  comment='Number of times accessed'),
        sa.Column('last_accessed_at', sa.DateTime(), nullable=True,
                  comment='Last access timestamp'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), 
                  onupdate=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_favorites_user_id', 'favorites', ['user_id'])
    op.create_index('idx_favorites_type', 'favorites', ['favorite_type'])
    op.create_index('idx_favorites_item_key', 'favorites', ['item_key'])
    op.create_index('idx_favorites_category', 'favorites', ['category_id'])
    op.create_index('idx_favorites_pinned', 'favorites', ['is_pinned'])
    op.create_index('idx_favorites_created', 'favorites', ['created_at'],
                    postgresql_using='btree', postgresql_ops={'created_at': 'DESC'})
    
    # Composite unique index (user cannot favorite same item twice)
    op.create_index('idx_favorites_user_item_unique', 'favorites',
                    ['user_id', 'favorite_type', 'item_key'], unique=True)
    
    # GIN indexes for JSONB and arrays
    op.create_index('idx_favorites_metadata_gin', 'favorites', ['item_metadata'],
                    postgresql_using='gin')
    op.create_index('idx_favorites_tags_gin', 'favorites', ['tags'],
                    postgresql_using='gin')
    
    # Full-text search on notes
    op.execute('CREATE INDEX idx_favorites_notes_fts ON favorites USING gin(to_tsvector(\'portuguese\', COALESCE(notes, \'\')))')
    
    # Foreign key to users table
    op.create_foreign_key(
        'fk_favorites_user',
        'favorites', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade():
    """Drop favorites table and all indexes"""
    op.drop_constraint('fk_favorites_user', 'favorites', type_='foreignkey')
    op.execute('DROP INDEX idx_favorites_notes_fts')
    op.drop_index('idx_favorites_tags_gin', table_name='favorites')
    op.drop_index('idx_favorites_metadata_gin', table_name='favorites')
    op.drop_index('idx_favorites_user_item_unique', table_name='favorites')
    op.drop_index('idx_favorites_created', table_name='favorites')
    op.drop_index('idx_favorites_pinned', table_name='favorites')
    op.drop_index('idx_favorites_category', table_name='favorites')
    op.drop_index('idx_favorites_item_key', table_name='favorites')
    op.drop_index('idx_favorites_type', table_name='favorites')
    op.drop_index('idx_favorites_user_id', table_name='favorites')
    op.drop_table('favorites', schema='public')
