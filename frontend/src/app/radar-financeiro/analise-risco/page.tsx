/**
 * Placeholder - Análise de Risco
 * Esta página será implementada em sprint futura
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AnaliseRiscoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-100 rounded-full">
                <Shield className="h-16 w-16 text-purple-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Análise de Risco
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Esta funcionalidade será implementada em breve. Por enquanto, retorne ao menu principal.
              </p>
            </div>
            
            <div className="pt-4">
              <Link href="/radar-financeiro">
                <Button size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Radar Financeiro
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
