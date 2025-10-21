"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Users, Building2, FileText, Star, Clock } from "lucide-react"
import { useSearchHistory } from "@/hooks/useSearchHistory"
import { useFavorites } from "@/hooks/useFavorites"
import { cn } from "@/lib/utils"

export function SearchStatsCards() {
  const { getStats: getHistoryStats } = useSearchHistory()
  const { getStats: getFavoritesStats } = useFavorites()

  const historyStats = getHistoryStats()
  const favoritesStats = getFavoritesStats()

  const stats = useMemo(() => {
    // Total de consultas
    const totalQueries = historyStats.total
    const last24h = historyStats.last24h
    const percentLast24h =
      totalQueries > 0 ? Math.round((last24h / totalQueries) * 100) : 0

    // Consultas por tipo
    const pfCount = historyStats.byType.PF
    const pjCount = historyStats.byType.PJ
    const financeiroCount = historyStats.byType.FINANCEIRO

    // Percentuais por tipo
    const totalByType = pfCount + pjCount + financeiroCount
    const pfPercent =
      totalByType > 0 ? Math.round((pfCount / totalByType) * 100) : 0
    const pjPercent =
      totalByType > 0 ? Math.round((pjCount / totalByType) * 100) : 0
    const financeiroPercent =
      totalByType > 0 ? Math.round((financeiroCount / totalByType) * 100) : 0

    // Favoritos
    const totalFavorites = favoritesStats.total
    const remaining = favoritesStats.remaining
    const percentUsed =
      totalFavorites > 0 ? Math.round((totalFavorites / 50) * 100) : 0

    return {
      totalQueries,
      last24h,
      percentLast24h,
      pfCount,
      pjCount,
      financeiroCount,
      pfPercent,
      pjPercent,
      financeiroPercent,
      totalFavorites,
      remaining,
      percentUsed,
    }
  }, [historyStats, favoritesStats])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Consultas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Consultas
          </CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQueries}</div>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-3 w-3 text-blue-500" />
            <p className="text-xs text-muted-foreground">
              {stats.last24h} nas últimas 24h ({stats.percentLast24h}%)
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Limite: {historyStats.remaining} consultas restantes
          </p>
        </CardContent>
      </Card>

      {/* Por Tipo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Por Tipo</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-blue-500" />
                <span className="text-sm">PF</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {stats.pfCount} ({stats.pfPercent}%)
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-purple-500" />
                <span className="text-sm">PJ</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                {stats.pjCount} ({stats.pjPercent}%)
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-green-500" />
                <span className="text-sm">Financeiro</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {stats.financeiroCount} ({stats.financeiroPercent}%)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Créditos (Mock) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Créditos</CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xs font-bold text-green-600">$</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">150</div>
          <div className="mt-2">
            <Progress value={75} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            75% do plano utilizado
          </p>
          <p className="text-xs text-blue-600 font-medium mt-1">
            +50 créditos bônus disponíveis
          </p>
        </CardContent>
      </Card>

      {/* Favoritos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalFavorites}/50
          </div>
          <div className="mt-2">
            <Progress value={stats.percentUsed} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.remaining} espaços disponíveis
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {favoritesStats.byType.PF} PF
            </Badge>
            <Badge variant="outline" className="text-xs">
              {favoritesStats.byType.PJ} PJ
            </Badge>
            <Badge variant="outline" className="text-xs">
              {favoritesStats.byType.FINANCEIRO} FIN
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
