# Guia de Integração do Sistema de Exportação

## Overview

O sistema de exportação permite exportar dados das tabelas em formatos **CSV** e **Excel (XLSX)**, com seleção granular de campos.

## Componentes

### 1. ExportModal
Modal completo com Radix UI para seleção de formato e campos.

**Localização:** `src/components/produtos/ExportModal.tsx`

**Props:**
- `open: boolean` - Controla visibilidade do modal
- `onOpenChange: (open: boolean) => void` - Callback de mudança
- `title: string` - Título da exportação (ex: "Protestos")
- `data: any[]` - Dados formatados para exportação
- `availableFields: ExportField[]` - Lista de campos disponíveis
- `filename?: string` - Nome do arquivo (default: "export")

### 2. Funções de Export
Utilitários para CSV e Excel com formatação automática.

**Localização:** `src/lib/utils/export.ts`

**Funções:**
- `exportToCSV(data, filename, columns?)` - Exporta CSV com UTF-8 BOM
- `exportToExcel(data, filename, columns?)` - Exporta XLSX com auto-width
- `formatDataForExport(data, fieldLabels?)` - Formata valores (datas, moeda, boolean)

## Como Integrar em uma Tabela

### Passo 1: Importações
```tsx
import { useState, useMemo } from "react"
import { Download } from "lucide-react"
import { ExportModal, type ExportField } from "./ExportModal"
```

### Passo 2: Estado e Campos
```tsx
export function MyTable({ data, isLoading }: MyTableProps) {
  const [exportOpen, setExportOpen] = useState(false)

  // Define campos disponíveis para exportação
  const exportFields: ExportField[] = [
    { id: "campo1", label: "Campo 1", enabled: true },
    { id: "campo2", label: "Campo 2", enabled: true },
    { id: "campo3", label: "Campo 3", enabled: false }, // desabilitado por padrão
  ]
```

### Passo 3: Preparar Dados
```tsx
  // Formata dados para exportação (valores legíveis)
  const exportData = useMemo(() => {
    return data.map(item => ({
      campo1: item.campo1,
      campo2: formatCurrency(item.campo2),
      campo3: getStatusLabel(item.campo3),
      // ... outros campos formatados
    }))
  }, [data])
```

### Passo 4: Botão de Export
```tsx
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Título da Tabela</h3>
        {data.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        )}
      </div>

      {/* Sua tabela aqui */}
      <DataTable columns={columns} data={data} />
```

### Passo 5: Incluir Modal
```tsx
      {/* Modal de exportação */}
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Meus Dados"
        data={exportData}
        availableFields={exportFields}
        filename="meus-dados"
      />
    </div>
  )
}
```

## Exemplos Completos

### Exemplo 1: ProtestTable
```tsx
// src/components/produtos/ProtestTable.tsx

export function ProtestTable({ data, isLoading, onDownload }: ProtestTableProps) {
  const [exportOpen, setExportOpen] = useState(false)

  const exportFields: ExportField[] = [
    { id: "data", label: "Data", enabled: true },
    { id: "cartorio", label: "Cartório", enabled: true },
    { id: "cidade", label: "Cidade", enabled: true },
    { id: "uf", label: "UF", enabled: true },
    { id: "valor", label: "Valor", enabled: true },
    { id: "status", label: "Status", enabled: true },
  ]

  const exportData = useMemo(() => {
    return data.map(protest => ({
      data: protest.data,
      cartorio: protest.cartorio,
      cidade: protest.cidade,
      uf: protest.uf,
      valor: formatCurrency(protest.valor), // Formata R$ X.XXX,XX
      status: getStatusBadge(protest.status).label, // "Ativo", "Quitado", etc
    }))
  }, [data])

  // ... resto do componente
}
```

### Exemplo 2: DebtTable
```tsx
// src/components/produtos/DebtTable.tsx

export function DebtTable({ data, isLoading, onViewDetails, onPrint }: DebtTableProps) {
  const [exportOpen, setExportOpen] = useState(false)

  const exportFields: ExportField[] = [
    { id: "orgao", label: "Órgão", enabled: true },
    { id: "tipo", label: "Tipo", enabled: true },
    { id: "valor", label: "Valor", enabled: true },
    { id: "data", label: "Data", enabled: true },
    { id: "status", label: "Status", enabled: true },
  ]

  const exportData = useMemo(() => {
    return data.map(debt => ({
      orgao: debt.orgao,
      tipo: getDebtTypeBadge(debt.tipo).label, // "Tributária", "Previdenciária", etc
      valor: formatCurrency(debt.valor),
      data: debt.data,
      status: getStatusBadge(debt.status).label,
    }))
  }, [data])

  // ... resto do componente
}
```

## Formatação de Dados

### Valores Monetários
```tsx
import { formatCurrency } from "@/lib/utils/formatters"

valor: formatCurrency(item.valor) // R$ 1.234,56
```

### Datas
```tsx
data: new Date(item.data).toLocaleDateString("pt-BR") // 01/01/2024
```

### Booleanos
```tsx
ativo: item.ativo ? "Sim" : "Não"
```

### Enums/Status
```tsx
// Use funções helper que já retornam labels
status: getStatusBadge(item.status).label
tipo: getTypeBadge(item.tipo).label
```

## Recursos do ExportModal

### Formatos Disponíveis
- ✅ **CSV** - Compatível com Excel, Google Sheets (UTF-8 com BOM)
- ✅ **Excel** - Formato .xlsx nativo com auto-width de colunas
- 🚧 **PDF** - Em desenvolvimento (placeholder)

### Seleção de Campos
- Checkbox individual por campo
- Botão "Selecionar todos" / "Desmarcar todos"
- Contador: "X de Y campos selecionados"
- Campos podem iniciar desabilitados: `enabled: false`

### Validações
- Desabilita botão Export se nenhum campo selecionado
- Toast de aviso se tentar exportar sem campos
- Loading state durante exportação
- Toast de sucesso/erro após exportação

### Estilos
- RadioGroup com borders, hover effects, descrições
- Área scrollável para lista de campos (max 200px)
- Ícones: FileText (CSV), FileSpreadsheet (Excel), FileDown (PDF)

## Troubleshooting

### Build Error: "Cannot find module 'xlsx'"
```bash
npm install xlsx
```

### Build Error: "Cannot find module '@radix-ui/react-checkbox'"
```bash
npm install @radix-ui/react-checkbox @radix-ui/react-radio-group
```

### Toast não funciona
Verifique se está usando a API correta:
```tsx
import { toast } from "@/lib/toast"

// ✅ Correto
toast.success("Mensagem")
toast.error("Erro")

// ❌ Incorreto
toast({ title: "...", description: "..." })
```

### Dados não formatados no export
Certifique-se de formatar os dados em `exportData`, não em `data`:
```tsx
// ✅ Correto
const exportData = useMemo(() => {
  return data.map(item => ({
    valor: formatCurrency(item.valor) // Já formatado
  }))
}, [data])

// ❌ Incorreto - exporta valores brutos
<ExportModal data={data} />
```

## Próximos Passos

Para integrar o export nas tabelas **PersonTable** e **CompanyTable**:

1. Adicionar imports (useState, Download, ExportModal)
2. Criar estado `exportOpen`
3. Definir `exportFields` com os campos da tabela
4. Criar `exportData` formatando valores (CPF, CNPJ, etc)
5. Adicionar botão Export no header
6. Incluir `<ExportModal />` no final do componente

## Performance

- Bundle size: ~100 KB adicional (xlsx library)
- First Load: +98 KB na página do dossiê financeiro
- Exportação: Instantânea para até 10K linhas
- Memória: useMemo garante recálculo apenas quando data muda

## Referências

- [xlsx library](https://github.com/SheetJS/sheetjs)
- [Radix UI](https://www.radix-ui.com/)
- [Sonner Toast](https://sonner.emilkowal.ski/)
