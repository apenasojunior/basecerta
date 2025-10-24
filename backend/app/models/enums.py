"""
Enums e Mapeamentos - Smart CNPJ
Issue: 2.1.1 - Smart CNPJ Backend

Mapeamentos de códigos para descrições amigáveis.
Baseado no documento DE_PARA_FRONTEND_BACKEND.md
"""
from enum import Enum
from typing import Dict


# ================================================================
# PORTE DA EMPRESA
# ================================================================

class PorteEmpresa(str, Enum):
    """Porte da empresa (campo: porte_empresa)"""
    NAO_INFORMADO = "00"
    MICROEMPRESA = "01"
    EMPRESA_PEQUENO_PORTE = "03"
    DEMAIS = "05"


PORTE_EMPRESA_DESCRICAO: Dict[str, str] = {
    "00": "Não Informado",
    "01": "Microempresa",
    "03": "Empresa de Pequeno Porte",
    "05": "Demais"
}


def get_porte_descricao(codigo: str) -> str:
    """Retorna descrição do porte da empresa"""
    return PORTE_EMPRESA_DESCRICAO.get(codigo, "Não Informado")


# ================================================================
# SITUAÇÃO CADASTRAL
# ================================================================

class SituacaoCadastral(str, Enum):
    """Situação cadastral (campo: situacao_cadastral)"""
    NULA = "01"
    ATIVA = "02"
    SUSPENSA = "03"
    INAPTA = "04"
    BAIXADA = "08"


SITUACAO_CADASTRAL_DESCRICAO: Dict[str, str] = {
    "01": "Nula",
    "02": "Ativa",
    "03": "Suspensa",
    "04": "Inapta",
    "08": "Baixada"
}


def get_situacao_descricao(codigo: str) -> str:
    """Retorna descrição da situação cadastral"""
    return SITUACAO_CADASTRAL_DESCRICAO.get(codigo, "Desconhecida")


# ================================================================
# TIPO DE ESTABELECIMENTO
# ================================================================

class TipoEstabelecimento(str, Enum):
    """Tipo de estabelecimento (campo: identificador_matriz_filial)"""
    MATRIZ = "1"
    FILIAL = "2"


TIPO_ESTABELECIMENTO_DESCRICAO: Dict[str, str] = {
    "1": "Matriz",
    "2": "Filial"
}


def get_tipo_estabelecimento_descricao(codigo: str) -> str:
    """Retorna descrição do tipo de estabelecimento"""
    return TIPO_ESTABELECIMENTO_DESCRICAO.get(codigo, "Desconhecido")


# ================================================================
# IDENTIFICADOR DE SÓCIO
# ================================================================

class IdentificadorSocio(str, Enum):
    """Identificador do sócio (campo: identificador_socio)"""
    PESSOA_FISICA = "1"
    PESSOA_JURIDICA = "2"
    ESTRANGEIRO = "3"


IDENTIFICADOR_SOCIO_DESCRICAO: Dict[str, str] = {
    "1": "Pessoa Física",
    "2": "Pessoa Jurídica",
    "3": "Estrangeiro"
}


def get_identificador_socio_descricao(codigo: str) -> str:
    """Retorna descrição do identificador do sócio"""
    return IDENTIFICADOR_SOCIO_DESCRICAO.get(codigo, "Desconhecido")


# ================================================================
# OPÇÃO SIMPLES NACIONAL / MEI
# ================================================================

class OpcaoSimples(str, Enum):
    """Opção pelo Simples Nacional ou MEI"""
    SIM = "S"
    NAO = "N"


def is_simples_nacional(opcao: str) -> bool:
    """Verifica se é optante do Simples Nacional"""
    return opcao == "S"


def is_mei(opcao: str) -> bool:
    """Verifica se é MEI"""
    return opcao == "S"


# ================================================================
# TIPOS DE BUSCA (Frontend)
# ================================================================

class TipoBusca(str, Enum):
    """Tipos de busca disponíveis no Smart CNPJ"""
    CNPJ = "cnpj"
    RAZAO_SOCIAL = "razao_social"
    SEGMENTO = "segmento"
    EMAIL = "email"
    TELEFONE = "telefone"
    NOME_SOCIO = "nome_socio"
    CEP = "cep"


TIPO_BUSCA_DESCRICAO: Dict[str, str] = {
    "cnpj": "CNPJ",
    "razao_social": "Razão Social",
    "segmento": "Segmento (CNAE)",
    "email": "E-mail",
    "telefone": "Telefone",
    "nome_socio": "Nome do Sócio",
    "cep": "CEP"
}


def get_tipo_busca_descricao(tipo: str) -> str:
    """Retorna descrição do tipo de busca"""
    return TIPO_BUSCA_DESCRICAO.get(tipo, tipo.replace("_", " ").title())


# ================================================================
# FORMATADORES
# ================================================================

def formatar_cnpj(cnpj: str) -> str:
    """
    Formata CNPJ: 00000000000000 -> 00.000.000/0000-00
    
    Args:
        cnpj: CNPJ sem formatação (14 dígitos)
    
    Returns:
        CNPJ formatado
    """
    if not cnpj or len(cnpj) != 14:
        return cnpj
    
    return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"


def formatar_cpf(cpf: str) -> str:
    """
    Formata CPF: 00000000000 -> 000.000.000-00
    
    Args:
        cpf: CPF sem formatação (11 dígitos)
    
    Returns:
        CPF formatado
    """
    if not cpf or len(cpf) != 11:
        return cpf
    
    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:11]}"


def formatar_cep(cep: str) -> str:
    """
    Formata CEP: 00000000 -> 00000-000
    
    Args:
        cep: CEP sem formatação (8 dígitos)
    
    Returns:
        CEP formatado
    """
    if not cep or len(cep) != 8:
        return cep
    
    return f"{cep[:5]}-{cep[5:8]}"


def formatar_telefone(ddd: str, telefone: str) -> str:
    """
    Formata telefone: DDD + Telefone -> (00) 0000-0000 ou (00) 00000-0000
    
    Args:
        ddd: DDD (2 dígitos)
        telefone: Telefone (8 ou 9 dígitos)
    
    Returns:
        Telefone formatado
    """
    if not ddd or not telefone:
        return ""
    
    telefone_limpo = telefone.replace("-", "").replace(" ", "")
    
    if len(telefone_limpo) == 8:
        return f"({ddd}) {telefone_limpo[:4]}-{telefone_limpo[4:]}"
    elif len(telefone_limpo) == 9:
        return f"({ddd}) {telefone_limpo[:5]}-{telefone_limpo[5:]}"
    else:
        return f"({ddd}) {telefone}"


def limpar_cnpj(cnpj: str) -> str:
    """
    Remove formatação do CNPJ: 00.000.000/0000-00 -> 00000000000000
    
    Args:
        cnpj: CNPJ formatado ou não
    
    Returns:
        CNPJ sem formatação (apenas dígitos)
    """
    if not cnpj:
        return ""
    
    return cnpj.replace(".", "").replace("/", "").replace("-", "").replace(" ", "")


def limpar_telefone(telefone: str) -> str:
    """
    Remove formatação do telefone: (00) 0000-0000 -> 000000000000
    
    Args:
        telefone: Telefone formatado ou não
    
    Returns:
        Telefone sem formatação (apenas dígitos)
    """
    if not telefone:
        return ""
    
    return telefone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "")


def limpar_cep(cep: str) -> str:
    """
    Remove formatação do CEP: 00000-000 -> 00000000
    
    Args:
        cep: CEP formatado ou não
    
    Returns:
        CEP sem formatação (apenas dígitos)
    """
    if not cep:
        return ""
    
    return cep.replace("-", "").replace(" ", "")
