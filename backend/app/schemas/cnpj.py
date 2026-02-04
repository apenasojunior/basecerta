"""
Pydantic Schemas para Base CNPJ
Feature: S02-F03
Sprint: S02 - Integração Base CNPJ

Schemas para validação e serialização de dados CNPJ.
Inclui computed fields, formatações e relacionamentos.
"""
from typing import Optional, List, Union
from datetime import date
from decimal import Decimal
from pydantic import BaseModel, Field, computed_field, field_validator, ConfigDict


# ================================================================
# TABELAS AUXILIARES - Schemas Simples
# ================================================================

class CNAEBase(BaseModel):
    """Schema para CNAE (Classificação Nacional de Atividades Econômicas)"""
    codigo: str = Field(..., description="Código CNAE (7 dígitos)")
    descricao: str = Field(..., description="Descrição da atividade")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "codigo": "4712100",
                "descricao": "Comércio varejista de mercadorias em geral"
            }
        }
    )


class NaturezaJuridicaBase(BaseModel):
    """Schema para Natureza Jurídica"""
    codigo: str = Field(..., description="Código natureza (formato XXX-X)")
    descricao: str = Field(..., description="Descrição da natureza jurídica")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "codigo": "206-2",
                "descricao": "Sociedade Empresária Limitada"
            }
        }
    )


class QualificacaoSocioBase(BaseModel):
    """Schema para Qualificação de Sócio"""
    codigo: str = Field(..., description="Código qualificação")
    descricao: str = Field(..., description="Descrição da qualificação")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "codigo": "49",
                "descricao": "Sócio-Administrador"
            }
        }
    )


class MunicipioBase(BaseModel):
    """Schema para Município (código IBGE)"""
    codigo: str = Field(..., description="Código IBGE")
    descricao: str = Field(..., description="Nome do município")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "codigo": "7107",
                "descricao": "São Paulo"
            }
        }
    )


class PaisBase(BaseModel):
    """Schema para País (código BACEN)"""
    codigo: str = Field(..., description="Código BACEN")
    descricao: str = Field(..., description="Nome do país")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "codigo": "105",
                "descricao": "Brasil"
            }
        }
    )


# ================================================================
# EMPRESA - Schemas Base e Detalhados
# ================================================================

class EmpresaBase(BaseModel):
    """Schema base para Empresa (dados cadastrais principais)"""
    cnpj_basico: str = Field(..., description="CNPJ básico (8 dígitos)")
    razao_social: str = Field(..., description="Razão social da empresa")
    natureza_juridica: Optional[str] = Field(None, description="Código natureza jurídica")
    qualificacao_responsavel: Optional[str] = Field(None, description="Qualificação do responsável")
    capital_social: Optional[Union[str, Decimal]] = Field(None, description="Capital social")
    porte_empresa: Optional[str] = Field(None, description="Porte: 01=ME, 03=EPP, 05=Demais")
    ente_federativo: Optional[str] = Field(None, description="Ente federativo responsável")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "cnpj_basico": "12345678",
                "razao_social": "EMPRESA EXEMPLO LTDA",
                "natureza_juridica": "206-2",
                "qualificacao_responsavel": "05",
                "capital_social": "100000.00",
                "porte_empresa": "03",
                "ente_federativo": None
            }
        }
    )
    
    @computed_field
    @property
    def porte_descricao(self) -> str:
        """Descrição do porte da empresa"""
        portes = {
            "00": "Não Informado",
            "01": "Microempresa",
            "03": "Empresa de Pequeno Porte",
            "05": "Demais"
        }
        return portes.get(self.porte_empresa or "00", "Desconhecido")


class EmpresaDetalhada(EmpresaBase):
    """Schema detalhado de Empresa com relacionamentos"""
    natureza: Optional[NaturezaJuridicaBase] = Field(None, description="Natureza jurídica detalhada")
    qualificacao_resp: Optional[QualificacaoSocioBase] = Field(None, description="Qualificação do responsável")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "cnpj_basico": "12345678",
                "razao_social": "EMPRESA EXEMPLO LTDA",
                "natureza_juridica": "206-2",
                "porte_empresa": "03",
                "porte_descricao": "Empresa de Pequeno Porte",
                "natureza": {
                    "codigo": "206-2",
                    "descricao": "Sociedade Empresária Limitada"
                }
            }
        }
    )


# ================================================================
# ESTABELECIMENTO - Schemas Base e Detalhados
# ================================================================

class EstabelecimentoBase(BaseModel):
    """Schema base para Estabelecimento"""
    cnpj_basico: str = Field(..., description="CNPJ básico (8 dígitos)")
    cnpj_ordem: str = Field(..., description="Ordem (4 dígitos)")
    cnpj_dv: str = Field(..., description="Dígito verificador (2 dígitos)")
    identificador_matriz_filial: Optional[str] = Field(None, description="1=Matriz, 2=Filial")
    nome_fantasia: Optional[str] = Field(None, description="Nome fantasia")
    situacao_cadastral: Optional[str] = Field(None, description="Situação cadastral")
    data_situacao_cadastral: Optional[date] = Field(None, description="Data situação cadastral")
    motivo_situacao_cadastral: Optional[str] = Field(None, description="Motivo da situação")
    data_inicio_atividade: Optional[date] = Field(None, description="Data início atividades")
    cnae_fiscal_principal: Optional[str] = Field(None, description="CNAE principal")
    cnae_fiscal_secundaria: Optional[str] = Field(None, description="CNAEs secundários (separados por vírgula)")
    tipo_logradouro: Optional[str] = Field(None, description="Tipo logradouro")
    logradouro: Optional[str] = Field(None, description="Logradouro")
    numero: Optional[str] = Field(None, description="Número")
    complemento: Optional[str] = Field(None, description="Complemento")
    bairro: Optional[str] = Field(None, description="Bairro")
    cep: Optional[str] = Field(None, description="CEP")
    uf: Optional[str] = Field(None, description="UF")
    municipio: Optional[str] = Field(None, description="Código município IBGE")
    ddd_1: Optional[str] = Field(None, description="DDD telefone 1")
    telefone_1: Optional[str] = Field(None, description="Telefone 1")
    ddd_2: Optional[str] = Field(None, description="DDD telefone 2")
    telefone_2: Optional[str] = Field(None, description="Telefone 2")
    ddd_fax: Optional[str] = Field(None, description="DDD fax")
    fax: Optional[str] = Field(None, description="Fax")
    correio_eletronico: Optional[str] = Field(None, description="E-mail")
    situacao_especial: Optional[str] = Field(None, description="Situação especial")
    data_situacao_especial: Optional[date] = Field(None, description="Data situação especial")
    
    model_config = ConfigDict(from_attributes=True)
    
    @computed_field
    @property
    def cnpj_completo(self) -> str:
        """CNPJ completo (14 dígitos)"""
        return f"{self.cnpj_basico}{self.cnpj_ordem}{self.cnpj_dv}"
    
    @computed_field
    @property
    def cnpj_formatado(self) -> str:
        """CNPJ formatado (XX.XXX.XXX/XXXX-XX)"""
        cnpj = self.cnpj_completo
        return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"
    
    @computed_field
    @property
    def is_matriz(self) -> bool:
        """Indica se é matriz"""
        return self.identificador_matriz_filial == "1"
    
    @computed_field
    @property
    def is_ativa(self) -> bool:
        """Indica se está ativa (situação cadastral = 02)"""
        return self.situacao_cadastral == "02"
    
    @computed_field
    @property
    def tipo_estabelecimento(self) -> str:
        """Tipo: Matriz ou Filial"""
        return "Matriz" if self.is_matriz else "Filial"
    
    @computed_field
    @property
    def situacao_descricao(self) -> str:
        """Descrição da situação cadastral"""
        situacoes = {
            "01": "Nula",
            "02": "Ativa",
            "03": "Suspensa",
            "04": "Inapta",
            "08": "Baixada"
        }
        return situacoes.get(self.situacao_cadastral or "", "Desconhecida")
    
    @computed_field
    @property
    def endereco_completo(self) -> str:
        """Endereço formatado"""
        partes = []
        
        if self.tipo_logradouro and self.logradouro:
            partes.append(f"{self.tipo_logradouro} {self.logradouro}")
        elif self.logradouro:
            partes.append(self.logradouro)
        
        if self.numero:
            partes.append(f"nº {self.numero}")
        
        if self.complemento:
            partes.append(self.complemento)
        
        if self.bairro:
            partes.append(self.bairro)
        
        return ", ".join(partes) if partes else "Endereço não informado"
    
    @computed_field
    @property
    def telefone_principal(self) -> Optional[str]:
        """Telefone principal formatado"""
        if self.ddd_1 and self.telefone_1:
            return f"({self.ddd_1}) {self.telefone_1}"
        return None
    
    @computed_field
    @property
    def cep_formatado(self) -> Optional[str]:
        """CEP formatado (XXXXX-XXX)"""
        if self.cep and len(self.cep) == 8:
            return f"{self.cep[:5]}-{self.cep[5:]}"
        return self.cep


class EstabelecimentoCompleto(EstabelecimentoBase):
    """Schema completo de Estabelecimento com relacionamentos"""
    empresa: Optional[EmpresaBase] = Field(None, description="Dados da empresa")
    cnae_principal: Optional[CNAEBase] = Field(None, description="CNAE principal detalhado")
    municipio_obj: Optional[MunicipioBase] = Field(None, description="Município detalhado")
    pais_obj: Optional[PaisBase] = Field(None, description="País")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "cnpj_completo": "12345678000195",
                "cnpj_formatado": "12.345.678/0001-95",
                "nome_fantasia": "Loja Exemplo",
                "is_matriz": True,
                "is_ativa": True,
                "tipo_estabelecimento": "Matriz",
                "situacao_descricao": "Ativa",
                "endereco_completo": "Rua Exemplo, nº 123, Centro",
                "telefone_principal": "(11) 98765-4321",
                "cnae_principal": {
                    "codigo": "4712100",
                    "descricao": "Comércio varejista"
                }
            }
        }
    )


# ================================================================
# SÓCIO - Schemas Base e Detalhados
# ================================================================

class SocioBase(BaseModel):
    """Schema base para Sócio"""
    cnpj_basico: str = Field(..., description="CNPJ básico da empresa")
    identificador_socio: str = Field(..., description="Identificador do sócio")
    nome_socio: Optional[str] = Field(None, description="Nome do sócio/razão social")
    cnpj_cpf_socio: Optional[str] = Field(None, description="CPF/CNPJ do sócio")
    qualificacao_socio: Optional[str] = Field(None, description="Código qualificação")
    data_entrada_sociedade: Optional[date] = Field(None, description="Data entrada na sociedade")
    pais: Optional[str] = Field(None, description="Código país")
    representante_legal: Optional[str] = Field(None, description="Nome representante legal")
    nome_representante: Optional[str] = Field(None, description="Nome do representante")
    qualificacao_representante: Optional[str] = Field(None, description="Qualificação do representante")
    faixa_etaria: Optional[str] = Field(None, description="Faixa etária")
    
    model_config = ConfigDict(from_attributes=True)
    
    @computed_field
    @property
    def tipo_socio(self) -> str:
        """Tipo de sócio baseado no documento"""
        if not self.cnpj_cpf_socio:
            return "Desconhecido"
        
        doc_limpo = ''.join(c for c in self.cnpj_cpf_socio if c.isdigit())
        
        if len(doc_limpo) == 11:
            return "Pessoa Física"
        elif len(doc_limpo) == 14:
            return "Pessoa Jurídica"
        else:
            return "Estrangeiro"
    
    @computed_field
    @property
    def documento_formatado(self) -> Optional[str]:
        """CPF/CNPJ formatado"""
        if not self.cnpj_cpf_socio:
            return None
        
        doc_limpo = ''.join(c for c in self.cnpj_cpf_socio if c.isdigit())
        
        if len(doc_limpo) == 11:  # CPF
            return f"{doc_limpo[:3]}.{doc_limpo[3:6]}.{doc_limpo[6:9]}-{doc_limpo[9:11]}"
        elif len(doc_limpo) == 14:  # CNPJ
            return f"{doc_limpo[:2]}.{doc_limpo[2:5]}.{doc_limpo[5:8]}/{doc_limpo[8:12]}-{doc_limpo[12:14]}"
        else:
            return self.cnpj_cpf_socio
    
    @computed_field
    @property
    def faixa_etaria_descricao(self) -> str:
        """Descrição da faixa etária"""
        faixas = {
            "1": "0 a 12 anos",
            "2": "13 a 20 anos",
            "3": "21 a 30 anos",
            "4": "31 a 40 anos",
            "5": "41 a 50 anos",
            "6": "51 a 60 anos",
            "7": "61 a 70 anos",
            "8": "71 a 80 anos",
            "9": "Mais de 80 anos"
        }
        return faixas.get(self.faixa_etaria or "", "Não informada")


class SocioDetalhado(SocioBase):
    """Schema detalhado de Sócio com relacionamentos"""
    empresa: Optional[EmpresaBase] = Field(None, description="Dados da empresa")
    qualificacao: Optional[QualificacaoSocioBase] = Field(None, description="Qualificação detalhada")
    qualificacao_rep: Optional[QualificacaoSocioBase] = Field(None, description="Qualificação do representante")
    pais_obj: Optional[PaisBase] = Field(None, description="País do sócio")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "nome_socio": "João da Silva",
                "tipo_socio": "Pessoa Física",
                "documento_formatado": "123.456.789-00",
                "data_entrada_sociedade": "2020-01-15",
                "faixa_etaria_descricao": "31 a 40 anos",
                "qualificacao": {
                    "codigo": "49",
                    "descricao": "Sócio-Administrador"
                }
            }
        }
    )


# ================================================================
# SIMPLES NACIONAL - Schemas
# ================================================================

class SimplesNacionalBase(BaseModel):
    """Schema para Simples Nacional"""
    cnpj_basico: str = Field(..., description="CNPJ básico")
    opcao_simples: Optional[str] = Field(None, description="S=Sim, N=Não")
    data_opcao_simples: Optional[date] = Field(None, description="Data opção Simples")
    data_exclusao_simples: Optional[date] = Field(None, description="Data exclusão Simples")
    opcao_mei: Optional[str] = Field(None, description="S=Sim, N=Não")
    data_opcao_mei: Optional[date] = Field(None, description="Data opção MEI")
    data_exclusao_mei: Optional[date] = Field(None, description="Data exclusão MEI")
    
    model_config = ConfigDict(from_attributes=True)
    
    @computed_field
    @property
    def is_simples(self) -> bool:
        """Indica se é optante do Simples Nacional"""
        return self.opcao_simples == "S"
    
    @computed_field
    @property
    def is_mei(self) -> bool:
        """Indica se é MEI (Microempreendedor Individual)"""
        return self.opcao_mei == "S"
    
    @computed_field
    @property
    def regime_tributario(self) -> str:
        """Regime tributário"""
        if self.is_mei:
            return "MEI - Microempreendedor Individual"
        elif self.is_simples:
            return "Simples Nacional"
        else:
            return "Lucro Real/Presumido"
    
    @computed_field
    @property
    def status_simples(self) -> str:
        """Status da opção Simples"""
        if self.opcao_simples == "S":
            if self.data_exclusao_simples:
                return f"Excluído em {self.data_exclusao_simples}"
            else:
                return f"Optante desde {self.data_opcao_simples}"
        else:
            return "Não optante"


# ================================================================
# SCHEMAS DE RESPOSTA COMPLETOS
# ================================================================

class EmpresaCompleta(BaseModel):
    """Schema para resposta completa de empresa (dados + estabelecimentos + sócios + Simples)"""
    empresa: EmpresaDetalhada = Field(..., description="Dados cadastrais da empresa")
    estabelecimentos: List[EstabelecimentoCompleto] = Field(default_factory=list, description="Lista de estabelecimentos")
    socios: List[SocioDetalhado] = Field(default_factory=list, description="Quadro societário")
    simples_nacional: Optional[SimplesNacionalBase] = Field(None, description="Regime Simples Nacional")
    total_estabelecimentos: int = Field(..., description="Total de estabelecimentos")
    total_socios: int = Field(..., description="Total de sócios")
    is_simples: bool = Field(..., description="Se é optante do Simples")
    is_mei: bool = Field(..., description="Se é MEI")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "empresa": {
                    "cnpj_basico": "12345678",
                    "razao_social": "EMPRESA EXEMPLO LTDA",
                    "porte_descricao": "Empresa de Pequeno Porte"
                },
                "estabelecimentos": [],
                "socios": [],
                "total_estabelecimentos": 3,
                "total_socios": 2,
                "is_simples": True,
                "is_mei": False
            }
        }
    )


# ================================================================
# SCHEMAS DE REQUEST (Filtros e Buscas)
# ================================================================

class SearchEmpresaRequest(BaseModel):
    """Schema para busca de empresas"""
    razao_social: Optional[str] = Field(None, min_length=3, max_length=200, description="Razão social (mínimo 3 caracteres)")
    natureza_juridica: Optional[str] = Field(None, description="Código natureza jurídica")
    porte: Optional[str] = Field(None, pattern="^(01|03|05)$", description="Porte: 01=ME, 03=EPP, 05=Demais")
    limit: int = Field(50, ge=1, le=100, description="Limite de resultados (1-100)")
    offset: int = Field(0, ge=0, description="Offset para paginação")
    
    @field_validator('razao_social')
    @classmethod
    def validate_razao_social(cls, v: Optional[str]) -> Optional[str]:
        """Valida e limpa termo de busca"""
        if v:
            v = v.strip()
            if len(v) < 3:
                raise ValueError("Razão social deve ter no mínimo 3 caracteres")
        return v
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "razao_social": "COMERCIO",
                "porte": "01",
                "limit": 50,
                "offset": 0
            }
        }
    )


class SearchSocioRequest(BaseModel):
    """Schema para busca de sócios"""
    nome: Optional[str] = Field(None, min_length=3, max_length=200, description="Nome do sócio (mínimo 3 caracteres)")
    cnpj_cpf: Optional[str] = Field(None, description="CPF ou CNPJ do sócio")
    cnpj_empresa: Optional[str] = Field(None, pattern="^\\d{8}$", description="CNPJ básico da empresa (8 dígitos)")
    limit: int = Field(50, ge=1, le=100, description="Limite de resultados (1-100)")
    offset: int = Field(0, ge=0, description="Offset para paginação")
    
    @field_validator('cnpj_cpf')
    @classmethod
    def validate_documento(cls, v: Optional[str]) -> Optional[str]:
        """Remove formatação do CPF/CNPJ"""
        if v:
            v = ''.join(c for c in v if c.isdigit())
            if len(v) not in [11, 14]:
                raise ValueError("CPF deve ter 11 dígitos ou CNPJ 14 dígitos")
        return v
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "nome": "SILVA",
                "limit": 50,
                "offset": 0
            }
        }
    )


class SearchEstabelecimentoRequest(BaseModel):
    """Schema para busca de estabelecimentos"""
    cnpj_completo: Optional[str] = Field(None, pattern="^\\d{14}$", description="CNPJ completo (14 dígitos)")
    cnpj_basico: Optional[str] = Field(None, pattern="^\\d{8}$", description="CNPJ básico (8 dígitos)")
    cnae: Optional[str] = Field(None, description="Código CNAE")
    municipio: Optional[str] = Field(None, description="Código município IBGE")
    uf: Optional[str] = Field(None, pattern="^[A-Z]{2}$", description="UF (2 letras maiúsculas)")
    apenas_matriz: bool = Field(False, description="Se True, retorna apenas matrizes")
    apenas_ativos: bool = Field(False, description="Se True, retorna apenas estabelecimentos ativos")
    limit: int = Field(50, ge=1, le=100, description="Limite de resultados (1-100)")
    
    @field_validator('cnpj_completo', 'cnpj_basico')
    @classmethod
    def validate_cnpj(cls, v: Optional[str]) -> Optional[str]:
        """Remove formatação do CNPJ"""
        if v:
            v = ''.join(c for c in v if c.isdigit())
        return v
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "uf": "SP",
                "apenas_ativos": True,
                "limit": 50
            }
        }
    )


# ================================================================
# SCHEMAS DE RESPOSTA PAGINADA
# ================================================================

class PaginatedResponse(BaseModel):
    """Schema genérico para respostas paginadas"""
    total: int = Field(..., description="Total de resultados encontrados")
    limit: int = Field(..., description="Limite de resultados por página")
    offset: int = Field(..., description="Offset atual")
    count: int = Field(..., description="Quantidade de resultados retornados")
    
    model_config = ConfigDict(from_attributes=True)


class EmpresasResponse(PaginatedResponse):
    """Resposta paginada de empresas"""
    items: List[EmpresaDetalhada] = Field(default_factory=list, description="Lista de empresas")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total": 16327424,
                "limit": 50,
                "offset": 0,
                "count": 50,
                "items": []
            }
        }
    )


class SociosResponse(PaginatedResponse):
    """Resposta paginada de sócios"""
    items: List[SocioDetalhado] = Field(default_factory=list, description="Lista de sócios")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total": 3003483,
                "limit": 50,
                "offset": 0,
                "count": 50,
                "items": []
            }
        }
    )


class EstabelecimentosResponse(PaginatedResponse):
    """Resposta paginada de estabelecimentos"""
    items: List[EstabelecimentoCompleto] = Field(default_factory=list, description="Lista de estabelecimentos")
