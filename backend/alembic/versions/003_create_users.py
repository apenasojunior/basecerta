"""create users table

Revision ID: 003_create_users
Revises: 002_insights_history
Create Date: 2026-02-09 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

# revision identifiers, used by Alembic.
revision = '003_create_users'
down_revision = '002_insights_history'
branch_labels = None
depends_on = None


def upgrade():
    """Create users table for authentication and personalization"""
    op.create_table(
        'users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
                  comment='Unique user identifier (UUID)'),
        sa.Column('email', sa.String(255), nullable=False, unique=True,
                  comment='User email (login)'),
        sa.Column('nome', sa.String(255), nullable=False,
                  comment='Full name'),
        sa.Column('empresa', sa.String(255), nullable=True,
                  comment='Company name (optional)'),
        sa.Column('cargo', sa.String(100), nullable=True,
                  comment='Job title (optional)'),
        sa.Column('telefone', sa.String(20), nullable=True,
                  comment='Phone number'),
        sa.Column('password_hash', sa.String(255), nullable=False,
                  comment='Hashed password (bcrypt)'),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True,
                  comment='Account status'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, default=False,
                  comment='Email verification status'),
        sa.Column('role', sa.String(20), nullable=False, default='user',
                  comment='User role: user, admin, premium'),
        sa.Column('plano', sa.String(20), nullable=False, default='free',
                  comment='Subscription plan: free, basic, premium'),
        sa.Column('onboarding_completed', sa.Boolean(), nullable=False, default=False,
                  comment='Whether user completed onboarding'),
        sa.Column('metadata', JSONB(), nullable=True, default={},
                  comment='Additional user metadata'),
        sa.Column('last_login', sa.DateTime(), nullable=True,
                  comment='Last login timestamp'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), 
                  onupdate=sa.text('NOW()'), nullable=False),
        schema='public'
    )
    
    # Create indexes
    op.create_index('idx_users_email', 'users', ['email'], unique=True)
    op.create_index('idx_users_role', 'users', ['role'])
    op.create_index('idx_users_plano', 'users', ['plano'])
    op.create_index('idx_users_is_active', 'users', ['is_active'])
    op.create_index('idx_users_created_at', 'users', ['created_at'])
    
    # GIN index for JSONB metadata
    op.create_index('idx_users_metadata_gin', 'users', ['metadata'],
                    postgresql_using='gin')


def downgrade():
    """Drop users table and all indexes"""
    op.drop_index('idx_users_metadata_gin', table_name='users')
    op.drop_index('idx_users_created_at', table_name='users')
    op.drop_index('idx_users_is_active', table_name='users')
    op.drop_index('idx_users_plano', table_name='users')
    op.drop_index('idx_users_role', table_name='users')
    op.drop_index('idx_users_email', table_name='users')
    op.drop_table('users', schema='public')
