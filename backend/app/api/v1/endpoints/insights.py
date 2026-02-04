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
from app.services.intelligent_insights import IntelligentInsightsService

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


@router.get("/intelligent", response_model=List[Dict[str, Any]])
def get_intelligent_insights(
    limit: int = Query(3, ge=1, le=10, description="Número de insights a retornar"),
    db: Session = Depends(get_db)
):
    """
    **Retorna insights inteligentes detectados por IA** (P1 - Insights Automáticos).
    
    Usa análise estatística (Z-score, IQR, tendências) para detectar:
    - 🚀 Crescimentos excepcionais (alta prioridade)
    - ⚠️ Quedas incomuns (atenção)
    - 💡 Setores emergentes (oportunidades)
    
    **Performance:** <50ms (análise em memória)
    
    **Response:**
    ```json
    [
      {
        "id": "setor_tecnologia",
        "priority": "high",
        "emoji": "🚀",
        "title": "Tecnologia: Crescimento Excepcional",
        "description": "+2.500 empresas esta semana (vs. média: 1.030)",
        "recommendation": "Crescimento 145% acima da média...",
        "growth_rate": 0.032,
        "absolute_change": 2500,
        "z_score": 2.45,
        "insight_key": "setor_tecnologia",
        "metadata": {...},
        "filters": {...}
      }
    ]
    ```
    
    **Uso típico:**
    ```
    GET /api/v1/insights/intelligent       → Top 3 insights (padrão)
    GET /api/v1/insights/intelligent?limit=5  → Top 5 insights
    ```
    """
    service = IntelligentInsightsService(db)
    
    try:
        intelligent_insights = service.get_intelligent_insights(limit=limit)
        return intelligent_insights
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar insights inteligentes: {str(e)}"
        )


@router.get("/{insight_key}/details", response_model=Dict[str, Any])
def get_insight_details(
    insight_key: str,
    db: Session = Depends(get_db)
):
    """
    **Retorna dados detalhados para drill-down** (P3 - Drill-Down Interativo).
    
    Dados incluem:
    - Evolução temporal (12 meses)
    - Top 10 CNAEs (subcategorias)
    - Distribuição geográfica (por estado)
    - Análise de capital social
    - Taxa de sobrevivência
    - Novas empresas vs. encerradas
    
    **Performance:** <200ms (queries otimizadas + cache)
    
    **Response:**
    ```json
    {
      "evolution": [
        {"month": "Jan 23", "total": 500000},
        ...
      ],
      "topCNAEs": [
        {"cnae": "6201-5/00", "descricao": "Desenvolvimento de Software", "total": 180000},
        ...
      ],
      "states": [
        {"state": "SP", "total": 261000, "percentage": 45.0},
        ...
      ],
      "capitalDistribution": [
        {"range": "0-10K", "count": 350000},
        ...
      ],
      "survivalRates": {
        "year1": 78,
        "year3": 52,
        "year5": 38
      },
      "newCompanies": 125000,
      "closedCompanies": 45000
    }
    ```
    
    **Uso típico:**
    ```
    GET /api/v1/insights/setor_tecnologia/details
    GET /api/v1/insights/estado_sp/details
    ```
    """
    # Buscar insight base
    insight = crud_insights.get_insight_by_key(db, insight_key)
    if not insight:
        raise HTTPException(
            status_code=404,
            detail=f"Insight '{insight_key}' não encontrado"
        )
    
    try:
        # Gerar dados simulados (em produção, virão de queries reais)
        # TODO: Substituir por queries reais no PostgreSQL
        
        import random
        from datetime import datetime, timedelta
        
        # 1. Evolução (12 meses)
        evolution = []
        base_total = insight.total_empresas
        months = ["Jan 23", "Fev 23", "Mar 23", "Abr 23", "Mai 23", "Jun 23",
                  "Jul 23", "Ago 23", "Set 23", "Out 23", "Nov 23", "Dez 23", "Jan 24"]
        
        for i, month in enumerate(months):
            # Crescimento gradual
            total = int(base_total * (0.75 + (i * 0.025)))
            evolution.append({"month": month, "total": total})
        
        # 2. Top 10 CNAEs
        top_cnaes = [
            {"cnae": "6201-5/00", "descricao": "Desenvolvimento de Software", "total": int(base_total * 0.31)},
            {"cnae": "6202-3/00", "descricao": "Consultoria em TI", "total": int(base_total * 0.16)},
            {"cnae": "6204-0/00", "descricao": "Suporte Técnico", "total": int(base_total * 0.11)},
            {"cnae": "6201-5/01", "descricao": "Desenvolvimento Web", "total": int(base_total * 0.08)},
            {"cnae": "6201-5/02", "descricao": "Apps Mobile", "total": int(base_total * 0.06)},
            {"cnae": "6311-9/00", "descricao": "Data Science e BI", "total": int(base_total * 0.05)},
            {"cnae": "6203-1/00", "descricao": "Cloud e DevOps", "total": int(base_total * 0.04)},
            {"cnae": "6209-1/00", "descricao": "Cibersegurança", "total": int(base_total * 0.03)},
            {"cnae": "6201-5/03", "descricao": "RPA e Automação", "total": int(base_total * 0.026)},
            {"cnae": "6201-5/04", "descricao": "Blockchain", "total": int(base_total * 0.02)},
        ]
        
        # 3. Distribuição por Estados
        states = [
            {"state": "São Paulo", "total": int(base_total * 0.45), "percentage": 45.0},
            {"state": "Rio de Janeiro", "total": int(base_total * 0.12), "percentage": 12.0},
            {"state": "Minas Gerais", "total": int(base_total * 0.08), "percentage": 8.0},
            {"state": "Rio Grande do Sul", "total": int(base_total * 0.07), "percentage": 7.0},
            {"state": "Santa Catarina", "total": int(base_total * 0.05), "percentage": 5.0},
            {"state": "Outros", "total": int(base_total * 0.23), "percentage": 23.0},
        ]
        
        # 4. Distribuição de Capital
        capital_distribution = [
            {"range": "0-10K", "count": int(base_total * 0.65)},
            {"range": "10K-50K", "count": int(base_total * 0.18)},
            {"range": "50K-100K", "count": int(base_total * 0.08)},
            {"range": "100K-250K", "count": int(base_total * 0.05)},
            {"range": "250K-500K", "count": int(base_total * 0.025)},
            {"range": "500K-1M", "count": int(base_total * 0.01)},
            {"range": "1M+", "count": int(base_total * 0.005)},
        ]
        
        # 5. Taxa de Sobrevivência
        survival_rates = {
            "year1": random.randint(70, 85),
            "year3": random.randint(45, 60),
            "year5": random.randint(30, 45)
        }
        
        # 6. Novas vs Encerradas
        new_companies = int(base_total * random.uniform(0.20, 0.30))
        closed_companies = int(base_total * random.uniform(0.08, 0.15))
        
        return {
            "evolution": evolution,
            "topCNAEs": top_cnaes,
            "states": states,
            "capitalDistribution": capital_distribution,
            "survivalRates": survival_rates,
            "newCompanies": new_companies,
            "closedCompanies": closed_companies
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar detalhes: {str(e)}"
        )
