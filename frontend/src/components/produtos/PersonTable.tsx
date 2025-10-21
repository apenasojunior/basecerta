"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Download } from "lucide-react"
import { useState, useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatCPF } from "@/lib/utils/formatters"
import type { PersonTableData, StatusPF } from "@/types/person"
import { ExportModal, type ExportField } from "./ExportModal"
import { FavoriteButton } from "./FavoriteButton"

/**
 * Retorna estilo e label do badge de status
 */
function getStatusBadge(status: StatusPF) {
  const variants = {
    REGULAR: { label: "Regular", variant: "default" as const, className: "bg-green-100 text-green-800 hover:bg-green-200" },
    PENDENCIAS: { label: "Pendências", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
    RESTRICOES: { label: "Restrições", variant: "destructive" as const, className: "bg-red-100 text-red-800 hover:bg-red-200" },
  }
  return variants[status] || variants.REGULAR
}

/**
 * Definição das colunas da tabela
 */
export const columns: ColumnDef<PersonTableData>[] = [
  {
    accessorKey: "cpf",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted"
        >
          CPF
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {formatCPF(row.getValue("cpf"))}
      </div>
    ),
  },
  {
    accessorKey: "nomeCompleto",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted"
        >
          Nome Completo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("nomeCompleto")}</div>,
  },
  {
    accessorKey: "idade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-muted"
        >
          Idade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("idade")} anos</div>,
  },
  {
    accessorKey: "sexo",
    header: "Sexo",
    cell: ({ row }) => {
      const sexoMap: Record<string, string> = {
        M: "Masculino",
        F: "Feminino",
        O: "Outro",
        NI: "Não Informado",
      }
      const sexo = row.getValue("sexo") as string
      return <div className="text-sm">{sexoMap[sexo] || sexo}</div>
    },
  },
  {
    accessorKey: "uf",
    header: "UF",
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("uf")}</div>,
  },
  {
    accessorKey: "municipio",
    header: "Município",
    cell: ({ row }) => <div>{row.getValue("municipio")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as StatusPF
      const badge = getStatusBadge(status)
      return (
        <Badge variant={badge.variant} className={cn("font-medium", badge.className)}>
          {badge.label}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const person = row.original

      return (
        <div className="flex items-center gap-2">
          <FavoriteButton
            item={{
              id: person.cpf,
              type: "PF",
              document: person.cpf,
              name: person.nomeCompleto,
              metadata: {
                uf: person.uf,
                municipio: person.municipio,
                status: getStatusBadge(person.status).label,
              },
            }}
            size="icon"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(person.cpf)}
              >
                Copiar CPF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert(`Ver detalhes: ${person.nomeCompleto}`)}>
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Baixar PDF: ${person.nomeCompleto}`)}>
                Baixar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Gerar relatório: ${person.nomeCompleto}`)}>
                Gerar Relatório
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

interface PersonTableProps {
  data: PersonTableData[]
  isLoading?: boolean
}

export function PersonTable({ data, isLoading }: PersonTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [exportOpen, setExportOpen] = useState(false)

  const exportFields: ExportField[] = [
    { id: "cpf", label: "CPF", enabled: true },
    { id: "nome", label: "Nome Completo", enabled: true },
    { id: "idade", label: "Idade", enabled: true },
    { id: "sexo", label: "Sexo", enabled: true },
    { id: "uf", label: "UF", enabled: true },
    { id: "municipio", label: "Município", enabled: true },
    { id: "status", label: "Status", enabled: true },
  ]

  // Prepara dados para exportação (formata valores)
  const exportData = useMemo(() => {
    return data.map(person => ({
      cpf: formatCPF(person.cpf),
      nome: person.nomeCompleto,
      idade: person.idade.toString(),
      sexo: person.sexo === "M" ? "Masculino" : "Feminino",
      uf: person.uf,
      municipio: person.municipio,
      status: getStatusBadge(person.status).label,
    }))
  }, [data])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-muted-foreground">
          Carregando resultados...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header com botão de export */}
      {data.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      )}

      {/* Tabela com scroll horizontal no mobile */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => alert(`Detalhes: ${row.original.nomeCompleto}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
            </span>
          )}
          {table.getFilteredRowModel().rows.length} resultado(s)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>

      {/* Modal de exportação */}
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Dados Cadastrais PF"
        data={exportData}
        availableFields={exportFields}
        filename="dados-cadastrais-pf"
      />
    </div>
  )
}
