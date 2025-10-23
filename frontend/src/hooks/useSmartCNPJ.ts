import { useState, useCallback, useMemo } from 'react'
import {
  SmartCNPJCompany,
  searchCompanies,
  filterCompanies,
  getCompanyByCNPJ,
  mockCompanies,
} from '@/mocks/smart-cnpj'

export type SearchType = 'cnpj' | 'razaoSocial' | 'segmento' | 'email' | 'telefone' | 'nomeSocio' | 'cep'

export interface SearchFilters {
  situacaoCadastral?: string[]
  tipo?: 'MATRIZ' | 'FILIAL'
  porte?: string[]
  capitalSocialMin?: number
  capitalSocialMax?: number
  isMEI?: boolean
  isSimplesNacional?: boolean
  formaTributacao?: string
  dataAberturaStart?: string
  dataAberturaEnd?: string
}

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
  
  // Results
  results: SmartCNPJCompany[]
  filteredResults: SmartCNPJCompany[]
  isSearching: boolean
  hasSearched: boolean
  
  // Pagination
  currentPage: number
  totalPages: number
  itemsPerPage: number
  paginatedResults: SmartCNPJCompany[]
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  
  // Utils
  getCompany: (cnpj: string) => SmartCNPJCompany | undefined
  reset: () => void
}

const ITEMS_PER_PAGE = 20

export function useSmartCNPJ(): UseSmartCNPJReturn {
  // Search state
  const [searchType, setSearchType] = useState<SearchType>('cnpj')
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Results state - Initialize with all mock companies for testing
  const [results, setResults] = useState<SmartCNPJCompany[]>(mockCompanies)
  
  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({})
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  // Perform search
  const handleSearch = useCallback(() => {
    if (!searchValue.trim()) return

    setIsSearching(true)
    
    // Simulate API delay
    setTimeout(() => {
      const searchResults = searchCompanies({
        type: searchType,
        value: searchValue,
      })
      
      setResults(searchResults)
      setHasSearched(true)
      setIsSearching(false)
      setCurrentPage(1) // Reset to first page
    }, 500)
  }, [searchType, searchValue])

  // Apply filters to results
  const filteredResults = useMemo(() => {
    if (results.length === 0) return []
    return filterCompanies(results, filters)
  }, [results, filters])

  // Check if has active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== null
    })
  }, [filters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
  
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredResults.slice(startIndex, endIndex)
  }, [filteredResults, currentPage])

  // Pagination functions
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Get company by CNPJ
  const getCompany = useCallback((cnpj: string) => {
    return getCompanyByCNPJ(cnpj)
  }, [])

  // Reset all state
  const reset = useCallback(() => {
    setSearchType('cnpj')
    setSearchValue('')
    setResults(mockCompanies) // Reset to show all companies
    setFilters({})
    setCurrentPage(1)
    setHasSearched(false)
    setIsSearching(false)
  }, [])

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
    isSearching,
    hasSearched,
    
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    paginatedResults,
    goToPage,
    nextPage,
    previousPage,
    
    // Utils
    getCompany,
    reset,
  }
}
