#!/bin/bash
#
# Script para parar serviços antes de desconectar HD externo
# Uso: ./pausar_para_desconectar_hd.sh
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
warning "═══════════════════════════════════════════════════════════"
warning "  PAUSANDO SERVIÇOS PARA DESCONEXÃO SEGURA DO HD EXTERNO"
warning "═══════════════════════════════════════════════════════════"
echo

# 1. Parar processo de importação
info "Passo 1/4: Parando processo de importação..."
IMPORT_PID=$(ps aux | grep '[i]mport_cnpj.py' | awk '{print $2}')

if [ -n "$IMPORT_PID" ]; then
    info "Encontrado processo PID: $IMPORT_PID"
    kill -15 $IMPORT_PID 2>/dev/null
    sleep 3
    
    # Verificar se parou
    if ps -p $IMPORT_PID > /dev/null 2>&1; then
        warning "Processo não parou com SIGTERM, forçando..."
        kill -9 $IMPORT_PID 2>/dev/null
        sleep 1
    fi
    
    # Confirmar
    if ps -p $IMPORT_PID > /dev/null 2>&1; then
        error "Não foi possível parar o processo de importação!"
        exit 1
    else
        success "Importação parada"
    fi
else
    info "Nenhum processo de importação rodando"
fi

# 2. Salvar estado atual do banco
info "Passo 2/4: Salvando estado atual do banco..."
STATE_FILE="/tmp/basecerta_import_state.txt"

if brew services list | grep -q "postgresql@17.*started"; then
    psql -U aian_db -d basecerta -t -c "
    SELECT 
        'empresas:' || COUNT(*) FROM cnpj_brasil.empresas
    UNION ALL
    SELECT 
        'estabelecimentos:' || COUNT(*) FROM cnpj_brasil.estabelecimentos
    UNION ALL
    SELECT 
        'simples:' || COUNT(*) FROM cnpj_brasil.simples_nacional
    UNION ALL
    SELECT 
        'socios:' || COUNT(*) FROM cnpj_brasil.socios;
    " > "$STATE_FILE" 2>/dev/null
    
    if [ -f "$STATE_FILE" ]; then
        success "Estado salvo em: $STATE_FILE"
        echo
        cat "$STATE_FILE" | sed 's/^/   /'
        echo
    fi
fi

# 3. Parar PostgreSQL
info "Passo 3/4: Parando PostgreSQL..."
brew services stop postgresql@17 > /dev/null 2>&1
sleep 2

if brew services list | grep -q "postgresql@17.*started"; then
    error "PostgreSQL ainda rodando!"
    exit 1
else
    success "PostgreSQL parado"
fi

# 4. Parar containers Docker
info "Passo 4/4: Parando containers Docker..."
RUNNING_CONTAINERS=$(docker ps -q 2>/dev/null)

if [ -n "$RUNNING_CONTAINERS" ]; then
    docker stop $RUNNING_CONTAINERS > /dev/null 2>&1
    sleep 2
    success "$(echo $RUNNING_CONTAINERS | wc -w | xargs) container(s) parado(s)"
else
    info "Nenhum container Docker rodando"
fi

# Verificação final
echo
success "═══════════════════════════════════════════════════════════"
success "  TODOS OS SERVIÇOS PARADOS COM SUCESSO"
success "═══════════════════════════════════════════════════════════"
echo
info "Verificação final:"
echo

# PostgreSQL
if brew services list | grep -q "postgresql@17.*started"; then
    error "  PostgreSQL: AINDA RODANDO ⚠️"
else
    success "  PostgreSQL: Parado"
fi

# Importação
if ps aux | grep -q '[i]mport_cnpj.py'; then
    error "  Importação: AINDA RODANDO ⚠️"
else
    success "  Importação: Parada"
fi

# Docker
RUNNING=$(docker ps -q 2>/dev/null | wc -l | xargs)
if [ "$RUNNING" -gt 0 ]; then
    error "  Docker: $RUNNING container(s) ainda rodando ⚠️"
else
    success "  Docker: Todos containers parados"
fi

echo
success "✅ SEGURO PARA DESCONECTAR O HD EXTERNO!"
echo
info "📋 Próximos passos:"
echo "   1. Ejetar HD externo pelo Finder (⏏️)"
echo "   2. Desconectar fisicamente o HD"
echo "   3. Fazer sua viagem"
echo "   4. Ao retornar: reconectar HD e executar:"
echo "      ${YELLOW}./reconectar_e_retomar.sh${NC}"
echo

exit 0
