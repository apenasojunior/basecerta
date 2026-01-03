'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Building2, 
  Clock, 
  Search,
  Calendar,
  Filter,
  Download,
  ArrowRight,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  useSmartCNPJEstatisticas, 
  useSmartCNPJHistorico 
} from '@/hooks/useSmartCNPJ'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type PeriodFilter = 'hoje' | 'semana' | 'mes' | 'trimestre' | 'tudo'

export default function DashboardPage() {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('semana')
  const [historyPage, setHistoryPage] = useState(1)

  const { 
    data: stats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useSmartCNPJEstatisticas()

  const { 
    data: history, 
    isLoading: historyLoading,
    refetch: refetchHistory 
  } = useSmartCNPJHistorico(historyPage, 10)

  const handleRefresh = () => {
    refetchStats()
    refetchHistory()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard Smart CNPJ
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Estatísticas e histórico de consultas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={statsLoading || historyLoading}
          >
            <RefreshCw className={cn(
              "h-4 w-4",
              (statsLoading || historyLoading) && "animate-spin"
            )} />
            <span className="hidden sm:inline ml-2">Atualizar</span>
          </Button>
          <Link href="/smart-cnpj/search">
            <Button size="sm">
              <Search className="h-4 w-4" />
              Nova Busca
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Buscas */}
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Search className="h-5 w-5 text-primary-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Total
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.total_buscas.toLocaleString('pt-BR') || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Consultas realizadas
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Empresas Únicas */}
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Únicas
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.empresas_unicas.toLocaleString('pt-BR') || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Empresas consultadas
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Buscas Hoje */}
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Hoje
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.buscas_por_periodo.hoje.toLocaleString('pt-BR') || 0}
                  </p>
                  <p className="text-sm text-gray-600">
                    Consultas hoje
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tempo Médio */}
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Performance
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.tempo_medio_resposta 
                      ? `${stats.tempo_medio_resposta.toFixed(0)}ms`
                      : '0ms'
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    Tempo médio de resposta
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Period Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            Estatísticas por Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Hoje */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Hoje</span>
                  <Badge variant="outline" className="text-xs">
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.buscas_por_periodo.hoje || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">consultas</p>
              </div>

              {/* Semana */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Esta Semana</span>
                  <Badge variant="outline" className="text-xs">7 dias</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.buscas_por_periodo.semana || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">consultas</p>
              </div>

              {/* Mês */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Este Mês</span>
                  <Badge variant="outline" className="text-xs">30 dias</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.buscas_por_periodo.mes || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">consultas</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Types Distribution */}
      {stats && stats.tipos_busca && Object.keys(stats.tipos_busca).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Distribuição por Tipo de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.tipos_busca).map(([tipo, count]) => {
                const total = stats.total_buscas || 1
                const percentage = ((count / total) * 100).toFixed(1)
                
                return (
                  <div key={tipo}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs uppercase">
                          {tipo}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">
                          {count} consultas
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Histórico de Consultas
            </CardTitle>
            {history && history.data && history.data.length > 0 && (
              <Badge variant="secondary">
                {history.pagination.total} registros
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : history && history.data && history.data.length > 0 ? (
            <>
              <div className="space-y-3">
                {history.data.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs uppercase">
                            {item.tipo_busca}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {item.valor_busca}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {item.resultados_encontrados} resultado(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.tempo_resposta}ms
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.data_pesquisa).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <Link 
                        href={`/smart-cnpj/results?type=${item.tipo_busca}&q=${item.valor_busca}`}
                        className="flex-shrink-0"
                      >
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {history.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600">
                    Página {history.pagination.page} de {history.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHistoryPage(p => p + 1)}
                    disabled={historyPage === history.pagination.totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Nenhuma consulta realizada ainda
              </p>
              <Link href="/smart-cnpj/search">
                <Button variant="outline" size="sm" className="mt-4">
                  Fazer primeira busca
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
