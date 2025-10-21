"use client"

import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, FileDown, MoreVertical, Download } from "lucide-react"
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
import { ExportModal, type ExportField } from "./ExportModal"
import { FavoriteButton } from "./FavoriteButton"

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
  const [exportOpen, setExportOpen] = useState(false)

  const exportFields: ExportField[] = [
    { id: "cnpj", label: "CNPJ", enabled: true },
    { id: "razaoSocial", label: "Razão Social", enabled: true },
    { id: "nomeFantasia", label: "Nome Fantasia", enabled: true },
    { id: "situacao", label: "Situação", enabled: true },
    { id: "porte", label: "Porte", enabled: true },
    { id: "uf", label: "UF", enabled: true },
    { id: "municipio", label: "Município", enabled: true },
    { id: "dataAbertura", label: "Data Abertura", enabled: false },
  ]

  // Prepara dados para exportação (formata valores)
  const exportData = useMemo(() => {
    const situacaoLabels = {
      ATIVA: "Ativa",
      SUSPENSA: "Suspensa",
      INAPTA: "Inapta",
      BAIXADA: "Baixada",
      NULA: "Nula",
    }
    
    const porteLabels = {
      MEI: "MEI",
      ME: "ME",
      EPP: "EPP",
      MEDIA: "Média",
      GRANDE: "Grande",
    }

    return data.map(company => ({
      cnpj: formatCNPJ(company.cnpj),
      razaoSocial: company.razaoSocial,
      nomeFantasia: company.nomeFantasia || "-",
      situacao: situacaoLabels[company.situacao],
      porte: porteLabels[company.porte],
      uf: company.uf,
      municipio: company.municipio,
      dataAbertura: company.dataAbertura || "-",
    }))
  }, [data])

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
        cell: ({ row }) => {
          const company = row.original
          return (
            <div className="flex items-center gap-2">
              <FavoriteButton
                item={{
                  id: company.cnpj,
                  type: "PJ",
                  document: company.cnpj,
                  name: company.razaoSocial,
                  metadata: {
                    uf: company.uf,
                    municipio: company.municipio,
                  },
                }}
                size="icon"
              />
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
                    onClick={() => onViewDetails?.(company)}
                    className="transition-colors hover:bg-primary/10 cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDownloadPDF?.(company)}
                    className="transition-colors hover:bg-primary/10 cursor-pointer"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        size: 120,
        minSize: 120,
      },
    ],
    [onViewDetails, onDownloadPDF]
  )

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

      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        emptyMessage="Nenhuma empresa encontrada. Tente ajustar os filtros ou realizar uma nova busca."
        onRowClick={(row) => onViewDetails?.(row)}
      />

      {/* Modal de exportação */}
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Dados Cadastrais PJ"
        data={exportData}
        availableFields={exportFields}
        filename="dados-cadastrais-pj"
      />
    </div>
  )
}
