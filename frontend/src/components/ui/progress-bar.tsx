"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number // 0-100 para determinado, undefined para indeterminado
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ProgressBar({
  value,
  showLabel = false,
  size = "md",
  className,
  ...props
}: ProgressBarProps) {
  const isIndeterminate = value === undefined

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className="w-full space-y-1">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className
        )}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-primary transition-all duration-300 ease-in-out",
            isIndeterminate && "animate-progress-indeterminate"
          )}
          style={{
            width: isIndeterminate ? "40%" : `${value}%`,
          }}
        />
      </div>
      
      {showLabel && !isIndeterminate && (
        <p className="text-right text-xs text-muted-foreground">
          {value}%
        </p>
      )}
    </div>
  )
}

// Progress circular (opcional para futuro)
export function CircularProgress({ value, size = 40 }: { value?: number; size?: number }) {
  const isIndeterminate = value === undefined
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const offset = isIndeterminate ? 0 : circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "text-primary transition-all duration-300 ease-in-out",
            isIndeterminate && "animate-spin"
          )}
        />
      </svg>
      {!isIndeterminate && (
        <span className="absolute text-xs font-medium">{value}%</span>
      )}
    </div>
  )
}
