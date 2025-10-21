import { useQuery } from "@tanstack/react-query"
import { searchPersons, getPersonById, getPersonByCPF } from "@/lib/api/endpoints/persons"
import type { PersonSearchFilters } from "@/types/person"

/**
 * Hook para buscar pessoas com filtros
 */
export function usePersonSearch(params: {
  searchType: "cpf" | "nome"
  searchValue: string
  filters?: PersonSearchFilters
  page?: number
  pageSize?: number
  enabled?: boolean
}) {
  const { searchType, searchValue, filters, page = 1, pageSize = 10, enabled = true } = params

  return useQuery({
    queryKey: ["persons", "search", searchType, searchValue, filters, page, pageSize],
    queryFn: () => searchPersons({ searchType, searchValue, filters, page, pageSize }),
    enabled: enabled && searchValue.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
  })
}

/**
 * Hook para buscar uma pessoa por ID
 */
export function usePersonById(id: string | null) {
  return useQuery({
    queryKey: ["persons", "byId", id],
    queryFn: () => getPersonById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook para buscar uma pessoa por CPF exato
 */
export function usePersonByCPF(cpf: string | null) {
  return useQuery({
    queryKey: ["persons", "byCPF", cpf],
    queryFn: () => getPersonByCPF(cpf!),
    enabled: !!cpf && cpf.replace(/\D/g, "").length === 11,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
