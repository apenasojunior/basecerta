"""
Endpoints REST API para Base CNPJ
Feature: S02-F04
Sprint: S02 - Integração Base CNPJ

API REST para consulta de dados CNPJ da Receita Federal.
Endpoints otimizados com uso de índices e paginação.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.crud.cnpj import CNPJRepository
from app.schemas.cnpj import (
    EmpresaCompleta,
    EmpresaDetalhada,
    EstabelecimentoCompleto,
    SocioDetalhado,
    SimplesNacionalBase,
    SearchEmpresaRequest,
    SearchSocioRequest,
    EmpresasResponse,
    SociosResponse
)

# Router para endpoints CNPJ
router = APIRouter(
    prefix="/cnpj",
    tags=["CNPJ - Dados Receita Federal"],
    responses={
        404: {"description": "Recurso não encontrado"},
        500: {"description": "Erro interno do servidor"}
    }
)


# ================================================================
# EMPRESAS - Endpoints
# ================================================================

@router.get(
    "/empresa/{cnpj_basico}",
    response_model=EmpresaCompleta,
    summary="Buscar empresa por CNPJ básico",
    description="""
    Retorna dados completos de uma empresa incluindo:
    - Dados cadastrais da empresa
    - Todos os estabelecimentos (matriz + filiais)
    - Quadro societário completo
    - Informações Simples Nacional / MEI
    
    **Parâmetro:** CNPJ básico (8 primeiros dígitos)
    
    **Exemplo:** `12345678`
    """,
    response_description="Dados completos da empresa"
)
def get_empresa(
    cnpj_basico: str,
    db: Session = Depends(get_db)
) -> EmpresaCompleta:
    """
    Busca empresa por CNPJ básico (8 dígitos)
    
    Retorna dados completos incluindo estabelecimentos e sócios.
    """
    # Validar formato CNPJ básico
    if len(cnpj_basico) != 8 or not cnpj_basico.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ básico deve ter 8 dígitos numéricos"
        )
    
    # Buscar empresa completa
    resultado = CNPJRepository.get_empresa_completa(db, cnpj_basico)
    
    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Empresa com CNPJ básico {cnpj_basico} não encontrada"
        )
    
    return EmpresaCompleta.model_validate(resultado)


@router.get(
    "/empresa/{cnpj_basico}/simples",
    response_model=Optional[SimplesNacionalBase],
    summary="Verificar regime Simples Nacional",
    description="Verifica se empresa é optante do Simples Nacional ou MEI"
)
def get_simples_nacional(
    cnpj_basico: str,
    db: Session = Depends(get_db)
) -> Optional[SimplesNacionalBase]:
    """Verifica regime Simples Nacional / MEI"""
    if len(cnpj_basico) != 8 or not cnpj_basico.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ básico deve ter 8 dígitos numéricos"
        )
    
    simples = CNPJRepository.get_simples_by_empresa(db, cnpj_basico)
    
    if simples:
        return SimplesNacionalBase.model_validate(simples)
    
    return None


@router.get(
    "/search/empresas",
    response_model=EmpresasResponse,
    summary="Buscar empresas com filtros",
    description="""
    Busca empresas por razão social, natureza jurídica ou porte.
    
    **Filtros disponíveis:**
    - `razao_social`: Busca por nome (mínimo 3 caracteres)
    - `natureza_juridica`: Código natureza (ex: 206-2)
    - `porte`: 01=ME, 03=EPP, 05=Demais
    - `limit`: Máximo de resultados (1-100, padrão: 50)
    - `offset`: Paginação
    
    **Exemplo:** `/search/empresas?razao_social=COMERCIO&porte=01&limit=20`
    
    **Performance:** Usa índice `idx_empresas_razao_social` para buscas textuais.
    """,
    response_description="Lista paginada de empresas"
)
def search_empresas(
    razao_social: Optional[str] = Query(None, min_length=3, max_length=200, description="Razão social (mínimo 3 caracteres)"),
    natureza_juridica: Optional[str] = Query(None, description="Código natureza jurídica"),
    porte: Optional[str] = Query(None, pattern="^(01|03|05)$", description="Porte: 01=ME, 03=EPP, 05=Demais"),
    limit: int = Query(50, ge=1, le=100, description="Limite de resultados"),
    offset: int = Query(0, ge=0, description="Offset para paginação"),
    db: Session = Depends(get_db)
) -> EmpresasResponse:
    """
    Busca empresas com filtros e paginação
    """
    empresas: List = []
    total = 0
    
    # Busca por razão social
    if razao_social:
        empresas, total = CNPJRepository.search_empresas_by_razao_social(
            db, razao_social, limit=limit, offset=offset
        )
    
    # Busca por natureza jurídica
    elif natureza_juridica:
        empresas = CNPJRepository.get_empresas_by_natureza_juridica(
            db, natureza_juridica, limit=limit
        )
        total = len(empresas)
    
    # Busca por porte
    elif porte:
        empresas = CNPJRepository.get_empresas_by_porte(
            db, porte, limit=limit
        )
        total = len(empresas)
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="É necessário fornecer ao menos um filtro: razao_social, natureza_juridica ou porte"
        )
    
    # Validar schemas
    empresas_validadas = [EmpresaDetalhada.model_validate(e) for e in empresas]
    
    return EmpresasResponse(
        total=total,
        limit=limit,
        offset=offset,
        count=len(empresas_validadas),
        items=empresas_validadas
    )


# ================================================================
# ESTABELECIMENTOS - Endpoints
# ================================================================

@router.get(
    "/estabelecimento/{cnpj_completo}",
    response_model=EstabelecimentoCompleto,
    summary="Buscar estabelecimento por CNPJ completo",
    description="""
    Busca estabelecimento por CNPJ completo (14 dígitos).
    
    Retorna dados detalhados incluindo:
    - Endereço completo e contatos
    - CNAE principal e secundários
    - Situação cadastral
    - Dados da empresa matriz
    
    **Parâmetro:** CNPJ completo (14 dígitos, sem formatação)
    
    **Exemplo:** `12345678000195`
    """,
    response_description="Dados completos do estabelecimento"
)
def get_estabelecimento(
    cnpj_completo: str,
    db: Session = Depends(get_db)
) -> EstabelecimentoCompleto:
    """
    Busca estabelecimento por CNPJ completo (14 dígitos)
    """
    # Limpar formatação
    cnpj_completo = ''.join(c for c in cnpj_completo if c.isdigit())
    
    # Validar formato
    if len(cnpj_completo) != 14:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ completo deve ter 14 dígitos numéricos"
        )
    
    # Buscar estabelecimento
    estabelecimento = CNPJRepository.get_estabelecimento_by_cnpj_completo(
        db, cnpj_completo, include_relations=True
    )
    
    if not estabelecimento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Estabelecimento com CNPJ {cnpj_completo} não encontrado"
        )
    
    return EstabelecimentoCompleto.model_validate(estabelecimento)


@router.get(
    "/estabelecimentos/empresa/{cnpj_basico}",
    response_model=List[EstabelecimentoCompleto],
    summary="Listar estabelecimentos de uma empresa",
    description="""
    Lista todos os estabelecimentos (matriz + filiais) de uma empresa.
    
    **Filtros opcionais:**
    - `apenas_matriz`: Se true, retorna apenas a matriz
    - `apenas_ativos`: Se true, retorna apenas estabelecimentos ativos
    """,
    response_description="Lista de estabelecimentos"
)
def get_estabelecimentos_empresa(
    cnpj_basico: str,
    apenas_matriz: bool = Query(False, description="Retornar apenas matriz"),
    apenas_ativos: bool = Query(False, description="Retornar apenas ativos"),
    db: Session = Depends(get_db)
) -> List[EstabelecimentoCompleto]:
    """Lista estabelecimentos de uma empresa"""
    if len(cnpj_basico) != 8 or not cnpj_basico.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ básico deve ter 8 dígitos numéricos"
        )
    
    estabelecimentos = CNPJRepository.get_estabelecimentos_by_empresa(
        db, cnpj_basico, apenas_matriz=apenas_matriz, apenas_ativos=apenas_ativos
    )
    
    if not estabelecimentos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nenhum estabelecimento encontrado para CNPJ básico {cnpj_basico}"
        )
    
    return [EstabelecimentoCompleto.model_validate(e) for e in estabelecimentos]


# ================================================================
# SÓCIOS - Endpoints
# ================================================================

@router.get(
    "/socios/empresa/{cnpj_basico}",
    response_model=List[SocioDetalhado],
    summary="Listar sócios de uma empresa",
    description="""
    Retorna quadro societário completo de uma empresa.
    
    Inclui informações sobre:
    - Nome e documento (CPF/CNPJ) do sócio
    - Qualificação na empresa
    - Data de entrada na sociedade
    - Faixa etária
    - Representante legal (se houver)
    """,
    response_description="Lista de sócios"
)
def get_socios_empresa(
    cnpj_basico: str,
    db: Session = Depends(get_db)
) -> List[SocioDetalhado]:
    """Lista sócios de uma empresa"""
    if len(cnpj_basico) != 8 or not cnpj_basico.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ básico deve ter 8 dígitos numéricos"
        )
    
    socios = CNPJRepository.get_socios_by_empresa(
        db, cnpj_basico, include_relations=True
    )
    
    # Não retornar 404 se não houver sócios (empresa pode não ter sócios cadastrados)
    return [SocioDetalhado.model_validate(s) for s in socios]


@router.get(
    "/socios/search",
    response_model=SociosResponse,
    summary="Buscar sócios por nome ou documento",
    description="""
    Busca sócios por nome ou CPF/CNPJ.
    
    **Filtros disponíveis:**
    - `nome`: Nome do sócio (mínimo 3 caracteres)
    - `cnpj_cpf`: CPF (11 dígitos) ou CNPJ (14 dígitos) do sócio
    - `limit`: Máximo de resultados (1-100, padrão: 50)
    - `offset`: Paginação
    
    **Exemplo:** `/socios/search?nome=SILVA&limit=20`
    
    **Performance:** Usa índices `idx_socios_nome` e `idx_socios_cnpj_cpf_socio`.
    """,
    response_description="Lista paginada de sócios"
)
def search_socios(
    nome: Optional[str] = Query(None, min_length=3, max_length=200, description="Nome do sócio"),
    cnpj_cpf: Optional[str] = Query(None, description="CPF ou CNPJ do sócio"),
    limit: int = Query(50, ge=1, le=100, description="Limite de resultados"),
    offset: int = Query(0, ge=0, description="Offset para paginação"),
    db: Session = Depends(get_db)
) -> SociosResponse:
    """Busca sócios por nome ou documento"""
    socios: List = []
    total = 0
    
    # Busca por nome
    if nome:
        socios, total = CNPJRepository.search_socios_by_nome(
            db, nome, limit=limit, offset=offset
        )
    
    # Busca por CPF/CNPJ
    elif cnpj_cpf:
        # Limpar formatação
        doc_limpo = ''.join(c for c in cnpj_cpf if c.isdigit())
        
        if len(doc_limpo) not in [11, 14]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF deve ter 11 dígitos ou CNPJ 14 dígitos"
            )
        
        socios = CNPJRepository.search_by_cnpj_cpf_socio(
            db, doc_limpo, include_empresa=True
        )
        total = len(socios)
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="É necessário fornecer ao menos um filtro: nome ou cnpj_cpf"
        )
    
    # Validar schemas
    socios_validados = [SocioDetalhado.model_validate(s) for s in socios]
    
    return SociosResponse(
        total=total,
        limit=limit,
        offset=offset,
        count=len(socios_validados),
        items=socios_validados
    )


# ================================================================
# HEALTH CHECK
# ================================================================

@router.get(
    "/health",
    summary="Health check",
    description="Verifica se a API CNPJ está funcionando",
    tags=["Health"]
)
def health_check(db: Session = Depends(get_db)):
    """Health check do serviço CNPJ"""
    try:
        # Testar conexão com banco
        from app.models.cnpj import Empresa
        db.query(Empresa).first()
        
        return {
            "status": "healthy",
            "service": "CNPJ API",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Serviço indisponível: {str(e)}"
        )
