"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CompanyData } from "@/components/produtos/CompanyTable"
import {
  comparisonFields,
  getHighlightClass,
  getHighlightIcon,
  prepareComparisonExport,
  HighlightType,
} from "@/lib/utils/comparison"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, Trash2, Plus, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { ExportModal } from "@/components/produtos/ExportModal"

// Mock de dados para exemplo (em produção, viria da API)
const mockCompanies: CompanyData[] = [
  {
    cnpj: "12.345.678/0001-90",
    razaoSocial: "Tech Solutions Ltda",
    nomeFantasia: "TechSol",
    situacao: "ATIVA",
    porte: "EPP",
    uf: "SP",
    municipio: "São Paulo",
    dataAbertura: "2015-03-15",
  },
  {
    cnpj: "98.765.432/0001-10",
    razaoSocial: "Digital Services S/A",
    nomeFantasia: "DigiServ",
    situacao: "ATIVA",
    porte: "MEDIA",
    uf: "RJ",
    municipio: "Rio de Janeiro",
    dataAbertura: "2010-07-22",
  },
  {
    cnpj: "11.222.333/0001-44",
    razaoSocial: "Inovação e Tecnologia ME",
    nomeFantasia: "InovaTech",
    situacao: "SUSPENSA",
    porte: "ME",
    uf: "MG",
    municipio: "Belo Horizonte",
    dataAbertura: "2020-01-10",
  },
  {
    cnpj: "55.666.777/0001-88",
    razaoSocial: "Global Tech Corporation",
    nomeFantasia: "",
    situacao: "ATIVA",
    porte: "GRANDE",
    uf: "SP",
    municipio: "Campinas",
    dataAbertura: "2005-11-30",
  },
]

export default function CompararPage() {
  const router = useRouter()
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [exportModalOpen, setExportModalOpen] = useState(false)

  // Filtra empresas disponíveis (não selecionadas)
  const availableCompanies = useMemo(() => {
    return mockCompanies.filter(
      (company) => !selectedCompanies.find((c) => c.cnpj === company.cnpj)
    )
  }, [selectedCompanies])

  // Filtra empresas por busca
  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return availableCompanies

    const term = searchTerm.toLowerCase()
    return availableCompanies.filter(
      (company) =>
        company.cnpj.toLowerCase().includes(term) ||
        company.razaoSocial.toLowerCase().includes(term) ||
        company.nomeFantasia?.toLowerCase().includes(term)
    )
  }, [availableCompanies, searchTerm])

  // Adiciona empresa
  const handleAddCompany = (company: CompanyData) => {
    if (selectedCompanies.length >= 3) {
      toast.error("Máximo de 3 empresas para comparação")
      return
    }

    setSelectedCompanies([...selectedCompanies, company])
    setSearchTerm("")
    toast.success(`${company.razaoSocial} adicionada`)
  }

  // Remove empresa
  const handleRemoveCompany = (cnpj: string) => {
    const company = selectedCompanies.find((c) => c.cnpj === cnpj)
    setSelectedCompanies(selectedCompanies.filter((c) => c.cnpj !== cnpj))
    toast.info(`${company?.razaoSocial} removida`)
  }

  // Limpa todas
  const handleClearAll = () => {
    setSelectedCompanies([])
    toast.info("Comparação limpa")
  }

  // Exporta comparação
  const handleExport = () => {
    if (selectedCompanies.length < 2) {
      toast.warning("Adicione pelo menos 2 empresas para exportar")
      return
    }

    setExportModalOpen(true)
  }

  // Calcula highlights para cada campo
  const highlights = useMemo(() => {
    if (selectedCompanies.length < 2) return {}

    const result: Record<string, HighlightType[]> = {}

    comparisonFields.forEach((field) => {
      if (field.highlight) {
        const values = selectedCompanies.map((c) => c[field.key])
        result[field.key] = field.highlight(values, selectedCompanies)
      } else {
        result[field.key] = selectedCompanies.map(() => "neutral" as HighlightType)
      }
    })

    return result
  }, [selectedCompanies])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Comparador de Empresas</h1>
            <p className="text-muted-foreground mt-1">
              Compare até 3 empresas lado a lado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedCompanies.length >= 2 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Seleção de Empresas */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Adicionar Empresas ({selectedCompanies.length}/3)
        </h2>

        {/* Empresas Selecionadas */}
        {selectedCompanies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCompanies.map((company) => (
              <Badge
                key={company.cnpj}
                variant="secondary"
                className="py-2 px-3 text-sm"
              >
                {company.razaoSocial} - {company.cnpj}
                <button
                  onClick={() => handleRemoveCompany(company.cnpj)}
                  className="ml-2 hover:text-destructive"
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Busca */}
        {selectedCompanies.length < 3 && (
          <>
            <Input
              placeholder="Buscar por CNPJ, Razão Social ou Nome Fantasia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            {/* Lista de Empresas Disponíveis */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCompanies.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {searchTerm
                    ? "Nenhuma empresa encontrada"
                    : "Todas as empresas foram adicionadas"}
                </p>
              ) : (
                filteredCompanies.map((company) => (
                  <div
                    key={company.cnpj}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleAddCompany(company)}
                  >
                    <div>
                      <p className="font-medium">{company.razaoSocial}</p>
                      <p className="text-sm text-muted-foreground">
                        {company.cnpj}
                        {company.nomeFantasia && ` • ${company.nomeFantasia}`}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </Card>

      {/* Comparação */}
      {selectedCompanies.length === 0 && (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma empresa selecionada
          </h3>
          <p className="text-muted-foreground">
            Adicione pelo menos 2 empresas para começar a comparação
          </p>
        </Card>
      )}

      {selectedCompanies.length === 1 && (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Adicione mais uma empresa
          </h3>
          <p className="text-muted-foreground">
            Você precisa de pelo menos 2 empresas para comparar
          </p>
        </Card>
      )}

      {selectedCompanies.length >= 2 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10">
                    Campo
                  </th>
                  {selectedCompanies.map((company, idx) => (
                    <th
                      key={company.cnpj}
                      className="text-left p-4 font-semibold min-w-[300px]"
                    >
                      <div>
                        <p className="text-sm font-normal text-muted-foreground mb-1">
                          Empresa {idx + 1}
                        </p>
                        <p className="font-semibold">{company.razaoSocial}</p>
                        {company.nomeFantasia && (
                          <p className="text-sm font-normal text-muted-foreground">
                            {company.nomeFantasia}
                          </p>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field, fieldIdx) => (
                  <tr
                    key={field.key}
                    className={fieldIdx % 2 === 0 ? "bg-muted/20" : ""}
                  >
                    <td className="p-4 font-medium border-r sticky left-0 bg-background z-10">
                      {field.label}
                    </td>
                    {selectedCompanies.map((company, companyIdx) => {
                      const value = company[field.key]
                      const formatted = field.format
                        ? field.format(value, company)
                        : value
                      const highlightType =
                        highlights[field.key]?.[companyIdx] || "neutral"
                      const icon = getHighlightIcon(highlightType)

                      return (
                        <td
                          key={`${company.cnpj}-${field.key}`}
                          className={`p-4 border transition-colors ${getHighlightClass(
                            highlightType
                          )}`}
                        >
                          <div className="flex items-center gap-2">
                            {icon && (
                              <span className="text-lg font-bold">{icon}</span>
                            )}
                            <span>{formatted}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Legenda */}
      {selectedCompanies.length >= 2 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Legenda de Cores</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
              <span>✓ Melhor valor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-300"></div>
              <span>⚠ Atenção necessária</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
              <span>✗ Pior valor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
              <span>Neutro</span>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Exportação */}
      {selectedCompanies.length >= 2 && (
        <ExportModal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          title="Exportar Comparação"
          data={prepareComparisonExport(selectedCompanies)}
          availableFields={[
            { id: "campo", label: "Campo" },
            ...selectedCompanies.map((c, idx) => ({
              id: `empresa${idx + 1}`,
              label: `Empresa ${idx + 1}`,
            })),
          ]}
          filename={`comparacao_empresas_${new Date().toISOString().split("T")[0]}`}
        />
      )}
    </div>
  )
}
