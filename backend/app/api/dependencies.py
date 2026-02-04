"""
Dependências compartilhadas para API
Feature: S02-F04
Sprint: S02 - Integração Base CNPJ

Dependências reutilizáveis para endpoints FastAPI.
"""
from typing import Generator
from sqlalchemy.orm import Session

from app.core.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Dependência para obter sessão do banco de dados
    
    Yields:
        Session do SQLAlchemy
        
    Uso:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
