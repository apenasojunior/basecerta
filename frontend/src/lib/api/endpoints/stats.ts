import { apiClient } from '../client'
import {
  DashboardStatsResponse,
  ApiResponse,
} from '@/types'

/**
 * Endpoints relacionados a estatísticas e analytics
 */
export const statsApi = {
  /**
   * Buscar estatísticas do dashboard do usuário
   */
  getDashboardStats: async (userId: number): Promise<ApiResponse<DashboardStatsResponse>> => {
    return apiClient.get<DashboardStatsResponse>(`/stats/user/${userId}`)
  },

  /**
   * ADMIN: Buscar estatísticas gerais da plataforma
   * TODO Sprint 11: Proteger com autenticação admin
   */
  getAdminStats: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/stats/admin')
  },

  /**
   * Estatísticas de uso de créditos
   */
  getCreditUsageStats: async (
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/stats/credits-usage/${userId}`, {
      start_date: startDate,
      end_date: endDate,
    })
  },

  /**
   * Estatísticas de pesquisas por tipo
   */
  getResearchTypeStats: async (
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/stats/research-types/${userId}`, {
      start_date: startDate,
      end_date: endDate,
    })
  },
}
