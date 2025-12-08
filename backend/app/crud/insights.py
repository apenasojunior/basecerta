"""
CRUD operations para InsightCache.
Operações de leitura/escrita no cache de insights.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional, Dict, Any
from app.models.insights import InsightCache
from app.schemas.insights import InsightCacheCreate, InsightCacheUpdate


def get_all_insights(db: Session, skip: int = 0, limit: int = 100) -> List[InsightCache]:
    """
    Retorna todos os insights ordenados por categoria e ID.
    
    Args:
        db: Sessão do banco de dados
        skip: Quantidade de registros para pular (paginação)
        limit: Limite máximo de registros
    
    Returns:
        Lista de InsightCache ordenada
    """
    return db.query(InsightCache).order_by(
        InsightCache.categoria,
        InsightCache.id
    ).offset(skip).limit(limit).all()


def get_insights_by_categoria(
    db: Session, 
    categoria: str,
    skip: int = 0,
    limit: int = 100
) -> List[InsightCache]:
    """
    Retorna insights de uma categoria específica.
    
    Args:
        db: Sessão do banco de dados
        categoria: 'setor', 'estado' ou 'capital'
        skip: Quantidade de registros para pular
        limit: Limite máximo de registros
    
    Returns:
        Lista filtrada de InsightCache
    """
    return db.query(InsightCache).filter(
        InsightCache.categoria == categoria
    ).order_by(InsightCache.id).offset(skip).limit(limit).all()


def get_insight_by_key(db: Session, insight_key: str) -> Optional[InsightCache]:
    """
    Retorna um insight específico pela chave única.
    
    Args:
        db: Sessão do banco de dados
        insight_key: Chave única do insight (ex: 'setor_saude')
    
    Returns:
        InsightCache ou None se não encontrado
    """
    return db.query(InsightCache).filter(
        InsightCache.insight_key == insight_key
    ).first()


def get_insight_by_id(db: Session, insight_id: int) -> Optional[InsightCache]:
    """
    Retorna um insight pelo ID.
    
    Args:
        db: Sessão do banco de dados
        insight_id: ID do insight
    
    Returns:
        InsightCache ou None se não encontrado
    """
    return db.query(InsightCache).filter(
        InsightCache.id == insight_id
    ).first()


def create_insight(db: Session, insight: InsightCacheCreate) -> InsightCache:
    """
    Cria novo insight no cache.
    
    Args:
        db: Sessão do banco de dados
        insight: Dados do insight a ser criado
    
    Returns:
        InsightCache criado
    
    Raises:
        IntegrityError: Se insight_key já existe
    """
    db_insight = InsightCache(**insight.model_dump())
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)
    return db_insight


def update_insight(
    db: Session, 
    insight_key: str, 
    insight_update: InsightCacheUpdate
) -> Optional[InsightCache]:
    """
    Atualiza insight existente.
    
    Args:
        db: Sessão do banco de dados
        insight_key: Chave do insight a atualizar
        insight_update: Dados para atualizar
    
    Returns:
        InsightCache atualizado ou None se não encontrado
    """
    db_insight = get_insight_by_key(db, insight_key)
    if not db_insight:
        return None
    
    # Atualiza apenas campos fornecidos (não-None)
    update_data = insight_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_insight, key, value)
    
    db.commit()
    db.refresh(db_insight)
    return db_insight


def delete_insight(db: Session, insight_key: str) -> bool:
    """
    Remove insight do cache.
    
    Args:
        db: Sessão do banco de dados
        insight_key: Chave do insight a remover
    
    Returns:
        True se removido, False se não encontrado
    """
    db_insight = get_insight_by_key(db, insight_key)
    if not db_insight:
        return False
    
    db.delete(db_insight)
    db.commit()
    return True


def get_stale_insights(db: Session, days: int = 7) -> List[InsightCache]:
    """
    Retorna insights desatualizados (não atualizados há X dias).
    
    Args:
        db: Sessão do banco de dados
        days: Número de dias para considerar stale
    
    Returns:
        Lista de insights desatualizados
    """
    from datetime import datetime, timedelta
    threshold = datetime.now() - timedelta(days=days)
    
    return db.query(InsightCache).filter(
        InsightCache.updated_at < threshold
    ).order_by(desc(InsightCache.updated_at)).all()


def bulk_upsert_insights(
    db: Session,
    insights_data: List[Dict[str, Any]]
) -> int:
    """
    Insere ou atualiza múltiplos insights de uma vez.
    Útil para popular cache inicial ou atualização em batch.
    
    Args:
        db: Sessão do banco de dados
        insights_data: Lista de dicts com dados dos insights
    
    Returns:
        Quantidade de insights processados
    """
    count = 0
    for data in insights_data:
        insight_key = data.get('insight_key')
        existing = get_insight_by_key(db, insight_key)
        
        if existing:
            # Atualiza existente
            for key, value in data.items():
                if key != 'insight_key':  # Não atualiza a chave
                    setattr(existing, key, value)
        else:
            # Cria novo
            new_insight = InsightCache(**data)
            db.add(new_insight)
        
        count += 1
    
    db.commit()
    return count
