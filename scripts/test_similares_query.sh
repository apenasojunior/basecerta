#!/bin/bash

# Script para testar performance da query de empresas similares
# Uso: ./test_similares_query.sh

set -e

echo "=================================="
echo "TESTE DE PERFORMANCE - Similares"
echo "=================================="
echo ""

CNPJ_TESTE="33345748000185"
CNAE="4781400"

echo "1️⃣  Testando query de agregação (deve ser <50ms)..."
echo ""

time PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta -c "
SELECT 
    uf,
    COUNT(*) as total_empresas
FROM cnpj.estabelecimentos
WHERE cnae_fiscal_principal = '$CNAE'
  AND situacao_cadastral = '02'
  AND uf IS NOT NULL
GROUP BY uf
ORDER BY COUNT(*) DESC
LIMIT 5;
"

echo ""
echo "2️⃣  Testando query de TOP empresa SP (deve ser <100ms)..."
echo ""

time PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta -c "
SELECT 
    est.cnpj_basico,
    est.cnpj_ordem,
    est.cnpj_dv,
    emp.razao_social,
    emp.capital_social
FROM cnpj.estabelecimentos est
JOIN cnpj.empresas emp ON est.cnpj_basico = emp.cnpj_basico
WHERE est.cnae_fiscal_principal = '$CNAE'
  AND est.situacao_cadastral = '02'
  AND est.uf = 'SP'
ORDER BY emp.capital_social DESC NULLS LAST
LIMIT 1;
"

echo ""
echo "3️⃣  Testando endpoint completo..."
echo ""

time curl -s http://localhost:8000/api/v1/smart-cnpj/similares/$CNPJ_TESTE | jq -r '
.total_estados,
.total_empresas_similares,
.rankings_por_estado[0] | "\(.uf) - \(.total_empresas) empresas - Top: \(.top_empresa.razao_social)"
'

echo ""
echo "=================================="
echo "✅ Testes concluídos!"
echo "=================================="
