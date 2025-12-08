# 🚀 BaseCerta - Plataforma de Consultas Empresariais

Sistema completo de consultas e pesquisas de dados empresariais no Brasil, integrando múltiplas fontes de dados (Predictus, DirectData) com sistema de créditos e gestão de assinaturas.

## 📋 Sobre o Projeto

BaseCerta é uma plataforma que oferece:
- 🏢 Busca avançada de empresas (CNPJ, Razão Social, etc.)
- 👤 Dossiês completos de Pessoa Física (CPF)
- 🏛️ Dossiês completos de Pessoa Jurídica (CNPJ)
- ⚖️ Consulta de processos jurídicos
- 💰 Score de crédito e situação financeira
- 📊 Sistema de créditos e assinaturas

## 🛠️ Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para PostgreSQL
- **PostgreSQL 15** - Banco de dados relacional
- **Redis** - Cache e message broker
- **Celery** - Processamento assíncrono de tarefas
- **Alembic** - Migrations de banco de dados

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI

### DevOps
- **Docker & Docker Compose** - Containerização
- **Render** - Deploy (MVP)

## 📦 Pré-requisitos

- Docker Desktop (recomendado) OU
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Redis 7

## 🚀 Instalação

### Usando Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <repository-url>
cd basecerta
```

2. **Configure as variáveis de ambiente**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

3. **Edite os arquivos .env com suas credenciais**

4. **Inicie todos os serviços**
```bash
docker-compose up -d
```

5. **Aplique as migrations**
```bash
docker-compose exec backend alembic upgrade head
```

6. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Instalação Manual (Desenvolvimento)

#### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar .env
cp .env.example .env

# Aplicar migrations
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
basecerta/
├── backend/                    # API Backend
│   ├── app/
│   │   ├── api/               # Endpoints da API
│   │   │   └── v1/
│   │   │       └── endpoints/ # Rotas organizadas
│   │   ├── core/              # Configurações centrais
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Lógica de negócio
│   │   ├── crud/              # Operações de banco
│   │   ├── tasks/             # Celery tasks
│   │   ├── middleware/        # Middlewares
│   │   └── utils/             # Utilidades
│   ├── alembic/               # Migrations
│   ├── tests/                 # Testes
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                   # App Frontend
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Rotas de autenticação
│   │   ├── dashboard/        # Dashboard
│   │   ├── search/           # Páginas de busca
│   │   └── research/         # Páginas de pesquisa
│   ├── components/            # Componentes React
│   │   ├── ui/               # shadcn/ui components
│   │   └── shared/           # Componentes compartilhados
│   ├── lib/                  # Bibliotecas e utils
│   ├── services/             # API clients
│   ├── styles/               # Estilos globais
│   ├── public/               # Assets estáticos
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml         # Orquestração de containers
├── README.md                  # Este arquivo
├── Estrutura_Projeto.txt      # Especificação completa
├── ROADMAP_SPRINTS.md         # Planejamento de Sprints
└── SPRINT_1_KANBAN.md         # Kanban da Sprint 1
```

## 🎯 Comandos Úteis

### Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar serviços
docker-compose down

# Rebuild e restart
docker-compose up -d --build

# Reset completo (CUIDADO: apaga dados)
docker-compose down -v
```

### Backend

```bash
# Criar nova migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Aplicar migrations
docker-compose exec backend alembic upgrade head

# Reverter migration
docker-compose exec backend alembic downgrade -1

# Acessar shell Python
docker-compose exec backend python

# Executar testes
docker-compose exec backend pytest
```

### Frontend

```bash
# Instalar nova dependência
docker-compose exec frontend npm install <package>

# Build de produção
docker-compose exec frontend npm run build

# Adicionar componente shadcn/ui
docker-compose exec frontend npx shadcn-ui@latest add <component>
```

### Database

```bash
# Acessar PostgreSQL
docker-compose exec postgres psql -U aian_db -d basecerta

# Backup
docker-compose exec postgres pg_dump -U aian_db basecerta > backup.sql

# Restore
docker-compose exec -T postgres psql -U aian_db basecerta < backup.sql
```

## 🔧 Variáveis de Ambiente

### Backend (.env)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_NAME` | Nome do banco | `basecerta` |
| `DB_USER` | Usuário do banco | `aian_db` |
| `DB_PASSWORD` | Senha do banco | `P@lm315@s` |
| `DB_HOST` | Host do banco | `localhost` ou `postgres` |
| `DB_PORT` | Porta do banco | `5432` |
| `REDIS_HOST` | Host do Redis | `localhost` ou `redis` |
| `SECRET_KEY` | Chave JWT | (gerar aleatória) |
| `PREDICTUS_API_KEY` | Chave API Predictus | (fornecida) |
| `DIRECTDATA_API_KEY` | Chave API DirectData | (fornecida) |

### Frontend (.env.local)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Nome do app | `BaseCerta` |

## 🧪 Testes

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

## 📚 Documentação da API

Após iniciar o backend, acesse:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🗺️ Roadmap

Veja o planejamento completo em:
- [ROADMAP_SPRINTS.md](./ROADMAP_SPRINTS.md) - 12 sprints planejadas
- [SPRINT_1_KANBAN.md](./SPRINT_1_KANBAN.md) - Kanban da Sprint atual

## 🐛 Troubleshooting

### Erro de conexão com o banco de dados

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Veja os logs
docker-compose logs postgres

# Reset do container
docker-compose restart postgres
```

### Frontend não conecta no backend

```bash
# Verifique se o backend está rodando
curl http://localhost:8000/health

# Verifique as variáveis de ambiente
cat frontend/.env.local
```

### Celery não processa tasks

```bash
# Veja logs do worker
docker-compose logs celery_worker

# Restart do worker
docker-compose restart celery_worker
```

### Ports já em uso

```bash
# Encontre processo usando a porta
lsof -i :3000
lsof -i :8000

# Mate o processo
kill -9 <PID>
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
2. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
3. Push para a branch (`git push origin feature/MinhaFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial.

## 👥 Time

- **Desenvolvimento**: [Seu time]
- **Sprint Atual**: Sprint 1 - Fundação e Setup
- **Status**: 🔴 Em desenvolvimento

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com o time de desenvolvimento

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0.0
