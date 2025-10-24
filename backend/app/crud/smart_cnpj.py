"""
CRUD Operations - Smart CNPJ
Issue: 2.1.3 - CRUD Smart CNPJ Backend

Operações de banco de dados otimizadas para consultas CNPJ.
Pattern: Repository Pattern
"""
from typing import Optional, List, Tuple, Dict, Any
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, and_, or_, text
from datetime import datetime
import logging

from app.models.cnpj import (
    Empresa,
    Estabelecimento,
    Socio,
    CNAE,
    SimplesNacional,
    NaturezaJuridica,
    Municipio
)
from app.models.pesquisa import PesquisaCNPJ
from app.schemas.enums import TipoBusca

logger = logging.getLogger(__name__)


# ================================================================
# BUSCA POR CNPJ ESPECÍFICO
# ================================================================

def get_empresa_by_cnpj(
    db: Session,
    cnpj: str,
    include_socios: bool = True,
    include_cnaes_secundarios: bool = True
) -> Optional[Estabelecimento]:
    """
    Busca empresa por CNPJ completo (14 dígitos).
    
    Retorna o estabelecimento (matriz ou filial) com dados completos:
    - Empresa (dados básicos da razão social)
    - Estabelecimento (dados do local específico)
    - Sócios (opcional)
    - CNAEs secundários (opcional)
    
    Args:
        db: Sessão do banco
        cnpj: CNPJ completo formatado ou não (14 dígitos)
        include_socios: Se deve incluir sócios
        include_cnaes_secundarios: Se deve incluir CNAEs secundários
    
    Returns:
        Estabelecimento com relacionamentos carregados ou None
    
    Examples:
        >>> estabelecimento = get_empresa_by_cnpj(db, "11779918000105")
        >>> print(estabelecimento.empresa.razao_social)
        "N. F. C. VIANNA"
    """
    # Remove formatação do CNPJ
    cnpj_limpo = ''.join(filter(str.isdigit, cnpj))
    
    if len(cnpj_limpo) != 14:
        logger.warning(f"CNPJ inválido: {cnpj}")
        return None
    
    # Divide CNPJ em partes (8-4-2)
    cnpj_basico = cnpj_limpo[:8]
    cnpj_ordem = cnpj_limpo[8:12]
    cnpj_dv = cnpj_limpo[12:14]
    
    # Query base com eager loading
    query = db.query(Estabelecimento).options(
        joinedload(Estabelecimento.empresa),
        joinedload(Estabelecimento.municipio),
        joinedload(Estabelecimento.cnae_fiscal)
    )
    
    # Filtro por CNPJ (composite key)
    query = query.filter(
        and_(
            Estabelecimento.cnpj_basico == cnpj_basico,
            Estabelecimento.cnpj_ordem == cnpj_ordem,
            Estabelecimento.cnpj_dv == cnpj_dv
        )
    )
    
    # Eager loading opcional de sócios
    if include_socios:
        query = query.options(joinedload(Estabelecimento.empresa).joinedload(Empresa.socios))
    
    # Eager loading opcional de CNAEs secundários
    if include_cnaes_secundarios:
        # TODO: Implementar quando existir tabela de CNAEs secundários
        pass
    
    estabelecimento = query.first()
    
    if estabelecimento:
        logger.info(f"Empresa encontrada: CNPJ={cnpj}, Razão Social={estabelecimento.empresa.razao_social}")
    else:
        logger.info(f"Empresa não encontrada: CNPJ={cnpj}")
    
    return estabelecimento


# ================================================================
# BUSCA DINÂMICA COM FILTROS
# ================================================================

def search_empresas(
    db: Session,
    tipo_busca: TipoBusca,
    valor_busca: str,
    filtros: Optional[Dict[str, Any]] = None,
    page: int = 1,
    limit: int = 20
) -> Tuple[List[Estabelecimento], int]:
    """
    Busca dinâmica de empresas com 7 tipos de busca + 8 filtros.
    
    Tipos de busca:
    1. CNPJ: Busca por CNPJ específico
    2. RAZAO_SOCIAL: Busca parcial na razão social
    3. SEGMENTO: Busca por CNAE (código ou descrição)
    4. EMAIL: Busca parcial em email
    5. TELEFONE: Busca parcial em telefones
    6. NOME_SOCIO: Busca por nome de sócio (JOIN)
    7. CEP: Busca por CEP (parcial)
    
    Filtros opcionais (AND conditions):
    - uf: Sigla UF (ex: "SP")
    - municipio: Código município IBGE
    - situacao: Código situação cadastral
    - porte: Código do porte
    - capitalMinimo: Capital social mínimo
    - capitalMaximo: Capital social máximo
    - dataAberturaInicio: Data de abertura inicial
    - dataAberturaFim: Data de abertura final
    
    Args:
        db: Sessão do banco
        tipo_busca: Tipo de busca (enum TipoBusca)
        valor_busca: Valor a pesquisar
        filtros: Dicionário com filtros opcionais
        page: Número da página (1-indexed)
        limit: Registros por página
    
    Returns:
        Tuple (lista de estabelecimentos, total de registros)
    
    Examples:
        >>> results, total = search_empresas(
        ...     db, TipoBusca.RAZAO_SOCIAL, "TECNOLOGIA",
        ...     filtros={"uf": "SP", "situacao": "02"},
        ...     page=1, limit=20
        ... )
        >>> print(f"Encontrados {total} resultados")
    """
    start_time = datetime.now()
    
    # Query base com joins necessários
    query = db.query(Estabelecimento).join(Estabelecimento.empresa)
    
    # Eager loading de relacionamentos
    query = query.options(
        joinedload(Estabelecimento.empresa),
        joinedload(Estabelecimento.municipio),
        joinedload(Estabelecimento.cnae_fiscal)
    )
    
    # Aplicar busca conforme tipo
    query = _apply_search_type(query, tipo_busca, valor_busca, db)
    
    # Aplicar filtros opcionais
    if filtros:
        query = _apply_filters(query, filtros)
    
    # Count total ANTES da paginação
    total = query.count()
    
    # Paginação
    offset = (page - 1) * limit
    query = query.limit(limit).offset(offset)
    
    # Executar query
    resultados = query.all()
    
    # Log de performance
    elapsed_ms = (datetime.now() - start_time).total_seconds() * 1000
    if elapsed_ms > 500:
        logger.warning(f"Query lenta: {elapsed_ms:.0f}ms - tipo={tipo_busca.value}, filtros={filtros}")
    else:
        logger.info(f"Search executada: {elapsed_ms:.0f}ms - {len(resultados)} resultados de {total}")
    
    return resultados, total


def _apply_search_type(
    query,
    tipo_busca: TipoBusca,
    valor: str,
    db: Session
):
    """Aplica filtro conforme tipo de busca"""
    
    if tipo_busca == TipoBusca.CNPJ:
        # Busca por CNPJ específico
        cnpj_limpo = ''.join(filter(str.isdigit, valor))
        if len(cnpj_limpo) == 14:
            cnpj_basico = cnpj_limpo[:8]
            cnpj_ordem = cnpj_limpo[8:12]
            cnpj_dv = cnpj_limpo[12:14]
            query = query.filter(
                and_(
                    Estabelecimento.cnpj_basico == cnpj_basico,
                    Estabelecimento.cnpj_ordem == cnpj_ordem,
                    Estabelecimento.cnpj_dv == cnpj_dv
                )
            )
    
    elif tipo_busca == TipoBusca.RAZAO_SOCIAL:
        # Busca parcial ILIKE (case-insensitive)
        query = query.filter(
            Empresa.razao_social.ilike(f"%{valor}%")
        )
    
    elif tipo_busca == TipoBusca.SEGMENTO:
        # Busca por CNAE (código ou descrição)
        # Primeiro tenta por código exato, depois por descrição
        cnae_codigo = valor.replace('.', '').replace('/', '').replace('-', '')
        query = query.filter(
            or_(
                Estabelecimento.cnae_fiscal_principal.like(f"{cnae_codigo}%"),
                # TODO: Join com tabela CNAE para busca por descrição
            )
        )
    
    elif tipo_busca == TipoBusca.EMAIL:
        # Busca parcial em email
        query = query.filter(
            Estabelecimento.correio_eletronico.ilike(f"%{valor}%")
        )
    
    elif tipo_busca == TipoBusca.TELEFONE:
        # Busca parcial em telefones (ddd + telefone1 ou ddd + telefone2)
        telefone_limpo = ''.join(filter(str.isdigit, valor))
        query = query.filter(
            or_(
                func.concat(Estabelecimento.ddd_telefone_1, Estabelecimento.telefone_1).like(f"%{telefone_limpo}%"),
                func.concat(Estabelecimento.ddd_telefone_2, Estabelecimento.telefone_2).like(f"%{telefone_limpo}%")
            )
        )
    
    elif tipo_busca == TipoBusca.NOME_SOCIO:
        # JOIN com tabela de sócios
        query = query.join(Empresa.socios).filter(
            Socio.nome_socio.ilike(f"%{valor}%")
        )
        # Distinct para evitar duplicatas
        query = query.distinct()
    
    elif tipo_busca == TipoBusca.CEP:
        # Busca por CEP (parcial)
        cep_limpo = ''.join(filter(str.isdigit, valor))
        query = query.filter(
            Estabelecimento.cep.like(f"{cep_limpo}%")
        )
    
    return query


def _apply_filters(query, filtros: Dict[str, Any]):
    """
    Aplica filtros opcionais à query.
    
    Query builder dinâmico - adiciona apenas filtros preenchidos.
    """
    
    # Filtro de UF
    if filtros.get('uf'):
        query = query.filter(Estabelecimento.uf == filtros['uf'].upper())
    
    # Filtro de município (código IBGE)
    if filtros.get('municipio'):
        query = query.filter(Estabelecimento.codigo_municipio == filtros['municipio'])
    
    # Filtro de situação cadastral
    if filtros.get('situacao'):
        query = query.filter(Estabelecimento.situacao_cadastral == filtros['situacao'])
    
    # Filtro de porte
    if filtros.get('porte'):
        query = query.join(Estabelecimento.empresa).filter(
            Empresa.porte_empresa == filtros['porte']
        )
    
    # Filtro de capital social (range)
    if filtros.get('capitalMinimo') is not None:
        query = query.join(Estabelecimento.empresa).filter(
            Empresa.capital_social >= filtros['capitalMinimo']
        )
    
    if filtros.get('capitalMaximo') is not None:
        query = query.join(Estabelecimento.empresa).filter(
            Empresa.capital_social <= filtros['capitalMaximo']
        )
    
    # Filtro de data de abertura (range)
    if filtros.get('dataAberturaInicio'):
        query = query.filter(
            Estabelecimento.data_inicio_atividade >= filtros['dataAberturaInicio']
        )
    
    if filtros.get('dataAberturaFim'):
        query = query.filter(
            Estabelecimento.data_inicio_atividade <= filtros['dataAberturaFim']
        )
    
    return query


# ================================================================
# HISTÓRICO DE PESQUISAS
# ================================================================

def create_pesquisa_record(
    db: Session,
    user_id: int,
    tipo_busca: str,
    valor_busca: str,
    filtros_aplicados: Dict[str, Any],
    resultados_encontrados: int,
    creditos_usados: int,
    tempo_resposta_ms: int
) -> PesquisaCNPJ:
    """
    Salva registro de pesquisa no histórico.
    
    Args:
        db: Sessão do banco
        user_id: ID do usuário (fixo 1 por enquanto)
        tipo_busca: Tipo de busca realizada
        valor_busca: Valor pesquisado
        filtros_aplicados: Filtros aplicados (JSON)
        resultados_encontrados: Quantidade de resultados
        creditos_usados: Créditos debitados
        tempo_resposta_ms: Tempo de resposta em milissegundos
    
    Returns:
        Registro de pesquisa criado
    """
    pesquisa = PesquisaCNPJ(
        user_id=user_id,
        tipo_busca=tipo_busca,
        valor_busca=valor_busca,
        filtros_aplicados=filtros_aplicados,
        resultados_encontrados=resultados_encontrados,
        creditos_usados=creditos_usados,
        tempo_resposta_ms=tempo_resposta_ms
    )
    
    db.add(pesquisa)
    db.commit()
    db.refresh(pesquisa)
    
    logger.info(f"Pesquisa registrada: ID={pesquisa.id}, user_id={user_id}, tipo={tipo_busca}")
    
    return pesquisa


def get_historico_pesquisas(
    db: Session,
    user_id: int,
    page: int = 1,
    limit: int = 20
) -> Tuple[List[PesquisaCNPJ], int]:
    """
    Retorna histórico de pesquisas do usuário.
    
    Args:
        db: Sessão do banco
        user_id: ID do usuário
        page: Número da página (1-indexed)
        limit: Registros por página
    
    Returns:
        Tuple (lista de pesquisas, total de registros)
    """
    # Query base
    query = db.query(PesquisaCNPJ).filter(
        PesquisaCNPJ.user_id == user_id
    )
    
    # Ordenar por mais recente
    query = query.order_by(PesquisaCNPJ.created_at.desc())
    
    # Count total
    total = query.count()
    
    # Paginação
    offset = (page - 1) * limit
    resultados = query.limit(limit).offset(offset).all()
    
    logger.info(f"Histórico recuperado: user_id={user_id}, {len(resultados)} de {total}")
    
    return resultados, total


# ================================================================
# ESTATÍSTICAS
# ================================================================

def get_search_stats(db: Session, user_id: int) -> Dict[str, Any]:
    """
    Retorna estatísticas de uso do usuário.
    
    Args:
        db: Sessão do banco
        user_id: ID do usuário
    
    Returns:
        Dicionário com estatísticas
    """
    # Total de pesquisas
    total_searches = db.query(func.count(PesquisaCNPJ.id)).filter(
        PesquisaCNPJ.user_id == user_id
    ).scalar() or 0
    
    # Total de créditos usados
    total_credits = db.query(func.sum(PesquisaCNPJ.creditos_usados)).filter(
        PesquisaCNPJ.user_id == user_id
    ).scalar() or 0
    
    # Total de resultados encontrados
    total_results = db.query(func.sum(PesquisaCNPJ.resultados_encontrados)).filter(
        PesquisaCNPJ.user_id == user_id
    ).scalar() or 0
    
    # Tempo médio de resposta
    avg_time = db.query(func.avg(PesquisaCNPJ.tempo_resposta_ms)).filter(
        PesquisaCNPJ.user_id == user_id
    ).scalar() or 0
    
    # Tipo de busca mais usado
    most_used_type = db.query(
        PesquisaCNPJ.tipo_busca,
        func.count(PesquisaCNPJ.id).label('count')
    ).filter(
        PesquisaCNPJ.user_id == user_id
    ).group_by(
        PesquisaCNPJ.tipo_busca
    ).order_by(
        text('count DESC')
    ).first()
    
    # Contagem por tipo de busca
    searches_by_type = {}
    tipo_counts = db.query(
        PesquisaCNPJ.tipo_busca,
        func.count(PesquisaCNPJ.id).label('count')
    ).filter(
        PesquisaCNPJ.user_id == user_id
    ).group_by(
        PesquisaCNPJ.tipo_busca
    ).all()
    
    for tipo, count in tipo_counts:
        searches_by_type[tipo] = count
    
    return {
        "totalSearches": total_searches,
        "totalCreditsUsed": int(total_credits),
        "totalResultsFound": int(total_results),
        "averageResponseTime": int(avg_time),
        "mostUsedSearchType": most_used_type[0] if most_used_type else None,
        "searchesByType": searches_by_type
    }
