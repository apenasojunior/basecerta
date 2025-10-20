"use client"

import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface FormInputProps extends InputProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  showSuccessIcon?: boolean
  containerClassName?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      hint,
      required,
      showSuccessIcon,
      containerClassName,
      id,
      className,
      variant,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`

    // Determina a variante baseado no estado
    const computedVariant = error ? "error" : showSuccessIcon ? "success" : variant

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        )}

        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            variant={computedVariant}
            className={className}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {showSuccessIcon && !error && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>

        {error && (
          <div
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"

export { FormInput }
