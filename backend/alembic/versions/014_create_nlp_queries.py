"""create nlp_queries table

Revision ID: 014_nlp_queries
Revises: 013_map_cache
Create Date: 2026-02-10

Tabela para cache de queries NLP processadas.
Armazena intent extraction, entidades, e resultados.
Suporta F05 - Busca em Linguagem Natural.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, ARRAY, UUID
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '014_nlp_queries'
down_revision = '013_map_cache'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create nlp_queries table for NLP query cache and intent extraction"""
    
    op.create_table(
        'nlp_queries',
        
        # Primary Key
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        
        # User Relationship (optional for anonymous queries)
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), 
                  nullable=True, comment='User who made the query (NULL for anonymous)'),
        
        # Query Data
        sa.Column('query_text', sa.Text, nullable=False, comment='Original user query in natural language'),
        sa.Column('query_normalized', sa.Text, nullable=True, comment='Normalized/cleaned query text'),
        sa.Column('language', sa.String(5), nullable=False, default='pt-BR', comment='Detected language code'),
        
        # NLP Processing
        sa.Column('intent', sa.String(100), nullable=True, comment='Detected intent: search, compare, trend, anomaly, etc.'),
        sa.Column('confidence', sa.Numeric(3, 2), nullable=True, comment='Intent confidence score (0-1)'),
        sa.Column('entities', JSONB, nullable=True, comment='Extracted entities: sectors, states, metrics, dates'),
        sa.Column('keywords', ARRAY(sa.String(100)), nullable=True, comment='Extracted keywords for search'),
        
        # Processing Metadata
        sa.Column('processing_time_ms', sa.Integer, nullable=True, comment='NLP processing time in milliseconds'),
        sa.Column('model_version', sa.String(50), nullable=True, comment='NLP model version used'),
        sa.Column('tokens_count', sa.Integer, nullable=True, comment='Number of tokens in query'),
        
        # Results
        sa.Column('results_count', sa.Integer, nullable=False, default=0, comment='Number of results returned'),
        sa.Column('insights_matched', ARRAY(sa.String(100)), nullable=True, comment='Array of matched insight_keys'),
        sa.Column('response_data', JSONB, nullable=True, comment='Cached response data'),
        
        # User Interaction
        sa.Column('clicked_result', sa.String(100), nullable=True, comment='Which result was clicked (insight_key)'),
        sa.Column('satisfaction_score', sa.Integer, nullable=True, comment='User satisfaction: 1-5 stars'),
        sa.Column('feedback', sa.Text, nullable=True, comment='User feedback on results'),
        
        # Session Tracking
        sa.Column('session_id', sa.String(36), nullable=True, comment='Session identifier for query grouping'),
        sa.Column('ip_address', sa.String(45), nullable=True, comment='User IP address (IPv4 or IPv6)'),
        sa.Column('user_agent', sa.String(500), nullable=True, comment='Browser/client user agent'),
        
        # TTL Cache
        sa.Column('expires_at', sa.DateTime, nullable=True, comment='When cached response expires'),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_at', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow),
    )
    
    # Indexes for performance
    op.create_index('idx_nlp_queries_user_id', 'nlp_queries', ['user_id'])
    op.create_index('idx_nlp_queries_intent', 'nlp_queries', ['intent'])
    op.create_index('idx_nlp_queries_language', 'nlp_queries', ['language'])
    op.create_index('idx_nlp_queries_session', 'nlp_queries', ['session_id'])
    op.create_index('idx_nlp_queries_created_at', 'nlp_queries', ['created_at'], postgresql_using='btree')
    op.create_index('idx_nlp_queries_expires_at', 'nlp_queries', ['expires_at'], postgresql_using='btree')
    
    # Full-text search index on query_text (Portuguese)
    op.execute("""
        CREATE INDEX idx_nlp_queries_query_text_fts 
        ON nlp_queries 
        USING GIN (to_tsvector('portuguese', query_text))
    """)
    
    # Full-text search index on query_normalized
    op.execute("""
        CREATE INDEX idx_nlp_queries_normalized_fts 
        ON nlp_queries 
        USING GIN (to_tsvector('portuguese', COALESCE(query_normalized, query_text)))
    """)
    
    # GIN indexes for JSONB and ARRAY
    op.create_index('idx_nlp_queries_entities', 'nlp_queries', ['entities'], postgresql_using='gin')
    op.create_index('idx_nlp_queries_keywords', 'nlp_queries', ['keywords'], postgresql_using='gin')
    op.create_index('idx_nlp_queries_insights_matched', 'nlp_queries', ['insights_matched'], postgresql_using='gin')
    op.create_index('idx_nlp_queries_response_data', 'nlp_queries', ['response_data'], postgresql_using='gin')
    
    # Composite index for common queries
    op.create_index('idx_nlp_queries_intent_lang', 'nlp_queries', ['intent', 'language'])


def downgrade() -> None:
    """Drop nlp_queries table"""
    op.drop_table('nlp_queries')
