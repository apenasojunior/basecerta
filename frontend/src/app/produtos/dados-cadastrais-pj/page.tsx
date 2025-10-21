"use client"

import { useState, useEffect } from "react"
import { Building2, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { CompanySearchForm } from "@/components/produtos/CompanySearchForm"
import { CompanyFilters, type CompanyFilters as CompanyFiltersType } from "@/components/produtos/CompanyFilters"
import { CompanyTable } from "@/components/produtos/CompanyTable"
import { useCompanySearch } from "@/hooks/useCompanySearch"
import { toast } from "@/lib/toast"

export default function DadosCadastraisPJPage() {
  const [filters, setFilters] = useState<CompanyFiltersType>({})
  const { search, data, isLoading, isSuccess, isError, error, reset } = useCompanySearch()

  const handleSearch = (formData: { searchType: string; searchValue: string }) => {
    // Mapeia os tipos do formulário para o formato esperado pela API
    const searchTypeMap: Record<string, "CNPJ" | "RAZAO_SOCIAL" | "NOME_FANTASIA"> = {
      cnpj: "CNPJ",
      razaoSocial: "RAZAO_SOCIAL",
      nomeFantasia: "NOME_FANTASIA",
    }

    const mappedType = searchTypeMap[formData.searchType] || "CNPJ"

    search({
      searchType: mappedType,
      searchValue: formData.searchValue,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })
  }

  const handleApplyFilters = () => {
    const activeCount = Object.values(filters).filter(Boolean).length
    if (activeCount > 0) {
      toast.success(`${activeCount} filtro(s) aplicado(s)`)
    }
  }

  // Mostra erro se houver
  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : "Erro ao buscar empresas")
    }
  }, [isError, error])

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Produtos</span>
          <span>/</span>
          <span>Dados Cadastrais</span>
          <span>/</span>
          <span className="text-foreground font-medium">Pessoa Jurídica</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Building2 className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dados Cadastrais - Pessoa Jurídica</h1>
            <p className="text-muted-foreground">
              Consulte informações cadastrais completas de empresas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filtros (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </CardTitle>
              <CardDescription>
                Refine sua busca com filtros específicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyFilters
                filters={filters}
                onChange={setFilters}
                onApply={handleApplyFilters}
              />
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Search Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Pessoa Jurídica
              </CardTitle>
              <CardDescription>
                Pesquise por CNPJ, Razão Social, Nome Fantasia ou outros dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanySearchForm onSearch={handleSearch} isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Results Area */}
          {!isSuccess ? (
            <EmptyState
              icon={Building2}
              title="Nenhuma busca realizada"
              description="Use o formulário acima para buscar informações de uma empresa por CNPJ, Razão Social ou Nome Fantasia."
              variant="no-data"
              withCard
              iconSize="lg"
            >
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  💡 Dicas de busca:
                </h4>
                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1 list-disc list-inside">
                  <li>Para buscar por CNPJ, digite apenas os números</li>
                  <li>Para buscar por nome, digite pelo menos 3 caracteres</li>
                  <li>Use os filtros laterais para refinar os resultados</li>
                  <li>Pesquise por Inscrição Estadual, Email ou Telefone</li>
                </ul>
              </div>
            </EmptyState>
          ) : (
            <CompanyTable 
              data={data?.data || []}
              isLoading={isLoading}
              onViewDetails={(cnpj) => toast.info(`Ver detalhes: ${cnpj}`)}
            />
          )}
        </main>
      </div>

      {/* Mobile Filters Button - Legacy, not implemented yet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0 bg-orange-600 hover:bg-orange-700"
          onClick={() => toast.info("Filtros mobile em breve")}
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
