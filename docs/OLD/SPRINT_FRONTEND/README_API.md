# 📡 API Client - BaseCerta Frontend

Documentação completa do cliente HTTP para comunicação com o backend.

---

## 📁 Estrutura de Arquivos

```
frontend/src/
├── types/                    # Tipos TypeScript
│   ├── enums.ts             # 14 enums (PlanType, TransactionType, etc.)
│   ├── entities.ts          # 14 interfaces (User, Plan, Credits, etc.)
│   ├── api.ts               # Request/Response types
│   └── index.ts             # Exports centralizados
│
└── lib/api/                 # API Client
    ├── client.ts            # ApiClient base com Axios
    ├── endpoints/           # Endpoints organizados por recurso
    │   ├── users.ts        # Usuários e perfil
    │   ├── credits.ts      # Créditos e transações
    │   ├── plans.ts        # Planos e pacotes
    │   ├── products.ts     # Pesquisas e consultas
    │   ├── stats.ts        # Estatísticas e analytics
    │   └── general.ts      # Health check
    └── index.ts             # Exports consolidados
```

---

## 🚀 Como Usar

### Importação Recomendada

```typescript
import { api } from '@/lib/api'
import type { User, Plan, CreditsBalanceResponse } from '@/types'

// Exemplo de uso
const balance = await api.credits.getBalance(1)
const plans = await api.plans.getPlans()
const companies = await api.products.searchCompanies({ query: 'Empresa ABC' })
```

### Importação Individual

```typescript
import { creditsApi } from '@/lib/api/endpoints/credits'
import { plansApi } from '@/lib/api/endpoints/plans'

const balance = await creditsApi.getBalance(1)
const plans = await plansApi.getPlans()
```

---

## 📚 Tipos TypeScript

### Enums (14 tipos)

```typescript
// frontend/src/types/enums.ts
export enum PlanType {
  BASIC = 'basic',
  SMART = 'smart',
  PRO = 'pro',
  EMPRESARIAL = 'empresarial',
}

export enum TransactionType {
  PURCHASE = 'purchase',
  DEDUCTION = 'deduction',
  REFUND = 'refund',
  BONUS = 'bonus',
  SUBSCRIPTION = 'subscription',
}

// ... 12 outros enums
```

### Entidades (14 interfaces)

```typescript
// frontend/src/types/entities.ts
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserCredits {
  id: number
  user_id: number
  balance: number
  total_purchased: number
  total_spent: number
  last_updated: string
}

// ... 12 outras interfaces
```

### API Types

```typescript
// frontend/src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}
```

---

## 🔌 Endpoints Disponíveis

### 1. Users API (`api.users`)

```typescript
// Buscar perfil do usuário (mock: user_id=1)
const profile = await api.users.getProfile(1)
// Response: { user: User, credits: UserCredits, subscription?: Subscription }

// Atualizar perfil
await api.users.updateProfile(1, { name: 'João Silva', phone: '11999999999' })

// Alterar senha (TODO Sprint 11)
await api.users.changePassword(1, {
  current_password: 'senha123',
  new_password: 'novaSenha456',
  confirm_password: 'novaSenha456',
})

// Upload de avatar
const file = document.querySelector('input[type=file]').files[0]
await api.users.uploadAvatar(1, file)
```

### 2. Credits API (`api.credits`)

```typescript
// Buscar saldo de créditos
const balance = await api.credits.getBalance(1)
// Response: { balance: 150, total_purchased: 500, total_spent: 350 }

// Histórico de transações (paginado)
const history = await api.credits.getHistory(1, { page: 1, per_page: 10 })

// Adicionar créditos (mock - aberto)
await api.credits.addCredits({
  user_id: 1,
  amount: 100,
  description: 'Compra de pacote',
  package_id: 1,
})

// Deduzir créditos (usado nas pesquisas)
await api.credits.deductCredits({
  user_id: 1,
  amount: 5,
  product_type: 'dados_empresas',
  description: 'Consulta empresa XPTO',
})
```

### 3. Plans API (`api.plans`)

```typescript
// Listar todos os planos
const plans = await api.plans.getPlans()
// Response: { plans: Plan[] }

// Buscar plano específico
const plan = await api.plans.getPlan(1)

// Listar pacotes de créditos
const packages = await api.plans.getPackages()

// Buscar pacote específico
const package = await api.plans.getPackage(1)

// ADMIN: Criar/Atualizar (TODO Sprint 11: proteger)
await api.plans.createPlan({ name: 'Premium', price: 99.90, credits_included: 200 })
await api.plans.updatePlan(1, { price: 89.90 })
```

### 4. Products API (`api.products`)

```typescript
// Buscar empresas (Categoria 1)
const companies = await api.products.searchCompanies({
  query: 'ACME Tecnologia',
  search_type: 'razao_social',
  filters: {
    situacao_cadastral: ['ATIVA'],
    uf: 'SP',
  },
  page: 1,
  per_page: 20,
})

// Buscar empresa por CNPJ
const company = await api.products.getCompany('12.345.678/0001-90')

// Histórico de pesquisas
const history = await api.products.getSearchHistory(1)

// Pesquisas específicas (TODO: Implementar nas sprints 4-8)
await api.products.searchPessoaFisica('123.456.789-00')
await api.products.searchPessoaJuridica('12.345.678/0001-90')
await api.products.searchJudicial('123.456.789-00')
await api.products.searchCreditScore('123.456.789-00')
await api.products.searchProtestos('123.456.789-00', true) // nacional
await api.products.searchCADIN('123.456.789-00')
await api.products.searchAntifraundePix('exemplo@email.com')
```

### 5. Stats API (`api.stats`)

```typescript
// Estatísticas do dashboard
const stats = await api.stats.getDashboardStats(1)
// Response: {
//   credits: { balance, total_spent_today, total_spent_week, ... },
//   searches: { total_today, total_week, total_month, ... },
//   recent_activity: SearchQuery[],
//   popular_products: [...]
// }

// Estatísticas de uso de créditos
const creditStats = await api.stats.getCreditUsageStats(1, '2024-01-01', '2024-12-31')

// Estatísticas de pesquisas por tipo
const researchStats = await api.stats.getResearchTypeStats(1, '2024-01-01', '2024-12-31')

// ADMIN: Estatísticas gerais (TODO Sprint 11)
const adminStats = await api.stats.getAdminStats()
```

### 6. General API (`api.general`)

```typescript
// Health check
const health = await api.general.healthCheck()
// Response: {
//   status: 'ok',
//   timestamp: '2024-10-20T18:00:00Z',
//   services: { database: 'ok', redis: 'ok', celery: 'ok' }
// }
```

---

## 🔧 API Client Base

### Configuração

```typescript
// frontend/src/lib/api/client.ts
const client = new ApiClient()

// Configurações
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
timeout: 30000ms (30 segundos)
headers: { 'Content-Type': 'application/json' }
```

### Interceptors

#### Request Interceptor
- **Log de requests** (apenas em desenvolvimento)
- **TODO Sprint 11:** Adicionar token de autenticação
  ```typescript
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  ```

#### Response Interceptor
- **Log de responses** (apenas em desenvolvimento)
- **Tratamento de erros:**
  - `401`: Não autenticado (TODO Sprint 11: redirecionar para login)
  - `Network Error`: Erro de conexão
  - `Timeout`: Servidor não respondeu
- **Formato de erro padronizado:**
  ```typescript
  interface ApiError {
    success: false
    error: string
    message?: string
    details?: any
    status_code?: number
  }
  ```

### Métodos HTTP

```typescript
// GET
await apiClient.get<T>(url, params)

// POST
await apiClient.post<T>(url, data)

// PUT
await apiClient.put<T>(url, data)

// PATCH
await apiClient.patch<T>(url, data)

// DELETE
await apiClient.delete<T>(url)
```

---

## 🎯 Padrão de Response

### Sucesso

```typescript
{
  success: true,
  data: { ... },
  message?: "Operação realizada com sucesso"
}
```

### Erro

```typescript
{
  success: false,
  error: "Tipo de erro",
  message: "Mensagem descritiva",
  details?: { ... },
  status_code: 400
}
```

### Paginado

```typescript
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    per_page: 20,
    total: 156,
    total_pages: 8,
    has_next: true,
    has_prev: false
  }
}
```

---

## ⚠️ Observações Importantes

### 1. Sem Autenticação (Sprints 1-10)
- Todos os endpoints estão **abertos** (sem token)
- Usar mock `user_id=1` para desenvolvimento
- **Sprint 11:** Implementar autenticação e proteger rotas

### 2. Variáveis de Ambiente

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. TypeScript Strict Mode
- Todos os tipos são **obrigatórios**
- Usar `?` para campos opcionais
- Nunca usar `any` (exceto `Record<string, any>` para metadata)

### 4. Logs de Desenvolvimento
- Apenas em `NODE_ENV=development`
- Console logs de requests e responses
- Desabilitado em produção

---

## 🚀 Próximos Passos

### Sprint 4-8: Implementar Integrações
- [ ] Predictus API (Dossiês PF/PJ)
- [ ] DirectData API (Score, Protestos, CADIN)
- [ ] Parsers de resposta
- [ ] Cache Redis

### Sprint 11: Autenticação
- [ ] Adicionar interceptor de auth
- [ ] Implementar refresh token automático
- [ ] Proteger todas as rotas
- [ ] Logout automático (401)

### Sprint 12: Segurança
- [ ] Rate limiting client-side
- [ ] Retry logic (falhas temporárias)
- [ ] Timeout configurável por endpoint
- [ ] Logs de segurança

---

## 📝 Exemplos Completos

### Exemplo 1: Buscar Saldo e Histórico

```typescript
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'

export function CreditBalance() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBalance() {
      try {
        const response = await api.credits.getBalance(1)
        if (response.success && response.data) {
          setBalance(response.data.balance)
        }
      } catch (error) {
        console.error('Erro ao buscar saldo:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBalance()
  }, [])

  if (loading) return <div>Carregando...</div>

  return <div>Saldo: {balance} créditos</div>
}
```

### Exemplo 2: Buscar Empresas com Filtros

```typescript
import { api } from '@/lib/api'

async function searchCompanies() {
  try {
    const response = await api.products.searchCompanies({
      query: 'Tecnologia',
      search_type: 'razao_social',
      filters: {
        situacao_cadastral: ['ATIVA'],
        uf: 'SP',
        porte: ['ME', 'EPP'],
      },
      page: 1,
      per_page: 20,
      sort_by: 'razao_social',
      sort_order: 'asc',
    })

    if (response.success && response.data) {
      console.log('Empresas encontradas:', response.data.data)
      console.log('Total:', response.data.pagination.total)
    }
  } catch (error) {
    console.error('Erro na busca:', error)
  }
}
```

### Exemplo 3: Tratamento de Erro

```typescript
import { api } from '@/lib/api'
import type { ApiError } from '@/types'

async function loadData() {
  try {
    const response = await api.users.getProfile(1)
    return response.data
  } catch (error) {
    const apiError = error as ApiError
    
    if (apiError.status_code === 404) {
      console.error('Usuário não encontrado')
    } else if (apiError.status_code === 500) {
      console.error('Erro no servidor')
    } else {
      console.error('Erro:', apiError.message)
    }
    
    return null
  }
}
```

---

**Criado em:** 20/10/2025  
**Status:** ✅ Completo e funcional  
**Próxima tarefa:** Criar hook `useCredits` para gerenciamento de estado

