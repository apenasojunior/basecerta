#!/bin/bash

# BaseCerta - Script de Inicialização
# Este script inicializa todo o ambiente de desenvolvimento

set -e

echo "🚀 BaseCerta - Inicializando ambiente..."
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose."
    exit 1
fi

echo "✅ Docker encontrado"
echo ""

# Verificar arquivos .env
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Arquivo backend/.env não encontrado. Criando a partir do .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ backend/.env criado. IMPORTANTE: Configure as variáveis antes de continuar!"
    echo ""
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Arquivo frontend/.env.local não encontrado. Criando a partir do .env.example..."
    cp frontend/.env.example frontend/.env.local
    echo "✅ frontend/.env.local criado"
    echo ""
fi

# Perguntar se deve fazer build
read -p "Fazer build das imagens? (s/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🔨 Fazendo build das imagens..."
    docker-compose build
    echo "✅ Build concluído"
    echo ""
fi

# Iniciar serviços
echo "🚀 Iniciando serviços..."
docker-compose up -d

echo ""
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar status
echo ""
echo "📊 Status dos serviços:"
docker-compose ps

# Aplicar migrations
echo ""
read -p "Aplicar migrations do banco de dados? (s/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "📦 Aplicando migrations..."
    docker-compose exec -T backend alembic upgrade head
    echo "✅ Migrations aplicadas"
fi

echo ""
echo "✅ Ambiente inicializado com sucesso!"
echo ""
echo "📍 Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose logs -f"
echo "   Parar: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
