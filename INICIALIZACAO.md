# 🚀 Guia de Inicialização Rápida - BaseCerta

## ✅ Configurações Aplicadas

Você acabou de configurar:
- ✅ PostgreSQL (localhost:5432)
- ✅ Redis (localhost:6379)  
- ✅ Arquivo `.env` atualizado
- ✅ Docker Compose reinstalado

---

## 📋 Próximos Passos

### 1️⃣ **Testar Conexões**

```bash
# Dar permissão de execução
chmod +x test_connections.py

# Executar teste
python3 test_connections.py
```

Este script verifica:
- ✓ Conexão com PostgreSQL
- ✓ Conexão com Redis
- ✓ Conexão via SQLAlchemy

---

### 2️⃣ **Inicializar Banco de Dados**

```bash
# Dar permissão de execução
chmod +x init-database.sh

# Executar inicialização
./init-database.sh
```

Este script vai:
1. Verificar conexões
2. Limpar banco (opcional)
3. Executar migrações do Alembic
4. Criar tabelas de suporte
5. Criar índices
6. Popular dados iniciais

**OU manualmente:**

```bash
# Entrar no diretório backend
cd backend

# Executar migrações
alembic upgrade head

# Voltar ao diretório raiz
cd ..
```

---

### 3️⃣ **Iniciar Serviços**

#### Opção A: Com Docker Compose (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

#### Opção B: Manualmente (Desenvolvimento)

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Celery Worker (opcional):**
```bash
cd backend
celery -A app.tasks.celery_app worker --loglevel=info
```

**Terminal 4 - Celery Beat (opcional):**
```bash
cd backend
celery -A app.tasks.celery_app beat --loglevel=info
```

---

## 🔍 Verificar Serviços

### PostgreSQL
```bash
# Conectar ao banco
PGPASSWORD=P@lm315@s psql -h localhost -U dev4us -d basecerta

# Listar tabelas
\dt

# Sair
\q
```

### Redis
```bash
# Conectar ao Redis
redis-cli -h localhost -p 6379 -a P@lm315@s

# Testar
ping

# Ver chaves
keys *

# Sair
exit
```

### API Backend
```bash
# Health check
curl http://localhost:8000/health

# Documentação interativa
open http://localhost:8000/docs
```

### Frontend
```bash
# Abrir no navegador
open http://localhost:3000
```

---

## 📊 Estrutura de Tabelas

Após executar as migrações, você terá:

**Tabelas Principais:**
- `empresas` - Dados da empresa (CNPJ base)
- `estabelecimentos` - Estabelecimentos (CNPJ completo)
- `socios` - Sócios das empresas
- `insights_cache` - Cache de estatísticas

**Tabelas de Suporte:**
- `cnaes` - CNAEs e segmentos
- `naturezas_juridicas` - Tipos de natureza jurídica
- `qualificacoes_socios` - Qualificações de sócios
- `motivos_situacao_cadastral` - Motivos de situação
- `municipios` - Municípios brasileiros
- `paises` - Países

---

## 🛠️ Comandos Úteis

### Alembic (Migrações)

```bash
cd backend

# Ver versão atual
alembic current

# Ver histórico
alembic history

# Criar nova migração
alembic revision -m "descrição"

# Aplicar migrações
alembic upgrade head

# Reverter última migração
alembic downgrade -1
```

### Docker

```bash
# Ver containers rodando
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f backend

# Reiniciar um serviço
docker-compose restart backend

# Rebuild e restart
docker-compose up -d --build

# Parar tudo e limpar
docker-compose down -v
```

---

## 🔧 Troubleshooting

### ❌ Erro: "psql: error: connection refused"
```bash
# Verificar se PostgreSQL está rodando
brew services list

# Iniciar PostgreSQL
brew services start postgresql
```

### ❌ Erro: "Could not connect to Redis"
```bash
# Verificar se Redis está rodando
redis-cli ping

# Iniciar Redis
brew services start redis

# OU
redis-server
```

### ❌ Erro: "relation does not exist"
```bash
# Executar migrações
cd backend
alembic upgrade head
```

### ❌ Erro: "ModuleNotFoundError"
```bash
# Instalar dependências
cd backend
pip install -r requirements.txt
```

---

## 📝 Arquivos de Configuração

### `.env` (backend/.env)
```env
POSTGRES_USER=dev4us
POSTGRES_PASSWORD=P@lm315@s
POSTGRES_DB=basecerta
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

REDIS_PASSWORD=P@lm315@s
REDIS_HOST=localhost
REDIS_PORT=6379
```

### `docker-compose.yml`
- Redis: porta 6379
- Backend: porta 8000
- Frontend: porta 3000

---

## ✅ Checklist de Inicialização

- [ ] PostgreSQL instalado e rodando
- [ ] Redis instalado e rodando
- [ ] Arquivo `.env` configurado
- [ ] Conexões testadas (`test_connections.py`)
- [ ] Migrações executadas (`alembic upgrade head`)
- [ ] Backend iniciado (porta 8000)
- [ ] Frontend iniciado (porta 3000)
- [ ] API acessível em http://localhost:8000/docs

---

## 🎯 Próximas Tarefas

1. **Importar dados de CNPJs** (se necessário)
2. **Popular cache de insights** (`populate_insights_cache.py`)
3. **Testar endpoints** da API
4. **Configurar APIs externas** (Predictus, DirectData)

---

## 📚 Documentação Adicional

- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Frontend:** http://localhost:3000

---

**💡 Dica:** Mantenha os terminais de backend e frontend abertos durante o desenvolvimento para ver logs em tempo real!
