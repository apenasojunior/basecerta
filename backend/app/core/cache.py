"""
Cache Utilities for Redis
Issue: 2.1.6 - Sistema de Cache Redis

Funções utilitárias para operações de cache com Redis.
Inclui serialização, deserialização, geração de chaves e métricas.
"""
from typing import Any, Optional
import json
import logging
from datetime import timedelta

from app.core.redis_client import get_redis_client

logger = logging.getLogger(__name__)

# Configurações padrão de cache
DEFAULT_TTL = timedelta(hours=24)  # 24 horas
CACHE_PREFIX = "basecerta"


def cache_key(*args: Any, prefix: str = CACHE_PREFIX) -> str:
    """
    Gera chave de cache consistente.
    
    Exemplo:
        cache_key("cnpj", "12345678000195") -> "basecerta:cnpj:12345678000195"
        cache_key("search", "razao_social", "acme") -> "basecerta:search:razao_social:acme"
    
    Args:
        *args: Componentes da chave
        prefix: Prefixo da chave (default: CACHE_PREFIX)
    
    Returns:
        str: Chave formatada para Redis
    """
    parts = [prefix] + [str(arg) for arg in args]
    key = ":".join(parts)
    return key


def serialize(obj: Any) -> str:
    """
    Serializa objeto Python para string JSON.
    
    Suporta:
    - dict, list, tuple
    - str, int, float, bool, None
    - datetime (converte para ISO string)
    
    Args:
        obj: Objeto Python para serializar
    
    Returns:
        str: String JSON
    
    Raises:
        TypeError: Se objeto não for serializável
    """
    try:
        # Converter datetime para string ISO
        def json_serial(obj):
            """JSON serializer para objetos não serializáveis"""
            if hasattr(obj, 'isoformat'):
                return obj.isoformat()
            raise TypeError(f"Type {type(obj)} not serializable")
        
        return json.dumps(obj, default=json_serial, ensure_ascii=False)
    except (TypeError, ValueError) as e:
        logger.error(f"Erro ao serializar objeto: {e}")
        raise


def deserialize(data: str) -> Any:
    """
    Deserializa string JSON para objeto Python.
    
    Args:
        data: String JSON
    
    Returns:
        Any: Objeto Python (dict, list, etc)
    
    Raises:
        ValueError: Se JSON for inválido
    """
    try:
        return json.loads(data)
    except json.JSONDecodeError as e:
        logger.error(f"Erro ao deserializar JSON: {e}")
        raise ValueError(f"JSON inválido: {e}")


def get_from_cache(key: str, redis_client: Optional[Any] = None) -> Optional[Any]:
    """
    Busca valor no cache Redis.
    
    Args:
        key: Chave do cache
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        Optional[Any]: Valor deserializado ou None se não existir/erro
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return None
    
    try:
        data = redis_client.get(key)
        if data:
            logger.info(f"✅ Cache HIT: {key}")
            return deserialize(data)
        else:
            logger.info(f"❌ Cache MISS: {key}")
            return None
    except Exception as e:
        logger.error(f"Erro ao buscar cache {key}: {e}")
        return None


def set_in_cache(
    key: str,
    value: Any,
    ttl: Optional[timedelta] = None,
    redis_client: Optional[Any] = None
) -> bool:
    """
    Salva valor no cache Redis.
    
    Args:
        key: Chave do cache
        value: Valor para salvar
        ttl: Tempo de vida (default: 24h)
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        bool: True se salvou com sucesso, False caso contrário
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return False
    
    if ttl is None:
        ttl = DEFAULT_TTL
    
    try:
        serialized = serialize(value)
        redis_client.setex(key, ttl, serialized)
        logger.info(f"💾 Cache SET: {key} (TTL: {ttl.total_seconds()}s)")
        return True
    except Exception as e:
        logger.error(f"Erro ao salvar cache {key}: {e}")
        return False


def delete_from_cache(key: str, redis_client: Optional[Any] = None) -> bool:
    """
    Remove valor do cache Redis.
    
    Args:
        key: Chave do cache
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        bool: True se removeu, False caso contrário
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return False
    
    try:
        result = redis_client.delete(key)
        if result:
            logger.info(f"🗑️ Cache DELETE: {key}")
            return True
        else:
            logger.info(f"Cache DELETE: {key} não existia")
            return False
    except Exception as e:
        logger.error(f"Erro ao deletar cache {key}: {e}")
        return False


def clear_pattern(pattern: str, redis_client: Optional[Any] = None) -> int:
    """
    Remove todas as chaves que correspondem ao padrão.
    
    CUIDADO: Operação custosa em produção!
    
    Exemplo:
        clear_pattern("basecerta:cnpj:*")  # Remove todos CNPJs
    
    Args:
        pattern: Padrão de chave (ex: "prefix:*")
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        int: Número de chaves removidas
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return 0
    
    try:
        keys = redis_client.keys(pattern)
        if keys:
            count = redis_client.delete(*keys)
            logger.warning(f"🗑️ Cache CLEAR: {count} chaves removidas (pattern: {pattern})")
            return count
        else:
            logger.info(f"Cache CLEAR: nenhuma chave encontrada (pattern: {pattern})")
            return 0
    except Exception as e:
        logger.error(f"Erro ao limpar cache pattern {pattern}: {e}")
        return 0


def cache_exists(key: str, redis_client: Optional[Any] = None) -> bool:
    """
    Verifica se chave existe no cache.
    
    Args:
        key: Chave do cache
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        bool: True se existe, False caso contrário
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return False
    
    try:
        return bool(redis_client.exists(key))
    except Exception as e:
        logger.error(f"Erro ao verificar existência {key}: {e}")
        return False


def get_ttl(key: str, redis_client: Optional[Any] = None) -> Optional[int]:
    """
    Retorna tempo de vida restante de uma chave (em segundos).
    
    Args:
        key: Chave do cache
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        Optional[int]: Segundos restantes, ou None se chave não existe
                      -1 se chave não tem TTL
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return None
    
    try:
        ttl = redis_client.ttl(key)
        if ttl == -2:  # Chave não existe
            return None
        return ttl
    except Exception as e:
        logger.error(f"Erro ao verificar TTL {key}: {e}")
        return None


def get_cache_stats(redis_client: Optional[Any] = None) -> dict:
    """
    Retorna estatísticas do Redis.
    
    Args:
        redis_client: Cliente Redis (opcional, usa singleton se None)
    
    Returns:
        dict: Estatísticas (keys_count, memory_used, etc)
    """
    if redis_client is None:
        try:
            redis_client = get_redis_client()
        except Exception as e:
            logger.warning(f"Redis não disponível: {e}")
            return {"error": str(e)}
    
    try:
        info = redis_client.info()
        stats = {
            "keys_count": redis_client.dbsize(),
            "memory_used_bytes": info.get("used_memory", 0),
            "memory_used_mb": round(info.get("used_memory", 0) / 1024 / 1024, 2),
            "hits": info.get("keyspace_hits", 0),
            "misses": info.get("keyspace_misses", 0),
            "hit_rate": round(
                info.get("keyspace_hits", 0) / 
                max(info.get("keyspace_hits", 0) + info.get("keyspace_misses", 0), 1) * 100,
                2
            ),
            "connected_clients": info.get("connected_clients", 0),
            "uptime_seconds": info.get("uptime_in_seconds", 0),
        }
        return stats
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas Redis: {e}")
        return {"error": str(e)}


# Decorador para cache automático (BONUS - futuro)
def cached(ttl: Optional[timedelta] = None, key_prefix: str = "cached"):
    """
    Decorador para cachear automaticamente retorno de função.
    
    TODO: Implementar na Issue 2.1.8 ou futura sprint
    
    Exemplo:
        @cached(ttl=timedelta(hours=1), key_prefix="empresa")
        def get_empresa_heavy(cnpj: str):
            # Operação custosa
            return data
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # TODO: Gerar chave baseada em func.__name__ + args
            # TODO: Tentar buscar do cache
            # TODO: Se miss, executar função e salvar cache
            # TODO: Retornar resultado
            return func(*args, **kwargs)
        return wrapper
    return decorator
