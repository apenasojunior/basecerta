"""create insights_embeddings table

Revision ID: 015_insights_embeddings
Revises: 014_nlp_queries
Create Date: 2026-02-10

Tabela para armazenar embeddings vetoriais dos insights.
Usa pgvector para busca por similaridade semântica.
Suporta F05 - Busca NLP com consultas vetoriais.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '015_insights_embeddings'
down_revision = '014_nlp_queries'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create insights_embeddings table with pgvector support"""
    
    op.create_table(
        'insights_embeddings',
        
        # Primary Key
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        
        # Relationship with insights_cache
        sa.Column('insight_key', sa.String(100), sa.ForeignKey('insights_cache.insight_key', ondelete='CASCADE'),
                  nullable=False, unique=True, comment='Foreign key to insights_cache'),
        
        # Text Content (for embedding generation)
        sa.Column('title', sa.String(500), nullable=False, comment='Insight title'),
        sa.Column('description', sa.Text, nullable=False, comment='Full insight description'),
        sa.Column('content_hash', sa.String(64), nullable=False, comment='SHA256 hash of content for change detection'),
        
        # Embedding Vector (pgvector)
        # Using 768 dimensions for paraphrase-multilingual-mpnet-base-v2
        # Can be changed to 1536 for OpenAI text-embedding-3-small
        sa.Column('embedding', sa.String, nullable=False, comment='Vector embedding (pgvector type)'),
        
        # Model Metadata
        sa.Column('model_name', sa.String(200), nullable=False, comment='Model used: sentence-transformers/paraphrase-multilingual-mpnet-base-v2'),
        sa.Column('model_version', sa.String(50), nullable=True, comment='Model version/revision'),
        sa.Column('embedding_dimensions', sa.Integer, nullable=False, comment='Dimension count: 768 or 1536'),
        
        # Generation Metadata
        sa.Column('generation_method', sa.String(50), nullable=False, default='local', comment='Method: local, openai, cohere'),
        sa.Column('generation_time_ms', sa.Integer, nullable=True, comment='Time to generate embedding in milliseconds'),
        sa.Column('tokens_count', sa.Integer, nullable=True, comment='Number of tokens processed'),
        
        # Search Metadata (for debugging)
        sa.Column('search_tags', JSONB, nullable=True, comment='Tags for filtering: sector, state, metric'),
        sa.Column('metadata', JSONB, nullable=True, comment='Additional metadata'),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_at', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow),
    )
    
    # Convert embedding column to vector type using raw SQL
    # This must be done after table creation
    op.execute("""
        ALTER TABLE insights_embeddings 
        ALTER COLUMN embedding TYPE vector(768) USING embedding::vector(768)
    """)
    
    # Indexes for performance
    op.create_index('idx_insights_embeddings_insight_key', 'insights_embeddings', ['insight_key'], unique=True)
    op.create_index('idx_insights_embeddings_content_hash', 'insights_embeddings', ['content_hash'])
    op.create_index('idx_insights_embeddings_model', 'insights_embeddings', ['model_name'])
    op.create_index('idx_insights_embeddings_dimensions', 'insights_embeddings', ['embedding_dimensions'])
    op.create_index('idx_insights_embeddings_created_at', 'insights_embeddings', ['created_at'], postgresql_using='btree')
    
    # GIN index for search_tags
    op.create_index('idx_insights_embeddings_search_tags', 'insights_embeddings', ['search_tags'], postgresql_using='gin')
    op.create_index('idx_insights_embeddings_metadata', 'insights_embeddings', ['metadata'], postgresql_using='gin')
    
    # Vector similarity indexes using pgvector
    # HNSW index for fast approximate nearest neighbor search
    op.execute("""
        CREATE INDEX idx_insights_embeddings_vector_hnsw 
        ON insights_embeddings 
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64)
    """)
    
    # IVFFlat index for large-scale similarity search (alternative)
    # Commented out - use HNSW for better performance on smaller datasets
    # op.execute("""
    #     CREATE INDEX idx_insights_embeddings_vector_ivfflat 
    #     ON insights_embeddings 
    #     USING ivfflat (embedding vector_cosine_ops)
    #     WITH (lists = 100)
    # """)


def downgrade() -> None:
    """Drop insights_embeddings table"""
    op.drop_table('insights_embeddings')
