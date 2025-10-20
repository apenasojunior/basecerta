"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Captura erros de React e exibe UI de fallback
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Com fallback customizado:
 * ```tsx
 * <ErrorBoundary fallback={<div>Algo deu errado!</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Chama callback opcional para logging externo
    this.props.onError?.(error, errorInfo)
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleGoHome = () => {
    window.location.href = "/"
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // Usa fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback
      }

      // UI de erro padrão
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle>Algo deu errado!</CardTitle>
                  <CardDescription>
                    Um erro inesperado ocorreu. Por favor, tente novamente.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mensagem de erro */}
              {this.state.error && (
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                  <p className="text-sm font-medium text-destructive mb-2">
                    Erro:
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Stack trace (apenas em desenvolvimento) */}
              {this.props.showDetails &&
                this.state.errorInfo &&
                process.env.NODE_ENV === "development" && (
                  <details className="rounded-lg bg-muted p-4">
                    <summary className="cursor-pointer text-sm font-medium mb-2">
                      Detalhes técnicos
                    </summary>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir para Home
                </Button>
              </div>

              {/* Dica */}
              <p className="text-xs text-muted-foreground text-center">
                Se o problema persistir, tente recarregar a página ou entre em contato
                com o suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Error Boundary específico para seções da página
 * Exibe uma mensagem mais compacta inline
 */
export function InlineErrorBoundary({
  children,
  title = "Erro ao carregar",
  onRetry,
}: {
  children: ReactNode
  title?: string
  onRetry?: () => void
}) {
  return (
    <ErrorBoundary
      fallback={
        <Card className="border-destructive/50">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">
                  Ocorreu um erro ao carregar este conteúdo.
                </p>
              </div>
              {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
