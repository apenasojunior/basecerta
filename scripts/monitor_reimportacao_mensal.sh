#!/bin/bash

# Monitor de Reimportação Mensal CNPJ
# Compara versões e mostra apenas arquivos alterados
# Uso: ./monitor_reimportacao_mensal.sh [versao_nova] [versao_anterior] [intervalo]
# Exemplo: ./monitor_reimportacao_mensal.sh 2026-01 2025-12 5

# Configuração
VERSAO_NOVA="${1}"
VERSAO_ANTERIOR="${2:-auto}"
INTERVALO="${3:-5}"
DB_NAME="basecerta"
DB_USER="code4us"

# Detectar versão anterior automaticamente se não fornecida
if [ "$VERSAO_ANTERIOR" = "auto" ]; then
    VERSAO_ANTERIOR=$(psql -U $DB_USER -d $DB_NAME -t -A -c "
        SELECT versao 
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao != '$VERSAO_NOVA'
        ORDER BY versao DESC 
        LIMIT 1;
    " 2>/dev/null)
fi

if [ -z "$VERSAO_NOVA" ]; then
    echo "Uso: $0 <versao_nova> [versao_anterior] [intervalo]"
    echo "Exemplo: $0 2026-01 2025-12 5"
    exit 1
fi

# Cores
RESET='\033[0m'
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'

# Símbolos
CHECK="✅"
PROCESS="🔄"
CLOCK="⏱️"
ROCKET="🚀"
CHART="📊"
CALENDAR="📅"
DIFF="🔄"
NEW="🆕"
UPDATE="🔁"

# Função para desenhar barra de progresso
draw_progress_bar() {
    local current=$1
    local total=$2
    local width=40
    local percentage=0
    
    if [ $total -gt 0 ]; then
        percentage=$((current * 100 / total))
        local filled=$((current * width / total))
        local empty=$((width - filled))
        
        printf "${CYAN}["
        printf "%${filled}s" | tr ' ' '█'
        printf "%${empty}s" | tr ' ' '░'
        printf "]${RESET} ${BOLD}%3d%%${RESET}" $percentage
    else
        printf "${CYAN}[%${width}s]${RESET} ${BOLD}  0%%${RESET}" | tr ' ' '░'
    fi
}

# Função para formatar números
format_number() {
    local num=$1
    if [ -z "$num" ]; then
        echo "0"
        return
    fi
    printf "%'d" $num 2>/dev/null || echo $num
}

# Função para formatar duração
format_duration() {
    local seconds=$1
    if [ -z "$seconds" ] || [ "$seconds" = "0" ]; then
        echo "calculando..."
        return
    fi
    
    local hours=$((seconds / 3600))
    local minutes=$(((seconds % 3600) / 60))
    local secs=$((seconds % 60))
    
    if [ $hours -gt 0 ]; then
        printf "%dh %02dm" $hours $minutes
    elif [ $minutes -gt 0 ]; then
        printf "%dm %02ds" $minutes $secs
    else
        printf "%ds" $secs
    fi
}

# Função principal
monitor_reimport() {
    clear
    
    # Header
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${BLUE}║${RESET}           ${CALENDAR} ${BOLD}MONITOR DE REIMPORTAÇÃO MENSAL CNPJ${RESET}                       ${BOLD}${BLUE}║${RESET}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    echo -e "${CYAN}Nova versão:${RESET} ${BOLD}${VERSAO_NOVA}${RESET}     ${CYAN}Anterior:${RESET} ${BOLD}${VERSAO_ANTERIOR:-N/A}${RESET}"
    echo ""
    
    # Verificar processo
    local pid=$(ps aux | grep -E "[p]ython3.*import_cnpj.py" | awk '{print $2}' | head -1)
    if [ -n "$pid" ]; then
        echo -e "${GREEN}${PROCESS} Importação ativa: PID $pid${RESET}"
    else
        echo -e "${YELLOW}⏸️  Nenhum processo ativo (reimportação não iniciada ou finalizada)${RESET}"
    fi
    echo ""
    
    # Comparação de versões (se versão anterior existe)
    if [ -n "$VERSAO_ANTERIOR" ]; then
        echo -e "${BOLD}${DIFF} COMPARAÇÃO DE VERSÕES:${RESET}"
        echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo ""
        
        # Comparar contadores
        local comparison=$(psql -U $DB_USER -d $DB_NAME -t -A -F'|' -c "
            WITH nova AS (
                SELECT tabela, SUM(registros_processados) as registros
                FROM cnpj_brasil.import_checkpoints
                WHERE versao = '$VERSAO_NOVA' AND status = 'completed'
                GROUP BY tabela
            ),
            antiga AS (
                SELECT tabela, SUM(registros_processados) as registros
                FROM cnpj_brasil.import_checkpoints
                WHERE versao = '$VERSAO_ANTERIOR' AND status = 'completed'
                GROUP BY tabela
            )
            SELECT 
                COALESCE(nova.tabela, antiga.tabela) as tabela,
                COALESCE(nova.registros, 0) as nova_count,
                COALESCE(antiga.registros, 0) as antiga_count,
                COALESCE(nova.registros, 0) - COALESCE(antiga.registros, 0) as diferenca
            FROM nova
            FULL OUTER JOIN antiga ON nova.tabela = antiga.tabela
            ORDER BY tabela;
        ")
        
        if [ -n "$comparison" ]; then
            echo "$comparison" | while IFS='|' read -r tabela nova antiga diff; do
                local pct_change=0
                if [ "$antiga" != "0" ]; then
                    pct_change=$(awk "BEGIN {printf \"%.2f\", ($diff / $antiga) * 100}")
                fi
                
                echo -e "${BOLD}${MAGENTA}▶ $tabela${RESET}"
                echo -e "  ${VERSAO_NOVA}: ${GREEN}$(format_number $nova)${RESET}"
                echo -e "  ${VERSAO_ANTERIOR}: ${CYAN}$(format_number $antiga)${RESET}"
                
                if [ "$diff" -gt 0 ]; then
                    echo -e "  ${NEW} Diferença: ${GREEN}+$(format_number $diff) (+${pct_change}%)${RESET}"
                elif [ "$diff" -lt 0 ]; then
                    echo -e "  ${RED}⬇️  Diferença: $(format_number $diff) (${pct_change}%)${RESET}"
                else
                    echo -e "  ${CHECK} Sem alteração"
                fi
                echo ""
            done
        fi
    fi
    
    # Progresso da importação atual
    echo -e "${BOLD}${CHART} PROGRESSO DA REIMPORTAÇÃO ${VERSAO_NOVA}:${RESET}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    
    local progress=$(psql -U $DB_USER -d $DB_NAME -t -A -F'|' -c "
        SELECT 
            tabela,
            COUNT(*) FILTER (WHERE status = 'completed') as completados,
            COUNT(*) FILTER (WHERE status = 'processing') as processando,
            COUNT(*) as total,
            COALESCE(SUM(registros_processados), 0) as registros
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao = '$VERSAO_NOVA'
        GROUP BY tabela
        ORDER BY 
            CASE tabela 
                WHEN 'Empresas' THEN 1
                WHEN 'Estabelecimentos' THEN 2
                WHEN 'Simples' THEN 3
                WHEN 'Socios' THEN 4
            END;
    ")
    
    if [ -n "$progress" ]; then
        echo "$progress" | while IFS='|' read -r tabela completados processando total registros; do
            echo -e "${BOLD}${MAGENTA}▶ $tabela${RESET}"
            echo -n "  "
            draw_progress_bar $completados $total
            echo -e "  ${CYAN}($completados/$total arquivos)${RESET}"
            
            if [ $processando -gt 0 ]; then
                local arquivo=$(psql -U $DB_USER -d $DB_NAME -t -A -c "
                    SELECT arquivo 
                    FROM cnpj_brasil.import_checkpoints 
                    WHERE versao = '$VERSAO_NOVA' AND tabela = '$tabela' AND status = 'processing' 
                    LIMIT 1;
                ")
                echo -e "  ${YELLOW}${PROCESS} Processando: $arquivo${RESET}"
            fi
            
            if [ "$registros" != "0" ]; then
                echo -e "  ${CHECK} Processados: ${GREEN}$(format_number $registros)${RESET} registros"
            fi
            echo ""
        done
    else
        echo -e "${YELLOW}Nenhum checkpoint encontrado para $VERSAO_NOVA${RESET}"
        echo -e "${CYAN}Aguardando início da reimportação...${RESET}"
        echo ""
    fi
    
    # Velocidade atual
    echo -e "${BOLD}${ROCKET} VELOCIDADE E ESTIMATIVAS:${RESET}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    
    local last_file=$(psql -U $DB_USER -d $DB_NAME -t -A -F'|' -c "
        SELECT 
            arquivo,
            registros_processados,
            EXTRACT(EPOCH FROM (data_fim - data_inicio))::integer as segundos
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao = '$VERSAO_NOVA' AND status = 'completed'
        ORDER BY data_fim DESC 
        LIMIT 1;
    ")
    
    if [ -n "$last_file" ]; then
        IFS='|' read -r arquivo registros segundos <<< "$last_file"
        local speed=$((registros / segundos))
        
        echo -e "  ${CHECK} Último completado: ${GREEN}$arquivo${RESET}"
        echo -e "  ${CLOCK} Tempo: ${CYAN}$(format_duration $segundos)${RESET}"
        echo -e "  ${ROCKET} Velocidade: ${YELLOW}$(format_number $speed) reg/s${RESET}"
    else
        echo -e "  ${YELLOW}Aguardando primeiro arquivo...${RESET}"
    fi
    echo ""
    
    # Footer
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${CYAN}Atualizando a cada ${INTERVALO}s... (Ctrl+C para sair)${RESET}"
    echo -e "${YELLOW}$(date '+%d/%m/%Y %H:%M:%S')${RESET}"
}

# Loop principal
echo "Iniciando monitor de reimportação mensal CNPJ..."
echo "Versão nova: $VERSAO_NOVA | Anterior: ${VERSAO_ANTERIOR:-N/A} | Intervalo: ${INTERVALO}s"
echo ""

while true; do
    monitor_reimport
    sleep $INTERVALO
    clear
done
