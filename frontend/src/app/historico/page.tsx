"use client"

import { useRouter } from "next/navigation"
import { Clock, Trash2, RotateCcw, Filter } from "lucide-react"
import { useState } from "react"
import { useSearchHistory, type TimeGroup, type HistoryItem } from "@/hooks/useSearchHistory"
import { type FavoriteType } from "@/hooks/useFavorites"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/lib/toast"

const TYPE_LABELS: Record<FavoriteType, string> = {
  PF: "Pessoa Física",
  PJ: "Pessoa Jurídica",
  FINANCEIRO: "Dossiê Financeiro",
}

const TYPE_COLORS: Record<FavoriteType, string> = {
  PF: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  PJ: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  FINANCEIRO: "bg-green-100 text-green-800 hover:bg-green-200",
}

const GROUP_LABELS: Record<TimeGroup, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  thisWeek: "Esta Semana",
  older: "Mais Antigas",
}

export default function HistoricoPage() {
  const router = useRouter()
  const { history, isLoading, removeItem, clearHistory, getGroupedHistory, getStats } =
    useSearchHistory()
  const [filterType, setFilterType] = useState<FavoriteType | "ALL">("ALL")
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const stats = getStats()
  const groupedHistory = getGroupedHistory()

  // Filtra histórico por tipo
  const getFilteredGroups = () => {
    if (filterType === "ALL") return groupedHistory

    const filtered: Record<TimeGroup, HistoryItem[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    }

    Object.keys(groupedHistory).forEach((key) => {
      const group = key as TimeGroup
      filtered[group] = groupedHistory[group].filter((item) => item.type === filterType)
    })

    return filtered
  }

  const filteredGroups = getFilteredGroups()
  const totalFiltered = Object.values(filteredGroups).reduce(
    (sum, group) => sum + group.length,
    0
  )

  // Refaz uma busca
  const handleRepeatSearch = (item: HistoryItem) => {
    if (item.type === "PF") {
      router.push(`/produtos/dados-cadastrais-pf?cpf=${item.query}`)
    } else if (item.type === "PJ") {
      router.push(`/produtos/dados-cadastrais-pj?cnpj=${item.query}`)
    } else if (item.type === "FINANCEIRO") {
      const docType = item.query.length === 14 ? "cnpj" : "cpf"
      router.push(`/produtos/dossie-financeiro?${docType}=${item.query}`)
    }
  }

  // Remove item do histórico
  const handleRemove = (id: string) => {
    removeItem(id)
    toast.success("Item removido do histórico")
  }

  // Limpa todo o histórico
  const handleClearAll = () => {
    clearHistory()
    setClearDialogOpen(false)
    toast.success("Histórico limpo com sucesso")
  }

  // Formata data/hora
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            Histórico de Consultas
          </h1>
          <p className="text-muted-foreground mt-1">
            Suas {stats.total} consultas mais recentes
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setClearDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Histórico
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.last24h} nas últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pessoa Física
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.byType.PF}</p>
            <p className="text-xs text-muted-foreground mt-1">consultas PF</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pessoa Jurídica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.byType.PJ}</p>
            <p className="text-xs text-muted-foreground mt-1">consultas PJ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiê Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {stats.byType.FINANCEIRO}
            </p>
            <p className="text-xs text-muted-foreground mt-1">consultas financeiras</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Buscas</CardTitle>
              <CardDescription>
                {totalFiltered} de {stats.total} consulta(s)
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                <Button
                  variant={filterType === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("ALL")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === "PF" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("PF")}
                >
                  PF
                </Button>
                <Button
                  variant={filterType === "PJ" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("PJ")}
                >
                  PJ
                </Button>
                <Button
                  variant={filterType === "FINANCEIRO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("FINANCEIRO")}
                >
                  Financeiro
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {totalFiltered === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                {filterType === "ALL"
                  ? "Nenhuma consulta realizada ainda"
                  : `Nenhuma consulta do tipo ${TYPE_LABELS[filterType]}`}
              </p>
              <p className="text-sm text-muted-foreground">
                Suas consultas aparecerão aqui automaticamente
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {(Object.keys(filteredGroups) as TimeGroup[]).map((groupKey) => {
                const items = filteredGroups[groupKey]
                if (items.length === 0) return null

                return (
                  <div key={groupKey}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {GROUP_LABELS[groupKey]}
                      <span className="text-xs">({items.length})</span>
                    </h3>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <Badge className={TYPE_COLORS[item.type]}>
                              {TYPE_LABELS[item.type]}
                            </Badge>

                            <div className="flex-1">
                              <p className="font-medium">{item.queryLabel}</p>
                              {item.metadata?.name && (
                                <p className="text-sm text-muted-foreground">
                                  {item.metadata.name}
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {formatDateTime(item.timestamp)}
                              </p>
                              {item.resultsCount !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                  {item.resultsCount} resultado(s)
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRepeatSearch(item)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Refazer
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação para limpar histórico */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar todo o histórico?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as {stats.total} consultas
              serão permanentemente removidas do histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sim, limpar histórico
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
