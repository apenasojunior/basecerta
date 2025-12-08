# Issue 2.2.5 - Atualizar Páginas para API Real ✅

**Status**: COMPLETA  
**Prioridade**: Alta  
**Tempo Estimado**: 4 horas  
**Tempo Real**: 4 horas  
**Data**: 24 de outubro de 2025

---

## 📋 Objetivo

Integrar as páginas do Smart CNPJ 360° com a API real, removendo todas as dependências de dados mock e implementando states de loading/error com React Query.

---

## 🎯 Tarefas Realizadas

### ✅ 1. Página de Detalhes `[cnpj]/page.tsx`

**Antes**:
```typescript
import { getCompanyByCNPJ } from '@/mocks/smart-cnpj'

const company = getCompanyByCNPJ(cnpj)

if (!company) {
  // Redirect ou erro simples
}
```

**Depois**:
```typescript
import { useSmartCNPJByCNPJ } from '@/hooks/useSmartCNPJ'
import { adaptAPICompanyToMock } from '@/lib/adapters/smart-cnpj'
import { smartCNPJService } from '@/lib/api'

// Limpar CNPJ da URL
const rawCNPJ = decodeURIComponent(resolvedParams.cnpj)
const cnpj = smartCNPJService.cleanCNPJ(rawCNPJ)

// Buscar com React Query
const { data: apiCompany, isLoading, isError, error, refetch } = useSmartCNPJByCNPJ(cnpj, true)

// Adaptar para formato dos componentes
const company = apiCompany ? adaptAPICompanyToMock(apiCompany) : null

// Loading state
if (isLoading) return <LoadingCard />

// Error state com retry
if (isError || !company) return <ErrorCard onRetry={refetch} />
```

**Mudanças**:
- ❌ Removido: `getCompanyByCNPJ` de mocks
- ✅ Adicionado: `useSmartCNPJByCNPJ()` hook com React Query
- ✅ Adicionado: Loading spinner com mensagem
- ✅ Adicionado: Error card com botão retry
- ✅ Adicionado: CNPJ cleaning e formatação
- ✅ Adicionado: Cache automático (5 minutos)
- ✅ Adicionado: Adapter para compatibilidade

---

### ✅ 2. Página de Busca `search/page.tsx`

**Antes**:
```typescript
// Stats hardcoded
<p className="text-2xl font-bold">100</p>
<p className="text-xs">Empresas Disponíveis</p>

<p className="text-2xl font-bold">78%</p>
<p className="text-xs">Empresas Ativas</p>

<p className="text-2xl font-bold">250+</p>
<p className="text-xs">Sócios Cadastrados</p>

<p className="text-2xl font-bold">20</p>
<p className="text-xs">Estados Cobertos</p>
```

**Depois**:
```typescript
import { useSmartCNPJEstatisticas } from '@/hooks/useSmartCNPJ'

const { data: stats, isLoading: statsLoading } = useSmartCNPJEstatisticas()

// Com loading skeleton
{statsLoading ? (
  <>
    <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-16" />
    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
  </>
) : (
  <>
    <p className="text-2xl font-bold">{stats?.total_buscas || 0}</p>
    <p className="text-xs">Buscas Realizadas</p>
  </>
)}
```

**Stats Exibidos**:
| Card | Antes | Depois |
|------|-------|--------|
| 1 | `100` - Empresas Disponíveis | `stats.total_buscas` - Buscas Realizadas |
| 2 | `78%` - Empresas Ativas | `stats.empresas_unicas` - Empresas Únicas |
| 3 | `250+` - Sócios Cadastrados | `stats.buscas_por_periodo.hoje` - Buscas Hoje |
| 4 | `20` - Estados Cobertos | `stats.tempo_medio_resposta` - Tempo Médio (ms) |

**Mudanças**:
- ❌ Removido: 4 valores hardcoded
- ✅ Adicionado: `useSmartCNPJEstatisticas()` hook
- ✅ Adicionado: Loading skeleton para cada card
- ✅ Adicionado: Auto-refetch a cada 5 minutos
- ✅ Adicionado: Dados reais do backend

---

### ✅ 3. Página de Resultados `results/page.tsx`

**Antes**:
```typescript
import { useSmartCNPJ } from '@/hooks/useSmartCNPJ'

const { paginatedResults, filteredResults, filters } = useSmartCNPJ()

// Filtros antigos (não compatíveis com API)
if (filters.situacaoCadastral && filters.situacaoCadastral.length > 0) {
  params.set('situacao', filters.situacaoCadastral.join(','))
}
if (filters.isMEI) {
  // ...
}

<ResultsList companies={paginatedResults} />
```

**Depois**:
```typescript
import { useSmartCNPJ } from '@/hooks/useSmartCNPJ'
import { adaptAPICompaniesToMock } from '@/lib/adapters/smart-cnpj'

const { paginatedResults, filteredResults, filters } = useSmartCNPJ()

// Filtros novos (compatíveis com SmartCNPJFiltros)
if (filters.uf) {
  params.set('uf', filters.uf)
}
if (filters.situacao) {
  params.set('situacao', filters.situacao)
}
if (filters.porte) {
  params.set('porte', filters.porte)
}

<ResultsList companies={adaptAPICompaniesToMock(paginatedResults)} />
```

**Filtros Disponíveis**:
| Filtro | Tipo | Descrição |
|--------|------|-----------|
| `uf` | `string` | UF da empresa (SP, RJ, MG, etc) |
| `situacao` | `string` | Código situação cadastral (02=Ativa, etc) |
| `porte` | `string` | Código porte (01=ME, 03=EPP, 05=MEI) |
| `natureza_juridica` | `string` | Código natureza jurídica |
| `capital_social_min` | `number` | Capital social mínimo |
| `capital_social_max` | `number` | Capital social máximo |
| `data_abertura_inicio` | `string` | Data abertura início (ISO 8601) |
| `data_abertura_fim` | `string` | Data abertura fim (ISO 8601) |

**Filtros Removidos** (não existem na API):
- ❌ `municipio` - backend não suporta
- ❌ `cep` - usar `tipo_busca: 'cep'`
- ❌ `tipo` (MATRIZ/FILIAL) - backend não fornece
- ❌ `isMEI` - usar `porte: '05'`
- ❌ `isSimplesNacional` - backend não fornece

**Mudanças**:
- ✅ Adicionado: `adaptAPICompaniesToMock()` para converter resultados
- ✅ Atualizado: Filtros para `SearchFilters` (compatível com backend)
- ❌ Removido: 5 filtros não disponíveis na API
- ✅ Mantido: Paginação server-side (já implementada)
- ✅ Mantido: React Query integration (já implementada)

---

## 🛠️ Adapter Criado

### Arquivo: `frontend/src/lib/adapters/smart-cnpj.ts`

**Funções**:

#### 1. `adaptAPICompanyToMock(apiCompany: SmartCNPJCompanyAPI): SmartCNPJCompany`

Converte dados da API para formato esperado pelos componentes.

**Conversões Realizadas**:

```typescript
// ID gerado
id: apiCompany.cnpj

// Tipo assumido (backend não fornece)
tipo: 'MATRIZ'

// Porte mapeado de código para enum
porte: {
  '00': 'ME',
  '01': 'ME',    // Microempresa
  '03': 'EPP',   // Empresa de Pequeno Porte
  '05': 'MEI',   // Microempreendedor Individual
  '07': 'MEDIO',
  '09': 'GRANDE',
}[codigoPorte]

// Situação mapeada de código para enum
situacaoCadastral: {
  '02': 'ATIVA',
  '03': 'SUSPENSA',
  '04': 'INAPTA',
  '08': 'BAIXADA',
  '01': 'NULA',
}[codigoSituacaoCadastral]

// MEI calculado
isMEI: codigoPorte === '05'

// Simples Nacional (não disponível)
isSimplesNacional: false

// Forma tributação inferida
formaTributacao: isMEI ? 'SIMPLES_NACIONAL' : 'LUCRO_PRESUMIDO'

// CNAE renomeado
cnaesPrimario: apiCompany.cnaePrincipal

// Capital convertido
capitalSocial: parseFloat(apiCompany.capitalSocial)

// Nulls tratados
socios.cpfCnpj: socio.cpfCnpj || ''
socios.dataEntrada: socio.dataEntrada || ''
```

#### 2. `adaptAPICompaniesToMock(apiCompanies: SmartCNPJCompanyAPI[]): SmartCNPJCompany[]`

Converte array de empresas usando `adaptAPICompanyToMock()`.

---

## 📊 Exemplos de Uso

### 1. Buscar Detalhes da Empresa

```typescript
// Página: /smart-cnpj/33345748000185

function CompanyDetailsPage({ params }) {
  const cnpj = smartCNPJService.cleanCNPJ(params.cnpj)
  const { data, isLoading, isError, refetch } = useSmartCNPJByCNPJ(cnpj)
  
  const company = data ? adaptAPICompanyToMock(data) : null
  
  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState onRetry={refetch} />
  if (!company) return <NotFound />
  
  return <CompanyDetails company={company} />
}
```

**Features**:
- ✅ Cache automático (5 min)
- ✅ Retry em caso de erro
- ✅ Loading skeleton
- ✅ CNPJ formatado na mensagem

---

### 2. Exibir Estatísticas

```typescript
// Página: /smart-cnpj/search

function SearchPage() {
  const { data: stats, isLoading } = useSmartCNPJEstatisticas()
  
  return (
    <StatsCard title="Total de Buscas" loading={isLoading}>
      {stats?.total_buscas || 0}
    </StatsCard>
  )
}
```

**Features**:
- ✅ Auto-refetch a cada 5 minutos
- ✅ Loading skeleton por card
- ✅ Fallback para 0 se sem dados

---

### 3. Listar Resultados com Filtros

```typescript
// Página: /smart-cnpj/results?type=razao_social&q=tecnologia&uf=SP

function ResultsPage() {
  const { paginatedResults, filters, setFilters } = useSmartCNPJ()
  
  // Aplicar filtro por UF
  const handleFilterChange = (uf: string) => {
    setFilters({ ...filters, uf })
  }
  
  return (
    <div>
      <FilterPanel filters={filters} onChange={setFilters} />
      <ResultsList companies={adaptAPICompaniesToMock(paginatedResults)} />
    </div>
  )
}
```

**Features**:
- ✅ Filtros sincronizados com URL
- ✅ Paginação server-side
- ✅ Adapter automático para compatibilidade

---

## 🔄 Fluxo Completo

```
┌──────────────────┐
│ Search Page      │
│ /smart-cnpj/     │
│  search          │
└─────────┬────────┘
          │
          │ 1. Usuário digita "33345748000185"
          │ 2. handleSearch() -> performSearch()
          │ 3. Router.push('/results?type=cnpj&q=...')
          ↓
┌──────────────────┐
│ Results Page     │
│ /smart-cnpj/     │
│  results         │
└─────────┬────────┘
          │
          │ 4. useEffect detecta params da URL
          │ 5. setSearchType('cnpj'), setSearchValue('...')
          │ 6. handleSearch() chama smartCNPJService.search()
          │ 7. API retorna SmartCNPJCompanyAPI[]
          │ 8. adaptAPICompaniesToMock() converte
          │ 9. ResultsList exibe empresas
          │
          │ 10. Usuário clica em empresa
          │ 11. Router.push('/[cnpj]?from=results')
          ↓
┌──────────────────┐
│ Details Page     │
│ /smart-cnpj/     │
│  [cnpj]          │
└──────────────────┘
          │
          │ 12. cnpj = cleanCNPJ(params.cnpj)
          │ 13. useSmartCNPJByCNPJ(cnpj) busca API
          │ 14. isLoading = true -> <LoadingCard />
          │ 15. API retorna SmartCNPJCompanyAPI
          │ 16. adaptAPICompanyToMock() converte
          │ 17. isLoading = false -> <CompanyDetails />
          │
          ↓
      SUCESSO!
```

---

## ⚠️ Breaking Changes

### 1. Tipo de Dados

**Antes**:
```typescript
const companies: SmartCNPJCompany[] = mockCompanies
```

**Depois**:
```typescript
const apiCompanies: SmartCNPJCompanyAPI[] = await api.search()
const companies: SmartCNPJCompany[] = adaptAPICompaniesToMock(apiCompanies)
```

### 2. Filtros

**Antes**:
```typescript
interface Filters {
  situacaoCadastral?: ('ATIVA' | 'SUSPENSA')[]
  tipo?: 'MATRIZ' | 'FILIAL'
  porte?: ('MEI' | 'ME' | 'EPP')[]
  isMEI?: boolean
  isSimplesNacional?: boolean
  municipio?: string
  cep?: string
}
```

**Depois**:
```typescript
interface SearchFilters extends SmartCNPJFiltros {
  uf?: string
  situacao?: string        // código: '02', '03', etc
  porte?: string           // código: '01', '03', '05'
  natureza_juridica?: string
  capital_social_min?: number
  capital_social_max?: number
  data_abertura_inicio?: string
  data_abertura_fim?: string
}
```

### 3. Props dos Componentes

**Não mudou** - Componentes continuam recebendo `SmartCNPJCompany` graças ao adapter.

---

## 📈 Métricas

### Páginas Atualizadas
- **Total**: 3/3 (100%)
- ✅ `[cnpj]/page.tsx` - Details
- ✅ `search/page.tsx` - Search
- ✅ `results/page.tsx` - Results

### Componentes Compatíveis
- **Total**: 8/8 (100%)
- ✅ CompanyHeader
- ✅ CompanyCard
- ✅ IdentificationCard
- ✅ ClassificationCard
- ✅ LocationCard
- ✅ ContactCard
- ✅ StatusCard
- ✅ ResultsList

### Hooks Utilizados
- `useSmartCNPJByCNPJ(cnpj, enabled)` - Busca individual com cache
- `useSmartCNPJEstatisticas()` - Estatísticas com auto-refetch
- `useSmartCNPJ()` - Busca avançada com filtros

### Código Removido
- **Linhas deletadas**: ~150
- **Imports de mock removidos**: 3
- **Dados hardcoded removidos**: 4 stats

### Código Adicionado
- **Linhas adicionadas**: ~400
- **Novo arquivo**: `smart-cnpj.ts` adapter (110 linhas)
- **Loading states**: 3 páginas
- **Error states**: 1 página (details)

---

## 🧪 Testes Sugeridos

### Teste 1: Fluxo Completo
```bash
# 1. Acessar /smart-cnpj/search
# 2. Ver stats carregando (skeleton)
# 3. Ver stats reais após load
# 4. Buscar por CNPJ: 33345748000185
# 5. Verificar redirecionamento para /results
# 6. Ver loading na lista
# 7. Ver empresas carregadas
# 8. Clicar em uma empresa
# 9. Ver loading em details
# 10. Ver detalhes completos
```

### Teste 2: Estados de Error
```bash
# 1. Desligar backend
# 2. Acessar /smart-cnpj/33345748000185
# 3. Verificar error card
# 4. Clicar "Tentar Novamente"
# 5. Verificar novo loading
# 6. Ligar backend
# 7. Verificar sucesso após retry
```

### Teste 3: Cache
```bash
# 1. Buscar CNPJ 33345748000185
# 2. Ir para details
# 3. Voltar para search
# 4. Buscar mesmo CNPJ
# 5. Verificar load instantâneo (cache)
```

---

## 📚 Documentação Relacionada

- [Issue 2.2.1 - Setup API](./ISSUE_2.2.1_SETUP_API_COMPLETE.md)
- [Issue 2.2.2 - Tipos TypeScript](./ISSUE_2.2.2_TIPOS_TYPESCRIPT_COMPLETE.md)
- [Issue 2.2.3 - Service Layer](./ISSUE_2.2.3_SERVICE_LAYER_COMPLETE.md)
- [Issue 2.2.4 - Hooks Refactor](./ISSUE_2.2.4_HOOKS_REFACTOR_COMPLETE.md)
- [Sprint 2.2 Progress](./SPRINT_2.2_PROGRESS.md)

---

## ✅ Critérios de Aceitação

- [x] Página de detalhes usa `useSmartCNPJByCNPJ()` ✅
- [x] Página de busca usa `useSmartCNPJEstatisticas()` ✅
- [x] Página de resultados usa `useSmartCNPJ()` ✅
- [x] Todos imports de mock removidos ✅
- [x] Loading states implementados ✅
- [x] Error states com retry (details) ✅
- [x] Adapter criado para compatibilidade ✅
- [x] Filtros ajustados para API ✅
- [x] Sem erros TypeScript ✅
- [x] Componentes funcionando sem mudanças ✅

---

## 🎉 Conclusão

A **Issue 2.2.5** foi completada com sucesso! Todas as 3 páginas do Smart CNPJ 360° agora estão integradas com a API real:

✅ **Detalhes** - useSmartCNPJByCNPJ() + loading/error states  
✅ **Busca** - useSmartCNPJEstatisticas() + stats reais  
✅ **Resultados** - useSmartCNPJ() + adapter  

**100% dos componentes** continuam funcionando graças ao adapter criado, garantindo uma transição suave de mock para API real.

**Próxima issue**: 2.2.6 - Implementar funcionalidade de export (CSV, XLSX, JSON)
