#!/usr/bin/env python3
"""
Smart CNPJ Performance Test Script
Validates API performance for all 7 search types
Target: <1000ms per search
"""

import requests
import time
import json
from typing import Dict, Any

API_URL = "http://localhost:8000/api/v1/smart-cnpj/search"

def test_search(tipo: str, valor: str, descricao: str) -> Dict[str, Any]:
    """Test a specific search type and measure performance"""
    
    print(f"Testing {descricao}...")
    
    payload = {
        "tipoBusca": tipo,
        "valorBusca": valor,
        "filtros": {
            "apenasMatriz": False
        },
        "page": 1,
        "limit": 10
    }
    
    try:
        start_time = time.time()
        response = requests.post(API_URL, json=payload, timeout=120)
        end_time = time.time()
        
        response_time_ms = (end_time - start_time) * 1000
        
        if response.status_code == 200:
            data = response.json()
            results_count = len(data.get('data', []))
            
            print(f"✅ {descricao}: {response_time_ms:.0f}ms ({results_count} results)")
            
            if response_time_ms < 1000:
                print("   🎯 Target achieved!")
                target_achieved = True
            else:
                print("   ⚠️  Above 1000ms target")
                target_achieved = False
                
            return {
                'success': True,
                'response_time_ms': response_time_ms,
                'results_count': results_count,
                'target_achieved': target_achieved
            }
        else:
            print(f"❌ {descricao}: HTTP {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return {
                'success': False,
                'status_code': response.status_code,
                'response_time_ms': response_time_ms
            }
            
    except Exception as e:
        print(f"❌ {descricao}: ERROR - {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }
    
    print()
    time.sleep(2)  # Pause between tests

def main():
    """Run all performance tests"""
    
    print("=== SMART CNPJ PERFORMANCE TEST ===")
    print("Target: <1000ms for all search types")
    print(f"Testing API: {API_URL}")
    print()
    
    # Test cases mapping the original performance issues
    test_cases = [
        ("CNPJ", "11222333", "CNPJ Search (was 39s)"),
        ("CEP", "04038001", "CEP Search (was hanging)"),
        ("CNAE", "6201-5", "CNAE Search (was 1.2s)"),
        ("EMAIL", "contato@", "Email Search (was 35s)"),
        ("TELEFONE", "1155", "Telefone Search (was 76s)"),
        ("RAZAO_SOCIAL", "LTDA", "Razão Social Search (was 26ms)"),
        ("NOME_SOCIO", "SILVA", "Nome Sócio Search (was 17ms)")
    ]
    
    print("Starting performance tests...")
    print()
    
    results = []
    
    for tipo, valor, descricao in test_cases:
        result = test_search(tipo, valor, descricao)
        result['test_type'] = tipo
        result['description'] = descricao
        results.append(result)
    
    # Summary
    print("=== PERFORMANCE TEST SUMMARY ===")
    
    successful_tests = [r for r in results if r.get('success', False)]
    target_achieved_tests = [r for r in successful_tests if r.get('target_achieved', False)]
    
    print(f"Successful tests: {len(successful_tests)}/{len(results)}")
    print(f"Target achieved (<1000ms): {len(target_achieved_tests)}/{len(successful_tests)}")
    print()
    
    if successful_tests:
        print("Performance Results:")
        for result in successful_tests:
            response_time = result.get('response_time_ms', 0)
            target_icon = "🎯" if result.get('target_achieved', False) else "⚠️"
            print(f"  {target_icon} {result['test_type']}: {response_time:.0f}ms")
    
    failed_tests = [r for r in results if not r.get('success', False)]
    if failed_tests:
        print()
        print("Failed Tests:")
        for result in failed_tests:
            print(f"  ❌ {result['test_type']}: {result.get('error', result.get('status_code', 'Unknown error'))}")
    
    print()
    
    # Overall assessment
    if len(target_achieved_tests) == len(successful_tests) == len(results):
        print("🏆 ALL TESTS PASSED - OPTIMIZATION SUCCESSFUL!")
    elif len(target_achieved_tests) > len(successful_tests) * 0.7:
        print("✅ OPTIMIZATION MOSTLY SUCCESSFUL - Minor issues remain")
    else:
        print("❌ OPTIMIZATION NEEDS WORK - Several tests failed or exceeded target")

if __name__ == "__main__":
    main()