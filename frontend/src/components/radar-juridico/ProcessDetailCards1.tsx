/**
 * Process Detail Cards - Part 1
 * Cards: Identificação, Tribunal, Datas
 */

'use client'

import { MapPin, Scale, Building2, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProcessoJuridico } from '@/mocks/radar-juridico-pf'

// ============================================
// 1. ProcessIdentificationCard
// ============================================
interface ProcessIdentificationCardProps {
  processo: ProcessoJuridico
}

export function ProcessIdentificationCard({ processo }: ProcessIdentificationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="h-5 w-5 text-primary" />
          Identificação do Processo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Número do Processo</p>
            <p className="text-base font-semibold text-gray-900 font-mono">
              {processo.numero}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tribunal</p>
              <p className="text-base font-medium text-gray-900">{processo.tribunal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipo</p>
              <p className="text-base font-medium text-gray-900">
                {processo.tipo.charAt(0) + processo.tipo.slice(1).toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Comarca</p>
            <p className="text-base font-medium text-gray-900">{processo.comarca}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 2. ProcessCourtCard
// ============================================
interface ProcessCourtCardProps {
  processo: ProcessoJuridico
}

export function ProcessCourtCard({ processo }: ProcessCourtCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Informações do Tribunal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tribunal</p>
            <p className="text-base font-semibold text-gray-900">{processo.tribunal}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Vara</p>
            <p className="text-base font-medium text-gray-900">{processo.vara}</p>
          </div>
          
          <div className="flex items-start gap-2 pt-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Localização</p>
              <p className="text-base font-medium text-gray-900">{processo.comarca}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 3. ProcessDatesCard
// ============================================
interface ProcessDatesCardProps {
  processo: ProcessoJuridico
}

export function ProcessDatesCard({ processo }: ProcessDatesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Datas Importantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Distribuição</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(processo.dataDistribuicao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Última Movimentação</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(processo.dataUltimaMovimentacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">
              Processo em tramitação há{' '}
              {Math.floor(
                (new Date().getTime() - new Date(processo.dataDistribuicao).getTime()) /
                (1000 * 60 * 60 * 24)
              )}{' '}
              dias
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
