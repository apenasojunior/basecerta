#!/bin/bash
# Monitor de importação em tempo real - Versão Live

LOG_FILE="/Users/code4us/Documents/ADACODE/basecerta/backend/logs/import_simples_socios_final.log"
PG_LOG="/opt/homebrew/var/postgresql@17/log/postgresql-2026-01-15.log"

echo "═══════════════════════════════════════════════════════════════"
echo "  MONITOR DE IMPORTAÇÃO - SIMPLES NACIONAL E SÓCIOS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Log: $LOG_FILE"
echo "Atualização: a cada 15 segundos"
echo ""
echo "Pressione Ctrl+C para sair"
echo "═══════════════════════════════════════════════════════════════"
echo ""

while true; do
    clear
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🔄 IMPORTAÇÃO SIMPLES + SÓCIOS - $(date '+%H:%M:%S')"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    # Contadores no banco
    echo "📊 REGISTROS NO BANCO:"
    psql -U dev4us -d basecerta --no-align -t -c "
    SELECT '  Simples: ' || TO_CHAR(COUNT(*), '999,999,999') || ' de 46,180,709' FROM cnpj_brasil.simples_nacional
    UNION ALL
    SELECT '  Sócios.: ' || TO_CHAR(COUNT(*), '999,999,999') || ' de 26,806,352' FROM cnpj_brasil.socios;
    " 2>/dev/null || echo "  Erro ao conectar no banco"
    echo ""
    
    # Última linha do log de importação
    echo "📝 ÚLTIMA ATIVIDADE:"
    tail -1 "$LOG_FILE" 2>/dev/null | sed 's/^/  /' || echo "  Aguardando início..."
    echo ""
    
    # Tamanho do log PostgreSQL
    LOG_SIZE=$(du -sh "$PG_LOG" 2>/dev/null | awk '{print $1}')
    echo "📋 LOG PostgreSQL: $LOG_SIZE"
    
    # Espaço em disco
    DISK_INFO=$(df -h / | tail -1 | awk '{print $4 " livres de " $2 " (" $5 " usado)"}')
    echo "💾 DISCO: $DISK_INFO"
    
    # Verificar se processo ainda está rodando
    PROCESS_COUNT=$(ps aux | grep -c "import_simples_socios" | grep -v grep)
    if [ "$PROCESS_COUNT" -gt 0 ]; then
        echo "✅ STATUS: Importação em andamento"
    else
        echo "⚠️  STATUS: Processo não encontrado (pode ter finalizado)"
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  Próxima atualização em 15 segundos..."
    echo "═══════════════════════════════════════════════════════════════"
    
    sleep 15
done
