"""
Endpoints da API para insights (estatísticas em cache).
Performance otimizada: < 10ms para listar todos os insights.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.core.database import get_db
from app.schemas.insights import (
    InsightCacheInDB,  # Mudamos de Response para InDB
    InsightsList,
    InsightCacheCreate,
    InsightCacheUpdate
)
from app.crud import insights as crud_insights

router = APIRouter()


def insight_to_dict(insight):
    """Converte InsightCache para dict, renomeando card_metadata para metadata"""
    return {
        "id": insight.id,
        "insight_key": insight.insight_key,
        "categoria": insight.categoria,
        "titulo": insight.titulo,
        "total_empresas": insight.total_empresas,
        "percentual": float(insight.percentual) if insight.percentual else None,
        "metadata": insight.card_metadata,  # Renomeia para 'metadata' na resposta
        "filters": insight.card_filters,  # Renomeia para 'filters' na resposta
        "updated_at": insight.updated_at.isoformat() if insight.updated_at else None,
        "updated_by": insight.updated_by
    }


@router.get("/", response_model=List[Dict[str, Any]])  # Mudamos para Dict genérico
def list_insights(
    categoria: Optional[str] = Query(
        None,
        description="Filtrar por categoria: 'setor', 'estado' ou 'capital'"
    ),
    skip: int = Query(0, ge=0, description="Registros para pular (paginação)"),
    limit: int = Query(100, ge=1, le=100, description="Máximo de registros"),
    db: Session = Depends(get_db)
):
    """
    **Lista todos os insights do cache** (carregamento rápido da página).
    
    Esta rota é otimizada para performance (<10ms) pois lê diretamente
    do cache sem fazer joins ou queries pesadas no CNPJ.
    
    **Parâmetros:**
    - `categoria` (opcional): Filtrar por 'setor', 'estado' ou 'capital'
    - `skip` (opcional): Paginação - registros para pular
    - `limit` (opcional): Limite de registros (max 100)
    
    **Response:**
    - Lista de insights com metadata completa para renderizar cards
    - Cada insight contém: total_empresas, metadata (ícone, demanda, etc), filters
    
    **Uso típico:**
    ```
    GET /api/v1/insights              → Todos os insights
    GET /api/v1/insights?categoria=setor  → Apenas setores
    GET /api/v1/insights?categoria=estado → Apenas estados
    ```
    """
    if categoria:
        # Valida categoria
        if categoria not in ['setor', 'estado', 'capital']:
            raise HTTPException(
                status_code=400,
                detail="Categoria inválida. Use: 'setor', 'estado' ou 'capital'"
            )
        insights = crud_insights.get_insights_by_categoria(db, categoria, skip, limit)
    else:
        insights = crud_insights.get_all_insights(db, skip, limit)
    
    return [insight_to_dict(i) for i in insights]


@router.get("/grouped", response_model=Dict[str, Any])  # Dict genérico
def list_insights_grouped(
    db: Session = Depends(get_db)
):
    """
    **Lista insights agrupados por categoria.**
    
    Útil para renderizar página com 3 seções distintas:
    - Setores Lucrativos (6 cards)
    - TOP 5 Estados (5 cards)
    - Por Capital Social (4 cards)
    
    **Response:**
    ```json
    {
      "setores": [...],
      "estados": [...],
      "capital": [...],
      "total": 15
    }
    ```
    """
    setores = crud_insights.get_insights_by_categoria(db, 'setor')
    estados = crud_insights.get_insights_by_categoria(db, 'estado')
    capital = crud_insights.get_insights_by_categoria(db, 'capital')
    
    return {
        "setores": [insight_to_dict(i) for i in setores],
        "estados": [insight_to_dict(i) for i in estados],
        "capital": [insight_to_dict(i) for i in capital],
        "total": len(setores) + len(estados) + len(capital)
    }


@router.get("/{insight_key}", response_model=Dict[str, Any])  # Dict genérico
def get_insight_detail(
    insight_key: str,
    db: Session = Depends(get_db)
):
    """
    **Retorna detalhes de um insight específico.**
    
    **Parâmetros:**
    - `insight_key`: Chave única (ex: 'setor_saude', 'estado_sp', 'capital_10m_plus')
    
    **Exemplo:**
    ```
    GET /api/v1/insights/setor_saude
    ```
    
    **Response:**
    - Insight completo com metadata e filters
    - Use o campo `filters` para construir query de busca real
    """
    insight = crud_insights.get_insight_by_key(db, insight_key)
    if not insight:
        raise HTTPException(
            status_code=404,
            detail=f"Insight '{insight_key}' não encontrado"
        )
    return insight_to_dict(insight)


@router.post("/", response_model=Dict[str, Any], status_code=201)  # Dict genérico
def create_insight(
    insight: InsightCacheCreate,
    db: Session = Depends(get_db)
):
    """
    **Cria novo insight no cache.**
    
    **Uso:** Apenas para scripts de população/atualização do cache.
    
    **Body:**
    ```json
    {
      "insight_key": "setor_tech",
      "categoria": "setor",
      "titulo": "Tecnologia",
      "total_empresas": 50000,
      "metadata": {...},
      "filters": {...}
    }
    ```
    """
    # Verifica se já existe
    existing = crud_insights.get_insight_by_key(db, insight.insight_key)
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Insight '{insight.insight_key}' já existe. Use PUT para atualizar."
        )
    
    try:
        created = crud_insights.create_insight(db, insight)
        return insight_to_dict(created)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{insight_key}", response_model=Dict[str, Any])  # Dict genérico
def update_insight(
    insight_key: str,
    insight_update: InsightCacheUpdate,
    db: Session = Depends(get_db)
):
    """
    **Atualiza insight existente no cache.**
    
    **Uso:** Scripts de atualização semanal do cache.
    
    **Body:** Campos a atualizar (parcial)
    ```json
    {
      "total_empresas": 59513,
      "updated_by": "cron_weekly"
    }
    ```
    """
    updated = crud_insights.update_insight(db, insight_key, insight_update)
    if not updated:
        raise HTTPException(
            status_code=404,
            detail=f"Insight '{insight_key}' não encontrado"
        )
    return insight_to_dict(updated)


@router.delete("/{insight_key}", status_code=204)
def delete_insight(
    insight_key: str,
    db: Session = Depends(get_db)
):
    """
    **Remove insight do cache.**
    
    **Uso:** Limpeza de insights obsoletos.
    """
    deleted = crud_insights.delete_insight(db, insight_key)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail=f"Insight '{insight_key}' não encontrado"
        )
    return None


@router.get("/health/stale")
def check_stale_insights(
    days: int = Query(7, ge=1, le=30, description="Dias para considerar stale"),
    db: Session = Depends(get_db)
):
    """
    **Verifica insights desatualizados** (não atualizados há X dias).
    
    Útil para monitoramento e alertas.
    
    **Response:**
    ```json
    {
      "stale_count": 3,
      "stale_insights": ["setor_saude", "estado_sp", "capital_10m_plus"],
      "threshold_days": 7
    }
    ```
    """
    stale = crud_insights.get_stale_insights(db, days)
    
    return {
        "stale_count": len(stale),
        "stale_insights": [i.insight_key for i in stale],
        "threshold_days": days,
        "oldest_update": stale[0].updated_at if stale else None
    }
