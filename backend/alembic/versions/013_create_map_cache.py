"""create map_cache table

Revision ID: 013
Revises: 012
Create Date: 2025-01-XX

Tabela para cache de GeoJSON para mapas interativos.
Melhora performance do Mapa Interativo (F04).
Armazena geometrias processadas do Mapbox.
TTL de 7-30 dias para dados geográficos.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

# revision identifiers, used by Alembic.
revision = '013_map_cache'
down_revision = '012_geographic_stats'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create map_cache table for GeoJSON cache"""
    
    op.create_table(
        'map_cache',
        
        # Primary Key
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        
        # Cache Key (hash of request parameters)
        sa.Column('cache_key', sa.String(64), nullable=False, unique=True, comment='SHA256 hash dos parâmetros do mapa'),
        
        # Map Configuration
        sa.Column('map_type', sa.String(50), nullable=False, comment='Tipo: municipios, estados, regioes, heatmap'),
        sa.Column('layer', sa.String(50), nullable=True, comment='Layer específico: boundaries, points, clusters'),
        sa.Column('zoom_level', sa.Integer, nullable=True, comment='Nível de zoom (1-20)'),
        sa.Column('simplification', sa.String(20), nullable=True, comment='Nível de simplificação: high, medium, low'),
        
        # Geographic Bounds
        sa.Column('bounds', JSONB, nullable=True, comment='Bounding box: {north, south, east, west}'),
        sa.Column('center', JSONB, nullable=True, comment='Centro do mapa: {lat, lng}'),
        
        # GeoJSON Data
        sa.Column('geojson_data', JSONB, nullable=False, comment='GeoJSON completo (FeatureCollection)'),
        sa.Column('properties_summary', JSONB, nullable=True, comment='Resumo das propriedades: min, max, avg'),
        
        # Data Source
        sa.Column('data_source', sa.String(100), nullable=True, comment='Fonte: mapbox, ibge, custom'),
        sa.Column('data_version', sa.String(50), nullable=True, comment='Versão dos dados geográficos'),
        
        # Cache Metadata
        sa.Column('file_size_bytes', sa.Integer, nullable=True, comment='Tamanho do GeoJSON em bytes'),
        sa.Column('features_count', sa.Integer, nullable=True, comment='Quantidade de features no GeoJSON'),
        sa.Column('generation_time_ms', sa.Integer, nullable=True, comment='Tempo de geração em milissegundos'),
        
        # TTL (Time To Live)
        sa.Column('expires_at', sa.DateTime, nullable=False, comment='Quando o cache expira (7-30 dias)'),
        
        # Statistics
        sa.Column('access_count', sa.Integer, nullable=False, default=0, comment='Quantas vezes foi acessado'),
        sa.Column('last_accessed_at', sa.DateTime, nullable=True, comment='Último acesso ao cache'),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime, nullable=False, default=datetime.utcnow),
        sa.Column('updated_at', sa.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow),
    )
    
    # Indexes for performance
    op.create_index('idx_map_cache_cache_key', 'map_cache', ['cache_key'], unique=True)
    op.create_index('idx_map_cache_map_type', 'map_cache', ['map_type'])
    op.create_index('idx_map_cache_layer', 'map_cache', ['layer'])
    op.create_index('idx_map_cache_zoom_level', 'map_cache', ['zoom_level'])
    op.create_index('idx_map_cache_expires_at', 'map_cache', ['expires_at'], postgresql_using='btree')  # Para limpeza de cache expirado
    op.create_index('idx_map_cache_created_at', 'map_cache', ['created_at'], postgresql_using='btree')
    
    # Composite indexes for common queries
    op.create_index('idx_map_cache_type_zoom', 'map_cache', ['map_type', 'zoom_level'])
    op.create_index('idx_map_cache_type_layer', 'map_cache', ['map_type', 'layer'])
    
    # GIN indexes for JSONB
    op.create_index('idx_map_cache_geojson', 'map_cache', ['geojson_data'], postgresql_using='gin')
    op.create_index('idx_map_cache_bounds', 'map_cache', ['bounds'], postgresql_using='gin')
    op.create_index('idx_map_cache_properties', 'map_cache', ['properties_summary'], postgresql_using='gin')


def downgrade() -> None:
    """Drop map_cache table"""
    op.drop_table('map_cache')
