# 📚 Componentes UI - BaseCerta Frontend

Documentação completa de todos os componentes UI customizados do projeto.

---

## 📖 Índice

1. [Form Components](#form-components)
2. [Feedback Components](#feedback-components)
3. [Data Display](#data-display)
4. [Loading States](#loading-states)
5. [Error Handling](#error-handling)
6. [Empty States](#empty-states)

---

## 🔤 Form Components

### Input

Input de texto estendido com estados visuais e validação.

```tsx
import { Input } from "@/components/ui/input"

<Input
  variant="default" // default | error | success | warning
  placeholder="Digite aqui..."
  prefixIcon={<Search />}
  suffixIcon={<X />}
/>
```

**Props:**
- `variant`: Estado visual do input
- `prefixIcon`: Ícone no início
- `suffixIcon`: Ícone no final
- Suporta todas as props de `<input>`

---

### FormInput

Wrapper completo com label, erro e hint.

```tsx
import { FormInput } from "@/components/forms/FormInput"

<FormInput
  label="Email"
  error="Email inválido"
  hint="Digite seu melhor email"
  required
  {...register("email")}
/>
```

**Props:**
- `label`: Texto do label
- `error`: Mensagem de erro
- `hint`: Texto de ajuda
- `required`: Mostra indicador (*)

---

### SearchInput

Input especializado para buscas com debounce.

```tsx
import { SearchInput } from "@/components/ui/search-input"

<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  onSearch={(value) => console.log(value)}
  debounceMs={500}
  isLoading={loading}
/>
```

**Features:**
- Debounce configurável
- Botão de limpar
- Loading state
- Callback onSearch

---

## 💬 Feedback Components

### Toast Notifications

Sistema de notificações com Sonner.

```tsx
import { toast } from "@/lib/toast"

// Básico
toast.success("Operação realizada!")
toast.error("Erro ao processar")
toast.warning("Atenção necessária")
toast.info("Informação importante")

// Loading
toast.loading("Processando...")

// Promise
toast.promise(
  fetchData(),
  {
    loading: "Carregando...",
    success: "Dados carregados!",
    error: "Erro ao carregar"
  }
)

// Shortcuts
toast.apiError(error)
toast.saveSuccess()
toast.deleteSuccess()
toast.networkError()
```

**Tipos disponíveis:**
- `success` - Verde com ✓
- `error` - Vermelho com ✗
- `warning` - Amarelo com ⚠
- `info` - Azul com ℹ
- `loading` - Com spinner

---

### Modal Dialog

Modal estendido com tamanhos e estrutura.

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"

<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  size="lg" // sm | md | lg | xl | full
  preventClose={false}
>
  <ModalHeader>
    <h2>Título do Modal</h2>
  </ModalHeader>
  <ModalBody>
    Conteúdo aqui
  </ModalBody>
  <ModalFooter>
    <Button onClick={handleSave}>Salvar</Button>
  </ModalFooter>
</Modal>
```

**Tamanhos:**
- `sm`: 400px
- `md`: 600px (padrão)
- `lg`: 800px
- `xl`: 1000px
- `full`: 100vw

---

## 📊 Data Display

### Card Extended

Card com variantes e estados especiais.

```tsx
import { Card } from "@/components/ui/card"

<Card
  variant="elevated" // default | outlined | elevated | interactive
  isLoading={false}
  isEmpty={false}
  onClick={() => {}}
>
  Conteúdo
</Card>
```

**Variantes:**
- `default`: Padrão com border
- `outlined`: Border destacada
- `elevated`: Com shadow
- `interactive`: Hover effects

---

### StatsCard

Card especializado para estatísticas.

```tsx
import { StatsCard } from "@/components/ui/stats-card"

<StatsCard
  icon={<TrendingUp />}
  title="Consultas"
  value="1,234"
  trend="positive" // positive | negative | neutral
  trendValue="+12.5%"
  size="md" // sm | md | lg
/>
```

**Features:**
- Ícone customizável
- Indicador de tendência
- Cores automáticas (verde/vermelho)
- 3 tamanhos

---

### DataTable

Tabela completa com ordenação e paginação.

```tsx
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
]

<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  emptyMessage="Nenhum item"
  onRowClick={(row) => {}}
/>
```

**Features:**
- Ordenação por coluna
- Paginação
- Loading skeletons
- Empty state
- Row click handler

---

## ⏳ Loading States

### Spinner

Indicador de carregamento simples.

```tsx
import { Spinner, SpinnerPage } from "@/components/ui/spinner"

<Spinner size="md" /> // sm | md | lg | xl
<SpinnerPage label="Carregando..." />
```

---

### Skeleton

Placeholders animados.

```tsx
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-full" />
<SkeletonCard />
<SkeletonTable rows={5} />
```

**Presets:**
- `SkeletonCard`: Card completo
- `SkeletonTable`: Tabela
- `SkeletonList`: Lista
- `SkeletonStats`: Estatísticas

---

### LoadingOverlay

Overlay de carregamento fullscreen ou container.

```tsx
import { LoadingOverlay } from "@/components/ui/loading-overlay"

<LoadingOverlay
  visible={isLoading}
  label="Processando..."
  variant="fullscreen" // fullscreen | container
/>
```

---

### ProgressBar

Barra de progresso.

```tsx
import { ProgressBar, CircularProgress } from "@/components/ui/progress-bar"

<ProgressBar value={75} max={100} />
<ProgressBar indeterminate />
<CircularProgress value={50} size="lg" />
```

---

## 🚨 Error Handling

### ErrorBoundary

Captura erros de React.

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary"

<ErrorBoundary
  onError={(error, info) => {
    // Log para Sentry
  }}
  showDetails={process.env.NODE_ENV === "development"}
>
  <MyComponent />
</ErrorBoundary>
```

**Features:**
- UI de erro rica
- Botões de retry/home/reload
- Stack trace em dev
- Callback para logging
- Fallback customizável

---

### InlineErrorBoundary

Versão compacta para seções.

```tsx
import { InlineErrorBoundary } from "@/components/ErrorBoundary"

<InlineErrorBoundary
  title="Erro ao carregar"
  onRetry={() => refetch()}
>
  <Widget />
</InlineErrorBoundary>
```

---

## 📭 Empty States

### EmptyState

Estado vazio reutilizável.

```tsx
import { EmptyState } from "@/components/ui/empty-state"

<EmptyState
  icon={FileText}
  title="Nenhum dado"
  description="Você ainda não tem nenhum item."
  variant="no-data" // no-data | no-results | error | no-access
  actionLabel="Criar Novo"
  onAction={() => {}}
  withCard
  iconSize="lg"
/>
```

**Variantes:**
- `no-data`: Sem dados cadastrados
- `no-results`: Busca sem resultados
- `error`: Erro ao carregar
- `no-access`: Sem permissão

---

### EmptyStateSuggestions

Lista de sugestões.

```tsx
import { EmptyStateSuggestions } from "@/components/ui/empty-state"

<EmptyStateSuggestions
  items={[
    "Verifique a ortografia",
    "Use termos mais genéricos",
    "Remova filtros"
  ]}
/>
```

---

### EmptyStateInline

Versão compacta inline.

```tsx
import { EmptyStateInline } from "@/components/ui/empty-state"

<EmptyStateInline
  message="Nenhuma empresa encontrada"
  icon={Search}
/>
```

---

## 🎨 Padrões de Uso

### Página com Loading e Error

```tsx
function MyPage() {
  const { data, isLoading, isError, error } = useQuery(...)

  if (isLoading) return <SpinnerPage />
  if (isError) return <ErrorPage error={error} />
  if (!data?.length) return <EmptyState variant="no-data" />

  return <Content data={data} />
}
```

---

### Formulário com Validação

```tsx
function MyForm() {
  const { register, formState: { errors } } = useForm()

  return (
    <form>
      <FormInput
        label="Nome"
        error={errors.name?.message}
        {...register("name")}
      />
      <Button type="submit" loading={isSubmitting}>
        Salvar
      </Button>
    </form>
  )
}
```

---

### Busca com Debounce

```tsx
function SearchComponent() {
  const [term, setTerm] = useState("")
  const debouncedTerm = useDebounce(term, 500)

  useEffect(() => {
    if (debouncedTerm) search(debouncedTerm)
  }, [debouncedTerm])

  return (
    <SearchInput
      value={term}
      onChange={setTerm}
      isLoading={isSearching}
    />
  )
}
```

---

### Modal com Confirmação

```tsx
function DeleteModal() {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteItem()
      toast.success("Item deletado!")
      setOpen(false)
    } catch (error) {
      toast.error("Erro ao deletar")
    }
  }

  return (
    <Modal open={open} onOpenChange={setOpen} size="sm">
      <ModalHeader>Confirmar exclusão?</ModalHeader>
      <ModalBody>Esta ação não pode ser desfeita.</ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Deletar
        </Button>
      </ModalFooter>
    </Modal>
  )
}
```

---

## 🎯 Boas Práticas

### ✅ Fazer

- Use EmptyState quando não houver dados
- Adicione loading states em todas as operações assíncronas
- Use ErrorBoundary em torno de features grandes
- Forneça feedback com toasts em ações importantes
- Use FormInput para consistência visual

### ❌ Evitar

- Não deixe usuário sem feedback (sem loading/empty/error)
- Não use múltiplos spinners na mesma tela
- Não ignore erros (sempre trate ou log)
- Não use cores/estilos inconsistentes
- Não esqueça estados de loading/erro

---

**Última atualização:** 20/10/2025
