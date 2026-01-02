#!/bin/bash

# Test script para validar performance do Smart CNPJ Search
# Testa os 7 tipos de busca e mede tempo de resposta

API_URL="http://localhost:8000/api/v1/smart-cnpj/search"

echo "=== SMART CNPJ PERFORMANCE TEST ==="
echo "Target: <1000ms for all search types"
echo "Testing API: $API_URL"
echo ""

# Função para testar um tipo de busca
test_search() {
    local tipo="$1"
    local valor="$2"
    local descricao="$3"
    
    echo "Testing $descricao..."
    
    start_time=$(date +%s%3N)
    
    response=$(curl -s -w "HTTP_STATUS:%{http_code};TIME:%{time_total}" \
        -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"tipoBusca\": \"$tipo\",
            \"valorBusca\": \"$valor\",
            \"filtros\": {
                \"apenasMatriz\": false
            },
            \"page\": 1,
            \"limit\": 10
        }")
    
    end_time=$(date +%s%3N)
    total_time=$((end_time - start_time))
    
    http_status=$(echo "$response" | sed -n 's/.*HTTP_STATUS:\([0-9]*\).*/\1/p')
    curl_time=$(echo "$response" | sed -n 's/.*TIME:\([0-9.]*\).*/\1/p')
    response_body=$(echo "$response" | sed 's/HTTP_STATUS.*$//')
    
    # Converter curl time (segundos) para ms
    curl_time_ms=$(echo "$curl_time * 1000" | bc)
    
    if [ "$http_status" = "200" ]; then
        # Extrair contagem de resultados
        results_count=$(echo "$response_body" | jq -r '.data | length' 2>/dev/null || echo "N/A")
        echo "✅ $descricao: ${curl_time_ms}ms (${results_count} results)"
        
        # Verificar se está abaixo do target
        if (( $(echo "$curl_time_ms < 1000" | bc -l) )); then
            echo "   🎯 Target achieved!"
        else
            echo "   ⚠️  Above 1000ms target"
        fi
    else
        echo "❌ $descricao: HTTP $http_status"
        echo "   Response: $response_body"
    fi
    
    echo ""
    sleep 2  # Pausa entre testes
}

# Testar todos os 7 tipos de busca
echo "Starting performance tests..."
echo ""

# 1. CNPJ (era 39s)
test_search "CNPJ" "11222333" "CNPJ Search"

# 2. CEP (estava travando)  
test_search "CEP" "04038001" "CEP Search"

# 3. CNAE (era 1.2s)
test_search "CNAE" "6201-5" "CNAE Search"

# 4. EMAIL (era 35s)
test_search "EMAIL" "contato@" "Email Search"

# 5. TELEFONE (era 76s)
test_search "TELEFONE" "1155" "Telefone Search"

# 6. RAZAO_SOCIAL (já funcionava em 26ms)
test_search "RAZAO_SOCIAL" "LTDA" "Razão Social Search"

# 7. NOME_SOCIO (funcionava em 17ms)
test_search "NOME_SOCIO" "SILVA" "Nome Sócio Search"

echo "=== PERFORMANCE TEST COMPLETED ==="
echo "Check results above for target achievement (<1000ms)"