"use client"

import { TrendingUp, TrendingDown, FileX, Ban, CreditCard, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export interface FinancialScoreData {
  creditScore: {
    value: number // 0-1000
    lastUpdate: string
    trend?: "up" | "down" | "stable"
  }
  protestos: {
    quantidade: number
    valorTotal: number
    ultimaOcorrencia?: string
  }
  dividasAtivas: {
    quantidade: number
    valorTotal: number
    porTipo?: {
      tributaria: number
      previdenciaria: number
      fgts: number
      trabalhista: number
    }
  }
  chequesSemFundo: {
    quantidade: number
    periodo: string // Ex: "Últimos 12 meses"
    valorTotal?: number
  }
}

interface FinancialScoreCardsProps {
  data: FinancialScoreData
  isLoading?: boolean
}

// Função helper para determinar cor do score
function getScoreColor(score: number): { bg: string; text: string; level: string } {
  if (score >= 601) {
    return { bg: "bg-green-500/10", text: "text-green-700 dark:text-green-400", level: "Excelente" }
  } else if (score >= 301) {
    return { bg: "bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400", level: "Regular" }
  } else {
    return { bg: "bg-red-500/10", text: "text-red-700 dark:text-red-400", level: "Baixo" }
  }
}

// Função para formatação de moeda
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function FinancialScoreCards({ data, isLoading = false }: FinancialScoreCardsProps) {
  const scoreColor = getScoreColor(data.creditScore.value)
  const scorePercentage = (data.creditScore.value / 1000) * 100

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-32 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card Score de Crédito */}
      <Card className={`border-2 transition-all hover:shadow-lg ${scoreColor.bg}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Score de Crédito</CardTitle>
          <CreditCard className={`h-4 w-4 ${scoreColor.text}`} />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${scoreColor.text}`}>
                {data.creditScore.value}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/1000</span>
              {data.creditScore.trend && (
                <Badge variant="outline" className="ml-auto">
                  {data.creditScore.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : data.creditScore.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  ) : null}
                  {data.creditScore.trend === "up" ? "↑" : data.creditScore.trend === "down" ? "↓" : "="}
                </Badge>
              )}
            </div>
            <Progress value={scorePercentage} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <Badge variant="secondary" className={scoreColor.text}>
                {scoreColor.level}
              </Badge>
              <span className="text-muted-foreground">
                Atualizado: {new Date(data.creditScore.lastUpdate).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Protestos */}
      <Card className={`border-2 transition-all hover:shadow-lg ${
        data.protestos.quantidade === 0 
          ? "bg-green-500/5 border-green-200 dark:border-green-800" 
          : "bg-red-500/5 border-red-200 dark:border-red-800"
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protestos</CardTitle>
          <FileX className={`h-4 w-4 ${
            data.protestos.quantidade === 0 ? "text-green-600" : "text-red-600"
          }`} />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${
                data.protestos.quantidade === 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}>
                {data.protestos.quantidade}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                {data.protestos.quantidade === 1 ? "protesto" : "protestos"}
              </span>
            </div>
            
            {data.protestos.quantidade > 0 ? (
              <>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">Valor Total: </span>
                  <span className="text-red-700 dark:text-red-400 font-bold">
                    {formatCurrency(data.protestos.valorTotal)}
                  </span>
                </div>
                {data.protestos.ultimaOcorrencia && (
                  <p className="text-xs text-muted-foreground">
                    Última: {new Date(data.protestos.ultimaOcorrencia).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ Nenhum protesto encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card Dívidas Ativas */}
      <Card className={`border-2 transition-all hover:shadow-lg ${
        data.dividasAtivas.quantidade === 0 
          ? "bg-green-500/5 border-green-200 dark:border-green-800" 
          : "bg-orange-500/5 border-orange-200 dark:border-orange-800"
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dívidas Ativas</CardTitle>
          <Ban className={`h-4 w-4 ${
            data.dividasAtivas.quantidade === 0 ? "text-green-600" : "text-orange-600"
          }`} />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${
                data.dividasAtivas.quantidade === 0 
                  ? "text-green-700 dark:text-green-400" 
                  : "text-orange-700 dark:text-orange-400"
              }`}>
                {data.dividasAtivas.quantidade}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                {data.dividasAtivas.quantidade === 1 ? "dívida" : "dívidas"}
              </span>
            </div>
            
            {data.dividasAtivas.quantidade > 0 ? (
              <>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">Valor Total: </span>
                  <span className="text-orange-700 dark:text-orange-400 font-bold">
                    {formatCurrency(data.dividasAtivas.valorTotal)}
                  </span>
                </div>
                {data.dividasAtivas.porTipo && (
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {data.dividasAtivas.porTipo.tributaria > 0 && (
                      <p>• Tributária: {formatCurrency(data.dividasAtivas.porTipo.tributaria)}</p>
                    )}
                    {data.dividasAtivas.porTipo.previdenciaria > 0 && (
                      <p>• Previdenciária: {formatCurrency(data.dividasAtivas.porTipo.previdenciaria)}</p>
                    )}
                    {data.dividasAtivas.porTipo.fgts > 0 && (
                      <p>• FGTS: {formatCurrency(data.dividasAtivas.porTipo.fgts)}</p>
                    )}
                    {data.dividasAtivas.porTipo.trabalhista > 0 && (
                      <p>• Trabalhista: {formatCurrency(data.dividasAtivas.porTipo.trabalhista)}</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ Nenhuma dívida ativa
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card Cheques sem Fundo */}
      <Card className={`border-2 transition-all hover:shadow-lg ${
        data.chequesSemFundo.quantidade === 0 
          ? "bg-green-500/5 border-green-200 dark:border-green-800" 
          : "bg-yellow-500/5 border-yellow-200 dark:border-yellow-800"
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cheques sem Fundo</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${
            data.chequesSemFundo.quantidade === 0 ? "text-green-600" : "text-yellow-600"
          }`} />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${
                data.chequesSemFundo.quantidade === 0 
                  ? "text-green-700 dark:text-green-400" 
                  : "text-yellow-700 dark:text-yellow-400"
              }`}>
                {data.chequesSemFundo.quantidade}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                {data.chequesSemFundo.quantidade === 1 ? "cheque" : "cheques"}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Período: {data.chequesSemFundo.periodo}
            </p>
            
            {data.chequesSemFundo.quantidade > 0 ? (
              data.chequesSemFundo.valorTotal && (
                <div className="text-sm">
                  <span className="font-semibold text-foreground">Valor Total: </span>
                  <span className="text-yellow-700 dark:text-yellow-400 font-bold">
                    {formatCurrency(data.chequesSemFundo.valorTotal)}
                  </span>
                </div>
              )
            ) : (
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ Nenhum cheque sem fundo
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
