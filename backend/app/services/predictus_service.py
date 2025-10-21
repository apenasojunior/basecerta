"""
Serviço de integração com Predictus API - Dossiê Pessoa Jurídica
"""
import json
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional, Dict, Any, List

import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.redis_client import get_redis_client
from app.models.pessoa_juridica import (
    PessoaJuridica,
    CNAEEmpresa,
    EnderecoEmpresa,
    SocioEmpresa,
    RedesSociaisEmpresa,
    HistoricoDividasEmpresa,
)

logger = logging.getLogger(__name__)


class PredictusAPIError(Exception):
    """Exceção customizada para erros da API Predictus"""
    pass


class PredictusAPIClient:
    """Cliente HTTP para integração com Predictus API"""

    def __init__(
        self,
        api_url: Optional[str] = None,
        api_key: Optional[str] = None,
        timeout: int = 30,
        max_retries: int = 3,
    ):
        self.api_url = api_url or settings.PREDICTUS_API_URL
        self.api_key = api_key or settings.PREDICTUS_API_KEY
        self.timeout = timeout
        self.max_retries = max_retries
        self.redis_client = get_redis_client()
        self.cache_ttl = 7 * 24 * 60 * 60  # 7 dias em segundos

        if not self.api_url:
            raise ValueError("PREDICTUS_API_URL não configurada")
        if not self.api_key:
            raise ValueError("PREDICTUS_API_KEY não configurada")

    def _get_cache_key(self, cnpj: str) -> str:
        """Gera chave de cache Redis para CNPJ"""
        # Remove caracteres especiais do CNPJ
        cnpj_limpo = "".join(filter(str.isdigit, cnpj))
        return f"predictus:pj:{cnpj_limpo}"

    def _get_from_cache(self, cnpj: str) -> Optional[Dict[str, Any]]:
        """Busca dados no cache Redis"""
        try:
            cache_key = self._get_cache_key(cnpj)
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                logger.info(f"Cache hit para CNPJ {cnpj}")
                return json.loads(cached_data)
            return None
        except Exception as e:
            logger.error(f"Erro ao buscar cache para CNPJ {cnpj}: {e}")
            return None

    def _save_to_cache(self, cnpj: str, data: Dict[str, Any]) -> None:
        """Salva dados no cache Redis com TTL de 7 dias"""
        try:
            cache_key = self._get_cache_key(cnpj)
            self.redis_client.setex(
                cache_key, self.cache_ttl, json.dumps(data, default=str)
            )
            logger.info(f"Dados salvos no cache para CNPJ {cnpj}")
        except Exception as e:
            logger.error(f"Erro ao salvar cache para CNPJ {cnpj}: {e}")

    async def get_dossie_pj(self, cnpj: str) -> Dict[str, Any]:
        """
        Busca dossiê completo de Pessoa Jurídica na API Predictus

        Args:
            cnpj: CNPJ da empresa (pode conter formatação)

        Returns:
            Dicionário com dados completos do dossiê

        Raises:
            PredictusAPIError: Em caso de erro na API
        """
        # Remove formatação do CNPJ
        cnpj_limpo = "".join(filter(str.isdigit, cnpj))

        # Valida tamanho do CNPJ
        if len(cnpj_limpo) != 14:
            raise PredictusAPIError(f"CNPJ inválido: {cnpj}")

        # Verifica cache
        cached_data = self._get_from_cache(cnpj_limpo)
        if cached_data:
            return cached_data

        # Chama API com retry
        url = f"{self.api_url}/pj/{cnpj_limpo}"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    logger.info(
                        f"Chamando Predictus API para CNPJ {cnpj_limpo} (tentativa {attempt})"
                    )
                    response = await client.get(url, headers=headers)

                    if response.status_code == 200:
                        data = response.json()
                        # Salva no cache
                        self._save_to_cache(cnpj_limpo, data)
                        return data

                    elif response.status_code == 401:
                        raise PredictusAPIError("API Key inválida ou expirada")

                    elif response.status_code == 404:
                        raise PredictusAPIError(f"CNPJ {cnpj_limpo} não encontrado")

                    elif response.status_code == 429:
                        # Rate limit - aguarda antes de retry
                        wait_time = 2**attempt  # Backoff exponencial
                        logger.warning(
                            f"Rate limit atingido. Aguardando {wait_time}s..."
                        )
                        await asyncio.sleep(wait_time)
                        continue

                    else:
                        error_msg = f"Erro HTTP {response.status_code}: {response.text}"
                        last_error = PredictusAPIError(error_msg)
                        logger.error(error_msg)

            except httpx.TimeoutException as e:
                last_error = PredictusAPIError(f"Timeout ao chamar API: {e}")
                logger.error(f"Timeout na tentativa {attempt}: {e}")

            except httpx.RequestError as e:
                last_error = PredictusAPIError(f"Erro de rede: {e}")
                logger.error(f"Erro de rede na tentativa {attempt}: {e}")

            except Exception as e:
                last_error = PredictusAPIError(f"Erro inesperado: {e}")
                logger.error(f"Erro inesperado na tentativa {attempt}: {e}")

            # Aguarda antes de retry (exceto no último)
            if attempt < self.max_retries:
                wait_time = 2**attempt  # Backoff exponencial: 2s, 4s, 8s
                logger.info(f"Aguardando {wait_time}s antes do próximo retry...")
                await asyncio.sleep(wait_time)

        # Se chegou aqui, todas as tentativas falharam
        raise last_error


def parse_predictus_pj_response(
    data: Dict[str, Any], db: Session
) -> PessoaJuridica:
    """
    Parse JSON response da API Predictus e cria/atualiza models SQLAlchemy

    Args:
        data: Dicionário JSON retornado pela API
        db: Sessão do banco de dados

    Returns:
        Instância de PessoaJuridica (com relacionamentos)
    """
    try:
        # Remove formatação do CNPJ
        cnpj = "".join(filter(str.isdigit, data.get("cnpj", "")))

        # Verifica se empresa já existe
        empresa = db.query(PessoaJuridica).filter_by(cnpj=cnpj).first()

        if empresa:
            logger.info(f"Atualizando empresa existente: {cnpj}")
        else:
            logger.info(f"Criando nova empresa: {cnpj}")
            empresa = PessoaJuridica()

        # Dados cadastrais principais
        empresa.cnpj = cnpj
        empresa.razao_social = data.get("razao_social")
        empresa.nome_fantasia = data.get("nome_fantasia")
        empresa.situacao_cadastral = data.get("situacao_cadastral")
        empresa.porte = data.get("porte")
        empresa.natureza_juridica = data.get("natureza_juridica")
        empresa.mei = data.get("mei", False)
        empresa.simples_nacional = data.get("simples_nacional", False)

        # Data de abertura
        if data.get("data_abertura"):
            try:
                empresa.data_abertura = datetime.strptime(
                    data["data_abertura"], "%Y-%m-%d"
                ).date()
            except (ValueError, TypeError):
                pass

        # Capital social
        if data.get("capital_social"):
            try:
                empresa.capital_social = Decimal(str(data["capital_social"]))
            except (ValueError, TypeError, InvalidOperation):
                pass

        # Dados complementares (JSONB)
        empresa.dados_complementares = data.get("dados_complementares", {})

        # Atualiza timestamp
        empresa.updated_at = datetime.utcnow()

        # Adiciona à sessão se for novo
        if not empresa.id:
            db.add(empresa)
            db.flush()  # Garante que empresa.id seja gerado

        # === CNAEs ===
        _process_cnaes(empresa, data.get("cnaes", []), db)

        # === Endereços ===
        _process_enderecos(empresa, data.get("enderecos", []), db)

        # === Sócios ===
        _process_socios(empresa, data.get("socios", []), db)

        # === Redes Sociais ===
        _process_redes_sociais(empresa, data.get("redes_sociais", {}), db)

        # === Histórico de Dívidas ===
        _process_historico_dividas(empresa, data.get("historico_dividas", {}), db)

        db.commit()
        db.refresh(empresa)

        logger.info(f"Empresa {cnpj} salva com sucesso (ID: {empresa.id})")
        return empresa

    except Exception as e:
        db.rollback()
        logger.error(f"Erro ao processar dados Predictus: {e}")
        raise PredictusAPIError(f"Erro ao processar dados: {e}")


def _process_cnaes(
    empresa: PessoaJuridica, cnaes_data: List[Dict], db: Session
) -> None:
    """Processa e salva CNAEs da empresa"""
    # Remove CNAEs antigos
    db.query(CNAEEmpresa).filter_by(empresa_id=empresa.id).delete()

    for cnae_dict in cnaes_data:
        cnae = CNAEEmpresa(
            empresa_id=empresa.id,
            codigo=cnae_dict.get("codigo"),
            descricao=cnae_dict.get("descricao"),
            is_principal=cnae_dict.get("is_principal", False),
        )
        db.add(cnae)


def _process_enderecos(
    empresa: PessoaJuridica, enderecos_data: List[Dict], db: Session
) -> None:
    """Processa e salva endereços da empresa"""
    # Remove endereços antigos
    db.query(EnderecoEmpresa).filter_by(empresa_id=empresa.id).delete()

    for end_dict in enderecos_data:
        endereco = EnderecoEmpresa(
            empresa_id=empresa.id,
            logradouro=end_dict.get("logradouro"),
            numero=end_dict.get("numero"),
            complemento=end_dict.get("complemento"),
            bairro=end_dict.get("bairro"),
            cep=end_dict.get("cep"),
            municipio=end_dict.get("municipio"),
            uf=end_dict.get("uf"),
            telefones=end_dict.get("telefones", []),
            email=end_dict.get("email"),
            latitude=end_dict.get("latitude"),
            longitude=end_dict.get("longitude"),
        )
        db.add(endereco)


def _process_socios(
    empresa: PessoaJuridica, socios_data: List[Dict], db: Session
) -> None:
    """Processa e salva sócios da empresa"""
    # Remove sócios antigos
    db.query(SocioEmpresa).filter_by(empresa_id=empresa.id).delete()

    for socio_dict in socios_data:
        socio = SocioEmpresa(
            empresa_id=empresa.id,
            nome=socio_dict.get("nome"),
            cpf_cnpj=socio_dict.get("cpf_cnpj"),
            qualificacao=socio_dict.get("qualificacao"),
            percentual_participacao=socio_dict.get("percentual_participacao"),
            representante_legal=socio_dict.get("representante_legal"),
            is_ativo=socio_dict.get("is_ativo", True),
        )

        # Datas de entrada/saída
        if socio_dict.get("data_entrada"):
            try:
                socio.data_entrada = datetime.strptime(
                    socio_dict["data_entrada"], "%Y-%m-%d"
                ).date()
            except (ValueError, TypeError):
                pass

        if socio_dict.get("data_saida"):
            try:
                socio.data_saida = datetime.strptime(
                    socio_dict["data_saida"], "%Y-%m-%d"
                ).date()
            except (ValueError, TypeError):
                pass

        db.add(socio)


def _process_redes_sociais(
    empresa: PessoaJuridica, redes_dict: Dict[str, Any], db: Session
) -> None:
    """Processa e salva redes sociais da empresa"""
    # Remove registro antigo
    db.query(RedesSociaisEmpresa).filter_by(empresa_id=empresa.id).delete()

    if not redes_dict:
        return

    redes = RedesSociaisEmpresa(
        empresa_id=empresa.id,
        website=redes_dict.get("website"),
        facebook=redes_dict.get("facebook"),
        instagram=redes_dict.get("instagram"),
        linkedin=redes_dict.get("linkedin"),
        twitter=redes_dict.get("twitter"),
        youtube=redes_dict.get("youtube"),
        tiktok=redes_dict.get("tiktok"),
        google_maps=redes_dict.get("google_maps"),
        marketplaces=redes_dict.get("marketplaces", {}),
    )
    db.add(redes)


def _process_historico_dividas(
    empresa: PessoaJuridica, historico_dict: Dict[str, Any], db: Session
) -> None:
    """Processa e salva histórico de dívidas da empresa"""
    # Remove registro antigo
    db.query(HistoricoDividasEmpresa).filter_by(empresa_id=empresa.id).delete()

    if not historico_dict:
        return

    historico = HistoricoDividasEmpresa(
        empresa_id=empresa.id,
        total_protestos=historico_dict.get("total_protestos", 0),
        valor_total_protestos=historico_dict.get("valor_total_protestos"),
        detalhes_protestos=historico_dict.get("detalhes_protestos", {}),
        total_acoes_judiciais=historico_dict.get("total_acoes_judiciais", 0),
        detalhes_acoes=historico_dict.get("detalhes_acoes", {}),
        em_recuperacao_judicial=historico_dict.get("em_recuperacao_judicial", False),
        em_falencia=historico_dict.get("em_falencia", False),
        score_risco=historico_dict.get("score_risco"),
        classificacao_risco=historico_dict.get("classificacao_risco"),
        restricoes_cadin=historico_dict.get("restricoes_cadin", {}),
    )

    # Valor total de protestos
    if historico_dict.get("valor_total_protestos"):
        try:
            historico.valor_total_protestos = Decimal(
                str(historico_dict["valor_total_protestos"])
            )
        except (ValueError, TypeError, InvalidOperation):
            pass

    db.add(historico)


# Importa asyncio no topo do arquivo
import asyncio
from decimal import InvalidOperation
