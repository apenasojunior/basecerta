# Database Models
# DELIVERY 1: Apenas Base
# DELIVERY 2: Models CNPJ + Pesquisa

from app.models.base import Base

# Schema CNPJ (Receita Federal - 100M+ registros)
from app.models.cnpj import (
    Empresa,
    Estabelecimento,
    Socio,
    CNAE,
    SimplesNacional,
    NaturezaJuridica,
    QualificacaoSocio,
    MotivoSituacaoCadastral,
    Municipio,
    Pais,
)

# Schema PUBLIC (Aplicação)
from app.models.pesquisa import PesquisaCNPJ

__all__ = [
    # Base
    "Base",
    
    # Schema CNPJ - Principais
    "Empresa",
    "Estabelecimento",
    "Socio",
    "CNAE",
    "SimplesNacional",
    
    # Schema CNPJ - Auxiliares
    "NaturezaJuridica",
    "QualificacaoSocio",
    "MotivoSituacaoCadastral",
    "Municipio",
    "Pais",
    
    # Schema PUBLIC
    "PesquisaCNPJ",
]