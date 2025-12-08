/**
 * Custom Hooks - BaseCerta Frontend
 * 
 * Centraliza exportação de todos os hooks customizados
 */

// Company Search Hooks
export {
  useCompanySearch,
  useCompanyDetails,
  useSearchHistory,
  useCompanySearchStats,
} from "./useCompanySearch"

// Smart CNPJ Hooks (Issue 2.2.4)
export {
  useSmartCNPJ,
  useSmartCNPJByCNPJ,
  useSmartCNPJHistorico,
  useSmartCNPJClearHistorico,
  useSmartCNPJEstatisticas,
  useSmartCNPJExport,
  useSmartCNPJDownload,
} from "./useSmartCNPJ"
export type { SearchType, SearchFilters, UseSmartCNPJReturn } from "./useSmartCNPJ"

// Utility Hooks
export { useDebounce, useDebouncedCallback } from "./useDebounce"
export { useLocalStorage, useSettings } from "./useLocalStorage"

