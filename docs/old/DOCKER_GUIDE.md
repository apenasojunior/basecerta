# 🐳 Guia Docker - BaseCerta

Como rodar toda a aplicação (Backend + Frontend) no Docker.

---

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- PostgreSQL 15 rodando **localmente** (não no Docker)
- Portas livres: 3000 (frontend), 8000 (backend), 6379 (redis)

---

## 🏗️ Arquitetura Docker

### Serviços Containerizados

```
┌─────────────────────────────────────────┐
│         Docker Containers               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────────┐│
│  │   Frontend   │  │    Backend      ││
│  │   Next.js    │  │    FastAPI      ││
│  │   :3000      │  │    :8000        ││
│  └──────────────┘  └─────────────────┘│
│                                         │
│  ┌──────────────┐  ┌─────────────────┐│
│  │    Redis     │  │  Celery Worker  ││
│  │    :6379     │  │                 ││
│  └──────────────┘  └─────────────────┘│
│                                         │
│  ┌──────────────┐                      │
│  │ Celery Beat  │                      │
│  │  (Scheduler) │                      │
│  └──────────────┘                      │
└─────────────────────────────────────────┘
              │
              │ host.docker.internal
              ▼
┌─────────────────────────────────────────┐
│       Host Machine (macOS)              │
├─────────────────────────────────────────┤
│  PostgreSQL 15                          │
│  localhost:5432                         │
│  Database: basecerta                    │
└─────────────────────────────────────────┘
```

### Por que PostgreSQL está fora do Docker?

Por decisão de projeto (conforme COMMANDS.md):
- ✅ Melhor performance no Apple Silicon (ARM64)
- ✅ Evita problemas de persistência de dados
- ✅ PostgreSQL já instalado e configurado localmente
- ✅ Acesso via `host.docker.internal` dos containers

---

## 🚀 Como Rodar no Docker

### 1. Verificar PostgreSQL Local

```bash
# PostgreSQL deve estar rodando
pg_isready

# Testar conexão
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta -c "SELECT 1"
```

### 2. Parar Servidores Locais (se estiverem rodando)

```bash
# Parar frontend local
lsof -ti:3000 | xargs kill -9

# Parar backend local
lsof -ti:8000 | xargs kill -9
```

### 3. Iniciar TODOS os Serviços

```bash
# Na raiz do projeto
cd /Users/linkerx/Documents/ADACODE/basecerta

# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 4. Verificar Status

```bash
# Ver containers rodando
docker-compose ps

# Deve mostrar:
# - basecerta_frontend (porta 3000)
# - basecerta_backend (porta 8000)
# - basecerta_redis (porta 6379)
# - basecerta_celery_worker
# - basecerta_celery_beat
```

### 5. Testar a Aplicação

```bash
# Frontend
curl http://localhost:3000

# Backend Health
curl http://localhost:8000/health

# API Docs
open http://localhost:8000/docs
```

**Abrir no navegador:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs

---

## 🎯 Comandos Úteis Docker

### Gerenciamento Básico

```bash
# Iniciar tudo
docker-compose up -d

# Iniciar apenas frontend e backend
docker-compose up -d frontend backend redis

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Restart de um serviço específico
docker restart basecerta_frontend
docker restart basecerta_backend
```

### Logs

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs do frontend
docker-compose logs -f frontend

# Ver logs do backend
docker-compose logs -f backend

# Últimas 50 linhas
docker-compose logs --tail=50 frontend
```

### Build e Rebuild

```bash
# Rebuild após mudanças no Dockerfile
docker-compose build frontend
docker-compose build backend

# Rebuild sem cache
docker-compose build --no-cache frontend

# Rebuild e restart
docker-compose up -d --build frontend
```

### Acessar Shell dos Containers

```bash
# Shell do frontend
docker-compose exec frontend sh

# Shell do backend
docker-compose exec backend bash

# Executar comando no frontend
docker-compose exec frontend npm run build
```

---

## 📁 Estrutura de Arquivos Docker

### Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev"]
```

### Backend

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
# docker-compose.yml (simplificado)
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DB_HOST=host.docker.internal
      - REDIS_HOST=redis
    extra_hosts:
      - "host.docker.internal:host-gateway"
    
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
```

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente

**Backend (.env):**
```env
# Database (PostgreSQL local)
DB_HOST=host.docker.internal  # ⚠️ Importante para Docker
DB_PORT=5432
DB_NAME=basecerta
DB_USER=aian_db
DB_PASSWORD=P@lm315@s

# Redis (container)
REDIS_HOST=redis  # Nome do serviço no docker-compose
REDIS_PORT=6379
```

**Frontend (.env.local):**
```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Volumes

```yaml
volumes:
  # Frontend - preserva node_modules e .next
  - ./frontend:/app
  - /app/node_modules  # Evita sobrescrever
  - /app/.next         # Evita sobrescrever

  # Backend - código ao vivo
  - ./backend:/app
```

---

## 🐛 Troubleshooting

### Erro: "Could not connect to database"

**Problema:** Backend não consegue conectar ao PostgreSQL local.

**Solução:**
```bash
# 1. Verificar se PostgreSQL está rodando
pg_isready

# 2. Verificar se DB_HOST está correto
echo "DB_HOST=host.docker.internal" >> backend/.env

# 3. Verificar firewall (macOS)
# Sistema → Privacidade e Segurança → Firewall
# Permitir PostgreSQL

# 4. Restart do backend
docker restart basecerta_backend
```

### Erro: "Port 3000 already in use"

**Problema:** Frontend local está rodando.

**Solução:**
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Restart do container
docker restart basecerta_frontend
```

### Erro: "Cannot GET /"

**Problema:** Frontend não está compilando.

**Solução:**
```bash
# Ver logs do frontend
docker-compose logs frontend

# Rebuild
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Ou rodar build manualmente
docker-compose exec frontend npm run build
```

### Erro: "Module not found"

**Problema:** Dependências não instaladas no container.

**Solução:**
```bash
# Reinstalar dependências no container
docker-compose exec frontend npm install

# Ou rebuild
docker-compose build --no-cache frontend
```

### Frontend muito lento no Docker

**Problema:** Hot reload lento no Docker (comum no macOS).

**Solução 1 - Usar polling:**
```json
// package.json
"scripts": {
  "dev": "next dev --turbo"  // Usar Turbopack
}
```

**Solução 2 - Rodar frontend local, backend no Docker:**
```bash
# Parar frontend container
docker-compose stop frontend

# Rodar frontend localmente
cd frontend
npm run dev

# Backend continua no Docker
docker-compose up -d backend redis celery_worker
```

---

## 🔄 Workflows Comuns

### Desenvolvimento Local (Recomendado)

```bash
# Frontend local (hot reload rápido)
cd frontend
npm run dev

# Backend no Docker
docker-compose up -d backend redis celery_worker

# PostgreSQL local (já rodando)
```

**Vantagens:**
- ✅ Hot reload instantâneo no frontend
- ✅ Backend isolado no Docker
- ✅ Melhor performance

### Tudo no Docker (Produção-like)

```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f
```

**Vantagens:**
- ✅ Ambiente idêntico à produção
- ✅ Testa integração completa
- ✅ Fácil deploy

### Desenvolvimento Backend + Frontend Local

```bash
# Backend local
cd backend
python3 run.py

# Frontend local
cd frontend
npm run dev

# Redis no Docker
docker-compose up -d redis

# PostgreSQL local (já rodando)
```

**Vantagens:**
- ✅ Hot reload instantâneo em tudo
- ✅ Debug mais fácil
- ✅ Máxima performance

---

## 📊 Monitoramento

### Ver Uso de Recursos

```bash
# CPU, memória, rede
docker stats

# Só os containers do BaseCerta
docker stats basecerta_frontend basecerta_backend basecerta_redis
```

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Frontend (deve retornar HTML)
curl -I http://localhost:3000

# Redis
docker-compose exec redis redis-cli ping
```

---

## 🚀 Deploy para Produção

### Build de Produção

```bash
# Frontend
cd frontend
npm run build

# Backend (já usa mesma imagem)
# Mudar command no docker-compose:
# command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Variáveis de Produção

```env
# Backend .env
DEBUG=False
DB_HOST=seu-postgres-host.com
SECRET_KEY=chave-super-secreta-gerada

# Frontend .env.local
NEXT_PUBLIC_API_URL=https://api.basecerta.com.br/api/v1
```

---

## 📝 Resumo de Comandos

```bash
# =================== DOCKER ===================

# Iniciar tudo
docker-compose up -d

# Parar tudo
docker-compose down

# Ver logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Rebuild
docker-compose build --no-cache frontend

# Restart
docker restart basecerta_frontend

# Shell
docker-compose exec frontend sh
docker-compose exec backend bash

# Status
docker-compose ps
docker stats


# ============= DESENVOLVIMENTO LOCAL ===========

# Frontend
cd frontend && npm run dev          # http://localhost:3000

# Backend
cd backend && python3 run.py        # http://localhost:8000

# Redis
docker-compose up -d redis

# PostgreSQL (já rodando localmente)
pg_isready


# ================ TROUBLESHOOTING ==============

# Limpar tudo
docker-compose down -v
docker system prune -a

# Rebuild completo
docker-compose build --no-cache
docker-compose up -d

# Ver logs de erro
docker-compose logs --tail=100 frontend
docker-compose logs --tail=100 backend
```

---

## ✅ Checklist de Instalação Docker

- [ ] Docker Desktop instalado
- [ ] PostgreSQL local rodando
- [ ] `docker-compose.yml` configurado
- [ ] `frontend/Dockerfile` criado
- [ ] `backend/Dockerfile` criado
- [ ] `.env` com `DB_HOST=host.docker.internal`
- [ ] Portas 3000, 8000, 6379 livres
- [ ] `docker-compose up -d` executado
- [ ] Frontend acessível em http://localhost:3000
- [ ] Backend acessível em http://localhost:8000
- [ ] Health check do backend OK

---

## 🎯 Recomendação Final

**Para desenvolvimento diário:**
```bash
# Frontend local (melhor hot reload)
cd frontend && npm run dev

# Backend no Docker
docker-compose up -d backend redis celery_worker
```

**Para testar integração completa:**
```bash
# Tudo no Docker
docker-compose up -d
```

**Para produção:**
```bash
# Build otimizado + Docker
docker-compose -f docker-compose.prod.yml up -d
```

---

**Última atualização:** 20/10/2025  
**Versão:** 1.0.0  
**Status:** ✅ Testado e funcionando
