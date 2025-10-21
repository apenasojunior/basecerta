'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  DollarSign,
  Scale,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useDashboard } from '@/hooks/useDashboard'
import { useCredits } from '@/hooks/useCredits'
import { SearchStatsCards } from '@/components/dashboard/SearchStatsCards'
import { RecentSearches } from '@/components/dashboard/RecentSearches'
import { SearchChart } from '@/components/dashboard/SearchChart'
import { TopSearched } from '@/components/dashboard/TopSearched'

export default function DashboardPage() {
  // Hooks de integração com API
  const { stats: dashboardStats, isLoadingStats, isErrorStats } = useDashboard()
  const { balance, isLoadingBalance } = useCredits()

  // Loading state
  const isLoading = isLoadingStats || isLoadingBalance

  // Stats com dados reais da API (fallback para mock durante desenvolvimento)
  const stats = [
    {
      title: 'Consultas Hoje',
      value: isLoading ? '...' : String(dashboardStats?.queries_today ?? 24),
      change: isLoading ? '...' : dashboardStats?.queries_today_change ?? '+12%',
      trend: 'up' as const,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Créditos Disponíveis',
      value: isLoading ? '...' : String(balance ?? 150),
      change: isLoading ? '...' : String(dashboardStats?.credits_change ?? '-30'),
      trend: 'down' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Empresas Consultadas',
      value: isLoading ? '...' : String(dashboardStats?.companies_consulted ?? 342),
      change: isLoading ? '...' : dashboardStats?.companies_change ?? '+8%',
      trend: 'up' as const,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Processos Jurídicos',
      value: isLoading ? '...' : String(dashboardStats?.legal_searches ?? 18),
      change: isLoading ? '...' : dashboardStats?.legal_change ?? '+3',
      trend: 'up' as const,
      icon: Scale,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'success' as const,
      title: 'Consulta de Empresa',
      description: 'ACME Tecnologia LTDA - CNPJ: 12.345.678/0001-90',
      time: '5 minutos atrás',
      credits: -5,
    },
    {
      id: 2,
      type: 'success' as const,
      title: 'Dossiê Financeiro',
      description: 'Tech Solutions Brasil - CNPJ: 98.765.432/0001-10',
      time: '23 minutos atrás',
      credits: -15,
    },
    {
      id: 3,
      type: 'pending' as const,
      title: 'Pesquisa Jurídica',
      description: 'Indústrias XYZ S/A - CNPJ: 11.222.333/0001-44',
      time: '1 hora atrás',
      credits: -10,
    },
    {
      id: 4,
      type: 'error' as const,
      title: 'Consulta Falhou',
      description: 'Empresa ABC - Dados não encontrados',
      time: '2 horas atrás',
      credits: 0,
    },
    {
      id: 5,
      type: 'success' as const,
      title: 'Dados Cadastrais',
      description: 'Comércio Beta LTDA - CNPJ: 55.666.777/0001-88',
      time: '3 horas atrás',
      credits: -3,
    },
  ]

  const promotionalCards = [
    {
      title: 'Upgrade seu Plano',
      description: 'Assine o plano Premium e ganhe 1000 créditos bônus',
      cta: 'Ver Planos',
      href: '/configuracoes/financeiro',
      gradient: 'from-primary-500 to-orange-600',
    },
    {
      title: 'Central de Ajuda',
      description: 'Aprenda a usar todas as funcionalidades da plataforma',
      cta: 'Acessar',
      href: '/site/central-ajuda',
      gradient: 'from-blue-500 to-cyan-600',
    },
  ]

  return (
    <DashboardLayout>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando dados...</span>
        </div>
      )}

      {/* Error State */}
      {isErrorStats && !isLoading && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Erro ao carregar estatísticas. Os dados exibidos são de demonstração.
        </div>
      )}

      {/* New Stats Cards - Search History & Favorites */}
      <div className="mb-6">
        <SearchStatsCards />
      </div>

      {/* Original Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-lg', stat.bgColor)}>
                    <Icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                  <Badge
                    variant={stat.trend === 'up' ? 'default' : 'secondary'}
                    className={cn(
                      'flex items-center gap-1',
                      stat.trend === 'up'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    )}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart and Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <SearchChart />
        <TopSearched />
      </div>

      {/* Recent Searches and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Recent Searches - New Component */}
        <div className="lg:col-span-2">
          <RecentSearches />
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links Rápidos</CardTitle>
            <CardDescription>Acesso rápido às suas informações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/favoritos">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Ver todos os Favoritos
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/historico">
              <Button variant="outline" className="w-full justify-start gap-2">
                <History className="h-4 w-4 text-blue-500" />
                Ver Histórico Completo
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/produtos/comparar">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                Comparar Empresas
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Original Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Suas últimas consultas e transações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={cn(
                      'p-2 rounded-full mt-1',
                      activity.type === 'success' && 'bg-green-100',
                      activity.type === 'pending' && 'bg-yellow-100',
                      activity.type === 'error' && 'bg-red-100'
                    )}
                  >
                    {activity.type === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {activity.type === 'pending' && (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    {activity.type === 'error' && (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.credits !== 0 && (
                        <span
                          className={cn(
                            'text-xs font-medium',
                            activity.credits < 0
                              ? 'text-red-600'
                              : 'text-green-600'
                          )}
                        >
                          {activity.credits} créditos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Promotional Cards */}
        <div className="space-y-6">
          {promotionalCards.map((promo) => (
            <Card
              key={promo.title}
              className={cn(
                'bg-gradient-to-br text-white border-0 overflow-hidden relative',
                promo.gradient
              )}
            >
              <CardHeader>
                <CardTitle className="text-white">{promo.title}</CardTitle>
                <CardDescription className="text-white/90">
                  {promo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={promo.href}>
                  <Button
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    {promo.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
