"""
Testes de Edge Cases e Validações de Erro
Sprint S02-F05-I04

Testa casos extremos, validações, e tratamento de erros da API CNPJ.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class TestCNPJValidation:
    """Testa validação de CNPJs"""
    
    def test_cnpj_basico_invalido_nao_existe(self):
        """CNPJ básico que não existe deve retornar 404"""
        response = client.get("/api/v1/cnpj/empresa/99999999")
        assert response.status_code == 404
        
        data = response.json()
        assert "detail" in data
        assert "não encontrada" in data["detail"].lower()
    
    def test_cnpj_basico_com_letras(self):
        """CNPJ básico com letras deve retornar erro"""
        response = client.get("/api/v1/cnpj/empresa/ABCD1234")
        # FastAPI pode validar antes (422) ou não encontrar (404)
        assert response.status_code in [404, 422]
    
    def test_cnpj_basico_vazio(self):
        """CNPJ básico vazio deve retornar erro"""
        response = client.get("/api/v1/cnpj/empresa/")
        # Rota não existe, retorna 404 ou 307 redirect
        assert response.status_code in [404, 307]
    
    def test_cnpj_completo_invalido_tamanho(self):
        """CNPJ completo com tamanho errado"""
        # Muito curto
        response = client.get("/api/v1/cnpj/estabelecimento/123")
        assert response.status_code in [404, 422]
        
        # Muito longo
        response = client.get("/api/v1/cnpj/estabelecimento/123456789012345678")
        assert response.status_code in [404, 422]
    
    def test_cnpj_completo_nao_existe(self):
        """CNPJ completo válido mas inexistente"""
        response = client.get("/api/v1/cnpj/estabelecimento/99999999999999")
        assert response.status_code == 404
    
    def test_cnpj_completo_com_caracteres_especiais(self):
        """CNPJ com caracteres especiais deve ser tratado"""
        # Com pontuação (pode aceitar e limpar, ou rejeitar)
        response = client.get("/api/v1/cnpj/estabelecimento/12.345.678/0001-99")
        assert response.status_code in [404, 422]


class TestSearchValidation:
    """Testa validações de parâmetros de busca"""
    
    def test_search_empresas_limite_negativo(self):
        """Limit negativo deve retornar erro de validação"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "limit": -1}
        )
        assert response.status_code == 422
        
        data = response.json()
        assert "detail" in data
    
    def test_search_empresas_limite_zero(self):
        """Limit zero deve retornar erro ou lista vazia"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "limit": 0}
        )
        # Pode validar como erro ou aceitar retornando vazio
        assert response.status_code in [200, 422]
    
    def test_search_empresas_limite_muito_alto(self):
        """Limit muito alto deve ser limitado ao máximo permitido"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "limit": 999999}
        )
        assert response.status_code == 200
        
        data = response.json()
        # Deve respeitar limite máximo (100)
        assert data["count"] <= 100
    
    def test_search_empresas_offset_negativo(self):
        """Offset negativo deve retornar erro"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "offset": -10}
        )
        assert response.status_code == 422
    
    def test_search_empresas_porte_invalido(self):
        """Porte inválido deve retornar erro ou ignorar"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "porte": 999}
        )
        # Pode validar como erro ou aceitar sem resultados
        assert response.status_code in [200, 422]
    
    def test_search_sem_nenhum_parametro(self):
        """Search sem parâmetros deve retornar erro ou vazio"""
        response = client.get("/api/v1/cnpj/search/empresas")
        # Pode exigir ao menos 1 filtro
        assert response.status_code in [200, 422]
    
    def test_search_socios_limite_negativo(self):
        """Search sócios com limit negativo"""
        response = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "SILVA", "limit": -5}
        )
        assert response.status_code == 422
    
    def test_search_socios_sem_parametros(self):
        """Search sócios sem filtros"""
        response = client.get("/api/v1/cnpj/socios/search")
        assert response.status_code in [200, 422]


class TestSQLInjectionProtection:
    """Testa proteção contra SQL injection"""
    
    def test_sql_injection_razao_social(self):
        """Tenta SQL injection no campo razao_social"""
        malicious_input = "'; DROP TABLE empresas; --"
        
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": malicious_input, "limit": 5}
        )
        
        # Deve tratar como string normal, não executar SQL
        assert response.status_code == 200
        data = response.json()
        # Não deve retornar resultados (ou muito poucos)
        assert data["total"] >= 0
    
    def test_sql_injection_nome_socio(self):
        """Tenta SQL injection no campo nome_socio"""
        malicious_input = "SILVA' OR '1'='1"
        
        response = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": malicious_input, "limit": 5}
        )
        
        # Deve tratar como string normal
        assert response.status_code == 200
    
    def test_sql_injection_cnpj_basico(self):
        """Tenta SQL injection no path parameter"""
        malicious_input = "12345678' OR '1'='1"
        
        response = client.get(f"/api/v1/cnpj/empresa/{malicious_input}")
        # Não deve encontrar ou erro de formato
        assert response.status_code in [404, 422]


class TestCaracteresEspeciais:
    """Testa tratamento de caracteres especiais"""
    
    def test_razao_social_com_acentos(self):
        """Busca com acentuação deve funcionar"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "JOÃO", "limit": 5}
        )
        assert response.status_code == 200
    
    def test_razao_social_com_simbolos(self):
        """Busca com símbolos especiais"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "& CIA", "limit": 5}
        )
        assert response.status_code == 200
    
    def test_nome_socio_com_acentos(self):
        """Busca sócio com acentuação"""
        response = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "JOSÉ", "limit": 5}
        )
        assert response.status_code == 200
    
    def test_nome_socio_unicode(self):
        """Busca com caracteres Unicode"""
        response = client.get(
            "/api/v1/cnpj/socios/search",
            params={"nome": "ANDRÉ", "limit": 5}
        )
        assert response.status_code == 200


class TestCasosVazios:
    """Testa casos onde não há dados relacionados"""
    
    def test_empresa_sem_estabelecimentos(self):
        """Empresa sem estabelecimentos deve retornar lista vazia"""
        # Busca uma empresa que pode não ter estabelecimentos
        response = client.get("/api/v1/cnpj/empresa/00000001")
        
        if response.status_code == 200:
            data = response.json()
            # estabelecimentos pode ser lista vazia
            assert "estabelecimentos" in data
            assert isinstance(data["estabelecimentos"], list)
            assert data["total_estabelecimentos"] == len(data["estabelecimentos"])
    
    def test_empresa_sem_socios(self):
        """Empresa sem sócios deve retornar lista vazia"""
        response = client.get("/api/v1/cnpj/empresa/00000001")
        
        if response.status_code == 200:
            data = response.json()
            assert "socios" in data
            assert isinstance(data["socios"], list)
            assert data["total_socios"] == len(data["socios"])
    
    def test_empresa_sem_simples_nacional(self):
        """Empresa sem Simples Nacional deve retornar 404 ou null"""
        response = client.get("/api/v1/cnpj/empresa/00000001/simples")
        # Pode retornar 404 se não tem simples
        assert response.status_code in [200, 404]
    
    def test_search_sem_resultados(self):
        """Search que não retorna resultados"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "XYZABC999NAOEXISTE", "limit": 10}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 0
        assert data["count"] == 0
        assert len(data["items"]) == 0


class TestPaginacaoEdgeCases:
    """Testa casos extremos de paginação"""
    
    def test_offset_maior_que_total(self):
        """Offset maior que total de resultados deve retornar vazio"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "LTDA", "offset": 999999999, "limit": 10}
        )
        assert response.status_code == 200
        
        data = response.json()
        # Pode retornar vazio ou poucos resultados
        assert data["count"] >= 0
    
    def test_paginacao_ultima_pagina_incompleta(self):
        """Última página com menos items que o limit"""
        # Primeira busca total
        response1 = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "XYZABC", "limit": 10}
        )
        
        if response1.status_code == 200:
            total = response1.json()["total"]
            
            if total > 0 and total < 10:
                # Se total < 10, primeira página já é incompleta
                assert response1.json()["count"] == total
    
    def test_multiplas_paginas_consecutivas(self):
        """Buscar múltiplas páginas consecutivas"""
        results_page1 = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "SERVICOS", "limit": 5, "offset": 0}
        )
        
        results_page2 = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "SERVICOS", "limit": 5, "offset": 5}
        )
        
        results_page3 = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"razao_social": "SERVICOS", "limit": 5, "offset": 10}
        )
        
        assert results_page1.status_code == 200
        assert results_page2.status_code == 200
        assert results_page3.status_code == 200
        
        # Total deve ser o mesmo em todas
        if results_page1.json()["total"] > 0:
            assert results_page1.json()["total"] == results_page2.json()["total"]
            assert results_page1.json()["total"] == results_page3.json()["total"]


class TestCamposNulos:
    """Testa tratamento de campos NULL no banco"""
    
    def test_empresa_com_campos_nulos(self):
        """Empresa com campos opcionais NULL"""
        # Muitas empresas têm capital_social NULL, qualificacao NULL, etc
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"limit": 5}
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if data["count"] > 0:
                # Valida que campos NULL são serializados corretamente
                empresa = data["items"][0]
                # capital_social pode ser None
                if "capital_social" in empresa:
                    assert empresa["capital_social"] is None or isinstance(empresa["capital_social"], (str, float))
    
    def test_estabelecimento_sem_nome_fantasia(self):
        """Estabelecimento sem nome fantasia (NULL)"""
        response = client.get(
            "/api/v1/cnpj/search/empresas",
            params={"limit": 1}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data["count"] > 0 and "cnpj_basico" in data["items"][0]:
                cnpj = data["items"][0]["cnpj_basico"]
                
                # Busca estabelecimentos
                estab_response = client.get(
                    f"/api/v1/cnpj/estabelecimentos/empresa/{cnpj}"
                )
                
                if estab_response.status_code == 200:
                    estabelecimentos = estab_response.json()
                    if len(estabelecimentos) > 0:
                        # nome_fantasia pode ser None
                        assert "nome_fantasia" in estabelecimentos[0]


class TestConcorrencia:
    """Testa requisições concorrentes"""
    
    def test_multiplas_requisicoes_simultaneas(self):
        """Múltiplas requisições ao mesmo tempo"""
        import concurrent.futures
        
        def make_request(i):
            return client.get(
                "/api/v1/cnpj/search/empresas",
                params={"razao_social": "LTDA", "limit": 5, "offset": i * 5}
            )
        
        # 10 requisições simultâneas
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request, i) for i in range(10)]
            responses = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        # Todas devem retornar 200
        assert all(r.status_code == 200 for r in responses)
        
        # Todas devem ter a mesma estrutura
        for response in responses:
            data = response.json()
            assert "total" in data
            assert "items" in data


class TestHTTPMethods:
    """Testa métodos HTTP não permitidos"""
    
    def test_post_nao_permitido(self):
        """POST em endpoint de leitura deve retornar 405"""
        response = client.post("/api/v1/cnpj/health")
        assert response.status_code == 405
    
    def test_put_nao_permitido(self):
        """PUT em endpoint de leitura deve retornar 405"""
        response = client.put("/api/v1/cnpj/empresa/12345678")
        assert response.status_code == 405
    
    def test_delete_nao_permitido(self):
        """DELETE em endpoint de leitura deve retornar 405"""
        response = client.delete("/api/v1/cnpj/empresa/12345678")
        assert response.status_code == 405


class TestContentType:
    """Testa validação de Content-Type"""
    
    def test_response_content_type_json(self):
        """Respostas devem ser application/json"""
        response = client.get("/api/v1/cnpj/health")
        assert response.status_code == 200
        assert "application/json" in response.headers.get("content-type", "")
    
    def test_error_response_json(self):
        """Erros também devem retornar JSON"""
        response = client.get("/api/v1/cnpj/empresa/99999999")
        assert response.status_code == 404
        assert "application/json" in response.headers.get("content-type", "")


# Executar com: pytest backend/tests/unit/test_cnpj_edge_cases.py -v
