/**
 * Insights API Service
 * Sprint: Smart CNPJ Search - ISSUE-00-B
 * 
 * Serviço para consumir endpoints de insights (estatísticas em cache)
 */

import { apiClient } from '../client'
import type { 
  InsightData, 
  InsightsGroupedResponse, 
  InsightCategoria 
} from '@/types/insights'

/**
 * Base path para endpoints de insights
 */
const INSIGHTS_BASE_PATH = '/insights'

/**
 * Busca todos os insights ou filtra por categoria
 * 
 * @param categoria - Opcional: 'setor', 'estado' ou 'capital'
 * @returns Array de insights
 * 
 * @example
 * ```ts
 * const allInsights = await getInsights()
 * const setores = await getInsights('setor')
 * ```
 */
export async function getInsights(categoria?: InsightCategoria): Promise<InsightData[]> {
  try {
    const params = categoria ? { categoria } : undefined
    const response = await apiClient.get<InsightData[]>(
      `${INSIGHTS_BASE_PATH}/`,
      params
    )
    
    // API retorna array direto (não ApiResponse wrapper)
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Erro ao buscar insights:', error)
    throw error
  }
}

/**
 * Busca insights agrupados por categoria
 * 
 * @returns Objeto com arrays separados: {setores, estados, capital, total}
 * 
 * @example
 * ```ts
 * const { setores, estados, capital, total } = await getGroupedInsights()
 * console.log(`Total: ${total} insights (${setores.length} setores)`)
 * ```
 */
export async function getGroupedInsights(): Promise<InsightsGroupedResponse> {
  try {
    const response = await apiClient.get<InsightsGroupedResponse>(
      `${INSIGHTS_BASE_PATH}/grouped`
    )
    
    // API retorna objeto direto (não ApiResponse wrapper)
    return response as unknown as InsightsGroupedResponse
  } catch (error) {
    console.error('Erro ao buscar insights agrupados:', error)
    throw error
  }
}

/**
 * Busca um insight específico por key
 * 
 * @param insightKey - Key única do insight (ex: 'setor_tecnologia')
 * @returns Dados do insight
 * 
 * @example
 * ```ts
 * const insight = await getInsightByKey('setor_tecnologia')
 * console.log(`${insight.titulo}: ${insight.total_empresas} empresas`)
 * ```
 */
export async function getInsightByKey(insightKey: string): Promise<InsightData> {
  try {
    const response = await apiClient.get<InsightData>(
      `${INSIGHTS_BASE_PATH}/${insightKey}`
    )
    
    return response as unknown as InsightData
  } catch (error) {
    console.error(`Erro ao buscar insight ${insightKey}:`, error)
    throw error
  }
}

/**
 * Verifica insights desatualizados (stale cache)
 * 
 * @returns Array de insights com cache > 7 dias
 * 
 * @example
 * ```ts
 * const staleInsights = await getStaleInsights()
 * if (staleInsights.length > 0) {
 *   console.warn(`⚠️ ${staleInsights.length} insights desatualizados`)
 * }
 * ```
 */
export async function getStaleInsights(): Promise<InsightData[]> {
  try {
    const response = await apiClient.get<InsightData[]>(
      `${INSIGHTS_BASE_PATH}/health/stale`
    )
    
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Erro ao verificar insights desatualizados:', error)
    throw error
  }
}

/**
 * Hook helper para usar insights com React Query (futuro)
 * 
 * @example
 * ```ts
 * const { data: insights, isLoading, error } = useQuery({
 *   queryKey: ['insights', 'setor'],
 *   queryFn: () => getInsights('setor'),
 *   staleTime: 5 * 60 * 1000, // 5 minutos
 * })
 * ```
 */
export const insightsQueryKeys = {
  all: ['insights'] as const,
  lists: () => [...insightsQueryKeys.all, 'list'] as const,
  list: (categoria?: InsightCategoria) => 
    [...insightsQueryKeys.lists(), categoria] as const,
  grouped: () => [...insightsQueryKeys.all, 'grouped'] as const,
  detail: (key: string) => [...insightsQueryKeys.all, 'detail', key] as const,
  stale: () => [...insightsQueryKeys.all, 'stale'] as const,
}
