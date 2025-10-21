"use client"

import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { FileDown, ArrowUpDown, Download } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/formatters"
import { ExportModal, type ExportField } from "./ExportModal"

export interface ProtestData {
  id: string
  data: string
  cartorio: string
  cidade: string
  uf: string
  valor: number
  status: "ATIVO" | "QUITADO" | "PRESCRITO"
}

interface ProtestTableProps {
  data: ProtestData[]
  isLoading?: boolean
  onDownload?: (protest: ProtestData) => void
}

const getStatusBadge = (status: ProtestData["status"]) => {
  const config = {
    ATIVO: { variant: "destructive" as const, label: "Ativo" },
    QUITADO: { variant: "default" as const, label: "Quitado" },
    PRESCRITO: { variant: "secondary" as const, label: "Prescrito" },
  }
  return config[status]
}

export function ProtestTable({ data, isLoading = false, onDownload }: ProtestTableProps) {
  const [exportOpen, setExportOpen] = useState(false)

  const exportFields: ExportField[] = [
    { id: "data", label: "Data", enabled: true },
    { id: "cartorio", label: "Cartório", enabled: true },
    { id: "cidade", label: "Cidade", enabled: true },
    { id: "uf", label: "UF", enabled: true },
    { id: "valor", label: "Valor", enabled: true },
    { id: "status", label: "Status", enabled: true },
  ]

  // Prepara dados para exportação (formata valores)
  const exportData = useMemo(() => {
    return data.map(protest => ({
      data: protest.data,
      cartorio: protest.cartorio,
      cidade: protest.cidade,
      uf: protest.uf,
      valor: formatCurrency(protest.valor),
      status: getStatusBadge(protest.status).label,
    }))
  }, [data])

  const columns = useMemo<ColumnDef<ProtestData>[]>(
    () => [
      {
        accessorKey: "data",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-semibold"
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">
            {new Date(row.getValue("data")).toLocaleDateString("pt-BR")}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "cartorio",
        header: "Cartório",
        cell: ({ row }) => (
          <div className="max-w-[250px]">
            <span className="text-sm">{row.getValue("cartorio")}</span>
          </div>
        ),
      },
      {
        accessorKey: "cidade",
        header: "Cidade/UF",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.getValue("cidade")}/{row.original.uf}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "valor",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 h-auto font-semibold"
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-red-700 dark:text-red-400">
            {formatCurrency(row.getValue("valor"))}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as ProtestData["status"]
          const config = getStatusBadge(status)
          return <Badge variant={config.variant}>{config.label}</Badge>
        },
        size: 100,
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload?.(row.original)}
            disabled={!onDownload}
          >
            <FileDown className="h-4 w-4 mr-1" />
            Certidão
          </Button>
        ),
        size: 120,
      },
    ],
    [onDownload]
  )

  const totalValue = data.reduce((sum, protest) => sum + protest.valor, 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Protestos</h3>
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

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        emptyMessage="Nenhum protesto encontrado."
      />
      
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">
            Total de Protestos: <span className="font-bold">{data.length}</span>
          </span>
          <span className="text-sm font-medium">
            Valor Total: <span className="font-bold text-red-700 dark:text-red-400">
              {formatCurrency(totalValue)}
            </span>
          </span>
        </div>
      )}

      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Protestos"
        data={exportData}
        availableFields={exportFields}
        filename="protestos"
      />
    </div>
  )
}
