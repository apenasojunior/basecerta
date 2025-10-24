"""
Pydantic Schemas - Issue 2.1.2
Smart CNPJ Backend

Exporta todos os schemas de request e response.
"""

# ================================================================
# BASE SCHEMAS
# ================================================================
from .base import (
    # Responses genéricos
    MessageResponse,
    ErrorResponse,
    
    # Paginação
    PaginationParams,
    PaginationMetadata,
    PaginatedResponse,
    
    # Créditos
    UserCreditsResponse,
    CreditTransactionResponse,
    CreditHistoryResponse,
    
    # Pesquisa (histórico)
    PesquisaCNPJResponse,
    SearchHistoryResponse,
    
    # Estatísticas
    SearchStatsResponse,
)


# ================================================================
# SMART CNPJ - REQUEST SCHEMAS
# ================================================================
from .smart_cnpj_request import (
    # Filtros
    FiltrosRequest,
    
    # Busca
    SmartCNPJSearchRequest,
    SmartCNPJByIdRequest,
    
    # Exportação
    SmartCNPJExportRequest,
)


# ================================================================
# SMART CNPJ - RESPONSE SCHEMAS
# ================================================================
from .smart_cnpj_response import (
    # Nested objects
    EnderecoResponse,
    ContatosResponse,
    CNAEResponse,
    SocioResponse,
    
    # Main response
    SmartCNPJCompanyResponse,
    SmartCNPJCompanySimpleResponse,
    
    # Busca paginada
    SmartCNPJSearchResponse,
)


# ================================================================
# EXPORTS
# ================================================================
__all__ = [
    # Base
    "MessageResponse",
    "ErrorResponse",
    "PaginationParams",
    "PaginationMetadata",
    "PaginatedResponse",
    "UserCreditsResponse",
    "CreditTransactionResponse",
    "CreditHistoryResponse",
    "PesquisaCNPJResponse",
    "SearchHistoryResponse",
    "SearchStatsResponse",
    
    # Request
    "FiltrosRequest",
    "SmartCNPJSearchRequest",
    "SmartCNPJByIdRequest",
    "SmartCNPJExportRequest",
    
    # Response
    "EnderecoResponse",
    "ContatosResponse",
    "CNAEResponse",
    "SocioResponse",
    "SmartCNPJCompanyResponse",
    "SmartCNPJCompanySimpleResponse",
    "SmartCNPJSearchResponse",
]