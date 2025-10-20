#!/bin/bash

# BaseCerta - Script de Reset do Ambiente
# ATENÇÃO: Este script irá APAGAR todos os dados!

set -e

echo "⚠️  BaseCerta - Reset do Ambiente"
echo ""
echo "❌ ATENÇÃO: Este script irá:"
echo "   - Parar todos os containers"
echo "   - Remover volumes (APAGAR DADOS)"
echo "   - Remover imagens"
echo "   - Fazer rebuild completo"
echo ""

read -p "Tem certeza que deseja continuar? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Operação cancelada."
    exit 0
fi

echo ""
echo "🛑 Parando containers..."
docker-compose down -v

echo ""
echo "🗑️  Removendo imagens..."
docker-compose rm -f

echo ""
echo "🔨 Fazendo rebuild..."
docker-compose build --no-cache

echo ""
echo "✅ Reset concluído!"
echo ""
echo "Para iniciar novamente, execute:"
echo "   ./start.sh"
echo ""
