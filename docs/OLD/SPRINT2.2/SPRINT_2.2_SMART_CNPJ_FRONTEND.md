# 🚀 Sprint 2.2 - Smart CNPJ 360° Frontend Integration

**Data Início:** 24/10/2025  
**Prazo:** 5 dias úteis  
**Responsável:** Equipe Frontend  
**Status:** 🟡 PLANEJAMENTO

---

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Análise do Estado Atual](#análise-do-estado-atual)
3. [Issues da Sprint](#issues-da-sprint)
4. [Mapeamento Backend ↔ Frontend](#mapeamento-backend--frontend)
5. [Cronograma](#cronograma)
6. [Critérios de Aceite](#critérios-de-aceite)

---

## 🎯 Visão Geral

### Objetivo
Conectar o frontend do **Smart CNPJ 360°** aos endpoints reais do backend, substituindo os dados mock por consumo real da API.

### Contexto
- ✅ **Sprint 2.1 COMPLETA:** Backend 100% implementado com 35 testes passando
- 🟡 **Sprint 2.2 ATUAL:** Frontend ainda consumindo dados mock
- 🎯 **Meta:** Frontend consumindo API real com tratamento de erros e loading states

### Endpoints Backend Disponíveis
```
✅ GET    /api/v1/smart-cnpj/{cnpj}              - Consulta por CNPJ
✅ POST   /api/v1/smart-cnpj/bulk                - Consulta em lote
✅ GET    /api/v1/smart-cnpj/historico           - Histórico de buscas
✅ GET    /api/v1/smart-cnpj/estatisticas        - Estatísticas
✅ GET    /api/v1/smart-cnpj/export              - Exportar CSV/JSON
```

**Documentação:** http://localhost:8000/docs

---

## 🔍 Análise do Estado Atual

### ✅ O que JÁ ESTÁ FUNCIONANDO

#### 1. **Backend Completo**
- 5 endpoints REST implementados
- Schemas Pydantic validados
- Integração ReceitaWS funcionando
- Cache Redis implementado
- Testes 100% passando (35/35)
- Documentação completa

#### 2. **Frontend UI Pronto**
- Páginas implementadas:
  - `/smart-cnpj/search` - Busca
  - `/smart-cnpj/results` - Resultados
  - `/smart-cnpj/[cnpj]` - Detalhes
- Componentes criados (17 componentes)
- Hook `useSmartCNPJ` implementado
- Layouts responsivos
- Skeleton loaders

#### 3. **Infraestrutura API**
- Cliente HTTP (`apiClient`) configurado
- Tipos TypeScript definidos
- Error handling básico
- Retry logic implementado

### 🔴 O que ESTÁ EM MOCK (Precisa ser Substituído)

#### 1. **Hook `useSmartCNPJ`** (`frontend/src/hooks/useSmartCNPJ.ts`)
```typescript
// ❌ MOCK - Linha 69
const [results, setResults] = useState<SmartCNPJCompany[]>(mockCompanies)

// ❌ MOCK - Linha 7-8
import {
  SmartCNPJCompany,
  searchCompanies,      // Função mock
  filterCompanies,      // Função mock
  getCompanyByCNPJ,     // Função mock
  mockCompanies,        // Array mock
} from '@/mocks/smart-cnpj'

// ❌ MOCK - Linha 87 - Simulate API delay
setTimeout(() => {
  const searchResults = searchCompanies({ type: searchType, value: searchValue })
  setResults(searchResults)
}, 500)
```

#### 2. **Endpoints File** (`frontend/src/lib/api/endpoints/companies.ts`)
```typescript
// ❌ MOCK - Linhas 115-120
// TODO: Substituir por chamada real à API
// const response = await apiClient.post<CompanySearchResponse>("/api/v1/companies/search", params)
// return response.data

// Mock: Filtra dados baseado nos parâmetros
let filtered = [...MOCK_COMPANIES]
```

#### 3. **Tipos TypeScript Desalinhados**
```typescript
// ❌ Interface frontend difere do schema backend
interface SmartCNPJCompany {  // Frontend
  id: string                    // ❌ Backend não retorna "id"
  cnpj: string
  razaoSocial: string
  // ...
  cnaesPrimario: {...}         // ❌ Backend retorna "cnaePrincipal"
  cnaesSecundarios: [...]      // ✅ OK
}
```

---

## 📝 Issues da Sprint

### **Issue 2.2.1** - Setup e Configuração API ⚙️
**Prioridade:** 🔴 CRÍTICA  
**Estimativa:** 2 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Criar arquivo de ambiente `.env.local`
- [ ] Configurar `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Validar conexão com backend
- [ ] Testar health check endpoint

**Arquivos:**
```
frontend/.env.local (criar)
frontend/src/lib/api/client.ts (validar)
```

**Critérios de Aceite:**
- ✅ `.env.local` criado com variáveis corretas
- ✅ API client conectando em `http://localhost:8000`
- ✅ Health check retornando status OK

---

### **Issue 2.2.2** - Alinhar Tipos TypeScript com Backend 🔧
**Prioridade:** 🔴 CRÍTICA  
**Estimativa:** 3 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Criar interface `SmartCNPJCompanyAPI` alinhada com backend
- [ ] Atualizar tipos em `types/api.ts`
- [ ] Criar funções de transformação mock → API
- [ ] Documentar diferenças de campos

**Arquivos:**
```
frontend/src/types/smart-cnpj.ts (criar)
frontend/src/types/api.ts (atualizar)
frontend/src/lib/transformers/smart-cnpj.ts (criar)
```

**Mapeamento de Campos:**
```typescript
// Backend → Frontend
{
  // ✅ Iguais
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  
  // 🔄 Diferentes
  cnaePrincipal → cnaesPrimario    // Renomear
  cnaesSecundarios → cnaesSecundarios  // OK
  
  // ➕ Adicionar no frontend
  naturezaJuridica: string (novo)
  codigoNaturezaJuridica: string (novo)
  
  // ➖ Remover do frontend
  id: string (não existe no backend)
  isMEI: boolean (calcular a partir de porte)
  isSimplesNacional: boolean (não tem no backend)
  formaTributacao: string (não tem no backend)
}
```

**Critérios de Aceite:**
- ✅ Interface TypeScript 100% alinhada com schema Pydantic
- ✅ Função transformer testada
- ✅ Sem erros de compilação TypeScript

---

### **Issue 2.2.3** - Criar Service Layer para Smart CNPJ 🏗️
**Prioridade:** 🔴 CRÍTICA  
**Estimativa:** 4 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Criar `smartCNPJService.ts`
- [ ] Implementar método `searchByCNPJ(cnpj: string)`
- [ ] Implementar método `searchByRazaoSocial(query: string)`
- [ ] Implementar método `bulkSearch(cnpjs: string[])`
- [ ] Implementar método `getHistorico()`
- [ ] Implementar método `getEstatisticas()`
- [ ] Implementar método `exportData(format: 'csv' | 'json')`
- [ ] Adicionar error handling completo
- [ ] Adicionar cache local (opcional)

**Arquivos:**
```
frontend/src/lib/api/services/smartCNPJService.ts (criar)
```

**Estrutura do Service:**
```typescript
// smartCNPJService.ts
import { apiClient } from '../client'
import type { SmartCNPJCompanyAPI, SmartCNPJSearchResponse } from '@/types/smart-cnpj'

export const smartCNPJService = {
  /**
   * Busca empresa por CNPJ
   * GET /api/v1/smart-cnpj/{cnpj}
   */
  async getByCNPJ(cnpj: string): Promise<SmartCNPJCompanyAPI> {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    const response = await apiClient.get<SmartCNPJCompanyAPI>(
      `/v1/smart-cnpj/${cleanCNPJ}`
    )
    return response.data!
  },

  /**
   * Busca em lote
   * POST /api/v1/smart-cnpj/bulk
   */
  async bulkSearch(params: {
    tipo_busca: string
    valor_busca: string
    filtros?: object
    page?: number
    limit?: number
  }): Promise<SmartCNPJSearchResponse> {
    const response = await apiClient.post<SmartCNPJSearchResponse>(
      '/v1/smart-cnpj/bulk',
      params
    )
    return response.data!
  },

  /**
   * Histórico de buscas
   * GET /api/v1/smart-cnpj/historico
   */
  async getHistorico(page = 1, limit = 20) {
    const response = await apiClient.get('/v1/smart-cnpj/historico', {
      page,
      limit
    })
    return response.data!
  },

  /**
   * Estatísticas
   * GET /api/v1/smart-cnpj/estatisticas
   */
  async getEstatisticas() {
    const response = await apiClient.get('/v1/smart-cnpj/estatisticas')
    return response.data!
  },

  /**
   * Exportar dados
   * GET /api/v1/smart-cnpj/export
   */
  async exportData(
    tipoBusca: string,
    valorBusca: string,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob> {
    const response = await apiClient.getClient().get(
      '/v1/smart-cnpj/export',
      {
        params: { tipo_busca: tipoBusca, valor_busca: valorBusca, formato: format },
        responseType: 'blob'
      }
    )
    return response.data
  }
}
```

**Critérios de Aceite:**
- ✅ Todos os 5 endpoints implementados
- ✅ Tratamento de erro para cada método
- ✅ Tipos TypeScript corretos
- ✅ Testes manuais com Postman/curl OK

---

### **Issue 2.2.4** - Refatorar Hook useSmartCNPJ 🔄
**Prioridade:** 🟡 ALTA  
**Estimativa:** 5 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Remover imports de `@/mocks/smart-cnpj`
- [ ] Substituir `mockCompanies` por chamadas ao service
- [ ] Implementar loading states reais
- [ ] Implementar error handling
- [ ] Adicionar toast notifications para erros
- [ ] Atualizar paginação para usar metadata do backend
- [ ] Testar todos os cenários (sucesso, erro, loading)

**Arquivos:**
```
frontend/src/hooks/useSmartCNPJ.ts (refatorar)
```

**Mudanças Principais:**
```typescript
// ❌ ANTES (Mock)
const [results, setResults] = useState<SmartCNPJCompany[]>(mockCompanies)

const handleSearch = useCallback(() => {
  setTimeout(() => {
    const searchResults = searchCompanies({ type: searchType, value: searchValue })
    setResults(searchResults)
  }, 500)
}, [searchType, searchValue])

// ✅ DEPOIS (API Real)
const [results, setResults] = useState<SmartCNPJCompany[]>([])
const [error, setError] = useState<string | null>(null)

const handleSearch = useCallback(async () => {
  if (!searchValue.trim()) return
  
  setIsSearching(true)
  setError(null)
  
  try {
    const response = await smartCNPJService.bulkSearch({
      tipo_busca: searchType,
      valor_busca: searchValue,
      filtros: filters,
      page: 1,
      limit: 20
    })
    
    setResults(response.data)
    setPagination(response.pagination)
    setHasSearched(true)
  } catch (err) {
    setError(err.message || 'Erro ao buscar empresas')
    toast.error('Erro ao buscar empresas')
  } finally {
    setIsSearching(false)
  }
}, [searchType, searchValue, filters])
```

**Critérios de Aceite:**
- ✅ Hook não usa mais mocks
- ✅ Loading states funcionando
- ✅ Erros sendo tratados e exibidos
- ✅ Paginação sincronizada com backend

---

### **Issue 2.2.5** - Atualizar Páginas para API Real 📄
**Prioridade:** 🟡 ALTA  
**Estimativa:** 4 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Atualizar `/smart-cnpj/search` para usar hook refatorado
- [ ] Atualizar `/smart-cnpj/results` para exibir dados da API
- [ ] Atualizar `/smart-cnpj/[cnpj]` para buscar detalhes via API
- [ ] Adicionar error boundaries
- [ ] Adicionar estados vazios (empty states)
- [ ] Testar navegação entre páginas

**Arquivos:**
```
frontend/src/app/smart-cnpj/search/page.tsx
frontend/src/app/smart-cnpj/results/page.tsx
frontend/src/app/smart-cnpj/[cnpj]/page.tsx
```

**Página de Detalhes - Mudança Principal:**
```typescript
// ❌ ANTES (Mock)
import { getCompanyByCNPJ } from '@/mocks/smart-cnpj'

const company = getCompanyByCNPJ(params.cnpj)

// ✅ DEPOIS (API Real)
import { smartCNPJService } from '@/lib/api/services/smartCNPJService'

const [company, setCompany] = useState<SmartCNPJCompany | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  async function fetchCompany() {
    try {
      setLoading(true)
      const data = await smartCNPJService.getByCNPJ(params.cnpj)
      setCompany(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchCompany()
}, [params.cnpj])

if (loading) return <Skeleton />
if (error) return <ErrorState error={error} />
if (!company) return <NotFound />
```

**Critérios de Aceite:**
- ✅ Todas as páginas consumindo API real
- ✅ Loading states visíveis
- ✅ Erros tratados com UI apropriada
- ✅ Navegação funcionando sem bugs

---

### **Issue 2.2.6** - Implementar Funcionalidades de Export 📥
**Prioridade:** 🟢 MÉDIA  
**Estimativa:** 3 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Criar componente `ExportButton`
- [ ] Implementar download CSV
- [ ] Implementar download JSON
- [ ] Adicionar feedback visual (loading, success)
- [ ] Testar com diferentes volumes de dados

**Arquivos:**
```
frontend/src/components/smart-cnpj/ExportButton.tsx (criar)
```

**Implementação:**
```typescript
'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { smartCNPJService } from '@/lib/api/services/smartCNPJService'
import { toast } from 'sonner'

export function ExportButton({ 
  searchType, 
  searchValue,
  totalResults 
}: {
  searchType: string
  searchValue: string
  totalResults: number
}) {
  const [exporting, setExporting] = useState(false)

  async function handleExport(format: 'csv' | 'json') {
    try {
      setExporting(true)
      const blob = await smartCNPJService.exportData(searchType, searchValue, format)
      
      // Download do arquivo
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `smart-cnpj-${Date.now()}.${format}`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success(`${totalResults} empresas exportadas com sucesso!`)
    } catch (error) {
      toast.error('Erro ao exportar dados')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={exporting}
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('json')}
        disabled={exporting}
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar JSON
      </Button>
    </div>
  )
}
```

**Critérios de Aceite:**
- ✅ Botão de export visível na página de resultados
- ✅ Download CSV funcionando
- ✅ Download JSON funcionando
- ✅ Loading state durante export
- ✅ Mensagens de sucesso/erro

---

### **Issue 2.2.7** - Dashboard com Histórico e Estatísticas 📊
**Prioridade:** 🟢 MÉDIA  
**Estimativa:** 4 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Criar página `/smart-cnpj/dashboard`
- [ ] Implementar widget de histórico de buscas
- [ ] Implementar widget de estatísticas
- [ ] Adicionar gráficos (opcional)
- [ ] Adicionar paginação no histórico

**Arquivos:**
```
frontend/src/app/smart-cnpj/dashboard/page.tsx (criar)
frontend/src/components/smart-cnpj/HistoricoWidget.tsx (criar)
frontend/src/components/smart-cnpj/EstatisticasWidget.tsx (criar)
```

**Critérios de Aceite:**
- ✅ Dashboard exibindo histórico real
- ✅ Estatísticas vindas do backend
- ✅ Paginação funcionando
- ✅ UI responsiva

---

### **Issue 2.2.8** - Testes e Validação Final ✅
**Prioridade:** 🔴 CRÍTICA  
**Estimativa:** 3 horas  
**Status:** 🟡 TODO

**Tarefas:**
- [ ] Teste E2E: Busca por CNPJ
- [ ] Teste E2E: Busca por Razão Social
- [ ] Teste E2E: Aplicar filtros
- [ ] Teste E2E: Exportar dados
- [ ] Teste E2E: Navegar entre páginas
- [ ] Validar performance (tempo de resposta)
- [ ] Validar tratamento de erros
- [ ] Testar com backend offline
- [ ] Documentar bugs encontrados

**Cenários de Teste:**
```
1. ✅ Busca por CNPJ válido → Retorna dados
2. ✅ Busca por CNPJ inválido → Erro 404
3. ✅ Busca por Razão Social → Lista de resultados
4. ✅ Aplicar filtro UF → Resultados filtrados
5. ✅ Paginação → Carregar página 2
6. ✅ Export CSV → Download arquivo
7. ✅ Backend offline → Mensagem de erro
8. ✅ Timeout → Retry automático
```

**Critérios de Aceite:**
- ✅ Todos os cenários de teste passando
- ✅ Performance < 3s por request
- ✅ Sem erros no console
- ✅ Sem warnings TypeScript

---

## 🔄 Mapeamento Backend ↔ Frontend

### Endpoints → Páginas

| Endpoint Backend | Página Frontend | Método | Descrição |
|------------------|-----------------|--------|-----------|
| `GET /api/v1/smart-cnpj/{cnpj}` | `/smart-cnpj/[cnpj]` | `getByCNPJ()` | Detalhes de uma empresa |
| `POST /api/v1/smart-cnpj/bulk` | `/smart-cnpj/results` | `bulkSearch()` | Busca em lote |
| `GET /api/v1/smart-cnpj/historico` | `/smart-cnpj/dashboard` | `getHistorico()` | Histórico de buscas |
| `GET /api/v1/smart-cnpj/estatisticas` | `/smart-cnpj/dashboard` | `getEstatisticas()` | Estatísticas |
| `GET /api/v1/smart-cnpj/export` | `/smart-cnpj/results` | `exportData()` | Download CSV/JSON |

### Tipos de Busca

| Frontend (searchType) | Backend (tipo_busca) | Enum Backend |
|-----------------------|----------------------|--------------|
| `cnpj` | `cnpj` | `TipoBusca.CNPJ` |
| `razaoSocial` | `razao_social` | `TipoBusca.RAZAO_SOCIAL` |
| `nomeFantasia` | `nome_fantasia` | `TipoBusca.NOME_FANTASIA` |
| `segmento` | `segmento` | `TipoBusca.SEGMENTO` |
| `email` | `email` | `TipoBusca.EMAIL` |
| `telefone` | `telefone` | `TipoBusca.TELEFONE` |
| `nomeSocio` | `socio` | `TipoBusca.SOCIO` |
| `cep` | `cep` | `TipoBusca.CEP` |

### Schema Backend → Interface Frontend

```typescript
// Backend: SmartCNPJCompanyResponse
{
  cnpj: string                      // ✅ Igual
  razaoSocial: string               // ✅ Igual
  nomeFantasia: string              // ✅ Igual
  naturezaJuridica: string          // ➕ Adicionar
  codigoNaturezaJuridica: string    // ➕ Adicionar
  porte: string                     // ✅ Igual
  codigoPorte: string               // ➕ Adicionar
  capitalSocial: Decimal            // ✅ Igual (number no TS)
  situacaoCadastral: string         // ✅ Igual
  codigoSituacaoCadastral: string   // ➕ Adicionar
  dataSituacaoCadastral: string     // ➕ Adicionar
  motivoSituacaoCadastral: string   // ➕ Adicionar
  dataInicioAtividade: string       // ➕ Adicionar
  dataAbertura: string              // ✅ Igual
  endereco: {                       // ✅ Igual
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cep: string
    municipio: string
    uf: string
  }
  contatos: {                       // ✅ Igual
    email: string
    telefone: string
    telefone2: string
    fax: string
  }
  cnaePrincipal: {                  // 🔄 Renomear para cnaesPrimario
    codigo: string
    descricao: string
  }
  cnaesSecundarios: [{              // ✅ Igual
    codigo: string
    descricao: string
  }]
  socios: [{                        // ✅ Igual
    nome: string
    cpfCnpj: string
    qualificacao: string
    dataEntrada: string
  }]
}

// Frontend: Campos a REMOVER (não existem no backend)
{
  id: string                        // ❌ Remover
  tipo: 'MATRIZ' | 'FILIAL'         // ❌ Remover (ou calcular)
  isMEI: boolean                    // ❌ Remover (calcular de porte)
  isSimplesNacional: boolean        // ❌ Remover
  formaTributacao: string           // ❌ Remover
}
```

---

## 📅 Cronograma

### Dia 1 (24/10/2025) - Setup e Tipos
- ✅ Issue 2.2.1 - Setup e Configuração API (2h)
- ✅ Issue 2.2.2 - Alinhar Tipos TypeScript (3h)
- **Total:** 5 horas

### Dia 2 (25/10/2025) - Service Layer
- ✅ Issue 2.2.3 - Criar Service Layer (4h)
- ✅ Testes manuais dos endpoints (1h)
- **Total:** 5 horas

### Dia 3 (26/10/2025) - Refatoração Hook
- ✅ Issue 2.2.4 - Refatorar Hook useSmartCNPJ (5h)
- **Total:** 5 horas

### Dia 4 (27/10/2025) - Páginas e Export
- ✅ Issue 2.2.5 - Atualizar Páginas (4h)
- ✅ Issue 2.2.6 - Implementar Export (3h)
- **Total:** 7 horas

### Dia 5 (28/10/2025) - Dashboard e Testes
- ✅ Issue 2.2.7 - Dashboard (4h)
- ✅ Issue 2.2.8 - Testes e Validação (3h)
- **Total:** 7 horas

**Total Estimado:** 29 horas / 5 dias

---

## ✅ Critérios de Aceite da Sprint

### Funcionalidades
- ✅ Todas as páginas consumindo API real (0% mock)
- ✅ Busca por CNPJ funcionando
- ✅ Busca por Razão Social funcionando
- ✅ Filtros aplicados corretamente
- ✅ Paginação sincronizada com backend
- ✅ Export CSV/JSON funcionando
- ✅ Histórico de buscas exibido
- ✅ Estatísticas exibidas

### Qualidade
- ✅ Sem erros TypeScript
- ✅ Sem warnings no console
- ✅ Loading states em todas as operações
- ✅ Error handling completo
- ✅ Performance < 3s por request
- ✅ UI responsiva

### Documentação
- ✅ README do service atualizado
- ✅ Tipos TypeScript documentados
- ✅ Exemplos de uso no código

---

## 📊 Métricas de Sucesso

- **Cobertura de API:** 100% dos endpoints consumidos
- **Redução de Mock:** 0% de dados mock (atualmente 100%)
- **Performance:** < 3s tempo médio de resposta
- **Erros:** < 1% taxa de erro
- **Satisfação:** Aprovação do PO

---

## 🔗 Links Úteis

- **Backend API:** http://localhost:8000/docs
- **Guia da API:** [docs/SMART_CNPJ_API_GUIDE.md](./SMART_CNPJ_API_GUIDE.md)
- **Testes Backend:** [docs/TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Sprint 2.1:** [docs/SPRINT_2.1_SMART_CNPJ_BACKEND.md](./SPRINT_2.1_SMART_CNPJ_BACKEND.md)

---

**Última atualização:** 24/10/2025  
**Versão:** 1.0  
**Mantido por:** Equipe BaseCerta
