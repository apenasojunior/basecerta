"""
Modelo para cache de insights/estatísticas pré-calculadas.
Usado para carregamento rápido da página inicial Smart CNPJ.
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, Float, CheckConstraint
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
        categoria: Tipo do insight ('setor', 'estado', 'capital', 'idade')
        titulo: Título exibido no card
        descricao: Descrição detalhada do insight
        total_empresas: Quantidade total de empresas neste insight
        percentual: Percentual em relação ao total
        valor_medio: Valor médio (capital, funcionários, etc.)
        taxa_crescimento: Taxa de crescimento (%)
        classificacao_anomalia: Classificação de anomalia (high_growth, attention, emerging)
        z_score: Z-score para detecção de anomalias
        prioridade_score: Score de prioridade para ranking (0-100)
        metadata: Dados extras do card (CNAEs, regiões, etc.)
        filtros: Filtros CNPJ para aplicar quando usuário clicar
        created_at: Timestamp de criação
        updated_at: Timestamp da última atualização
    """
    __tablename__ = "insights_cache"
    __table_args__ = {'schema': 'public'}
    
    id = Column(Integer, primary_key=True, index=True)
    insight_key = Column(String(255), unique=True, nullable=False, index=True)
    categoria = Column(String(50), nullable=False, index=True)
    titulo = Column(String(255), nullable=False)
    descricao = Column(String, nullable=True)
    total_empresas = Column(Integer, nullable=False, default=0)
    percentual = Column(Numeric(10, 2), nullable=False, default=0.0)
    valor_medio = Column(Numeric(15, 2), nullable=True)
    taxa_crescimento = Column(Numeric(10, 2), nullable=True)
    classificacao_anomalia = Column(String(50), nullable=True)
    z_score = Column(Numeric(10, 2), nullable=True)
    prioridade_score = Column(Numeric(10, 2), nullable=True)
    
    # JSONB fields
    card_metadata = Column('metadata', JSONB, nullable=True, default={})
    card_filters = Column('filtros', JSONB, nullable=True, default={})
    
    # Timestamps automáticos
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    def __repr__(self):
        return f"<InsightCache({self.insight_key}: {self.total_empresas:,} empresas)>"


class InsightHistory(Base):
    """
    Histórico de evolução temporal dos insights (12+ meses).
    
    Armazena snapshots mensais para gerar gráficos de evolução temporal.
    
    Attributes:
        id: ID único do registro histórico
        insight_key: Referência ao insight (FK para insights_cache.insight_key)
        data_referencia: Data de referência do snapshot (primeiro dia do mês)
        total_empresas: Total de empresas naquele momento
        percentual: Percentual em relação ao total naquele momento
        valor_medio: Valor médio (capital, funcionários, etc.)
        variacao_mensal: Variação percentual em relação ao mês anterior
        variacao_anual: Variação percentual em relação ao mesmo mês do ano anterior
        created_at: Timestamp de criação do registro
    """
    __tablename__ = "insights_history"
    __table_args__ = {'schema': 'public'}
    
    id = Column(Integer, primary_key=True, index=True)
    insight_key = Column(String(255), nullable=False, index=True)
    data_referencia = Column(Date, nullable=False, index=True)
    total_empresas = Column(Integer, nullable=False, default=0)
    percentual = Column(Float, nullable=False, default=0.0)
    valor_medio = Column(Float, nullable=True)
    variacao_mensal = Column(Float, nullable=True)
    variacao_anual = Column(Float, nullable=True)
    
    # Timestamp automático
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    def __repr__(self):
        return f"<InsightHistory({self.insight_key} @ {self.data_referencia}: {self.total_empresas:,})>"
