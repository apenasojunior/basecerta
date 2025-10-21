"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFavorites, type FavoriteItem } from "@/hooks/useFavorites"
import { toast } from "@/lib/toast"

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, "timestamp">
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  className?: string
}

/**
 * Botão de favorito com animação de star
 * Integra automaticamente com useFavorites
 */
export function FavoriteButton({
  item,
  variant = "ghost",
  size = "sm",
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, getStats } = useFavorites()
  const favorited = isFavorite(item.id)
  const stats = getStats()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita trigger de eventos do pai (ex: row click)

    // Verifica limite antes de adicionar
    if (!favorited && stats.isFull) {
      toast.warning(`Limite de ${stats.total} favoritos atingido. Remova alguns para adicionar novos.`)
      return
    }

    toggleFavorite(item)

    if (!favorited) {
      toast.success("Adicionado aos favoritos")
    } else {
      toast.success("Removido dos favoritos")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "transition-all duration-200",
        favorited && "text-yellow-500 hover:text-yellow-600",
        className
      )}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-all duration-200",
          favorited && "fill-yellow-500 scale-110"
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {favorited ? "Favoritado" : "Favoritar"}
        </span>
      )}
    </Button>
  )
}
