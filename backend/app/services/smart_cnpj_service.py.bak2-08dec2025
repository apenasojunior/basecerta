"""
Service Layer - Smart CNPJ
Issue: 2.1.4 - Service Layer Smart CNPJ Backend

Lógica de negócio para o produto Smart CNPJ 360°.
Camada entre API endpoints e CRUD operations.
"""
from typing import Optional, List, Tuple, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging
import json

from app.crud.smart_cnpj import (
    get_empresa_by_cnpj,
    search_empresas,
    create_pesquisa_record,
    get_historico_pesquisas,
    get_search_stats
)
from app.models.cnpj import Estabelecimento, CNAE
from app.models.pesquisa import PesquisaCNPJ
from app.schemas.enums import TipoBusca
from app.schemas.smart_cnpj_request import SmartCNPJSearchRequest, FiltrosRequest
from app.schemas.smart_cnpj_response import (
    SmartCNPJCompanyResponse,
    SmartCNPJSearchResponse,
    PaginationMetadata
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class SmartCNPJService:
    """
    Service para operações do Smart CNPJ 360°.
    
    Responsabilidades:
    - Validação de entrada
    - Cache Redis (hit/miss)
    - Lógica de negócio
    - Mock de créditos (user_id=1)
    - Histórico de pesquisas
    - Formatação de resposta
    """
    
    def __init__(self, db: Session, redis_client: Optional[Any] = None):
        """
        Inicializa service com dependências.
        
        Args:
            db: Sessão do banco de dados
            redis_client: Cliente Redis (opcional, fallback se None)
        """
        self.db = db
        self.redis = redis_client
        self.cache_ttl = 86400  # 24 horas
        self.user_id = 1  # Mock: user fixo (TODO: remover na Delivery 3)
    
    # ================================================================
    # BUSCA POR CNPJ ESPECÍFICO
    # ================================================================
    
    def buscar_cnpj(
        self,
        cnpj: str,
        include_socios: bool = True,
        include_cnaes_secundarios: bool = True
    ) -> Optional[SmartCNPJCompanyResponse]:
        """
        Busca empresa por CNPJ com cache Redis.
        
        Flow:
        1. Validar formato CNPJ
        2. Verificar cache Redis
        3. Se cache miss: buscar no banco
        4. Salvar no cache
        5. Registrar no histórico
        6. Mock de créditos (-5)
        7. Retornar resposta formatada
        
        Args:
            cnpj: CNPJ com ou sem formatação
            include_socios: Se deve incluir sócios
            include_cnaes_secundarios: Se deve incluir CNAEs secundários
        
        Returns:
            SmartCNPJCompanyResponse ou None se não encontrado
        
        Raises:
            ValueError: Se CNPJ for inválido
        
        Examples:
            >>> service = SmartCNPJService(db, redis)
            >>> empresa = service.buscar_cnpj("11.779.918/0001-05")
            >>> print(empresa.razaoSocial)
            "N. F. C. VIANNA"
        """
        start_time = datetime.now()
        
        # 1. Validar CNPJ
        cnpj_limpo = self._limpar_cnpj(cnpj)
        if not self._validar_cnpj(cnpj_limpo):
            raise ValueError(f"CNPJ inválido: {cnpj}")
        
        # 2. Verificar cache Redis
        cache_key = f"cnpj:{cnpj_limpo}"
        cached_data = self._get_from_cache(cache_key)
        
        if cached_data:
            logger.info(f"Cache HIT: {cache_key}")
            # Ainda registra no histórico mesmo com cache
            self._registrar_pesquisa(
                tipo_busca="cnpj",  # Corrigido: lowercase para match com CHECK constraint
                valor_busca=cnpj_limpo,
                filtros_aplicados={},
                total_resultados=1,  # Corrigido: total_resultados
                tempo_resposta_ms=int((datetime.now() - start_time).total_seconds() * 1000),
                from_cache=True
            )
            return SmartCNPJCompanyResponse(**cached_data)
        
        logger.info(f"Cache MISS: {cache_key}")
        
        # 3. Buscar no banco (CRUD)
        estabelecimento = get_empresa_by_cnpj(
            self.db,
            cnpj_limpo,
            include_socios=include_socios,
            include_cnaes_secundarios=include_cnaes_secundarios
        )
        
        if not estabelecimento:
            logger.info(f"Empresa não encontrada: CNPJ={cnpj}")
            return None
        
        # 4. Converter para response schema
        response = self._estabelecimento_to_response(estabelecimento)
        
        # 5. Salvar no cache
        self._set_in_cache(cache_key, response.model_dump(), ttl=self.cache_ttl)
        
        # 6. Registrar no histórico + mock de créditos
        tempo_resposta_ms = int((datetime.now() - start_time).total_seconds() * 1000)
        self._registrar_pesquisa(
            tipo_busca="cnpj",  # Corrigido: lowercase para match com CHECK constraint
            valor_busca=cnpj_limpo,
            filtros_aplicados={},
            total_resultados=1,  # Corrigido: total_resultados
            tempo_resposta_ms=tempo_resposta_ms,
            from_cache=False
        )
        
        logger.info(f"Empresa retornada: CNPJ={cnpj_limpo}, Tempo={tempo_resposta_ms}ms")
        
        return response
    
    # ================================================================
    # BUSCA AVANÇADA COM FILTROS
    # ================================================================
    
    def buscar_empresas(
        self,
        request: SmartCNPJSearchRequest
    ) -> SmartCNPJSearchResponse:
        """
        Busca avançada com 7 tipos de busca + 8 filtros.
        
        Flow:
        1. Validar parâmetros
        2. Verificar cache Redis
        3. Executar busca (CRUD)
        4. Converter resultados para response
        5. Salvar no cache
        6. Registrar no histórico
        7. Mock de créditos (-5)
        8. Retornar resposta paginada
        
        Args:
            request: SmartCNPJSearchRequest com tipo, valor, filtros, paginação
        
        Returns:
            SmartCNPJSearchResponse com resultados + metadata
        
        Examples:
            >>> request = SmartCNPJSearchRequest(
            ...     tipo_busca=TipoBusca.RAZAO_SOCIAL,
            ...     valor_busca="TECNOLOGIA",
            ...     filtros=FiltrosRequest(uf="SP"),
            ...     page=1,
            ...     page_size=20
            ... )
            >>> response = service.buscar_empresas(request)
            >>> print(f"{response.total} empresas encontradas")
        """
        start_time = datetime.now()
        
        # 1. Validar mock de créditos
        if not self._validar_creditos():
            raise ValueError("Créditos insuficientes")
        
        # 2. Converter filtros para dict (apenas preenchidos)
        filtros_dict = {}
        if request.filtros:
            filtros_dict = {
                k: v for k, v in request.filtros.model_dump().items()
                if v is not None
            }
        
        # 3. Verificar cache Redis
        cache_key = self._build_search_cache_key(
            tipo_busca=request.tipo_busca.value,
            valor_busca=request.valor_busca,
            filtros=filtros_dict,
            page=request.page,
            limit=request.limit
        )
        cached_data = self._get_from_cache(cache_key)
        
        if cached_data:
            logger.info(f"🎯 Cache HIT: search - {cache_key[:50]}...")
            # Ainda registra no histórico mesmo com cache
            self._registrar_pesquisa(
                tipo_busca=request.tipo_busca.value,
                valor_busca=request.valor_busca,
                filtros_aplicados=filtros_dict,
                total_resultados=cached_data.get("total", 0),
                tempo_resposta_ms=int((datetime.now() - start_time).total_seconds() * 1000),
                from_cache=True
            )
            return SmartCNPJSearchResponse(**cached_data)
        
        logger.info(f"💨 Cache MISS: search - {cache_key[:50]}...")
        
        # 4. Executar busca (CRUD)
        resultados, total = search_empresas(
            db=self.db,
            tipo_busca=request.tipo_busca,
            valor_busca=request.valor_busca,
            filtros=filtros_dict,
            page=request.page,
            limit=request.limit
        )
        
        # 4. Converter para response schemas
        empresas = [
            self._estabelecimento_to_response(est)
            for est in resultados
        ]
        
        # 5. Calcular metadata de paginação
        tempo_resposta_ms = int((datetime.now() - start_time).total_seconds() * 1000)
        total_pages = (total + request.limit - 1) // request.limit if total > 0 else 0
        
        # Com LIMIT+1 pattern:
        # - Se total = (page * limit) + 1, é estimado (tem mais páginas)
        # - Se total = offset + resultados, é exato (última página)
        has_next = request.page < total_pages
        is_estimate = has_next  # Estimado se tem próxima página
        
        metadata = PaginationMetadata(
            total=total,
            page=request.page,
            limit=request.limit,
            totalPages=total_pages,
            hasNext=has_next,
            hasPrev=request.page > 1,
            isEstimate=is_estimate  # ✅ Novo campo
        )
        
        # 6. Criar response
        response = SmartCNPJSearchResponse(
            data=empresas,
            pagination=metadata
        )
        
        # 7. Salvar no cache (TTL menor para buscas - 1 hora)
        self._set_in_cache(cache_key, response.model_dump(), ttl=3600)
        
        # 8. Registrar no histórico + mock de créditos
        self._registrar_pesquisa(
            tipo_busca=request.tipo_busca.value,
            valor_busca=request.valor_busca,
            filtros_aplicados=filtros_dict,
            total_resultados=total,  # Corrigido: total_resultados
            tempo_resposta_ms=tempo_resposta_ms,
            from_cache=False
        )
        
        # 9. Adicionar metadados extras ao response
        response_dict = response.model_dump()
        response_dict.update({
            "filters": filtros_dict,
            "searchType": request.tipo_busca.value,
            "searchValue": request.valor_busca,
            "tempoResposta": tempo_resposta_ms
        })
        
        logger.info(
            f"Busca executada: tipo={request.tipo_busca.value}, "
            f"valor={request.valor_busca}, total={total}, tempo={tempo_resposta_ms}ms"
        )
        
        return SmartCNPJSearchResponse(**response_dict)
    
    # ================================================================
    # HISTÓRICO E ESTATÍSTICAS
    # ================================================================
    
    def get_historico(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[PesquisaCNPJ], int]:
        """
        Retorna histórico de pesquisas do usuário.
        
        Args:
            page: Número da página
            page_size: Registros por página
        
        Returns:
            Tuple (lista de pesquisas, total)
        """
        return get_historico_pesquisas(self.db, self.user_id, page, page_size)
    
    def get_estatisticas(self) -> Dict[str, Any]:
        """
        Retorna estatísticas de uso do usuário.
        
        Returns:
            Dicionário com métricas de uso
        """
        return get_search_stats(self.db, self.user_id)
    
    # ================================================================
    # HELPERS PRIVADOS
    # ================================================================
    
    def _estabelecimento_to_response(
        self,
        estabelecimento: Estabelecimento
    ) -> SmartCNPJCompanyResponse:
        """
        Converte model Estabelecimento para response schema.
        
        Mapeia todos os campos do banco para o formato esperado pelo frontend.
        """
        empresa = estabelecimento.empresa
        
        # Montar CNPJ formatado
        cnpj_completo = (
            f"{estabelecimento.cnpj_basico}"
            f"{estabelecimento.cnpj_ordem}"
            f"{estabelecimento.cnpj_dv}"
        )
        cnpj_formatado = self._formatar_cnpj(cnpj_completo)
        
        # Montar endereço
        endereco = {
            "cep": estabelecimento.cep or "",
            "logradouro": estabelecimento.tipo_logradouro or "" + " " + (estabelecimento.logradouro or ""),
            "numero": estabelecimento.numero or "",
            "complemento": estabelecimento.complemento or "",
            "bairro": estabelecimento.bairro or "",
            "municipio": estabelecimento.municipio_obj.descricao if estabelecimento.municipio_obj else "",
            "uf": estabelecimento.uf or ""
        }
        
        # Montar contatos
        # Formatar telefones: concatenar DDD + número e formatar se tiver conteúdo
        telefone1_raw = f"{estabelecimento.ddd_1 or ''}{estabelecimento.telefone_1 or ''}".strip()
        telefone2_raw = f"{estabelecimento.ddd_2 or ''}{estabelecimento.telefone_2 or ''}".strip()
        fax_raw = f"{estabelecimento.ddd_fax or ''}{estabelecimento.fax or ''}".strip()
        
        # Formatar telefones (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        def format_phone(phone: str) -> Optional[str]:
            if not phone or len(phone) < 10:
                return None
            # Remove caracteres não numéricos
            digits = ''.join(filter(str.isdigit, phone))
            if len(digits) == 10:  # (XX) XXXX-XXXX
                return f"({digits[:2]}) {digits[2:6]}-{digits[6:]}"
            elif len(digits) == 11:  # (XX) XXXXX-XXXX
                return f"({digits[:2]}) {digits[2:7]}-{digits[7:]}"
            return phone  # Retorna sem formatação se não couber nos padrões
        
        contatos = {
            "email": estabelecimento.correio_eletronico or None,
            "telefone": format_phone(telefone1_raw),
            "telefone2": format_phone(telefone2_raw),
            "fax": format_phone(fax_raw)
        }
        
        # Montar CNAE principal
        cnae_principal = None
        if estabelecimento.cnae_principal:
            cnae_principal = {
                "codigo": estabelecimento.cnae_fiscal_principal,
                "descricao": estabelecimento.cnae_principal.descricao
            }
        
        # Montar CNAEs secundários
        cnaes_secundarios = []
        if estabelecimento.cnae_fiscal_secundaria:
            # Campo é Text com códigos separados por vírgula: "1234567,7654321,9876543"
            codigos = estabelecimento.cnae_fiscal_secundaria.split(',')
            for codigo in codigos:
                codigo = codigo.strip()
                if codigo:
                    # Buscar descrição do CNAE no banco
                    cnae_obj = self.db.query(CNAE).filter(CNAE.codigo == codigo).first()
                    if cnae_obj:
                        cnaes_secundarios.append({
                            "codigo": codigo,
                            "descricao": cnae_obj.descricao
                        })
                    else:
                        # Se não encontrar descrição, incluir só o código
                        cnaes_secundarios.append({
                            "codigo": codigo,
                            "descricao": ""
                        })
        
        # Montar sócios
        socios = []
        if empresa and empresa.socios:
            for socio in empresa.socios:
                socios.append({
                    "nome": socio.nome_socio or "",
                    "cpfCnpj": socio.cnpj_cpf_socio or "",  # Corrigido: cnpj_cpf_socio
                    "qualificacao": socio.qualificacao_socio or "",
                    "dataEntrada": str(socio.data_entrada_sociedade) if socio.data_entrada_sociedade else None
                })
        
        # Montar response
        return SmartCNPJCompanyResponse(
            # Identificação
            cnpj=cnpj_formatado,
            razaoSocial=empresa.razao_social if empresa else "",
            nomeFantasia=estabelecimento.nome_fantasia or "",
            
            # Natureza Jurídica
            naturezaJuridica=empresa.natureza.descricao if empresa and empresa.natureza else "",
            codigoNaturezaJuridica=empresa.natureza_juridica if empresa else "",
            
            # Porte e Capital
            porte=empresa.porte_empresa if empresa else "",
            codigoPorte=empresa.porte_empresa if empresa else "",  # Código é o mesmo que descrição
            capitalSocial=float(empresa.capital_social) if empresa and empresa.capital_social else 0.0,
            
            # Situação Cadastral
            situacaoCadastral=estabelecimento.situacao_cadastral or "",
            codigoSituacaoCadastral=estabelecimento.situacao_cadastral or "",
            dataSituacaoCadastral=str(estabelecimento.data_situacao_cadastral) if estabelecimento.data_situacao_cadastral else "",
            motivoSituacaoCadastral=estabelecimento.motivo_situacao.descricao if estabelecimento.motivo_situacao else None,
            
            # Datas
            dataInicioAtividade=str(estabelecimento.data_inicio_atividade) if estabelecimento.data_inicio_atividade else "",
            dataAbertura=str(estabelecimento.data_inicio_atividade) if estabelecimento.data_inicio_atividade else "",
            
            # Nested objects
            cnaePrincipal=cnae_principal,
            cnaesSecundarios=cnaes_secundarios,
            endereco=endereco,
            contatos=contatos,
            socios=socios
        )
    
    def _limpar_cnpj(self, cnpj: str) -> str:
        """Remove formatação do CNPJ (mantém apenas dígitos)"""
        return ''.join(filter(str.isdigit, cnpj))
    
    def _validar_cnpj(self, cnpj: str) -> bool:
        """
        Valida formato do CNPJ (14 dígitos).
        
        TODO: Implementar validação de dígitos verificadores.
        """
        return len(cnpj) == 14 and cnpj.isdigit()
    
    def _formatar_cnpj(self, cnpj: str) -> str:
        """
        Formata CNPJ para exibição.
        
        Input: "12345678000190"
        Output: "12.345.678/0001-90"
        """
        if len(cnpj) != 14:
            return cnpj
        
        return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"
    
    def _validar_creditos(self) -> bool:
        """
        Mock de validação de créditos.
        
        TODO: Implementar sistema real na Sprint 2.5
        Por enquanto sempre retorna True.
        """
        logger.info(f"Mock: user_id={self.user_id} tem créditos ilimitados")
        return True
    
    def _registrar_pesquisa(
        self,
        tipo_busca: str,
        valor_busca: str,
        filtros_aplicados: Dict[str, Any],
        total_resultados: int,  # Corrigido: total_resultados
        tempo_resposta_ms: int,
        from_cache: bool = False
    ) -> None:
        """
        Registra pesquisa no histórico + mock de créditos.
        
        TODO: Integrar com sistema real de créditos na Sprint 2.5
        """
        try:
            creditos_usados = 0 if from_cache else 5  # Mock: 5 créditos por pesquisa
            
            create_pesquisa_record(
                db=self.db,
                user_id=self.user_id,
                tipo_busca=tipo_busca,
                valor_busca=valor_busca,
                filtros_aplicados=filtros_aplicados,
                total_resultados=total_resultados,  # Corrigido: total_resultados
                creditos_usados=creditos_usados,
                tempo_resposta_ms=tempo_resposta_ms
            )
            
            logger.info(
                f"Pesquisa registrada: user_id={self.user_id}, "
                f"tipo={tipo_busca}, créditos={creditos_usados}"
            )
        except Exception as e:
            # TODO: Remover try/except quando tabelas de créditos existirem (Delivery 3)
            logger.warning(f"Erro ao registrar pesquisa (ignorado): {str(e)}")
            pass
    
    
    # ================================================================
    # CACHE REDIS
    # ================================================================
    
    def _build_search_cache_key(
        self,
        tipo_busca: str,
        valor_busca: str,
        filtros: Dict[str, Any],
        page: int,
        limit: int
    ) -> str:
        """
        Gera chave única para cache de busca.
        
        Formato: search:{tipo}:{valor}:{filtros_hash}:p{page}:l{limit}
        
        Args:
            tipo_busca: Tipo de busca (cnpj, razao_social, etc)
            valor_busca: Valor buscado
            filtros: Dicionário de filtros aplicados
            page: Número da página
            limit: Limite de resultados
            
        Returns:
            String da chave de cache
        """
        import hashlib
        
        # Ordenar filtros para garantir consistência
        filtros_sorted = json.dumps(filtros, sort_keys=True)
        filtros_hash = hashlib.md5(filtros_sorted.encode()).hexdigest()[:8]
        
        # Limitar tamanho do valor_busca na chave
        valor_truncado = valor_busca[:30]
        
        return f"search:{tipo_busca}:{valor_truncado}:{filtros_hash}:p{page}:l{limit}"
    
    def _get_from_cache(self, key: str) -> Optional[Dict[str, Any]]:
        """
        Busca valor no cache Redis.
        
        Returns:
            Dict deserializado ou None se não encontrado/erro
        """
        if not self.redis:
            return None
        
        try:
            cached = self.redis.get(key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Erro ao buscar cache: {e}")
        
        return None
    
    def _set_in_cache(
        self,
        key: str,
        value: Dict[str, Any],
        ttl: int
    ) -> None:
        """
        Salva valor no cache Redis com TTL.
        
        Args:
            key: Chave do cache
            value: Dicionário a ser serializado
            ttl: Time to live em segundos
        """
        if not self.redis:
            return
        
        try:
            serialized = json.dumps(value, default=str)
            self.redis.setex(key, ttl, serialized)
            logger.info(f"Cache SET: {key} (TTL={ttl}s)")
        except Exception as e:
            logger.warning(f"Erro ao salvar cache: {e}")
