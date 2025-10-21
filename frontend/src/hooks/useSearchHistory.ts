"use client"

import { useState, useEffect, useCallback } from "react"
import { FavoriteType } from "./useFavorites"

const STORAGE_KEY = "basecerta_search_history"
const MAX_HISTORY = 20

export interface HistoryItem {
  id: string
  type: FavoriteType
  query: string // CPF, CNPJ ou outro identificador
  queryLabel: string // Label formatado para exibição
  timestamp: number
  resultsCount?: number
  metadata?: {
    name?: string
    status?: string
  }
}

export type TimeGroup = "today" | "yesterday" | "thisWeek" | "older"

/**
 * Hook para gerenciar histórico de consultas usando localStorage
 * Limite de 20 itens (FIFO - primeiro a entrar, primeiro a sair)
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carrega histórico do localStorage na montagem
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryItem[]
        setHistory(parsed)
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Adiciona uma consulta ao histórico
   * Se atingir o limite, remove a mais antiga (FIFO)
   */
  const addSearch = useCallback((item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${item.type}-${item.query}-${Date.now()}`,
      timestamp: Date.now(),
    }

    setHistory((current) => {
      // Adiciona no início (mais recente)
      let updated = [newItem, ...current]

      // Limita a 20 itens (remove os mais antigos)
      if (updated.length > MAX_HISTORY) {
        updated = updated.slice(0, MAX_HISTORY)
      }

      // Salva no localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Erro ao salvar histórico:", error)
      }

      return updated
    })
  }, [])

  /**
   * Remove um item do histórico por ID
   */
  const removeItem = useCallback((id: string) => {
    setHistory((current) => {
      const updated = current.filter((item) => item.id !== id)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Erro ao remover item do histórico:", error)
      }

      return updated
    })
  }, [])

  /**
   * Limpa todo o histórico
   */
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setHistory([])
    } catch (error) {
      console.error("Erro ao limpar histórico:", error)
    }
  }, [])

  /**
   * Retorna histórico filtrado por tipo
   */
  const getHistoryByType = useCallback(
    (type: FavoriteType) => {
      return history.filter((item) => item.type === type)
    },
    [history]
  )

  /**
   * Agrupa histórico por período temporal
   */
  const getGroupedHistory = useCallback(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const groups: Record<TimeGroup, HistoryItem[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    }

    history.forEach((item) => {
      const itemDate = new Date(item.timestamp)
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())

      if (itemDay.getTime() === today.getTime()) {
        groups.today.push(item)
      } else if (itemDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(item)
      } else if (itemDate >= weekAgo) {
        groups.thisWeek.push(item)
      } else {
        groups.older.push(item)
      }
    })

    return groups
  }, [history])

  /**
   * Retorna estatísticas do histórico
   */
  const getStats = useCallback(() => {
    const total = history.length
    const byType = {
      PF: history.filter((h) => h.type === "PF").length,
      PJ: history.filter((h) => h.type === "PJ").length,
      FINANCEIRO: history.filter((h) => h.type === "FINANCEIRO").length,
    }

    // Últimas 24 horas
    const last24h = history.filter((item) => {
      const hoursDiff = (Date.now() - item.timestamp) / (1000 * 60 * 60)
      return hoursDiff <= 24
    }).length

    return {
      total,
      byType,
      last24h,
      remaining: MAX_HISTORY - total,
      isFull: total >= MAX_HISTORY,
    }
  }, [history])

  /**
   * Retorna as N consultas mais recentes
   */
  const getRecent = useCallback(
    (limit: number = 5) => {
      return history.slice(0, limit)
    },
    [history]
  )

  return {
    history,
    isLoading,
    addSearch,
    removeItem,
    clearHistory,
    getHistoryByType,
    getGroupedHistory,
    getStats,
    getRecent,
  }
}
