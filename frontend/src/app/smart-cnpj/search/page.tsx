'use client'

import { lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSmartCNPJ, useSmartCNPJEstatisticas } from '@/hooks/useSmartCNPJ'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Search, TrendingUp, Users, MapPin, Loader2 } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Lazy load components para reduzir TBT
const SearchForm = lazy(() => import('@/components/smart-cnpj/SearchForm').then(mod => ({ default: mod.SearchForm })))
const FilterPanel = lazy(() => import('@/components/smart-cnpj/FilterPanel').then(mod => ({ default: mod.FilterPanel })))

export default function SmartCNPJSearchPage() {
  const router = useRouter()
  const {
    searchType,
    searchValue,
    setSearchType,
    setSearchValue,
    handleSearch: performSearch,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    filteredResults,
    hasSearched,
    isSearching,
  } = useSmartCNPJ()

  // Buscar estatísticas do backend
  const { data: stats, isLoading: statsLoading } = useSmartCNPJEstatisticas()

  // Redirecionar para página de resultados após busca
  const handleSearch = () => {
    performSearch()
    // Simular delay e redirecionar
    setTimeout(() => {
      router.push(`/smart-cnpj/results?type=${searchType}&q=${encodeURIComponent(searchValue)}`)
    }, 600)
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Smart CNPJ 360°
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Pesquise empresas por CNPJ, razão social, sócios, segmento e muito mais
              </p>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Buscas */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                {statsLoading ? (
                  <>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_buscas || 0}</p>
                    <p className="text-xs text-gray-600">Buscas Realizadas</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empresas Únicas */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                {statsLoading ? (
                  <>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{stats?.empresas_unicas || 0}</p>
                    <p className="text-xs text-gray-600">Empresas Únicas</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buscas Hoje */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                {statsLoading ? (
                  <>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{stats?.buscas_por_periodo?.hoje || 0}</p>
                    <p className="text-xs text-gray-600">Buscas Hoje</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tempo Médio */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                {statsLoading ? (
                  <>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.tempo_medio_resposta ? `${stats.tempo_medio_resposta.toFixed(0)}ms` : '-'}
                    </p>
                    <p className="text-xs text-gray-600">Tempo Médio</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Form - 2 colunas */}
        <div className="lg:col-span-2">
          <Suspense fallback={
            <div className="space-y-4 p-6 bg-white rounded-lg border">
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          }>
            <SearchForm
              searchType={searchType}
              searchValue={searchValue}
              onSearchTypeChange={setSearchType}
              onSearchValueChange={setSearchValue}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </Suspense>

          {/* Dicas de Busca */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary-600" />
                Dicas de Busca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  💡 Dica
                </Badge>
                <p className="text-sm text-gray-700">
                  Use <strong>7 tipos de busca</strong> diferentes: CNPJ, Razão Social, Segmento, E-mail, Telefone, Nome do Sócio ou CEP
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  🎯 Precisão
                </Badge>
                <p className="text-sm text-gray-700">
                  Combine sua busca com os <strong>8 filtros avançados</strong> ao lado para resultados mais precisos
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  ⚡ Rapidez
                </Badge>
                <p className="text-sm text-gray-700">
                  Buscar por <strong>CNPJ é o método mais rápido</strong> e retorna resultados exatos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Panel - 1 coluna */}
        <div>
          <Suspense fallback={
            <div className="p-6 bg-white rounded-lg border">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              resultsCount={hasSearched ? filteredResults.length : undefined}
            />
          </Suspense>
        </div>
      </div>

      {/* Exemplos de Buscas Populares */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buscas Populares</CardTitle>
          <CardDescription>
            Experimente alguns exemplos de buscas frequentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
              onClick={() => {
                setSearchType('segmento')
                setSearchValue('Desenvolvimento de programas de computador')
              }}
            >
              💻 Tecnologia
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
              onClick={() => {
                setSearchType('segmento')
                setSearchValue('Restaurantes e similares')
              }}
            >
              🍽️ Restaurantes
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
              onClick={() => {
                setSearchType('segmento')
                setSearchValue('Comércio varejista')
              }}
            >
              🛒 Varejo
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
              onClick={() => {
                setSearchType('segmento')
                setSearchValue('Consultoria em gestão')
              }}
            >
              💼 Consultoria
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
              onClick={() => {
                setFilters({ ...filters, porte: 'MEI' })
              }}
            >
              ⭐ MEI
            </Badge>
          </div>
        </CardContent>
      </Card>
      </div>
    </ErrorBoundary>
  )
}
