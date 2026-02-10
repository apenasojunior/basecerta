"""create user_preferences table

Revision ID: 004_user_preferences
Revises: 003_create_users
Create Date: 2026-02-09 23:00:01.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

# revision identifiers, used by Alembic.
revision = '004_user_preferences'
down_revision = '003_create_users'
branch_labels = None
depends_on = None


def upgrade():
    """Create user_preferences table for dashboard personalization"""
    op.create_table(
        'user_preferences',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', UUID(as_uuid=True), nullable=False,
                  comment='Reference to users.id'),
        sa.Column('dashboard_layout', JSONB(), nullable=True, default={},
                  comment='Saved dashboard layout configuration'),
        sa.Column('favorite_sectors', ARRAY(sa.String()), nullable=True, default=[],
                  comment='List of favorite CNAE sectors'),
        sa.Column('favorite_states', ARRAY(sa.String(2)), nullable=True, default=[],
                  comment='List of favorite state codes (UF)'),
        sa.Column('favorite_cities', ARRAY(sa.String()), nullable=True, default=[],
                  comment='List of favorite city names'),
        sa.Column('default_filters', JSONB(), nullable=True, default={},
                  comment='Default filters for searches'),
        sa.Column('notifications_enabled', sa.Boolean(), nullable=False, default=True,
                  comment='Email notifications enabled'),
        sa.Column('theme', sa.String(20), nullable=False, default='light',
                  comment='UI theme: light, dark, auto'),
        sa.Column('language', sa.String(5), nullable=False, default='pt-BR',
                  comment='Interface language'),
        sa.Column('insights_frequency', sa.String(20), nullable=False, default='weekly',
                  comment='How often to receive insights: daily, weekly, monthly'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), 
                  onupdate=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_user_preferences_user_id', 'user_preferences', ['user_id'], unique=True)
    op.create_index('idx_user_preferences_theme', 'user_preferences', ['theme'])
    
    # GIN indexes for JSONB and ARRAY
    op.create_index('idx_user_preferences_layout_gin', 'user_preferences', ['dashboard_layout'],
                    postgresql_using='gin')
    op.create_index('idx_user_preferences_filters_gin', 'user_preferences', ['default_filters'],
                    postgresql_using='gin')
    op.create_index('idx_user_preferences_sectors_gin', 'user_preferences', ['favorite_sectors'],
                    postgresql_using='gin')
    op.create_index('idx_user_preferences_states_gin', 'user_preferences', ['favorite_states'],
                    postgresql_using='gin')
    
    # Foreign key to users table
    op.create_foreign_key(
        'fk_user_preferences_user',
        'user_preferences', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade():
    """Drop user_preferences table and all indexes"""
    op.drop_constraint('fk_user_preferences_user', 'user_preferences', type_='foreignkey')
    op.drop_index('idx_user_preferences_states_gin', table_name='user_preferences')
    op.drop_index('idx_user_preferences_sectors_gin', table_name='user_preferences')
    op.drop_index('idx_user_preferences_filters_gin', table_name='user_preferences')
    op.drop_index('idx_user_preferences_layout_gin', table_name='user_preferences')
    op.drop_index('idx_user_preferences_theme', table_name='user_preferences')
    op.drop_index('idx_user_preferences_user_id', table_name='user_preferences')
    op.drop_table('user_preferences', schema='public')
