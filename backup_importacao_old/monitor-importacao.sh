#!/bin/bash
# Monitor de importação Simples e Sócios

clear
echo "═══════════════════════════════════════════════════════════════"
echo "  MONITOR DE IMPORTAÇÃO - SIMPLES NACIONAL E SÓCIOS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

while true; do
    # Timestamp
    echo "🕐 $(date '+%H:%M:%S')"
    echo ""
    
    # Contadores no banco
    echo "📊 REGISTROS NO BANCO:"
    psql -U dev4us -d basecerta --no-align -t -c "
    SELECT '  Simples: ' || TO_CHAR(COUNT(*), '999,999,999') FROM cnpj_brasil.simples_nacional
    UNION ALL
    SELECT '  Sócios.: ' || TO_CHAR(COUNT(*), '999,999,999') FROM cnpj_brasil.socios;
    "
    echo ""
    
    # Última linha do log
    echo "📝 ÚLTIMA ATIVIDADE:"
    tail -1 backend/logs/import_simples_socios_final.log 2>/dev/null || echo "  Aguardando..."
    echo ""
    
    # Espaço em disco
    echo "💾 DISCO: $(df -h / | tail -1 | awk '{print $4 " livres de " $2}')"
    echo ""
    echo "───────────────────────────────────────────────────────────────"
    
    sleep 10
    clear
    echo "═══════════════════════════════════════════════════════════════"
    echo "  MONITOR DE IMPORTAÇÃO - SIMPLES NACIONAL E SÓCIOS"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
done
