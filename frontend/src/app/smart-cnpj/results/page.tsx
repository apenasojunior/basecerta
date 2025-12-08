'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Filter, Download, Share2, Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSmartCNPJ } from '@/hooks/useSmartCNPJ'
import { SmartCNPJResultsSkeleton } from '@/components/smart-cnpj/SmartCNPJResultsSkeleton'
import { ExportButton } from '@/components/smart-cnpj/ExportButton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { adaptAPICompaniesToMock } from '@/lib/adapters/smart-cnpj'

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

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from URL params (run only once)
  useEffect(() => {
    if (isInitialized) return // Previne loop infinito
    
    const type = searchParams.get('type') as any
    const query = searchParams.get('q')
    
    // Capturar filtros adicionais da URL
    const uf = searchParams.get('uf')
    const situacao = searchParams.get('situacao_cadastral') || searchParams.get('situacao')
    const orderBy = searchParams.get('orderBy')
    const orderDirection = searchParams.get('orderDirection')
    const limit = searchParams.get('limit') // Capturar limit da URL
    
    console.log('[ResultsPage] URL params:', { type, query, uf, situacao, orderBy, orderDirection, limit })
    
    if (type && query) {
      // Normalizar tipo de busca (converter camelCase para snake_case)
      const normalizedType = type === 'razaoSocial' ? 'razao_social' 
        : type === 'nomeFantasia' ? 'nome_fantasia'
        : type
      
      console.log('[ResultsPage] Setting search params:', { 
        originalType: type, 
        normalizedType, 
        query 
      })
      
      setSearchType(normalizedType)
      setSearchValue(query)
      
      // Aplicar filtros da URL
      const urlFilters: any = {}
      if (uf) urlFilters.uf = uf
      if (situacao) urlFilters.situacao = situacao === 'ATIVA' ? '02' : situacao
      if (orderBy) urlFilters.orderBy = orderBy
      if (orderDirection) urlFilters.orderDirection = orderDirection
      if (limit) urlFilters.limit = parseInt(limit) // Aplicar limit dos params
      
      if (Object.keys(urlFilters).length > 0) {
        console.log('[ResultsPage] Applying URL filters:', urlFilters)
        setFilters(urlFilters)
      }
      
      // Trigger search after setting values
      setTimeout(() => {
        console.log('[ResultsPage] Triggering search...')
        handleSearch()
        setIsInitialized(true) // Marca como inicializado
      }, 100)
    }
  }, [searchParams, isInitialized])

  // Update URL when filters change
  useEffect(() => {
    if (hasSearched && searchValue) {
      const params = new URLSearchParams()
      params.set('type', searchType)
      params.set('q', searchValue)
      
      if (currentPage > 1) {
        params.set('page', String(currentPage))
      }
      
      // Add active filters to URL (filtros disponíveis na API)
      if (filters.uf) {
        params.set('uf', filters.uf)
      }
      if (filters.situacao) {
        params.set('situacao', filters.situacao)
      }
      if (filters.porte) {
        params.set('porte', filters.porte)
      }
      
      router.replace(`/smart-cnpj/results?${params.toString()}`, { scroll: false })
    }
  }, [currentPage, filters, hasSearched])

  const [showFilters, setShowFilters] = useState(false)

  // Debug: Log states
  useEffect(() => {
    console.log('[ResultsPage] States:', {
      isSearching,
      hasSearched,
      filteredResultsLength: filteredResults.length,
      searchValue,
      searchType,
    })
  }, [isSearching, hasSearched, filteredResults, searchValue, searchType])

  // Show skeleton during initial search
  if (isSearching && !hasSearched) {
    return <SmartCNPJResultsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <nav aria-label="Navegação">
            <Link href="/smart-cnpj/search">
              <Button variant="outline" size="sm" aria-label="Voltar para busca">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </Link>
          </nav>
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
        <div role="group" aria-label="Ações">
          <div className="flex items-center gap-2">
            <ExportButton
              cnpjs={filteredResults.map(r => r.cnpj)}
              variant="outline"
              size="sm"
              disabled={filteredResults.length === 0}
              showLabel={true}
            />
            <Button variant="outline" size="sm" className="hidden sm:flex" aria-label="Compartilhar resultados">
              <Share2 aria-hidden="true" className="h-4 w-4" />
              Compartilhar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
              aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              aria-pressed={showFilters}
            >
              <Filter aria-hidden="true" className="h-4 w-4" />
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary-600" aria-label={`${Object.keys(filters).length} filtros ativos`}>
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <section aria-labelledby="active-filters-heading">
          <h2 id="active-filters-heading" className="sr-only">Filtros Ativos</h2>
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter aria-hidden="true" className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-primary-900">Filtros ativos:</span>
                  
                  {filters.uf && (
                    <Badge variant="secondary" className="bg-white">
                      UF: {filters.uf}
                    </Badge>
                  )}
                  {filters.situacao && (
                    <Badge variant="secondary" className="bg-white">
                      Situação: {filters.situacao}
                    </Badge>
                  )}
                  {filters.porte && (
                    <Badge variant="secondary" className="bg-white">
                      Porte: {filters.porte}
                    </Badge>
                  )}
                  {filters.natureza_juridica && (
                    <Badge variant="secondary" className="bg-white">
                      Natureza: {filters.natureza_juridica}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-primary-700 hover:text-primary-800 hover:bg-primary-100"
                  aria-label="Limpar todos os filtros"
                >
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Loading State */}
      {isSearching && (
        <section aria-live="polite" aria-busy="true">
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 aria-hidden="true" className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Buscando empresas...</p>
              <p className="text-sm text-gray-600">Isso pode levar alguns segundos</p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Results Grid - Show when not searching and has results */}
      {!isSearching && filteredResults.length > 0 && (
        <main role="main">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ minHeight: '600px' }}>
            {/* Filter Panel - Desktop */}
            <aside aria-label="Filtros de busca" className="hidden lg:block">
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
            </aside>

            {/* Filter Panel - Mobile */}
            {showFilters && (
              <aside aria-label="Filtros de busca" className="lg:hidden">
                <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    resultsCount={filteredResults.length}
                  />
                </Suspense>
              </aside>
            )}

            {/* Results List */}
            <section aria-labelledby="results-heading" className="lg:col-span-3 relative">
              <h2 id="results-heading" className="sr-only">Lista de Resultados</h2>
              
              {/* Loading overlay para navegação de páginas */}
              {isSearching && hasSearched && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg shadow-lg border">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <p className="text-sm font-medium text-gray-700">Carregando resultados...</p>
                  </div>
                </div>
              )}
              
              <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
                <ResultsList
                  companies={adaptAPICompaniesToMock(paginatedResults)}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={goToPage}
                  from="results"
                />
              </Suspense>
            </section>
          </div>
        </main>
      )}

      {/* No Results Found */}
      {!isSearching && hasSearched && filteredResults.length === 0 && (
        <section aria-live="polite">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4" aria-hidden="true">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Tente ajustar seus filtros ou fazer uma nova busca.
              </p>
              <Link href="/smart-cnpj/search">
                <Button aria-label="Fazer nova busca">
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Nova Busca
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}

export default function SmartCNPJResultsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </ErrorBoundary>
  )
}
