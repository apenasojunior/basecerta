"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchHistory } from "@/hooks/useSearchHistory"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function SearchChart() {
  const { history } = useSearchHistory()

  const chartData = useMemo(() => {
    // Agrupa consultas por dia nos últimos 7 dias
    const today = new Date()
    const last7Days: Array<{
      date: Date
      dateStr: string
      PF: number
      PJ: number
      FINANCEIRO: number
      total: number
    }> = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      last7Days.push({
        date: date,
        dateStr: date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        PF: 0,
        PJ: 0,
        FINANCEIRO: 0,
        total: 0,
      })
    }

    // Conta consultas por dia e tipo
    history.forEach((item) => {
      const itemDate = new Date(item.timestamp)
      itemDate.setHours(0, 0, 0, 0)

      const dayData = last7Days.find(
        (d) => d.date.getTime() === itemDate.getTime()
      )

      if (dayData) {
        if (item.type === "PF") dayData.PF++
        else if (item.type === "PJ") dayData.PJ++
        else if (item.type === "FINANCEIRO") dayData.FINANCEIRO++
        dayData.total++
      }
    })

    return last7Days.map((day) => ({
      date: day.dateStr,
      PF: day.PF,
      PJ: day.PJ,
      Financeiro: day.FINANCEIRO,
      Total: day.total,
    }))
  }, [history])

  const totalQueries = useMemo(() => {
    return chartData.reduce((sum, day) => sum + day.Total, 0)
  }, [chartData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas - Últimos 7 dias</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: {totalQueries} consultas no período
        </p>
      </CardHeader>
      <CardContent>
        {totalQueries === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Nenhuma consulta nos últimos 7 dias</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
              />
              <Line
                type="monotone"
                dataKey="PF"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="PJ"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: "#a855f7", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Financeiro"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Total"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#64748b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
