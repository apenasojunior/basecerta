#!/bin/bash
#
# Script de Importação Mensal CNPJ - Receita Federal
# Uso: ./importar_cnpj_mensal.sh [AAAA-MM] [caminho_dados]
#       (sem parâmetros = modo interativo)
#
# Modo Interativo: ./importar_cnpj_mensal.sh
# Modo Direto: ./importar_cnpj_mensal.sh 2026-01 /Volumes/ExtMB/BaseCNPJ/jan2026
#

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Funções auxiliares
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

title() {
    echo -e "${CYAN}${BOLD}$1${NC}"
}

# Aguardar PostgreSQL estar pronto (com retry)
wait_postgres() {
    local MAX_RETRIES=30
    local RETRY=0
    
    info "Aguardando PostgreSQL estar pronto..."
    while [ $RETRY -lt $MAX_RETRIES ]; do
        if psql -U code4us -d postgres -c "SELECT 1" > /dev/null 2>&1; then
            success "PostgreSQL pronto (após $((RETRY * 2))s)"
            return 0
        fi
        
        if [ $((RETRY % 5)) -eq 0 ] && [ $RETRY -gt 0 ]; then
            info "Ainda aguardando... ($((RETRY * 2))s / $((MAX_RETRIES * 2))s)"
        fi
        
        sleep 2
        RETRY=$((RETRY + 1))
    done
    
    error "PostgreSQL não iniciou após $((MAX_RETRIES * 2))s"
    return 1
}

# Menu interativo se não passar parâmetros
if [ $# -eq 0 ]; then
    clear
    echo
    title "╔════════════════════════════════════════════════════════════╗"
    title "║     IMPORTAÇÃO MENSAL CNPJ - RECEITA FEDERAL - BRASIL     ║"
    title "╚════════════════════════════════════════════════════════════╝"
    echo
    
    # Obter ano atual
    ANO=$(date +%Y)
    info "Ano: ${BOLD}${ANO}${NC}"
    echo
    
    # Menu de meses
    title "Escolha o mês da importação:"
    echo
    echo "  1) Janeiro      (${ANO}-01)     7) Julho        (${ANO}-07)"
    echo "  2) Fevereiro    (${ANO}-02)     8) Agosto       (${ANO}-08)"
    echo "  3) Março        (${ANO}-03)     9) Setembro     (${ANO}-09)"
    echo "  4) Abril        (${ANO}-04)    10) Outubro      (${ANO}-10)"
    echo "  5) Maio         (${ANO}-05)    11) Novembro     (${ANO}-11)"
    echo "  6) Junho        (${ANO}-06)    12) Dezembro     (${ANO}-12)"
    echo
    
    # Ler escolha do mês
    read -p "Digite o número do mês (1-12): " MES_NUM
    
    # Validar entrada
    if ! [[ "$MES_NUM" =~ ^[1-9]$|^1[0-2]$ ]]; then
        error "Mês inválido: $MES_NUM"
        exit 1
    fi
    
    # Montar código do mês (01, 02, etc.)
    MES_CODIGO=$(printf "%02d" $MES_NUM)
    VERSAO="${ANO}-${MES_CODIGO}"
    
    # Nomes dos meses para caminho
    declare -a MESES_NOME=("" "jan" "fev" "mar" "abr" "mai" "jun" "jul" "ago" "set" "out" "nov" "dez")
    MES_NOME=${MESES_NOME[$MES_NUM]}
    
    # Caminho padrão
    DATA_DIR_PADRAO="/Volumes/ExtMB/BaseCNPJ/${MES_NOME}${ANO}"
    
    echo
    success "Mês selecionado: ${VERSAO}"
    echo
    
    # Menu de caminho
    title "Caminho dos dados:"
    echo
    echo "  1) Usar padrão: ${DATA_DIR_PADRAO}"
    echo "  2) Informar caminho customizado"
    echo
    
    read -p "Escolha (1-2): " CAMINHO_OPCAO
    
    if [ "$CAMINHO_OPCAO" = "2" ]; then
        echo
        read -p "Digite o caminho completo: " DATA_DIR
        if [ ! -d "$DATA_DIR" ]; then
            warning "Diretório não existe ainda: $DATA_DIR"
            read -p "Continuar mesmo assim? (s/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Ss]$ ]]; then
                exit 0
            fi
        fi
    else
        DATA_DIR="$DATA_DIR_PADRAO"
    fi
    
else
    # Modo direto (compatibilidade com uso anterior)
    VERSAO=$1
    DATA_DIR=${2:-"/Volumes/ExtMB/BaseCNPJ/$(echo $VERSAO | sed 's/-//g')"}
fi

info "Importação CNPJ - Versão: $VERSAO"
info "Diretório de dados: $DATA_DIR"

# Verificar se diretório existe
if [ ! -d "$DATA_DIR" ]; then
    error "Diretório não encontrado: $DATA_DIR"
    exit 1
fi

# Verificar arquivos necessários
info "Verificando arquivos..."
ARQUIVOS_NECESSARIOS=(
    "Empresas0.zip"
    "Estabelecimentos0.zip"
    "Socios0.zip"
    "Simples.zip"
    "Cnaes.zip"
    "Municipios.zip"
    "Naturezas.zip"
    "Paises.zip"
    "Qualificacoes.zip"
    "Motivos.zip"
)

MISSING=0
for arquivo in "${ARQUIVOS_NECESSARIOS[@]}"; do
    if [ ! -f "$DATA_DIR/$arquivo" ]; then
        warning "Arquivo faltando: $arquivo"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -gt 0 ]; then
    error "$MISSING arquivo(s) faltando. Verifique o download."
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

success "Arquivos verificados"

# Localizar script de importação
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMPORT_SCRIPT="$SCRIPT_DIR/import_cnpj.py"

# Confirmar execução
echo
warning "=== RESUMO DA IMPORTAÇÃO ==="
echo "Versão: $VERSAO"
echo "Dados: $DATA_DIR"
echo "Duração estimada: 6-8 horas"
echo "Espaço necessário: ~200 GB"
echo
read -p "Iniciar importação? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    info "Importação cancelada"
    # Restaurar backup
    mv "$IMPORT_SCRIPT.bak" "$IMPORT_SCRIPT"
    exit 0
fi

# Passo 1: Tuning PostgreSQL
info "Passo 1/4: Aplicando tuning PostgreSQL..."
python3 "$SCRIPT_DIR/postgres_tuning.py" --apply --user code4us
if [ $? -eq 0 ]; then
    success "Tuning aplicado"
else
    error "Falha no tuning"
    exit 1
fi

# Reiniciar PostgreSQL com validação
info "Reiniciando PostgreSQL com tuning..."
brew services restart postgresql@17

if ! wait_postgres; then
    error "PostgreSQL não iniciou após aplicar tuning"
    error "Verifique: tail -50 /Volumes/ExtMB/postgresql/data/pg_log/postgresql-*.log"
    exit 1
fi

# Passo 2: Importação
info "Passo 2/4: Iniciando importação (6-8 horas)..."
LOG_FILE="/Volumes/ExtMB/postgresql/logs/import_${VERSAO}_$(date +%Y%m%d_%H%M%S).log"

# Retry loop: até 3 tentativas
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if [ $RETRY_COUNT -gt 0 ]; then
        warning "Tentativa $((RETRY_COUNT + 1)) de $MAX_RETRIES..."
        sleep 10
    fi
    
    # Executar em background com nohup (--auto e --data-dir)
    nohup python3 "$IMPORT_SCRIPT" "$VERSAO" --auto --data-dir "$DATA_DIR" >> "$LOG_FILE" 2>&1 &
    IMPORT_PID=$!
    
    info "Processo iniciado (PID: $IMPORT_PID)"
    info "Log: $LOG_FILE"
    info "Monitorar: tail -f $LOG_FILE"
    
    # Aguardar conclusão
    info "Aguardando conclusão da importação..."
    wait $IMPORT_PID
    IMPORT_STATUS=$?
    
    if [ $IMPORT_STATUS -eq 0 ]; then
        success "Importação concluída com sucesso!"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            warning "Importação falhou com código $IMPORT_STATUS - tentando novamente..."
        else
            error "Importação falhou após $MAX_RETRIES tentativas"
            warning "Verifique o log: $LOG_FILE"
            exit 1
        fi
    fi
done

# Passo 3: Restaurar configurações PostgreSQL
info "Passo 3/4: Restaurando configurações PostgreSQL..."
python3 "$SCRIPT_DIR/postgres_tuning.py" --restore --user code4us
if [ $? -eq 0 ]; then
    success "Configurações restauradas"
else
    warning "Falha ao restaurar configurações (não crítico)"
fi

# Reiniciar PostgreSQL com validação
info "Reiniciando PostgreSQL com configurações normais..."
brew services restart postgresql@17

if ! wait_postgres; then
    warning "PostgreSQL demorou para iniciar (não crítico se banco está acessível)"
fi

# Passo 4: Validação
info "Passo 4/4: Validando importação..."

# Contar registros
info "Contando registros..."
psql -U aian_db -d basecerta -c "
SELECT 
    'empresas' as tabela, 
    COUNT(*) as total
FROM cnpj_brasil.empresas
UNION ALL
SELECT 
    'estabelecimentos', 
    COUNT(*)
FROM cnpj_brasil.estabelecimentos
UNION ALL
SELECT 
    'simples_nacional', 
    COUNT(*) 
FROM cnpj_brasil.simples_nacional
UNION ALL
SELECT 
    'socios', 
    COUNT(*)
FROM cnpj_brasil.socios;
"

# Verificar Foreign Keys
info "Verificando Foreign Keys..."
FK_COUNT=$(psql -U aian_db -d basecerta -t -c "
SELECT COUNT(*) 
FROM pg_constraint con
JOIN pg_class cls ON con.conrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
WHERE con.contype = 'f' AND nsp.nspname = 'cnpj_brasil';
")

if [ "$FK_COUNT" -eq 12 ]; then
    success "Todas as 12 Foreign Keys recriadas"
elif [ "$FK_COUNT" -gt 0 ]; then
    warning "$FK_COUNT de 12 Foreign Keys recriadas (códigos inválidos nos dados)"
else
    warning "Nenhuma Foreign Key recriada (códigos inválidos nos dados)"
fi

# Tamanho do banco
info "Tamanho do banco de dados:"
psql -U aian_db -d basecerta -c "
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.'||tablename)) as tamanho
FROM pg_tables 
WHERE schemaname = 'cnpj_brasil'
ORDER BY pg_total_relation_size('cnpj_brasil.'||tablename) DESC;
"

# Conclusão
echo
success "=== IMPORTAÇÃO CONCLUÍDA ==="
info "Versão: $VERSAO"
info "Log completo: $LOG_FILE"
info "Próxima atualização: próximo mês com novos dados da Receita"
echo

exit 0
