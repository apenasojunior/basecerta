'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Filter, Download, Share2, Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSmartCNPJ } from '@/hooks/useSmartCNPJ'
import { SmartCNPJResultsSkeleton } from '@/components/smart-cnpj/SmartCNPJResultsSkeleton'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Lazy load heavy components
const ResultsList = lazy(() => import('@/components/smart-cnpj/ResultsList').then(mod => ({ default: mod.ResultsList })))
const FilterPanel = lazy(() => import('@/components/smart-cnpj/FilterPanel').then(mod => ({ default: mod.FilterPanel })))

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const {
    searchType,
    searchValue,
    setSearchType,
    setSearchValue,
    handleSearch,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    paginatedResults,
    filteredResults,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    isSearching,
    hasSearched,
  } = useSmartCNPJ()

  // Initialize from URL params
  useEffect(() => {
    const type = searchParams.get('type') as any
    const query = searchParams.get('q')
    
    if (type && query) {
      setSearchType(type)
      setSearchValue(query)
      
      // Trigger search after setting values
      setTimeout(() => {
        handleSearch()
      }, 100)
    }
  }, [searchParams])

  // Update URL when filters change
  useEffect(() => {
    if (hasSearched && searchValue) {
      const params = new URLSearchParams()
      params.set('type', searchType)
      params.set('q', searchValue)
      
      if (currentPage > 1) {
        params.set('page', String(currentPage))
      }
      
      // Add active filters to URL
      if (filters.situacaoCadastral && filters.situacaoCadastral.length > 0) {
        params.set('situacao', filters.situacaoCadastral.join(','))
      }
      if (filters.tipo) {
        params.set('tipo', filters.tipo)
      }
      if (filters.porte && filters.porte.length > 0) {
        params.set('porte', filters.porte.join(','))
      }
      
      router.replace(`/smart-cnpj/results?${params.toString()}`, { scroll: false })
    }
  }, [currentPage, filters, hasSearched])

  const [showFilters, setShowFilters] = useState(false)

  // Show skeleton during initial search
  if (isSearching && !hasSearched) {
    return <SmartCNPJResultsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/smart-cnpj/search">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Resultados da Busca
            </h1>
            {hasSearched && (
              <p className="text-sm text-gray-600 mt-1">
                {filteredResults.length} {filteredResults.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
                {searchValue && ` para "${searchValue}"`}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary-600">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <span className="text-sm font-medium text-primary-900">Filtros ativos:</span>
                
                {filters.situacaoCadastral && filters.situacaoCadastral.length > 0 && (
                  <Badge variant="secondary" className="bg-white">
                    Situação: {filters.situacaoCadastral.length}
                  </Badge>
                )}
                {filters.tipo && (
                  <Badge variant="secondary" className="bg-white">
                    Tipo: {filters.tipo}
                  </Badge>
                )}
                {filters.porte && filters.porte.length > 0 && (
                  <Badge variant="secondary" className="bg-white">
                    Porte: {filters.porte.length}
                  </Badge>
                )}
                {filters.isMEI && (
                  <Badge variant="secondary" className="bg-white">
                    Apenas MEI
                  </Badge>
                )}
                {filters.isSimplesNacional && (
                  <Badge variant="secondary" className="bg-white">
                    Simples Nacional
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-primary-700 hover:text-primary-800 hover:bg-primary-100"
              >
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSearching && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Buscando empresas...</p>
            <p className="text-sm text-gray-600">Isso pode levar alguns segundos</p>
          </CardContent>
        </Card>
      )}

      {/* Results Grid - Show when not searching and has results */}
      {!isSearching && filteredResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ minHeight: '600px' }}>
          {/* Filter Panel - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                  resultsCount={filteredResults.length}
                />
              </Suspense>
            </div>
          </div>

          {/* Filter Panel - Mobile */}
          {showFilters && (
            <div className="lg:hidden">
              <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                  resultsCount={filteredResults.length}
                />
              </Suspense>
            </div>
          )}

          {/* Results List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
              <ResultsList
                companies={paginatedResults}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
                from="results"
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* No Results Found */}
      {!isSearching && hasSearched && filteredResults.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Tente ajustar seus filtros ou fazer uma nova busca.
            </p>
            <Link href="/smart-cnpj/search">
              <Button>
                <ArrowLeft className="h-4 w-4" />
                Nova Busca
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SmartCNPJResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
