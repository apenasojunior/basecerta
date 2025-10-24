# 📚 Variáveis de Ambiente - BaseCerta

Este documento descreve todas as variáveis de ambiente necessárias para rodar o projeto BaseCerta.

---

## 🔧 Backend (.env)

Localização: `backend/.env`

### Database (PostgreSQL)
```env
DB_NAME=basecerta                # Nome do banco de dados
DB_USER=aian_db                  # Usuário do PostgreSQL
DB_PASSWORD="P@lm315@s"          # Senha (use aspas se tiver caracteres especiais)
DB_HOST=localhost                # Host do banco (localhost ou host.docker.internal no Docker)
DB_PORT=5432                     # Porta do PostgreSQL
```

### Redis
```env
REDIS_HOST=localhost             # Host do Redis (ou 'redis' no Docker)
REDIS_PORT=6379                  # Porta do Redis
REDIS_PASSWORD=                  # Senha do Redis (deixe vazio se não tiver)
REDIS_DB=0                       # Número do database Redis
```

### API Server
```env
API_HOST=0.0.0.0                 # Host do servidor (0.0.0.0 para aceitar todas conexões)
API_PORT=8000                    # Porta do servidor
DEBUG=True                       # Modo debug (True para desenvolvimento, False para produção)
```

### Security
```env
# IMPORTANTE: Gere uma chave secreta forte para produção!
# Gerar com: openssl rand -hex 32
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ALGORITHM=HS256                  # Algoritmo de criptografia JWT
ACCESS_TOKEN_EXPIRE_MINUTES=30  # Tempo de expiração do token de acesso (minutos)
REFRESH_TOKEN_EXPIRE_DAYS=7     # Tempo de expiração do refresh token (dias)
```

### Logging
```env
LOG_LEVEL=INFO                   # Nível de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
```

### CORS
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### APIs Externas (Opcional - será usado em sprints futuras)
```env
# Predictus API
PREDICTUS_API_KEY=               # Chave da API Predictus
PREDICTUS_API_URL=               # URL da API Predictus

# DirectData API
DIRECTDATA_API_KEY=              # Chave da API DirectData
DIRECTDATA_API_URL=              # URL da API DirectData
```

---

## 🎨 Frontend (.env.local)

Localização: `frontend/.env.local`

### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1  # URL base da API backend
```

### App Configuration
```env
NEXT_PUBLIC_APP_NAME=BaseCerta              # Nome da aplicação
NEXT_PUBLIC_APP_VERSION=1.0.0               # Versão da aplicação
```

### Feature Flags (Opcional)
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=false          # Habilitar analytics
NEXT_PUBLIC_ENABLE_CACHE=true               # Habilitar cache de consultas
```

---

## 🐳 Docker Compose (Sobrescreve .env quando em container)

O `docker-compose.yml` sobrescreve algumas variáveis para funcionar em containers:

```yaml
environment:
  - DB_HOST=host.docker.internal  # Acessa PostgreSQL local do Mac
  - REDIS_HOST=redis              # Nome do serviço Redis no Docker
```

---

## 📝 Exemplo Completo (.env.example)

Copie este arquivo para `.env` e ajuste os valores:

```env
# Database
DB_NAME=basecerta
DB_USER=aian_db
DB_PASSWORD="P@lm315@s"
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Security (MUDE EM PRODUÇÃO!)
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7

# Logging
LOG_LEVEL=INFO

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

---

## 🔒 Segurança

### ⚠️ NUNCA commite o arquivo `.env` no Git!

O arquivo `.gitignore` já está configurado para ignorar:
```
.env
.env.local
.env.*.local
```

### Gerar SECRET_KEY segura

```bash
# No terminal:
openssl rand -hex 32
```

### Variáveis Sensíveis

Estas variáveis NUNCA devem ser expostas publicamente:
- ✅ `DB_PASSWORD`
- ✅ `SECRET_KEY`
- ✅ `PREDICTUS_API_KEY`
- ✅ `DIRECTDATA_API_KEY`
- ✅ `REDIS_PASSWORD`

---

## 🎯 Por Ambiente

### Desenvolvimento Local
```env
DB_HOST=localhost
REDIS_HOST=localhost
DEBUG=True
```

### Docker (Development)
```env
DB_HOST=host.docker.internal
REDIS_HOST=redis
DEBUG=True
```

### Produção
```env
DB_HOST=seu-servidor-postgresql.com
REDIS_HOST=seu-servidor-redis.com
DEBUG=False
SECRET_KEY=GERE_UMA_CHAVE_FORTE_AQUI
LOG_LEVEL=WARNING
```

---

## 🧪 Testando Configuração

### Backend
```bash
cd backend
python3 -c "from app.core.config import settings; print(f'DB: {settings.database_url}')"
```

### Health Check
```bash
curl http://localhost:8000/health
```

Deve retornar:
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## 📞 Troubleshooting

### Erro: "Database connection failed"
- ✅ Verifique se PostgreSQL está rodando: `pg_isready`
- ✅ Teste conexão: `psql -h localhost -U aian_db -d basecerta`
- ✅ Verifique DB_PASSWORD (use aspas se tiver @ ou caracteres especiais)

### Erro: "Redis connection failed"
- ✅ Verifique se Redis está rodando: `redis-cli ping`
- ✅ Ou no Docker: `docker ps | grep redis`

### Erro: "Module not found"
- ✅ Instale dependências: `pip3 install -r requirements.txt`

---

**Última atualização:** 20/10/2025
