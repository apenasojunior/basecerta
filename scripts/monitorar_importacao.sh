#!/bin/bash
# Script para monitorar o progresso da importação CNPJ

echo "═══════════════════════════════════════════════════════════════════"
echo "  MONITOR DE IMPORTAÇÃO CNPJ - $(date '+%H:%M:%S')"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Última linha do log
echo "📝 ÚLTIMA ATIVIDADE:"
tail -1 backend/logs/reimport_completa.log
echo ""

# Contagem no banco
echo "📊 REGISTROS NO BANCO:"
psql -U dev4us -d basecerta --no-align -t -c "
SELECT 
    '  Empresas........: ' || TO_CHAR(COUNT(*), '999,999,999') || ' registros' 
FROM cnpj_brasil.empresas
UNION ALL
SELECT 
    '  Estabelecimentos: ' || TO_CHAR(COUNT(*), '999,999,999') || ' registros' 
FROM cnpj_brasil.estabelecimentos
UNION ALL
SELECT 
    '  Simples Nacional: ' || TO_CHAR(COUNT(*), '999,999,999') || ' registros' 
FROM cnpj_brasil.simples_nacional
UNION ALL
SELECT 
    '  Sócios..........: ' || TO_CHAR(COUNT(*), '999,999,999') || ' registros' 
FROM cnpj_brasil.socios;
"
echo ""

# Espaço em disco
echo "💾 ESPAÇO LIVRE: $(df -h / | tail -1 | awk '{print $4 " de " $2 " (" $5 " usado)"}')"
echo ""

# Tamanho do banco
echo "🗄️  TAMANHO DO BANCO:"
psql -U dev4us -d basecerta -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
" | grep -E 'empresas|estabelecimentos|simples|socios|rows'

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  Para acompanhar em tempo real: tail -f backend/logs/reimport_completa.log"
echo "═══════════════════════════════════════════════════════════════════"
