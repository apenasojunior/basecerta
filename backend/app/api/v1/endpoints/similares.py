"""
API Endpoints - Empresas Similares
Endpoint: /api/v1/smart-cnpj/similares/{cnpj}

Busca empresas similares com base no CNAE principal.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
import logging
import redis
import json

from app.core.database import get_db
from app.core.config import settings
from app.schemas.similares import CNPJAnalysisResponse
from app.crud.similares import analisar_empresas_similares

logger = logging.getLogger(__name__)

router = APIRouter()


# ================================================================
# REDIS DEPENDENCY
# ================================================================

def get_redis_client():
    """Dependency para obter cliente Redis."""
    try:
        redis_client = redis.from_url(settings.redis_url, decode_responses=False)
        redis_client.ping()
        return redis_client
    except Exception as e:
        logger.warning(f"Redis não disponível: {e}")
        return None


# ================================================================
# ENDPOINT: GET /api/v1/smart-cnpj/similares/{cnpj}
# ================================================================

@router.get(
    "/similares/{cnpj}",
    response_model=CNPJAnalysisResponse,
    summary="🔍 Encontrar Empresas Similares",
    description="""
    ### Analisa e rankeia empresas similares com base no CNAE
    
    **Fluxo de análise:**
    1. Busca empresa de referência por CNPJ
    2. Identifica CNAE principal da empresa
    3. Busca todas empresas ATIVAS com mesmo CNAE
    4. Agrupa por estado (UF)
    5. Calcula métricas por estado:
       - Total de empresas
       - Soma do capital social
       - Empresa com maior capital (top empresa)
    6. Ordena estados por total de empresas (DESC)
    
    **Filtros aplicados:**
    - Apenas empresas com situação cadastral ATIVA (02)
    - Mesmo CNAE principal da empresa de referência
    - Agrupamento por UF
    
    **Dados retornados:**
    - Empresa de referência (CNPJ, razão social, CNAE, capital, UF)
    - Rankings por estado:
      - UF e nome do estado
      - Total de empresas similares
      - Capital social total acumulado
      - Top empresa (maior capital social)
    - Totalizadores gerais
    
    **Performance:**
    - Query otimizada com GROUP BY
    - Índices em: cnae_fiscal_principal, situacao_cadastral, uf
    - Tempo médio: < 500ms para CNAEs comuns
    
    **Uso típico:**
    - Análise de concorrência
    - Pesquisa de mercado
    - Identificação de oportunidades por região
    
    **Exemplo de uso:**
    ```bash
    curl http://localhost:8000/api/v1/smart-cnpj/similares/11779918000105
    ```
    """,
    response_description="Análise completa de empresas similares por estado",
    responses={
        200: {
            "description": "✅ Análise concluída com sucesso",
            "content": {
                "application/json": {
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
                            },
                            {
                                "uf": "RJ",
                                "uf_nome": "Rio de Janeiro",
                                "total_empresas": 8320,
                                "capital_total": 6200000000.00,
                                "top_empresa": {
                                    "razao_social": "INOVAÇÃO RJ LTDA",
                                    "cnpj": "98.765.432/0001-10",
                                    "capital_social": 3000000.00
                                }
                            }
                        ],
                        "total_estados": 5,
                        "total_empresas_similares": 38250
                    }
                }
            }
        },
        400: {
            "description": "⚠️ CNPJ inválido (formato incorreto)",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "CNPJ deve conter exatamente 14 dígitos"
                    }
                }
            }
        },
        404: {
            "description": "❌ Empresa não encontrada ou sem CNAE",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Empresa com CNPJ 11.779.918/0001-05 não encontrada"
                    }
                }
            }
        },
        500: {
            "description": "❌ Erro interno ao processar análise"
        }
    }
)
async def get_empresas_similares(
    cnpj: str = Path(
        ...,
        description="CNPJ da empresa de referência (14 dígitos, aceita formatação)",
        example="11779918000105",
        min_length=14,
        max_length=18
    ),
    db: Session = Depends(get_db),
    redis_client = Depends(get_redis_client)
):
    """
    Busca empresas similares por CNAE com cache Redis.
    
    **Validações:**
    - CNPJ deve ter 14 dígitos (aceita formatação)
    - Empresa deve existir no banco
    - Empresa deve ter CNAE principal cadastrado
    
    **Cache:**
    - TTL: 6 horas (dados de mercado mudam lentamente)
    - Chave: similares:{cnpj}
    
    **Retorna:**
    - Análise completa com rankings por estado
    - Empresa de referência com dados básicos
    - Top empresas por estado
    - Totalizadores gerais
    
    **Créditos:** Operação gratuita (não consome créditos)
    """
    logger.info(f"GET /smart-cnpj/similares/{cnpj} - Request recebida")
    
    try:
        # Validar formato do CNPJ
        cnpj_limpo = ''.join(filter(str.isdigit, cnpj))
        
        if len(cnpj_limpo) != 14:
            logger.warning(f"CNPJ com formato inválido: {cnpj}")
            raise HTTPException(
                status_code=400,
                detail=f"CNPJ deve conter exatamente 14 dígitos. Recebido: {len(cnpj_limpo)} dígitos"
            )
        
        # Verificar cache Redis
        cache_key = f"similares:{cnpj_limpo}"
        if redis_client:
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    logger.info(f"🎯 Cache HIT: similares - {cnpj_limpo}")
                    return json.loads(cached)
                else:
                    logger.info(f"💨 Cache MISS: similares - {cnpj_limpo}")
            except Exception as e:
                logger.warning(f"Erro ao buscar cache: {e}")
        
        # Executar análise (cache miss ou Redis indisponível)
        result = analisar_empresas_similares(db, cnpj_limpo)
        
        if not result:
            logger.warning(f"Empresa não encontrada ou sem CNAE: CNPJ={cnpj}")
            raise HTTPException(
                status_code=404,
                detail=f"Empresa com CNPJ {cnpj} não encontrada ou sem CNAE principal cadastrado"
            )
        
        # Salvar no cache (TTL: 6 horas = 21600s)
        if redis_client:
            try:
                serialized = json.dumps(result, default=str)
                redis_client.setex(cache_key, 21600, serialized)
                logger.info(f"✅ Cache SET: similares - {cnpj_limpo} (TTL=6h)")
            except Exception as e:
                logger.warning(f"Erro ao salvar cache: {e}")
        
        logger.info(
            f"Análise concluída: {result['total_empresas_similares']} empresas similares "
            f"em {result['total_estados']} estados"
        )
        
        return result
    
    except HTTPException:
        raise
    
    except Exception as e:
        import traceback
        logger.error(f"Erro ao analisar empresas similares: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao processar análise de empresas similares"
        )
