# 🎯 SPRINT 1: FUNDAÇÃO E SETUP INICIAL

**Duração:** 2 semanas  
**Início:** 20/10/2025  
**Término:** 03/11/2025

---

## 📊 QUADRO KANBAN

### 🔴 TODO (Não Iniciado)

#### BACKEND - Setup Inicial
- [ ] **#1.1** - Criar estrutura de diretórios do backend
- [ ] **#1.2** - Configurar pyproject.toml e dependências Python
- [ ] **#1.3** - Criar arquivo requirements.txt
- [ ] **#1.4** - Configurar FastAPI app inicial
- [ ] **#1.5** - Setup de variáveis de ambiente (.env e .env.example)

#### BACKEND - Database
- [ ] **#1.6** - Configurar conexão PostgreSQL com SQLAlchemy
- [ ] **#1.7** - Criar Base model e configuração de sessão
- [ ] **#1.8** - Setup Alembic para migrations
- [ ] **#1.9** - Criar primeira migration (tabelas base)
- [ ] **#1.10** - Testar conexão com DB existente (basecerta)

#### BACKEND - Redis & Celery
- [ ] **#1.11** - Configurar conexão Redis
- [ ] **#1.12** - Setup Celery worker
- [ ] **#1.13** - Criar task exemplo (health check assíncrono)
- [ ] **#1.14** - Configurar Celery beat (scheduler)

#### BACKEND - API Base
- [ ] **#1.15** - Criar endpoint `/health` (health check)
- [ ] **#1.16** - Criar endpoint `/api/v1/info` (versão, status)
- [ ] **#1.17** - Configurar CORS (básico)
- [ ] **#1.18** - Configurar logging (estruturado)
- [ ] **#1.19** - Criar middleware de request tracking

#### FRONTEND - Setup Inicial
- [ ] **#1.20** - Criar projeto Next.js 14 com TypeScript
- [ ] **#1.21** - Configurar Tailwind CSS
- [ ] **#1.22** - Instalar e configurar shadcn/ui
- [ ] **#1.23** - Configurar variáveis de ambiente (.env.local)
- [ ] **#1.24** - Setup estrutura de diretórios (app router)

#### FRONTEND - Componentes Base
- [ ] **#1.25** - Criar layout principal (RootLayout)
- [ ] **#1.26** - Criar componente Header
- [ ] **#1.27** - Criar componente Footer
- [ ] **#1.28** - Criar componente Loading
- [ ] **#1.29** - Criar página inicial (/) com hero section

#### FRONTEND - API Client
- [ ] **#1.30** - Configurar axios/fetch client
- [ ] **#1.31** - Criar service de API base
- [ ] **#1.32** - Implementar tratamento de erros
- [ ] **#1.33** - Testar conexão com backend (/health)

#### DEVOPS - Docker
- [ ] **#1.34** - Criar Dockerfile para backend
- [ ] **#1.35** - Criar Dockerfile para frontend
- [ ] **#1.36** - Criar docker-compose.yml (todos os serviços)
- [ ] **#1.37** - Configurar volumes para desenvolvimento
- [ ] **#1.38** - Testar build de todas as imagens

#### DEVOPS - Scripts
- [ ] **#1.39** - Criar script de inicialização (start.sh)
- [ ] **#1.40** - Criar script de reset do ambiente (reset.sh)
- [ ] **#1.41** - Criar script de backup do DB (backup.sh)

#### DOCUMENTAÇÃO
- [ ] **#1.42** - Criar README.md principal
- [ ] **#1.43** - Documentar variáveis de ambiente
- [ ] **#1.44** - Criar guia de instalação
- [ ] **#1.45** - Documentar comandos úteis

---

### 🟡 IN PROGRESS (Em Andamento)

_Nenhuma task em andamento ainda_

---

### 🟢 DONE (Concluído)

_Nenhuma task concluída ainda_

---

### ⚪ BLOCKED (Bloqueado)

_Nenhuma task bloqueada_

---

## 📋 DETALHAMENTO DAS ISSUES

### **#1.1** - Criar estrutura de diretórios do backend
**Tipo:** Setup  
**Prioridade:** 🔴 Alta  
**Estimativa:** 30min  
**Responsável:** -  

**Descrição:**  
Criar a estrutura completa de diretórios do backend seguindo Clean Architecture.

**Critérios de Aceite:**
- [ ] Estrutura de pastas criada
- [ ] Arquivos `__init__.py` em todos os módulos
- [ ] Estrutura segue padrão do projeto

**Arquivos:**
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── utils/
```

---

### **#1.6** - Configurar conexão PostgreSQL com SQLAlchemy
**Tipo:** Database  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1h  
**Responsável:** -  

**Descrição:**  
Configurar SQLAlchemy para conectar no banco PostgreSQL existente (basecerta).

**Critérios de Aceite:**
- [ ] Conexão estabelecida com sucesso
- [ ] Session factory criada
- [ ] Pool de conexões configurado
- [ ] Testado com query simples

**Dependências:**
- #1.1, #1.5

**Variáveis necessárias:**
```env
DB_NAME=basecerta
DB_USER=aian_db
DB_PASSWORD=P@lm315@s
DB_HOST=localhost
DB_PORT=5432
```

---

### **#1.15** - Criar endpoint `/health`
**Tipo:** Feature  
**Prioridade:** 🔴 Alta  
**Estimativa:** 45min  
**Responsável:** -  

**Descrição:**  
Criar endpoint de health check que verifica status do app, DB, Redis e Celery.

**Critérios de Aceite:**
- [ ] Endpoint retorna status 200 quando tudo OK
- [ ] Verifica conexão com PostgreSQL
- [ ] Verifica conexão com Redis
- [ ] Verifica se Celery worker está ativo
- [ ] Retorna JSON estruturado

**Response esperado:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-20T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "celery": "running"
  },
  "version": "1.0.0"
}
```

**Dependências:**
- #1.4, #1.6, #1.11, #1.12

---

### **#1.20** - Criar projeto Next.js 14 com TypeScript
**Tipo:** Setup  
**Prioridade:** 🔴 Alta  
**Estimativa:** 30min  
**Responsável:** -  

**Descrição:**  
Inicializar projeto Next.js 14 com TypeScript e configurações recomendadas.

**Comandos:**
```bash
npx create-next-app@14 frontend --typescript --tailwind --app --eslint
```

**Critérios de Aceite:**
- [ ] Projeto criado com TypeScript
- [ ] App Router configurado
- [ ] ESLint configurado
- [ ] Projeto executa sem erros (`npm run dev`)

---

### **#1.23** - Instalar e configurar shadcn/ui
**Tipo:** Setup  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1h  
**Responsável:** -  

**Descrição:**  
Instalar e configurar shadcn/ui com componentes iniciais.

**Comandos:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add toast
```

**Critérios de Aceite:**
- [ ] shadcn/ui configurado
- [ ] Componentes base instalados
- [ ] Theme configurado (cores BaseCerta)
- [ ] Componente exemplo renderizando

**Dependências:**
- #1.20, #1.21

---

### **#1.34** - Criar Dockerfile para backend
**Tipo:** DevOps  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1h  
**Responsável:** -  

**Descrição:**  
Criar Dockerfile otimizado para FastAPI com multi-stage build.

**Critérios de Aceite:**
- [ ] Dockerfile criado
- [ ] Multi-stage build implementado
- [ ] Imagem otimizada (< 500MB)
- [ ] Build executado com sucesso
- [ ] Container inicia sem erros

**Dependências:**
- #1.1, #1.2

---

### **#1.36** - Criar docker-compose.yml
**Tipo:** DevOps  
**Prioridade:** 🔴 Alta  
**Estimativa:** 1.5h  
**Responsável:** -  

**Descrição:**  
Criar docker-compose com todos os serviços: backend, frontend, PostgreSQL, Redis, Celery.

**Serviços:**
- `backend` (FastAPI)
- `frontend` (Next.js)
- `postgres` (PostgreSQL 15)
- `redis` (Redis 7)
- `celery-worker` (Celery)
- `celery-beat` (Celery scheduler)

**Critérios de Aceite:**
- [ ] Todos os serviços definidos
- [ ] Networks configuradas
- [ ] Volumes persistentes criados
- [ ] Health checks configurados
- [ ] `docker-compose up` funciona

**Dependências:**
- #1.34, #1.35

---

### **#1.42** - Criar README.md principal
**Tipo:** Documentação  
**Prioridade:** 🟡 Média  
**Estimativa:** 1h  
**Responsável:** -  

**Descrição:**  
Criar README.md completo com instruções de setup e uso.

**Seções:**
1. Sobre o Projeto
2. Tecnologias
3. Pré-requisitos
4. Instalação
5. Comandos úteis
6. Estrutura do projeto
7. Variáveis de ambiente
8. Troubleshooting

**Critérios de Aceite:**
- [ ] README criado
- [ ] Todas as seções preenchidas
- [ ] Comandos testados
- [ ] Badges adicionados

---

## 📈 MÉTRICAS DA SPRINT

**Total de Issues:** 45  
**Estimativa Total:** ~30-35 horas de desenvolvimento

### Distribuição por Categoria:
- 🔧 Backend: 19 issues (~40%)
- 🎨 Frontend: 14 issues (~30%)
- 🐳 DevOps: 8 issues (~18%)
- 📝 Documentação: 4 issues (~9%)

### Prioridades:
- 🔴 Alta: 35 issues
- 🟡 Média: 10 issues

---

## ✅ DEFINITION OF DONE (DoD)

Para considerar a Sprint 1 concluída:

### Técnico
- [ ] Todos os serviços rodando via Docker Compose
- [ ] Backend respondendo em `http://localhost:8000`
- [ ] Frontend respondendo em `http://localhost:3000`
- [ ] Endpoint `/health` retornando status OK
- [ ] Migrations aplicadas com sucesso
- [ ] Redis conectado e funcional
- [ ] Celery worker processando tasks

### Qualidade
- [ ] Código sem erros de lint
- [ ] Tipos TypeScript sem erros
- [ ] Logs estruturados funcionando
- [ ] .env.example criado

### Documentação
- [ ] README.md completo
- [ ] Guia de instalação validado
- [ ] Variáveis de ambiente documentadas
- [ ] Comandos úteis listados

### Deploy
- [ ] `docker-compose up` funciona primeira vez
- [ ] Scripts de inicialização testados
- [ ] Volumes persistem dados corretamente

---

## 🚀 COMANDOS RÁPIDOS

### Iniciar ambiente completo
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Parar ambiente
```bash
docker-compose down
```

### Reset completo
```bash
docker-compose down -v
docker-compose up --build -d
```

### Aplicar migrations
```bash
docker-compose exec backend alembic upgrade head
```

### Acessar shell do backend
```bash
docker-compose exec backend bash
```

---

## 📝 NOTAS DA SPRINT

### Decisões Técnicas
- Usar Poetry ou pip? → **pip + requirements.txt** (simplicidade)
- App Router ou Pages Router? → **App Router** (Next.js 14 padrão)
- PostgreSQL version? → **15** (estável e recente)
- Python version? → **3.11** (performance + type hints)

### Riscos
- ⚠️ Conexão com DB existente pode ter dados que conflitam
- ⚠️ Redis pode exigir configuração de memória no Docker
- ⚠️ Celery pode demorar para iniciar primeira vez

### Próximas Sprints
- Sprint 2 depende do sistema de créditos funcionando
- Já pensar em estrutura de Models para User e Credits

---

**Última atualização:** 20/10/2025  
**Status da Sprint:** 🔴 Não Iniciada
