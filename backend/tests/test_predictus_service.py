"""
Testes para o serviço de integração Predictus API
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime
from decimal import Decimal

from app.services.predictus_service import (
    PredictusAPIClient,
    parse_predictus_pj_response,
    PredictusAPIError,
)


# Mock data - exemplo de resposta da API Predictus
MOCK_PREDICTUS_RESPONSE = {
    "cnpj": "12.345.678/0001-90",
    "razao_social": "EMPRESA TESTE LTDA",
    "nome_fantasia": "Empresa Teste",
    "situacao_cadastral": "ATIVA",
    "data_abertura": "2020-01-15",
    "porte": "PEQUENO",
    "capital_social": 100000.00,
    "natureza_juridica": "Sociedade Empresária Limitada",
    "mei": False,
    "simples_nacional": True,
    "dados_complementares": {
        "inscricao_estadual": "123456789",
        "inscricao_municipal": "987654321",
    },
    "cnaes": [
        {
            "codigo": "6201-5/00",
            "descricao": "Desenvolvimento de programas de computador sob encomenda",
            "is_principal": True,
        },
        {
            "codigo": "6202-3/00",
            "descricao": "Desenvolvimento e licenciamento de programas de computador customizáveis",
            "is_principal": False,
        },
    ],
    "enderecos": [
        {
            "logradouro": "Rua Teste",
            "numero": "123",
            "complemento": "Sala 10",
            "bairro": "Centro",
            "cep": "12345-678",
            "municipio": "São Paulo",
            "uf": "SP",
            "telefones": ["11987654321", "1133334444"],
            "email": "contato@empresateste.com.br",
            "latitude": -23.550520,
            "longitude": -46.633308,
        }
    ],
    "socios": [
        {
            "nome": "João da Silva",
            "cpf_cnpj": "123.456.789-00",
            "qualificacao": "Sócio-Administrador",
            "percentual_participacao": 60.0,
            "data_entrada": "2020-01-15",
            "data_saida": None,
            "representante_legal": None,
            "is_ativo": True,
        },
        {
            "nome": "Maria Santos",
            "cpf_cnpj": "987.654.321-00",
            "qualificacao": "Sócio",
            "percentual_participacao": 40.0,
            "data_entrada": "2020-01-15",
            "data_saida": None,
            "representante_legal": None,
            "is_ativo": True,
        },
    ],
    "redes_sociais": {
        "website": "https://empresateste.com.br",
        "instagram": "@empresateste",
        "linkedin": "empresa-teste",
        "facebook": "empresateste",
    },
    "historico_dividas": {
        "total_protestos": 0,
        "valor_total_protestos": 0.0,
        "detalhes_protestos": {},
        "total_acoes_judiciais": 2,
        "detalhes_acoes": {
            "civel": 1,
            "trabalhista": 1,
        },
        "em_recuperacao_judicial": False,
        "em_falencia": False,
        "score_risco": 750,
        "classificacao_risco": "BAIXO",
        "restricoes_cadin": {},
    },
}


class TestPredictusAPIClient:
    """Testes para PredictusAPIClient"""

    def test_init_with_custom_params(self):
        """Testa inicialização com parâmetros customizados"""
        client = PredictusAPIClient(
            api_url="https://test.api.com",
            api_key="test_key_123",
            timeout=60,
            max_retries=5,
        )
        assert client.api_url == "https://test.api.com"
        assert client.api_key == "test_key_123"
        assert client.timeout == 60
        assert client.max_retries == 5
        assert client.cache_ttl == 7 * 24 * 60 * 60  # 7 dias

    def test_cache_key_generation(self):
        """Testa geração de chave de cache"""
        client = PredictusAPIClient(
            api_url="https://test.api.com", api_key="test_key"
        )
        
        # CNPJ formatado deve ser limpo
        cache_key = client._get_cache_key("12.345.678/0001-90")
        assert cache_key == "predictus:pj:12345678000190"
        
        # CNPJ já limpo
        cache_key = client._get_cache_key("12345678000190")
        assert cache_key == "predictus:pj:12345678000190"

    @pytest.mark.asyncio
    async def test_get_dossie_pj_invalid_cnpj(self):
        """Testa validação de CNPJ inválido"""
        client = PredictusAPIClient(
            api_url="https://test.api.com", api_key="test_key"
        )
        
        with pytest.raises(PredictusAPIError, match="CNPJ inválido"):
            await client.get_dossie_pj("123")  # CNPJ muito curto

    @pytest.mark.asyncio
    async def test_get_dossie_pj_cache_hit(self):
        """Testa cache hit (dados já em cache)"""
        client = PredictusAPIClient(
            api_url="https://test.api.com", api_key="test_key"
        )
        
        # Mock do cache retornando dados
        with patch.object(
            client, "_get_from_cache", return_value=MOCK_PREDICTUS_RESPONSE
        ):
            result = await client.get_dossie_pj("12345678000190")
            assert result == MOCK_PREDICTUS_RESPONSE
            assert result["razao_social"] == "EMPRESA TESTE LTDA"

    @pytest.mark.asyncio
    async def test_get_dossie_pj_api_call_success(self):
        """Testa chamada à API com sucesso"""
        client = PredictusAPIClient(
            api_url="https://test.api.com", api_key="test_key"
        )
        
        # Mock do cache vazio (cache miss)
        with patch.object(client, "_get_from_cache", return_value=None):
            # Mock do httpx client
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = MOCK_PREDICTUS_RESPONSE
            
            with patch("httpx.AsyncClient") as mock_client_class:
                mock_client = AsyncMock()
                mock_client.get.return_value = mock_response
                mock_client_class.return_value.__aenter__.return_value = mock_client
                
                # Mock do save_to_cache
                with patch.object(client, "_save_to_cache"):
                    result = await client.get_dossie_pj("12345678000190")
                    
                    assert result == MOCK_PREDICTUS_RESPONSE
                    assert result["cnpj"] == "12.345.678/0001-90"

    @pytest.mark.asyncio
    async def test_get_dossie_pj_api_404(self):
        """Testa CNPJ não encontrado (404)"""
        client = PredictusAPIClient(
            api_url="https://test.api.com", api_key="test_key"
        )
        
        with patch.object(client, "_get_from_cache", return_value=None):
            mock_response = Mock()
            mock_response.status_code = 404
            
            with patch("httpx.AsyncClient") as mock_client_class:
                mock_client = AsyncMock()
                mock_client.get.return_value = mock_response
                mock_client_class.return_value.__aenter__.return_value = mock_client
                
                with pytest.raises(PredictusAPIError, match="não encontrado"):
                    await client.get_dossie_pj("12345678000190")

    @pytest.mark.asyncio
    async def test_get_dossie_pj_api_401(self):
        """Testa erro de autenticação (401)"""
        client = PredictusAPIClient(
            api_url="https://test.api.com", api_key="invalid_key"
        )
        
        with patch.object(client, "_get_from_cache", return_value=None):
            mock_response = Mock()
            mock_response.status_code = 401
            
            with patch("httpx.AsyncClient") as mock_client_class:
                mock_client = AsyncMock()
                mock_client.get.return_value = mock_response
                mock_client_class.return_value.__aenter__.return_value = mock_client
                
                with pytest.raises(PredictusAPIError, match="API Key inválida"):
                    await client.get_dossie_pj("12345678000190")


class TestParsePredictusPJResponse:
    """Testes para função de parse da resposta"""

    def test_parse_new_empresa(self, db_session):
        """Testa parse criando nova empresa"""
        result = parse_predictus_pj_response(MOCK_PREDICTUS_RESPONSE, db_session)
        
        # Verifica dados principais
        assert result.cnpj == "12345678000190"
        assert result.razao_social == "EMPRESA TESTE LTDA"
        assert result.nome_fantasia == "Empresa Teste"
        assert result.situacao_cadastral == "ATIVA"
        assert result.porte == "PEQUENO"
        assert result.capital_social == Decimal("100000.00")
        assert result.mei is False
        assert result.simples_nacional is True
        
        # Verifica CNAEs
        assert len(result.cnaes) == 2
        cnae_principal = [c for c in result.cnaes if c.is_principal][0]
        assert cnae_principal.codigo == "6201-5/00"
        assert "Desenvolvimento de programas" in cnae_principal.descricao
        
        # Verifica endereços
        assert len(result.enderecos) == 1
        endereco = result.enderecos[0]
        assert endereco.logradouro == "Rua Teste"
        assert endereco.numero == "123"
        assert endereco.municipio == "São Paulo"
        assert endereco.uf == "SP"
        assert len(endereco.telefones) == 2
        
        # Verifica sócios
        assert len(result.socios) == 2
        socio_admin = [s for s in result.socios if "Administrador" in s.qualificacao][0]
        assert socio_admin.nome == "João da Silva"
        assert socio_admin.percentual_participacao == 60.0
        assert socio_admin.is_ativo is True
        
        # Verifica redes sociais
        assert result.redes_sociais is not None
        assert result.redes_sociais.website == "https://empresateste.com.br"
        assert result.redes_sociais.instagram == "@empresateste"
        
        # Verifica histórico de dívidas
        assert result.historico_dividas is not None
        assert result.historico_dividas.total_protestos == 0
        assert result.historico_dividas.total_acoes_judiciais == 2
        assert result.historico_dividas.score_risco == 750
        assert result.historico_dividas.classificacao_risco == "BAIXO"

    def test_parse_update_empresa(self, db_session):
        """Testa parse atualizando empresa existente"""
        from app.models.pessoa_juridica import PessoaJuridica
        
        # Cria empresa inicial
        empresa_existente = PessoaJuridica(
            cnpj="12345678000190",
            razao_social="EMPRESA ANTIGA LTDA",
            situacao_cadastral="ATIVA",
        )
        db_session.add(empresa_existente)
        db_session.commit()
        empresa_id = empresa_existente.id
        
        # Parse com novos dados
        result = parse_predictus_pj_response(MOCK_PREDICTUS_RESPONSE, db_session)
        
        # Verifica que é a mesma empresa (mesmo ID)
        assert result.id == empresa_id
        # Verifica que dados foram atualizados
        assert result.razao_social == "EMPRESA TESTE LTDA"
        assert result.nome_fantasia == "Empresa Teste"


# Fixtures para testes

@pytest.fixture
def db_session():
    """Mock de sessão do banco de dados"""
    from unittest.mock import MagicMock
    from sqlalchemy.orm import Session
    
    mock_session = MagicMock(spec=Session)
    
    # Mock de query que retorna None (empresa não existe)
    mock_query = MagicMock()
    mock_query.filter_by.return_value.first.return_value = None
    mock_session.query.return_value = mock_query
    
    # Mock de add/commit/refresh
    mock_session.add = MagicMock()
    mock_session.commit = MagicMock()
    mock_session.refresh = MagicMock()
    mock_session.flush = MagicMock()
    
    return mock_session
