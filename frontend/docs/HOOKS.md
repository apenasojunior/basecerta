# 📚 Hooks Customizados - BaseCerta Frontend

Documentação completa dos hooks customizados do projeto.

---

## 🔍 useCompanySearch

Hook para buscar empresas com React Query.

### Uso Básico

```tsx
import { useCompanySearch } from "@/hooks"

function MyComponent() {
  const { search, data, isLoading, isError } = useCompanySearch()

  const handleSearch = () => {
    search({
      searchType: "CNPJ",
      searchValue: "12345678000190",
      filters: {
        situacao: "ATIVA",
        uf: "SP"
      }
    })
  }

  return (
    <div>
      <button onClick={handleSearch} disabled={isLoading}>
        Buscar
      </button>
      {data && <div>{data.total} empresas encontradas</div>}
    </div>
  )
}
```

### Retorno

- `search`: Função para iniciar busca
- `searchAsync`: Versão async da busca
- `data`: Resultado da busca (SearchResponse)
- `isLoading`: Estado de carregamento
- `isError`: Estado de erro
- `error`: Objeto de erro
- `isSuccess`: Busca concluída com sucesso
- `reset`: Reseta estado

---

## 🏢 useCompanyDetails

Hook para obter detalhes de uma empresa específica.

### Uso Básico

```tsx
import { useCompanyDetails } from "@/hooks"

function CompanyDetails({ cnpj }: { cnpj: string }) {
  const { data, isLoading, error } = useCompanyDetails(cnpj)

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar</div>

  return <div>{data?.razaoSocial}</div>
}
```

### Configuração

- Cache: 5 minutos (staleTime)
- GC: 10 minutos
- Habilitado apenas quando CNPJ fornecido

---

## ⏱️ useDebounce

Hook para debounce de valores (otimizar buscas).

### Uso Básico

```tsx
import { useDebounce } from "@/hooks"
import { useState, useEffect } from "react"

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearch) {
      // Buscar na API apenas após 500ms sem digitação
      searchAPI(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Digite para buscar..."
    />
  )
}
```

### Parâmetros

- `value`: Valor a ser debounced
- `delay`: Delay em ms (padrão: 500ms)

---

## 🔄 useDebouncedCallback

Hook para debounce de funções/callbacks.

### Uso Básico

```tsx
import { useDebouncedCallback } from "@/hooks"

function SearchComponent() {
  const handleSearch = (term: string) => {
    console.log("Buscando:", term)
    // Chamar API
  }

  const debouncedSearch = useDebouncedCallback(handleSearch, 300)

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Buscar..."
    />
  )
}
```

### Benefícios

- Otimiza eventos de scroll, resize, input
- Reduz chamadas à API
- Melhora performance

---

## 💾 useLocalStorage

Hook para estado persistido no localStorage com sincronização entre tabs.

### Uso Básico

```tsx
import { useLocalStorage } from "@/hooks"

function UserProfile() {
  const [user, setUser, removeUser] = useLocalStorage("user", null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    removeUser()
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Bem-vindo, {user.name}</p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <button onClick={() => handleLogin({ name: "João" })}>
          Login
        </button>
      )}
    </div>
  )
}
```

### Recursos

- ✅ Sincronização entre tabs/windows
- ✅ Tratamento de erros
- ✅ SSR-safe (Next.js)
- ✅ TypeScript support

### Retorno

Tuple `[value, setValue, removeValue]`:
- `value`: Valor atual
- `setValue`: Atualizar valor (aceita função como setState)
- `removeValue`: Remover do localStorage

---

## ⚙️ useSettings

Hook simplificado para gerenciar configurações do usuário.

### Uso Básico

```tsx
import { useSettings } from "@/hooks"

function SettingsPanel() {
  const [settings, updateSetting, resetSettings] = useSettings("user-preferences", {
    theme: "light",
    language: "pt-BR",
    notifications: true,
    pageSize: 20
  })

  return (
    <div>
      <select 
        value={settings.theme}
        onChange={(e) => updateSetting("theme", e.target.value)}
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
      </select>

      <input
        type="checkbox"
        checked={settings.notifications}
        onChange={(e) => updateSetting("notifications", e.target.checked)}
      />

      <button onClick={resetSettings}>Resetar Configurações</button>
    </div>
  )
}
```

### Benefícios

- Interface simplificada para múltiplas configs
- Type-safe com TypeScript
- Persiste automaticamente

---

## 🔧 Uso Combinado - Exemplo Real

Busca com debounce e localStorage:

```tsx
import { useDebounce, useLocalStorage, useCompanySearch } from "@/hooks"
import { useState, useEffect } from "react"

function SmartSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    "recent-searches",
    []
  )
  
  const debouncedSearch = useDebounce(searchTerm, 500)
  const { search, data, isLoading } = useCompanySearch()

  useEffect(() => {
    if (debouncedSearch) {
      // Buscar após 500ms
      search({
        searchType: "RAZAO_SOCIAL",
        searchValue: debouncedSearch
      })

      // Salvar nos recentes
      setRecentSearches(prev => 
        [debouncedSearch, ...prev.filter(s => s !== debouncedSearch)].slice(0, 5)
      )
    }
  }, [debouncedSearch])

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar empresas..."
      />

      {isLoading && <p>Buscando...</p>}
      {data && <p>{data.total} resultados</p>}

      <div>
        <h4>Buscas Recentes:</h4>
        {recentSearches.map(term => (
          <button key={term} onClick={() => setSearchTerm(term)}>
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 Boas Práticas

### 1. useDebounce para Inputs de Busca

```tsx
// ✅ Bom
const debouncedTerm = useDebounce(searchTerm, 500)
useEffect(() => {
  if (debouncedTerm) searchAPI(debouncedTerm)
}, [debouncedTerm])

// ❌ Evitar - busca a cada tecla
onChange={(e) => searchAPI(e.target.value)}
```

### 2. useLocalStorage para Preferências

```tsx
// ✅ Bom - persiste preferências
const [theme, setTheme] = useLocalStorage("theme", "light")

// ❌ Evitar - perde ao recarregar
const [theme, setTheme] = useState("light")
```

### 3. Error Handling

```tsx
// ✅ Bom
const { data, isError, error } = useCompanySearch()
if (isError) {
  toast.error(error.message)
}

// ❌ Evitar - ignorar erros
const { data } = useCompanySearch()
```

---

## 📊 Performance

| Hook | Benefício | Economia |
|------|-----------|----------|
| useDebounce | Reduz requests | ~70% menos chamadas |
| React Query | Cache automático | ~80% menos requests |
| useLocalStorage | Menos state management | ~50% menos re-renders |

---

## 🆘 Troubleshooting

### Debounce não funciona

```tsx
// Problema: delay muito curto
const debounced = useDebounce(value, 50) // ❌

// Solução: delay adequado
const debounced = useDebounce(value, 500) // ✅
```

### LocalStorage não persiste

```tsx
// Problema: chave diferente
useLocalStorage("user", {}) // ❌
useLocalStorage("userData", {}) // ❌

// Solução: chave consistente
const USER_KEY = "user-data"
useLocalStorage(USER_KEY, {}) // ✅
```

---

**Última atualização:** 20/10/2025
