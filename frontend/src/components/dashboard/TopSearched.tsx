"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchHistory } from "@/hooks/useSearchHistory"
import { TrendingUp, Users, Building2, FileText } from "lucide-react"

export function TopSearched() {
  const { history } = useSearchHistory()

  const topDocuments = useMemo(() => {
    // Conta frequência de cada documento
    const frequencyMap = new Map<
      string,
      {
        query: string
        queryLabel: string
        type: string
        count: number
        lastSearch: number
        name?: string
      }
    >()

    history.forEach((item) => {
      const key = item.query
      const existing = frequencyMap.get(key)

      if (existing) {
        existing.count++
        existing.lastSearch = Math.max(existing.lastSearch, item.timestamp)
      } else {
        frequencyMap.set(key, {
          query: item.query,
          queryLabel: item.queryLabel,
          type: item.type,
          count: 1,
          lastSearch: item.timestamp,
          name: item.metadata?.name,
        })
      }
    })

    // Converte para array e ordena por frequência
    return Array.from(frequencyMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [history])

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

  if (topDocuments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top 5 Mais Consultados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma consulta realizada ainda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top 5 Mais Consultados
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Documentos consultados com mais frequência
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topDocuments.map((doc, index) => (
            <div
              key={doc.query}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                <span className="text-sm font-bold text-primary">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={`gap-1 ${getTypeColor(doc.type)}`}
                  >
                    {getTypeIcon(doc.type)}
                    {doc.type}
                  </Badge>
                  <span className="text-sm font-medium truncate">
                    {doc.queryLabel}
                  </span>
                </div>

                {doc.name && (
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.name}
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary">{doc.count}</p>
                <p className="text-xs text-muted-foreground">
                  consulta{doc.count > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
