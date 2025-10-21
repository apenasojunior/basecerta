"use client"

import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Printer, ArrowUpDown, Download } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils/formatters"
import { ExportModal, type ExportField } from "./ExportModal"

export type DebtType = "TRIBUTARIA" | "PREVIDENCIARIA" | "FGTS" | "TRABALHISTA"

export interface DebtData {
  id: string
  orgao: string
  tipo: DebtType
  valor: number
  data: string
  status: "PENDENTE" | "EM_NEGOCIACAO" | "PARCELADO" | "QUITADO"
}

interface DebtTableProps {
  data: DebtData[]
  isLoading?: boolean
  onViewDetails?: (debt: DebtData) => void
  onPrint?: (debt: DebtData) => void
}

const getDebtTypeBadge = (type: DebtType) => {
  const config = {
    TRIBUTARIA: { color: "bg-red-500/10 text-red-700 border-red-200 dark:border-red-800", label: "Tributária" },
    PREVIDENCIARIA: { color: "bg-blue-500/10 text-blue-700 border-blue-200 dark:border-blue-800", label: "Previdenciária" },
    FGTS: { color: "bg-green-500/10 text-green-700 border-green-200 dark:border-green-800", label: "FGTS" },
    TRABALHISTA: { color: "bg-orange-500/10 text-orange-700 border-orange-200 dark:border-orange-800", label: "Trabalhista" },
  }
  return config[type]
}

const getStatusBadge = (status: DebtData["status"]) => {
  const config = {
    PENDENTE: { variant: "destructive" as const, label: "Pendente" },
    EM_NEGOCIACAO: { variant: "secondary" as const, label: "Em Negociação" },
    PARCELADO: { variant: "outline" as const, label: "Parcelado" },
    QUITADO: { variant: "default" as const, label: "Quitado" },
  }
  return config[status]
}

export function DebtTable({ data, isLoading = false, onViewDetails, onPrint }: DebtTableProps) {
  const [exportOpen, setExportOpen] = useState(false)

  const exportFields: ExportField[] = [
    { id: "orgao", label: "Órgão", enabled: true },
    { id: "tipo", label: "Tipo", enabled: true },
    { id: "valor", label: "Valor", enabled: true },
    { id: "data", label: "Data", enabled: true },
    { id: "status", label: "Status", enabled: true },
  ]

  // Prepara dados para exportação (formata valores)
  const exportData = useMemo(() => {
    return data.map(debt => ({
      orgao: debt.orgao,
      tipo: getDebtTypeBadge(debt.tipo).label,
      valor: formatCurrency(debt.valor),
      data: debt.data,
      status: getStatusBadge(debt.status).label,
    }))
  }, [data])

  const columns = useMemo<ColumnDef<DebtData>[]>(
    () => [
      {
        accessorKey: "orgao",
        header: "Órgão",
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            <span className="text-sm font-medium">{row.getValue("orgao")}</span>
          </div>
        ),
      },
      {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => {
          const tipo = row.getValue("tipo") as DebtType
          const config = getDebtTypeBadge(tipo)
          return (
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          )
        },
        size: 140,
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
          <span className="font-semibold text-orange-700 dark:text-orange-400">
            {formatCurrency(row.getValue("valor"))}
          </span>
        ),
        size: 120,
      },
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
          <span className="text-sm">
            {new Date(row.getValue("data")).toLocaleDateString("pt-BR")}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as DebtData["status"]
          const config = getStatusBadge(status)
          return <Badge variant={config.variant}>{config.label}</Badge>
        },
        size: 130,
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint?.(row.original)}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 100,
      },
    ],
    [onViewDetails, onPrint]
  )

  // Calcular totalizadores por tipo
  const totaisPorTipo = useMemo(() => {
    const totais: Record<DebtType, number> = {
      TRIBUTARIA: 0,
      PREVIDENCIARIA: 0,
      FGTS: 0,
      TRABALHISTA: 0,
    }

    data.forEach((debt) => {
      totais[debt.tipo] += debt.valor
    })

    return totais
  }, [data])

  const totalGeral = Object.values(totaisPorTipo).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dívidas Ativas</h3>
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
        emptyMessage="Nenhuma dívida ativa encontrada."
      />

      {data.length > 0 && (
        <div className="space-y-3">
          {/* Totalizador por Tipo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.entries(totaisPorTipo) as [DebtType, number][]).map(([tipo, valor]) => {
              if (valor === 0) return null
              const config = getDebtTypeBadge(tipo)
              return (
                <div
                  key={tipo}
                  className={`p-3 rounded-lg border-2 ${config.color}`}
                >
                  <p className="text-xs font-medium mb-1">{config.label}</p>
                  <p className="text-lg font-bold">{formatCurrency(valor)}</p>
                </div>
              )
            })}
          </div>

          {/* Total Geral */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-lg border">
            <span className="text-sm font-medium">
              Total de Dívidas: <span className="font-bold">{data.length}</span>
            </span>
            <span className="text-sm font-medium">
              Valor Total: <span className="font-bold text-orange-700 dark:text-orange-400">
                {formatCurrency(totalGeral)}
              </span>
            </span>
          </div>
        </div>
      )}

      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Dívidas Ativas"
        data={exportData}
        availableFields={exportFields}
        filename="dividas-ativas"
      />
    </div>
  )
}
