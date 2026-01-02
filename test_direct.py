import os
import subprocess
import sys

# Change to the correct directory
os.chdir('/workspaces/basecerta')

print("Current directory:", os.getcwd())
print("Files in directory:", os.listdir('.'))

# Test if we can import requests
try:
    import requests
    print("✅ requests library available")
except ImportError:
    print("❌ requests not available, installing...")
    subprocess.run([sys.executable, '-m', 'pip', 'install', 'requests'])
    import requests

# Now run a simple API test
import time

API_URL = "http://localhost:8000/api/v1/smart-cnpj/search"

print(f"\n=== TESTING {API_URL} ===")

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
    
    print(f"Response: HTTP {response.status_code} ({response_time_ms:.0f}ms)")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ API working - {len(data.get('data', []))} results")
        
        if response_time_ms < 1000:
            print("🎯 Performance target achieved!")
        else:
            print("⚠️ Still slow")
    else:
        print(f"❌ Error: {response.text[:200]}")
        
except Exception as e:
    print(f"❌ Connection error: {e}")
    print("Check if Docker container is running:")
    print("docker ps | grep basecerta")