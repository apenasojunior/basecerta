"""
Schemas Pydantic para validação de dados de InsightCache.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal


class InsightCacheBase(BaseModel):
    """Schema base para InsightCache"""
    insight_key: str = Field(..., max_length=50, description="Chave única do insight")
    categoria: str = Field(..., description="Categoria: setor, estado ou capital")
    titulo: str = Field(..., max_length=200, description="Título exibido no card")
    total_empresas: int = Field(..., ge=0, description="Total de empresas neste segmento")
    percentual: Optional[Decimal] = Field(None, ge=0, le=100, description="Percentual do total (estados)")
    card_metadata: Dict[str, Any] = Field(default_factory=dict, description="Dados extras do card", alias="metadata")
    card_filters: Dict[str, Any] = Field(default_factory=dict, description="Filtros CNPJ para busca", alias="filters")
    
    @validator('categoria')
    def validate_categoria(cls, v):
        """Valida que categoria está entre valores permitidos"""
        if v not in ['setor', 'estado', 'capital']:
            raise ValueError("Categoria deve ser 'setor', 'estado' ou 'capital'")
        return v
    
    @validator('insight_key')
    def validate_insight_key(cls, v):
        """Valida formato da chave (sem espaços, lowercase)"""
        if ' ' in v or v != v.lower():
            raise ValueError("insight_key deve ser lowercase sem espaços")
        return v
    
    class Config:
        populate_by_name = True  # Permite usar tanto 'metadata' quanto 'card_metadata'


class InsightCacheCreate(InsightCacheBase):
    """Schema para criação de novo insight"""
    updated_by: str = Field(default="system", max_length=100)


class InsightCacheUpdate(BaseModel):
    """Schema para atualização de insight existente"""
    titulo: Optional[str] = Field(None, max_length=200)
    total_empresas: Optional[int] = Field(None, ge=0)
    percentual: Optional[Decimal] = Field(None, ge=0, le=100)
    card_metadata: Optional[Dict[str, Any]] = Field(None, alias="metadata")
    card_filters: Optional[Dict[str, Any]] = Field(None, alias="filters")
    updated_by: str = Field(default="system", max_length=100)


class InsightCacheInDB(InsightCacheBase):
    """Schema para leitura do banco"""
    id: int
    updated_at: datetime
    updated_by: str
    
    class Config:
        from_attributes = True
        populate_by_name = True  # Permite usar tanto 'metadata' quanto 'card_metadata'


class InsightCacheResponse(InsightCacheInDB):
    """
    Schema de resposta da API.
    Inclui todos os campos + indicador de staleness.
    """
    is_stale: bool = Field(
        default=False,
        description="True se cache está desatualizado (>7 dias)"
    )
    
    @validator('is_stale', always=True)
    def check_staleness(cls, v, values):
        """Calcula se cache está stale baseado em updated_at"""
        from datetime import datetime, timedelta, timezone
        updated_at = values.get('updated_at')
        if not updated_at:
            return True
        
        # Garante que ambos são timezone-aware
        now = datetime.now(timezone.utc)
        if updated_at.tzinfo is None:
            updated_at = updated_at.replace(tzinfo=timezone.utc)
        
        return (now - updated_at) > timedelta(days=7)


class InsightsList(BaseModel):
    """Lista de insights agrupados por categoria"""
    setores: List[InsightCacheResponse] = Field(default_factory=list)
    estados: List[InsightCacheResponse] = Field(default_factory=list)
    capital: List[InsightCacheResponse] = Field(default_factory=list)
    total: int = Field(..., description="Total de insights retornados")
    
    class Config:
        from_attributes = True
