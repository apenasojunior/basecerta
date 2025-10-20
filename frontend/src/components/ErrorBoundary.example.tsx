"use client"

import { useState } from "react"
import { ErrorBoundary, InlineErrorBoundary } from "@/components/ErrorBoundary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Componente que lança erro para testar Error Boundary
 */
function BuggyComponent({ shouldError }: { shouldError: boolean }) {
  if (shouldError) {
    throw new Error("💥 Erro de demonstração!")
  }
  return <div className="text-green-600">✅ Componente funcionando!</div>
}

/**
 * Componente que pode falhar assincronamente
 */
function AsyncBuggyComponent() {
  const [count, setCount] = useState(0)

  if (count > 3) {
    throw new Error("Contador passou de 3!")
  }

  return (
    <div className="space-y-2">
      <p>Contador: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Incrementar</Button>
      <p className="text-xs text-muted-foreground">
        (Vai quebrar quando passar de 3)
      </p>
    </div>
  )
}

export function ErrorBoundaryExamples() {
  const [showError, setShowError] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleReset = () => {
    setShowError(false)
    setResetKey(resetKey + 1)
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Error Boundary Examples</h1>

      {/* Exemplo 1: Error Boundary Básico */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Error Boundary Básico</h2>
        <Card>
          <CardHeader>
            <CardTitle>Teste de Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShowError(!showError)}>
              {showError ? "Esconder Erro" : "Mostrar Erro"}
            </Button>

            <ErrorBoundary key={resetKey}>
              <BuggyComponent shouldError={showError} />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </section>

      {/* Exemplo 2: Error Boundary com Callback */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Com Logging Customizado</h2>
        <Card>
          <CardContent className="pt-6">
            <ErrorBoundary
              onError={(error, errorInfo) => {
                console.error("🚨 Erro capturado:", error)
                console.error("📍 Stack:", errorInfo.componentStack)
                // Aqui você poderia enviar para Sentry, LogRocket, etc
              }}
              showDetails
            >
              <AsyncBuggyComponent />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </section>

      {/* Exemplo 3: Inline Error Boundary */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          3. Inline Error Boundary (Seções)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <InlineErrorBoundary
            title="Erro ao carregar widgets"
            onRetry={() => console.log("Retry widgets")}
          >
            <Card>
              <CardHeader>
                <CardTitle>Widget 1</CardTitle>
              </CardHeader>
              <CardContent>
                <BuggyComponent shouldError={true} />
              </CardContent>
            </Card>
          </InlineErrorBoundary>

          <InlineErrorBoundary
            title="Erro ao carregar estatísticas"
            onRetry={() => console.log("Retry stats")}
          >
            <Card>
              <CardHeader>
                <CardTitle>Widget 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Este está funcionando! ✅</p>
              </CardContent>
            </Card>
          </InlineErrorBoundary>
        </div>
      </section>

      {/* Exemplo 4: Fallback Customizado */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Fallback Customizado</h2>
        <ErrorBoundary
          fallback={
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-destructive">
                    🔥 Algo deu muito errado!
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fallback customizado
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="mt-4"
                  >
                    Resetar
                  </Button>
                </div>
              </CardContent>
            </Card>
          }
        >
          <BuggyComponent shouldError={true} />
        </ErrorBoundary>
      </section>

      {/* Exemplo 5: Múltiplos Boundaries */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          5. Múltiplos Error Boundaries (Isolamento)
        </h2>
        <p className="text-sm text-muted-foreground">
          Cada seção tem seu próprio boundary. Se uma quebrar, as outras
          continuam funcionando.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((num) => (
            <ErrorBoundary key={num}>
              <Card>
                <CardHeader>
                  <CardTitle>Seção {num}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BuggyComponent shouldError={num === 2} />
                </CardContent>
              </Card>
            </ErrorBoundary>
          ))}
        </div>
      </section>

      {/* Dicas */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">💡 Boas Práticas</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span>✅</span>
                <span>
                  Use Error Boundaries em torno de features grandes (páginas,
                  seções)
                </span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>
                  Use InlineErrorBoundary para widgets/componentes independentes
                </span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>
                  Configure logging (onError) para enviar erros para serviços
                  como Sentry
                </span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>
                  Use key prop para forçar reset quando necessário
                </span>
              </li>
              <li className="flex gap-2">
                <span>⚠️</span>
                <span>
                  Error Boundaries não capturam erros em event handlers (use
                  try/catch)
                </span>
              </li>
              <li className="flex gap-2">
                <span>⚠️</span>
                <span>
                  Error Boundaries não capturam erros assíncronos (useEffect,
                  setTimeout)
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default ErrorBoundaryExamples
