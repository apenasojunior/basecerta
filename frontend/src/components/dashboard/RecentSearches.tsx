"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchHistory } from "@/hooks/useSearchHistory"
import { RotateCcw, ArrowRight, FileText, Users, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function RecentSearches() {
  const router = useRouter()
  const { getRecent } = useSearchHistory()

  const recentSearches = getRecent(5)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PF":
        return <Users className="h-3 w-3" />
      case "PJ":
        return <Building2 className="h-3 w-3" />
      case "FINANCEIRO":
        return <FileText className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PF":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "PJ":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "FINANCEIRO":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleRefazer = (item: any) => {
    let path = ""
    if (item.type === "PF") {
      path = `/produtos/dados-cadastrais-pf?cpf=${item.query}`
    } else if (item.type === "PJ") {
      path = `/produtos/dados-cadastrais-pj?cnpj=${item.query}`
    } else if (item.type === "FINANCEIRO") {
      const param = item.query.length === 11 ? "cpf" : "cnpj"
      path = `/produtos/dossie-financeiro?${param}=${item.query}`
    }

    if (path) {
      router.push(path)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins} min atrás`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h atrás`

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (recentSearches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Consultas Recentes</span>
            <Link href="/historico">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma consulta realizada ainda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Consultas Recentes</span>
          <Link href="/historico">
            <Button variant="ghost" size="sm" className="gap-2">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentSearches.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={`gap-1 ${getTypeColor(item.type)}`}
                  >
                    {getTypeIcon(item.type)}
                    {item.type}
                  </Badge>
                  <span className="text-sm font-medium truncate">
                    {item.queryLabel}
                  </span>
                </div>

                {item.metadata?.name && (
                  <p className="text-sm text-muted-foreground truncate">
                    {item.metadata.name}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(item.timestamp)}
                  </span>
                  {item.resultsCount !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {item.resultsCount} resultado{item.resultsCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRefazer(item)}
                className="gap-2 shrink-0 ml-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refazer
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
