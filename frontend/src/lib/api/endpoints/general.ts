import { apiClient } from '../client'
import { HealthCheckResponse, ApiResponse } from '@/types'

/**
 * Endpoints gerais (health check, etc.)
 */
export const generalApi = {
  /**
   * Health check da API
   */
  healthCheck: async (): Promise<ApiResponse<HealthCheckResponse>> => {
    return apiClient.get<HealthCheckResponse>('/health')
  },
}
