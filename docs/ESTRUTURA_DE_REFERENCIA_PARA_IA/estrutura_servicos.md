# 🔧 Estrutura de Serviços e Tecnologias

**Projeto:** BaseCerta  
**Arquitetura:** Microserviços Dockerizados + PostgreSQL Externo  
**Última Atualização:** 24/10/2025

---

## 📑 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Serviços Docker](#serviços-docker)
4. [Banco de Dados PostgreSQL](#banco-de-dados-postgresql)
5. [APIs Externas](#apis-externas)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Rede e Comunicação](#rede-e-comunicação)
8. [Scripts de Automação](#scripts-de-automação)
9. [Fluxo de Dados](#fluxo-de-dados)
10. [Monitoramento e Logs](#monitoramento-e-logs)

---

## 🏗️ Visão Geral da Arquitetura

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 14)                          │
│  Container: basecerta_frontend                                   │
│  Port: 3000                                                      │
│  - React 18 + TypeScript                                        │
│  - Tailwind CSS + shadcn/ui                                     │
│  - App Router                                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│  Container: basecerta_backend                                    │
│  Port: 8000                                                      │
│  - Python 3.11                                                   │
│  - FastAPI + Uvicorn                                            │
│  - SQLAlchemy ORM                                               │
│  - Pydantic v2                                                  │
└───────┬─────────────┬───────────────────┬──────────────────────┘
        │             │                   │
        ↓             ↓                   ↓
    ┌────────┐   ┌─────────┐      ┌──────────────┐
    │ Redis  │   │ Celery  │      │ PostgreSQL   │
    │ Cache  │   │ Workers │      │ (EXTERNO)    │
    └────────┘   └─────────┘      └──────────────┘
                                         │
                                         ↓
                               ┌──────────────────┐
                               │ Schema: cnpj     │
                               │ - empresas       │
                               │ - estabelec...   │
                               │ - socios         │
                               │ (64M+ records)   │
                               └──────────────────┘
                               ┌──────────────────┐
                               │ Schema: public   │
                               │ - users          │
                               │ - user_credits   │
                               │ - pesquisa_cnpj  │
                               └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        APIS EXTERNAS                             │
│  - Predictus API (Dados 360° PJ, Processos)                     │
│  - DirectData API (Dados 360° PF, Antifraude)                   │
│  - Google Maps API (Mapas e Geocoding)                          │
│  - Gateway Pagamento (Asaas/Stripe) - futuro                    │
└─────────────────────────────────────────────────────────────────┘
```

### Características da Arquitetura

**Tipo:** Monolito Modular Dockerizado + Banco Externo

**Padrões:**
- **Frontend:** Server-Side Rendering (SSR) + Client-Side Rendering (CSR)
- **Backend:** API REST + Background Jobs (Celery)
- **Database:** Relational (PostgreSQL) + Cache (Redis)
- **Comunicação:** HTTP/REST, WebSockets (futuro para alertas)

**Vantagens:**
- ✅ Separação clara de responsabilidades
- ✅ Escalabilidade horizontal (containers)
- ✅ Cache distribuído (Redis)
- ✅ Background jobs (Celery)
- ✅ Banco externo permite backup independente

**Limitações:**
- ⚠️ PostgreSQL externo: latência adicional do Docker
- ⚠️ Autenticação ainda não implementada
- ⚠️ Rate limiting pendente

---

## 💻 Stack Tecnológico

### Frontend

**Framework Principal:**
- **Next.js 14** - Framework React com SSR/SSG
- **React 18** - Biblioteca UI
- **TypeScript 5** - Tipagem estática

**Estilização:**
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes base
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones

**Estado e Dados:**
- **React Hooks** - Gerenciamento de estado local
- **Fetch API** - Requisições HTTP
- **SWR** (futuro) - Cache e revalidação

**Formulários e Validação:**
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

**Utilitários:**
- **date-fns** - Manipulação de datas
- **class-variance-authority** - Variants de componentes
- **clsx** - Composição de classes CSS

---

### Backend

**Framework Principal:**
- **FastAPI 0.104+** - Framework web assíncrono
- **Uvicorn** - ASGI server
- **Pydantic v2** - Validação de dados

**ORM e Banco:**
- **SQLAlchemy 2.0** - ORM
- **Alembic** - Migrações de banco
- **psycopg2-binary** - Driver PostgreSQL

**Autenticação e Segurança:**
- **python-jose** - JWT tokens
- **passlib[bcrypt]** - Hash de senhas
- **python-multipart** - Upload de arquivos

**Cache e Jobs:**
- **Redis** - Cache distribuído
- **Celery** - Background jobs
- **Flower** (futuro) - Monitoramento Celery

**APIs Externas:**
- **httpx** - Cliente HTTP assíncrono
- **requests** - Cliente HTTP síncrono

**Utilitários:**
- **python-dotenv** - Variáveis de ambiente
- **pydantic-settings** - Configurações tipadas
- **tenacity** - Retry logic

**Desenvolvimento:**
- **pytest** - Testes
- **black** - Formatação de código
- **flake8** - Linting
- **mypy** - Type checking

---

### Banco de Dados

**SGBD:**
- **PostgreSQL 14+** - Banco relacional

**Extensões:**
- **pg_trgm 1.6** - Busca textual trigram
- **plpgsql 1.0** - Linguagem procedural

**Schemas:**
- `public` - Dados da aplicação (users, credits, searches)
- `cnpj` - Dados CNPJ da Receita Federal

**Tamanho Total:**
- ~58 GB de dados
- 159 milhões de registros

---

### Infraestrutura

**Containerização:**
- **Docker** - Containers
- **Docker Compose** - Orquestração

**Redes:**
- **basecerta_network** - Bridge network

**Volumes:**
- `redis_data` - Persistência Redis

**Host Networking:**
- `host.docker.internal` - Acesso ao PostgreSQL do host

---

## 🐳 Serviços Docker

### 1. Redis (Cache)

**Container:** `basecerta_redis`  
**Imagem:** `redis:7-alpine`  
**Porta:** `6379:6379`

**Função:**
- Cache de resultados de APIs externas
- Session storage (futuro)
- Broker de mensagens para Celery

**Configuração:**
```yaml
redis:
  image: redis:7-alpine
  container_name: basecerta_redis
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
  networks:
    - basecerta_network
```

**Health Check:**
- Comando: `redis-cli ping`
- Intervalo: 10 segundos
- Retries: 5 tentativas

**Persistência:**
- Volume: `redis_data`
- RDB snapshots automáticos

**TTL de Cache:**
- Predictus PJ: 7 dias
- Predictus Processos: 30 dias
- DirectData PF: 7 dias

---

### 2. Backend (FastAPI)

**Container:** `basecerta_backend`  
**Build:** `./backend/Dockerfile`  
**Porta:** `8000:8000`

**Função:**
- API REST principal
- Integração com PostgreSQL
- Integração com Redis
- Processamento de requests

**Configuração:**
```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: basecerta_backend
  command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ports:
    - "8000:8000"
  volumes:
    - ./backend:/app
  env_file:
    - ./backend/.env
  environment:
    - DB_HOST=host.docker.internal
    - REDIS_HOST=redis
  depends_on:
    redis:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
  networks:
    - basecerta_network
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

**Health Check:**
- Endpoint: `GET /health`
- Intervalo: 30 segundos
- Timeout: 10 segundos

**Dependências:**
- ✅ Redis (service_healthy)

**Volumes:**
- `./backend:/app` - Hot reload

**Variáveis de Ambiente:**
- `DB_HOST=host.docker.internal` - PostgreSQL no host
- `REDIS_HOST=redis` - Redis no Docker

**Extra Hosts:**
- `host.docker.internal:host-gateway` - Acesso ao host

---

### 3. Celery Worker

**Container:** `basecerta_celery_worker`  
**Build:** `./backend/Dockerfile`  
**Porta:** Nenhuma (interno)

**Função:**
- Processar jobs assíncronos
- Atualizações de cache
- Geração de relatórios
- Envio de emails (futuro)

**Configuração:**
```yaml
celery_worker:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: basecerta_celery_worker
  command: celery -A app.tasks.celery_app worker --loglevel=info
  volumes:
    - ./backend:/app
  env_file:
    - ./backend/.env
  environment:
    - DB_HOST=host.docker.internal
    - REDIS_HOST=redis
  depends_on:
    - redis
    - backend
  networks:
    - basecerta_network
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

**Broker:** Redis  
**Backend:** Redis  
**Concurrency:** Default (número de CPUs)

**Tasks Implementadas:**
- ⏳ `sync_cnpj_data` - Atualizar base CNPJ (futuro)
- ⏳ `generate_pdf_report` - Gerar PDFs
- ⏳ `send_alert_email` - Enviar alertas

---

### 4. Celery Beat (Scheduler)

**Container:** `basecerta_celery_beat`  
**Build:** `./backend/Dockerfile`  
**Porta:** Nenhuma (interno)

**Função:**
- Agendar tasks periódicas
- Cron jobs

**Configuração:**
```yaml
celery_beat:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: basecerta_celery_beat
  command: celery -A app.tasks.celery_app beat --loglevel=info
  volumes:
    - ./backend:/app
  env_file:
    - ./backend/.env
  environment:
    - DB_HOST=host.docker.internal
    - REDIS_HOST=redis
  depends_on:
    - redis
    - backend
  networks:
    - basecerta_network
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

**Schedule File:** `backend/celerybeat-schedule`

**Tarefas Agendadas (futuro):**
- Atualização diária de cache
- Backup de banco
- Limpeza de dados antigos

---

### 5. Frontend (Next.js)

**Container:** `basecerta_frontend`  
**Build:** `./frontend/Dockerfile`  
**Porta:** `3000:3000`

**Função:**
- Interface web
- SSR/SSG de páginas
- Client-side rendering

**Configuração:**
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  container_name: basecerta_frontend
  command: npm run dev
  ports:
    - "3000:3000"
  volumes:
    - ./frontend:/app
    - /app/node_modules
    - /app/.next
  env_file:
    - ./frontend/.env.local
  environment:
    - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
  depends_on:
    - backend
  networks:
    - basecerta_network
```

**Volumes:**
- `./frontend:/app` - Hot reload
- `/app/node_modules` - Cache de dependências
- `/app/.next` - Cache de build

**Variáveis:**
- `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

**Modo de Desenvolvimento:**
- Hot Module Replacement (HMR)
- Fast Refresh

---

## 🗄️ Banco de Dados PostgreSQL

### Configuração

**Localização:** Host (fora do Docker)  
**Porta:** `5432`  
**Database:** `basecerta`  
**User:** `aian_db`

**Acesso do Docker:**
- Host: `host.docker.internal`
- Conexão: `postgresql://aian_db:***@host.docker.internal:5432/basecerta`

### Schemas

**1. public** - Dados da aplicação
- `users` - Usuários do sistema
- `user_credits` - Saldo de créditos
- `credit_transactions` - Histórico de transações
- `credit_packages` - Pacotes disponíveis
- `plans` - Planos de assinatura
- `pesquisa_cnpj` - Histórico de buscas Smart CNPJ
- `alembic_version` - Controle de migrações

**2. cnpj** - Dados CNPJ Receita Federal
- `empresas` - 64.9M empresas
- `estabelecimentos` - 68M estabelecimentos
- `socios` - 26.5M sócios
- `simples` - Optantes Simples Nacional
- `cnaes` - Códigos CNAE
- `municipios` - Municípios brasileiros
- `naturezas_juridicas` - Naturezas jurídicas
- `qualificacoes_socios` - Qualificações
- `motivos_situacao_cadastral` - Motivos
- `paises` - Países

### Extensões

**pg_trgm (v1.6):**
- Busca textual com trigrams
- Permite `ILIKE '%termo%'` performático
- Usado em índices GIN

**plpgsql (v1.0):**
- Linguagem procedural
- Triggers e funções

### Migrações

**Ferramenta:** Alembic

**Diretório:** `backend/alembic/versions/`

**Comandos:**
```bash
# Criar migração
alembic revision --autogenerate -m "descrição"

# Aplicar migrações
alembic upgrade head

# Reverter migração
alembic downgrade -1
```

---

## 🌐 APIs Externas

### 1. Predictus API

**Uso:** Dados 360° PJ, Processos Judiciais

**Base URL:** `https://predictus.api.com` (exemplo)

**Autenticação:** API Key no header

**Endpoints Usados:**
```
GET /v1/pj/{cnpj}           # Dossiê completo PJ
GET /v1/processos/pf/{cpf}  # Processos PF
GET /v1/processos/pj/{cnpj} # Processos PJ
GET /v1/processo/{numero}   # Detalhes processo
```

**Rate Limit:**
- 100 requests/minuto
- 10.000 requests/dia

**Cache:**
- TTL: 7 dias (dossiê PJ)
- TTL: 30 dias (processos)

**Cliente:**
- Arquivo: `backend/app/services/predictus_service.py`
- Classe: `PredictusAPIClient`
- Retry: 3 tentativas com backoff

---

### 2. DirectData API

**Uso:** Dados 360° PF, Score de Crédito, Antifraude

**Base URL:** `https://directdata.api.com` (exemplo)

**Autenticação:** API Key no header

**Endpoints Usados:**
```
GET /v1/pf/{cpf}            # Dossiê completo PF
GET /v1/score/{cpf}         # Score QUOD
GET /v1/protestos/{cpf}     # Protestos
GET /v1/antifraude/pix/{chave} # Antifraude PIX
```

**Rate Limit:**
- 50 requests/minuto
- 5.000 requests/dia

**Cache:**
- TTL: 7 dias (dossiê PF)
- TTL: 1 dia (score)

**Cliente:**
- Arquivo: `backend/app/services/directdata_service.py`
- Classe: `DirectDataAPIClient`
- Retry: 3 tentativas com backoff

---

### 3. Google Maps API

**Uso:** Mapas, Geocoding

**Serviços:**
- **Maps JavaScript API** - Mapas interativos
- **Geocoding API** - CEP → Lat/Long

**Autenticação:** API Key

**Endpoints:**
```
GET /maps/api/geocode/json?address={cep}
GET /maps/api/js?key={API_KEY}
```

**Configuração Frontend:**
```typescript
// .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=***

// Componente
<GoogleMap
  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
  center={{ lat: -23.5505, lng: -46.6333 }}
  zoom={15}
/>
```

**Custo:**
- Até 28.000 mapas carregados/mês: grátis
- $7.00 por 1.000 carregamentos adicionais

---

### 4. Gateway de Pagamento (Futuro)

**Opções:**
- **Asaas** - Brasileiro, PIX nativo
- **Stripe** - Internacional, cartões

**Funcionalidades:**
- Checkout de créditos
- Assinaturas de planos
- Webhooks de confirmação

**Integração:**
- Arquivo: `backend/app/services/payment_service.py`
- Endpoints: `POST /api/v1/payments/checkout`

---

## 🔐 Variáveis de Ambiente

### Backend (.env)

```bash
# Aplicação
APP_NAME=BaseCerta
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=sua_chave_secreta_aqui

# Banco de Dados
DB_HOST=host.docker.internal
DB_PORT=5432
DB_NAME=basecerta
DB_USER=aian_db
DB_PASSWORD=***

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

# Celery
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# APIs Externas
PREDICTUS_API_KEY=***
PREDICTUS_BASE_URL=https://api.predictus.com
DIRECTDATA_API_KEY=***
DIRECTDATA_BASE_URL=https://api.directdata.com

# JWT
JWT_SECRET_KEY=sua_chave_jwt_aqui
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000

# Logs
LOG_LEVEL=INFO
```

---

### Frontend (.env.local)

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=***

# Ambiente
NEXT_PUBLIC_ENVIRONMENT=development

# Analytics (futuro)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🌐 Rede e Comunicação

### Docker Network

**Nome:** `basecerta_network`  
**Driver:** `bridge`  
**Subnet:** Alocado automaticamente pelo Docker

**Containers na rede:**
1. `basecerta_redis` (redis:6379)
2. `basecerta_backend` (backend:8000)
3. `basecerta_celery_worker`
4. `basecerta_celery_beat`
5. `basecerta_frontend` (frontend:3000)

### DNS Interno

**Resolução de nomes:**
- `redis` → IP do container Redis
- `backend` → IP do container Backend
- `frontend` → IP do container Frontend

### Acesso ao Host

**Host Gateway:**
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

**Uso:**
- PostgreSQL no host: `host.docker.internal:5432`

### Portas Expostas

| Serviço | Container Port | Host Port | Protocolo |
|---------|----------------|-----------|-----------|
| Redis | 6379 | 6379 | TCP |
| Backend | 8000 | 8000 | HTTP |
| Frontend | 3000 | 3000 | HTTP |
| PostgreSQL | 5432 | 5432 | TCP |

---

## 🛠️ Scripts de Automação

### 1. start.sh

**Função:** Iniciar todos os serviços

```bash
#!/bin/bash
docker-compose up -d
```

**Uso:**
```bash
chmod +x start.sh
./start.sh
```

---

### 2. start-local.sh

**Função:** Iniciar com logs visíveis

```bash
#!/bin/bash
docker-compose up
```

---

### 3. reset.sh

**Função:** Reiniciar do zero

```bash
#!/bin/bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**Atenção:** `-v` remove volumes (Redis data perdido)

---

### 4. backup.sh

**Função:** Backup do banco PostgreSQL

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U aian_db -h localhost basecerta > backup_$DATE.sql
```

**Uso:**
```bash
chmod +x backup.sh
./backup.sh
```

**Saída:** `backup_20251024_203000.sql`

---

### 5. Scripts SQL (backend/scripts/)

**00_cleanup_old_tables.sql:**
- Remover tabelas antigas duplicadas
- Preparar ambiente limpo

**01_descobrir_estrutura.sql:**
- Script de análise/descoberta
- Queries úteis para explorar banco

**02_create_indexes.sql:**
- **CRÍTICO** - 44 índices de performance
- GIN trigram para buscas textuais
- Índices compostos para filtros

**03_create_support_tables.sql:**
- Criar tabela `pesquisa_cnpj`
- Criar triggers automáticos
- Popular dados iniciais

---

## 📊 Fluxo de Dados

### 1. Busca Smart CNPJ (Exemplo)

```
1. Usuário preenche formulário no Frontend
   ↓
2. Frontend → POST /api/v1/smart-cnpj/search
   ↓
3. Backend valida request (Pydantic schema)
   ↓
4. Backend verifica saldo de créditos
   ↓ (se saldo OK)
5. Backend executa query PostgreSQL (schema cnpj)
   ↓ (usa índice GIN trigram)
6. Query retorna resultados em ~82ms
   ↓
7. Backend registra pesquisa em pesquisa_cnpj
   ↓ (trigger automático)
8. Trigger debita 5 créditos do saldo
   ↓
9. Backend formata resposta (Pydantic)
   ↓
10. Backend → Response JSON para Frontend
   ↓
11. Frontend exibe resultados paginados
```

---

### 2. Dados 360° PJ (Exemplo)

```
1. Usuário solicita dossiê PJ
   ↓
2. Frontend → POST /api/v1/dados360/pj
   ↓
3. Backend verifica cache Redis
   ↓ (se não existe)
4. Backend → Predictus API (GET /pj/{cnpj})
   ↓ (retry 3x se falhar)
5. Predictus retorna JSON completo
   ↓
6. Backend salva em Redis (TTL 7 dias)
   ↓
7. Backend salva em PostgreSQL (persistente)
   ↓
8. Backend debita 10 créditos
   ↓
9. Backend → Response para Frontend
   ↓
10. Frontend exibe dossiê completo
```

---

### 3. Geração de PDF (Futuro)

```
1. Usuário clica "Baixar PDF"
   ↓
2. Frontend → GET /api/v1/smart-cnpj/{cnpj}/pdf
   ↓
3. Backend verifica cache Redis (chave: pdf:{cnpj})
   ↓ (se não existe)
4. Backend agenda Celery task: generate_pdf_report.delay(cnpj)
   ↓
5. Celery Worker processa task:
   - Busca dados do PostgreSQL
   - Renderiza template HTML
   - Converte HTML → PDF (WeasyPrint)
   - Salva PDF em Redis (TTL 24h)
   ↓
6. Backend retorna URL do PDF
   ↓
7. Frontend faz download
```

---

## 📈 Monitoramento e Logs

### Health Checks

**Backend:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

**Redis:**
```bash
docker exec basecerta_redis redis-cli ping
# PONG
```

**PostgreSQL:**
```bash
psql -U aian_db -h localhost -d basecerta -c "SELECT 1"
```

---

### Logs

**Ver logs de serviço:**
```bash
docker logs basecerta_backend
docker logs basecerta_frontend
docker logs basecerta_celery_worker
docker logs basecerta_redis
```

**Seguir logs em tempo real:**
```bash
docker logs -f basecerta_backend
```

**Logs estruturados (Backend):**
```python
import logging
logger = logging.getLogger(__name__)

logger.info("Busca executada", extra={
    "user_id": 1,
    "tipo_busca": "razao_social",
    "tempo_ms": 82
})
```

---

### Monitoramento Futuro

**Ferramentas planejadas:**
- **Sentry** - Error tracking
- **Prometheus** - Métricas
- **Grafana** - Dashboards
- **Flower** - Monitoramento Celery

---

## 🔧 Troubleshooting

### Problema: Backend não conecta ao PostgreSQL

**Sintoma:**
```
could not connect to server: Connection refused
```

**Solução:**
1. Verificar se PostgreSQL está rodando no host
2. Verificar `DB_HOST=host.docker.internal` no .env
3. Verificar `extra_hosts` no docker-compose.yml

---

### Problema: Redis não conecta

**Sintoma:**
```
Redis unavailable: Connection refused
```

**Solução:**
1. Verificar se Redis container está up
2. Verificar health check: `docker exec basecerta_redis redis-cli ping`
3. Verificar `REDIS_HOST=redis` no .env

---

### Problema: Celery tasks não processam

**Sintoma:**
Tasks ficam em PENDING

**Solução:**
1. Verificar se Celery Worker está rodando
2. Verificar logs: `docker logs basecerta_celery_worker`
3. Verificar broker: Redis deve estar acessível

---

### Problema: Frontend não acessa Backend

**Sintoma:**
```
Network Error / CORS error
```

**Solução:**
1. Verificar `NEXT_PUBLIC_API_URL` no .env.local
2. Verificar CORS no backend (allowed_origins)
3. Verificar se backend está up: `curl http://localhost:8000/health`

---

## 📚 Referências

**Ver também:**
- `estrutura_db.md` - Estrutura do banco de dados
- `estrutura_backend_frontend_sprints.md` - História do projeto
- `docker-compose.yml` - Configuração completa dos serviços

---

**Última atualização:** 24/10/2025 21:00  
**Responsável:** Sistema de IA  
**Versão:** 1.0
