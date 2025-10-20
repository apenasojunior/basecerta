/**
 * EXEMPLO DE USO - DataTable Component
 * BaseCerta - Tabela de dados com paginação e ordenação
 */

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable, createSortableColumn } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Tipo de dados de exemplo
type Company = {
  id: string
  cnpj: string
  razaoSocial: string
  status: "ativa" | "inativa" | "suspensa"
  creditos: number
  ultimaConsulta: string
}

// Dados de exemplo
const companies: Company[] = [
  {
    id: "1",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "Empresa XYZ Ltda",
    status: "ativa",
    creditos: 120,
    ultimaConsulta: "2025-10-20",
  },
  {
    id: "2",
    cnpj: "98.765.432/0001-10",
    razaoSocial: "ABC Comércio SA",
    status: "ativa",
    creditos: 85,
    ultimaConsulta: "2025-10-19",
  },
  {
    id: "3",
    cnpj: "11.222.333/0001-44",
    razaoSocial: "Tech Solutions Ltda",
    status: "suspensa",
    creditos: 0,
    ultimaConsulta: "2025-09-15",
  },
  // Adicione mais dados...
]

// Definição das colunas
const columns: ColumnDef<Company>[] = [
  // Coluna com ordenação personalizada
  {
    accessorKey: "cnpj",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8"
        >
          CNPJ
        </Button>
      )
    },
  },
  // Coluna simples
  {
    accessorKey: "razaoSocial",
    header: "Razão Social",
  },
  // Coluna com badge de status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "ativa"
              ? "default"
              : status === "suspensa"
              ? "destructive"
              : "secondary"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  // Coluna numérica
  {
    accessorKey: "creditos",
    header: "Créditos",
    cell: ({ row }) => {
      const creditos = row.getValue("creditos") as number
      return (
        <span className="font-medium">
          {creditos.toLocaleString("pt-BR")} cr
        </span>
      )
    },
  },
  // Coluna de data
  {
    accessorKey: "ultimaConsulta",
    header: "Última Consulta",
    cell: ({ row }) => {
      const date = new Date(row.getValue("ultimaConsulta"))
      return date.toLocaleDateString("pt-BR")
    },
  },
  // Coluna de ações
  {
    id: "actions",
    cell: ({ row }) => {
      const company = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Ver", company.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Download", company.id)}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Relatório
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Exemplo de uso
export function DataTableExample() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">DataTable - Exemplo Básico</h2>
        <DataTable columns={columns} data={companies} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">DataTable - Sem Paginação</h2>
        <DataTable columns={columns} data={companies} showPagination={false} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">DataTable - Loading State</h2>
        <DataTable columns={columns} data={[]} loading />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">DataTable - Empty State</h2>
        <DataTable
          columns={columns}
          data={[]}
          emptyMessage="Nenhuma empresa encontrada. Tente ajustar os filtros."
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">DataTable - Com Click</h2>
        <DataTable
          columns={columns}
          data={companies}
          onRowClick={(company) => alert(`Clicked: ${company.razaoSocial}`)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">DataTable - Customizado</h2>
        <DataTable
          columns={columns}
          data={companies}
          striped={false}
          hoverable
          bordered
          pageSize={5}
        />
      </div>
    </div>
  )
}

/**
 * GUIA DE USO
 * 
 * DEFININDO COLUNAS:
 * 
 * // Coluna simples
 * {
 *   accessorKey: "name",
 *   header: "Nome",
 * }
 * 
 * // Coluna com ordenação
 * createSortableColumn("name", "Nome")
 * 
 * // Coluna customizada
 * {
 *   accessorKey: "status",
 *   header: "Status",
 *   cell: ({ row }) => {
 *     const status = row.getValue("status")
 *     return <Badge>{status}</Badge>
 *   }
 * }
 * 
 * PROPS:
 * - columns: ColumnDef[] - Definição das colunas
 * - data: TData[] - Array de dados
 * - pageSize: number - Tamanho da página (default: 10)
 * - showPagination: boolean - Mostrar paginação (default: true)
 * - striped: boolean - Linhas zebradas (default: true)
 * - hoverable: boolean - Hover effect (default: true)
 * - bordered: boolean - Borda (default: false)
 * - loading: boolean - Estado de loading (default: false)
 * - emptyMessage: string - Mensagem quando vazio
 * - onRowClick: (row) => void - Callback de click na linha
 * 
 * FEATURES:
 * ✅ Ordenação por coluna (click no header)
 * ✅ Paginação com controles
 * ✅ Linhas zebradas
 * ✅ Hover effect
 * ✅ Loading skeleton
 * ✅ Empty state
 * ✅ Click na linha
 * ✅ Responsivo
 * ✅ Header fixo (sticky)
 * ✅ Scroll horizontal
 */
