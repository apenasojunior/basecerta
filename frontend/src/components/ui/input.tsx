import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-1 focus-visible:ring-ring",
        error: "border-destructive focus-visible:ring-1 focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-1 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-1 focus-visible:ring-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, prefixIcon, suffixIcon, ...props }, ref) => {
    if (prefixIcon || suffixIcon) {
      return (
        <div className="relative">
          {prefixIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {prefixIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant }),
              prefixIcon && "pl-10",
              suffixIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffixIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffixIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
