import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, ApiError } from '@/types/api'

/**
 * Cliente HTTP base para comunicação com a API
 * P.9.2: Enhanced error handling and retry logic
 */
class ApiClient {
  private client: AxiosInstance
  private maxRetries = 3
  private retryDelay = 1000

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
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

    // Response interceptor (P.9.2: Enhanced error handling)
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
      async (error: AxiosError<ApiError>) => {
        const config = error.config as InternalAxiosRequestConfig & { _retry?: number }
        
        // P.9.2: Retry logic para network errors e 5xx
        if (config && this.shouldRetry(error) && (!config._retry || config._retry < this.maxRetries)) {
          config._retry = (config._retry || 0) + 1
          
          if (process.env.NODE_ENV === 'development') {
            console.warn(`🔄 Retrying request (${config._retry}/${this.maxRetries}):`, config.url)
          }
          
          // Exponential backoff
          await this.sleep(this.retryDelay * config._retry)
          return this.client.request(config)
        }
        
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

          // P.9.2: Better structured logging (não console.error genérico)
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ API Error Response:', {
              status: error.response.status,
              statusText: error.response.statusText,
              url: error.config?.url,
              method: error.config?.method?.toUpperCase(),
              error: apiError.error,
              message: apiError.message,
            })
          }

          // TODO Sprint 11: Tratar erro 401 (não autenticado)
          // if (error.response.status === 401) {
          //   // Redirecionar para login
          //   window.location.href = '/login'
          // }

          return Promise.reject(apiError)
        } else if (error.request) {
          // Erro sem resposta (timeout, network error)
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Network Error:', {
              url: error.config?.url,
              message: error.message,
              code: error.code,
            })
          }
          return Promise.reject({
            success: false,
            error: 'Erro de conexão',
            message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
          } as ApiError)
        } else {
          // Erro na configuração da request
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Request Setup Error:', error.message)
          }
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
   * P.9.2: Helper para determinar se deve tentar retry
   */
  private shouldRetry(error: AxiosError): boolean {
    if (!error.config) return false
    
    // Retry em network errors
    if (!error.response) return true
    
    // Retry em 5xx (server errors)
    if (error.response.status >= 500) return true
    
    // Retry em 429 (rate limit)
    if (error.response.status === 429) return true
    
    return false
  }

  /**
   * P.9.2: Helper para delay entre retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
