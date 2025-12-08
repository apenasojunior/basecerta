"""
Enums para Schemas Pydantic - Issue 2.1.2
Smart CNPJ Backend

Cópia dos enums de app.models.enums sem dependências de SQLAlchemy.
Usado apenas nos schemas Pydantic para evitar problemas de importação circular.
"""
from enum import Enum


# ================================================================
# ENUMS - Tipo de Busca
# ================================================================

class TipoBusca(str, Enum):
    """
    Tipos de busca disponíveis no Smart CNPJ 360°
    Equivalente ao enum SearchType do frontend
    """
    CNPJ = "cnpj"
    RAZAO_SOCIAL = "razao_social"
    CNAE = "cnae"           # Alias para SEGMENTO (busca por código CNAE)
    SEGMENTO = "segmento"   # Busca por código CNAE (mantido para compatibilidade)
    EMAIL = "email"
    TELEFONE = "telefone"
    NOME_SOCIO = "nome_socio"
    CEP = "cep"


# ================================================================
# UTILITÁRIOS - Limpeza de dados
# ================================================================

def limpar_cnpj(cnpj: str) -> str:
    """
    Remove caracteres não numéricos do CNPJ
    
    Args:
        cnpj: CNPJ formatado ou não (ex: "00.000.000/0000-00" ou "00000000000000")
    
    Returns:
        CNPJ apenas com dígitos
    
    Examples:
        >>> limpar_cnpj("11.779.918/0001-05")
        "11779918000105"
        >>> limpar_cnpj("11779918000105")
        "11779918000105"
    """
    if not cnpj:
        return ""
    return ''.join(filter(str.isdigit, cnpj))


def limpar_telefone(telefone: str) -> str:
    """
    Remove caracteres não numéricos do telefone
    
    Args:
        telefone: Telefone formatado ou não
    
    Returns:
        Telefone apenas com dígitos
    
    Examples:
        >>> limpar_telefone("(19) 3241-5678")
        "1932415678"
    """
    if not telefone:
        return ""
    return ''.join(filter(str.isdigit, telefone))


def limpar_cep(cep: str) -> str:
    """
    Remove caracteres não numéricos do CEP
    
    Args:
        cep: CEP formatado ou não (ex: "13024-500" ou "13024500")
    
    Returns:
        CEP apenas com dígitos
    
    Examples:
        >>> limpar_cep("13024-500")
        "13024500"
    """
    if not cep:
        return ""
    return ''.join(filter(str.isdigit, cep))
