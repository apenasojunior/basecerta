"""
Pydantic Schemas - Smart CNPJ Response
Issue: 2.1.2 - Smart CNPJ Backend

Schemas de resposta para o frontend.
Baseado no documento: docs/DE_PARA_FRONTEND_BACKEND.md
Interface Frontend: SmartCNPJCompany
"""
from datetime import date
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, validator


# ================================================================
# SCHEMAS DE RESPONSE - Nested Objects
# ================================================================

class EnderecoResponse(BaseModel):
    """Endereço do estabelecimento"""
    logradouro: str = Field(..., description="Tipo + Nome do logradouro (ex: RUA ANA NERI)")
    numero: str = Field(..., description="Número")
    complemento: Optional[str] = Field(None, description="Complemento")
    bairro: str = Field(..., description="Bairro")
    cep: str = Field(..., description="CEP formatado: 00000-000")
    municipio: str = Field(..., description="Nome do município")
    uf: str = Field(..., description="Sigla UF (SP, RJ, etc)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "logradouro": "RUA ANA NERI",
                "numero": "73",
                "complemento": "SALA 101",
                "bairro": "CAMBUI",
                "cep": "13024-500",
                "municipio": "Campinas",
                "uf": "SP"
            }
        }


class ContatosResponse(BaseModel):
    """Contatos do estabelecimento"""
    email: Optional[str] = Field(None, description="E-mail")
    telefone: Optional[str] = Field(None, description="Telefone formatado: (00) 0000-0000")
    telefone2: Optional[str] = Field(None, description="Telefone 2 formatado")
    fax: Optional[str] = Field(None, description="Fax formatado")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "contato@empresa.com.br",
                "telefone": "(19) 91174-491",
                "telefone2": "(19) 3241-5678",
                "fax": None
            }
        }


class CNAEResponse(BaseModel):
    """CNAE - Atividade econômica"""
    codigo: str = Field(..., description="Código CNAE")
    descricao: str = Field(..., description="Descrição da atividade")
    
    class Config:
        json_schema_extra = {
            "example": {
                "codigo": "6201-5/00",
                "descricao": "Desenvolvimento de programas de computador sob encomenda"
            }
        }


class SocioResponse(BaseModel):
    """Sócio da empresa"""
    nome: str = Field(..., description="Nome do sócio")
    cpfCnpj: Optional[str] = Field(None, description="CPF ou CNPJ formatado")
    qualificacao: str = Field(..., description="Qualificação do sócio")
    dataEntrada: Optional[str] = Field(None, description="Data de entrada no formato ISO 8601")
    
    class Config:
        json_schema_extra = {
            "example": {
                "nome": "JOÃO DA SILVA",
                "cpfCnpj": "123.456.789-01",
                "qualificacao": "Sócio-Administrador",
                "dataEntrada": "2020-01-15"
            }
        }


# ================================================================
# SCHEMA DE RESPONSE PRINCIPAL
# ================================================================

class SmartCNPJCompanyResponse(BaseModel):
    """
    Response completo do Smart CNPJ 360°
    
    Mapeado da interface frontend: SmartCNPJCompany
    Fonte: frontend/src/mocks/smart-cnpj.ts
    """
    
    # Identificação
    cnpj: str = Field(..., description="CNPJ formatado: 00.000.000/0000-00")
    razaoSocial: str = Field(..., description="Razão social")
    nomeFantasia: Optional[str] = Field(None, description="Nome fantasia")
    
    # Natureza Jurídica
    naturezaJuridica: str = Field(..., description="Descrição da natureza jurídica")
    codigoNaturezaJuridica: str = Field(..., description="Código da natureza jurídica")
    
    # Porte e Capital
    porte: str = Field(..., description="Descrição do porte (Microempresa, Pequena, etc)")
    codigoPorte: str = Field(..., description="Código do porte (01, 03, 05)")
    capitalSocial: Decimal = Field(..., description="Capital social")
    
    # Situação Cadastral
    situacaoCadastral: str = Field(..., description="Descrição da situação (Ativa, Inapta, etc)")
    codigoSituacaoCadastral: str = Field(..., description="Código da situação (02, 04, etc)")
    dataSituacaoCadastral: str = Field(..., description="Data da situação no formato ISO 8601")
    motivoSituacaoCadastral: Optional[str] = Field(None, description="Motivo da situação cadastral")
    
    # Datas
    dataInicioAtividade: str = Field(..., description="Data de início da atividade (ISO 8601)")
    dataAbertura: str = Field(..., description="Data de abertura (ISO 8601) - mesmo que dataInicioAtividade")
    
    # Endereço (nested)
    endereco: EnderecoResponse = Field(..., description="Endereço completo")
    
    # Contatos (nested)
    contatos: ContatosResponse = Field(..., description="Contatos da empresa")
    
    # CNAE Primário (nested)
    cnaePrincipal: CNAEResponse = Field(..., description="CNAE principal")
    
    # CNAEs Secundários (array)
    cnaesSecundarios: List[CNAEResponse] = Field(default_factory=list, description="CNAEs secundários")
    
    # Sócios (array)
    socios: List[SocioResponse] = Field(default_factory=list, description="Quadro societário")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cnpj": "11.779.918/0001-05",
                "razaoSocial": "N. F. C. VIANNA",
                "nomeFantasia": None,
                "naturezaJuridica": "Empresário Individual",
                "codigoNaturezaJuridica": "2135",
                "porte": "Microempresa",
                "codigoPorte": "01",
                "capitalSocial": 5000.00,
                "situacaoCadastral": "Inapta",
                "codigoSituacaoCadastral": "04",
                "dataSituacaoCadastral": "2023-05-10",
                "motivoSituacaoCadastral": "Omissão de declarações",
                "dataInicioAtividade": "2020-01-15",
                "dataAbertura": "2020-01-15",
                "endereco": {
                    "logradouro": "RUA ANA NERI",
                    "numero": "73",
                    "complemento": None,
                    "bairro": "CAMBUI",
                    "cep": "13024-500",
                    "municipio": "Campinas",
                    "uf": "SP"
                },
                "contatos": {
                    "email": "kaconori@ig.com.br",
                    "telefone": "(19) 91174-491",
                    "telefone2": None,
                    "fax": None
                },
                "cnaePrincipal": {
                    "codigo": "5611-2/04",
                    "descricao": "Bares e outros estabelecimentos especializados"
                },
                "cnaesSecundarios": [],
                "socios": []
            }
        }


# ================================================================
# SCHEMA DE RESPONSE PAGINADO
# ================================================================

class PaginationMetadata(BaseModel):
    """Metadados de paginação"""
    total: int = Field(..., description="Total de registros (pode ser estimado)")
    page: int = Field(..., description="Página atual (1-indexed)")
    limit: int = Field(..., description="Registros por página")
    totalPages: int = Field(..., description="Total de páginas (pode ser estimado)")
    hasNext: bool = Field(..., description="Tem próxima página")
    hasPrev: bool = Field(..., description="Tem página anterior")
    isEstimate: bool = Field(
        default=True, 
        description="Se total é estimado (true) ou exato (false). Com LIMIT+1 pattern, sempre estimado exceto última página"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 152,
                "page": 1,
                "limit": 20,
                "totalPages": 8,
                "hasNext": True,
                "hasPrev": False,
                "isEstimate": True
            }
        }


class SmartCNPJSearchResponse(BaseModel):
    """Response de busca paginada"""
    data: List[SmartCNPJCompanyResponse] = Field(..., description="Lista de empresas")
    pagination: PaginationMetadata = Field(..., description="Metadados de paginação")
    filters: dict = Field(default_factory=dict, description="Filtros aplicados")
    searchType: Optional[str] = Field(None, description="Tipo de busca realizada")
    searchValue: Optional[str] = Field(None, description="Valor pesquisado")
    tempoResposta: Optional[int] = Field(None, description="Tempo de resposta em ms")
    
    class Config:
        json_schema_extra = {
            "example": {
                "data": [
                    # Array de SmartCNPJCompanyResponse
                ],
                "pagination": {
                    "total": 152,
                    "page": 1,
                    "limit": 20,
                    "totalPages": 8,
                    "hasNext": True,
                    "hasPrev": False
                },
                "filters": {
                    "uf": "SP",
                    "situacao": "02",
                    "porte": "01"
                },
                "searchType": "razao_social",
                "searchValue": "TECNOLOGIA",
                "tempoResposta": 245
            }
        }


# ================================================================
# SCHEMA DE RESPONSE SIMPLIFICADO (para listagens)
# ================================================================

class SmartCNPJCompanySimpleResponse(BaseModel):
    """
    Response simplificado para listagens
    Sem nested objects e arrays para performance
    """
    cnpj: str = Field(..., description="CNPJ formatado")
    razaoSocial: str = Field(..., description="Razão social")
    nomeFantasia: Optional[str] = Field(None, description="Nome fantasia")
    situacaoCadastral: str = Field(..., description="Situação cadastral")
    porte: str = Field(..., description="Porte")
    municipio: str = Field(..., description="Município")
    uf: str = Field(..., description="UF")
    cnaeDescricao: str = Field(..., description="Descrição do CNAE principal")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cnpj": "11.779.918/0001-05",
                "razaoSocial": "N. F. C. VIANNA",
                "nomeFantasia": None,
                "situacaoCadastral": "Inapta",
                "porte": "Microempresa",
                "municipio": "Campinas",
                "uf": "SP",
                "cnaeDescricao": "Bares e outros estabelecimentos especializados"
            }
        }
