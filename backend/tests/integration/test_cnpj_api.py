"""
Testes de Integração para API CNPJ
Sprint S02-F05-I01

Valida todos os 9 endpoints da API com dados reais do banco PostgreSQL.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.dependencies import get_db
from app.core.config import settings


# Configuração do banco de teste (usa o mesmo banco real para validação)
# Usa database_url do settings que já faz quote_plus da senha
engine = create_engine(settings.database_url)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency para testes"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


class TestHealthEndpoint:
    """Testa endpoint de health check"""
    
    def test_health_check_returns_200(self):
        """GET /health deve retornar 200 e status healthy"""
        response = client.get("/api/v1/cnpj/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "CNPJ API"
        assert data["database"] == "connected"


class TestEmpresaEndpoints:
    """Testa endpoints relacionados a Empresa"""
    
    @pytest.fixture(scope="class")
    def cnpj_basico_valido(self):
        """CNPJ básico válido que existe no banco"""
        # Busca um CNPJ real do banco para testes
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text("SELECT cnpj_basico FROM cnpj.empresas LIMIT 1")
            ).fetchone()
            return result[0] if result else "41273590"
        finally:
            db.close()
    
    def test_get_empresa_completa_sucesso(self, cnpj_basico_valido):
        """GET /empresa/{cnpj_basico} deve retornar empresa completa"""
        response = client.get(f"/api/v1/cnpj/empresa/{cnpj_basico_valido}")
        assert response.status_code == 200
        
        data = response.json()
        assert "empresa" in data
        assert "estabelecimentos" in data
        assert "socios" in data
        assert "simples_nacional" in data
        assert "total_estabelecimentos" in data
        assert "total_socios" in data
        
        # Valida estrutura da empresa
        empresa = data["empresa"]
        assert "cnpj_basico" in empresa
        assert "razao_social" in empresa
        assert "porte_descricao" in empresa
        assert empresa["cnpj_basico"] == cnpj_basico_valido
    
    def test_get_empresa_nao_encontrada(self):
        """GET /empresa/{cnpj_invalido} deve retornar 404"""
        response = client.get("/api/v1/cnpj/empresa/99999999")
        assert response.status_code == 404
        
        data = response.json()
        assert "detail" in data
        assert "não encontrada" in data["detail"].lower()
    
    def test_get_simples_nacional_sucesso(self, cnpj_basico_valido):
        """GET /empresa/{cnpj_basico}/simples deve retornar regime tributário"""
        response = client.get(f"/api/v1/cnpj/empresa/{cnpj_basico_valido}/simples")
        # Pode retornar 200 ou 404 dependendo se empresa tem simples
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            data = response.json()
            assert "regime_tributario" in data
            assert "status_simples" in data
    
    def test_search_empresas_por_razao_social(self):
        """GET /search/empresas?razao_social=LTDA deve retornar lista paginada"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "limit": 5}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "total" in data
        assert "count" in data
        assert "items" in data
        assert isinstance(data["items"], list)
        assert data["total"] > 0
        
        # Valida estrutura do primeiro item
        if data["count"] > 0:
            item = data["items"][0]
            assert "cnpj_basico" in item
            assert "razao_social" in item
            assert "porte_descricao" in item
    
    def test_search_empresas_com_filtros(self):
        """GET /search/empresas com múltiplos filtros"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={
                "razao_social": "SERVICOS",
                "porte": 5,  # DEMAIS
                "limit": 3,
                "offset": 0
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        # Se houver resultados, valida filtro de porte
        if data["count"] > 0:
            for item in data["items"]:
                assert item["porte_empresa"] == 5
    
    def test_search_empresas_limite_paginacao(self):
        """GET /search/empresas valida limites de paginação"""
        # Limite máximo
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "limit": 1000}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["count"] <= 100  # Limite definido no endpoint


class TestEstabelecimentoEndpoints:
    """Testa endpoints relacionados a Estabelecimento"""
    
    @pytest.fixture(scope="class")
    def cnpj_completo_valido(self):
        """CNPJ completo válido (14 dígitos)"""
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text(
                    "SELECT cnpj_basico || cnpj_ordem || cnpj_dv "
                    "FROM cnpj.estabelecimentos LIMIT 1"
                )
            ).fetchone()
            return result[0] if result else "41273590000103"
        finally:
            db.close()
    
    @pytest.fixture(scope="class")
    def cnpj_basico_com_estabelecimentos(self):
        """CNPJ básico que tem estabelecimentos"""
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text(
                    "SELECT cnpj_basico FROM cnpj.estabelecimentos "
                    "GROUP BY cnpj_basico HAVING COUNT(*) > 1 LIMIT 1"
                )
            ).fetchone()
            return result[0] if result else "41273590"
        finally:
            db.close()
    
    def test_get_estabelecimento_por_cnpj_completo(self, cnpj_completo_valido):
        """GET /estabelecimento/{cnpj_completo} deve retornar estabelecimento"""
        response = client.get(f"/api/v1/cnpj/estabelecimento/{cnpj_completo_valido}")
        assert response.status_code == 200
        
        data = response.json()
        assert "cnpj_basico" in data
        assert "cnpj_ordem" in data
        assert "cnpj_dv" in data
        assert "cnpj_formatado" in data
        assert "tipo_estabelecimento" in data
        assert "situacao_descricao" in data
        assert "endereco_completo" in data
        
        # Valida CNPJ formatado
        assert "-" in data["cnpj_formatado"]
        assert "/" in data["cnpj_formatado"]
    
    def test_get_estabelecimento_nao_encontrado(self):
        """GET /estabelecimento/{cnpj_invalido} deve retornar 404"""
        response = client.get("/api/v1/cnpj/estabelecimento/99999999999999")
        assert response.status_code == 404
    
    def test_list_estabelecimentos_por_empresa(self, cnpj_basico_com_estabelecimentos):
        """GET /estabelecimentos/empresa/{cnpj_basico} deve retornar lista"""
        response = client.get(
            f"/api/v1/cnpj/estabelecimentos/empresa/{cnpj_basico_com_estabelecimentos}"
        )
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Valida primeiro estabelecimento
        estab = data[0]
        assert "cnpj_formatado" in estab
        assert "tipo_estabelecimento" in estab
        assert estab["cnpj_basico"] == cnpj_basico_com_estabelecimentos


class TestSocioEndpoints:
    """Testa endpoints relacionados a Sócios"""
    
    @pytest.fixture(scope="class")
    def cnpj_basico_com_socios(self):
        """CNPJ básico que tem sócios"""
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text("SELECT cnpj_basico FROM cnpj.socios LIMIT 1")
            ).fetchone()
            return result[0] if result else "00000000"
        finally:
            db.close()
    
    def test_list_socios_por_empresa(self, cnpj_basico_com_socios):
        """GET /socios/empresa/{cnpj_basico} deve retornar lista de sócios"""
        response = client.get(f"/api/v1/cnpj/socios/empresa/{cnpj_basico_com_socios}")
        # Pode retornar 200 ou 404 se não houver sócios
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)
            assert len(data) > 0
            
            # Valida estrutura do sócio
            socio = data[0]
            assert "identificador_socio" in socio
            assert "tipo_socio" in socio
            assert "documento_formatado" in socio
    
    def test_search_socios_por_nome(self):
        """GET /socios/search?nome=SILVA deve retornar lista paginada"""
        response = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "SILVA", "limit": 5}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "total" in data
        assert "count" in data
        assert "items" in data
        assert data["total"] > 0
        
        # Valida primeiro sócio
        if data["count"] > 0:
            socio = data["items"][0]
            assert "nome_socio" in socio
            assert "SILVA" in socio["nome_socio"].upper()
            assert "tipo_socio" in socio
    
    def test_search_socios_por_cpf(self):
        """GET /socios/search?documento=12345678900 deve buscar por CPF"""
        # Busca um CPF real do banco
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text(
                    "SELECT cnpj_cpf_socio FROM cnpj.socios "
                    "WHERE identificador_socio = 2 LIMIT 1"
                )
            ).fetchone()
            
            if result and result[0]:
                cpf = result[0]
                response = client.get(
                    "/api/v1/cnpj/socios/search",
                    params={"documento": cpf, "limit": 5}
                )
                assert response.status_code == 200
                
                data = response.json()
                if data["count"] > 0:
                    assert data["items"][0]["cnpj_cpf_socio"] == cpf
        finally:
            db.close()
    
    def test_search_socios_paginacao(self):
        """GET /socios/search valida paginação"""
        # Primeira página
        response1 = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "SILVA", "limit": 2, "offset": 0}
        )
        assert response1.status_code == 200
        data1 = response1.json()
        
        # Segunda página
        response2 = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "SILVA", "limit": 2, "offset": 2}
        )
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Valida que são páginas diferentes
        if data1["count"] > 0 and data2["count"] > 0:
            assert data1["items"][0] != data2["items"][0]


class TestValidacaoSchemas:
    """Testa validação de schemas Pydantic"""
    
    def test_empresa_detalhada_computed_fields(self):
        """Valida computed fields em EmpresaDetalhada"""
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text("SELECT cnpj_basico FROM cnpj.empresas LIMIT 1")
            ).fetchone()
            
            if result:
                cnpj = result[0]
                response = client.get(f"/api/v1/cnpj/empresa/{cnpj}")
                assert response.status_code == 200
                
                empresa = response.json()["empresa"]
                # Computed field: porte_descricao
                assert "porte_descricao" in empresa
                assert isinstance(empresa["porte_descricao"], str)
        finally:
            db.close()
    
    def test_estabelecimento_computed_fields(self):
        """Valida computed fields em EstabelecimentoCompleto"""
        db = TestingSessionLocal()
        try:
            result = db.execute(
                text(
                    "SELECT cnpj_basico || cnpj_ordem || cnpj_dv "
                    "FROM cnpj.estabelecimentos LIMIT 1"
                )
            ).fetchone()
            
            if result:
                cnpj = result[0]
                response = client.get(f"/api/v1/cnpj/estabelecimento/{cnpj}")
                assert response.status_code == 200
                
                data = response.json()
                # Computed fields
                assert "cnpj_formatado" in data
                assert "tipo_estabelecimento" in data  # is_matriz
                assert "situacao_descricao" in data
                assert "endereco_completo" in data
                assert "cep_formatado" in data
        finally:
            db.close()
    
    def test_socio_computed_fields(self):
        """Valida computed fields em SocioDetalhado"""
        response = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "SILVA", "limit": 1}
        )
        assert response.status_code == 200
        
        data = response.json()
        if data["count"] > 0:
            socio = data["items"][0]
            # Computed fields
            assert "tipo_socio" in socio
            assert "documento_formatado" in socio
            assert "faixa_etaria_descricao" in socio


class TestErrorHandling:
    """Testa tratamento de erros e validações"""
    
    def test_cnpj_basico_invalido_formato(self):
        """CNPJ básico com formato inválido deve retornar erro"""
        response = client.get("/api/v1/cnpj/empresa/ABCD1234")
        assert response.status_code in [404, 422]  # 404 se não encontrar, 422 se validar
    
    def test_cnpj_completo_invalido_tamanho(self):
        """CNPJ completo com tamanho inválido"""
        response = client.get("/api/v1/cnpj/estabelecimento/123")  # Muito curto
        assert response.status_code in [404, 422]
    
    def test_search_sem_parametros(self):
        """Search sem nenhum parâmetro deve retornar erro ou vazio"""
        response = client.get("/api/v1/cnpj/search/empresas")
        # Deve aceitar ou validar que precisa de ao menos 1 filtro
        assert response.status_code in [200, 422]
    
    def test_limit_negativo(self):
        """Limit negativo deve retornar erro de validação"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "limit": -1}
        )
        assert response.status_code == 422
    
    def test_offset_negativo(self):
        """Offset negativo deve retornar erro de validação"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "offset": -5}
        )
        assert response.status_code == 422


# Executar com: pytest backend/tests/integration/test_cnpj_api.py -v
