# 🚀 Setup Automatizado - BaseCerta

## Para Novo Computador (com pasta ADACODE copiada)

### Opção 1: Setup Automático (Recomendado)

```bash
# Navegue até a pasta onde está o projeto (adapte para seu usuário)
cd /Users/code4us/Documents/ADACODE/basecerta

# Ou se estiver em ~/Documents/ADACODE/basecerta
cd ~/Documents/ADACODE/basecerta

# Execute o script
./setup-new-machine.sh
```

> 💡 O script detecta automaticamente o diretório, funciona em qualquer máquina!

**O script irá automaticamente:**
- ✅ Instalar Homebrew (se não tiver)
- ✅ Instalar Docker Desktop (se não tiver)
- ✅ Instalar Node.js 20+ (se não tiver)
- ✅ Instalar Python 3.11+ (se não tiver)
- ✅ Configurar arquivos .env
- ✅ Subir containers Docker (PostgreSQL + Redis + Backend)
- ✅ Popular cache de insights
- ✅ Instalar dependências do frontend
- ✅ Criar scripts de atalho (start.sh, stop.sh, logs.sh)

### Opção 2: Setup Manual

Se preferir fazer manualmente ou se o script der erro:

#### 1. Instalar Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Instalar Docker Desktop
```bash
brew install --cask docker
# Abrir Docker Desktop manualmente e aceitar termos
```

#### 3. Instalar Node.js
```bash
brew install node@20
```

#### 4. Configurar arquivos .env
```bash
# Backend
cp .env.example .env

# Frontend
cd frontend
cp .env.example .env.local
```

#### 5. Iniciar Backend
```bash
docker-compose up -d
docker-compose exec backend python scripts/populate_insights_cache.py
```

#### 6. Instalar dependências do Frontend
```bash
cd frontend
npm install
```

---

## 📦 Scripts de Atalho

Após rodar `setup-new-machine.sh`, você terá:

### `./start.sh`
Inicia tudo automaticamente (Backend + Frontend)
```bash
./start.sh
```

### `./stop.sh`
Para tudo (Backend + Frontend)
```bash
./stop.sh
```

### `./logs.sh`
Mostra logs do Backend em tempo real
```bash
./logs.sh
```

---

## 🌐 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

---

## 🔧 Comandos Úteis

### Docker
```bash
# Ver containers rodando
docker-compose ps

# Logs do backend
docker-compose logs backend

# Logs em tempo real
docker-compose logs -f backend

# Entrar no container do backend
docker-compose exec backend bash

# Parar tudo
docker-compose down

# Reiniciar tudo
docker-compose restart
```

### Frontend
```bash
cd frontend

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

### Backend
```bash
# Popular cache de insights
docker-compose exec backend python scripts/populate_insights_cache.py

# Acessar Python REPL
docker-compose exec backend python

# Migrations
docker-compose exec backend alembic upgrade head
docker-compose exec backend alembic revision --autogenerate -m "descrição"
```

---

## 🐛 Troubleshooting

### Docker não inicia
```bash
# Verificar se está instalado
docker --version

# Abrir Docker Desktop manualmente
open -a Docker

# Aguardar alguns segundos e testar
docker ps
```

### Porta 5432 ocupada (PostgreSQL)
```bash
# Verificar o que está usando a porta
lsof -i :5432

# Parar serviço local (se houver)
brew services stop postgresql

# Ou usar porta diferente no .env
POSTGRES_PORT=5433
```

### Porta 3000 ocupada (Frontend)
```bash
# Verificar o que está usando
lsof -i :3000

# Usar porta diferente
cd frontend
PORT=3001 npm run dev
```

### Cache de insights não popula
```bash
# Verificar logs
docker-compose logs backend

# Tentar manualmente
docker-compose exec backend python scripts/populate_insights_cache.py

# Se persistir, verificar conexão com banco
docker-compose exec backend python -c "from app.core.database import engine; print(engine.connect())"
```

### Frontend não conecta com Backend
```bash
# Verificar .env.local
cat frontend/.env.local
# Deve ter: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Testar backend manualmente
curl http://localhost:8000/health

# Verificar se backend está rodando
docker-compose ps
```

---

## 📊 Estrutura do Projeto

```
basecerta/
├── backend/           # API FastAPI + PostgreSQL
│   ├── app/          # Código fonte
│   ├── alembic/      # Migrations
│   └── scripts/      # Scripts utilitários
├── frontend/         # Next.js + React
│   ├── src/          # Código fonte
│   └── public/       # Assets estáticos
├── docs/             # Documentação
├── scripts/          # Scripts auxiliares
├── docker-compose.yml
├── setup-new-machine.sh  # Setup automático
├── start.sh         # Iniciar tudo
├── stop.sh          # Parar tudo
└── logs.sh          # Ver logs
```

---

## 🎯 Próximos Passos

Após setup completo:

1. **Acessar o frontend**: http://localhost:3000
2. **Testar Smart CNPJ**: /smart-cnpj
3. **Ver insights**: /smart-cnpj (página inicial)
4. **Testar similares**: /smart-cnpj/similares
5. **Explorar API**: http://localhost:8000/docs

---

## 📝 Notas Importantes

- ⚠️ **Docker Desktop precisa estar rodando** para o backend funcionar
- ⚠️ **Node.js 18+** é necessário para o frontend
- ⚠️ **Python 3.11+** é necessário se rodar backend local (sem Docker)
- ✅ **Recomendado usar Docker** para backend (mais fácil)
- ✅ **Porta 3000** para frontend, **8000** para backend

---

## 🆘 Suporte

Se tiver problemas:

1. Verificar logs: `./logs.sh`
2. Reiniciar containers: `docker-compose restart`
3. Limpar tudo e reiniciar: `docker-compose down -v && docker-compose up -d`
4. Verificar documentação em `docs/`

---

**Última atualização**: 08/12/2025  
**Branch**: beta004  
**Sprint**: smart-cnpj-search
