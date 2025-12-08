# ⚡ Comandos Úteis - BaseCerta

Referência rápida de comandos para desenvolvimento diário.

---

## 🐳 Docker Commands

### Gerenciamento Básico

```bash
# Iniciar todos os serviços (backend + frontend)
docker-compose up -d

# Iniciar apenas backend essencial
docker-compose up -d backend redis celery_worker

# Iniciar backend + frontend
docker-compose up -d backend redis celery_worker frontend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Restart de um serviço específico
docker restart basecerta_backend

# Ver status dos containers
docker-compose ps
```

### Logs e Debug

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do Celery
docker-compose logs -f celery_worker

# Últimas 100 linhas
docker-compose logs --tail=100 backend

# Logs desde um tempo específico
docker-compose logs --since 30m backend
```

### Build e Rebuild

```bash
# Rebuild tudo
docker-compose build

# Rebuild sem cache
docker-compose build --no-cache

# Rebuild e restart
docker-compose up -d --build backend

# Rebuild só o backend
docker-compose build backend
```

### Acesso aos Containers

```bash
# Shell no container backend
docker-compose exec backend bash

# Shell no Redis
docker-compose exec redis redis-cli

# Executar comando único
docker-compose exec backend python3 scripts/seed_data.py
```

---

## 🗄️ Database Commands

### PostgreSQL

```bash
# Conectar ao banco
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta

# Listar tabelas
\dt

# Descrever tabela
\d users

# Executar query
SELECT * FROM users;

# Sair
\q
```

### Alembic (Migrations)

```bash
cd backend

# Criar nova migration
alembic revision --autogenerate -m "descrição da mudança"

# Aplicar migrations
alembic upgrade head

# Reverter última migration
alembic downgrade -1

# Ver histórico
alembic history

# Ver status atual
alembic current

# Reverter todas
alembic downgrade base
```

### Backup e Restore

```bash
# Criar backup
./scripts/backup.sh

# Ou manualmente
PGPASSWORD='P@lm315@s' pg_dump -h localhost -U aian_db basecerta > backup.sql

# Restaurar backup
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db basecerta < backup.sql

# Restaurar backup compactado
gunzip -c backup.sql.gz | PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db basecerta
```

---

## 🐍 Backend Commands

### Desenvolvimento Local

```bash
cd backend

# Iniciar servidor
python3 run.py

# Ou com uvicorn diretamente
PYTHONPATH=$(pwd) python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Iniciar em porta diferente
PYTHONPATH=$(pwd) python3 -m uvicorn app.main:app --reload --port 8001
```

### Python Environment

```bash
# Criar venv
python3 -m venv venv

# Ativar venv (Mac/Linux)
source venv/bin/activate

# Ativar venv (Windows)
venv\Scripts\activate

# Desativar
deactivate

# Instalar dependências
pip install -r requirements.txt

# Atualizar requirements
pip freeze > requirements.txt
```

### Celery

```bash
cd backend

# Iniciar worker
celery -A app.tasks.celery_app worker --loglevel=info

# Iniciar beat (scheduler)
celery -A app.tasks.celery_app beat --loglevel=info

# Ambos juntos
celery -A app.tasks.celery_app worker --beat --loglevel=info

# Ver status
celery -A app.tasks.celery_app inspect active

# Limpar fila
celery -A app.tasks.celery_app purge
```

---

## 🧪 Testing Commands

```bash
cd backend

# Rodar todos os testes
pytest

# Com verbose
pytest -v

# Teste específico
pytest tests/test_crud_user.py

# Com cobertura
pytest --cov=app --cov-report=html

# Ver cobertura no navegador
open htmlcov/index.html
```

---

## 🎨 Frontend Commands (Next.js)

### Desenvolvimento Local

```bash
cd frontend

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Lint
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Formatar código
npm run format
```

### shadcn/ui Components

```bash
cd frontend

# Adicionar componentes
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add table

# Adicionar múltiplos
npx shadcn@latest add button card input label
```

### Testes Frontend

```bash
cd frontend

# Rodar testes
npm run test

# Testes em modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Docker - Frontend

```bash
# Build da imagem
docker-compose build frontend

# Iniciar frontend no Docker
docker-compose up -d frontend

# Ver logs
docker-compose logs -f frontend

# Acessar shell
docker-compose exec frontend sh

# Executar comandos no container
docker-compose exec frontend npm run build
docker-compose exec frontend npm install
```

---

## 📊 Redis Commands

```bash
# Conectar ao Redis
redis-cli

# Ou no Docker
docker-compose exec redis redis-cli

# Comandos Redis:
PING                    # Teste de conexão
KEYS *                  # Listar todas as chaves
GET chave               # Ver valor
DEL chave               # Deletar chave
FLUSHALL                # Limpar tudo (CUIDADO!)
INFO                    # Informações do servidor
CLIENT LIST             # Listar conexões
```

---

## 🌐 API Testing (curl)

### Health Check

```bash
curl http://localhost:8000/health | jq
```

### Users

```bash
# Listar usuários
curl http://localhost:8000/api/v1/users/ | jq

# Criar usuário
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@exemplo.com",
    "full_name": "Novo Usuário"
  }' | jq

# Ver usuário com créditos
curl http://localhost:8000/api/v1/users/1/with-credits | jq
```

### Plans

```bash
# Listar planos
curl http://localhost:8000/api/v1/plans/ | jq

# Ver plano específico
curl http://localhost:8000/api/v1/plans/1 | jq
```

### Credits

```bash
# Ver saldo
curl http://localhost:8000/api/v1/credits/1/balance | jq

# Histórico
curl http://localhost:8000/api/v1/credits/1/history | jq

# Adicionar créditos
curl -X POST http://localhost:8000/api/v1/credits/1/add \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "transaction_type": "purchase",
    "description": "Compra de 100 créditos"
  }' | jq

# Deduzir créditos
curl -X POST "http://localhost:8000/api/v1/credits/1/deduct?amount=5&description=Pesquisa%20PF" | jq
```

---

## 🔧 Maintenance Commands

### Limpeza

```bash
# Limpar cache Python
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Limpar volumes Docker não utilizados
docker volume prune

# Limpar imagens não utilizadas
docker image prune -a

# Limpar tudo (CUIDADO!)
docker system prune -a --volumes
```

### Reset Completo

```bash
# Usar script de reset
./scripts/reset.sh

# Ou manualmente
docker-compose down -v
docker volume rm basecerta_redis_data
docker rmi basecerta-backend basecerta-celery_worker
alembic downgrade base
alembic upgrade head
python3 scripts/seed_data.py
```

### Monitoramento

```bash
# Ver uso de recursos Docker
docker stats

# Ver processos no container
docker-compose exec backend ps aux

# Ver conexões PostgreSQL
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta -c "SELECT * FROM pg_stat_activity;"
```

---

## 🚀 Scripts do Projeto

```bash
# Reset completo do ambiente
./scripts/reset.sh

# Criar backup do banco
./scripts/backup.sh

# Popular dados iniciais
cd backend && python3 scripts/seed_data.py
```

---

## 💡 Aliases Úteis (adicione ao .zshrc ou .bashrc)

```bash
# Adicione ao ~/.zshrc

alias bc-up="docker-compose up -d backend redis celery_worker"
alias bc-down="docker-compose down"
alias bc-logs="docker-compose logs -f backend"
alias bc-restart="docker restart basecerta_backend"
alias bc-shell="docker-compose exec backend bash"
alias bc-db="PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta"
alias bc-redis="docker-compose exec redis redis-cli"
alias bc-test="cd backend && pytest -v"
alias bc-migrate="cd backend && alembic upgrade head"
alias bc-backup="./scripts/backup.sh"
alias bc-reset="./scripts/reset.sh"
```

Após adicionar, rode:
```bash
source ~/.zshrc  # ou source ~/.bashrc
```

---

## 📱 Port Reference

```
8000  - Backend API (FastAPI)
3000  - Frontend (Next.js)
5432  - PostgreSQL
6379  - Redis
5555  - Flower (Celery monitoring) - opcional
```

---

## 🔍 Debug Commands

### Ver configuração atual

```bash
cd backend
python3 -c "from app.core.config import settings; import pprint; pprint.pprint(settings.model_dump())"
```

### Testar conexão PostgreSQL

```bash
python3 -c "from app.core.database import check_db_connection; print(check_db_connection())"
```

### Testar conexão Redis

```bash
python3 -c "import redis; r = redis.from_url('redis://localhost:6379'); print(r.ping())"
```

### Ver tabelas criadas

```bash
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta -c "\dt"
```

### Contar registros

```bash
PGPASSWORD='P@lm315@s' psql -h localhost -U aian_db -d basecerta << EOF
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'plans', COUNT(*) FROM plans
UNION ALL
SELECT 'credit_packages', COUNT(*) FROM credit_packages;
EOF
```

---

## 🎯 Workflows Comuns

### Adicionar nova feature

```bash
1. git checkout -b feature/nome-da-feature
2. # Faça as mudanças
3. alembic revision --autogenerate -m "descrição"
4. alembic upgrade head
5. pytest
6. git commit -m "feat: descrição"
7. git push origin feature/nome-da-feature
```

### Corrigir bug em produção

```bash
1. docker-compose logs -f backend  # Ver erro
2. docker-compose exec backend bash  # Entrar no container
3. # Fazer correção temporária
4. docker restart basecerta_backend
5. # Aplicar fix permanente no código
```

### Atualizar dependências

```bash
1. pip install --upgrade nome-do-pacote
2. pip freeze > requirements.txt
3. docker-compose build backend
4. docker-compose up -d --build backend
```

---

**Última atualização:** 20/10/2025
