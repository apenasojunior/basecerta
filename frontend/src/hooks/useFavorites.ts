"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "basecerta_favorites"
const MAX_FAVORITES = 50

export type FavoriteType = "PF" | "PJ" | "FINANCEIRO"

export interface FavoriteItem {
  id: string
  type: FavoriteType
  document: string // CPF ou CNPJ
  name: string
  timestamp: number
  metadata?: {
    status?: string
    uf?: string
    municipio?: string
  }
}

/**
 * Hook para gerenciar favoritos usando localStorage
 * Limite de 50 itens (FIFO - primeiro a entrar, primeiro a sair)
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carrega favoritos do localStorage na montagem
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteItem[]
        setFavorites(parsed)
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salva favoritos no localStorage sempre que mudar
  const saveFavorites = useCallback((items: FavoriteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      setFavorites(items)
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error)
    }
  }, [])

  /**
   * Adiciona um item aos favoritos
   * Se já existe, atualiza o timestamp
   * Se atingir o limite, remove o mais antigo (FIFO)
   */
  const addFavorite = useCallback(
    (item: Omit<FavoriteItem, "timestamp">) => {
      const newItem: FavoriteItem = {
        ...item,
        timestamp: Date.now(),
      }

      setFavorites((current) => {
        // Remove se já existe (para atualizar)
        const filtered = current.filter((fav) => fav.id !== item.id)

        // Adiciona no início
        let updated = [newItem, ...filtered]

        // Limita a 50 itens (remove os mais antigos)
        if (updated.length > MAX_FAVORITES) {
          updated = updated.slice(0, MAX_FAVORITES)
        }

        // Salva no localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch (error) {
          console.error("Erro ao salvar favorito:", error)
        }

        return updated
      })
    },
    []
  )

  /**
   * Remove um favorito por ID
   */
  const removeFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const updated = current.filter((fav) => fav.id !== id)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Erro ao remover favorito:", error)
      }

      return updated
    })
  }, [])

  /**
   * Verifica se um item está favoritado
   */
  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((fav) => fav.id === id)
    },
    [favorites]
  )

  /**
   * Toggle favorito (adiciona se não existe, remove se existe)
   */
  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, "timestamp">) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id)
      } else {
        addFavorite(item)
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  )

  /**
   * Retorna favoritos filtrados por tipo
   */
  const getFavoritesByType = useCallback(
    (type: FavoriteType) => {
      return favorites.filter((fav) => fav.type === type)
    },
    [favorites]
  )

  /**
   * Limpa todos os favoritos
   */
  const clearAllFavorites = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setFavorites([])
    } catch (error) {
      console.error("Erro ao limpar favoritos:", error)
    }
  }, [])

  /**
   * Retorna estatísticas dos favoritos
   */
  const getStats = useCallback(() => {
    const total = favorites.length
    const byType = {
      PF: favorites.filter((f) => f.type === "PF").length,
      PJ: favorites.filter((f) => f.type === "PJ").length,
      FINANCEIRO: favorites.filter((f) => f.type === "FINANCEIRO").length,
    }

    return {
      total,
      byType,
      remaining: MAX_FAVORITES - total,
      isFull: total >= MAX_FAVORITES,
    }
  }, [favorites])

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearAllFavorites,
    getStats,
  }
}
