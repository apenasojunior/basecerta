import { apiClient } from '../client'
import {
  Plan,
  CreditPackage,
  PlansResponse,
  PackagesResponse,
  ApiResponse,
} from '@/types'

/**
 * Endpoints relacionados a planos e pacotes
 */
export const plansApi = {
  /**
   * Listar todos os planos disponíveis
   */
  getPlans: async (): Promise<ApiResponse<PlansResponse>> => {
    return apiClient.get<PlansResponse>('/plans')
  },

  /**
   * Buscar detalhes de um plano específico
   */
  getPlan: async (planId: number): Promise<ApiResponse<Plan>> => {
    return apiClient.get<Plan>(`/plans/${planId}`)
  },

  /**
   * Listar todos os pacotes de créditos disponíveis
   */
  getPackages: async (): Promise<ApiResponse<PackagesResponse>> => {
    return apiClient.get<PackagesResponse>('/packages')
  },

  /**
   * Buscar detalhes de um pacote específico
   */
  getPackage: async (packageId: number): Promise<ApiResponse<CreditPackage>> => {
    return apiClient.get<CreditPackage>(`/packages/${packageId}`)
  },

  /**
   * ADMIN: Criar novo plano
   * TODO Sprint 11: Proteger com autenticação admin
   */
  createPlan: async (data: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    return apiClient.post<Plan>('/plans', data)
  },

  /**
   * ADMIN: Atualizar plano existente
   * TODO Sprint 11: Proteger com autenticação admin
   */
  updatePlan: async (planId: number, data: Partial<Plan>): Promise<ApiResponse<Plan>> => {
    return apiClient.put<Plan>(`/plans/${planId}`, data)
  },

  /**
   * ADMIN: Criar novo pacote
   * TODO Sprint 11: Proteger com autenticação admin
   */
  createPackage: async (data: Partial<CreditPackage>): Promise<ApiResponse<CreditPackage>> => {
    return apiClient.post<CreditPackage>('/packages', data)
  },

  /**
   * ADMIN: Atualizar pacote existente
   * TODO Sprint 11: Proteger com autenticação admin
   */
  updatePackage: async (
    packageId: number,
    data: Partial<CreditPackage>
  ): Promise<ApiResponse<CreditPackage>> => {
    return apiClient.put<CreditPackage>(`/packages/${packageId}`, data)
  },
}
