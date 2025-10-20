import { apiClient } from '../client'
import {
  UserCredits,
  CreditTransaction,
  CreditsBalanceResponse,
  CreditsHistoryResponse,
  AddCreditsRequest,
  DeductCreditsRequest,
  ApiResponse,
  PaginationParams,
} from '@/types'

/**
 * Endpoints relacionados a créditos
 */
export const creditsApi = {
  /**
   * Buscar saldo de créditos do usuário
   * @param userId - ID do usuário (mock: 1 por enquanto)
   */
  getBalance: async (userId: number): Promise<ApiResponse<CreditsBalanceResponse>> => {
    return apiClient.get<CreditsBalanceResponse>(`/credits/balance/${userId}`)
  },

  /**
   * Buscar histórico de transações de créditos
   */
  getHistory: async (
    userId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<CreditsHistoryResponse>> => {
    const response = await apiClient.get<CreditsHistoryResponse>(`/credits/history/${userId}`, params)
    return response as ApiResponse<CreditsHistoryResponse>
  },

  /**
   * Adicionar créditos
   * TODO: Proteger endpoint (apenas admin) na Sprint 11
   */
  addCredits: async (data: AddCreditsRequest): Promise<ApiResponse<UserCredits>> => {
    return apiClient.post<UserCredits>('/credits/add', data)
  },

  /**
   * Deduzir créditos (usado internamente nas pesquisas)
   */
  deductCredits: async (data: DeductCreditsRequest): Promise<ApiResponse<UserCredits>> => {
    return apiClient.post<UserCredits>('/credits/deduct', data)
  },

  /**
   * Buscar transação específica
   */
  getTransaction: async (transactionId: number): Promise<ApiResponse<CreditTransaction>> => {
    return apiClient.get<CreditTransaction>(`/credits/transactions/${transactionId}`)
  },
}
