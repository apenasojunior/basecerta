"""
API Router for v1
Aggregates all endpoint routers
"""
from fastapi import APIRouter

# Import routers (will be added in future sprints)
# from app.api.v1.endpoints import health, companies, credits, research

api_router = APIRouter()

# Include routers
# api_router.include_router(health.router, tags=["health"])
# api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
# api_router.include_router(credits.router, prefix="/credits", tags=["credits"])
# api_router.include_router(research.router, prefix="/research", tags=["research"])
