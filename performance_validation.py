#!/usr/bin/env python3
"""
Comprehensive Performance Validation for Smart CNPJ Search API
Tests all search types and measures actual response times
"""

import requests
import time
import json
import sys
from datetime import datetime

# API Configuration
API_URL = "http://localhost:8000/api/v1/smart-cnpj/search"
HEALTH_URL = "http://localhost:8000/health"

# Test cases with previous performance baselines
TEST_CASES = [
    {
        "name": "CNPJ Search",
        "tipo": "CNPJ",
        "valor": "11222333",
        "previous_time": 39000,  # 39 seconds
        "description": "CNPJ partial match"
    },
    {
        "name": "CEP Search", 
        "tipo": "CEP",
        "valor": "04038001",
        "previous_time": None,  # Timed out previously
        "description": "CEP exact match"
    },
    {
        "name": "CNAE Search",
        "tipo": "CNAE", 
        "valor": "6201-5",
        "previous_time": 1200,  # 1.2 seconds
        "description": "CNAE code search"
    },
    {
        "name": "Email Search",
        "tipo": "EMAIL",
        "valor": "contato@",
        "previous_time": 35000,  # 35 seconds
        "description": "Email partial match"
    },
    {
        "name": "Telefone Search",
        "tipo": "TELEFONE",
        "valor": "1155",
        "previous_time": 76000,  # 76 seconds
        "description": "Phone number partial match"
    },
    {
        "name": "Razão Social Search",
        "tipo": "RAZAO_SOCIAL", 
        "valor": "LTDA",
        "previous_time": 26,  # 26ms - already good
        "description": "Company name search"
    },
    {
        "name": "Nome Sócio Search",
        "tipo": "NOME_SOCIO",
        "valor": "SILVA", 
        "previous_time": 17,  # 17ms - already good
        "description": "Partner name search"
    }
]

TARGET_TIME_MS = 1000  # Target: under 1000ms
OPTIMAL_TIME_MS = 200  # Optimal: under 200ms

def check_api_health():
    """Check if API is accessible"""
    try:
        response = requests.get(HEALTH_URL, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"❌ API Health Check Failed: {e}")
        return False

def run_performance_test(test_case):
    """Run a single performance test case"""
    print(f"\n🔍 Testing {test_case['name']}...")
    print(f"   Type: {test_case['tipo']}, Value: {test_case['valor']}")
    
    payload = {
        "tipoBusca": test_case["tipo"],
        "valorBusca": test_case["valor"],
        "filtros": {
            "apenasMatriz": False
        },
        "page": 1,
        "limit": 10
    }
    
    try:
        # Measure actual response time
        start_time = time.time()
        response = requests.post(
            API_URL,
            json=payload,
            timeout=120,  # 2 minute timeout
            headers={"Content-Type": "application/json"}
        )
        end_time = time.time()
        
        response_time_ms = (end_time - start_time) * 1000
        
        result = {
            "name": test_case["name"],
            "status": "success" if response.status_code == 200 else "error",
            "http_status": response.status_code,
            "response_time_ms": round(response_time_ms, 2),
            "previous_time_ms": test_case["previous_time"],
            "target_achieved": response_time_ms < TARGET_TIME_MS,
            "optimal_achieved": response_time_ms < OPTIMAL_TIME_MS,
            "results_count": None,
            "error_message": None
        }
        
        if response.status_code == 200:
            try:
                data = response.json()
                if 'data' in data and isinstance(data['data'], list):
                    result["results_count"] = len(data['data'])
                print(f"   ✅ Success: {response_time_ms:.2f}ms ({result['results_count']} results)")
            except Exception as e:
                print(f"   ⚠️  Response parsing error: {e}")
                result["error_message"] = f"Response parsing error: {e}"
        else:
            result["error_message"] = f"HTTP {response.status_code}"
            print(f"   ❌ Failed: HTTP {response.status_code}")
            try:
                error_text = response.text[:200]
                print(f"   Error details: {error_text}")
                result["error_message"] += f" - {error_text}"
            except:
                pass
        
        # Performance evaluation
        if result["status"] == "success":
            if result["target_achieved"]:
                if result["optimal_achieved"]:
                    print("   🎯🚀 Optimal performance achieved!")
                else:
                    print("   🎯 Target achieved!")
            else:
                print("   ⚠️  Above 1000ms target")
            
            # Improvement factor
            if result["previous_time_ms"]:
                improvement = result["previous_time_ms"] / response_time_ms
                print(f"   📈 Improvement: {improvement:.1f}x faster than previous {result['previous_time_ms']}ms")
            elif test_case["previous_time"] is None:
                print("   📈 Previously timed out - now working!")
        
        return result
        
    except requests.Timeout:
        print(f"   ❌ Timeout (>120s)")
        return {
            "name": test_case["name"],
            "status": "timeout",
            "response_time_ms": None,
            "error_message": "Request timeout (>120s)"
        }
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return {
            "name": test_case["name"], 
            "status": "error",
            "response_time_ms": None,
            "error_message": str(e)
        }

def generate_performance_report(results):
    """Generate detailed performance report"""
    print("\n" + "="*80)
    print("📊 SMART CNPJ SEARCH - PERFORMANCE VALIDATION REPORT")
    print("="*80)
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🎯 Target: All searches under {TARGET_TIME_MS}ms")
    print(f"🚀 Optimal: All searches under {OPTIMAL_TIME_MS}ms")
    print()
    
    successful_tests = [r for r in results if r["status"] == "success"]
    target_achieved = [r for r in successful_tests if r.get("target_achieved", False)]
    optimal_achieved = [r for r in successful_tests if r.get("optimal_achieved", False)]
    
    print(f"📈 SUMMARY:")
    print(f"   • Total tests: {len(results)}")
    print(f"   • Successful: {len(successful_tests)}")
    print(f"   • Target achieved (<{TARGET_TIME_MS}ms): {len(target_achieved)}")
    print(f"   • Optimal achieved (<{OPTIMAL_TIME_MS}ms): {len(optimal_achieved)}")
    print()
    
    print("🔍 DETAILED RESULTS:")
    print("-" * 80)
    
    for result in results:
        name = result["name"]
        status = result["status"]
        
        if status == "success":
            time_ms = result["response_time_ms"]
            count = result.get("results_count", "N/A")
            target_icon = "🎯" if result.get("target_achieved") else "⚠️ "
            optimal_icon = "🚀" if result.get("optimal_achieved") else ""
            
            print(f"   {target_icon}{optimal_icon} {name:<25} {time_ms:>8.2f}ms ({count} results)")
            
            if result.get("previous_time_ms"):
                prev_time = result["previous_time_ms"]
                improvement = prev_time / time_ms
                print(f"      └─ Previous: {prev_time}ms → Improvement: {improvement:.1f}x")
        else:
            print(f"   ❌ {name:<25} {status.upper()}")
            if result.get("error_message"):
                print(f"      └─ Error: {result['error_message']}")
    
    print()
    print("🏆 OPTIMIZATION ASSESSMENT:")
    
    if len(successful_tests) == len(results):
        if len(optimal_achieved) == len(results):
            print("   🥇 EXCELLENT: All searches achieve optimal performance (<200ms)")
        elif len(target_achieved) == len(results):
            print("   🥈 VERY GOOD: All searches achieve target performance (<1000ms)")
        else:
            print("   🥉 GOOD: Most searches working but some need further optimization")
    else:
        failed_tests = [r for r in results if r["status"] != "success"]
        print(f"   🔧 NEEDS ATTENTION: {len(failed_tests)} tests failed or timed out")
        for test in failed_tests:
            print(f"      • {test['name']}: {test.get('error_message', 'Unknown error')}")
    
    print()
    if len(successful_tests) > 0:
        avg_time = sum(r["response_time_ms"] for r in successful_tests) / len(successful_tests)
        print(f"📊 Average Response Time: {avg_time:.2f}ms")
    
    print("="*80)

def main():
    """Main execution function"""
    print("🚀 Starting Smart CNPJ Search Performance Validation")
    print("="*60)
    
    # Check API health
    print("🔍 Checking API health...")
    if not check_api_health():
        print("❌ API is not accessible. Please ensure Docker containers are running:")
        print("   docker-compose up -d")
        print("   ./start.sh")
        sys.exit(1)
    
    print("✅ API is accessible")
    
    # Run all performance tests
    print(f"\n🧪 Running {len(TEST_CASES)} performance tests...")
    results = []
    
    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"\n[{i}/{len(TEST_CASES)}]", end="")
        result = run_performance_test(test_case)
        results.append(result)
        
        # Small delay between tests to avoid overwhelming the API
        if i < len(TEST_CASES):
            time.sleep(1)
    
    # Generate report
    generate_performance_report(results)
    
    # Exit with appropriate code
    successful_tests = [r for r in results if r["status"] == "success"]
    if len(successful_tests) == len(results):
        target_achieved = [r for r in successful_tests if r.get("target_achieved", False)]
        if len(target_achieved) == len(results):
            print("🎉 All performance targets achieved!")
            sys.exit(0)
        else:
            print("⚠️  Some tests exceed performance targets")
            sys.exit(1)
    else:
        print("❌ Some tests failed or timed out")
        sys.exit(1)

if __name__ == "__main__":
    main()