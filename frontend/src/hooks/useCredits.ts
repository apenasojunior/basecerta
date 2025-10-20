/**
 * useCredits Hook
 * Gerenciamento de créditos do usuário
 */

"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
  CreditsBalanceResponse,
  CreditsHistoryResponse,
  AddCreditsRequest,
  DeductCreditsRequest,
} from "@/types"

// TODO: Pegar user_id do contexto de autenticação (Sprint 11)
// Por enquanto, usar mock user_id=1
const MOCK_USER_ID = 1

/**
 * Hook para obter saldo de créditos
 */
export function useCreditsBalance() {
  return useQuery({
    queryKey: ["credits", "balance", MOCK_USER_ID],
    queryFn: () => api.credits.getBalance(MOCK_USER_ID),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  })
}

/**
 * Hook para obter histórico de créditos
 */
export function useCreditsHistory(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["credits", "history", MOCK_USER_ID, page, limit],
    queryFn: () => api.credits.getHistory(MOCK_USER_ID, { page, limit }),
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

/**
 * Hook para adicionar créditos
 */
export function useAddCredits() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddCreditsRequest) => api.credits.addCredits(data),
    onSuccess: () => {
      // Invalidar cache de saldo e histórico
      queryClient.invalidateQueries({ queryKey: ["credits", "balance"] })
      queryClient.invalidateQueries({ queryKey: ["credits", "history"] })
    },
  })
}

/**
 * Hook para deduzir créditos
 */
export function useDeductCredits() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeductCreditsRequest) => api.credits.deductCredits(data),
    onSuccess: () => {
      // Invalidar cache de saldo e histórico
      queryClient.invalidateQueries({ queryKey: ["credits", "balance"] })
      queryClient.invalidateQueries({ queryKey: ["credits", "history"] })
    },
  })
}

/**
 * Hook consolidado de créditos (mais conveniente)
 */
export function useCredits() {
  const balance = useCreditsBalance()
  const addCredits = useAddCredits()
  const deductCredits = useDeductCredits()

  return {
    // Saldo
    balance: balance.data?.data.balance ?? 0,
    total_added: balance.data?.data.total_added ?? 0,
    total_used: balance.data?.data.total_used ?? 0,
    isLoadingBalance: balance.isLoading,
    isErrorBalance: balance.isError,
    errorBalance: balance.error,

    // Ações
    addCredits: addCredits.mutate,
    isAddingCredits: addCredits.isPending,
    addCreditsError: addCredits.error,

    deductCredits: deductCredits.mutate,
    isDeductingCredits: deductCredits.isPending,
    deductCreditsError: deductCredits.error,

    // Helpers
    hasCredits: (balance.data?.data.balance ?? 0) > 0,
    refetchBalance: balance.refetch,
  }
}
