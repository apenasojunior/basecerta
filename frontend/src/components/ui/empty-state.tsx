"use client"

import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export type EmptyStateVariant = "no-data" | "no-results" | "error" | "no-access"

interface EmptyStateProps {
  /**
   * Ícone a ser exibido (Lucide Icon)
   */
  icon?: LucideIcon
  /**
   * Título principal
   */
  title: string
  /**
   * Descrição/mensagem
   */
  description?: string
  /**
   * Variante do estado vazio
   * @default "no-data"
   */
  variant?: EmptyStateVariant
  /**
   * Texto do botão de ação primária
   */
  actionLabel?: string
  /**
   * Callback do botão de ação
   */
  onAction?: () => void
  /**
   * Texto do botão de ação secundária
   */
  secondaryActionLabel?: string
  /**
   * Callback do botão secundário
   */
  onSecondaryAction?: () => void
  /**
   * Desabilitar botões
   */
  disabled?: boolean
  /**
   * Conteúdo customizado adicional
   */
  children?: React.ReactNode
  /**
   * Usar card wrapper
   * @default false
   */
  withCard?: boolean
  /**
   * Tamanho do ícone
   * @default "lg"
   */
  iconSize?: "sm" | "md" | "lg" | "xl"
}

const iconSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
}

const variantStyles = {
  "no-data": {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  "no-results": {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  error: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  "no-access": {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  variant = "no-data",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  disabled = false,
  children,
  withCard = false,
  iconSize = "lg",
}: EmptyStateProps) {
  const styles = variantStyles[variant]

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-12 animate-fadeIn">
      {/* Ícone */}
      {Icon && (
        <div
          className={`mb-4 rounded-full p-4 sm:p-6 transition-all hover:scale-110 ${styles.iconBg}`}
        >
          <Icon className={`${iconSizes[iconSize]} ${styles.iconColor}`} />
        </div>
      )}

      {/* Título */}
      <h3 className="mb-2 text-base font-semibold sm:text-lg md:text-xl">
        {title}
      </h3>

      {/* Descrição */}
      {description && (
        <p className="mb-6 max-w-md text-xs text-muted-foreground sm:text-sm md:text-base">
          {description}
        </p>
      )}

      {/* Conteúdo customizado */}
      {children && <div className="mb-6 w-full">{children}</div>}

      {/* Botões de ação */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              disabled={disabled}
              className="transition-all hover:scale-[1.02] active:scale-95"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              disabled={disabled}
              variant="outline"
              className="transition-all hover:scale-[1.02] active:scale-95"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )

  if (withCard) {
    return <Card>{content}</Card>
  }

  return content
}

/**
 * Lista de sugestões/dicas para o usuário
 */
interface SuggestionsProps {
  items: string[]
}

export function EmptyStateSuggestions({ items }: SuggestionsProps) {
  return (
    <div className="flex flex-col gap-3 text-left text-xs text-muted-foreground sm:text-sm">
      <p className="font-medium">Sugestões:</p>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3 group">
          <div className="h-2 w-2 rounded-full bg-primary transition-all group-hover:scale-150" />
          <span className="transition-colors group-hover:text-foreground">
            {item}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Empty state compacto para usar em seções/tabelas
 */
export function EmptyStateInline({
  message = "Nenhum item encontrado",
  icon: Icon,
}: {
  message?: string
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-muted-foreground">
      {Icon && <Icon className="h-8 w-8" />}
      <p className="text-sm">{message}</p>
    </div>
  )
}
