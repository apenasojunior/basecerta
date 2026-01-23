#!/bin/bash

# Monitor Visual de Importação CNPJ com Barra de Progresso
# Uso: ./monitor_importacao_visual.sh [versao] [intervalo]
# Exemplo: ./monitor_importacao_visual.sh 2025-12 5

# Configuração
VERSAO="${1:-2025-12}"
INTERVALO="${2:-5}"
DB_NAME="basecerta"
DB_USER="code4us"

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
FILE="📁"
DATABASE="💾"
CHART="📊"

# Função para desenhar barra de progresso
draw_progress_bar() {
    local current=$1
    local total=$2
    local width=50
    local percentage=0
    
    if [ $total -gt 0 ]; then
        percentage=$((current * 100 / total))
        local filled=$((current * width / total))
        local empty=$((width - filled))
        
        # Desenhar barra
        printf "${CYAN}["
        printf "%${filled}s" | tr ' ' '█'
        printf "%${empty}s" | tr ' ' '░'
        printf "]${RESET} ${BOLD}%3d%%${RESET}" $percentage
    else
        printf "${CYAN}[%${width}s]${RESET} ${BOLD}  0%%${RESET}" | tr ' ' '░'
    fi
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
        printf "%dh %02dm %02ds" $hours $minutes $secs
    elif [ $minutes -gt 0 ]; then
        printf "%dm %02ds" $minutes $secs
    else
        printf "%ds" $secs
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

# Função para calcular velocidade
calculate_speed() {
    local records=$1
    local seconds=$2
    
    if [ -z "$seconds" ] || [ "$seconds" = "0" ] || [ -z "$records" ]; then
        echo "calculando..."
        return
    fi
    
    local speed=$((records / seconds))
    format_number $speed
}

# Função principal de monitoramento
monitor_import() {
    clear
    
    # Header
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BOLD}${BLUE}║${RESET}        ${ROCKET} ${BOLD}MONITOR DE IMPORTAÇÃO CNPJ - VERSÃO $VERSAO${RESET}                    ${BOLD}${BLUE}║${RESET}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    
    # Verificar processo ativo
    local pid=$(ps aux | grep -E "[p]ython3.*import_cnpj.py" | awk '{print $2}' | head -1)
    if [ -n "$pid" ]; then
        echo -e "${GREEN}${PROCESS} Processo ativo: PID $pid${RESET}"
    else
        echo -e "${RED}⚠️  Nenhum processo de importação detectado${RESET}"
    fi
    echo ""
    
    # Buscar status dos checkpoints
    local checkpoint_data=$(psql -U $DB_USER -d $DB_NAME -t -A -F'|' -c "
        SELECT 
            tabela,
            COUNT(*) FILTER (WHERE status = 'completed') as completados,
            COUNT(*) FILTER (WHERE status = 'processing') as processando,
            COUNT(*) FILTER (WHERE status = 'failed') as falhas,
            COALESCE(SUM(registros_processados), 0) as total_registros,
            COUNT(*) as total_arquivos
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao = '$VERSAO'
        GROUP BY tabela
        ORDER BY 
            CASE tabela 
                WHEN 'Empresas' THEN 1
                WHEN 'Estabelecimentos' THEN 2
                WHEN 'Simples' THEN 3
                WHEN 'Socios' THEN 4
                ELSE 5
            END;
    ")
    
    if [ -n "$checkpoint_data" ]; then
        echo -e "${BOLD}${CHART} PROGRESSO POR TABELA:${RESET}"
        echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo ""
        
        echo "$checkpoint_data" | while IFS='|' read -r tabela completados processando falhas total_registros total_arquivos; do
            # Calcular totais esperados por tabela
            local arquivos_esperados=10
            case "$tabela" in
                "Empresas") arquivos_esperados=10 ;;
                "Estabelecimentos") arquivos_esperados=20 ;;
                "Simples") arquivos_esperados=1 ;;
                "Socios") arquivos_esperados=10 ;;
            esac
            
            local total_completo=$((completados + processando))
            
            echo -e "${BOLD}${MAGENTA}▶ $tabela${RESET}"
            echo -n "  "
            draw_progress_bar $completados $arquivos_esperados
            echo -e "  ${CYAN}($completados/$arquivos_esperados arquivos)${RESET}"
            
            if [ $processando -gt 0 ]; then
                # Buscar arquivo atual
                local arquivo_atual=$(psql -U $DB_USER -d $DB_NAME -t -A -c "
                    SELECT arquivo 
                    FROM cnpj_brasil.import_checkpoints 
                    WHERE versao = '$VERSAO' AND tabela = '$tabela' AND status = 'processing' 
                    LIMIT 1;
                ")
                echo -e "  ${YELLOW}${PROCESS} Processando: $arquivo_atual${RESET}"
            fi
            
            if [ "$total_registros" != "0" ]; then
                echo -e "  ${DATABASE} Registros processados: ${GREEN}$(format_number $total_registros)${RESET}"
            fi
            
            if [ $falhas -gt 0 ]; then
                echo -e "  ${RED}⚠️  Falhas: $falhas arquivo(s)${RESET}"
            fi
            
            echo ""
        done
    else
        echo -e "${YELLOW}Nenhum checkpoint encontrado para versão $VERSAO${RESET}"
        echo ""
    fi
    
    # Velocidade e estatísticas
    echo -e "${BOLD}${CHART} VELOCIDADE E ESTATÍSTICAS:${RESET}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    
    # Buscar último arquivo completado
    local last_completed=$(psql -U $DB_USER -d $DB_NAME -t -A -F'|' -c "
        SELECT 
            arquivo,
            registros_processados,
            EXTRACT(EPOCH FROM (data_fim - data_inicio))::integer as segundos,
            tabela
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao = '$VERSAO' AND status = 'completed'
        ORDER BY data_fim DESC 
        LIMIT 1;
    ")
    
    if [ -n "$last_completed" ]; then
        IFS='|' read -r arquivo registros segundos tabela <<< "$last_completed"
        local speed=$(calculate_speed $registros $segundos)
        local duration=$(format_duration $segundos)
        
        echo -e "  ${CHECK} Último arquivo completado: ${GREEN}$arquivo${RESET}"
        echo -e "  ${CLOCK} Tempo de processamento: ${CYAN}$duration${RESET}"
        echo -e "  ${DATABASE} Registros: ${GREEN}$(format_number $registros)${RESET}"
        echo -e "  ${ROCKET} Velocidade: ${YELLOW}$speed reg/s${RESET}"
        echo ""
        
        # Estimar tempo restante para tabela atual
        local arquivos_pendentes=$(psql -U $DB_USER -d $DB_NAME -t -A -c "
            SELECT COUNT(*) 
            FROM cnpj_brasil.import_checkpoints 
            WHERE versao = '$VERSAO' AND tabela = '$tabela' AND status NOT IN ('completed', 'failed');
        ")
        
        if [ "$arquivos_pendentes" -gt 0 ] && [ "$segundos" != "0" ]; then
            local tempo_estimado=$((segundos * arquivos_pendentes))
            echo -e "  ${CLOCK} Tempo estimado para completar $tabela: ${YELLOW}$(format_duration $tempo_estimado)${RESET}"
            echo ""
        fi
    fi
    
    # Contadores do banco
    echo -e "${BOLD}${DATABASE} DADOS NO BANCO:${RESET}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo ""
    
    local db_counts=$(psql -U $DB_USER -d $DB_NAME -t -A -F'|' -c "
        SELECT 
            (SELECT COUNT(*) FROM cnpj_brasil.empresas) as empresas,
            (SELECT COUNT(*) FROM cnpj_brasil.estabelecimentos) as estabelecimentos,
            (SELECT COUNT(*) FROM cnpj_brasil.socios) as socios;
    ")
    
    IFS='|' read -r empresas estabelecimentos socios <<< "$db_counts"
    
    echo -e "  Empresas............: ${GREEN}$(format_number $empresas)${RESET}"
    echo -e "  Estabelecimentos....: ${GREEN}$(format_number $estabelecimentos)${RESET}"
    echo -e "  Sócios..............: ${GREEN}$(format_number $socios)${RESET}"
    echo ""
    
    # Tamanho do banco
    local db_size=$(psql -U $DB_USER -d $DB_NAME -t -A -c "
        SELECT pg_size_pretty(pg_database_size('$DB_NAME'));
    ")
    echo -e "  Tamanho do banco....: ${CYAN}$db_size${RESET}"
    echo ""
    
    # Footer
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${CYAN}Atualizando a cada ${INTERVALO}s... (Ctrl+C para sair)${RESET}"
    echo -e "${YELLOW}Última atualização: $(date '+%d/%m/%Y %H:%M:%S')${RESET}"
}

# Loop principal
echo "Iniciando monitor visual de importação CNPJ..."
echo "Versão: $VERSAO | Intervalo: ${INTERVALO}s"
echo ""

while true; do
    monitor_import
    sleep $INTERVALO
    clear
done
