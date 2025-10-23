/**
 * Skeleton para Página de Busca - Radar Jurídico PF
 * Usado durante carregamento inicial para melhorar LCP/CLS
 */

import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Scale, Info } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function RadarJuridicoPFSearchSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Radar Jurídico - Pessoa Física</h1>
              <p className="text-gray-600 mt-1">
                Consulte processos jurídicos em todos os tribunais do Brasil
              </p>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              O Radar Jurídico pesquisa processos em mais de 90 tribunais brasileiros, incluindo
              TJSP, TRT, STJ, TST e tribunais estaduais.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-3 gap-6" style={{ minHeight: '700px' }}>
          {/* Coluna Principal - Busca */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="grid md:grid-cols-4 gap-4" style={{ minHeight: '120px' }}>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-16" />
                        {i === 3 && <Skeleton className="h-3 w-20 mt-2" />}
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Formulário de Busca Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-64 mb-2" />
                <CardDescription>
                  <Skeleton className="h-4 w-96" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* CPF Input Skeleton */}
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Info Box Skeleton */}
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Skeleton className="h-5 w-64 mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <Skeleton key={i} className="h-4 w-full max-w-sm" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral Skeleton */}
          <div className="space-y-6">
            {/* Exemplos de CPF Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40 mb-2" />
                <CardDescription>
                  <Skeleton className="h-4 w-48" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dicas Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custo Skeleton */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto mb-2" />
                  <Skeleton className="h-9 w-28 mx-auto mb-2" />
                  <Skeleton className="h-3 w-48 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
