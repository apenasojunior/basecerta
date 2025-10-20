"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

export function Spinner({ size, className, label, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || "Carregando"}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size }))} />
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}

// Spinner centralizado para páginas
export function SpinnerPage({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="xl" label={label} />
        {label && (
          <p className="text-sm text-muted-foreground">{label}</p>
        )}
      </div>
    </div>
  )
}
