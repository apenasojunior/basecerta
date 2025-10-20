import { apiClient } from '../client'
import {
  User,
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '@/types'

/**
 * Endpoints relacionados a usuários
 */
export const usersApi = {
  /**
   * Buscar perfil do usuário atual
   * TODO Sprint 11: Usar /api/users/me após implementar autenticação
   */
  getProfile: async (userId: number): Promise<ApiResponse<UserProfileResponse>> => {
    return apiClient.get<UserProfileResponse>(`/users/${userId}`)
  },

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: async (
    userId: number,
    data: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/users/${userId}`, data)
  },

  /**
   * Alterar senha
   * TODO Sprint 11: Implementar endpoint de alteração de senha
   */
  changePassword: async (
    userId: number,
    data: ChangePasswordRequest
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/users/${userId}/change-password`, data)
  },

  /**
   * Upload de avatar
   */
  uploadAvatar: async (userId: number, file: File): Promise<ApiResponse<{ avatar_url: string }>> => {
    const formData = new FormData()
    formData.append('file', file)

    // Usa o client do axios diretamente para enviar multipart/form-data
    const client = apiClient.getClient()
    const response = await client.post<ApiResponse<{ avatar_url: string }>>(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },
}
