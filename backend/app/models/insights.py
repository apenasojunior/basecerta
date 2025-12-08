"""
Modelo para cache de insights/estatísticas pré-calculadas.
Usado para carregamento rápido da página inicial Smart CNPJ.
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.core.database import Base


class InsightCache(Base):
    """
    Cache de estatísticas pré-calculadas para página inicial.
    
    Atualizado semanalmente via cron job para garantir performance
    (página carrega em < 10ms sem queries pesadas no CNPJ).
    
    Attributes:
        id: ID único do insight
        insight_key: Chave única identificadora (ex: 'setor_saude', 'estado_sp')
        categoria: Tipo do insight ('setor', 'estado', 'capital')
        titulo: Título exibido no card
        total_empresas: Quantidade total de empresas neste insight
        percentual: Percentual em relação ao total (usado para estados)
        metadata: Dados extras do card (icone, demanda_score, o_que_compram, etc)
        filters: Filtros CNPJ para aplicar quando usuário clicar no card
        updated_at: Timestamp da última atualização
        updated_by: Usuário/sistema que atualizou
    """
    __tablename__ = "insights_cache"
    __table_args__ = (
        CheckConstraint(
            "categoria IN ('setor', 'estado', 'capital')",
            name='categoria_check'
        ),
        {'schema': 'public'}
    )
    
    id = Column(Integer, primary_key=True, index=True)
    insight_key = Column(String(50), unique=True, nullable=False, index=True)
    categoria = Column(String(20), nullable=False, index=True)
    titulo = Column(String(200), nullable=False)
    total_empresas = Column(Integer, nullable=False)
    percentual = Column(Numeric(5, 2), nullable=True)
    
    # JSONB fields para flexibilidade (renomeado de 'metadata' para evitar conflito com SQLAlchemy)
    card_metadata = Column('metadata', JSONB, nullable=False, default={})
    card_filters = Column('filters', JSONB, nullable=False, default={})
    
    # Auditoria
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        index=True
    )
    updated_by = Column(String(100), server_default='system')
    
    def __repr__(self):
        return f"<InsightCache({self.insight_key}: {self.total_empresas:,} empresas)>"
    
    @property
    def is_stale(self):
        """Verifica se cache está desatualizado (>7 dias)"""
        from datetime import datetime, timedelta
        if not self.updated_at:
            return True
        return (datetime.now() - self.updated_at) > timedelta(days=7)
