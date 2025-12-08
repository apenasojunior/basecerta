# 📚 História do Projeto - Backend, Frontend e Sprints

**Projeto:** BaseCerta  
**Modelo:** Frontend-First + Product-Led  
**Última Atualização:** 24/10/2025

---

## 📑 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Arquitetura de Produtos](#arquitetura-de-produtos)
4. [Timeline de Sprints](#timeline-de-sprints)
5. [Estado Atual do Desenvolvimento](#estado-atual-do-desenvolvimento)
6. [Bugs Corrigidos](#bugs-corrigidos)
7. [Design System](#design-system)
8. [Sistema de Créditos](#sistema-de-créditos)
9. [Próximos Passos](#próximos-passos)

---

## 🎯 Visão Geral do Projeto

### BaseCerta - Plataforma de Inteligência de Dados

**Missão:** Fornecer acesso completo a dados públicos e privados de empresas e pessoas físicas brasileiras através de 4 produtos principais.

### Mudança Estratégica

**ANTES (Modelo Antigo):**
- ❌ Funcionalidades dispersas (créditos, planos, pesquisas avulsas)
- ❌ Backend-first (funcionalidades sem UI pronta)
- ❌ Baixo foco em UX

**AGORA (Modelo Novo - desde Outubro 2025):**
- ✅ **4 Produtos Principais** organizados e focados
- ✅ **Frontend-First:** UI completa com mockdata antes do backend
- ✅ **Product-Led:** Foco na experiência do usuário
- ✅ **Design Shopee:** Paleta vibrante, moderna e alegre

---

## 📦 Estrutura do Projeto

### Diretórios Principais

```
basecerta/
├── backend/                  # FastAPI + PostgreSQL + Redis + Celery
│   ├── alembic/             # Migrações de banco
│   │   └── versions/        # Histórico de migrações
│   ├── app/                 # Código principal
│   │   ├── api/             # Endpoints FastAPI
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/            # Configurações e segurança
│   │   ├── crud/            # Operações de banco
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Lógica de negócio
│   │   ├── tasks/           # Celery tasks
│   │   └── utils/           # Utilitários
│   ├── scripts/             # Scripts SQL e setup
│   │   ├── 00_cleanup_old_tables.sql
│   │   ├── 01_descobrir_estrutura.sql
│   │   ├── 02_create_indexes.sql  ⭐
│   │   └── 03_create_support_tables.sql
│   ├── tests/               # Testes automatizados
│   ├── requirements.txt     # Dependências Python
│   └── run.py              # Entry point
│
├── frontend/                # Next.js 14 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── smart-cnpj/     # Produto 1
│   │   │   ├── dados360/       # Produto 2
│   │   │   │   ├── pf/         # Pessoa Física
│   │   │   │   └── pj/         # Pessoa Jurídica
│   │   │   ├── radar-juridico/ # Produto 3
│   │   │   └── radar-financeiro/ # Produto 4
│   │   ├── components/     # Componentes React
│   │   │   ├── layout/     # Header, Sidebar, Footer
│   │   │   ├── ui/         # Design System (shadcn/ui)
│   │   │   ├── smart-cnpj/
│   │   │   ├── dados360/
│   │   │   └── radar-juridico/
│   │   ├── constants/      # Constantes e configurações
│   │   ├── hooks/          # React Hooks customizados
│   │   ├── lib/            # Utilitários
│   │   └── types/          # TypeScript types
│   ├── public/             # Assets estáticos
│   ├── package.json
│   └── tailwind.config.ts
│
├── docs/                    # Documentação do projeto
│   ├── ESTRUTURA_DE_REFERENCIA_PARA_IA/  # 📌 Esta pasta!
│   │   ├── estrutura_db.md
│   │   ├── estrutura_backend_frontend_sprints.md  # Este arquivo
│   │   └── estrutura_servicos.md
│   ├── old/                # Documentação histórica
│   │   ├── ROADMAP_SPRINTS.md
│   │   └── BUGFIX_SMART_CNPJ_SEARCH.md
│   ├── frontend/           # Docs específicos do frontend
│   └── README.md
│
├── scripts/                # Scripts de automação
│   ├── backup.sh
│   └── reset.sh
│
├── docker-compose.yml      # Orquestração de containers
├── start.sh               # Script de inicialização
└── package.json           # Workspace monorepo
```

---

## 🏗️ Arquitetura de Produtos

### 📦 Produto 1: Smart CNPJ 360°

**Status:** ✅ **BACKEND FUNCIONAL** | ⏳ Frontend parcial

**Objetivo:** Busca inteligente e avançada de empresas brasileiras

**Fonte de Dados:**
- Base CNPJ completa da Receita Federal
- PostgreSQL local (schema `cnpj`)
- 64 milhões de empresas
- 68 milhões de estabelecimentos
- 26 milhões de sócios

**Capacidades de Busca (7 tipos):**
1. ✅ Por CNPJ (55ms - funcional)
2. ✅ Por Razão Social (82ms - funcional após otimização)
3. ✅ Por Segmento/CNAE (132ms - funcional)
4. ⏳ Por Email (timeout - em investigação)
5. ⏳ Por Telefone (timeout - em investigação)
6. ⏳ Por Nome do Sócio
7. ⏳ Por CEP

**Filtros Avançados (8 filtros):**
1. Situação Cadastral (Ativa, Suspensa, Inapta, Baixada)
2. Tipo (Matriz, Filial)
3. Porte da Empresa (MEI, ME, EPP, Média, Grande)
4. Capital Social (faixas)
5. Opção pelo MEI (Sim/Não)
6. Opção pelo Simples Nacional (Sim/Não)
7. Forma de Tributação (Simples, Presumido, Real)
8. Data de Abertura (intervalo DE/ATÉ)

**Endpoints:**
```
POST   /api/v1/smart-cnpj/search     # Buscar empresas (5 créditos)
GET    /api/v1/smart-cnpj/{cnpj}     # Detalhes (sem custo)
GET    /api/v1/smart-cnpj/{cnpj}/pdf # Baixar PDF
```

**Custo:** 5 créditos por busca

---

### 📦 Produto 2: Dados 360°

**Status:** ⏳ **EM DESENVOLVIMENTO**

**Objetivo:** Visão completa do cliente (PF ou PJ) em um único clique

**Subprodutos:**

#### 2A. Dossiê Pessoa Física (CPF)
**Fonte:** DirectData API / Predictus API  
**Custo:** 8 créditos  
**Status:** ⏳ Planejado para Sprint 2.3

**Dados Fornecidos:**
- Dados Pessoais: Nome, CPF, Data Nascimento, Sexo, Nome da Mãe
- Situação RF: Situação, Data Situação, Óbito
- Renda: Faixa de Renda, Renda Presumida
- Endereços: Principal + Adicionais + GPS
- Contatos: Telefones (móvel/fixo), E-mails
- Parentes: Lista com CPF e grau
- Profissional: Experiências (empresa, cargo, salário)
- Empresas: Sociedades e vínculos
- Mapa: Google Maps API

**Endpoints:**
```
POST   /api/v1/dados360/pf           # Solicitar dossiê (8 créditos)
GET    /api/v1/dados360/pf/{id}      # Ver dossiê salvo
GET    /api/v1/dados360/pf/cpf/{cpf} # Buscar por CPF
GET    /api/v1/dados360/pf/{cpf}/pdf # Baixar PDF
```

#### 2B. Dossiê Pessoa Jurídica (CNPJ)
**Fonte:** Predictus API  
**Custo:** 10 créditos  
**Status:** 🟡 **90% PRONTO** (código criado, precisa testes)

**Dados Fornecidos:**
- Identificação: Razão Social, Nome Fantasia, CNPJ
- Situação: Situação Cadastral, Data Abertura, Matriz/Filial
- Atividade: Faturamento Estimado, CNAEs
- Quadro Societário: Sócios atuais + Ex-sócios
- Financeiro: Dívidas (se houver)
- RH: Histórico de Funcionários
- Localização: Endereços múltiplos + GPS
- Contatos: Telefones, E-mails
- Digital: Site + Redes Sociais (Facebook, LinkedIn, Instagram)

**Arquivos criados:**
- `backend/app/schemas/research_pj.py` (330 linhas)
- `backend/app/api/v1/endpoints/research_pj.py` (455 linhas)
- `backend/app/api/deps.py` (125 linhas)

**Endpoints:**
```
POST   /api/v1/dados360/pj           # Solicitar dossiê (10 créditos)
GET    /api/v1/dados360/pj/{id}      # Ver dossiê salvo
GET    /api/v1/dados360/pj/cnpj/{cnpj} # Buscar por CNPJ
GET    /api/v1/dados360/pj/{cnpj}/pdf # Baixar PDF
```

---

### 📦 Produto 3: Radar Jurídico

**Status:** ⏳ **PLANEJADO** (Sprint 2.4)

**Objetivo:** Processos judiciais completos (PF e PJ)

**Fonte:** Predictus API (Processos Judiciais)  
**Custo:** 20 créditos por busca

**Subprodutos:**
1. Dossiê Pessoa Física (CPF)
2. Dossiê Pessoa Jurídica (CNPJ)

**Dados por Processo:**
- Status, Número, Ramo do Direito, Assunto
- Data de Distribuição, Tribunal, Polo (Ativo/Passivo)
- Classe Processual, Valor da Causa, Risco (Baixo/Médio/Alto)
- Órgão Julgador, Grau, Segmento
- Partes, Assuntos, Movimentações (timeline)
- Processos Relacionados

**Endpoints:**
```
POST   /api/v1/radar-juridico/pf       # Processos PF (20 créditos)
POST   /api/v1/radar-juridico/pj       # Processos PJ (20 créditos)
GET    /api/v1/radar-juridico/processo/{numero}  # Detalhes
GET    /api/v1/radar-juridico/processo/{numero}/pdf
```

---

### 📦 Produto 4: Radar Financeiro

**Status:** ⏳ **PLANEJADO** (Sprints futuras)

**Objetivo:** Análises financeiras e antifraude

**Subprodutos (7 itens):**
1. Dossiê de Crédito Completo (DirectData) - 15 créditos
2. Score de Crédito QUOD (DirectData) - 10 créditos
3. Protestos Nacional - Base (DirectData) - 12 créditos
4. Protestos SP (DirectData) - 8 créditos
5. CADIN - Secretaria Fazenda SP - 5 créditos
6. SCR Detalhada - Resumo BACEN - 20 créditos
7. Antifraude Chave PIX (DirectData) - 25 créditos

**Nota:** Sprint inicial (1.6) criou apenas menus. Páginas individuais em sprints posteriores.

---

## 📅 Timeline de Sprints

### Estratégia de Desenvolvimento: Frontend-First

**Filosofia:**
1. **Delivery 1:** UI completa dos 4 produtos com mockdata (8-10 semanas)
2. **Delivery 2:** Backend dos 4 produtos com dados reais (6-8 semanas)
3. **Delivery 3:** Sistema de autenticação RBAC (2-3 semanas)
4. **Delivery 4:** Hardening para produção (2-3 semanas)

**Durante Deliveries 1-2:**
- Usuário mock: `user_id=1` fixo
- Endpoints abertos (sem autenticação)
- Ambiente: Desenvolvimento

---

### 🏃 DELIVERY 1: Frontend dos 4 Produtos (8-10 semanas)

#### Sprint 1.1 - Design System + Layout Base (1 semana)
**Status:** ⏳ Em progresso

**Issues:**
- 1.1.1 Design System Shopee-Inspired (2 dias)
  - ⏳ Paleta de cores (laranja Shopee)
  - ⏳ Fontes (Inter/Poppins)
  - ⏳ Tokens Tailwind
  - ⏳ Componentes base UI (Button, Card, Badge, Alert, Input, Select)
  
- 1.1.2 Layout Principal e Navegação (3 dias)
  - ⏳ Header com logo, busca global, saldo créditos
  - ⏳ Sidebar colapsável (menu de produtos)
  - ⏳ Footer
  - ⏳ Responsivo

---

#### Sprint 1.2 - Smart CNPJ 360° (Frontend) (2 semanas)
**Status:** ⏳ Parcialmente completo

**Issues:**
- 1.2.1 Página de Busca Smart CNPJ (3 dias)
  - ⏳ SearchForm com 7 tipos de busca
  - ⏳ FilterPanel com 8 filtros
  - ⏳ Mock data (100 empresas)
  
- 1.2.2 Página de Resultados Smart CNPJ (3 dias)
  - ⏳ ResultsList paginada (20/página)
  - ⏳ CompanyCard para cada empresa
  - ⏳ Pagination component
  - ⏳ Hook `useSmartCNPJ()`
  
- 1.2.3 Página de Detalhes Smart CNPJ (4 dias)
  - ⏳ CompanyHeader
  - ⏳ Cards: Identificação, Classificação, Localização, Contato, Status
  - ⏳ Google Maps API
  - ⏳ Layout grid responsivo

---

#### Sprint 1.3 - Dados 360° PF (Frontend) (1.5 semanas)
**Status:** ⏳ Planejado

**Issues:**
- 1.3.1 Busca e Resultados Dados 360° PF
- 1.3.2 Dossiê PF - Dados Pessoais
- 1.3.3 Dossiê PF - Profissional e Empresas

---

#### Sprint 1.4 - Dados 360° PJ (Frontend) (1.5 semanas)
**Status:** ⏳ Planejado

---

#### Sprint 1.5 - Radar Jurídico (Frontend) (2 semanas)
**Status:** ⏳ Planejado

---

#### Sprint 1.6 - Radar Financeiro (Menus) + Gestão (1.5 semanas)
**Status:** ⏳ Planejado

---

### 🏃 DELIVERY 2: Backend dos 4 Produtos (6-8 semanas)

#### Sprint 2.1 - Smart CNPJ Backend (1.5 semanas)
**Status:** 🟢 **90% COMPLETO**

**Issues Concluídas:**
- ✅ 2.1.1 Models e Schemas Smart CNPJ
  - Models: `Empresa`, `Estabelecimento`, `Socio`
  - Schemas: `SmartCNPJSearchRequest`, `SmartCNPJSearchResponse`, `EmpresaSmartResponse`
  - Indexes criados em `02_create_indexes.sql`
  
- ✅ 2.1.2 Endpoints Smart CNPJ
  - ✅ `POST /api/v1/smart-cnpj/search` (funcional)
  - ✅ `GET /api/v1/smart-cnpj/{cnpj}` (funcional)
  - ✅ Dedução de créditos: 5 créditos
  - ✅ Histórico de pesquisas
  
- 🟡 2.1.3 Query Builder Avançado
  - ✅ Busca por CNPJ (funcional)
  - ✅ Busca por Razão Social (funcional - 82ms após otimização)
  - ✅ Busca por CNAE (funcional)
  - ⏳ Busca por Email (timeout - investigar)
  - ⏳ Busca por Telefone (timeout - investigar)
  - ⏳ Busca por Nome Sócio
  - ⏳ Busca por CEP
  - ✅ 8 filtros implementados
  
- ⏳ 2.1.4 Integração Frontend ↔ Backend
  - ⏳ Hook `useSmartCNPJ()` atualizado
  - ⏳ Tratamento de erros (402, 404)

**Arquivos criados/modificados:**
- `backend/app/models/empresa.py`
- `backend/app/schemas/smart_cnpj.py`
- `backend/app/api/v1/endpoints/smart_cnpj.py`
- `backend/app/crud/smart_cnpj.py`
- `backend/app/services/smart_cnpj_service.py`
- `backend/scripts/02_create_indexes.sql` ⭐

---

#### Sprint 2.2 - Dados 360° PJ (Predictus API) (2 semanas)
**Status:** 🟡 **CÓDIGO CRIADO - PRECISA TESTES**

**Issues:**
- 🟡 2.2.1 Finalizar Endpoints Predictus PJ
  - ✅ Código criado (Issue 5.3 anterior)
  - ⏳ Renomear rotas para `/api/v1/dados360/pj`
  - ⏳ Testar integração PredictusAPIClient
  - ⏳ Validar cache Redis
  
- ⏳ 2.2.2 Integração Frontend Dados 360° PJ
  - ⏳ Hook `useDados360PJ()`
  - ⏳ Remover mockdata
  
- ⏳ 2.2.3 Sistema de Relacionamento Sócios
  - ⏳ CRUD `socios.py`
  - ⏳ Endpoints de relacionamentos
  - ⏳ Grafo de sócios

**Arquivos já criados:**
- `backend/app/schemas/research_pj.py` (330 linhas)
- `backend/app/api/v1/endpoints/research_pj.py` (455 linhas)
- `backend/app/api/deps.py` (125 linhas)

---

#### Sprint 2.3 - Dados 360° PF (DirectData API) (2 semanas)
**Status:** ⏳ Planejado

---

#### Sprint 2.4 - Radar Jurídico (2 semanas)
**Status:** ⏳ Planejado

---

#### Sprint 2.5 - Sistema de Créditos Real (1 semana)
**Status:** ⏳ Planejado

---

#### Sprint 2.6 - Gateway de Pagamentos (1.5 semanas)
**Status:** ⏳ Planejado

---

#### Sprint 2.7 - Favoritos, Alertas, Relatórios (1 semana)
**Status:** ⏳ Planejado

---

### 🏃 DELIVERY 3: Autenticação RBAC (2-3 semanas)
**Status:** ⏳ Planejado

**Objetivo:** Implementar sistema completo de autenticação e autorização

**Componentes:**
- Login/Registro/Recuperação de Senha
- JWT Tokens
- RBAC (Role-Based Access Control)
- Middleware de autenticação
- Proteção de rotas frontend
- Auditoria de acessos

---

### 🏃 DELIVERY 4: Segurança e Produção (2-3 semanas)
**Status:** ⏳ Planejado

**Objetivo:** Preparar aplicação para produção

**Componentes:**
- HTTPS obrigatório
- Rate limiting
- CORS configurado
- Logging estruturado
- Monitoring (Sentry)
- CI/CD pipeline
- Backup automatizado
- Documentação de deploy

---

## 🐛 Bugs Corrigidos

### Bug #11: AttributeError - NOME_FANTASIA
**Data:** 24/10/2025  
**Sprint:** 2.2  
**Status:** ✅ RESOLVIDO

**Problema:**
```python
AttributeError: type object 'TipoBusca' has no attribute 'NOME_FANTASIA'
```

**Causa:**
- Linha 183 de `smart_cnpj.py` referenciava `TipoBusca.NOME_FANTASIA`
- Enum não tinha esse valor

**Solução:**
```python
# ANTES ❌
if tipo_busca in [TipoBusca.RAZAO_SOCIAL, TipoBusca.NOME_FANTASIA, TipoBusca.SEGMENTO]:

# DEPOIS ✅
if tipo_busca in [TipoBusca.RAZAO_SOCIAL, TipoBusca.SEGMENTO]:
```

**Arquivo:** `backend/app/crud/smart_cnpj.py:183`

---

### Bug #12: Performance - Busca por Razão Social (37 segundos)
**Data:** 24/10/2025  
**Sprint:** 2.2  
**Status:** ✅ RESOLVIDO

**Problema:**
- Busca por razão social com `ILIKE '%shoptudo%'` levava 37 segundos
- Timeout em produção
- Full table scan em 64 milhões de registros

**Causa:**
- Query usando `ILIKE '%termo%'` com wildcard no início
- PostgreSQL não pode usar índice B-tree com wildcard à esquerda
- Não havia índice GIN trigram apropriado

**Solução:**
Criado índice GIN trigram:
```sql
CREATE INDEX idx_empresas_razao_social_gin_trgm 
ON cnpj.empresas USING gin (razao_social gin_trgm_ops);
```

**Performance:**
- **ANTES:** 37.000ms (37 segundos)
- **DEPOIS:** 82ms
- **Melhoria:** 99,7% mais rápido (450x)

**Arquivos modificados:**
- `backend/scripts/02_create_indexes.sql` (documentado)
- Índice criado via psql direto no banco

**Lições Aprendidas:**
- Sempre verificar índices existentes antes de criar novos
- GIN trigram é essencial para `ILIKE '%term%'`
- Full-text search (to_tsvector) não ajuda com partial matching
- Revisar scripts SQL setup para entender infraestrutura

---

### Bugfix Sprint 2.2 - 5 Erros Críticos
**Data:** 24/10/2025  
**Documento:** `docs/old/BUGFIX_SMART_CNPJ_SEARCH.md`  
**Status:** ✅ TODOS RESOLVIDOS

**Erros corrigidos:**

1. **Redis Connection Error**
   ```python
   # ANTES ❌
   settings.REDIS_URL
   
   # DEPOIS ✅
   settings.redis_url  # É uma @property
   ```
   Arquivo: `backend/app/api/v1/endpoints/smart_cnpj.py:51`

2. **Page Size Attribute Error**
   ```python
   # ANTES ❌
   limit=request.page_size
   
   # DEPOIS ✅
   limit=request.limit  # Schema define 'limit'
   ```
   Arquivo: `backend/app/services/smart_cnpj_service.py:216`

3. **CNAE Relationship Error**
   ```python
   # ANTES ❌
   joinedload(Estabelecimento.municipio)      # Conflita com coluna
   joinedload(Estabelecimento.cnae_fiscal)     # Não existe
   
   # DEPOIS ✅
   joinedload(Estabelecimento.municipio_obj)  # Relationship correto
   joinedload(Estabelecimento.cnae_principal)  # Relationship correto
   ```
   Arquivo: `backend/app/crud/smart_cnpj.py:170-171`

4. **Pagination Metadata Creation Error**
   ```python
   # ANTES ❌
   metadata = PaginationMetadata.create(...)  # Não existe em Pydantic v2
   
   # DEPOIS ✅
   total_pages = (total + request.limit - 1) // request.limit
   metadata = PaginationMetadata(
       total=total,
       page=request.page,
       limit=request.limit,
       totalPages=total_pages,
       hasNext=request.page < total_pages,
       hasPrev=request.page > 1
   )
   ```
   Arquivo: `backend/app/services/smart_cnpj_service.py:228`

5. **Response Schema Mismatch**
   ```python
   # ANTES ❌
   response = SmartCNPJSearchResponse(
       empresas=empresas,              # Schema espera 'data'
       creditosUsados=5,               # Não existe
       tempoRespostaMs=tempo           # Schema espera 'tempoResposta'
   )
   
   # DEPOIS ✅
   response = SmartCNPJSearchResponse(
       data=empresas,                  # Correto
       pagination=metadata,
       filters=filtros_dict,
       searchType=request.tipo_busca.value,
       searchValue=request.valor_busca,
       tempoResposta=tempo_resposta_ms  # Correto
   )
   ```
   Arquivo: `backend/app/services/smart_cnpj_service.py:249`

**Lições Aprendidas:**
- Pydantic v2 não expõe `@classmethod` como atributos
- Manter consistência entre Request/Service/Response schemas
- Evitar conflitos entre colunas e relationships (usar sufixos)
- Settings do FastAPI podem usar `@property`
- Adicionar `traceback.format_exc()` em catches genéricos

---

## 🎨 Design System

### Paleta Shopee-Inspired

**Inspiração:** Shopee (marketplace asiático vibrante e alegre)

**Cores Principais:**
- **Primária:** Laranja vibrante (#EE4D2D ou similar)
- **Secundária:** Branco limpo (#FFFFFF)
- **Accent:** Gradientes suaves (laranja → rosa)
- **Neutros:** Cinzas modernos para textos

**Fontes:**
- **Títulos:** Inter, Poppins ou Montserrat (bold, alegre)
- **Corpo:** Inter ou Open Sans (legível, moderna)

**Objetivo:**
- Transmitir felicidade e leveza no UX
- Paleta vibrante mas profissional
- Alta legibilidade

**Componentes Base:**
- `Button.tsx` (primary, secondary, ghost)
- `Card.tsx` (variants: default, elevated, bordered)
- `Badge.tsx` (status colors)
- `Alert.tsx` (success, warning, error, info)
- `Input.tsx` (text, search, masked)
- `Select.tsx` (dropdown)

**Framework:** Tailwind CSS + shadcn/ui

---

## 💳 Sistema de Créditos

### Regra de Cobrança

**Filosofia:**
- ✅ **Cada pesquisa cobra créditos** (mesmo CPF/CNPJ repetido)
- ✅ Cliente pode **ver resultados salvos** sem pagar novamente
- ✅ **Nova pesquisa** do mesmo documento = **nova cobrança**

**Por que cobrar novamente?**
- Dados podem ter sido atualizados
- Atualização de processos, dívidas, situação cadastral
- Cliente escolhe: ver resultado antigo (grátis) ou pesquisar novamente (pago)

### Custos por Produto

| Produto | Custo (créditos) |
|---------|------------------|
| Smart CNPJ 360° | 5 |
| Dados 360° PF | 8 |
| Dados 360° PJ | 10 |
| Radar Jurídico PF | 20 |
| Radar Jurídico PJ | 20 |
| Radar Financeiro (varia) | 5-25 |

### Implementação Técnica

**Tabelas:**
- `user_credits` - Saldo atual por usuário
- `credit_transactions` - Histórico de transações
- `pesquisa_cnpj` - Histórico de buscas Smart CNPJ

**Trigger Automático:**
```sql
CREATE TRIGGER trg_registrar_uso_credito
    AFTER INSERT ON public.pesquisa_cnpj
    FOR EACH ROW
    EXECUTE FUNCTION registrar_uso_credito();
```

**Funcionamento:**
1. Ao inserir registro em `pesquisa_cnpj`
2. Trigger debita automaticamente `creditos_usados` do saldo
3. Registra transação em `credit_transactions`
4. Atualiza `total_spent` no histórico

**Validação de Saldo:**
- Feita na camada da aplicação (antes do INSERT)
- HTTP 402 Payment Required se saldo insuficiente

---

## 🔄 Estado Atual do Desenvolvimento

### 📊 Progresso Geral

**Delivery 1 (Frontend):** 🟡 10% completo  
**Delivery 2 (Backend):** 🟡 25% completo  
**Delivery 3 (Auth):** ⏳ 0% (não iniciado)  
**Delivery 4 (Produção):** ⏳ 0% (não iniciado)

### ✅ Componentes Funcionais

**Backend:**
- ✅ FastAPI app rodando
- ✅ PostgreSQL conectado (host.docker.internal)
- ✅ Redis conectado
- ✅ Celery Worker e Beat rodando
- ✅ Health check endpoint
- ✅ Smart CNPJ search (CNPJ, Razão Social, CNAE)
- ✅ Sistema de créditos básico
- ✅ Histórico de pesquisas
- ✅ Índices de performance (GIN trigram)

**Frontend:**
- ✅ Next.js 14 rodando
- ⏳ Design System (em progresso)
- ⏳ Layout principal (em progresso)
- ⏳ Smart CNPJ pages (parcial)

**Infraestrutura:**
- ✅ Docker Compose configurado
- ✅ Scripts de backup
- ✅ Scripts SQL de setup
- ✅ Alembic migrations

### ⏳ Componentes em Desenvolvimento

**Backend:**
- ⏳ Dados 360° PJ (código 90% pronto, precisa testes)
- ⏳ Smart CNPJ - buscas por Email/Telefone (timeout)
- ⏳ Gateway de pagamentos
- ⏳ PDF generation
- ⏳ Sistema de alertas

**Frontend:**
- ⏳ Todos os produtos (mockdata)
- ⏳ Integração com backend
- ⏳ Componentes UI completos

### ❌ Componentes Não Iniciados

**Backend:**
- ❌ Dados 360° PF
- ❌ Radar Jurídico
- ❌ Radar Financeiro (7 subprodutos)
- ❌ Sistema de autenticação
- ❌ RBAC
- ❌ Rate limiting
- ❌ Monitoring

**Frontend:**
- ❌ Dados 360° (PF e PJ pages completas)
- ❌ Radar Jurídico pages
- ❌ Radar Financeiro pages
- ❌ Sistema de favoritos
- ❌ Sistema de alertas
- ❌ Relatórios

---

## 🚀 Próximos Passos

### Curto Prazo (1-2 semanas)

1. **Investigar buscas com timeout:**
   - ✅ Email search (timeout)
   - ✅ Telefone search (timeout)
   - Criar índices apropriados se necessário

2. **Finalizar Sprint 1.1:**
   - Design System Shopee completo
   - Layout principal responsivo

3. **Testar Dados 360° PJ:**
   - Rodar endpoints criados
   - Validar integração Predictus
   - Corrigir bugs

4. **Conectar frontend Smart CNPJ ao backend:**
   - Atualizar hook `useSmartCNPJ()`
   - Remover mockdata
   - Tratamento de erros

### Médio Prazo (1-2 meses)

1. **Completar Delivery 1 (Frontend):**
   - Sprints 1.2 a 1.6
   - 4 produtos com mockdata
   - UI completa e responsiva

2. **Completar Delivery 2 (Backend):**
   - Sprints 2.2 a 2.7
   - APIs reais para 4 produtos
   - Gateway de pagamentos
   - Favoritos/Alertas/Relatórios

### Longo Prazo (3-6 meses)

1. **Delivery 3 (Autenticação):**
   - JWT, RBAC
   - Login/Registro
   - Proteção de rotas

2. **Delivery 4 (Produção):**
   - HTTPS
   - Rate limiting
   - Monitoring
   - CI/CD
   - Deploy

---

## 📚 Documentação Adicional

**Ver também:**
- `estrutura_db.md` - Estrutura completa do banco de dados
- `estrutura_servicos.md` - Tecnologias e serviços (Docker, APIs externas)
- `docs/old/ROADMAP_SPRINTS.md` - Roadmap completo original
- `docs/old/BUGFIX_SMART_CNPJ_SEARCH.md` - Detalhes dos bugs corrigidos

---

**Última atualização:** 24/10/2025 20:30  
**Responsável:** Sistema de IA  
**Versão:** 1.0
