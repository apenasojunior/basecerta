#!/bin/bash
#
# Monitor Inteligente de Importação CNPJ com Checkpoints
# Mostra progresso detalhado por arquivo e estimativa de conclusão
#

VERSAO="${1:-2025-12}"
INTERVALO="${2:-10}"  # segundos entre atualizações

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function get_checkpoint_status() {
    psql -U code4us -d basecerta -t -A -F'|' << EOF
SELECT 
    tabela,
    COUNT(*) FILTER (WHERE status = 'completed') as completados,
    COUNT(*) FILTER (WHERE status = 'processing') as processando,
    COUNT(*) FILTER (WHERE status = 'failed') as falhados,
    COUNT(*) as total,
    COALESCE(SUM(registros_processados), 0) as total_registros
FROM cnpj_brasil.import_checkpoints
WHERE versao = '$VERSAO'
GROUP BY tabela
ORDER BY tabela;
EOF
}

function get_db_stats() {
    psql -U aian_db -d basecerta -t -A -F'|' << EOF
SELECT 'empresas' as tabela, COUNT(*) as count FROM cnpj_brasil.empresas
UNION ALL
SELECT 'estabelecimentos', COUNT(*) FROM cnpj_brasil.estabelecimentos
UNION ALL
SELECT 'simples', COUNT(*) FROM cnpj_brasil.simples_nacional
UNION ALL
SELECT 'socios', COUNT(*) FROM cnpj_brasil.socios;
EOF
}

function get_last_checkpoint() {
    psql -U code4us -d basecerta -t -A << EOF
SELECT 
    tabela || ': ' || arquivo || ' (' || 
    CASE 
        WHEN status = 'completed' THEN 'concluído'
        WHEN status = 'processing' THEN 'processando'
        WHEN status = 'failed' THEN 'ERRO'
    END || ')'
FROM cnpj_brasil.import_checkpoints
WHERE versao = '$VERSAO'
ORDER BY data_inicio DESC
LIMIT 1;
EOF
}

function check_process() {
    ps aux | grep -q "[i]mport_cnpj.py.*$VERSAO"
}

function get_db_size() {
    psql -U aian_db -d basecerta -t -A -c "SELECT pg_size_pretty(pg_database_size('basecerta'));"
}

function get_active_query() {
    psql -U aian_db -d basecerta -t -A << EOF
SELECT COALESCE(
    LEFT(query, 100),
    'Nenhuma query ativa'
)
FROM pg_stat_activity 
WHERE datname = 'basecerta' 
  AND state = 'active' 
  AND query NOT LIKE '%pg_stat_activity%'
  AND query NOT LIKE '%import_checkpoints%'
LIMIT 1;
EOF
}

function format_number() {
    printf "%'d" $1 2>/dev/null || echo $1
}

clear
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     MONITOR INTELIGENTE - IMPORTAÇÃO CNPJ COM CHECKPOINTS       ║${NC}"
echo -e "${BLUE}║                    Versão: $VERSAO                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"

ITERACAO=1

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Verificar processo
    if check_process; then
        STATUS_PROCESSO="${GREEN}●${NC} RODANDO"
    else
        STATUS_PROCESSO="${RED}●${NC} PARADO"
    fi
    
    # Posicionar cursor no topo
    tput cup 4 0
    
    echo -e "═══════════════════════════════════════════════════════════════════"
    echo -e "⏰ $TIMESTAMP | Atualização #$ITERACAO | Processo: $STATUS_PROCESSO"
    echo -e "═══════════════════════════════════════════════════════════════════"
    echo ""
    
    # Progresso por checkpoints
    echo -e "${YELLOW}📋 PROGRESSO POR TABELA (CHECKPOINTS):${NC}"
    echo "───────────────────────────────────────────────────────────────────"
    printf "%-20s %12s %12s %8s %8s %15s\n" "Tabela" "Completos" "Processando" "Erros" "Total" "Registros"
    echo "───────────────────────────────────────────────────────────────────"
    
    if get_checkpoint_status | grep -q .; then
        while IFS='|' read -r tabela completos processando falhas total registros; do
            if [ ! -z "$tabela" ]; then
                pct=$((completos * 100 / total))
                registros_fmt=$(format_number $registros)
                
                if [ $pct -eq 100 ]; then
                    cor=$GREEN
                elif [ $pct -gt 50 ]; then
                    cor=$YELLOW
                else
                    cor=$NC
                fi
                
                printf "${cor}%-20s %12s %12s %8s %8s %15s${NC}\n" \
                    "$tabela" "$completos/$total" "$processando" "$falhas" "($pct%)" "$registros_fmt"
            fi
        done < <(get_checkpoint_status)
    else
        echo "  Nenhum checkpoint registrado ainda..."
    fi
    
    echo ""
    echo -e "${YELLOW}💾 REGISTROS NO BANCO:${NC}"
    echo "───────────────────────────────────────────────────────────────────"
    
    while IFS='|' read -r tabela count; do
        if [ ! -z "$tabela" ]; then
            count_fmt=$(format_number $count)
            printf "%-20s: %15s registros\n" "  $tabela" "$count_fmt"
        fi
    done < <(get_db_stats)
    
    echo ""
    echo -e "${YELLOW}📊 INFORMAÇÕES DO SISTEMA:${NC}"
    echo "───────────────────────────────────────────────────────────────────"
    
    DB_SIZE=$(get_db_size)
    echo "  Tamanho do banco: $DB_SIZE"
    
    LAST_CHECKPOINT=$(get_last_checkpoint)
    if [ ! -z "$LAST_CHECKPOINT" ]; then
        echo "  Último checkpoint: $LAST_CHECKPOINT"
    fi
    
    QUERY=$(get_active_query)
    if [ ! -z "$QUERY" ] && [ "$QUERY" != "Nenhuma query ativa" ]; then
        echo "  Query ativa: ${QUERY:0:60}..."
    else
        echo "  Query ativa: Aguardando próximo batch..."
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════════"
    echo -e "${BLUE}↻ Próxima atualização em ${INTERVALO}s | Pressione Ctrl+C para sair${NC}"
    echo ""
    
    ITERACAO=$((ITERACAO + 1))
    sleep $INTERVALO
done
