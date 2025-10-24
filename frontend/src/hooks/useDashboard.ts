/**
 * useDashboard Hook
 * Gerenciamento de dados do dashboard
 */

"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

// TODO: Pegar user_id do contexto de autenticação (Sprint 11)
// Por enquanto, usar mock user_id=1
const MOCK_USER_ID = 1

/**
 * Hook para obter estatísticas do dashboard
 * 
 * P.9.3: Retry agressivo para evitar blocking time
 * - retry: 1 (não 3) = 500ms até fallback (não 6s)
 * - refetchInterval removido (causava polling desnecessário)
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats", MOCK_USER_ID],
    queryFn: () => api.stats.getDashboardStats(MOCK_USER_ID),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    retry: 1, // Apenas 1 retry para evitar blocking (P.9.3)
    retryDelay: 500, // 500ms (rápido para first load)
  })
}

/**
 * Hook para obter estatísticas de uso de créditos
 */
export function useCreditUsageStats(
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["dashboard", "credit-usage", MOCK_USER_ID, startDate, endDate],
    queryFn: () => api.stats.getCreditUsageStats(MOCK_USER_ID, startDate, endDate),
    staleTime: 1000 * 60 * 10, // 10 minutos
    enabled: !!startDate && !!endDate,
  })
}

/**
 * Hook para obter estatísticas por tipo de pesquisa
 */
export function useResearchTypeStats(
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["dashboard", "research-type", MOCK_USER_ID, startDate, endDate],
    queryFn: () => api.stats.getResearchTypeStats(MOCK_USER_ID, startDate, endDate),
    staleTime: 1000 * 60 * 10, // 10 minutos
    enabled: !!startDate && !!endDate,
  })
}

/**
 * Hook consolidado do dashboard (mais conveniente)
 */
export function useDashboard() {
  const stats = useDashboardStats()

  return {
    // Estatísticas
    stats: stats.data?.data,
    isLoadingStats: stats.isLoading,
    isErrorStats: stats.isError,
    errorStats: stats.error,

    // Helpers
    refetchStats: stats.refetch,
  }
}
