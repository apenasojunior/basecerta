#!/bin/bash

################################################################################
# BaseCerta - Restaurar Banco de Dados PostgreSQL
#
# Este script restaura um backup do banco de dados
#
# Uso: ./restore-database.sh [arquivo_backup.sql.gz]
################################################################################

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

################################################################################
# VERIFICAR ARGUMENTOS
################################################################################

print_header "♻️  Restaurar Banco de Dados - BaseCerta"

if [ -z "$1" ]; then
    print_error "Uso: $0 <arquivo_backup.sql.gz>"
    echo ""
    print_info "Exemplo:"
    echo "   $0 backups/basecerta_backup_20241208_143000.sql.gz"
    echo ""
    print_info "Backups disponíveis:"
    ls -lh backups/*.gz 2>/dev/null | awk '{print "   " $9 " - " $5}' || echo "   Nenhum backup encontrado"
    echo ""
    exit 1
fi

BACKUP_FILE="$1"

# Verificar se arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Arquivo não encontrado: $BACKUP_FILE"
    exit 1
fi

print_success "Arquivo de backup encontrado: $BACKUP_FILE"
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
print_info "Tamanho: $BACKUP_SIZE"
echo ""

################################################################################
# CONFIRMAÇÃO
################################################################################

print_warning "⚠️  ATENÇÃO: Esta operação irá:"
echo "   1. APAGAR todos os dados atuais do banco"
echo "   2. Restaurar os dados do backup"
echo "   3. Isso é IRREVERSÍVEL!"
echo ""

read -p "$(echo -e ${YELLOW}Tem certeza que deseja continuar? \(s/n\): ${NC})" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    print_info "Operação cancelada pelo usuário"
    exit 0
fi

################################################################################
# VERIFICAR DOCKER
################################################################################

print_header "🔍 Verificando Ambiente"

print_info "Verificando se Docker está rodando..."

if ! docker info &> /dev/null; then
    print_error "Docker não está rodando!"
    print_info "Inicie o Docker Desktop e tente novamente"
    exit 1
fi

print_success "Docker está rodando"

################################################################################
# VERIFICAR/INICIAR POSTGRES
################################################################################

print_info "Verificando container do PostgreSQL..."

if ! docker-compose ps postgres | grep -q "Up"; then
    print_warning "Container do PostgreSQL não está rodando"
    print_info "Iniciando PostgreSQL..."
    docker-compose up -d postgres
    
    print_info "Aguardando PostgreSQL inicializar..."
    sleep 5
fi

print_success "Container PostgreSQL está ativo"

################################################################################
# BACKUP DE SEGURANÇA (antes de restaurar)
################################################################################

print_header "💾 Criando Backup de Segurança"

print_warning "Criando backup do banco atual antes de restaurar..."

SAFETY_BACKUP_DIR="./backups/safety"
mkdir -p "$SAFETY_BACKUP_DIR"

SAFETY_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SAFETY_BACKUP="$SAFETY_BACKUP_DIR/before_restore_${SAFETY_TIMESTAMP}.sql.gz"

docker-compose exec -T postgres pg_dump -U aian_db basecerta 2>/dev/null | gzip > "$SAFETY_BACKUP" || {
    print_warning "Não foi possível criar backup de segurança (banco pode estar vazio)"
}

if [ -f "$SAFETY_BACKUP" ] && [ -s "$SAFETY_BACKUP" ]; then
    print_success "Backup de segurança criado: $SAFETY_BACKUP"
else
    print_info "Pulando backup de segurança (banco vazio ou novo)"
fi

################################################################################
# LIMPAR BANCO ATUAL
################################################################################

print_header "🗑️  Limpando Banco Atual"

print_info "Apagando dados existentes..."

# Dropar conexões ativas
docker-compose exec -T postgres psql -U aian_db -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'basecerta' AND pid <> pg_backend_pid();" \
    &> /dev/null || true

# Dropar e recriar banco
print_info "Recriando banco de dados..."
docker-compose exec -T postgres psql -U aian_db -d postgres -c "DROP DATABASE IF EXISTS basecerta;" &> /dev/null || true
docker-compose exec -T postgres psql -U aian_db -d postgres -c "CREATE DATABASE basecerta;" &> /dev/null

print_success "Banco limpo e recriado"

################################################################################
# RESTAURAR BACKUP
################################################################################

print_header "📥 Restaurando Backup"

print_info "Descomprimindo e restaurando dados..."
print_warning "Isso pode demorar vários minutos dependendo do tamanho..."

# Descomprimir e restaurar
gunzip -c "$BACKUP_FILE" | docker-compose exec -T postgres psql -U aian_db -d basecerta &> /dev/null

if [ $? -eq 0 ]; then
    print_success "Dados restaurados com sucesso!"
else
    print_error "Erro ao restaurar backup!"
    print_info "Tentando recuperar backup de segurança..."
    
    if [ -f "$SAFETY_BACKUP" ]; then
        gunzip -c "$SAFETY_BACKUP" | docker-compose exec -T postgres psql -U aian_db -d basecerta &> /dev/null
        print_warning "Backup de segurança restaurado"
    fi
    
    exit 1
fi

################################################################################
# VERIFICAR RESTAURAÇÃO
################################################################################

print_header "✅ Verificando Restauração"

print_info "Verificando dados restaurados..."

# Contar tabelas
TABLE_COUNT=$(docker-compose exec -T postgres psql -U aian_db -d basecerta -t -c \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'cnpj';" | xargs)

print_info "Tabelas no schema cnpj: $TABLE_COUNT"

# Contar registros
if [ "$TABLE_COUNT" -gt 0 ]; then
    EMPRESAS_COUNT=$(docker-compose exec -T postgres psql -U aian_db -d basecerta -t -c \
        "SELECT COUNT(*) FROM cnpj.empresas;" 2>/dev/null | xargs || echo "0")
    
    ESTABELECIMENTOS_COUNT=$(docker-compose exec -T postgres psql -U aian_db -d basecerta -t -c \
        "SELECT COUNT(*) FROM cnpj.estabelecimentos;" 2>/dev/null | xargs || echo "0")
    
    print_success "Registros restaurados:"
    echo "   - Empresas: $EMPRESAS_COUNT"
    echo "   - Estabelecimentos: $ESTABELECIMENTOS_COUNT"
else
    print_warning "Nenhuma tabela encontrada no schema cnpj"
fi

################################################################################
# FINALIZAÇÃO
################################################################################

print_header "🎉 Restauração Concluída!"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           BANCO DE DADOS RESTAURADO COM SUCESSO!               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "📊 Resumo:"
echo "   - Backup restaurado: $BACKUP_FILE"
echo "   - Tabelas: $TABLE_COUNT"
if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "   - Empresas: $EMPRESAS_COUNT"
    echo "   - Estabelecimentos: $ESTABELECIMENTOS_COUNT"
fi
echo ""

print_info "🔧 Próximos passos:"
echo "   1. Verifique se o backend está rodando: docker-compose ps"
echo "   2. Teste o frontend: cd frontend && npm run dev"
echo "   3. Acesse: http://localhost:3000"
echo ""

if [ -f "$SAFETY_BACKUP" ]; then
    print_info "💾 Backup de segurança disponível em:"
    echo "   $SAFETY_BACKUP"
    echo ""
fi

print_success "Restauração concluída! 🎉"
echo ""
