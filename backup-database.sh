#!/bin/bash

################################################################################
# BaseCerta - Backup Completo do Banco de Dados PostgreSQL
#
# Este script cria um dump completo do banco de dados para migração
#
# Uso: ./backup-database.sh
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
# CONFIGURAÇÕES
################################################################################

print_header "💾 Backup do Banco de Dados - BaseCerta"

# Criar pasta de backups se não existir
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Nome do arquivo com data e hora
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/basecerta_backup_${TIMESTAMP}.sql"
BACKUP_COMPRESSED="$BACKUP_DIR/basecerta_backup_${TIMESTAMP}.sql.gz"

# Arquivo de informações do backup
INFO_FILE="$BACKUP_DIR/backup_info_${TIMESTAMP}.txt"

print_info "Pasta de backup: $BACKUP_DIR"
print_info "Arquivo de backup: $BACKUP_FILE"
echo ""

################################################################################
# VERIFICAR SE DOCKER ESTÁ RODANDO
################################################################################

print_info "Verificando se Docker está rodando..."

if ! docker info &> /dev/null; then
    print_error "Docker não está rodando!"
    print_info "Inicie o Docker Desktop e tente novamente"
    exit 1
fi

print_success "Docker está rodando"

################################################################################
# VERIFICAR SE CONTAINER DO POSTGRES ESTÁ ATIVO
################################################################################

print_info "Verificando container do PostgreSQL..."

if ! docker-compose ps postgres | grep -q "Up"; then
    print_error "Container do PostgreSQL não está rodando!"
    print_info "Execute: docker-compose up -d postgres"
    exit 1
fi

print_success "Container PostgreSQL está ativo"

################################################################################
# FAZER BACKUP DO BANCO
################################################################################

print_header "📦 Criando Backup"

print_info "Exportando banco de dados..."
print_warning "Isso pode demorar alguns minutos dependendo do tamanho do banco..."

# Fazer dump do banco usando docker-compose
docker-compose exec -T postgres pg_dump -U aian_db basecerta > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    print_success "Backup SQL criado com sucesso!"
else
    print_error "Erro ao criar backup!"
    exit 1
fi

# Verificar tamanho do arquivo
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
print_info "Tamanho do backup: $BACKUP_SIZE"

################################################################################
# COMPRIMIR BACKUP
################################################################################

print_header "🗜️  Comprimindo Backup"

print_info "Comprimindo arquivo SQL..."
gzip -9 "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    print_success "Backup comprimido com sucesso!"
    COMPRESSED_SIZE=$(du -h "$BACKUP_COMPRESSED" | cut -f1)
    print_info "Tamanho comprimido: $COMPRESSED_SIZE"
else
    print_error "Erro ao comprimir backup!"
fi

################################################################################
# CRIAR ARQUIVO DE INFORMAÇÕES
################################################################################

print_header "📝 Criando Arquivo de Informações"

cat > "$INFO_FILE" << EOF
═══════════════════════════════════════════════════════════
BACKUP DO BANCO DE DADOS - BASECERTA
═══════════════════════════════════════════════════════════

Data/Hora: $(date "+%d/%m/%Y %H:%M:%S")
Usuário: $USER
Hostname: $(hostname)

BANCO DE DADOS:
  Nome: basecerta
  Usuário: aian_db
  
ARQUIVOS:
  Backup SQL: basecerta_backup_${TIMESTAMP}.sql.gz
  Tamanho Original: $BACKUP_SIZE
  Tamanho Comprimido: $COMPRESSED_SIZE
  
VERSÕES:
  PostgreSQL: $(docker-compose exec -T postgres psql -U aian_db -c "SELECT version();" | grep PostgreSQL)
  Docker: $(docker --version)
  
TABELAS PRINCIPAIS:
$(docker-compose exec -T postgres psql -U aian_db -d basecerta -c "\dt cnpj.*" | grep "table")

ESTATÍSTICAS:
  Total de tabelas: $(docker-compose exec -T postgres psql -U aian_db -d basecerta -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'cnpj';")
  Total de registros (empresas): $(docker-compose exec -T postgres psql -U aian_db -d basecerta -t -c "SELECT COUNT(*) FROM cnpj.empresas;" | xargs)
  Total de registros (estabelecimentos): $(docker-compose exec -T postgres psql -U aian_db -d basecerta -t -c "SELECT COUNT(*) FROM cnpj.estabelecimentos;" | xargs)

RESTAURAÇÃO:
  Para restaurar em outro computador, use:
  ./restore-database.sh basecerta_backup_${TIMESTAMP}.sql.gz

═══════════════════════════════════════════════════════════
EOF

print_success "Arquivo de informações criado: $INFO_FILE"

################################################################################
# LISTAR BACKUPS EXISTENTES
################################################################################

print_header "📋 Backups Disponíveis"

echo "Backups na pasta $BACKUP_DIR:"
echo ""
ls -lh "$BACKUP_DIR"/*.gz 2>/dev/null | awk '{print "  " $9 " - " $5}' || echo "  Nenhum backup encontrado"
echo ""

################################################################################
# FINALIZAÇÃO
################################################################################

print_header "✅ Backup Concluído!"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              BACKUP CRIADO COM SUCESSO!                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "📦 Arquivos criados:"
echo "   1. Backup: $BACKUP_COMPRESSED"
echo "   2. Info:   $INFO_FILE"
echo ""

print_info "📤 Para transferir para o novo notebook:"
echo "   1. Copie a pasta 'backups/' inteira"
echo "   2. Ou copie apenas o arquivo: $BACKUP_COMPRESSED"
echo ""

print_info "♻️  Para restaurar no novo notebook:"
echo "   cd /Users/code4us/Documents/ADACODE/basecerta"
echo "   ./restore-database.sh backups/basecerta_backup_${TIMESTAMP}.sql.gz"
echo ""

print_warning "⚠️  IMPORTANTE:"
echo "   - Mantenha o backup em local seguro"
echo "   - Não compartilhe (contém dados sensíveis)"
echo "   - Copie para o novo notebook antes de iniciar o setup"
echo ""

print_success "Backup concluído com sucesso! 🎉"
echo ""
