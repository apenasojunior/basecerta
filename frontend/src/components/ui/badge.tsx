import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-primary-700 border border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground border border-transparent shadow hover:bg-destructive/80",
        outline: "text-foreground border",
        success:
          "bg-success-light text-success-dark border border-transparent",
        error:
          "bg-error-light text-error-dark border border-transparent",
        warning:
          "bg-warning-light text-warning-dark border border-transparent",
        info:
          "bg-info-light text-info-dark border border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
