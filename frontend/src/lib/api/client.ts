import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, ApiError } from '@/types/api'

/**
 * Cliente HTTP base para comunicação com a API
 */
class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Configura interceptors de request e response
   */
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // TODO Sprint 11: Adicionar token de autenticação
        // const token = getAuthToken()
        // if (token && config.headers) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }

        // Log de request (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          })
        }

        return config
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log de response (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          })
        }

        return response
      },
      (error: AxiosError<ApiError>) => {
        // Tratamento de erros
        if (error.response) {
          // Erro com resposta do servidor
          const apiError: ApiError = {
            success: false,
            error: error.response.data?.error || 'Erro ao processar requisição',
            message: error.response.data?.message,
            details: error.response.data?.details,
            status_code: error.response.status,
          }

          console.error('❌ API Error:', {
            status: error.response.status,
            url: error.config?.url,
            error: apiError,
          })

          // TODO Sprint 11: Tratar erro 401 (não autenticado)
          // if (error.response.status === 401) {
          //   // Redirecionar para login
          //   window.location.href = '/login'
          // }

          return Promise.reject(apiError)
        } else if (error.request) {
          // Erro sem resposta (timeout, network error)
          console.error('❌ Network Error:', error.message)
          return Promise.reject({
            success: false,
            error: 'Erro de conexão',
            message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
          } as ApiError)
        } else {
          // Erro na configuração da request
          console.error('❌ Request Setup Error:', error.message)
          return Promise.reject({
            success: false,
            error: 'Erro interno',
            message: error.message,
          } as ApiError)
        }
      }
    )
  }

  /**
   * Método GET
   */
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params })
    return response.data
  }

  /**
   * Método POST
   */
  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data
  }

  /**
   * Método PUT
   */
  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data)
    return response.data
  }

  /**
   * Método PATCH
   */
  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data)
    return response.data
  }

  /**
   * Método DELETE
   */
  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data
  }

  /**
   * Get Axios instance (para casos especiais)
   */
  getClient(): AxiosInstance {
    return this.client
  }
}

// Exporta instância única (singleton)
export const apiClient = new ApiClient()
