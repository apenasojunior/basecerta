"""
Redis Client Configuration
Singleton pattern for Redis connection
"""
import logging
from typing import Optional

import redis
from redis import Redis

from app.core.config import settings

logger = logging.getLogger(__name__)

# Global Redis client instance
_redis_client: Optional[Redis] = None


def get_redis_client() -> Redis:
    """
    Get Redis client instance (singleton pattern)
    
    Returns:
        Redis client instance
    """
    global _redis_client
    
    if _redis_client is None:
        try:
            _redis_client = redis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
            )
            # Test connection
            _redis_client.ping()
            logger.info(f"✅ Redis conectado em {settings.REDIS_HOST}:{settings.REDIS_PORT}")
        except redis.ConnectionError as e:
            logger.error(f"❌ Erro ao conectar Redis: {e}")
            raise
    
    return _redis_client


def close_redis_client() -> None:
    """Close Redis connection"""
    global _redis_client
    
    if _redis_client:
        _redis_client.close()
        _redis_client = None
        logger.info("Redis connection closed")
