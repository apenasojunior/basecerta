"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface FormFieldProps {
  children: React.ReactNode
  label?: string
  error?: string
  hint?: string
  required?: boolean
  htmlFor?: string
  className?: string
  labelClassName?: string
}

export function FormField({
  children,
  label,
  error,
  hint,
  required,
  htmlFor,
  className,
  labelClassName,
}: FormFieldProps) {
  const fieldId = htmlFor || `field-${React.useId()}`

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={fieldId} className={cn("text-sm font-medium", labelClassName)}>
          {label}
          {required && <span className="ml-1 text-destructive" aria-label="obrigatório">*</span>}
        </Label>
      )}

      {children}

      {error && (
        <div
          className="flex items-center gap-1.5 text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <p className="text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
