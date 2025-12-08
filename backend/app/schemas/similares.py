"""
Pydantic Schemas - Empresas Similares
Endpoint: /api/v1/smart-cnpj/similares/{cnpj}

Schemas para análise de empresas similares por CNAE.
"""
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field


# ================================================================
# SCHEMAS DE RESPONSE
# ================================================================

class TopEmpresaResponse(BaseModel):
    """
    Empresa top rankeada por capital social.
    
    IMPORTANTE: O campo 'capital_social' refere-se ao CAPITAL SOCIAL TOTAL 
    declarado pela MATRIZ da empresa (CNPJ básico - 8 primeiros dígitos).
    
    Em empresas com múltiplas filiais, todas compartilham o mesmo capital 
    social da matriz. Por exemplo:
    - LOJAS RENNER S.A. (CNPJ básico: 92.754.738)
    - Capital declarado: R$ 9,5 bilhões
    - Todas as filiais (0001, 0002, 0003...) mostram o mesmo valor
    
    Este é o capital CONSOLIDADO da empresa, não individual por filial.
    """
    razao_social: str = Field(..., description="Razão social da empresa matriz")
    cnpj: str = Field(..., description="CNPJ formatado: 00.000.000/0000-00")
    capital_social: Decimal = Field(
        ..., 
        description="Capital social TOTAL da matriz (compartilhado por todas filiais)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "razao_social": "TECNOLOGIA AVANÇADA LTDA",
                "cnpj": "12.345.678/0001-90",
                "capital_social": 5000000.00
            }
        }


class StateRankingResponse(BaseModel):
    """Ranking de empresas por estado"""
    uf: str = Field(..., description="Sigla UF (SP, RJ, MG, etc)")
    uf_nome: str = Field(..., description="Nome completo do estado")
    total_empresas: int = Field(..., description="Total de empresas com mesmo CNAE neste estado")
    capital_total: Decimal = Field(
        ..., 
        description="PLACEHOLDER - Sempre retorna 0. Capital detalhado disponível via busca avançada."
    )
    top_empresa: TopEmpresaResponse = Field(..., description="Empresa com maior capital social")
    
    class Config:
        json_schema_extra = {
            "example": {
                "uf": "SP",
                "uf_nome": "São Paulo",
                "total_empresas": 15423,
                "capital_total": 0.00,  # PLACEHOLDER
                "top_empresa": {
                    "razao_social": "TECNOLOGIA AVANÇADA LTDA",
                    "cnpj": "12.345.678/0001-90",
                    "capital_social": 5000000.00
                }
            }
        }


class CNPJAnalysisResponse(BaseModel):
    """
    Análise completa de empresas similares
    
    Fluxo:
    1. Recebe CNPJ de referência
    2. Identifica CNAEs da empresa
    3. Busca empresas com mesmos CNAEs
    4. Agrupa por estado (UF)
    5. Rankeia por capital social
    """
    
    # Empresa de referência
    cnpj_referencia: str = Field(..., description="CNPJ pesquisado (formatado)")
    razao_social: str = Field(..., description="Razão social da empresa de referência")
    cnae_principal: str = Field(..., description="Código CNAE principal")
    cnae_descricao: str = Field(..., description="Descrição do CNAE principal")
    capital_social: Decimal = Field(..., description="Capital social da empresa de referência")
    uf: str = Field(..., description="UF da empresa de referência")
    
    # Rankings por estado
    rankings_por_estado: List[StateRankingResponse] = Field(
        ..., 
        description="Lista de estados ordenados por total de empresas (DESC)"
    )
    
    # Metadados
    total_estados: int = Field(..., description="Total de estados com empresas similares")
    total_empresas_similares: int = Field(..., description="Total de empresas similares em todos os estados")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cnpj_referencia": "11.779.918/0001-05",
                "razao_social": "N. F. C. VIANNA",
                "cnae_principal": "5611-2/04",
                "cnae_descricao": "Bares e outros estabelecimentos especializados em servir bebidas",
                "capital_social": 5000.00,
                "uf": "SP",
                "rankings_por_estado": [
                    {
                        "uf": "SP",
                        "uf_nome": "São Paulo",
                        "total_empresas": 15423,
                        "capital_total": 12500000000.00,
                        "top_empresa": {
                            "razao_social": "TECNOLOGIA AVANÇADA LTDA",
                            "cnpj": "12.345.678/0001-90",
                            "capital_social": 5000000.00
                        }
                    }
                ],
                "total_estados": 5,
                "total_empresas_similares": 38250
            }
        }
