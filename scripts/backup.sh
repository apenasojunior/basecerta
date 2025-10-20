#!/bin/bash

###############################################################################
# Script de Backup do Banco de Dados BaseCerta
# Cria backup do PostgreSQL com timestamp
###############################################################################

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configurações
DB_NAME="basecerta"
DB_USER="aian_db"
DB_PASSWORD="P@lm315@s"
DB_HOST="localhost"
DB_PORT="5432"

# Diretório de backups
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/../backups"
mkdir -p "$BACKUP_DIR"

# Timestamp para o arquivo
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/basecerta_backup_$TIMESTAMP.sql"

echo -e "${YELLOW}🗄️  Iniciando backup do banco de dados...${NC}"
echo ""
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo "Output: $BACKUP_FILE"
echo ""

# Executa o backup
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=plain \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    # Compacta o backup
    echo -e "${YELLOW}📦 Compactando backup...${NC}"
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"
    
    # Informações do backup
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ Backup criado com sucesso!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}📄 Arquivo: ${NC}$BACKUP_FILE"
    echo -e "${GREEN}📊 Tamanho: ${NC}$BACKUP_SIZE"
    echo ""
    
    # Limpar backups antigos (manter últimos 7 dias)
    echo -e "${YELLOW}🧹 Limpando backups antigos (>7 dias)...${NC}"
    find "$BACKUP_DIR" -name "basecerta_backup_*.sql.gz" -mtime +7 -delete
    
    # Contar backups restantes
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/basecerta_backup_*.sql.gz 2>/dev/null | wc -l)
    echo -e "${GREEN}📚 Total de backups: ${NC}$BACKUP_COUNT"
    echo ""
    
    echo -e "${YELLOW}💡 Para restaurar este backup, execute:${NC}"
    echo -e "   gunzip -c $BACKUP_FILE | PGPASSWORD='$DB_PASSWORD' psql -h $DB_HOST -U $DB_USER -d $DB_NAME"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Erro ao criar backup!${NC}"
    exit 1
fi
