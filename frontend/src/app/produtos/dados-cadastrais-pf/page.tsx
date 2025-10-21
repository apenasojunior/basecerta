"use client"

import { useState } from "react"
import { User, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { PersonSearchForm } from "@/components/produtos/PersonSearchForm"
import { PersonFilters } from "@/components/produtos/PersonFilters"
import { PersonTable } from "@/components/produtos/PersonTable"
import { MobileFilters } from "@/components/produtos/MobileFilters"
import type { PersonTableData, PersonSearchFilters } from "@/types/person"
import { usePersonSearch } from "@/hooks/usePersonSearch"
import { toast } from "@/lib/toast"

export default function DadosCadastraisPFPage() {
  const [searchParams, setSearchParams] = useState<{
    searchType: "cpf" | "nome"
    searchValue: string
  } | null>(null)
  const [filters, setFilters] = useState<PersonSearchFilters>({})

  // React Query para buscar pessoas
  const { data: searchResult, isLoading, error } = usePersonSearch({
    searchType: searchParams?.searchType || "cpf",
    searchValue: searchParams?.searchValue || "",
    filters,
    enabled: !!searchParams,
  })

  const handleSearch = (data: { searchType: string; searchValue: string }) => {
    setSearchParams({
      searchType: data.searchType as "cpf" | "nome",
      searchValue: data.searchValue,
    })
  }

  const handleApplyFilters = () => {
    const activeCount = Object.values(filters).filter(Boolean).length
    if (activeCount > 0) {
      toast.success(`${activeCount} filtro(s) aplicado(s)`)
    }
  }

  // Converter dados da API para formato da tabela
  const tableData: PersonTableData[] = searchResult?.data.map(person => ({
    id: person.id,
    cpf: person.cpf,
    nomeCompleto: person.nomeCompleto,
    idade: person.idade,
    sexo: person.sexo,
    uf: person.uf,
    municipio: person.municipio,
    status: person.status,
  })) || []

  // Mostrar toast de sucesso quando busca retornar resultados
  if (searchResult && searchParams) {
    const count = searchResult.total
    if (count === 0) {
      toast.info("Nenhum resultado encontrado")
    }
  }

  // Mostrar toast de erro quando houver erro
  if (error) {
    toast.error("Erro ao realizar busca. Tente novamente.")
  }

  const hasSearched = !!searchParams

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Produtos</span>
          <span>/</span>
          <span>Dados Cadastrais</span>
          <span>/</span>
          <span className="text-foreground font-medium">Pessoa Física</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dados Cadastrais - Pessoa Física</h1>
            <p className="text-muted-foreground">
              Consulte informações cadastrais completas de pessoas físicas
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
              <PersonFilters
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
                Buscar Pessoa Física
              </CardTitle>
              <CardDescription>
                Pesquise por CPF ou Nome completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonSearchForm onSearch={handleSearch} isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Results Area */}
          {!hasSearched ? (
            <EmptyState
              icon={User}
              title="Nenhuma busca realizada"
              description="Use o formulário acima para buscar informações de uma pessoa física por CPF ou nome."
              variant="no-data"
              withCard
              iconSize="lg"
            >
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Dicas de busca:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Para buscar por CPF, digite apenas os números</li>
                  <li>Para buscar por nome, digite pelo menos 3 caracteres</li>
                  <li>Use os filtros laterais para refinar os resultados</li>
                </ul>
              </div>
            </EmptyState>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>
                  {isLoading 
                    ? "Buscando..." 
                    : error 
                    ? "Erro ao buscar resultados" 
                    : `${searchResult?.total || 0} pessoa(s) encontrada(s)`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Erro ao buscar resultados. Tente novamente.</p>
                  </div>
                ) : (
                  <PersonTable data={tableData} isLoading={isLoading} />
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Mobile Filters Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <MobileFilters
          type="person"
          filters={filters}
          onChange={setFilters}
          onApply={handleApplyFilters}
        />
      </div>
    </div>
  )
}
