#!/bin/bash
#
# Script para retomar serviços após reconectar HD externo
# Uso: ./reconectar_e_retomar.sh
#

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

echo
info "═══════════════════════════════════════════════════════════"
info "  RETOMANDO SERVIÇOS APÓS RECONEXÃO DO HD EXTERNO"
info "═══════════════════════════════════════════════════════════"
echo

# 1. Verificar se HD está montado
info "Passo 1/6: Verificando HD externo..."
if [ -d "/Volumes/ExtMB" ]; then
    success "HD externo montado em /Volumes/ExtMB"
else
    error "HD externo NÃO encontrado em /Volumes/ExtMB"
    echo
    warning "Conecte o HD externo e aguarde aparecer no Finder"
    exit 1
fi

# Verificar se diretórios essenciais existem
if [ -d "/Volumes/ExtMB/postgresql/data" ]; then
    success "Diretório PostgreSQL encontrado"
else
    error "Diretório PostgreSQL não encontrado!"
    exit 1
fi

if [ -d "/Volumes/ExtMB/BaseCNPJ/dez2025" ]; then
    success "Diretório de dados CNPJ encontrado"
else
    warning "Diretório de dados CNPJ não encontrado (não crítico)"
fi

# 2. Iniciar PostgreSQL
info "Passo 2/6: Iniciando PostgreSQL..."
brew services start postgresql@17 > /dev/null 2>&1
sleep 5

# Verificar se iniciou (PostgreSQL pode demorar para recuperar após desconexão do HD)
info "Aguardando PostgreSQL recuperar dados do HD externo..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if psql -l > /dev/null 2>&1; then
        success "PostgreSQL iniciado e pronto (após $((RETRY * 2 + 5))s)"
        break
    fi
    RETRY=$((RETRY + 1))
    
    # Mostrar progresso a cada 5 tentativas
    if [ $((RETRY % 5)) -eq 0 ]; then
        info "Ainda recuperando... ($((RETRY * 2 + 5))s / $((MAX_RETRIES * 2 + 5))s)"
    fi
    sleep 2
done

if [ $RETRY -eq $MAX_RETRIES ]; then
    error "PostgreSQL não iniciou após $((MAX_RETRIES * 2 + 5))s"
    error "Verifique os logs: tail -30 /Volumes/ExtMB/postgresql/logs/postgresql-*.log"
    exit 1
fi

# 3. Verificar banco de dados
info "Passo 3/6: Verificando banco de dados..."
if psql -l | grep -q basecerta; then
    success "Banco 'basecerta' encontrado"
else
    error "Banco 'basecerta' não encontrado!"
    exit 1
fi

# 4. Mostrar estado atual
info "Passo 4/6: Verificando estado da importação..."
echo
psql -U aian_db -d basecerta -c "
SELECT 
    CASE 
        WHEN tablename = 'empresas' THEN '📊 Empresas'
        WHEN tablename = 'estabelecimentos' THEN '🏢 Estabelecimentos'
        WHEN tablename = 'simples_nacional' THEN '📋 Simples Nacional'
        WHEN tablename = 'socios' THEN '👥 Sócios'
    END as tabela,
    pg_size_pretty(pg_total_relation_size('cnpj_brasil.'||tablename)) as tamanho
FROM (
    SELECT 'empresas' as tablename, COUNT(*) as total FROM cnpj_brasil.empresas
    UNION ALL
    SELECT 'estabelecimentos', COUNT(*) FROM cnpj_brasil.estabelecimentos
    UNION ALL
    SELECT 'simples_nacional', COUNT(*) FROM cnpj_brasil.simples_nacional
    UNION ALL
    SELECT 'socios', COUNT(*) FROM cnpj_brasil.socios
) counts
JOIN pg_tables ON pg_tables.tablename = counts.tablename AND pg_tables.schemaname = 'cnpj_brasil';
" 2>/dev/null | head -10

# Mostrar estado anterior se existir
STATE_FILE="/tmp/basecerta_import_state.txt"
if [ -f "$STATE_FILE" ]; then
    echo
    info "Estado anterior (antes de desconectar):"
    cat "$STATE_FILE" | sed 's/^/   /'
fi

echo

# 5. Iniciar containers Docker
info "Passo 5/6: Iniciando containers Docker..."
cd /Users/code4us/Documents/ADACODE/basecerta

if [ -f "docker-compose.yml" ]; then
    docker-compose up -d > /dev/null 2>&1
    sleep 3
    
    RUNNING=$(docker ps | grep -c basecerta 2>/dev/null || echo "0")
    if [ "$RUNNING" -gt "0" ]; then
        success "$RUNNING container(s) iniciado(s)"
    else
        warning "Containers Docker não iniciaram (não crítico para importação)"
    fi
else
    warning "docker-compose.yml não encontrado (não crítico para importação)"
fi

# 6. Perguntar se deve retomar importação
echo
warning "═══════════════════════════════════════════════════════════"
read -p "Deseja retomar a importação CNPJ agora? (s/N): " -n 1 -r
echo
warning "═══════════════════════════════════════════════════════════"

if [[ $REPLY =~ ^[Ss]$ ]]; then
    info "Iniciando importação..."
    
    cd /Users/code4us/Documents/ADACODE/basecerta/scripts
    
    LOG_FILE="/Volumes/ExtMB/postgresql/logs/import_2025-12_$(date +%Y%m%d_%H%M%S).log"
    nohup python3 import_cnpj.py 2025-12 --auto > "$LOG_FILE" 2>&1 &
    IMPORT_PID=$!
    
    sleep 3
    
    if ps -p $IMPORT_PID > /dev/null 2>&1; then
        success "Importação iniciada! PID: $IMPORT_PID"
        info "Log: $LOG_FILE"
        echo
        info "Para monitorar:"
        echo "   ${YELLOW}./monitor_importacao.sh${NC}"
        echo "   ou"
        echo "   ${YELLOW}tail -f $LOG_FILE${NC}"
    else
        error "Falha ao iniciar importação"
        info "Verifique o log: $LOG_FILE"
    fi
else
    info "Importação NÃO iniciada"
    echo
    info "Para iniciar manualmente depois:"
    echo "   ${YELLOW}cd /Users/code4us/Documents/ADACODE/basecerta/scripts${NC}"
    echo "   ${YELLOW}nohup python3 import_cnpj.py 2025-12 --auto > /Volumes/ExtMB/postgresql/logs/import_final.log 2>&1 &${NC}"
fi

echo
success "✅ Sistema pronto!"
echo

exit 0
