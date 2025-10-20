"use client"

import { useState } from "react"
import { Building2, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CompanySearchForm } from "@/components/produtos/CompanySearchForm"
import { AdvancedFilters, type CompanyFilters } from "@/components/produtos/AdvancedFilters"
import { MobileFilters } from "@/components/produtos/MobileFilters"
import { CompanyTable, type CompanyData } from "@/components/produtos/CompanyTable"
import { useCompanySearch } from "@/hooks/useCompanySearch"
import { toast } from "@/lib/toast"

export default function DadosEmpresasPage() {
  const [filters, setFilters] = useState<CompanyFilters>({})
  const [hasSearched, setHasSearched] = useState(false)
  
  const {
    search,
    data: searchResponse,
    isLoading,
    isError,
    reset,
  } = useCompanySearch()

  const results = searchResponse?.data || []
  const totalResults = searchResponse?.total || 0

  const handleSearch = async (data: {
    searchType: "CNPJ" | "RAZAO_SOCIAL" | "NOME_FANTASIA"
    searchValue: string
  }) => {
    console.log("Buscando:", data)
    console.log("Com filtros:", filters)
    setHasSearched(true)
    
    search({
      searchType: data.searchType,
      searchValue: data.searchValue,
      filters,
    })
  }

  const handleApplyFilters = () => {
    console.log("Aplicando filtros:", filters)
    toast.info("Filtros aplicados. Realize uma nova busca para ver os resultados.")
  }

  const handleClearFilters = () => {
    setFilters({})
    toast.info("Filtros limpos.")
  }

  const handleViewDetails = (company: CompanyData) => {
    console.log("Ver detalhes:", company)
    toast.info(`Detalhes de ${company.razaoSocial}`)
  }

  const handleDownloadPDF = (company: CompanyData) => {
    console.log("Download PDF:", company)
    toast.success("PDF será baixado em breve...")
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            Dados de Empresas
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm md:text-base">
            Consulte informações cadastrais de empresas brasileiras
          </p>
        </div>
        <div className="hidden rounded-lg bg-primary/10 p-3 md:block transition-all hover:bg-primary/20 hover:scale-105">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar - Filtros Desktop */}
        <aside className="hidden space-y-4 lg:block">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </aside>

        {/* Main Area */}
        <main className="space-y-4 sm:space-y-6">
          {/* Mobile Filters */}
          <MobileFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />

          {/* Search Form */}
          <CompanySearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Results Area */}
          {hasSearched && (
            <Card className="animate-slideInDown">
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold sm:text-base">
                    Resultados {totalResults > 0 && `(${totalResults})`}
                  </h3>
                  {totalResults > 0 && (
                    <div className="text-xs text-muted-foreground animate-fadeIn">
                      {isLoading ? "Carregando..." : `${totalResults} encontrada(s)`}
                    </div>
                  )}
                </div>
                {/* Wrapper com scroll horizontal para mobile */}
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <CompanyTable
                    data={results}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onDownloadPDF={handleDownloadPDF}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Empty State Inicial */}
          {!hasSearched && (
            <Card className="p-6 sm:p-8 md:p-12 animate-fadeIn">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-muted p-4 sm:p-6 transition-all hover:scale-110 hover:bg-primary/10">
                  <FileText className="h-8 w-8 text-muted-foreground sm:h-12 sm:w-12 transition-colors hover:text-primary" />
                </div>
                <h3 className="mb-2 text-base font-semibold sm:text-lg">
                  Comece sua pesquisa
                </h3>
                <p className="mb-6 max-w-md text-xs text-muted-foreground sm:text-sm">
                  Digite um CNPJ ou razão social no campo acima para buscar
                  informações detalhadas sobre empresas brasileiras.
                </p>
                <div className="flex flex-col gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3 group">
                    <div className="h-2 w-2 rounded-full bg-primary transition-all group-hover:scale-150" />
                    <span className="transition-colors group-hover:text-foreground">
                      Consulta em tempo real
                    </span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="h-2 w-2 rounded-full bg-primary transition-all group-hover:scale-150" />
                    <span className="transition-colors group-hover:text-foreground">
                      Dados atualizados
                    </span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="h-2 w-2 rounded-full bg-primary transition-all group-hover:scale-150" />
                    <span className="transition-colors group-hover:text-foreground">
                      Informações completas
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
