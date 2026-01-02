#!/bin/bash

# Script de Inicialização do Banco de Dados
# Cria todas as tabelas e estruturas necessárias

set -e  # Para o script se houver erro

echo "🚀 Iniciando setup do banco de dados..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar conexão com PostgreSQL
echo -e "${YELLOW}📊 Verificando conexão com PostgreSQL...${NC}"
if PGPASSWORD=P@lm315@s psql -h localhost -U dev4us -d basecerta -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL conectado${NC}"
else
    echo -e "${RED}✗ Erro ao conectar no PostgreSQL${NC}"
    echo "Verifique se o PostgreSQL está rodando e as credenciais estão corretas"
    exit 1
fi

# 2. Verificar conexão com Redis
echo -e "${YELLOW}🔴 Verificando conexão com Redis...${NC}"
if redis-cli -h localhost -p 6379 -a P@lm315@s ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis conectado${NC}"
else
    echo -e "${RED}✗ Erro ao conectar no Redis${NC}"
    echo "Verifique se o Redis está rodando"
    exit 1
fi

# 3. Limpar banco (opcional - cuidado!)
read -p "$(echo -e ${YELLOW}⚠️  Deseja limpar todas as tabelas existentes? [y/N]:${NC} )" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗑️  Limpando tabelas existentes...${NC}"
    PGPASSWORD=P@lm315@s psql -h localhost -U dev4us -d basecerta -c "
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO dev4us;
        GRANT ALL ON SCHEMA public TO public;
    "
    echo -e "${GREEN}✓ Banco limpo${NC}"
fi

# 4. Executar migrações Alembic
echo -e "${YELLOW}📝 Executando migrações do Alembic...${NC}"
cd backend
alembic upgrade head
cd ..
echo -e "${GREEN}✓ Migrações executadas${NC}"

# 5. Criar tabelas de suporte (CNAEs, Naturezas, etc)
echo -e "${YELLOW}📋 Criando tabelas de suporte...${NC}"
if [ -f "backend/scripts/03_create_support_tables.sql" ]; then
    PGPASSWORD=P@lm315@s psql -h localhost -U dev4us -d basecerta -f backend/scripts/03_create_support_tables.sql
    echo -e "${GREEN}✓ Tabelas de suporte criadas${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo de tabelas de suporte não encontrado${NC}"
fi

# 6. Criar índices
echo -e "${YELLOW}🔍 Criando índices de performance...${NC}"
if [ -f "backend/scripts/02_create_indexes.sql" ]; then
    PGPASSWORD=P@lm315@s psql -h localhost -U dev4us -d basecerta -f backend/scripts/02_create_indexes.sql
    echo -e "${GREEN}✓ Índices criados${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo de índices não encontrado${NC}"
fi

# 7. Popular dados iniciais (seed)
echo -e "${YELLOW}🌱 Populando dados iniciais...${NC}"
if [ -f "backend/scripts/seed_data.py" ]; then
    cd backend
    python3 scripts/seed_data.py
    cd ..
    echo -e "${GREEN}✓ Dados iniciais inseridos${NC}"
else
    echo -e "${YELLOW}⚠️  Script de seed não encontrado${NC}"
fi

# 8. Verificar estrutura criada
echo -e "${YELLOW}🔍 Verificando estrutura do banco...${NC}"
PGPASSWORD=P@lm315@s psql -h localhost -U dev4us -d basecerta -c "
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename;
"

echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Inicie o backend: cd backend && uvicorn app.main:app --reload"
echo "2. Inicie o Redis (se não estiver rodando): redis-server"
echo "3. Inicie o frontend: cd frontend && npm run dev"
echo ""
echo -e "${GREEN}Banco de dados pronto para uso! 🎉${NC}"
