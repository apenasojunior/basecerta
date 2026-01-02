/**
 * Smart CNPJ - Página de Insights
 * Sprint: Smart CNPJ Search - ISSUE-00-B
 * 
 * Página inicial com 15 insights estratégicos em cache.
 * Performance: <10ms para carregar (vs 10+ segundos com queries em tempo real)
 */

'use client'

import { useEffect, useState } from 'react'
import { InsightCard } from '@/components/smart-cnpj/InsightCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  TrendingUp, 
  Loader2,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react'
import { getGroupedInsights } from '@/lib/api/endpoints/insights'
import type { InsightsGroupedResponse, InsightData } from '@/types/insights'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/**
 * Skeleton loading para cards
 */
function InsightCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="h-5 bg-gray-200 rounded w-32" />
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full" />
      </CardContent>
    </Card>
  )
}

/**
 * Página principal de insights
 */
export default function SmartCNPJInsightsPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<InsightsGroupedResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadTime, setLoadTime] = useState<number | null>(null)

  /**
   * Carregar insights do backend
   */
  const loadInsights = async () => {
    setIsLoading(true)
    setError(null)
    const startTime = performance.now()

    try {
      const data = await getGroupedInsights()
      setInsights(data)
      const endTime = performance.now()
      setLoadTime(endTime - startTime)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ Insights carregados em ${(endTime - startTime).toFixed(2)}ms`)
      }
    } catch (err) {
      console.error('Erro ao carregar insights:', err)
      setError('Não foi possível carregar os insights. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInsights()
  }, [])

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Smart CNPJ 360° - Insights Estratégicos
                </h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Encontre oportunidades B2B com base em 27M+ empresas ativas
                </p>
              </div>
            </div>
            
            {/* Performance Badge */}
            {loadTime !== null && loadTime < 100 && (
              <Badge className="bg-green-100 text-green-700 border-green-200 hidden md:flex">
                ⚡ Carregado em {loadTime.toFixed(0)}ms
              </Badge>
            )}
          </div>
          
          {/* Botão Busca Avançada */}
          <div className="mt-4">
            <Button 
              onClick={() => router.push('/smart-cnpj/search')}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Ir para Busca Avançada
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <InsightCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <Button 
                onClick={loadInsights}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success State - Insights Agrupados */}
        {insights && !isLoading && (
          <>
            {/* Seção: Setores com Alta Demanda */}
            {insights.setores && insights.setores.length > 0 && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Setores com Alta Demanda
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    {insights.setores.length} setores estratégicos para vendas B2B
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {insights.setores.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Seção: Estados com Maior Concentração */}
            {insights.estados && insights.estados.length > 0 && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Estados com Maior Concentração
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Top {insights.estados.length} estados por número de empresas ativas
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {insights.estados.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Seção: Empresas por Capital Social */}
            {insights.capital && insights.capital.length > 0 && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Segmentos por Capital Social
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    {insights.capital.length} faixas de capital para diferentes estratégias de venda
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {insights.capital.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Footer com Total */}
            <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary-600" />
                  Total de Insights Disponíveis
                </CardTitle>
                <CardDescription>
                  Dados atualizados automaticamente a cada 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-4xl font-bold text-primary-600">
                      {insights.total}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Insights Estratégicos
                    </p>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      27M+
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Empresas Ativas
                    </p>
                  </div>
                  <div className="h-12 w-px bg-gray-300" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      4.2M+
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Empresas Novas (12 meses)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}
