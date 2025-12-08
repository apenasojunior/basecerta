"""
API Router for v1
DELIVERY 1: API vazia - Frontend usa mockdata
DELIVERY 2: Reconstruir routers do zero
SPRINT 2.1: Smart CNPJ endpoints
SPRINT Smart CNPJ Search: Insights cache endpoints
"""
from fastapi import APIRouter
from app.api.v1.endpoints import smart_cnpj, insights

api_router = APIRouter()

# SPRINT Smart CNPJ Search: Insights cache (estatísticas pré-calculadas)
api_router.include_router(
    insights.router,
    prefix="/insights",
    tags=["Insights"]
)

# SPRINT 2.1: Smart CNPJ 360°
api_router.include_router(
    smart_cnpj.router,
    prefix="/smart-cnpj",
    tags=["Smart CNPJ"]
)

# DELIVERY 2: Adicionar outros routers aqui
