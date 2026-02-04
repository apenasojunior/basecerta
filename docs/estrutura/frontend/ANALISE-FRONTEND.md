# 📊 Análise Completa do Frontend - BaseCerta

**Data da Análise:** 2024  
**Versão:** 1.0  
**Plataforma:** Next.js 16.0.0 + React 19.2.0

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Stack Tecnológica](#-stack-tecnológica)
3. [Arquitetura e Estrutura](#-arquitetura-e-estrutura)
4. [Sistema de Design](#-sistema-de-design)
5. [Navegação e Menus](#-navegação-e-menus)
6. [Rotas e Páginas](#-rotas-e-páginas)
7. [Funcionalidades de Busca](#-funcionalidades-de-busca)
8. [Biblioteca de Componentes](#-biblioteca-de-componentes)
9. [Gerenciamento de Estado](#-gerenciamento-de-estado)
10. [Integração com Backend](#-integração-com-backend)
11. [Pontos de Integração](#-pontos-de-integração)
12. [Recomendações](#-recomendações)

---

## 🎯 Visão Geral

### Propósito da Aplicação
Plataforma completa de consulta e análise de dados empresariais (CNPJ), pessoais (CPF) e jurídicos, com foco em inteligência de negócios B2B.

### Nome da Plataforma
**BaseCerta** - Plataforma de Consulta de Dados

### Localização
- **Idioma:** Português (pt-BR)
- **Público-alvo:** Empresas brasileiras (B2B)

### Performance
- **Meta de carregamento:** < 100ms para insights (via cache)
- **Lazy loading:** Componentes pesados do dashboard
- **Suspense boundaries:** Implementadas para melhor UX

---

## 🛠 Stack Tecnológica

### Core Framework
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Next.js** | 16.0.0 | Framework React com SSR/SSG |
| **React** | 19.2.0 | Biblioteca UI |
| **TypeScript** | 5.5.4 | Type safety |

### Estilização
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **TailwindCSS** | 3.4.7 | Utility-first CSS framework |
| **tailwindcss-animate** | - | Animações customizadas |
| **@tailwindcss/forms** | - | Estilização de formulários |
| **@tailwindcss/typography** | - | Tipografia melhorada |

### UI Components
| Biblioteca | Versão | Componentes |
|-----------|--------|-------------|
| **Radix UI** | - | Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Label, Progress, Radio Group, Select, Tabs, Toast |

### Data Fetching & State
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **@tanstack/react-query** | 5.51.1 | Gerenciamento de estado assíncrono, cache |
| **@tanstack/react-table** | 8.21.3 | Tabelas de dados avançadas |
| **Axios** | 1.7.2 | HTTP client |

### Forms & Validation
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React Hook Form** | 7.52.1 | Gerenciamento de formulários |
| **Zod** | 3.23.8 | Validação de schemas |

### Data Visualization
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Recharts** | 2.15.4 | Gráficos e visualizações |

### Icons & Assets
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Lucide React** | 0.472.0 | Biblioteca de ícones |

### Notifications
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Sonner** | 1.7.3 | Toast notifications |

### DevTools
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **ESLint** | 8 | Linting |
| **Prettier** | - | Code formatting |
| **Jest** | - | Testing framework |
| **@testing-library/react** | - | Component testing |

---

## 🏗 Arquitetura e Estrutura

### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router (Rotas)
│   │   ├── layout.tsx            # Layout raiz com fontes
│   │   ├── page.tsx              # Página inicial
│   │   ├── globals.css           # Estilos globais + CSS variables
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── smart-cnpj/           # CNPJ 360° (insights + busca)
│   │   ├── dados360/             # Dados PF/PJ
│   │   ├── radar-financeiro/     # Radar Financeiro
│   │   ├── radar-juridico/       # Radar Jurídico PF/PJ
│   │   ├── produtos/             # Produtos/Serviços
│   │   ├── alertas/              # Sistema de alertas
│   │   ├── favoritos/            # Favoritos do usuário
│   │   ├── historico/            # Histórico de consultas
│   │   ├── relatorios/           # Geração de relatórios
│   │   ├── credits/              # Gestão de créditos
│   │   ├── plans/                # Planos de assinatura
│   │   └── packages/             # Pacotes de créditos
│   │
│   ├── components/               # Componentes React
│   │   ├── ui/                   # Componentes base (40+)
│   │   ├── layout/               # Header, Sidebar, Footer, Logo
│   │   ├── smart-cnpj/           # Componentes CNPJ (17+)
│   │   ├── dashboard/            # Componentes Dashboard
│   │   ├── dados360/             # Componentes Dados 360
│   │   ├── produtos/             # Componentes Produtos
│   │   ├── radar-juridico/       # Componentes Radar Jurídico
│   │   ├── forms/                # Formulários reutilizáveis
│   │   ├── providers/            # Context Providers
│   │   ├── error/                # Error Boundaries
│   │   └── favoritos/            # Componentes Favoritos
│   │
│   ├── lib/                      # Utilitários e configurações
│   │   ├── api/                  # Cliente HTTP + Endpoints
│   │   │   ├── client.ts         # Axios client configurado
│   │   │   └── endpoints/        # Serviços de API
│   │   ├── adapters/             # Adaptadores de dados
│   │   ├── transformers/         # Transformadores de dados
│   │   ├── utils/                # Funções utilitárias
│   │   ├── formatters.ts         # Formatadores (CNPJ, CPF, etc)
│   │   └── constants/            # Constantes da aplicação
│   │
│   ├── hooks/                    # React Hooks customizados (15+)
│   │   ├── useSmartCNPJ.ts       # Hook Smart CNPJ
│   │   ├── useDados360PF.ts      # Hook Dados 360 PF
│   │   ├── useDados360PJ.ts      # Hook Dados 360 PJ
│   │   ├── useRadarJuridico.ts   # Hook Radar Jurídico
│   │   ├── useCredits.ts         # Hook Créditos
│   │   ├── useFavorites.ts       # Hook Favoritos
│   │   ├── useSearchHistory.ts   # Hook Histórico
│   │   ├── useDashboard.ts       # Hook Dashboard
│   │   ├── useDebounce.ts        # Hook Debounce
│   │   ├── useLocalStorage.ts    # Hook LocalStorage
│   │   └── use-toast.ts          # Hook Toast
│   │
│   ├── types/                    # TypeScript Type Definitions (8 arquivos)
│   │   ├── api.ts                # Tipos API
│   │   ├── company.ts            # Tipos Empresa
│   │   ├── person.ts             # Tipos Pessoa
│   │   ├── smart-cnpj.ts         # Tipos Smart CNPJ
│   │   ├── insights.ts           # Tipos Insights
│   │   ├── entities.ts           # Entidades gerais
│   │   ├── enums.ts              # Enumerações
│   │   └── index.ts              # Exports
│   │
│   ├── contexts/                 # React Context
│   │   └── LayoutContext.tsx     # Contexto de Layout (sidebar/mobile)
│   │
│   ├── constants/                # Constantes
│   │   └── navigation.ts         # Definição de menus e rotas
│   │
│   └── mocks/                    # Dados mock para desenvolvimento
│
├── public/                       # Assets estáticos
├── .next/                        # Build do Next.js
├── components.json               # Config shadcn/ui
├── tailwind.config.ts            # Config TailwindCSS
├── tsconfig.json                 # Config TypeScript
├── next.config.js                # Config Next.js
├── postcss.config.js             # Config PostCSS
└── package.json                  # Dependências

```

### Padrões Arquiteturais

#### 1. **App Router (Next.js 13+)**
- Estrutura baseada em pastas em `src/app/`
- Cada pasta representa uma rota
- Arquivos especiais: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

#### 2. **Component-Driven Architecture**
- Componentes atômicos e reutilizáveis em `ui/`
- Componentes compostos por feature em pastas específicas
- Separação clara entre apresentação e lógica

#### 3. **Custom Hooks Pattern**
- Lógica de negócio isolada em hooks
- Reutilização de código entre componentes
- Exemplo: `useSmartCNPJ`, `useCredits`, `useDashboard`

#### 4. **Service Layer Pattern**
- Camada de serviços em `lib/api/endpoints/`
- Cliente HTTP centralizado (`client.ts`)
- Separação entre lógica de API e componentes

#### 5. **Context API + React Query**
- Contextos para estado global simples (layout, tema)
- React Query para estado assíncrono (API data)
- Melhor performance e cache automático

---

## 🎨 Sistema de Design

### Paleta de Cores

#### Cores Primárias (Inspiradas no Shopee)
```css
--primary-50:  #FFF5F2  /* Muito claro */
--primary-100: #FFE8E0  /* Claro */
--primary-200: #FFCFBD  /* Claro médio */
--primary-300: #FFB199  /* Médio claro */
--primary-400: #FF8766  /* Médio */
--primary-500: #EE4D2D  /* Principal - Laranja Shopee */
--primary-600: #D43919  /* Escuro médio */
--primary-700: #B32A12  /* Escuro */
--primary-800: #921F0E  /* Muito escuro */
--primary-900: #78180C  /* Extremamente escuro */
```

**Uso Principal:** Botões de ação, links importantes, badges, highlights

#### Cores Semânticas

**Sucesso (Verde)**
```css
--success-light: #D4EDDA
--success:       #28A745  /* Bootstrap Success */
--success-dark:  #1E7E34
```

**Erro (Vermelho)**
```css
--error-light: #F8D7DA
--error:       #DC3545  /* Bootstrap Danger */
--error-dark:  #C82333
```

**Aviso (Amarelo)**
```css
--warning-light: #FFF3CD
--warning:       #FFC107  /* Bootstrap Warning */
--warning-dark:  #E0A800
```

**Informação (Azul)**
```css
--info-light: #D1ECF1
--info:       #17A2B8  /* Bootstrap Info */
--info-dark:  #117A8B
```

#### Cores Neutras
```css
--background:  #F4F4F4  /* Cinza muito claro */
--foreground:  #333333  /* Texto principal */
--card:        #FFFFFF  /* Fundo de cards */
--border:      #E8E8E8  /* Bordas */
--muted:       #F5F5F5  /* Fundo suave */
```

#### Cores de Charts
```css
--chart-1: hsl(12, 76%, 61%)   /* Laranja/Coral */
--chart-2: hsl(173, 58%, 39%)  /* Turquesa */
--chart-3: hsl(197, 37%, 24%)  /* Azul escuro */
--chart-4: hsl(43, 74%, 66%)   /* Amarelo */
--chart-5: hsl(27, 87%, 67%)   /* Laranja claro */
```

### Tipografia

#### Fontes
```typescript
// Definidas em src/app/layout.tsx via next/font/google

1. **Inter** (--font-inter)
   - Uso: Texto principal, corpo, UI
   - Peso: Variable (100-900)
   - Categoria: sans-serif

2. **Poppins** (--font-poppins)
   - Uso: Títulos, headings, destaques
   - Pesos: 400, 500, 600, 700, 800
   - Categoria: display

3. **Roboto Mono** (--font-roboto-mono)
   - Uso: Códigos, CNPJ, CPF, dados técnicos
   - Pesos: 400, 500, 700
   - Categoria: monospace
```

#### Hierarquia de Texto (TailwindCSS)
```css
/* Headings */
text-3xl (30px)  → h1 principal
text-2xl (24px)  → h2 seções
text-xl  (20px)  → h3 subseções
text-lg  (18px)  → h4 cards

/* Body */
text-base (16px) → Texto padrão
text-sm   (14px) → Texto secundário
text-xs   (12px) → Labels, badges

/* Font Weights */
font-normal (400)
font-medium (500)
font-semibold (600)
font-bold (700)
font-extrabold (800)
```

### Espaçamento (Spacing Scale)
```css
/* TailwindCSS default scale (rem) */
0    → 0
1    → 0.25rem (4px)
2    → 0.5rem  (8px)
3    → 0.75rem (12px)
4    → 1rem    (16px)  ← Base comum
6    → 1.5rem  (24px)
8    → 2rem    (32px)
12   → 3rem    (48px)
16   → 4rem    (64px)
```

**Uso comum:**
- `p-4` / `p-6` → Padding interno de cards
- `gap-4` / `gap-6` → Espaçamento entre elementos
- `space-y-4` → Espaçamento vertical entre itens

### Border Radius
```css
--radius: 0.5rem  /* 8px - Padrão global */

/* Variações TailwindCSS */
rounded-sm  → calc(var(--radius) - 4px)  /* 4px */
rounded-md  → calc(var(--radius) - 2px)  /* 6px */
rounded-lg  → var(--radius)              /* 8px */
rounded-xl  → 0.75rem                    /* 12px */
rounded-2xl → 1rem                       /* 16px */
```

### Sombras (Shadows)
```css
/* Custom shadows em tailwind.config.ts */
shadow-sm      → 0 2px 4px rgba(0,0,0,0.05)
shadow         → 0 2px 8px rgba(0,0,0,0.08)
shadow-md      → 0 4px 12px rgba(0,0,0,0.1)
shadow-lg      → 0 8px 24px rgba(0,0,0,0.12)
shadow-xl      → 0 20px 60px rgba(0,0,0,0.3)
shadow-primary → 0 4px 12px rgba(238,77,45,0.3)
```

### Animações
```css
/* Animações customizadas */
accordion-down  → Expansão de accordion (0.2s ease-out)
accordion-up    → Fechamento de accordion (0.2s ease-out)
fadeIn          → Fade in (0.3s ease-out)
slideInRight    → Deslizar da direita (0.3s ease-out)
slideInDown     → Deslizar de cima (0.3s ease-out)
spin            → Rotação 360° (1s linear infinite)
pulse           → Pulsação (2s cubic-bezier infinite)
```

### Breakpoints (Responsive)
```css
/* TailwindCSS breakpoints */
sm:  640px   → Smartphones grandes
md:  768px   → Tablets
lg:  1024px  → Laptops
xl:  1280px  → Desktops
2xl: 1536px  → Desktops grandes

/* Container max-width */
2xl: 1400px  → Customizado em tailwind.config.ts
```

---

## 🧭 Navegação e Menus

### Estrutura de Navegação
Definida em: `src/constants/navigation.ts`

#### Menu Lateral (Sidebar)

##### 1. **Dashboard** (Item único)
- **Ícone:** LayoutDashboard
- **Rota:** `/dashboard`
- **Descrição:** Visão geral de métricas e atividades

##### 2. **PRODUTOS** (Grupo)

###### Smart CNPJ 360° (Com submenu)
- **Ícone:** Building2
- **Rota base:** `/smart-cnpj`
- **Subitens:**
  - **Insights Estratégicos** (`/smart-cnpj`)
    - Ícone: Sparkles
    - 15 insights pré-calculados em cache
  - **Busca Avançada** (`/smart-cnpj/search`)
    - Ícone: Search
    - Busca por 7 tipos de filtros
  - **Empresas Similares** (`/smart-cnpj/similares`)
    - Ícone: Copy
    - Badge: "Novo"

###### Dados 360° - Pessoa Física
- **Ícone:** UserIcon
- **Rota:** `/dados360/pf/search`

###### Dados 360° - Pessoa Jurídica
- **Ícone:** Building2
- **Rota:** `/dados360/pj/search`

###### Radar Financeiro
- **Ícone:** TrendingUp
- **Rota:** `/radar-financeiro`

##### 3. **RADAR JURÍDICO** (Grupo)

###### Pessoa Física
- **Ícone:** Users
- **Rota:** `/radar-juridico/pf/search`

###### Pessoa Jurídica
- **Ícone:** Building
- **Rota:** `/radar-juridico/pj/search`

##### 4. **GESTÃO** (Grupo)

###### Créditos e Planos
- **Ícone:** CreditCard
- **Rota:** `/credits`

###### Favoritos
- **Ícone:** Star
- **Rota:** `/favoritos`

###### Alertas
- **Ícone:** Bell
- **Rota:** `/alertas`

###### Relatórios
- **Ícone:** FileBarChart
- **Rota:** `/relatorios`

##### 5. **AJUDA** (Grupo)

###### Central de Ajuda
- **Ícone:** HelpCircle
- **Rota:** `/help`

### Comportamento da Sidebar

#### Desktop (≥768px)
- **Largura Expandida:** 288px (w-72)
- **Largura Recolhida:** 80px (w-20)
- **Transição:** 300ms ease-in-out
- **Estado padrão:** Expandida
- **Botão toggle:** Menu (expandir) / X (recolher)

#### Mobile (<768px)
- **Posicionamento:** Fixed overlay (z-50)
- **Largura:** 288px (w-72)
- **Overlay escuro:** 50% opacidade (bg-black/50)
- **Animação:** Slide in/out da esquerda

### Header (Topo)

#### Elementos à Esquerda
- **Mobile Menu Button** (apenas <768px)
  - Ícone: Menu
  - Abre sidebar mobile
- **Breadcrumbs** (apenas ≥640px)
  - Navegação hierárquica da página atual

#### Elementos à Direita

##### Display de Créditos
- **Desktop (≥640px):**
  - Ícone: Coins (ou Loader2 se carregando)
  - Label: "Créditos"
  - Valor: `{available} / {total}`
  - Cor: primary-600
  - Background: primary-50/100 (hover)
  - Link: `/credits`

- **Mobile (<640px):**
  - Apenas ícone Coins
  - Mesmo link e comportamento

##### Notificações
- **DropdownMenu**
  - Ícone: Bell
  - Badge: Contador de não lidas
  - Lista de notificações recentes
  - Estados: lida/não lida

##### Perfil do Usuário
- **DropdownMenu**
  - Avatar com iniciais
  - Nome e email
  - Menu: Configurações, Sair

---

## 📄 Rotas e Páginas

### Mapa Completo de Rotas

```
/                              → Página inicial (landing)
├── /dashboard                 → Dashboard principal
│
├── /smart-cnpj                → Smart CNPJ Insights
│   ├── /search                → Busca avançada CNPJ
│   └── /similares             → Empresas similares (Novo)
│
├── /dados360/
│   ├── /pf/search             → Dados 360° Pessoa Física
│   └── /pj/search             → Dados 360° Pessoa Jurídica
│
├── /radar-financeiro          → Radar Financeiro
│
├── /radar-juridico/
│   ├── /pf/search             → Radar Jurídico PF
│   └── /pj/search             → Radar Jurídico PJ
│
├── /produtos                  → Catálogo de produtos
│
├── /alertas                   → Sistema de alertas
│
├── /favoritos                 → Favoritos salvos
│
├── /historico                 → Histórico de consultas
│
├── /relatorios                → Geração de relatórios
│
├── /credits                   → Gestão de créditos
│   ├── /plans                 → Planos de assinatura
│   └── /packages              → Pacotes de créditos
│
├── /help                      → Central de ajuda
│
└── /test                      → Página de testes (desenvolvimento)
```

### Páginas Públicas (Sem Layout)
```typescript
// Definidas em AppLayout.tsx
const publicPages = ['/login', '/register', '/forgot-password']
```
Estas páginas não renderizam Header/Sidebar/Footer.

### Descrição Detalhada das Rotas

#### `/dashboard` - Dashboard Principal
**Propósito:** Visão geral de métricas e atividades do usuário

**Componentes principais:**
- **SearchStatsCards:** Estatísticas de consultas (lazy loaded)
- **RecentSearches:** Últimas buscas realizadas (lazy loaded)
- **SearchChart:** Gráfico de consultas (lazy loaded)
- **TopSearched:** Empresas mais consultadas (lazy loaded)

**Dados exibidos:**
- Consultas hoje (com variação %)
- Créditos disponíveis
- Empresas consultadas (com variação %)
- Processos jurídicos (com variação %)
- Atividades recentes (10 últimas)

**Hooks utilizados:**
- `useDashboard()` → Estatísticas da API
- `useCredits()` → Saldo de créditos

**Performance:**
- Lazy loading de componentes pesados
- Suspense boundaries
- Fallback para dados mock durante carregamento

---

#### `/smart-cnpj` - Smart CNPJ Insights
**Propósito:** Página de insights estratégicos pré-calculados (cache)

**Performance:**
- **Meta:** <100ms de carregamento
- **Cache:** 15 insights pré-calculados no backend
- **Atualização:** Background job (celery)

**Insights exibidos (3 categorias):**

1. **Setores (6 insights)**
   - Tecnologia, Comércio, Serviços, Construção, etc.
   - Cada card mostra: total de empresas, descrição, botão de ação

2. **Estados (6 insights)**
   - SP, RJ, MG, PR, SC, RS
   - Total de empresas por estado

3. **Capital Social (3 insights)**
   - Micro empresas (até R$ 360K)
   - Pequenas (R$ 360K - R$ 4.8M)
   - Médias/Grandes (acima R$ 4.8M)

**Componentes:**
- `InsightCard` → Card individual de insight
- `InsightCardSkeleton` → Loading state

**Hooks:**
- API: `getGroupedInsights()` → `/insights/grouped`
- Performance tracking: `performance.now()`

**Estados:**
- **Loading:** Skeleton cards (6 por linha)
- **Success:** Grid responsivo de cards
- **Error:** Card vermelho com retry

---

#### `/smart-cnpj/search` - Busca Avançada CNPJ
**Propósito:** Busca por múltiplos critérios (CNPJ, razão social, segmento, etc.)

**Tipos de busca (7 opções):**
1. **CNPJ**
   - Máscara: `00.000.000/0000-00`
   - Ícone: Grid3x3
   - Placeholder: "00.000.000/0000-00"

2. **Razão Social**
   - Ícone: Building2
   - Placeholder: "Digite a razão social ou nome fantasia"

3. **Segmento (CNAE)**
   - Ícone: Search
   - Placeholder: "Digite o segmento ou atividade"

4. **E-mail**
   - Ícone: Mail
   - Placeholder: "exemplo@empresa.com.br"

5. **Telefone**
   - Máscara: `(00) 00000-0000`
   - Ícone: Phone
   - Placeholder: "(00) 00000-0000"

6. **Nome do Sócio**
   - Ícone: User
   - Placeholder: "Digite o nome do sócio"

7. **CEP**
   - Máscara: `00000-000`
   - Ícone: MapPin
   - Placeholder: "00000-000"

**Componentes:**
- `SearchForm` → Formulário de busca com máscaras
- `FilterPanel` → Filtros avançados
- `ResultsList` → Lista de resultados
- `CompanyCard` → Card de empresa nos resultados
- `ExportButton` / `ExportDialog` → Exportação de dados

**Features:**
- Máscaras automáticas (CNPJ, telefone, CEP)
- Validação com Zod
- Debounce (500ms) para busca
- Paginação
- Exportação (CSV, Excel, PDF)

---

#### `/dados360/pf/search` - Dados 360° Pessoa Física
**Propósito:** Consulta completa de dados de pessoa física (CPF)

**Hooks:**
- `useDados360PF()` → Busca por CPF

---

#### `/dados360/pj/search` - Dados 360° Pessoa Jurídica
**Propósito:** Consulta completa de dados de pessoa jurídica (CNPJ)

**Hooks:**
- `useDados360PJ()` → Busca por CNPJ

---

#### `/radar-financeiro` - Radar Financeiro
**Propósito:** Análise financeira de empresas

**Hooks:**
- `useFinancialDossie()` → Dossiê financeiro

---

#### `/radar-juridico/pf/search` - Radar Jurídico PF
**Propósito:** Consulta de processos jurídicos de pessoa física

**Hooks:**
- `useRadarJuridico()` → Busca processos PF

---

#### `/radar-juridico/pj/search` - Radar Jurídico PJ
**Propósito:** Consulta de processos jurídicos de pessoa jurídica

**Hooks:**
- `useRadarJuridico()` → Busca processos PJ

---

#### `/credits` - Gestão de Créditos
**Propósito:** Gerenciar saldo de créditos, recargas e histórico

**Hooks:**
- `useCredits()` → Saldo, histórico, recarga

**Dados exibidos:**
- Créditos disponíveis
- Créditos adicionados (total lifetime)
- Histórico de transações
- Botão de recarga

---

#### `/favoritos` - Favoritos
**Propósito:** Lista de empresas/pessoas favoritadas

**Hooks:**
- `useFavorites()` → CRUD de favoritos

---

#### `/alertas` - Alertas
**Propósito:** Sistema de notificações e alertas configuráveis

---

#### `/historico` - Histórico
**Propósito:** Histórico de todas as consultas realizadas

**Hooks:**
- `useSearchHistory()` → Lista de consultas passadas

---

#### `/relatorios` - Relatórios
**Propósito:** Geração e download de relatórios

---

## 🔍 Funcionalidades de Busca

### Tipos de Busca Implementadas

#### 1. **Busca por CNPJ** (Smart CNPJ)
**Input:** CNPJ com máscara (`00.000.000/0000-00`)

**Máscara automática:**
```typescript
// Regex: /\D/g removido, formatação aplicada
value.replace(/^(\d{2})(\d)/, '$1.$2')
     .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
     .replace(/\.(\d{3})(\d)/, '.$1/$2')
     .replace(/(\d{4})(\d)/, '$1-$2')
     .substring(0, 18)
```

**Validações:**
- Formato correto
- Dígitos verificadores

**Retorno esperado:**
- Dados da empresa (razão social, nome fantasia)
- Estabelecimentos (matriz/filiais)
- Sócios
- CNAEs (principal + secundários)
- Endereço completo
- Status cadastral
- Capital social

---

#### 2. **Busca por Razão Social / Nome Fantasia**
**Input:** Texto livre

**Features:**
- Busca parcial (ILIKE)
- Case-insensitive
- Ordenação por relevância

**Retorno esperado:**
- Lista de empresas correspondentes
- Paginação (10, 25, 50, 100 por página)

---

#### 3. **Busca por Segmento (CNAE)**
**Input:** Código CNAE ou descrição

**Features:**
- Autocomplete de CNAEs
- Busca por CNAE principal ou secundários
- Filtragem por seção (Tecnologia, Comércio, etc.)

**Retorno esperado:**
- Empresas do segmento
- Total de empresas
- Insights do setor

---

#### 4. **Busca por E-mail**
**Input:** E-mail empresarial

**Retorno esperado:**
- Empresas com aquele e-mail cadastrado

---

#### 5. **Busca por Telefone**
**Input:** Telefone com máscara (`(00) 00000-0000`)

**Máscara automática:**
```typescript
value.replace(/^(\d{2})(\d)/, '($1) $2')
     .replace(/(\d{5})(\d)/, '$1-$2')
     .substring(0, 15)
```

**Retorno esperado:**
- Empresas com aquele telefone

---

#### 6. **Busca por Nome do Sócio**
**Input:** Nome completo ou parcial

**Features:**
- Busca parcial (ILIKE)
- Listagem de empresas onde é sócio

**Retorno esperado:**
- Empresas vinculadas
- Qualificação do sócio (Administrador, Sócio, etc.)
- % de participação (se disponível)

---

#### 7. **Busca por CEP**
**Input:** CEP com máscara (`00000-000`)

**Máscara automática:**
```typescript
value.replace(/^(\d{5})(\d)/, '$1-$2')
     .substring(0, 9)
```

**Retorno esperado:**
- Empresas localizadas naquele CEP
- Agrupamento por bairro/cidade

---

### Componentes de Busca

#### `SearchForm`
**Localização:** `src/components/smart-cnpj/SearchForm.tsx`

**Props:**
```typescript
interface SearchFormProps {
  searchType: SearchType
  searchValue: string
  onSearchTypeChange: (type: SearchType) => void
  onSearchValueChange: (value: string) => void
  onSearch: () => void
  isSearching?: boolean
  className?: string
}
```

**Features:**
- Seleção de tipo de busca (7 opções)
- Máscaras automáticas (CNPJ, telefone, CEP)
- Validação em tempo real
- Loading state durante busca
- Botão "Mostrar mais tipos" (toggle 4 ↔ 7)

---

#### `FilterPanel`
**Localização:** `src/components/smart-cnpj/FilterPanel.tsx`

**Filtros avançados:**
- Estado (UF)
- Município
- Situação cadastral (Ativa, Baixada, Suspensa, etc.)
- Capital social (faixa de valores)
- Data de abertura (range)
- Porte (MEI, ME, EPP, etc.)

---

#### `ResultsList`
**Localização:** `src/components/smart-cnpj/ResultsList.tsx`

**Features:**
- Grid/List view toggle
- Paginação
- Ordenação (relevância, data, nome)
- Loading skeleton
- Empty state

---

### Debounce de Busca
**Hook:** `useDebounce.ts`

```typescript
const debouncedValue = useDebounce(searchValue, 500)
```
**Delay:** 500ms (evita requests desnecessários)

---

## 🧩 Biblioteca de Componentes

### Componentes UI Base (`src/components/ui/`)

Total: **40+ componentes**

#### Navegação
- `accordion.tsx` → Radix UI Accordion
- `tabs.tsx` → Radix UI Tabs
- `dropdown-menu.tsx` → Radix UI DropdownMenu
- `sheet.tsx` → Radix UI Sheet (sidebar mobile)

#### Formulários
- `input.tsx` → Input com variantes
- `input.example.tsx` → Exemplos de uso
- `search-input.tsx` → Input de busca com ícone
- `search-input.example.tsx`
- `label.tsx` → Radix UI Label
- `checkbox.tsx` → Radix UI Checkbox
- `radio-group.tsx` → Radix UI RadioGroup
- `select.tsx` → Radix UI Select com estilização

#### Botões
- `button.tsx` → Múltiplas variantes (default, outline, ghost, destructive, link)
- `button.example.tsx` → Exemplos

#### Feedback
- `alert.tsx` → Alertas (info, warning, error, success)
- `alert-dialog.tsx` → Radix UI AlertDialog
- `toast.tsx` → Radix UI Toast
- `toaster.tsx` → Toast container
- `sonner-toaster.tsx` → Sonner integration
- `spinner.tsx` → Loading spinner
- `loading-overlay.tsx` → Overlay de carregamento
- `skeleton.tsx` → Skeleton loading
- `progress.tsx` → Radix UI Progress
- `progress-bar.tsx` → Barra de progresso customizada

#### Layout
- `card.tsx` → Card com Header/Content/Footer
- `card.example.tsx`
- `modal.tsx` → Modal genérico
- `dialog.tsx` → Radix UI Dialog
- `collapsible.tsx` → Radix UI Collapsible

#### Dados
- `table.tsx` → Tabela estilizada
- `data-table.tsx` → Tabela com sorting, pagination (Tanstack Table)
- `data-table.example.tsx`
- `badge.tsx` → Badges (primary, success, error, warning, info)
- `avatar.tsx` → Radix UI Avatar
- `stats-card.tsx` → Card de estatísticas
- `pagination.tsx` → Paginação customizada
- `empty-state.tsx` → Estado vazio
- `empty-state.example.tsx`

### Componentes de Layout (`src/components/layout/`)

#### `Header.tsx`
**Elementos:**
- Mobile menu toggle
- Breadcrumbs (desktop)
- Display de créditos (com integração API)
- Notificações (DropdownMenu)
- Perfil do usuário (Avatar + DropdownMenu)

**Props:**
```typescript
interface HeaderProps {
  className?: string
  breadcrumbs?: { label: string; href?: string }[]
}
```

---

#### `Sidebar.tsx`
**Elementos:**
- Logo (com versão colapsada)
- Botão de toggle (expand/collapse)
- Menu de navegação hierárquico
- Grupos expansíveis
- Subitens (nested navigation)
- Hover state para modo colapsado

**Props:**
```typescript
interface SidebarProps {
  className?: string
}
```

**Estados:**
- Expandida: 288px
- Colapsada: 80px
- Mobile: overlay fixo

---

#### `Footer.tsx`
**Elementos:**
- Copyright
- Links úteis
- Redes sociais

---

#### `Logo.tsx`
**Props:**
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  collapsed?: boolean
}
```

**Variantes:**
- Full logo (texto + ícone)
- Icon only (modo colapsado)

---

### Componentes Smart CNPJ (`src/components/smart-cnpj/`)

Total: **17 componentes**

#### Busca
- `SearchForm.tsx` → Formulário de busca (7 tipos)
- `FilterPanel.tsx` → Painel de filtros avançados
- `ResultsList.tsx` → Lista de resultados
- `SmartCNPJResultsSkeleton.tsx` → Loading state

#### Visualização de Empresa
- `CompanyCard.tsx` → Card de empresa nos resultados
- `CompanyHeader.tsx` → Header com nome/status da empresa
- `IdentificationCard.tsx` → Dados de identificação (CNPJ, razão social, nome fantasia)
- `ClassificationCard.tsx` → Classificação (porte, natureza jurídica)
- `LocationCard.tsx` → Endereço completo
- `ContactCard.tsx` → Contatos (telefone, email)
- `StatusCard.tsx` → Situação cadastral, data de abertura

#### Insights
- `InsightCard.tsx` → Card de insight estratégico
- `InsightCard 2.tsx` → Variante alternativa (possivelmente duplicado)

#### Ações
- `ExportButton.tsx` → Botão de exportação
- `ExportButton 2.tsx` → Variante alternativa
- `ExportDialog.tsx` → Dialog de exportação (CSV, Excel, PDF)
- `ExportDialog 2.tsx` → Variante alternativa

**Observação:** Arquivos duplicados (`2.tsx`) podem ser versões antigas ou variantes. Recomenda-se auditoria.

---

### Componentes de Dashboard (`src/components/dashboard/`)

- `DashboardSkeleton.tsx` → Loading state do dashboard
- `SearchStatsCards.tsx` → Cards de estatísticas (lazy loaded)
- `RecentSearches.tsx` → Lista de buscas recentes (lazy loaded)
- `SearchChart.tsx` → Gráfico de consultas (Recharts, lazy loaded)
- `TopSearched.tsx` → Empresas mais consultadas (lazy loaded)

---

### Componentes de Erros (`src/components/error/`)

#### `ErrorBoundary.tsx`
**Funcionalidade:**
- Captura erros em componentes React
- Exibe UI de fallback
- Logging de erros
- Botão de retry

**Uso:**
```tsx
<ErrorBoundary>
  <AppLayoutContent>{children}</AppLayoutContent>
</ErrorBoundary>
```

---

## 🔧 Gerenciamento de Estado

### Estratégia Híbrida

#### 1. **React Query (@tanstack/react-query)**
**Uso:** Estado assíncrono (dados de API)

**Vantagens:**
- Cache automático
- Revalidação em background
- Loading/Error states
- Retry automático
- Deduplicação de requests

**Configuração:**
```typescript
// Provider em layout.tsx
<ReactQueryProvider>
  <AppLayout>{children}</AppLayout>
</ReactQueryProvider>
```

**Hooks personalizados:**
- `useSmartCNPJ()` → Busca de empresas
- `useDados360PF()` → Dados PF
- `useDados360PJ()` → Dados PJ
- `useRadarJuridico()` → Processos jurídicos
- `useDashboard()` → Estatísticas do dashboard
- `useCredits()` → Saldo de créditos
- `useFavorites()` → CRUD de favoritos
- `useSearchHistory()` → Histórico de buscas

**Exemplo de uso:**
```typescript
const { balance, total_added, isLoadingBalance } = useCredits()
```

---

#### 2. **Context API (React)**
**Uso:** Estado global simples (UI state)

**Contextos criados:**

##### `LayoutContext.tsx`
**Estado:**
```typescript
interface LayoutContextType {
  sidebarOpen: boolean          // Sidebar expandida?
  toggleSidebar: () => void      // Toggle sidebar
  mobileMenuOpen: boolean        // Menu mobile aberto?
  toggleMobileMenu: () => void   // Toggle mobile menu
}
```

**Provider:**
```tsx
<LayoutProvider>
  <AppLayoutContent>{children}</AppLayoutContent>
</LayoutProvider>
```

**Uso nos componentes:**
```typescript
const { sidebarOpen, toggleSidebar } = useLayout()
```

---

#### 3. **Local Storage (Persistência)**
**Hook:** `useLocalStorage.ts`

**Uso:**
- Salvar preferências do usuário
- Cache de dados não críticos
- Histórico de buscas (offline)

**Exemplo:**
```typescript
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

---

#### 4. **URL State (Next.js Router)**
**Uso:** Estado de navegação (filtros, paginação)

**Vantagens:**
- Shareable URLs
- Navegação back/forward funciona
- Persistência automática

**Exemplo:**
```typescript
import { useRouter, useSearchParams } from 'next/navigation'

const searchParams = useSearchParams()
const page = searchParams.get('page') || '1'
const filter = searchParams.get('filter') || ''
```

---

### Fluxo de Dados (Data Flow)

```
┌─────────────────┐
│  Componente UI  │
└────────┬────────┘
         │
         │ Chama hook
         ▼
┌─────────────────┐
│  Custom Hook    │ ← useSmartCNPJ, useCredits, etc.
│ (React Query)   │
└────────┬────────┘
         │
         │ Faz request
         ▼
┌─────────────────┐
│  API Service    │ ← lib/api/endpoints/insights.ts
└────────┬────────┘
         │
         │ HTTP request
         ▼
┌─────────────────┐
│  API Client     │ ← lib/api/client.ts (Axios)
└────────┬────────┘
         │
         │ axios.get/post
         ▼
┌─────────────────┐
│  Backend API    │ ← http://localhost:8000/api/v1
└─────────────────┘
```

---

## 🔌 Integração com Backend

### API Client (`lib/api/client.ts`)

#### Configuração
```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
timeout: 30000 (30 segundos)
headers: { 'Content-Type': 'application/json' }
```

#### Features Implementadas

##### 1. **Retry Logic**
```typescript
maxRetries: 3
retryDelay: 1000ms (exponential backoff)
```
**Condições de retry:**
- Network errors
- Status 5xx (server errors)
- Timeout

##### 2. **Interceptors**

**Request Interceptor:**
- TODO: Adicionar token de autenticação (Sprint 11)
- Log de requests (apenas desenvolvimento)

**Response Interceptor:**
- Log de responses (apenas desenvolvimento)
- Tratamento de erros estruturado
- Retry automático em falhas

##### 3. **Error Handling**
```typescript
interface ApiError {
  success: false
  error: string
  message?: string
  details?: unknown
  status_code: number
}
```

**Tipos de erro:**
- Network errors (sem resposta)
- Server errors (5xx)
- Client errors (4xx)
- Timeout errors

---

### Endpoints Implementados

#### Insights (`lib/api/endpoints/insights.ts`)

##### `GET /insights/`
**Função:** `getInsights(categoria?: InsightCategoria)`
**Retorno:** `InsightData[]`
**Filtro:** Opcional por categoria (`setor`, `estado`, `capital`)

##### `GET /insights/grouped`
**Função:** `getGroupedInsights()`
**Retorno:** `InsightsGroupedResponse`
```typescript
{
  setores: InsightData[]   // 6 insights
  estados: InsightData[]   // 6 insights
  capital: InsightData[]   // 3 insights
  total: number           // 15 total
}
```

##### `GET /insights/{insightKey}`
**Função:** `getInsightByKey(insightKey: string)`
**Retorno:** `InsightData`
**Exemplo:** `getInsightByKey('setor_tecnologia')`

---

### Type Definitions (`types/`)

#### `api.ts` - Tipos gerais de API
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface ApiError {
  success: false
  error: string
  message?: string
  details?: unknown
  status_code: number
}
```

#### `insights.ts` - Tipos de Insights
```typescript
type InsightCategoria = 'setor' | 'estado' | 'capital'

interface InsightData {
  insight_key: string
  categoria: InsightCategoria
  titulo: string
  descricao: string
  total_empresas: number
  percentual?: number
  filtros: Record<string, any>
  metadata?: Record<string, any>
}

interface InsightsGroupedResponse {
  setores: InsightData[]
  estados: InsightData[]
  capital: InsightData[]
  total: number
}
```

#### `company.ts` - Tipos de Empresa
(Estrutura completa de empresa, estabelecimento, sócios)

#### `person.ts` - Tipos de Pessoa
(CPF, dados pessoais)

#### `smart-cnpj.ts` - Tipos Smart CNPJ
```typescript
type SearchType = 
  | 'cnpj' 
  | 'razaoSocial' 
  | 'segmento' 
  | 'email' 
  | 'telefone' 
  | 'nomeSocio' 
  | 'cep'
```

---

## 🔗 Pontos de Integração

### Endpoints do Backend (Sprint S02) → Frontend

#### ✅ Integrados

##### 1. **GET /insights/grouped**
**Status:** ✅ Integrado
**Frontend:** `/smart-cnpj` (página de insights)
**Hook:** `getGroupedInsights()`
**Componente:** `InsightCard`
**Performance:** <100ms (cache no backend)

---

#### ⚠️ Parcialmente Integrados

##### 2. **GET /empresas/{cnpj}**
**Status:** ⚠️ Tipo definido, componentes criados, falta hook completo
**Frontend:** `/smart-cnpj/search` (busca por CNPJ)
**Componentes prontos:**
- `CompanyHeader`
- `IdentificationCard`
- `ClassificationCard`
- `LocationCard`
- `ContactCard`
- `StatusCard`

**Ação necessária:**
- Criar hook `useEmpresaByCNPJ(cnpj: string)`
- Conectar ao endpoint do backend
- Implementar loading/error states

---

##### 3. **GET /empresas/search**
**Status:** ⚠️ SearchForm pronto, falta integração com API
**Frontend:** `/smart-cnpj/search` (busca avançada)
**Componentes prontos:**
- `SearchForm` (7 tipos de busca)
- `FilterPanel` (filtros avançados)
- `ResultsList` (lista de resultados)

**Parâmetros esperados:**
- `razao_social?: string`
- `nome_fantasia?: string`
- `uf?: string`
- `municipio?: string`
- `situacao_cadastral?: string`
- `cnae_fiscal?: string`
- Paginação: `skip`, `limit`

**Ação necessária:**
- Conectar `SearchForm` ao endpoint `/empresas/search`
- Implementar paginação
- Adicionar loading/error states

---

#### ❌ Não Integrados (Endpoints disponíveis)

##### 4. **GET /estabelecimentos/{cnpj}**
**Backend:** ✅ Implementado (retorna estabelecimento específico)
**Frontend:** ❌ Não integrado

**Ação necessária:**
- Criar componente `EstabelecimentoDetail`
- Criar hook `useEstabelecimento(cnpj: string)`

---

##### 5. **GET /estabelecimentos/search**
**Backend:** ✅ Implementado (busca estabelecimentos)
**Frontend:** ❌ Não integrado

**Ação necessária:**
- Criar página `/estabelecimentos/search`
- Reutilizar `SearchForm` adaptado

---

##### 6. **GET /socios/{cnpj_cpf_socio}**
**Backend:** ✅ Implementado (busca sócio por CPF/CNPJ)
**Frontend:** ❌ Não integrado

**Ação necessária:**
- Criar componente `SocioDetail`
- Criar hook `useSocio(cnpj_cpf: string)`

---

##### 7. **GET /socios/search**
**Backend:** ✅ Implementado (busca sócios por nome)
**Frontend:** ⚠️ Tipo de busca existe no `SearchForm`, mas não integrado

**Ação necessária:**
- Conectar tipo de busca "Nome do Sócio" ao endpoint
- Criar hook `useSearchSocios(nome: string)`
- Criar componente de resultado `SocioCard`

---

##### 8. **GET /empresas/{cnpj}/estabelecimentos**
**Backend:** ✅ Implementado (lista estabelecimentos de uma empresa)
**Frontend:** ❌ Não integrado

**Ação necessária:**
- Criar componente `EstabelecimentosList`
- Integrar na página de detalhes da empresa
- Criar hook `useEstabelecimentosByEmpresa(cnpj: string)`

---

##### 9. **GET /empresas/{cnpj}/socios**
**Backend:** ✅ Implementado (lista sócios de uma empresa)
**Frontend:** ❌ Não integrado

**Ação necessária:**
- Criar componente `SociosList`
- Integrar na página de detalhes da empresa
- Criar hook `useSociosByEmpresa(cnpj: string)`

---

### Resumo de Integração

| Endpoint | Status | Frontend | Hook | Prioridade |
|----------|--------|----------|------|------------|
| `GET /health` | ✅ | - | - | Baixa |
| `GET /insights/grouped` | ✅ | `/smart-cnpj` | `getGroupedInsights()` | ✅ Completo |
| `GET /empresas/{cnpj}` | ⚠️ | `/smart-cnpj/search` | `useEmpresaByCNPJ()` | 🔴 Alta |
| `GET /empresas/search` | ⚠️ | `/smart-cnpj/search` | `useSearchEmpresas()` | 🔴 Alta |
| `GET /estabelecimentos/{cnpj}` | ❌ | - | `useEstabelecimento()` | 🟡 Média |
| `GET /estabelecimentos/search` | ❌ | - | `useSearchEstabelecimentos()` | 🟢 Baixa |
| `GET /socios/{cnpj_cpf}` | ❌ | - | `useSocio()` | 🟡 Média |
| `GET /socios/search` | ⚠️ | `/smart-cnpj/search` | `useSearchSocios()` | 🔴 Alta |
| `GET /empresas/{cnpj}/estabelecimentos` | ❌ | - | `useEstabelecimentosByEmpresa()` | 🟡 Média |
| `GET /empresas/{cnpj}/socios` | ❌ | - | `useSociosByEmpresa()` | 🟡 Média |

---

## 📌 Recomendações

### Sprint S03 - Integração Frontend ↔ Backend

#### Prioridade ALTA (Críticas)

##### 1. **Integrar Busca de Empresas (GET /empresas/search)**
**Arquivos a modificar:**
- Criar: `src/hooks/useSearchEmpresas.ts`
- Criar: `src/lib/api/endpoints/empresas.ts`
- Modificar: `src/app/smart-cnpj/search/page.tsx`

**Tarefas:**
- [ ] Implementar `searchEmpresas(params)` em `lib/api/endpoints/empresas.ts`
- [ ] Criar hook `useSearchEmpresas()` com React Query
- [ ] Conectar `SearchForm` ao hook
- [ ] Implementar paginação (`skip`, `limit`)
- [ ] Adicionar estados de loading/error/empty
- [ ] Validar filtros com Zod

**Estimativa:** 8 pontos

---

##### 2. **Integrar Detalhes de Empresa (GET /empresas/{cnpj})**
**Arquivos a modificar:**
- Criar: `src/hooks/useEmpresaByCNPJ.ts`
- Criar: `src/app/smart-cnpj/[cnpj]/page.tsx` (página de detalhes)
- Modificar: `src/components/smart-cnpj/CompanyCard.tsx` (adicionar link)

**Tarefas:**
- [ ] Implementar `getEmpresaByCNPJ(cnpj)` em `lib/api/endpoints/empresas.ts`
- [ ] Criar hook `useEmpresaByCNPJ(cnpj)` com React Query
- [ ] Criar página de detalhes com todos os componentes:
  - `CompanyHeader`
  - `IdentificationCard`
  - `ClassificationCard`
  - `LocationCard`
  - `ContactCard`
  - `StatusCard`
- [ ] Adicionar breadcrumbs (Dashboard > Smart CNPJ > {Razão Social})
- [ ] Implementar botão "Adicionar aos Favoritos"

**Estimativa:** 13 pontos

---

##### 3. **Integrar Busca de Sócios (GET /socios/search)**
**Arquivos a modificar:**
- Criar: `src/hooks/useSearchSocios.ts`
- Criar: `src/components/smart-cnpj/SocioCard.tsx`
- Modificar: `src/app/smart-cnpj/search/page.tsx`

**Tarefas:**
- [ ] Implementar `searchSocios(nome)` em `lib/api/endpoints/socios.ts`
- [ ] Criar hook `useSearchSocios()` com React Query
- [ ] Criar componente `SocioCard` para exibir resultados
- [ ] Conectar tipo de busca "Nome do Sócio" ao endpoint
- [ ] Implementar paginação
- [ ] Adicionar loading skeleton

**Estimativa:** 5 pontos

---

#### Prioridade MÉDIA (Importantes)

##### 4. **Listar Estabelecimentos de uma Empresa (GET /empresas/{cnpj}/estabelecimentos)**
**Arquivos a modificar:**
- Criar: `src/hooks/useEstabelecimentosByEmpresa.ts`
- Criar: `src/components/smart-cnpj/EstabelecimentosList.tsx`
- Modificar: `src/app/smart-cnpj/[cnpj]/page.tsx` (adicionar aba "Estabelecimentos")

**Tarefas:**
- [ ] Implementar `getEstabelecimentosByEmpresa(cnpj)` 
- [ ] Criar hook `useEstabelecimentosByEmpresa(cnpj)`
- [ ] Criar componente `EstabelecimentosList` com Tanstack Table
- [ ] Adicionar aba "Estabelecimentos" na página de detalhes
- [ ] Implementar filtros (matriz/filial, UF, situação)

**Estimativa:** 5 pontos

---

##### 5. **Listar Sócios de uma Empresa (GET /empresas/{cnpj}/socios)**
**Arquivos a modificar:**
- Criar: `src/hooks/useSociosByEmpresa.ts`
- Criar: `src/components/smart-cnpj/SociosList.tsx`
- Modificar: `src/app/smart-cnpj/[cnpj]/page.tsx` (adicionar aba "Sócios")

**Tarefas:**
- [ ] Implementar `getSociosByEmpresa(cnpj)`
- [ ] Criar hook `useSociosByEmpresa(cnpj)`
- [ ] Criar componente `SociosList` com Tanstack Table
- [ ] Adicionar aba "Sócios" na página de detalhes
- [ ] Exibir qualificação, CPF/CNPJ, faixa etária

**Estimativa:** 5 pontos

---

##### 6. **Detalhes de Estabelecimento (GET /estabelecimentos/{cnpj})**
**Arquivos a modificar:**
- Criar: `src/hooks/useEstabelecimento.ts`
- Criar: `src/app/estabelecimentos/[cnpj]/page.tsx`
- Criar: `src/components/smart-cnpj/EstabelecimentoDetail.tsx`

**Tarefas:**
- [ ] Implementar `getEstabelecimento(cnpj)`
- [ ] Criar hook `useEstabelecimento(cnpj)`
- [ ] Criar página de detalhes do estabelecimento
- [ ] Exibir endereço completo, contatos, CNAEs secundários

**Estimativa:** 5 pontos

---

##### 7. **Detalhes de Sócio (GET /socios/{cnpj_cpf})**
**Arquivos a modificar:**
- Criar: `src/hooks/useSocio.ts`
- Criar: `src/app/socios/[cnpj_cpf]/page.tsx`
- Criar: `src/components/smart-cnpj/SocioDetail.tsx`

**Tarefas:**
- [ ] Implementar `getSocio(cnpj_cpf)`
- [ ] Criar hook `useSocio(cnpj_cpf)`
- [ ] Criar página de detalhes do sócio
- [ ] Listar empresas onde é sócio (relacionamento inverso)

**Estimativa:** 5 pontos

---

#### Prioridade BAIXA (Opcional)

##### 8. **Busca de Estabelecimentos (GET /estabelecimentos/search)**
**Tarefas:**
- [ ] Implementar `searchEstabelecimentos(params)`
- [ ] Criar hook `useSearchEstabelecimentos()`
- [ ] Criar página `/estabelecimentos/search`

**Estimativa:** 8 pontos

---

### Melhorias de UX/Performance

#### 1. **Auditoria de Componentes Duplicados**
**Arquivos suspeitos:**
- `ExportButton.tsx` vs `ExportButton 2.tsx`
- `ExportDialog.tsx` vs `ExportDialog 2.tsx`
- `InsightCard.tsx` vs `InsightCard 2.tsx`

**Ação:**
- [ ] Verificar diferenças entre versões
- [ ] Consolidar em versão única
- [ ] Remover arquivos duplicados

**Estimativa:** 2 pontos

---

#### 2. **Implementar Sistema de Favoritos**
**Arquivos:**
- `src/hooks/useFavorites.ts` (já existe)
- `src/app/favoritos/page.tsx`

**Tarefas:**
- [ ] Conectar hook `useFavorites()` ao backend
- [ ] Criar endpoint no backend: `POST /favoritos`, `GET /favoritos`, `DELETE /favoritos/{id}`
- [ ] Implementar botão "Adicionar aos Favoritos" nas páginas de detalhes
- [ ] Criar página de listagem de favoritos com filtros

**Estimativa:** 8 pontos

---

#### 3. **Implementar Histórico de Consultas**
**Arquivos:**
- `src/hooks/useSearchHistory.ts` (já existe)
- `src/app/historico/page.tsx`

**Tarefas:**
- [ ] Conectar hook `useSearchHistory()` ao backend
- [ ] Criar endpoint no backend: `POST /historico`, `GET /historico`
- [ ] Salvar automaticamente cada consulta realizada
- [ ] Criar página de histórico com filtros (data, tipo, termo)
- [ ] Permitir refazer consulta a partir do histórico

**Estimativa:** 8 pontos

---

#### 4. **Lazy Loading de Componentes Pesados**
**Status:** Parcialmente implementado no Dashboard

**Ação:**
- [ ] Aplicar lazy loading em outras páginas pesadas
- [ ] Usar `React.lazy()` + `Suspense` para:
  - Gráficos de `Recharts`
  - Tabelas grandes (`data-table.tsx`)
  - Componentes de exportação
- [ ] Adicionar skeletons apropriados

**Estimativa:** 3 pontos

---

#### 5. **Implementar Dark Mode**
**Status:** Variáveis CSS já definidas em `globals.css`

**Tarefas:**
- [ ] Criar contexto `ThemeContext`
- [ ] Implementar toggle dark/light mode no Header
- [ ] Salvar preferência no localStorage
- [ ] Aplicar classe `dark` no `<html>` conforme estado
- [ ] Testar todos os componentes em modo escuro

**Estimativa:** 5 pontos

---

#### 6. **Otimização de Performance**
**Tarefas:**
- [ ] Implementar `React.memo()` em componentes puros
- [ ] Usar `useMemo()` para cálculos pesados
- [ ] Usar `useCallback()` para funções passadas como props
- [ ] Implementar virtualização em listas grandes (react-window)
- [ ] Otimizar imagens com Next.js Image
- [ ] Implementar Code Splitting por rota

**Estimativa:** 8 pontos

---

### Total de Story Points (Sprint S03)

| Prioridade | Features | Story Points |
|-----------|----------|--------------|
| **Alta** | 3 features | 26 pontos |
| **Média** | 4 features | 20 pontos |
| **Baixa** | 1 feature | 8 pontos |
| **Melhorias UX** | 6 itens | 34 pontos |
| **TOTAL** | 14 itens | **88 pontos** |

**Recomendação:** Dividir em 2 sprints:
- **Sprint S03:** Prioridades ALTA (26 pontos) + 2 features MÉDIA (10 pontos) = **36 pontos**
- **Sprint S04:** Prioridades MÉDIA restantes (10 pontos) + Melhorias UX (34 pontos) = **44 pontos**

---

## 📝 Notas Finais

### Pontos Fortes do Frontend

✅ **Arquitetura moderna e escalável**
- Next.js 16 (App Router) com React 19
- TypeScript para type safety
- Estrutura bem organizada (separação de concerns)

✅ **UI/UX profissional**
- Biblioteca Radix UI (acessibilidade)
- TailwindCSS (produtividade)
- Design system consistente (cores, tipografia, espaçamento)
- Animações suaves e polish

✅ **Performance**
- Lazy loading implementado no dashboard
- React Query com cache inteligente
- Insights em cache no backend (<100ms)

✅ **Developer Experience**
- TypeScript types bem definidos
- Hooks customizados reutilizáveis
- Componentes atômicos e compostos
- ESLint + Prettier configurados

---

### Áreas de Atenção

⚠️ **Integração Backend Incompleta**
- 7 de 10 endpoints não integrados
- Componentes criados mas sem dados reais
- Necessário completar Sprint S03

⚠️ **Arquivos Duplicados**
- `ExportButton.tsx` / `ExportButton 2.tsx`
- `InsightCard.tsx` / `InsightCard 2.tsx`
- Requer auditoria e consolidação

⚠️ **Testes**
- Jest configurado mas sem testes implementados
- Recomendado: adicionar testes unitários e E2E

⚠️ **Autenticação**
- TODO em `lib/api/client.ts` (Sprint 11 planejado)
- Páginas públicas definidas mas sem implementação

---

### Próximos Passos Recomendados

1. **Sprint S03 - Integração Backend (Prioridade ALTA)**
   - Busca de empresas
   - Detalhes de empresa
   - Busca de sócios

2. **Sprint S04 - Integração Backend (Prioridade MÉDIA) + UX**
   - Listas de estabelecimentos/sócios
   - Detalhes de estabelecimento/sócio
   - Sistema de favoritos
   - Histórico de consultas

3. **Sprint S05 - Performance e Qualidade**
   - Lazy loading em todas as páginas
   - Dark mode
   - Otimizações de performance
   - Testes unitários e E2E

4. **Sprint S06+**
   - Demais produtos (Dados 360°, Radar Financeiro, Radar Jurídico)
   - Sistema de alertas
   - Geração de relatórios
   - Autenticação e autorização

---

**Documento gerado em:** 2024  
**Autor:** Análise Automatizada  
**Versão:** 1.0  
**Última atualização:** Sprint S02 concluído
