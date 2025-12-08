# 📁 ESTRUTURA DO PROJETO BASECERTA

Estrutura completa criada para o projeto BaseCerta - Sprint 1

```
basecerta/
│
├── 📄 README.md                          # Documentação principal do projeto
├── 📄 Estrutura_Projeto.txt              # Especificação original do projeto
├── 📄 ROADMAP_SPRINTS.md                 # Planejamento completo (12 sprints)
├── 📄 SPRINT_1_KANBAN.md                 # Kanban detalhado da Sprint 1
├── 📄 .gitignore                         # Ignorar arquivos no Git
├── 🐳 docker-compose.yml                 # Orquestração de containers
│
├── 🔧 Scripts de Automação
│   ├── start.sh                          # Iniciar ambiente completo
│   ├── reset.sh                          # Reset completo do ambiente
│   └── backup.sh                         # Backup do banco de dados
│
├── 📁 backend/                           # API Backend - FastAPI
│   ├── 📄 README.md                      # Documentação do backend
│   ├── 📄 requirements.txt               # Dependências Python
│   ├── 📄 .env.example                   # Template de variáveis de ambiente
│   ├── 📄 .gitignore                     # Ignorar arquivos backend
│   ├── 🐳 Dockerfile                     # Container do backend
│   │
│   ├── 📁 app/                           # Aplicação principal
│   │   ├── __init__.py
│   │   ├── main.py                       # (A CRIAR) Entry point FastAPI
│   │   │
│   │   ├── 📁 core/                      # Configurações centrais
│   │   │   ├── __init__.py
│   │   │   ├── config.py                 # (A CRIAR) Settings
│   │   │   ├── database.py               # (A CRIAR) SQLAlchemy setup
│   │   │   └── security.py               # (A CRIAR) JWT, passwords
│   │   │
│   │   ├── 📁 api/                       # Rotas da API
│   │   │   ├── __init__.py
│   │   │   └── 📁 v1/                    # API versão 1
│   │   │       ├── __init__.py
│   │   │       ├── api.py                # (A CRIAR) Router principal
│   │   │       └── 📁 endpoints/         # Endpoints organizados
│   │   │           ├── __init__.py
│   │   │           ├── health.py         # (A CRIAR) Health check
│   │   │           ├── companies.py      # (A CRIAR) Busca empresas
│   │   │           ├── credits.py        # (A CRIAR) Sistema de créditos
│   │   │           └── research.py       # (A CRIAR) Pesquisas
│   │   │
│   │   ├── 📁 models/                    # SQLAlchemy Models
│   │   │   ├── __init__.py
│   │   │   ├── user.py                   # (A CRIAR) Modelo User
│   │   │   ├── company.py                # (A CRIAR) Modelo Company
│   │   │   ├── credit.py                 # (A CRIAR) Sistema créditos
│   │   │   └── research.py               # (A CRIAR) Pesquisas
│   │   │
│   │   ├── 📁 schemas/                   # Pydantic Schemas (DTOs)
│   │   │   ├── __init__.py
│   │   │   ├── user.py                   # (A CRIAR) Schemas User
│   │   │   ├── company.py                # (A CRIAR) Schemas Company
│   │   │   └── research.py               # (A CRIAR) Schemas Research
│   │   │
│   │   ├── 📁 services/                  # Lógica de Negócio
│   │   │   ├── __init__.py
│   │   │   ├── predictus.py              # (A CRIAR) API Predictus
│   │   │   ├── directdata.py             # (A CRIAR) API DirectData
│   │   │   └── credit_service.py         # (A CRIAR) Gestão de créditos
│   │   │
│   │   ├── 📁 crud/                      # Database Operations
│   │   │   ├── __init__.py
│   │   │   ├── base.py                   # (A CRIAR) CRUD base class
│   │   │   ├── user.py                   # (A CRIAR) CRUD User
│   │   │   └── company.py                # (A CRIAR) CRUD Company
│   │   │
│   │   ├── 📁 tasks/                     # Celery Tasks
│   │   │   ├── __init__.py
│   │   │   ├── celery_app.py             # (A CRIAR) Celery config
│   │   │   └── research_tasks.py         # (A CRIAR) Tasks pesquisas
│   │   │
│   │   ├── 📁 middleware/                # Middlewares
│   │   │   ├── __init__.py
│   │   │   ├── cors.py                   # (A CRIAR) CORS config
│   │   │   └── logging.py                # (A CRIAR) Request logging
│   │   │
│   │   └── 📁 utils/                     # Utilidades
│   │       ├── __init__.py
│   │       ├── logger.py                 # (A CRIAR) Logging setup
│   │       └── validators.py             # (A CRIAR) Validadores
│   │
│   ├── 📁 alembic/                       # Database Migrations
│   │   ├── README
│   │   ├── env.py                        # (A CRIAR) Alembic env
│   │   ├── script.py.mako                # (A CRIAR) Template migration
│   │   └── versions/                     # (A CRIAR) Migrations
│   │
│   └── 📁 tests/                         # Testes
│       ├── __init__.py
│       ├── conftest.py                   # (A CRIAR) Fixtures pytest
│       └── test_api/                     # (A CRIAR) Testes de API
│
├── 📁 frontend/                          # App Frontend - Next.js 14
│   ├── 📄 README.md                      # Documentação do frontend
│   ├── 📄 .env.example                   # Template variáveis ambiente
│   ├── 📄 .gitignore                     # Ignorar arquivos frontend
│   ├── 🐳 Dockerfile                     # Container do frontend
│   ├── 📄 package.json                   # (A CRIAR) Dependências Node
│   ├── 📄 tsconfig.json                  # (A CRIAR) Config TypeScript
│   ├── 📄 tailwind.config.js             # (A CRIAR) Config Tailwind
│   ├── 📄 next.config.js                 # (A CRIAR) Config Next.js
│   │
│   ├── 📁 app/                           # Next.js App Router
│   │   ├── layout.tsx                    # (A CRIAR) Layout principal
│   │   ├── page.tsx                      # (A CRIAR) Página inicial
│   │   ├── globals.css                   # (A CRIAR) Estilos globais
│   │   │
│   │   ├── 📁 (auth)/                    # Grupo de rotas auth
│   │   │   ├── login/                    # (A CRIAR) Página login
│   │   │   ├── register/                 # (A CRIAR) Página registro
│   │   │   └── forgot-password/          # (A CRIAR) Recuperar senha
│   │   │
│   │   ├── 📁 dashboard/                 # Dashboard
│   │   │   ├── page.tsx                  # (A CRIAR) Dashboard principal
│   │   │   └── layout.tsx                # (A CRIAR) Layout dashboard
│   │   │
│   │   ├── 📁 search/                    # Busca de empresas
│   │   │   ├── companies/                # (A CRIAR) Buscar empresas
│   │   │   └── [cnpj]/                   # (A CRIAR) Detalhes empresa
│   │   │
│   │   └── 📁 research/                  # Pesquisas
│   │       ├── pf/                       # (A CRIAR) Dossiê PF
│   │       ├── pj/                       # (A CRIAR) Dossiê PJ
│   │       ├── judicial/                 # (A CRIAR) Processos
│   │       └── credit/                   # (A CRIAR) Score crédito
│   │
│   ├── 📁 components/                    # Componentes React
│   │   ├── 📁 ui/                        # (A CRIAR) shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   └── 📁 shared/                    # Componentes compartilhados
│   │       ├── Header.tsx                # (A CRIAR) Header
│   │       ├── Footer.tsx                # (A CRIAR) Footer
│   │       ├── Loading.tsx               # (A CRIAR) Loading
│   │       └── ErrorBoundary.tsx         # (A CRIAR) Error handler
│   │
│   ├── 📁 lib/                           # Bibliotecas e utils
│   │   ├── utils.ts                      # (A CRIAR) Utilities
│   │   └── cn.ts                         # (A CRIAR) Class names
│   │
│   ├── 📁 services/                      # API Clients
│   │   ├── api.ts                        # (A CRIAR) Cliente base
│   │   ├── auth.service.ts               # (A CRIAR) Service auth
│   │   ├── company.service.ts            # (A CRIAR) Service companies
│   │   └── research.service.ts           # (A CRIAR) Service research
│   │
│   ├── 📁 hooks/                         # React Hooks customizados
│   │   ├── useAuth.ts                    # (A CRIAR) Hook auth
│   │   └── useApi.ts                     # (A CRIAR) Hook API calls
│   │
│   ├── 📁 types/                         # TypeScript Types
│   │   ├── api.types.ts                  # (A CRIAR) Tipos API
│   │   └── models.types.ts               # (A CRIAR) Tipos Models
│   │
│   ├── 📁 styles/                        # Estilos
│   │   └── globals.css                   # (A CRIAR) CSS global
│   │
│   └── 📁 public/                        # Assets estáticos
│       ├── images/                       # (A CRIAR) Imagens
│       └── icons/                        # (A CRIAR) Ícones
│
└── 📁 docs/                              # Documentação adicional (A CRIAR)
    ├── api/                              # Docs da API
    ├── deployment/                       # Guias de deploy
    └── development/                      # Guias de desenvolvimento
```

---

## 📊 ESTATÍSTICAS

### Arquivos Criados (Sprint 1 - Estrutura Base)
- ✅ **31 arquivos** criados
- ✅ **Estrutura completa** de diretórios
- ✅ **3 scripts** de automação prontos
- ✅ **Docker Compose** configurado
- ✅ **Dockerfiles** criados (backend + frontend)
- ✅ **Documentação** completa

### Próximos Passos (Issues da Sprint 1)
- 🔲 Implementar `main.py` do FastAPI
- 🔲 Configurar Alembic
- 🔲 Criar endpoint `/health`
- 🔲 Inicializar projeto Next.js
- 🔲 Configurar shadcn/ui
- 🔲 Testar ambiente completo com Docker

---

## 🚀 COMANDOS PARA COMEÇAR

### 1. Iniciar ambiente
```bash
cd /Users/linkerx/Documents/ADACODE/basecerta
./start.sh
```

### 2. Verificar estrutura
```bash
ls -la
ls -la backend/
ls -la frontend/
```

### 3. Ver documentação
```bash
cat README.md
cat SPRINT_1_KANBAN.md
```

### 4. Próximo: Implementar Backend
```bash
cd backend
# Criar main.py
# Configurar config.py
# Setup database.py
```

---

## 📝 LEGENDA

- ✅ = Arquivo/diretório criado
- 🔲 = A ser criado nas próximas issues
- 📁 = Diretório
- 📄 = Arquivo de documentação
- 🐳 = Arquivo Docker
- 🔧 = Script executável

---

**Criado em:** 20/10/2025  
**Status:** ✅ Estrutura base completa  
**Próximo:** Iniciar desenvolvimento Sprint 1
