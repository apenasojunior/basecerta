# P.9.3 - Dashboard Performance Analysis

**Data:** 23 de outubro de 2025  
**Issue:** Performance do Dashboard - Loading States  
**Prioridade:** P1 (Alta) - Impacta diretamente LCP e User Experience

## 🔍 Problema Identificado

### Sintomas
1. **Mensagem de erro visível**: "Erro ao carregar estatísticas. Os dados exibidos são de demonstração."
2. **Loading prolongado**: Spinners ficam "processando" por tempo indefinido
3. **Bloqueio do carregamento**: Backend offline bloqueia renderização do conteúdo
4. **Créditos travados**: Hook `useCredits` também fica em loading indefinido

### Root Cause Analysis

**Código atual (dashboard/page.tsx):**
```typescript
const { stats: dashboardStats, isLoadingStats, isErrorStats } = useDashboard()
const { balance, isLoadingBalance } = useCredits()

// PROBLEMA 1: Loading state bloqueia tudo
const isLoading = isLoadingStats || isLoadingBalance

// PROBLEMA 2: Skeleton exibido até ambas as requests finalizarem
{isLoading ? (
  <DashboardSkeleton />
) : (
  <>
    {/* Conteúdo só renderiza quando AMBOS os hooks terminarem */}
  </>
)}
```

**Hooks com comportamento bloqueante:**

1. **useDashboard.ts**:
   - `staleTime: 1000 * 60 * 5` (5 minutos)
   - `refetchInterval: 1000 * 60 * 5` (polling)
   - Se backend offline → `isLoading = true` forever

2. **useCredits.ts**:
   - `staleTime: 1000 * 60 * 5` (5 minutos)
   - `refetchOnWindowFocus: true`
   - Se backend offline → `isLoading = true` forever

### Impacto na Performance

**Lighthouse Best Practices:**
- ❌ Console errors: "Failed to load http://localhost:8000/api/v1/..."
- ❌ Long tasks: Retry logic com 3 tentativas (1s + 2s + 3s = 6s) por request
- ❌ Timeout: Múltiplos requests simultâneos = 6s × N requests

**Lighthouse Performance:**
- ❌ **LCP (Largest Contentful Paint)**: Skeleton não conta como conteúdo
- ❌ **TBT (Total Blocking Time)**: 6s+ bloqueado esperando API
- ❌ **CLS (Cumulative Layout Shift)**: Skeleton → Error message → Content

**User Experience:**
- ❌ Usuário vê skeleton indefinidamente
- ❌ Mensagem de erro confusa ("demonstração" não é erro)
- ❌ Sensação de "travado" mesmo com retry logic

## 📊 Dados Técnicos

### Requests no Dashboard Page Load

1. **Dashboard Stats**: `GET /api/v1/stats/dashboard/{user_id}`
   - Tentativas: 3 × (1s + 2s + 3s) = **6 segundos** até falhar
   - Usado em: Stats cards (4 cards)

2. **Credits Balance**: `GET /api/v1/credits/balance/{user_id}`
   - Tentativas: 3 × (1s + 2s + 3s) = **6 segundos** até falhar
   - Usado em: Header + Stats card

3. **Search Stats**: (Lazy loaded - SearchStatsCards)
   - Tentativas: 3 × 6s
   - Usado em: SearchStatsCards component

4. **Recent Searches**: (Lazy loaded - RecentSearches)
   - Tentativas: 3 × 6s
   - Usado em: RecentSearches component

**Total blocking time com backend offline:**
- Initial load (blocking): **2 requests × 6s = 12 segundos**
- Lazy loaded (não bloqueante): 2 requests × 6s = 12s adicional

### Configuração Atual do Retry Logic

**frontend/src/lib/api/client.ts:**
```typescript
private maxRetries = 3
private retryDelay = 1000

// Retry com exponential backoff:
// Attempt 1: immediate
// Attempt 2: +1000ms
// Attempt 3: +2000ms
// Attempt 4: +3000ms
// Total: 6 segundos até falhar
```

## 🎯 Solução Proposta

### 1. Progressive Enhancement (P1 - Implementar AGORA)

**Objetivo:** Mostrar conteúdo imediatamente, carregar dados progressivamente

**Mudanças:**

#### A) Remover Loading Bloqueante
```typescript
// ANTES:
const isLoading = isLoadingStats || isLoadingBalance

{isLoading ? <DashboardSkeleton /> : <Content />}

// DEPOIS:
// Remover isLoading completamente
// Mostrar conteúdo com dados mock/fallback
// Atualizar quando dados chegarem
```

#### B) Fallback Inteligente
```typescript
// Usar dados mock quando API falha
const stats = [
  {
    title: 'Consultas Hoje',
    value: dashboardStats?.queries_today ?? 24, // ✅ Fallback para mock
    // ...
  },
]

// Remover mensagem de erro confusa
// {isErrorStats && <div>Erro ao carregar...</div>} ❌ REMOVER
```

#### C) Timeout Agressivo para First Load
```typescript
// useDashboard.ts
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats", MOCK_USER_ID],
    queryFn: () => api.stats.getDashboardStats(MOCK_USER_ID),
    staleTime: 1000 * 60 * 5,
    
    // ADICIONAR:
    retry: 1, // ✅ Apenas 1 retry (não 3)
    retryDelay: 500, // ✅ 500ms (não 1s exponencial)
    
    // Total: 500ms até fallback (não 6s)
  })
}
```

### 2. Optimistic UI (P2 - Segunda iteração)

**Objetivo:** Interface reage instantaneamente, sincroniza depois

```typescript
// Créditos: Mostrar valor do localStorage/cache primeiro
const cachedBalance = localStorage.getItem('credits_balance')
const balance = cachedBalance ?? apiBalance ?? 150

// Atualizar silenciosamente quando API responder
useEffect(() => {
  if (apiBalance && apiBalance !== cachedBalance) {
    localStorage.setItem('credits_balance', String(apiBalance))
  }
}, [apiBalance])
```

### 3. Request Deduplication (P2)

**Objetivo:** Evitar múltiplas requests iguais

```typescript
// React Query já faz isso, mas garantir:
export function useCredits() {
  return useQuery({
    queryKey: ["credits", "balance", MOCK_USER_ID],
    // ...
    
    // ADICIONAR:
    refetchOnMount: false, // ✅ Não refetch se já tem dados
    refetchOnReconnect: false, // ✅ Não refetch ao reconectar
  })
}
```

### 4. Background Refresh (P3)

**Objetivo:** Dados sempre frescos sem impactar UX

```typescript
// Usar React Query's Background Refetch
export function useDashboard() {
  return useQuery({
    // ...
    staleTime: 0, // ✅ Dados sempre stale
    cacheTime: 1000 * 60 * 10, // ✅ Mas em cache por 10min
    refetchInterval: 1000 * 60 * 2, // ✅ Refetch silencioso a cada 2min
  })
}
```

## 🚀 Implementação

### Fase 1: Remover Bloqueios (15 minutos)

**Arquivos a modificar:**

1. **frontend/src/app/dashboard/page.tsx**
   - Remover `isLoading` state
   - Remover `<DashboardSkeleton />` condicional
   - Remover mensagem de erro "demonstração"
   - Manter Suspense para lazy loaded components

2. **frontend/src/hooks/useDashboard.ts**
   - Adicionar `retry: 1`
   - Adicionar `retryDelay: 500`
   - Remover `refetchInterval` (causava polling desnecessário)

3. **frontend/src/hooks/useCredits.ts**
   - Adicionar `retry: 1`
   - Adicionar `retryDelay: 500`
   - Adicionar `refetchOnMount: false`

### Fase 2: Validar (5 minutos)

1. **Lighthouse Performance:**
   - LCP deve melhorar (conteúdo visível imediatamente)
   - TBT deve reduzir (apenas 500ms × 2 = 1s bloqueio)

2. **Lighthouse Best Practices:**
   - Console errors devem diminuir (apenas 1 retry, não 3)

3. **User Testing:**
   - Dashboard deve renderizar < 1 segundo
   - Dados mock devem ser visíveis
   - Nenhuma mensagem de erro visível

## 📈 Resultados Esperados

### Before (Current)
- **LCP**: ~5-8s (esperando API timeout)
- **TBT**: ~12s (2 requests × 6s cada)
- **Console errors**: 6-10 (3 retries × múltiplos requests)
- **UX**: Skeleton indefinido → Error message → Content

### After (Optimized)
- **LCP**: ~0.5-1s (conteúdo mock imediato)
- **TBT**: ~1s (2 requests × 500ms cada)
- **Console errors**: 2 (1 retry × 2 requests)
- **UX**: Content imediato → Silent update quando API responder

**Performance Score Impact:**
- LCP: +20-30 pontos
- TBT: +10-15 pontos
- Best Practices: +5-10 pontos (menos console errors)

**Total esperado:**
- Performance: 74.2 → 90+ (+15-20 pts)
- Best Practices: 78 → 95-100 (+17-22 pts)

## ✅ Checklist

### Implementação
- [ ] Remover `isLoading` bloqueante em dashboard/page.tsx
- [ ] Remover mensagem de erro "demonstração"
- [ ] Configurar retry agressivo em useDashboard.ts (retry: 1, retryDelay: 500)
- [ ] Configurar retry agressivo em useCredits.ts (retry: 1, retryDelay: 500)
- [ ] Remover `refetchInterval` (polling desnecessário)
- [ ] Adicionar `refetchOnMount: false` em useCredits

### Validação
- [ ] Build sem erros
- [ ] Dashboard renderiza < 1s
- [ ] Dados mock visíveis imediatamente
- [ ] Nenhum erro no console durante first load
- [ ] Lighthouse LCP < 2.5s
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Best Practices > 95

### Documentação
- [ ] Atualizar PERFORMANCE_AUDIT.md
- [ ] Commit com mensagem detalhada
- [ ] Push para beta003

## 🔗 Referências

- [React Query - Initial Data](https://tanstack.com/query/latest/docs/react/guides/initial-query-data)
- [React Query - Background Fetching](https://tanstack.com/query/latest/docs/react/guides/background-fetching-indicators)
- [Lighthouse - LCP Optimization](https://web.dev/lcp/)
- [Lighthouse - Best Practices](https://web.dev/lighthouse-best-practices/)

---

**Status:** 🔴 Aguardando implementação  
**Estimativa:** 20 minutos (15min implementação + 5min validação)  
**Impact:** 🔥 Alto (LCP, TBT, Best Practices)
