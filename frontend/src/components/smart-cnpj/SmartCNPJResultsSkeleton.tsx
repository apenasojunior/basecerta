import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Filter, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SmartCNPJResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="hidden sm:flex">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" disabled className="hidden sm:flex">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" disabled className="sm:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ minHeight: '600px' }}>
        {/* Filter Panel Skeleton - Desktop */}
        <div className="hidden lg:block">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Filter Sections */}
              {[1, 2, 3].map((section) => (
                <div key={section} className="space-y-2 pb-4 border-b">
                  <Skeleton className="h-4 w-32 mb-3" />
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results List Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          {/* Result Cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Company Icon + Name */}
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
                      {[1, 2, 3, 4].map((detail) => (
                        <div key={detail} className="space-y-1">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
