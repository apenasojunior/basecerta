"""Core - Configurações centrais"""
from app.core.cache import (
    cache_key,
    serialize,
    deserialize,
    get_from_cache,
    set_in_cache,
    delete_from_cache,
    clear_pattern,
    cache_exists,
    get_ttl,
    get_cache_stats,
)

__all__ = [
    "cache_key",
    "serialize",
    "deserialize",
    "get_from_cache",
    "set_in_cache",
    "delete_from_cache",
    "clear_pattern",
    "cache_exists",
    "get_ttl",
    "get_cache_stats",
]