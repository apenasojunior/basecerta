import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-x-7 [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default: "bg-background border",
        success: "bg-success-light border-l-4 border-success text-success-dark",
        error: "bg-error-light border-l-4 border-error text-error-dark",
        warning: "bg-warning-light border-l-4 border-warning text-warning-dark",
        info: "bg-info-light border-l-4 border-info text-info-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: null,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", dismissible = false, onDismiss, children, ...props }, ref) => {
    const [isDismissed, setIsDismissed] = React.useState(false)

    const handleDismiss = () => {
      setIsDismissed(true)
      onDismiss?.()
    }

    if (isDismissed) return null

    const Icon = iconMap[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Fechar alerta"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
