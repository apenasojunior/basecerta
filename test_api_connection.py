#!/usr/bin/env python3
"""
Quick API Connection Test
"""

import requests
import time
import sys

API_URL = "http://localhost:8000/api/v1/smart-cnpj/search"

def test_api_connection():
    print("=== TESTING API CONNECTION ===")
    print(f"Connecting to: {API_URL}")
    
    try:
        start_time = time.time()
        response = requests.post(API_URL, json={
            "tipoBusca": "CNPJ",
            "valorBusca": "11222333",
            "filtros": {"apenasMatriz": False},
            "page": 1,
            "limit": 1
        }, timeout=30)
        end_time = time.time()
        
        response_time_ms = (end_time - start_time) * 1000
        
        print(f"Connection test: HTTP {response.status_code} ({response_time_ms:.0f}ms)")
        
        if response.status_code == 200:
            data = response.json()
            results_count = len(data.get('data', []))
            print(f"✅ API is responding - got {results_count} results")
            return True
        else:
            print(f"❌ API error: {response.text[:300]}...")
            return False
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection failed: {e}")
        print("\nMake sure Docker container is running:")
        print("docker ps | grep basecerta_backend")
        print("docker start basecerta_backend")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    if test_api_connection():
        print("\n✅ Ready to run full performance test!")
        print("Run: /usr/bin/python3 test_smart_cnpj_performance.py")
    else:
        print("\n❌ Fix API connection first")
        sys.exit(1)