#!/bin/bash

# Script para iniciar o ambiente BaseCerta (sem PostgreSQL no Docker)
# PostgreSQL usa a instância local

echo "🚀 BaseCerta - Iniciando ambiente (PostgreSQL local + Redis Docker)..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado."
    exit 1
fi

echo "✅ Docker encontrado"
echo ""

# Limpar containers antigos
echo "🧹 Limpando containers antigos..."
docker-compose down 2>/dev/null

# Puxar imagem Redis
echo "📦 Baixando imagem Redis..."
docker pull redis:7-alpine

# Verificar se a imagem foi baixada
if docker images redis:7-alpine -q | grep -q .; then
    echo "✅ Redis image baixada com sucesso"
else
    echo "❌ Falha ao baixar Redis image"
    exit 1
fi

# Iniciar apenas Redis
echo ""
echo "🚀 Iniciando Redis..."
docker-compose up -d redis

# Aguardar Redis ficar pronto
echo "⏳ Aguardando Redis..."
sleep 5

# Verificar status
echo ""
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Ambiente pronto!"
echo ""
echo "📍 Serviços:"
echo "   Redis: localhost:6379 (Docker)"
echo "   PostgreSQL: localhost:5432 (Local)"
echo ""
echo "🔧 Próximos passos:"
echo "   1. Instalar dependências Python: cd backend && pip3 install -r requirements.txt"
echo "   2. Iniciar backend: cd backend && python3 -m uvicorn app.main:app --reload"
echo "   3. Acessar: http://localhost:8000"
echo ""
