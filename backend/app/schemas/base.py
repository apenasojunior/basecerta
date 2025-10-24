"""
Pydantic Schemas - Base e Utilitários
Issue: 2.1.2 - Smart CNPJ Backend

Schemas base reutilizáveis em toda a aplicação.
"""
from datetime import datetime
from typing import Optional, Generic, TypeVar, List
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel


# ================================================================
# SCHEMAS DE RESPOSTA GENÉRICOS
# ================================================================

class MessageResponse(BaseModel):
    """Response de mensagem simples"""
    message: str = Field(..., description="Mensagem")
    success: bool = Field(True, description="Indica sucesso")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Operação realizada com sucesso",
                "success": True
            }
        }


class ErrorResponse(BaseModel):
    """Response de erro"""
    error: str = Field(..., description="Mensagem de erro")
    detail: Optional[str] = Field(None, description="Detalhes adicionais")
    code: Optional[str] = Field(None, description="Código do erro")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Créditos insuficientes",
                "detail": "Você possui 5 créditos, mas esta busca requer 10 créditos",
                "code": "INSUFFICIENT_CREDITS"
            }
        }


# ================================================================
# SCHEMAS DE PAGINAÇÃO GENÉRICOS
# ================================================================

T = TypeVar('T')


class PaginationParams(BaseModel):
    """Parâmetros de paginação"""
    page: int = Field(1, description="Número da página (1-indexed)", ge=1)
    limit: int = Field(20, description="Registros por página", ge=1, le=100)
    
    @property
    def offset(self) -> int:
        """Calcula offset para SQL"""
        return (self.page - 1) * self.limit
    
    class Config:
        json_schema_extra = {
            "example": {
                "page": 1,
                "limit": 20
            }
        }


class PaginationMetadata(BaseModel):
    """Metadados de paginação"""
    total: int = Field(..., description="Total de registros", ge=0)
    page: int = Field(..., description="Página atual", ge=1)
    limit: int = Field(..., description="Registros por página", ge=1)
    totalPages: int = Field(..., description="Total de páginas", ge=0)
    hasNext: bool = Field(..., description="Tem próxima página")
    hasPrev: bool = Field(..., description="Tem página anterior")
    
    @classmethod
    def create(cls, total: int, page: int, limit: int) -> "PaginationMetadata":
        """Factory method para criar metadados"""
        total_pages = (total + limit - 1) // limit if total > 0 else 0
        
        return cls(
            total=total,
            page=page,
            limit=limit,
            totalPages=total_pages,
            hasNext=page < total_pages,
            hasPrev=page > 1
        )
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 152,
                "page": 1,
                "limit": 20,
                "totalPages": 8,
                "hasNext": True,
                "hasPrev": False
            }
        }


class PaginatedResponse(GenericModel, Generic[T]):
    """Response paginado genérico"""
    data: List[T] = Field(..., description="Lista de dados")
    pagination: PaginationMetadata = Field(..., description="Metadados de paginação")
    
    class Config:
        json_schema_extra = {
            "example": {
                "data": [],
                "pagination": {
                    "total": 152,
                    "page": 1,
                    "limit": 20,
                    "totalPages": 8,
                    "hasNext": True,
                    "hasPrev": False
                }
            }
        }


# ================================================================
# SCHEMAS DE CRÉDITOS
# ================================================================

class UserCreditsResponse(BaseModel):
    """Response de créditos do usuário"""
    userId: int = Field(..., description="ID do usuário")
    credits: int = Field(..., description="Créditos disponíveis", ge=0)
    lastUpdated: datetime = Field(..., description="Data da última atualização")
    
    class Config:
        json_schema_extra = {
            "example": {
                "userId": 1,
                "credits": 9750,
                "lastUpdated": "2024-01-15T10:30:00"
            }
        }


class CreditTransactionResponse(BaseModel):
    """Response de transação de crédito"""
    id: int = Field(..., description="ID da transação")
    userId: int = Field(..., description="ID do usuário")
    amount: int = Field(..., description="Quantidade de créditos (negativo = débito)")
    description: str = Field(..., description="Descrição da transação")
    searchId: Optional[str] = Field(None, description="ID da pesquisa (UUID)")
    createdAt: datetime = Field(..., description="Data da transação")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 123,
                "userId": 1,
                "amount": -10,
                "description": "Busca por Razão Social: TECNOLOGIA",
                "searchId": "550e8400-e29b-41d4-a716-446655440000",
                "createdAt": "2024-01-15T10:30:00"
            }
        }


class CreditHistoryResponse(BaseModel):
    """Response de histórico de créditos"""
    transactions: List[CreditTransactionResponse] = Field(..., description="Lista de transações")
    currentBalance: int = Field(..., description="Saldo atual", ge=0)
    totalDebits: int = Field(..., description="Total de débitos", ge=0)
    totalCredits: int = Field(..., description="Total de créditos", ge=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "transactions": [],
                "currentBalance": 9750,
                "totalDebits": 250,
                "totalCredits": 10000
            }
        }


# ================================================================
# SCHEMAS DE PESQUISA (histórico)
# ================================================================

class PesquisaCNPJResponse(BaseModel):
    """Response de histórico de pesquisa"""
    id: str = Field(..., description="ID da pesquisa (UUID)")
    userId: int = Field(..., description="ID do usuário")
    tipoBusca: str = Field(..., description="Tipo de busca")
    valorBusca: str = Field(..., description="Valor pesquisado")
    filtrosAplicados: dict = Field(default_factory=dict, description="Filtros aplicados")
    resultadosEncontrados: int = Field(..., description="Quantidade de resultados", ge=0)
    creditosUsados: int = Field(..., description="Créditos usados", ge=0)
    tempoResposta: Optional[int] = Field(None, description="Tempo de resposta em ms")
    createdAt: datetime = Field(..., description="Data da pesquisa")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "userId": 1,
                "tipoBusca": "razao_social",
                "valorBusca": "TECNOLOGIA",
                "filtrosAplicados": {
                    "uf": "SP",
                    "situacao": "02"
                },
                "resultadosEncontrados": 152,
                "creditosUsados": 10,
                "tempoResposta": 245,
                "createdAt": "2024-01-15T10:30:00"
            }
        }


class SearchHistoryResponse(BaseModel):
    """Response de histórico de pesquisas paginado"""
    searches: List[PesquisaCNPJResponse] = Field(..., description="Lista de pesquisas")
    pagination: PaginationMetadata = Field(..., description="Metadados de paginação")
    
    class Config:
        json_schema_extra = {
            "example": {
                "searches": [],
                "pagination": {
                    "total": 50,
                    "page": 1,
                    "limit": 20,
                    "totalPages": 3,
                    "hasNext": True,
                    "hasPrev": False
                }
            }
        }


# ================================================================
# SCHEMAS DE ESTATÍSTICAS
# ================================================================

class SearchStatsResponse(BaseModel):
    """Response de estatísticas de busca"""
    totalSearches: int = Field(..., description="Total de buscas", ge=0)
    totalCreditsUsed: int = Field(..., description="Total de créditos usados", ge=0)
    totalResultsFound: int = Field(..., description="Total de resultados encontrados", ge=0)
    averageResponseTime: Optional[int] = Field(None, description="Tempo médio de resposta em ms")
    mostUsedSearchType: Optional[str] = Field(None, description="Tipo de busca mais usado")
    searchesByType: dict = Field(default_factory=dict, description="Buscas por tipo")
    
    class Config:
        json_schema_extra = {
            "example": {
                "totalSearches": 45,
                "totalCreditsUsed": 450,
                "totalResultsFound": 6843,
                "averageResponseTime": 312,
                "mostUsedSearchType": "razao_social",
                "searchesByType": {
                    "razao_social": 20,
                    "cnpj": 15,
                    "segmento": 10
                }
            }
        }
