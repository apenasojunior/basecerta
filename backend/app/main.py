"""
BaseCerta API - Main Application
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.core.database import check_db_connection
from app.utils.logger import logger, log_request


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Plataforma de Consultas e Pesquisas de Dados Empresariais",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"/api/{settings.API_VERSION}/openapi.json",
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# GZip Middleware (compress responses)
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    """Log all HTTP requests"""
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    log_request(
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration=duration
    )
    
    return response


# Startup event
@app.on_event("startup")
async def startup_event():
    """Execute on application startup"""
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"📊 Environment: {'Development' if settings.DEBUG else 'Production'}")
    logger.info(f"🔗 Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    logger.info(f"📦 Redis: {settings.REDIS_HOST}:{settings.REDIS_PORT}")
    
    # Check database connection
    if check_db_connection():
        logger.info("✅ Database connection successful")
    else:
        logger.error("❌ Database connection failed")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Execute on application shutdown"""
    logger.info(f"🛑 Shutting down {settings.APP_NAME}")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    Verifies system status and dependencies
    """
    from datetime import datetime
    import redis
    
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {},
        "version": settings.APP_VERSION
    }
    
    # Check database
    try:
        db_status = check_db_connection()
        health_status["services"]["database"] = "connected" if db_status else "disconnected"
    except Exception as e:
        health_status["services"]["database"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check Redis
    try:
        redis_client = redis.from_url(settings.redis_url)
        redis_client.ping()
        health_status["services"]["redis"] = "connected"
        redis_client.close()
    except Exception as e:
        health_status["services"]["redis"] = f"disconnected: {str(e)}"
        health_status["status"] = "degraded"
    
    # Check Celery (TODO: implement when Celery is configured)
    health_status["services"]["celery"] = "not configured"
    
    # Set appropriate status code
    status_code = 200 if health_status["status"] == "healthy" else 503
    
    return JSONResponse(content=health_status, status_code=status_code)


# Include API routers
from app.api.v1.endpoints import users, plans, packages, credits

app.include_router(
    users.router,
    prefix=f"/api/{settings.API_VERSION}/users",
    tags=["Users"]
)

app.include_router(
    plans.router,
    prefix=f"/api/{settings.API_VERSION}/plans",
    tags=["Plans"]
)

app.include_router(
    packages.router,
    prefix=f"/api/{settings.API_VERSION}/packages",
    tags=["Credit Packages"]
)

app.include_router(
    credits.router,
    prefix=f"/api/{settings.API_VERSION}/credits",
    tags=["Credits"]
)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
