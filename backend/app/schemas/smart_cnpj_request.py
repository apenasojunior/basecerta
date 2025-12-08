"""
Pydantic Schemas - Smart CNPJ Request
Issue: 2.1.2 - Smart CNPJ Backend

Schemas de request com validações.
Baseado no documento: docs/DE_PARA_FRONTEND_BACKEND.md
"""
from datetime import date
from decimal import Decimal
from typing import Optional, Any
from pydantic import BaseModel, Field, field_validator, model_validator
import re

from app.schemas.enums import TipoBusca, limpar_cnpj


# ================================================================
# SCHEMAS DE REQUEST - Filtros
# ================================================================

class FiltrosRequest(BaseModel):
    """
    Filtros de busca do Smart CNPJ
    
    Todos os filtros são opcionais.
    Baseado na interface: SmartCNPJFilters do frontend
    """
    
    # Filtros de localização
    uf: Optional[str] = Field(None, description="Sigla UF (SP, RJ, etc)", max_length=2)
    municipio: Optional[str] = Field(None, description="Código do município IBGE")
    
    # Filtros de situação
    situacao: Optional[str] = Field(None, description="Código situação cadastral (02, 04, etc)")
    
    # Filtros de porte
    porte: Optional[str] = Field(None, description="Código do porte (01, 03, 05)")
    
    # Filtros de natureza jurídica
    natureza_juridica: Optional[str] = Field(None, description="Código da natureza jurídica")
    
    # Filtros de capital social (aceita snake_case e camelCase)
    capital_social_min: Optional[Decimal] = Field(
        None, 
        alias='capitalMinimo',
        description="Capital social mínimo", 
        ge=0
    )
    capital_social_max: Optional[Decimal] = Field(
        None, 
        alias='capitalMaximo',
        description="Capital social máximo", 
        ge=0
    )
    
    # Filtros de data (aceita snake_case e camelCase)
    data_abertura_inicio: Optional[date] = Field(
        None, 
        alias='dataAberturaInicio',
        description="Data abertura início (ISO 8601)"
    )
    data_abertura_fim: Optional[date] = Field(
        None, 
        alias='dataAberturaFim',
        description="Data abertura fim (ISO 8601)"
    )
    
    @field_validator('uf')
    @classmethod
    def validate_uf(cls, v: Optional[str]) -> Optional[str]:
        """Valida UF - 2 letras maiúsculas"""
        if v is not None:
            v = v.upper().strip()
            if not re.match(r'^[A-Z]{2}$', v):
                raise ValueError('UF deve ter 2 letras maiúsculas')
        return v
    
    @model_validator(mode='after')
    def validate_ranges(self) -> 'FiltrosRequest':
        """Valida ranges de capital e datas"""
        # Valida range de capital
        if self.capital_social_min is not None and self.capital_social_max is not None:
            if self.capital_social_min > self.capital_social_max:
                raise ValueError('capital_social_min não pode ser maior que capital_social_max')
        
        # Valida range de datas
        if self.data_abertura_inicio is not None and self.data_abertura_fim is not None:
            if self.data_abertura_inicio > self.data_abertura_fim:
                raise ValueError('data_abertura_inicio não pode ser maior que data_abertura_fim')
        
        return self
    
    class Config:
        populate_by_name = True  # Aceita tanto snake_case quanto camelCase
        json_schema_extra = {
            "example": {
                "uf": "SP",
                "municipio": "3550308",  # Código IBGE de São Paulo
                "situacao": "02",  # Ativa
                "porte": "01",  # Microempresa
                "natureza_juridica": "2062",  # Sociedade Empresária Limitada
                "capital_social_min": 5000.00,
                "capital_social_max": 50000.00,
                "data_abertura_inicio": "2020-01-01",
                "data_abertura_fim": "2023-12-31"
            }
        }


# ================================================================
# SCHEMAS DE REQUEST - Busca
# ================================================================

class SmartCNPJSearchRequest(BaseModel):
    """
    Request de busca do Smart CNPJ
    
    Tipo de busca + valor + filtros opcionais + paginação
    """
    
    # Parâmetros de busca
    tipo_busca: TipoBusca = Field(..., description="Tipo de busca (enum)")
    valor_busca: str = Field(..., description="Valor a pesquisar", min_length=1, max_length=500)
    
    # Filtros (opcional)
    filtros: Optional[FiltrosRequest] = Field(None, description="Filtros adicionais")
    
    # Paginação
    page: int = Field(1, description="Número da página (1-indexed)", ge=1)
    limit: int = Field(20, description="Registros por página", ge=1, le=100)
    
    @model_validator(mode='after')
    def validate_valor_busca(self) -> 'SmartCNPJSearchRequest':
        """Valida valor de busca conforme tipo"""
        v = self.valor_busca.strip()
        
        # Validação específica por tipo
        if self.tipo_busca == TipoBusca.CNPJ:
            # Remove formatação e valida tamanho
            cnpj = limpar_cnpj(v)
            if len(cnpj) != 14 or not cnpj.isdigit():
                raise ValueError('CNPJ deve ter 14 dígitos')
            self.valor_busca = cnpj  # Sem formatação
        
        elif self.tipo_busca == TipoBusca.EMAIL:
            # Validação básica de email
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, v):
                raise ValueError('Email inválido')
            self.valor_busca = v.lower()
        
        elif self.tipo_busca == TipoBusca.TELEFONE:
            # Remove caracteres especiais
            telefone = re.sub(r'[^\d]', '', v)
            if len(telefone) < 10 or len(telefone) > 11:
                raise ValueError('Telefone deve ter 10 ou 11 dígitos')
            self.valor_busca = telefone
        
        elif self.tipo_busca == TipoBusca.CEP:
            # Remove formatação
            cep = re.sub(r'[^\d]', '', v)
            if len(cep) != 8:
                raise ValueError('CEP deve ter 8 dígitos')
            self.valor_busca = cep
        
        else:
            # Para outros tipos, normaliza
            self.valor_busca = v.upper().strip()
        
        return self
    
    class Config:
        json_schema_extra = {
            "example": {
                "tipo_busca": "razao_social",
                "valor_busca": "TECNOLOGIA",
                "filtros": {
                    "uf": "SP",
                    "situacao": "02",
                    "porte": "01"
                },
                "page": 1,
                "limit": 20
            }
        }


# ================================================================
# SCHEMAS DE REQUEST - Busca por ID (CNPJ)
# ================================================================

class SmartCNPJByIdRequest(BaseModel):
    """
    Request de busca por CNPJ específico
    Para obter dados completos de uma empresa
    """
    cnpj: str = Field(..., description="CNPJ a pesquisar", min_length=14, max_length=18)
    
    @field_validator('cnpj')
    @classmethod
    def validate_cnpj(cls, v: str) -> str:
        """Valida e limpa CNPJ"""
        cnpj = limpar_cnpj(v)
        
        if len(cnpj) != 14 or not cnpj.isdigit():
            raise ValueError('CNPJ deve ter 14 dígitos')
        
        return cnpj
    
    class Config:
        json_schema_extra = {
            "example": {
                "cnpj": "11779918000105"
            }
        }


# ================================================================
# SCHEMAS DE REQUEST - Exportação
# ================================================================

class SmartCNPJExportRequest(BaseModel):
    """
    Request de exportação de dados
    Mesmos parâmetros de busca + formato de exportação
    """
    
    # Herda mesmos campos de busca
    tipo_busca: TipoBusca = Field(..., description="Tipo de busca")
    valor_busca: str = Field(..., description="Valor a pesquisar")
    filtros: Optional[FiltrosRequest] = Field(None, description="Filtros")
    
    # Formato de exportação
    formato: str = Field("xlsx", description="Formato de exportação (xlsx, csv, json)")
    
    # Limite de registros (para exportação)
    max_registros: int = Field(1000, description="Máximo de registros", ge=1, le=10000)
    
    @field_validator('formato')
    @classmethod
    def validate_formato(cls, v: str) -> str:
        """Valida formato de exportação"""
        formatos_validos = ['xlsx', 'csv', 'json']
        v = v.lower().strip()
        
        if v not in formatos_validos:
            raise ValueError(f'Formato deve ser um de: {", ".join(formatos_validos)}')
        
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "tipo_busca": "segmento",
                "valor_busca": "TECNOLOGIA",
                "filtros": {
                    "uf": "SP",
                    "situacao": "02"
                },
                "formato": "xlsx",
                "max_registros": 1000
            }
        }
