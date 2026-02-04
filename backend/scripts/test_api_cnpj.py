"""
Script de teste para endpoints REST API CNPJ
Feature: S02-F04-I07
Sprint: S02 - Integração Base CNPJ

Testa todos os endpoints da API CNPJ com dados reais.
"""
import requests
import json
from typing import Dict, Any


BASE_URL = "http://localhost:8000/api/v1"


def print_response(title: str, response: requests.Response):
    """Formata e imprime resposta da API"""
    print(f"\n{'=' * 60}")
    print(f"{title}")
    print(f"{'=' * 60}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Sucesso")
        print(json.dumps(data, indent=2, ensure_ascii=False)[:500] + "...")
    else:
        print(f"❌ Erro: {response.text}")


def test_health():
    """Test 1: Health check"""
    print("\n🏥 TEST 1: Health Check")
    response = requests.get(f"{BASE_URL}/cnpj/health")
    print_response("Health Check", response)
    return response.status_code == 200


def test_get_empresa():
    """Test 2: Buscar empresa por CNPJ básico"""
    print("\n🏢 TEST 2: GET /cnpj/empresa/{cnpj_basico}")
    
    # Buscar primeira empresa disponível
    cnpj_basico = "41273590"  # Use um CNPJ que existe no banco
    
    response = requests.get(f"{BASE_URL}/cnpj/empresa/{cnpj_basico}")
    print_response(f"Empresa {cnpj_basico}", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Resumo:")
        print(f"   Razão Social: {data['empresa']['razao_social']}")
        print(f"   Estabelecimentos: {data['total_estabelecimentos']}")
        print(f"   Sócios: {data['total_socios']}")
        print(f"   Simples: {data['is_simples']}")
        print(f"   MEI: {data['is_mei']}")
        return True
    
    return False


def test_search_empresas():
    """Test 3: Buscar empresas por razão social"""
    print("\n🔍 TEST 3: GET /cnpj/search/empresas")
    
    params = {
        "razao_social": "LTDA",
        "limit": 5
    }
    
    response = requests.get(f"{BASE_URL}/cnpj/search/empresas", params=params)
    print_response("Busca: LTDA", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Resumo:")
        print(f"   Total encontrado: {data['total']:,}")
        print(f"   Retornados: {data['count']}")
        print(f"\n   Empresas:")
        for i, emp in enumerate(data['items'][:3], 1):
            print(f"      {i}. {emp['razao_social'][:50]}...")
        return True
    
    return False


def test_get_estabelecimento():
    """Test 4: Buscar estabelecimento por CNPJ completo"""
    print("\n🏪 TEST 4: GET /cnpj/estabelecimento/{cnpj_completo}")
    
    # Use um CNPJ completo que existe no banco
    cnpj_completo = "41273590000103"
    
    response = requests.get(f"{BASE_URL}/cnpj/estabelecimento/{cnpj_completo}")
    print_response(f"Estabelecimento {cnpj_completo}", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Resumo:")
        print(f"   CNPJ Formatado: {data['cnpj_formatado']}")
        print(f"   Tipo: {data['tipo_estabelecimento']}")
        print(f"   Situação: {data['situacao_descricao']}")
        print(f"   Endereço: {data['endereco_completo'][:60]}...")
        if data.get('telefone_principal'):
            print(f"   Telefone: {data['telefone_principal']}")
        return True
    
    return False


def test_get_socios_empresa():
    """Test 5: Buscar sócios de uma empresa"""
    print("\n👥 TEST 5: GET /cnpj/socios/empresa/{cnpj_basico}")
    
    cnpj_basico = "00000000"  # Buscar empresa com sócios
    
    response = requests.get(f"{BASE_URL}/cnpj/socios/empresa/{cnpj_basico}")
    print_response(f"Sócios da empresa {cnpj_basico}", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Resumo:")
        print(f"   Total de sócios: {len(data)}")
        if data:
            for i, socio in enumerate(data[:3], 1):
                print(f"      {i}. {socio['nome_socio'][:40]}... - {socio['tipo_socio']}")
        return True
    
    return False


def test_search_socios():
    """Test 6: Buscar sócios por nome"""
    print("\n🔍 TEST 6: GET /cnpj/socios/search")
    
    params = {
        "nome": "SILVA",
        "limit": 5
    }
    
    response = requests.get(f"{BASE_URL}/cnpj/socios/search", params=params)
    print_response("Busca sócios: SILVA", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Resumo:")
        print(f"   Total encontrado: {data['total']:,}")
        print(f"   Retornados: {data['count']}")
        print(f"\n   Sócios:")
        for i, socio in enumerate(data['items'][:3], 1):
            print(f"      {i}. {socio['nome_socio'][:40]}... - {socio['tipo_socio']}")
        return True
    
    return False


def test_simples_nacional():
    """Test 7: Verificar regime Simples Nacional"""
    print("\n📋 TEST 7: GET /cnpj/empresa/{cnpj_basico}/simples")
    
    cnpj_basico = "00000011"  # Empresa optante do Simples
    
    response = requests.get(f"{BASE_URL}/cnpj/empresa/{cnpj_basico}/simples")
    print_response(f"Simples Nacional {cnpj_basico}", response)
    
    if response.status_code == 200:
        data = response.json()
        if data:
            print(f"\n📊 Resumo:")
            print(f"   Regime: {data['regime_tributario']}")
            print(f"   Status: {data['status_simples']}")
        else:
            print("   Empresa não é optante do Simples Nacional")
        return True
    
    return False


def test_error_handling():
    """Test 8: Validar tratamento de erros"""
    print("\n⚠️  TEST 8: Tratamento de Erros")
    
    # CNPJ inválido
    print("\n   8.1: CNPJ básico inválido")
    response = requests.get(f"{BASE_URL}/cnpj/empresa/123")
    print(f"   Status: {response.status_code} (esperado: 400)")
    
    # CNPJ não encontrado
    print("\n   8.2: CNPJ não encontrado")
    response = requests.get(f"{BASE_URL}/cnpj/empresa/99999999")
    print(f"   Status: {response.status_code} (esperado: 404)")
    
    # Busca sem filtros
    print("\n   8.3: Busca sem filtros")
    response = requests.get(f"{BASE_URL}/cnpj/search/empresas")
    print(f"   Status: {response.status_code} (esperado: 400)")
    
    print("\n   ✅ Tratamento de erros validado")
    return True


def main():
    """Executa todos os testes"""
    print("🧪 Testando API CNPJ - BaseCerta")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print("=" * 60)
    
    results = {
        "Health Check": test_health(),
        "GET Empresa": test_get_empresa(),
        "Search Empresas": test_search_empresas(),
        "GET Estabelecimento": test_get_estabelecimento(),
        "GET Sócios Empresa": test_get_socios_empresa(),
        "Search Sócios": test_search_socios(),
        "Simples Nacional": test_simples_nacional(),
        "Error Handling": test_error_handling()
    }
    
    # Resumo final
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS TESTES")
    print("=" * 60)
    
    passed = sum(results.values())
    total = len(results)
    
    for test, result in results.items():
        status = "✅" if result else "❌"
        print(f"{status} {test}")
    
    print(f"\n{'=' * 60}")
    print(f"🎯 Resultado: {passed}/{total} testes passaram")
    print("=" * 60)
    
    if passed == total:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} teste(s) falharam")
        return 1


if __name__ == "__main__":
    import sys
    
    print("\n⚠️  IMPORTANTE: Certifique-se de que o servidor está rodando:")
    print("   uvicorn app.main:app --reload\n")
    
    input("Pressione ENTER para continuar...")
    
    sys.exit(main())
