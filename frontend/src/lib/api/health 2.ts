/**
 * Health Check e Validação de Conexão com Backend
 * Issue 2.2.1 - Setup e Configuração API
 */

import { apiClient } from './client'

export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  services?: {
    database: 'ok' | 'error'
    redis: 'ok' | 'error'
    celery: 'ok' | 'error'
  }
}

/**
 * Testa a conexão com o backend
 * GET /health
 */
export async function checkBackendHealth(): Promise<{
  success: boolean
  message: string
  data?: HealthCheckResponse
}> {
  try {
    const response = await apiClient.get<HealthCheckResponse>('/health')
    
    if (response.data?.status === 'ok') {
      return {
        success: true,
        message: 'Backend conectado com sucesso',
        data: response.data,
      }
    }
    
    return {
      success: false,
      message: 'Backend respondeu, mas com status de erro',
      data: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Falha ao conectar com o backend',
    }
  }
}

/**
 * Verifica se a API está disponível
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const result = await checkBackendHealth()
    return result.success
  } catch {
    return false
  }
}

/**
 * Obtém a URL base da API configurada
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
}

/**
 * Valida se a configuração da API está correta
 */
export function validateApiConfig(): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Verifica se a variável de ambiente está definida
  if (!process.env.NEXT_PUBLIC_API_URL) {
    issues.push('NEXT_PUBLIC_API_URL não está definida no .env.local')
  }
  
  // Verifica se a URL é válida
  const url = getApiBaseUrl()
  try {
    new URL(url)
  } catch {
    issues.push(`URL da API é inválida: ${url}`)
  }
  
  // Verifica se a URL termina com /v1
  if (!url.endsWith('/v1')) {
    issues.push('URL da API deve terminar com /v1')
  }
  
  return {
    valid: issues.length === 0,
    issues,
  }
}

/**
 * Hook React para verificar status da API
 * Uso: const { isOnline, checking } = useApiStatus()
 */
export function useApiStatus() {
  if (typeof window === 'undefined') {
    return { isOnline: false, checking: true }
  }

  const [isOnline, setIsOnline] = React.useState<boolean>(false)
  const [checking, setChecking] = React.useState<boolean>(true)

  React.useEffect(() => {
    async function checkStatus() {
      setChecking(true)
      const online = await isApiAvailable()
      setIsOnline(online)
      setChecking(false)
    }

    checkStatus()

    // Recheck a cada 30 segundos
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return { isOnline, checking }
}

// Adiciona import do React para o hook
import React from 'react'

