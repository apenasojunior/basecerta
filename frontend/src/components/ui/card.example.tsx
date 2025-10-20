"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, DollarSign, TrendingUp } from "lucide-react"

/**
 * Card Component - Card base estendido com variantes e estados
 * 
 * @example
 * // Card padrão
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Título</CardTitle>
 *     <CardDescription>Descrição</CardDescription>
 *   </CardHeader>
 *   <CardContent>Conteúdo</CardContent>
 * </Card>
 * 
 * @example
 * // Card com variantes
 * <Card variant="elevated">...</Card>
 * <Card variant="outlined">...</Card>
 * <Card variant="interactive" onClick={() => {}>...</Card>
 * 
 * @example
 * // Card com loading
 * <Card isLoading={true} />
 * 
 * @example
 * // Card vazio
 * <Card isEmpty={true} emptyMessage="Nenhum dado encontrado" />
 */

export default function CardExample() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Card Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Variantes</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Sombra padrão</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card com estilo padrão e sombra leve.
                  </p>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Outlined Card</CardTitle>
                  <CardDescription>Borda destacada</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card com borda mais grossa, sem sombra.
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>Sombra elevada</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card com sombra mais pronunciada.
                  </p>
                </CardContent>
              </Card>

              <Card variant="interactive" onClick={() => alert("Card clicado!")}>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Clique para interagir</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card clicável com animações de hover.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Estados</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card isLoading={true} />
              
              <Card isEmpty={true} emptyMessage="Nenhum dado disponível" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Com Ícones e Footer</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Consultas Realizadas</CardTitle>
                      <CardDescription>Total este mês</CardDescription>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">1,234</p>
                  <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuários Ativos</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">856</p>
                      <p className="text-xs text-green-600">↑ 23%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Layout Complexo</h3>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Relatório Financeiro</CardTitle>
                    <CardDescription>Resumo do mês atual</CardDescription>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Receita</span>
                    <span className="text-lg font-semibold text-green-600">R$ 45.280,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Despesas</span>
                    <span className="text-lg font-semibold text-red-600">R$ 12.430,00</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lucro Líquido</span>
                      <span className="text-xl font-bold">R$ 32.850,00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Exportar
                </Button>
                <Button className="flex-1">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Análise
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
