"""create favorite_categories table

Revision ID: 011_favorite_categories
Revises: 010_create_favorites
Create Date: 2026-02-09 23:00:08.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision = '011_favorite_categories'
down_revision = '010_create_favorites'
branch_labels = None
depends_on = None


def upgrade():
    """Create favorite_categories table for organizing favorites"""
    op.create_table(
        'favorite_categories',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('name', sa.String(100), nullable=False,
                  comment='Category name (e.g., "Prospecção Q1 2026")'),
        sa.Column('description', sa.Text(), nullable=True,
                  comment='Optional description'),
        sa.Column('color', sa.String(7), nullable=True,
                  comment='Hex color code for UI (#FF5733)'),
        sa.Column('icon', sa.String(50), nullable=True,
                  comment='Icon identifier (emoji or icon name)'),
        sa.Column('is_auto_categorized', sa.Boolean(), nullable=False, default=False,
                  comment='Created by ML auto-categorization'),
        sa.Column('auto_rules', sa.Text(), nullable=True,
                  comment='Rules for auto-categorization (if ML-generated)'),
        sa.Column('sort_order', sa.Integer(), nullable=False, default=0,
                  comment='Display order (user-defined)'),
        sa.Column('items_count', sa.Integer(), nullable=False, default=0,
                  comment='Number of favorites in this category'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), 
                  onupdate=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_favorite_categories_user_id', 'favorite_categories', ['user_id'])
    op.create_index('idx_favorite_categories_name', 'favorite_categories', ['name'])
    op.create_index('idx_favorite_categories_auto', 'favorite_categories', ['is_auto_categorized'])
    op.create_index('idx_favorite_categories_sort', 'favorite_categories', ['sort_order'])
    
    # Composite unique index (user cannot have duplicate category names)
    op.create_index('idx_favorite_categories_user_name_unique', 'favorite_categories',
                    ['user_id', 'name'], unique=True)
    
    # Foreign key to users table
    op.create_foreign_key(
        'fk_favorite_categories_user',
        'favorite_categories', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )
    
    # Foreign key from favorites to favorite_categories
    op.create_foreign_key(
        'fk_favorites_category',
        'favorites', 'favorite_categories',
        ['category_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade():
    """Drop favorite_categories table and all indexes"""
    op.drop_constraint('fk_favorites_category', 'favorites', type_='foreignkey')
    op.drop_constraint('fk_favorite_categories_user', 'favorite_categories', type_='foreignkey')
    op.drop_index('idx_favorite_categories_user_name_unique', table_name='favorite_categories')
    op.drop_index('idx_favorite_categories_sort', table_name='favorite_categories')
    op.drop_index('idx_favorite_categories_auto', table_name='favorite_categories')
    op.drop_index('idx_favorite_categories_name', table_name='favorite_categories')
    op.drop_index('idx_favorite_categories_user_id', table_name='favorite_categories')
    op.drop_table('favorite_categories', schema='public')
