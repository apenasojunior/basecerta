#!/bin/bash

###############################################################################
# Script de Reset Completo do Ambiente BaseCerta
# Remove containers, volumes, rebuilda e reinicia tudo do zero
###############################################################################

set -e

echo "🔥 Iniciando reset completo do ambiente BaseCerta..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretório base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo -e "${YELLOW}📦 Parando todos os containers...${NC}"
docker-compose down -v || true
echo ""

echo -e "${YELLOW}🗑️  Removendo volumes do Docker...${NC}"
docker volume rm basecerta_redis_data 2>/dev/null || true
echo ""

echo -e "${YELLOW}🐳 Removendo imagens antigas...${NC}"
docker rmi basecerta-backend 2>/dev/null || true
docker rmi basecerta-celery_worker 2>/dev/null || true
docker rmi basecerta-frontend 2>/dev/null || true
echo ""

echo -e "${YELLOW}🔧 Limpando cache do Python...${NC}"
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
echo ""

echo -e "${YELLOW}📊 Limpando banco de dados PostgreSQL...${NC}"
echo "⚠️  Isso vai DROPAR todas as tabelas do banco basecerta!"
read -p "Tem certeza? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta << EOF
    DROP TABLE IF EXISTS alembic_version CASCADE;
    DROP TABLE IF EXISTS credit_transactions CASCADE;
    DROP TABLE IF EXISTS user_credits CASCADE;
    DROP TABLE IF EXISTS credit_packages CASCADE;
    DROP TABLE IF EXISTS plans CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TYPE IF EXISTS plantype CASCADE;
    DROP TYPE IF EXISTS transactiontype CASCADE;
EOF
    echo -e "${GREEN}✅ Banco de dados limpo!${NC}"
else
    echo -e "${YELLOW}⏭️  Pulando limpeza do banco de dados${NC}"
fi
echo ""

echo -e "${YELLOW}🏗️  Reconstruindo imagens Docker...${NC}"
docker-compose build --no-cache
echo ""

echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker-compose up -d backend redis celery_worker
echo ""

echo -e "${YELLOW}⏳ Aguardando backend iniciar...${NC}"
sleep 5
echo ""

echo -e "${YELLOW}📦 Aplicando migrations...${NC}"
cd backend
alembic upgrade head
echo ""

echo -e "${YELLOW}🌱 Populando dados iniciais (seed)...${NC}"
python3 scripts/seed_data.py
echo ""

cd "$PROJECT_ROOT"

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Reset completo finalizado com sucesso!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 Serviços disponíveis:${NC}"
echo -e "   • Backend: ${GREEN}http://localhost:8000${NC}"
echo -e "   • Swagger: ${GREEN}http://localhost:8000/docs${NC}"
echo -e "   • Health:  ${GREEN}http://localhost:8000/health${NC}"
echo ""
echo -e "${YELLOW}📋 Comandos úteis:${NC}"
echo -e "   • Ver logs:        ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "   • Parar tudo:      ${YELLOW}docker-compose down${NC}"
echo -e "   • Status:          ${YELLOW}docker-compose ps${NC}"
echo ""
