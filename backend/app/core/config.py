"""
Core Configuration Module
Settings management using Pydantic Settings
"""
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )
    
    # Application
    APP_NAME: str = "BaseCerta API"
    APP_VERSION: str = "1.0.0"
    API_VERSION: str = "v1"
    DEBUG: bool = True
    
    # Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Database
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Celery
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    # External APIs
    PREDICTUS_API_KEY: Optional[str] = None
    PREDICTUS_API_URL: Optional[str] = None
    DIRECTDATA_API_KEY: Optional[str] = None
    DIRECTDATA_API_URL: Optional[str] = None
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    
    # Logs
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )
    
    @property
    def database_url(self) -> str:
        """Generate SQLAlchemy database URL"""
        from urllib.parse import quote_plus
        password = quote_plus(self.DB_PASSWORD)
        return f"postgresql://{self.DB_USER}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def redis_url(self) -> str:
        """Generate Redis URL"""
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @field_validator("CELERY_BROKER_URL", mode="before")
    def set_celery_broker(cls, v, info):
        """Auto-generate Celery broker URL from Redis if not set"""
        if v:
            return v
        # Will be set after validation using redis_url
        return None
    
    @field_validator("CELERY_RESULT_BACKEND", mode="before")
    def set_celery_result_backend(cls, v, info):
        """Auto-generate Celery result backend from Redis if not set"""
        if v:
            return v
        # Will be set after validation using redis_url
        return None
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set Celery URLs from Redis if not provided
        if not self.CELERY_BROKER_URL:
            self.CELERY_BROKER_URL = self.redis_url
        if not self.CELERY_RESULT_BACKEND:
            self.CELERY_RESULT_BACKEND = self.redis_url


# Global settings instance
settings = Settings()
