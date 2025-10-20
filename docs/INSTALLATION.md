# 📖 Guia de Instalação - BaseCerta

Guia completo para configurar e rodar o projeto BaseCerta localmente.

---

## 📋 Pré-requisitos

### Obrigatórios

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

### Opcional (para desenvolvimento sem Docker)

- **Node.js 18+** - Para rodar frontend localmente
- **Redis** - Ou usar via Docker

### Verificar instalação

```bash
# Python
python3 --version  # Deve retornar 3.11 ou superior

# PostgreSQL
psql --version     # Deve retornar 15 ou superior

# Docker
docker --version
docker-compose --version

# Git
git --version
```

---

## 🚀 Instalação Rápida (Docker)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/basecerta.git
cd basecerta
```

### 2. Configure variáveis de ambiente

```bash
# Backend
cd backend
cp .env.example .env
# Edite o .env com suas credenciais

# Se o PostgreSQL já estiver rodando localmente:
# DB_HOST=host.docker.internal (no Docker)
# DB_HOST=localhost (fora do Docker)
```

### 3. Inicie os serviços

```bash
cd ..
docker-compose up -d backend redis celery_worker
```

### 4. Aguarde inicialização (30 segundos)

```bash
# Verificar logs
docker-compose logs -f backend
```

### 5. Aplique migrations e seed

```bash
cd backend
alembic upgrade head
python3 scripts/seed_data.py
```

### 6. Teste a instalação

```bash
curl http://localhost:8000/health
```

**Pronto! 🎉**
- Backend: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

---

## 💻 Instalação Local (Sem Docker)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/basecerta.git
cd basecerta
```

### 2. Configure PostgreSQL

```bash
# Crie o banco de dados
createdb basecerta

# Ou via psql:
psql -U postgres
CREATE DATABASE basecerta;
CREATE USER aian_db WITH PASSWORD 'P@lm315@s';
GRANT ALL PRIVILEGES ON DATABASE basecerta TO aian_db;
\q
```

### 3. Configure Redis

```bash
# Inicie Redis via Docker
docker run -d -p 6379:6379 redis:7-alpine

# Ou instale localmente (Mac)
brew install redis
brew services start redis
```

### 4. Configure Backend

```bash
cd backend

# Crie ambiente virtual
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instale dependências
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Edite o .env:
# DB_HOST=localhost
# REDIS_HOST=localhost
```

### 5. Aplique migrations

```bash
alembic upgrade head
```

### 6. Popule dados iniciais

```bash
python3 scripts/seed_data.py
```

### 7. Inicie o servidor

```bash
# Usando run.py
python3 run.py

# Ou manualmente
PYTHONPATH=$(pwd) python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 8. Verifique a instalação

```bash
curl http://localhost:8000/health
```

---

## 🎨 Frontend (Next.js) - Opcional

### 1. Instale Node.js 18+

```bash
node --version  # Deve ser 18+
```

### 2. Configure o frontend

```bash
cd frontend

# Instale dependências
npm install

# Configure variáveis
cp .env.example .env.local
# Edite NEXT_PUBLIC_API_URL se necessário
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

**Acesse:** http://localhost:3000

---

## 🐳 Detalhes do Docker

### Estrutura de Serviços

```yaml
services:
  backend:      # FastAPI (porta 8000)
  redis:        # Redis (porta 6379)
  celery_worker # Worker de tarefas assíncronas
  celery_beat:  # Scheduler de tarefas periódicas
  frontend:     # Next.js (porta 3000) - opcional
```

### Comandos Docker úteis

```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f celery_worker

# Parar tudo
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build backend

# Acessar shell do backend
docker-compose exec backend bash

# Executar migrations no container
docker-compose exec backend alembic upgrade head
```

---

## 🔧 Configuração Avançada

### Celery Worker (Tarefas Assíncronas)

```bash
# Inicie Celery worker localmente
cd backend
celery -A app.tasks.celery_app worker --loglevel=info

# Inicie Celery Beat (scheduler)
celery -A app.tasks.celery_app beat --loglevel=info
```

### Variáveis de Ambiente Importantes

Ver documentação completa em: `docs/ENVIRONMENT_VARIABLES.md`

```env
# Essenciais
DB_NAME=basecerta
DB_USER=aian_db
DB_PASSWORD="P@lm315@s"
DB_HOST=localhost
SECRET_KEY=sua-chave-secreta-aqui

# Debug
DEBUG=True
LOG_LEVEL=INFO
```

### Gerar SECRET_KEY segura

```bash
openssl rand -hex 32
```

---

## ✅ Verificação da Instalação

### 1. Health Check

```bash
curl http://localhost:8000/health
```

Esperado:
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 2. Listar Planos

```bash
curl http://localhost:8000/api/v1/plans/
```

Deve retornar 4 planos (Basic, Smart, Pro, Empresarial)

### 3. Swagger UI

Abra no navegador: http://localhost:8000/docs

### 4. Verificar Banco de Dados

```bash
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta -c "\dt"
```

Deve listar 6 tabelas:
- alembic_version
- users
- plans
- credit_packages
- user_credits
- credit_transactions

---

## 🧪 Executar Testes

```bash
cd backend

# Testes unitários
pytest tests/ -v

# Com cobertura
pytest tests/ --cov=app --cov-report=html
```

---

## 📝 Próximos Passos

Após instalação bem-sucedida:

1. **Explore a API:** http://localhost:8000/docs
2. **Leia a documentação:** `README.md`
3. **Veja exemplos de uso:** `docs/API_EXAMPLES.md`
4. **Configure IDE:** VS Code recomendado com extensões Python

---

## 🆘 Problemas Comuns

### Erro: "Port 8000 is already in use"

```bash
# Encontre e mate o processo
lsof -ti:8000 | xargs kill -9
```

### Erro: "Database connection failed"

```bash
# Verifique PostgreSQL
pg_isready

# Teste conexão manual
psql -h localhost -U aian_db -d basecerta
```

### Erro: "Redis connection failed"

```bash
# Verifique Redis
redis-cli ping  # Deve retornar PONG

# Ou no Docker
docker ps | grep redis
```

### Erro: "Module not found: app"

```bash
# Defina PYTHONPATH
export PYTHONPATH=/caminho/para/basecerta/backend
```

### Docker muito lento no Mac

```bash
# Aumente recursos no Docker Desktop
# Settings → Resources → Increase CPUs and Memory
```

---

## 🔄 Reinstalação Completa

```bash
# Use o script de reset
./scripts/reset.sh

# Ou manualmente:
docker-compose down -v
docker volume prune -f
alembic downgrade base
alembic upgrade head
python3 scripts/seed_data.py
```

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/basecerta/issues)
- **Documentação:** `/docs`
- **Email:** suporte@basecerta.com.br

---

**Última atualização:** 20/10/2025  
**Versão:** 1.0.0
