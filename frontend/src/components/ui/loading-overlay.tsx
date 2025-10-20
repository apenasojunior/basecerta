"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

export interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  label?: string
  fullscreen?: boolean
  blur?: boolean
  className?: string
}

export function LoadingOverlay({
  isLoading,
  children,
  label,
  fullscreen = false,
  blur = true,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative", fullscreen && "h-screen w-screen", className)}>
      {children}
      <div
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center",
          blur && "backdrop-blur-sm",
          "bg-background/80"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <Spinner size="xl" />
          {label && (
            <p className="text-sm font-medium text-foreground">{label}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading overlay para container específico
export function ContainerLoadingOverlay({
  isLoading,
  label,
}: {
  isLoading: boolean
  label?: string
}) {
  if (!isLoading) return null

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    </div>
  )
}
