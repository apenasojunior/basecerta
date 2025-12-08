/**
 * Hook useSmartCNPJ - Integração com API Real
 * Issue 2.2.4 - Refatoração para usar smartCNPJService
 * 
 * Removido: Todas as dependências de mock data
 * Adicionado: Integração com React Query e smartCNPJService
 */

import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { smartCNPJService } from '@/lib/api'
import type {
  SmartCNPJCompanyAPI,
  TipoBusca,
  SmartCNPJFiltros,
  SmartCNPJSearchResponse,
  SmartCNPJHistoricoResponse,
  SmartCNPJEstatisticas,
} from '@/types/smart-cnpj'

export type SearchType = TipoBusca

/**
 * Filtros de busca (compatível com backend)
 */
export interface SearchFilters extends SmartCNPJFiltros {
  // Mantém compatibilidade com interface anterior
}

/**
 * Retorno do hook useSmartCNPJ
 */
export interface UseSmartCNPJReturn {
  // Search
  searchType: SearchType
  searchValue: string
  setSearchType: (type: SearchType) => void
  setSearchValue: (value: string) => void
  handleSearch: () => void
  
  // Filters
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  
  // Results (API data)
  results: SmartCNPJCompanyAPI[]
  filteredResults: SmartCNPJCompanyAPI[]
  searchResponse: SmartCNPJSearchResponse | null
  isSearching: boolean
  hasSearched: boolean
  error: Error | null
  
  // Pagination
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  isEstimate: boolean  // Se total é estimado (LIMIT+1) ou exato
  paginatedResults: SmartCNPJCompanyAPI[]
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  hasNextPage: boolean
  hasPrevPage: boolean
  
  // Utils
  getCompany: (cnpj: string) => Promise<SmartCNPJCompanyAPI>
  reset: () => void
  refetch: () => void
}

const ITEMS_PER_PAGE = 20

/**
 * Hook principal do Smart CNPJ 360° 
 * Integrado com API real via smartCNPJService
 */
export function useSmartCNPJ(): UseSmartCNPJReturn {
  const queryClient = useQueryClient()
  
  // Search state
  const [searchType, setSearchType] = useState<SearchType>('cnpj')
  const [searchValue, setSearchValue] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  
  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({})
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  
  // Search response state (from API)
  const [searchResponse, setSearchResponse] = useState<SmartCNPJSearchResponse | null>(null)

  // Mutation para busca (POST /bulk)
  const searchMutation = useMutation({
    mutationFn: async () => {
      if (!searchValue.trim()) {
        throw new Error('Valor de busca é obrigatório')
      }

      console.log('[useSmartCNPJ] Iniciando busca:', {
        searchType,
        searchValue,
        filters,
        currentPage,
      })

      return smartCNPJService.search(
        searchType,
        searchValue,
        filters,
        {
          page: currentPage,
          limit: filters.limit || ITEMS_PER_PAGE, // Respeita o limit dos filtros ou usa default
        }
      )
    },
    onSuccess: (data) => {
      console.log('[useSmartCNPJ] Dados recebidos (raw):', data)
      console.log('[useSmartCNPJ] Busca bem-sucedida:', {
        total: data?.pagination?.total,
        results: data?.data?.length,
      })
      setSearchResponse(data)
      setHasSearched(true)
    },
    onError: (error) => {
      console.error('[useSmartCNPJ] Erro na busca:', error)
      setSearchResponse(null)
    },
  })

  // Perform search
  const handleSearch = useCallback(() => {
    console.log('[useSmartCNPJ] handleSearch chamado')
    setCurrentPage(1) // Reset to first page
    searchMutation.mutate()
  }, [searchMutation])

  // Results from API
  const results = useMemo(() => {
    return searchResponse?.data || []
  }, [searchResponse])

  // Filtered results (client-side filtering if needed)
  const filteredResults = useMemo(() => {
    // A API já retorna dados filtrados, mas mantemos para compatibilidade
    return results
  }, [results])

  // Pagination info from API
  const totalPages = searchResponse?.pagination.totalPages || 0
  const totalItems = searchResponse?.pagination.total || 0
  const hasNextPage = searchResponse?.pagination.hasNext || false
  const hasPrevPage = searchResponse?.pagination.hasPrev || false
  const isEstimate = searchResponse?.pagination.isEstimate ?? true  // Default true (LIMIT+1)

  // Paginated results (já vem paginado da API)
  const paginatedResults = useMemo(() => {
    return results
  }, [results])

  // Check if has active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== null
    })
  }, [filters])

  // Pagination functions
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
      
      // Re-fetch with new page
      if (hasSearched) {
        searchMutation.mutate()
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [totalPages, hasSearched, searchMutation]
  )

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, hasNextPage, goToPage])

  const previousPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, hasPrevPage, goToPage])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Get company by CNPJ (usa API diretamente)
  const getCompany = useCallback(async (cnpj: string) => {
    return smartCNPJService.getByCNPJ(cnpj)
  }, [])

  // Reset all state
  const reset = useCallback(() => {
    setSearchType('cnpj')
    setSearchValue('')
    setFilters({})
    setCurrentPage(1)
    setHasSearched(false)
    setSearchResponse(null)
    searchMutation.reset()
  }, [searchMutation])

  // Refetch current search
  const refetch = useCallback(() => {
    if (hasSearched) {
      searchMutation.mutate()
    }
  }, [hasSearched, searchMutation])

  return {
    // Search
    searchType,
    searchValue,
    setSearchType,
    setSearchValue,
    handleSearch,
    
    // Filters
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    
    // Results
    results,
    filteredResults,
    searchResponse,
    isSearching: searchMutation.isPending,
    hasSearched,
    error: searchMutation.error,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    isEstimate,  // ✅ Novo campo
    paginatedResults,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPrevPage,
    
    // Utils
    getCompany,
    reset,
    refetch,
  }
}

// ================================================================
// HOOKS ADICIONAIS
// ================================================================

/**
 * Hook para buscar empresa por CNPJ específico
 * Usa React Query para cache automático
 * 
 * @param cnpj - CNPJ da empresa
 * @param enabled - Se a query deve ser executada
 */
export function useSmartCNPJByCNPJ(cnpj: string, enabled = true) {
  return useQuery({
    queryKey: ['smart-cnpj', 'company', cnpj],
    queryFn: () => smartCNPJService.getByCNPJ(cnpj),
    enabled: enabled && !!cnpj && smartCNPJService.validateCNPJ(cnpj),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  })
}

/**
 * Hook para obter histórico de buscas
 * 
 * @param page - Página atual
 * @param limit - Items por página
 */
export function useSmartCNPJHistorico(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['smart-cnpj', 'historico', page, limit],
    queryFn: () => smartCNPJService.getHistorico({ page, limit }),
    staleTime: 1000 * 60, // 1 minuto
  })
}

/**
 * Hook para limpar histórico
 */
export function useSmartCNPJClearHistorico() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => smartCNPJService.clearHistorico(),
    onSuccess: () => {
      // Invalida cache do histórico
      queryClient.invalidateQueries({ queryKey: ['smart-cnpj', 'historico'] })
    },
  })
}

/**
 * Hook para obter estatísticas
 */
export function useSmartCNPJEstatisticas() {
  return useQuery({
    queryKey: ['smart-cnpj', 'estatisticas'],
    queryFn: () => smartCNPJService.getEstatisticas(),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
  })
}

/**
 * Hook para exportar dados
 */
export function useSmartCNPJExport() {
  return useMutation({
    mutationFn: (options: Parameters<typeof smartCNPJService.exportData>[0]) =>
      smartCNPJService.exportData(options),
  })
}

/**
 * Hook para download direto
 */
export function useSmartCNPJDownload() {
  return useMutation({
    mutationFn: ({
      options,
      filename,
    }: {
      options: Parameters<typeof smartCNPJService.exportData>[0]
      filename?: string
    }) => smartCNPJService.downloadExport(options, filename),
  })
}

