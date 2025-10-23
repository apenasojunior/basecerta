'use client'

import { useRouter } from 'next/navigation'
import { useSmartCNPJ } from '@/hooks/useSmartCNPJ'
import { SearchForm } from '@/components/smart-cnpj/SearchForm'
import { FilterPanel } from '@/components/smart-cnpj/FilterPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Search, TrendingUp, Users, MapPin } from 'lucide-react'

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

  // Redirecionar para página de resultados após busca
  const handleSearch = () => {
    performSearch()
    // Simular delay e redirecionar
    setTimeout(() => {
      router.push(`/smart-cnpj/results?type=${searchType}&q=${encodeURIComponent(searchValue)}`)
    }, 600)
  }

  return (
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100</p>
                <p className="text-xs text-gray-600">Empresas Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">78%</p>
                <p className="text-xs text-gray-600">Empresas Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">250+</p>
                <p className="text-xs text-gray-600">Sócios Cadastrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">20</p>
                <p className="text-xs text-gray-600">Estados Cobertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Form - 2 colunas */}
        <div className="lg:col-span-2">
          <SearchForm
            searchType={searchType}
            searchValue={searchValue}
            onSearchTypeChange={setSearchType}
            onSearchValueChange={setSearchValue}
            onSearch={handleSearch}
            isSearching={isSearching}
          />

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
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            resultsCount={hasSearched ? filteredResults.length : undefined}
          />
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
                setFilters({ ...filters, porte: ['MEI'] })
              }}
            >
              ⭐ MEI
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
