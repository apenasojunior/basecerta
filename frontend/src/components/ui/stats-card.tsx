"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowDown, ArrowUp, LucideIcon, Minus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const statsCardVariants = cva("", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    trend: {
      positive: "text-green-600",
      negative: "text-red-600",
      neutral: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    trend: "neutral",
  },
})

export interface StatsCardProps
  extends Omit<React.ComponentProps<typeof Card>, "variant">,
    VariantProps<typeof statsCardVariants> {
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: "positive" | "negative" | "neutral"
  trendValue?: string | number
  trendLabel?: string
  isLoading?: boolean
  variant?: "default" | "outlined" | "elevated" | "interactive"
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  trendValue,
  trendLabel,
  size = "md",
  isLoading = false,
  variant = "default",
  className,
  ...props
}: StatsCardProps) {
  const TrendIcon =
    trend === "positive"
      ? ArrowUp
      : trend === "negative"
      ? ArrowDown
      : Minus

  const sizeClasses = {
    sm: {
      value: "text-xl",
      title: "text-xs",
      icon: "h-4 w-4",
      iconBg: "h-8 w-8",
      padding: "p-4",
    },
    md: {
      value: "text-2xl",
      title: "text-sm",
      icon: "h-5 w-5",
      iconBg: "h-10 w-10",
      padding: "p-6",
    },
    lg: {
      value: "text-3xl",
      title: "text-base",
      icon: "h-6 w-6",
      iconBg: "h-12 w-12",
      padding: "p-8",
    },
  }

  const sizes = sizeClasses[size || "md"]

  if (isLoading) {
    return (
      <Card variant={variant} className={className} {...props}>
        <div className={cn("space-y-3", sizes.padding)}>
          <div className="flex items-center justify-between">
            <Skeleton className={cn("h-4", size === "sm" ? "w-16" : "w-24")} />
            <Skeleton className={cn("rounded-full", sizes.iconBg)} />
          </div>
          <Skeleton className={cn("h-8", size === "sm" ? "w-20" : "w-32")} />
          <Skeleton className="h-3 w-20" />
        </div>
      </Card>
    )
  }

  return (
    <Card variant={variant} className={className} {...props}>
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", sizes.padding, "pb-2")}>
        <p className={cn("font-medium text-muted-foreground", sizes.title)}>
          {title}
        </p>
        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-primary/10",
              sizes.iconBg
            )}
          >
            <Icon className={cn("text-primary", sizes.icon)} />
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(sizes.padding, "pt-0")}>
        <div className="space-y-1">
          <p className={cn("font-bold tracking-tight", sizes.value)}>
            {value}
          </p>
          {(trendValue || trendLabel) && (
            <div className="flex items-center gap-1 text-xs">
              {trendValue && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 font-medium",
                    statsCardVariants({ trend })
                  )}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span>{trendValue}</span>
                </div>
              )}
              {trendLabel && (
                <span className="text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Variante simplificada sem CardHeader/CardContent para melhor controle
export function StatsCardSimple({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  trendValue,
  trendLabel,
  size = "md",
  isLoading = false,
  variant = "default",
  className,
  ...props
}: StatsCardProps) {
  const TrendIcon =
    trend === "positive"
      ? ArrowUp
      : trend === "negative"
      ? ArrowDown
      : Minus

  const sizeClasses = {
    sm: { value: "text-xl", title: "text-xs", icon: "h-4 w-4", iconBg: "h-8 w-8", padding: "p-4" },
    md: { value: "text-2xl", title: "text-sm", icon: "h-5 w-5", iconBg: "h-10 w-10", padding: "p-6" },
    lg: { value: "text-3xl", title: "text-base", icon: "h-6 w-6", iconBg: "h-12 w-12", padding: "p-8" },
  }

  const sizes = sizeClasses[size || "md"]

  if (isLoading) {
    return (
      <div
        className={cn(
          "space-y-3 rounded-xl border bg-card shadow",
          sizes.padding,
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className={cn("rounded-full", sizes.iconBg)} />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "space-y-2 rounded-xl border bg-card shadow transition-all duration-200",
        variant === "elevated" && "shadow-lg",
        variant === "interactive" && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        sizes.padding,
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className={cn("font-medium text-muted-foreground", sizes.title)}>
          {title}
        </p>
        {Icon && (
          <div className={cn("flex items-center justify-center rounded-full bg-primary/10", sizes.iconBg)}>
            <Icon className={cn("text-primary", sizes.icon)} />
          </div>
        )}
      </div>
      
      <p className={cn("font-bold tracking-tight", sizes.value)}>{value}</p>
      
      {(trendValue || trendLabel) && (
        <div className="flex items-center gap-1 text-xs">
          {trendValue && (
            <div className={cn("flex items-center gap-0.5 font-medium", statsCardVariants({ trend }))}>
              <TrendIcon className="h-3 w-3" />
              <span>{trendValue}</span>
            </div>
          )}
          {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
