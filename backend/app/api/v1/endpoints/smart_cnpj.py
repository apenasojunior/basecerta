"""
API Endpoints - Smart CNPJ
Issue: 2.1.5 - API Endpoints Smart CNPJ Backend

REST API endpoints para o produto Smart CNPJ 360°.
"""
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
import logging
import io
import csv
import json

try:
    import redis
except ImportError:
    redis = None  # type: ignore

from app.core.database import get_db
from app.core.config import settings
from app.services.smart_cnpj_service import SmartCNPJService
from app.schemas.smart_cnpj_request import SmartCNPJSearchRequest
from app.schemas.smart_cnpj_response import (
    SmartCNPJCompanyResponse,
    SmartCNPJSearchResponse
)
from app.models.pesquisa import PesquisaCNPJ

logger = logging.getLogger(__name__)

router = APIRouter()


# ================================================================
# DEPENDENCY: GET SERVICE
# ================================================================

def get_redis_client() -> Any:
    """
    Dependency para obter cliente Redis.
    
    Fallback: Retorna None se Redis não disponível.
    """
    if redis is None:
        logger.warning("Redis module not available")
        return None
    
    try:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=False)
        redis_client.ping()  # Test connection
        return redis_client
    except Exception as e:
        logger.warning(f"Redis unavailable: {e}")
        return None


def get_smart_cnpj_service(
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis_client)
) -> SmartCNPJService:
    """
    Dependency para obter instância do SmartCNPJService.
    
    Injeção de dependências: Database Session + Redis Client
    """
    return SmartCNPJService(db, redis_client)


# ================================================================
# ENDPOINT 1: GET /api/v1/smart-cnpj/{cnpj}
# ================================================================

@router.get(
    "/{cnpj}",
    response_model=SmartCNPJCompanyResponse,
    summary="Consulta por CNPJ",
    description="Busca empresa por CNPJ específico (14 dígitos). Suporta formatação ou não.",
    responses={
        200: {
            "description": "Empresa encontrada",
            "content": {
                "application/json": {
                    "example": {
                        "cnpj": "11.779.918/0001-05",
                        "razaoSocial": "N. F. C. VIANNA",
                        "nomeFantasia": "EXEMPLO LTDA",
                        "situacaoCadastral": "02",
                        "tipo": "MATRIZ"
                    }
                }
            }
        },
        400: {"description": "CNPJ inválido (formato incorreto)"},
        404: {"description": "Empresa não encontrada"}
    }
)
async def get_empresa_by_cnpj(
    cnpj: str = Path(
        ...,
        description="CNPJ da empresa (14 dígitos, com ou sem formatação)",
        example="11779918000105"
    ),
    service: SmartCNPJService = Depends(get_smart_cnpj_service)
):
    """
    Consulta empresa por CNPJ específico.
    
    **Features:**
    - Cache Redis (24h TTL)
    - Formatação automática do CNPJ
    - Eager loading de relacionamentos (empresa, sócios, CNAE)
    - Mock de créditos (5 créditos por consulta)
    
    **Exemplos de CNPJ válidos:**
    - `11779918000105`
    - `11.779.918/0001-05`
    
    **Retorna:**
    - Dados completos da empresa (razão social, endereço, contatos, sócios, CNAE)
    """
    logger.info(f"GET /smart-cnpj/{cnpj} - Request recebida")
    
    try:
        empresa = service.buscar_cnpj(cnpj)
        
        if not empresa:
            logger.warning(f"Empresa não encontrada: CNPJ={cnpj}")
            raise HTTPException(
                status_code=404,
                detail=f"Empresa com CNPJ {cnpj} não encontrada"
            )
        
        logger.info(f"Empresa retornada: CNPJ={cnpj}, Razão={empresa.razaoSocial}")
        return empresa
    
    except ValueError as e:
        logger.error(f"CNPJ inválido: {cnpj} - {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
    except Exception as e:
        logger.error(f"Erro ao buscar CNPJ {cnpj}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar requisição"
        )


# ================================================================
# ENDPOINT 2: POST /api/v1/smart-cnpj/search
# ================================================================

@router.post(
    "/search",
    response_model=SmartCNPJSearchResponse,
    summary="Busca avançada",
    description="Busca empresas com 7 tipos de busca + 8 filtros opcionais + paginação",
    responses={
        200: {
            "description": "Busca executada com sucesso",
            "content": {
                "application/json": {
                    "example": {
                        "empresas": [],
                        "pagination": {
                            "page": 1,
                            "pageSize": 20,
                            "total": 150,
                            "totalPages": 8
                        },
                        "creditosUsados": 5,
                        "tempoRespostaMs": 250
                    }
                }
            }
        },
        400: {"description": "Parâmetros inválidos"}
    }
)
async def search_empresas(
    request: SmartCNPJSearchRequest,
    service: SmartCNPJService = Depends(get_smart_cnpj_service)
):
    """
    Busca avançada de empresas com filtros dinâmicos.
    
    **7 Tipos de Busca:**
    1. `CNPJ` - Busca exata por CNPJ
    2. `RAZAO_SOCIAL` - Busca parcial na razão social (ILIKE)
    3. `SEGMENTO` - Busca por código CNAE
    4. `EMAIL` - Busca parcial em email
    5. `TELEFONE` - Busca em telefone1 ou telefone2
    6. `NOME_SOCIO` - Busca por nome de sócio (JOIN)
    7. `CEP` - Busca parcial por CEP
    
    **8 Filtros Opcionais:**
    - `uf` - Sigla do estado (ex: "SP")
    - `municipio` - Código IBGE do município
    - `situacao` - Código situação cadastral (ex: "02" = Ativa)
    - `porte` - Código do porte
    - `capitalMinimo` - Capital social mínimo
    - `capitalMaximo` - Capital social máximo
    - `dataAberturaInicio` - Data abertura inicial
    - `dataAberturaFim` - Data abertura final
    
    **Paginação:**
    - `page` - Número da página (default: 1)
    - `pageSize` - Registros por página (default: 20, max: 100)
    
    **Retorna:**
    - Lista de empresas (resumida)
    - Metadata de paginação
    - Créditos usados (5)
    - Tempo de resposta em ms
    """
    logger.info(
        f"POST /smart-cnpj/search - tipo={request.tipo_busca.value}, "
        f"valor={request.valor_busca}, page={request.page}"
    )
    
    try:
        response = service.buscar_empresas(request)
        
        logger.info(
            f"Busca executada: {len(response.empresas)} resultados de {response.pagination.total}, "
            f"tempo={response.tempoRespostaMs}ms"
        )
        
        return response
    
    except ValueError as e:
        logger.error(f"Erro de validação: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
    except Exception as e:
        logger.error(f"Erro ao executar busca: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar requisição"
        )


# ================================================================
# ENDPOINT 3: GET /api/v1/smart-cnpj/historico
# ================================================================

@router.get(
    "/historico",
    response_model=List[dict],
    summary="Histórico de pesquisas",
    description="Retorna histórico de pesquisas do usuário com paginação",
    responses={
        200: {
            "description": "Histórico retornado com sucesso",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "tipo_busca": "RAZAO_SOCIAL",
                            "valor_busca": "TECNOLOGIA",
                            "filtros_aplicados": {"uf": "SP"},
                            "resultados_encontrados": 150,
                            "creditos_usados": 5,
                            "tempo_resposta_ms": 250,
                            "created_at": "2025-01-26T10:30:00"
                        }
                    ]
                }
            }
        }
    }
)
async def get_historico_pesquisas(
    page: int = Query(1, ge=1, description="Número da página"),
    page_size: int = Query(20, ge=1, le=100, description="Registros por página"),
    service: SmartCNPJService = Depends(get_smart_cnpj_service)
):
    """
    Retorna histórico de pesquisas do usuário.
    
    **Features:**
    - Paginação configurável
    - Ordenação por data (mais recente primeiro)
    - Mock de user_id=1 (TODO: remover na Delivery 3)
    
    **Query Params:**
    - `page` - Número da página (default: 1)
    - `page_size` - Registros por página (default: 20, max: 100)
    
    **Retorna:**
    - Lista de pesquisas históricas
    - Inclui: tipo, valor, filtros, resultados, créditos, tempo
    """
    logger.info(f"GET /smart-cnpj/historico - page={page}, page_size={page_size}")
    
    try:
        historico, total = service.get_historico(page, page_size)
        
        # Converter SQLAlchemy models para dict
        resultado = []
        for pesquisa in historico:
            resultado.append({
                "id": pesquisa.id,
                "tipo_busca": pesquisa.tipo_busca,
                "valor_busca": pesquisa.valor_busca,
                "filtros_aplicados": pesquisa.filtros_aplicados,
                "resultados_encontrados": pesquisa.resultados_encontrados,
                "creditos_usados": pesquisa.creditos_usados,
                "tempo_resposta_ms": pesquisa.tempo_resposta_ms,
                "created_at": pesquisa.created_at.isoformat() if pesquisa.created_at else None
            })
        
        logger.info(f"Histórico retornado: {len(resultado)} de {total}")
        
        return resultado
    
    except Exception as e:
        logger.error(f"Erro ao buscar histórico: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar requisição"
        )


# ================================================================
# ENDPOINT 4: GET /api/v1/smart-cnpj/estatisticas
# ================================================================

@router.get(
    "/estatisticas",
    response_model=dict,
    summary="Estatísticas de uso",
    description="Retorna métricas de uso do usuário (total pesquisas, créditos, etc.)",
    responses={
        200: {
            "description": "Estatísticas retornadas com sucesso",
            "content": {
                "application/json": {
                    "example": {
                        "totalSearches": 150,
                        "totalCreditsUsed": 750,
                        "totalResultsFound": 15000,
                        "averageResponseTime": 250,
                        "mostUsedSearchType": "RAZAO_SOCIAL",
                        "searchesByType": {
                            "CNPJ": 50,
                            "RAZAO_SOCIAL": 60,
                            "SEGMENTO": 20
                        }
                    }
                }
            }
        }
    }
)
async def get_estatisticas_uso(
    service: SmartCNPJService = Depends(get_smart_cnpj_service)
):
    """
    Retorna estatísticas de uso do usuário.
    
    **Métricas:**
    - Total de pesquisas realizadas
    - Total de créditos usados
    - Total de resultados encontrados
    - Tempo médio de resposta (ms)
    - Tipo de busca mais usado
    - Contagem por tipo de busca
    
    **Mock:** user_id=1 (TODO: remover na Delivery 3)
    """
    logger.info("GET /smart-cnpj/estatisticas - Request recebida")
    
    try:
        stats = service.get_estatisticas()
        
        logger.info(f"Estatísticas retornadas: {stats.get('totalSearches', 0)} pesquisas")
        
        return stats
    
    except Exception as e:
        logger.error(f"Erro ao buscar estatísticas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar requisição"
        )


# ================================================================
# ENDPOINT 5: POST /api/v1/smart-cnpj/export
# ================================================================

@router.post(
    "/export",
    summary="Exportar resultados",
    description="Exporta lista de CNPJs em CSV ou JSON (max 100 CNPJs)",
    responses={
        200: {
            "description": "Arquivo exportado com sucesso",
            "content": {
                "text/csv": {},
                "application/json": {}
            }
        },
        400: {"description": "Limite excedido ou formato inválido"}
    }
)
async def export_cnpjs(
    cnpjs: List[str] = Query(..., description="Lista de CNPJs (max 100)", max_length=100),
    formato: str = Query("csv", description="Formato: csv ou json", regex="^(csv|json)$"),
    service: SmartCNPJService = Depends(get_smart_cnpj_service)
):
    """
    Exporta dados de múltiplos CNPJs.
    
    **Limites:**
    - Máximo 100 CNPJs por exportação
    
    **Formatos:**
    - `csv` - Arquivo CSV (UTF-8 with BOM, separador ponto-vírgula)
    - `json` - Arquivo JSON (formatado com indent)
    
    **Query Params:**
    - `cnpjs` - Lista de CNPJs (pode repetir: ?cnpjs=123&cnpjs=456)
    - `formato` - Formato de exportação (csv ou json)
    
    **Retorna:**
    - CSV: StreamingResponse com Content-Disposition
    - JSON: JSONResponse com lista de empresas
    """
    logger.info(f"POST /smart-cnpj/export - {len(cnpjs)} CNPJs, formato={formato}")
    
    # Validar limite
    if len(cnpjs) > 100:
        raise HTTPException(
            status_code=400,
            detail="Limite de 100 CNPJs por exportação excedido"
        )
    
    try:
        # Buscar todos os CNPJs
        empresas = []
        for cnpj in cnpjs:
            try:
                empresa = service.buscar_cnpj(cnpj, include_socios=False)
                if empresa:
                    empresas.append(empresa)
            except Exception as e:
                logger.warning(f"Erro ao buscar CNPJ {cnpj}: {str(e)}")
                continue
        
        if not empresas:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma empresa encontrada"
            )
        
        # Exportar conforme formato
        if formato == "csv":
            return _export_to_csv(empresas)
        else:
            return _export_to_json(empresas)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao exportar: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar requisição"
        )


# ================================================================
# HELPERS DE EXPORTAÇÃO
# ================================================================

def _export_to_csv(empresas: List[SmartCNPJCompanyResponse]) -> StreamingResponse:
    """
    Exporta empresas para CSV.
    
    Encoding: UTF-8 with BOM
    Separador: ponto-vírgula
    """
    output = io.StringIO()
    
    # BOM para UTF-8
    output.write('\ufeff')
    
    # Writer com ponto-vírgula
    writer = csv.writer(output, delimiter=';', quoting=csv.QUOTE_MINIMAL)
    
    # Headers
    writer.writerow([
        'CNPJ',
        'Razão Social',
        'Nome Fantasia',
        'Situação',
        'Tipo',
        'Porte',
        'Capital Social',
        'Data Abertura',
        'CNAE Principal',
        'Email',
        'Telefone',
        'CEP',
        'Logradouro',
        'Município',
        'UF'
    ])
    
    # Dados
    for empresa in empresas:
        writer.writerow([
            empresa.cnpj,
            empresa.razaoSocial,
            empresa.nomeFantasia or '',
            empresa.situacaoCadastral,
            empresa.tipo,
            empresa.porte,
            empresa.capitalSocial,
            empresa.dataAbertura or '',
            empresa.cnaePrincipal.get('codigo', '') if empresa.cnaePrincipal else '',
            empresa.contatos.get('email', '') if empresa.contatos else '',
            empresa.contatos.get('telefone1', '') if empresa.contatos else '',
            empresa.endereco.get('cep', '') if empresa.endereco else '',
            empresa.endereco.get('logradouro', '') if empresa.endereco else '',
            empresa.endereco.get('municipio', '') if empresa.endereco else '',
            empresa.endereco.get('uf', '') if empresa.endereco else ''
        ])
    
    # Preparar response
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": "attachment; filename=empresas.csv"
        }
    )


def _export_to_json(empresas: List[SmartCNPJCompanyResponse]) -> JSONResponse:
    """
    Exporta empresas para JSON.
    
    Pretty print com indent=2.
    """
    # Converter para dict
    data = [empresa.model_dump() for empresa in empresas]
    
    return JSONResponse(
        content={
            "total": len(empresas),
            "empresas": data
        },
        headers={
            "Content-Disposition": "attachment; filename=empresas.json"
        }
    )
