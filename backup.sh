#!/bin/bash

# BaseCerta - Script de Backup do Banco de Dados

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/basecerta_$TIMESTAMP.sql"

echo "💾 BaseCerta - Backup do Banco de Dados"
echo ""

# Criar diretório de backups se não existir
mkdir -p $BACKUP_DIR

echo "📦 Criando backup..."
docker-compose exec -T postgres pg_dump -U aian_db basecerta > $BACKUP_FILE

# Comprimir backup
echo "🗜️  Comprimindo..."
gzip $BACKUP_FILE

echo ""
echo "✅ Backup criado com sucesso!"
echo "📁 Arquivo: ${BACKUP_FILE}.gz"
echo "📊 Tamanho: $(du -h ${BACKUP_FILE}.gz | cut -f1)"
echo ""

# Listar backups existentes
echo "📋 Backups disponíveis:"
ls -lh $BACKUP_DIR/*.gz

echo ""
