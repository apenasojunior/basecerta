"use client"

import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, FileDown, MoreVertical } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCNPJ } from "@/lib/utils/formatters"

export interface CompanyData {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  situacao: "ATIVA" | "SUSPENSA" | "INAPTA" | "BAIXADA" | "NULA"
  porte: "MEI" | "ME" | "EPP" | "MEDIA" | "GRANDE"
  uf: string
  municipio: string
  dataAbertura?: string
}

interface CompanyTableProps {
  data: CompanyData[]
  isLoading?: boolean
  onViewDetails?: (company: CompanyData) => void
  onDownloadPDF?: (company: CompanyData) => void
}

const getSituacaoBadge = (situacao: CompanyData["situacao"]) => {
  const variants = {
    ATIVA: "default" as const,
    SUSPENSA: "secondary" as const,
    INAPTA: "destructive" as const,
    BAIXADA: "outline" as const,
    NULA: "outline" as const,
  }

  const colors = {
    ATIVA: "bg-green-500 hover:bg-green-600",
    SUSPENSA: "bg-yellow-500 hover:bg-yellow-600",
    INAPTA: "",
    BAIXADA: "",
    NULA: "",
  }

  return (
    <Badge
      variant={variants[situacao]}
      className={`transition-all ${
        situacao === "ATIVA" 
          ? colors.ATIVA 
          : situacao === "SUSPENSA" 
          ? colors.SUSPENSA 
          : ""
      }`}
    >
      {situacao}
    </Badge>
  )
}

const getPorteBadge = (porte: CompanyData["porte"]) => {
  const labels = {
    MEI: "MEI",
    ME: "ME",
    EPP: "EPP",
    MEDIA: "Média",
    GRANDE: "Grande",
  }

  return (
    <Badge variant="outline" className="text-xs transition-all hover:bg-muted">
      {labels[porte]}
    </Badge>
  )
}

export function CompanyTable({
  data,
  isLoading = false,
  onViewDetails,
  onDownloadPDF,
}: CompanyTableProps) {
  const columns = useMemo<ColumnDef<CompanyData>[]>(
    () => [
      {
        accessorKey: "cnpj",
        header: "CNPJ",
        cell: ({ row }) => (
          <span className="font-mono text-xs sm:text-sm whitespace-nowrap">
            {formatCNPJ(row.original.cnpj)}
          </span>
        ),
        size: 150,
        minSize: 150,
      },
      {
        accessorKey: "razaoSocial",
        header: "Razão Social",
        cell: ({ row }) => (
          <div className="min-w-[200px] max-w-[300px] group">
            <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
              {row.original.razaoSocial}
            </p>
            {row.original.nomeFantasia && (
              <p className="truncate text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                {row.original.nomeFantasia}
              </p>
            )}
          </div>
        ),
        size: 250,
        minSize: 200,
      },
      {
        accessorKey: "situacao",
        header: "Situação",
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {getSituacaoBadge(row.original.situacao)}
          </div>
        ),
        size: 100,
        minSize: 100,
      },
      {
        accessorKey: "porte",
        header: "Porte",
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {getPorteBadge(row.original.porte)}
          </div>
        ),
        size: 80,
        minSize: 80,
      },
      {
        accessorKey: "uf",
        header: "UF",
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <p className="text-sm font-medium">{row.original.uf}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.municipio}
            </p>
          </div>
        ),
        size: 120,
        minSize: 120,
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 transition-all hover:scale-110 hover:bg-muted"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-slideInDown">
              <DropdownMenuItem 
                onClick={() => onViewDetails?.(row.original)}
                className="transition-colors hover:bg-primary/10 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDownloadPDF?.(row.original)}
                className="transition-colors hover:bg-primary/10 cursor-pointer"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Baixar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 80,
        minSize: 80,
      },
    ],
    [onViewDetails, onDownloadPDF]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={isLoading}
      emptyMessage="Nenhuma empresa encontrada. Tente ajustar os filtros ou realizar uma nova busca."
      onRowClick={(row) => onViewDetails?.(row)}
    />
  )
}
