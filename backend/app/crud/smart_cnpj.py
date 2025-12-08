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
# BUSCA AVANÇADA
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
    
    # Base query com joins e eager loading
    query = db.query(Estabelecimento).options(
        joinedload(Estabelecimento.empresa)
            .joinedload(Empresa.socios),  # ✅ Eager load sócios (evita N+1)
        joinedload(Estabelecimento.municipio_obj),
        joinedload(Estabelecimento.cnae_principal)
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
    
    # Eager loading de relacionamentos para evitar N+1 queries
    # IMPORTANTE: NÃO carregar sócios aqui (muito pesado para listagens)
    # Sócios devem ser carregados apenas no endpoint de detalhes (/cnpj/{cnpj})
    query = query.options(
        joinedload(Estabelecimento.empresa),  # Apenas dados básicos da empresa
        joinedload(Estabelecimento.municipio_obj),
        joinedload(Estabelecimento.cnae_principal)
    )
    
    # Aplicar busca conforme tipo
    query = _apply_search_type(query, tipo_busca, valor_busca, db)
    
    # Aplicar filtros opcionais
    if filtros:
        query = _apply_filters(query, filtros)
    
    # OTIMIZAÇÃO: Usar LIMIT+1 pattern para TODAS as buscas
    # Evita COUNT(*) que é sempre lento em queries com ILIKE ou JOINs complexos
    logger.info(f"Usando LIMIT+1 pattern para tipo_busca={tipo_busca.value} (sem COUNT)")
    
    # Buscar limite + 1 para saber se tem mais páginas
    offset = (page - 1) * limit
    
    # OTIMIZAÇÃO CAPITAL_SOCIAL: Se ordenar por capital, buscar mais resultados
    # antes e ordenar em memória (mais rápido que scan backward no PostgreSQL)
    apply_capital_order = filtros.get('_apply_capital_order_after') if filtros else False
    if apply_capital_order:
        # Buscar 10x mais resultados sem ordenação
        # Depois ordenar em Python e pegar TOP N
        fetch_limit = min(limit * 10, 1000)  # Máximo 1000
        logger.info(f"OTIMIZAÇÃO: Buscando {fetch_limit} resultados para ordenar por capital em memória")
        
        resultados_sem_ordem = query.limit(fetch_limit).offset(offset).all()
        
        # Ordenar em memória por capital_social
        order_direction = filtros.get('orderDirection', 'desc')
        resultados_ordenados = sorted(
            resultados_sem_ordem,
            key=lambda x: x.empresa.capital_social or 0,
            reverse=(order_direction.lower() == 'desc')
        )
        
        # Pegar apenas LIMIT solicitado
        resultados = resultados_ordenados[:limit]
        has_more = len(resultados_sem_ordem) >= fetch_limit
        
        if has_more:
            total = (page * limit) + 1
        else:
            total = offset + len(resultados)
        
        elapsed_ms = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"Busca OTIMIZADA (capital em memória): {elapsed_ms:.0f}ms - {len(resultados)} de {len(resultados_sem_ordem)} ordenados")
        
        return resultados, total
    
    # Fluxo normal (sem ordenação por capital)
    query_with_pagination = query.limit(limit + 1).offset(offset)
    resultados = query_with_pagination.all()
    
    # Se retornou limit + 1, significa que tem mais páginas
    has_more = len(resultados) > limit
    if has_more:
        resultados = resultados[:limit]  # Remove o extra
    
    # Calcular total estimado
    # Se tem mais páginas: (page * limit) + 1 (para mostrar "~" no frontend)
    # Se não tem: offset + len(resultados) (exato na última página)
    if has_more:
        total = (page * limit) + 1  # Indica que há mais páginas
    else:
        total = offset + len(resultados)  # Exato na última página
    
    logger.info(f"Busca otimizada: {len(resultados)} resultados, página {page}, has_more={has_more}, total_estimado={total}")
    
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
    
    elif tipo_busca == TipoBusca.CNAE or tipo_busca == TipoBusca.SEGMENTO:
        # Busca por CNAE (código ou descrição)
        # Aceita tanto 'cnae' quanto 'segmento' (alias)
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
    Aceita tanto snake_case quanto camelCase para compatibilidade.
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
    
    # Filtro de natureza jurídica
    if filtros.get('natureza_juridica'):
        query = query.join(Estabelecimento.empresa).filter(
            Empresa.natureza_juridica == filtros['natureza_juridica']
        )
    
    # Filtro de capital social (range) - aceita snake_case e camelCase
    capital_min = filtros.get('capital_social_min') or filtros.get('capitalMinimo')
    if capital_min is not None:
        query = query.join(Estabelecimento.empresa).filter(
            Empresa.capital_social >= capital_min
        )
    
    capital_max = filtros.get('capital_social_max') or filtros.get('capitalMaximo')
    if capital_max is not None:
        query = query.join(Estabelecimento.empresa).filter(
            Empresa.capital_social <= capital_max
        )
    
    # Filtro de data de abertura (range) - aceita snake_case e camelCase
    data_inicio = filtros.get('data_abertura_inicio') or filtros.get('dataAberturaInicio')
    if data_inicio:
        query = query.filter(
            Estabelecimento.data_inicio_atividade >= data_inicio
        )
    
    data_fim = filtros.get('data_abertura_fim') or filtros.get('dataAberturaFim')
    if data_fim:
        query = query.filter(
            Estabelecimento.data_inicio_atividade <= data_fim
        )
    
    # Ordenação - suporta orderBy e orderDirection
    order_by = filtros.get('orderBy') or filtros.get('order_by')
    order_direction = filtros.get('orderDirection') or filtros.get('order_direction') or 'desc'
    
    if order_by:
        # OTIMIZAÇÃO CRÍTICA para capital_social:
        # Quando ordenar por capital_social, não aplicar ORDER BY ainda.
        # Vamos aplicar depois com subquery para evitar scan backward
        if order_by != 'capital_social':
            # Mapear outros campos
            order_field_map = {
                'razao_social': Empresa.razao_social,
                'data_abertura': Estabelecimento.data_inicio_atividade,
                'uf': Estabelecimento.uf,
            }
            
            field = order_field_map.get(order_by)
            if field is not None:
                if order_direction.lower() == 'asc':
                    query = query.order_by(field.asc())
                else:
                    query = query.order_by(field.desc())
        # Se for capital_social, marcar no filtros para aplicar depois
        else:
            filtros['_apply_capital_order_after'] = True
    
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
    total_resultados: int,  # Corrigido: total_resultados
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
        total_resultados: Quantidade de resultados (corrigido)
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
        total_resultados=total_resultados,  # Corrigido: total_resultados
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
