import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white border border-transparent hover:bg-primary-700",
        secondary:
          "bg-gray-600 text-white border border-transparent hover:bg-gray-700",
        destructive:
          "bg-destructive text-destructive-foreground border border-transparent shadow hover:bg-destructive/80",
        outline: "text-foreground border border-gray-300 hover:bg-gray-50",
        success:
          "bg-success text-white border border-transparent hover:bg-success-dark",
        error:
          "bg-error text-white border border-transparent hover:bg-error-dark",
        warning:
          "bg-warning-dark text-gray-900 border border-transparent hover:bg-warning font-semibold",
        info:
          "bg-info text-white border border-transparent hover:bg-info-dark",
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
