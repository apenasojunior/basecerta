/**
 * Página de Detalhamento de Processo - Radar Jurídico
 * Exibe todas as informações detalhadas de um processo jurídico
 */

'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProcessDetailHeader } from '@/components/radar-juridico/ProcessDetailHeader'
import { 
  ProcessIdentificationCard,
  ProcessCourtCard,
  ProcessDatesCard 
} from '@/components/radar-juridico/ProcessDetailCards1'
import {
  ProcessStatusCard,
  ProcessValuesCard,
  ProcessPartiesCard
} from '@/components/radar-juridico/ProcessDetailCards2'
import {
  ProcessSubjectsCard,
  ProcessTimelineCard,
  RelatedProcessesCard,
  ProcessDocumentsCard
} from '@/components/radar-juridico/ProcessDetailCards3'
import { searchProcessoByNumero } from '@/mocks/radar-juridico-pf'
import { searchProcessoByNumeroPJ } from '@/mocks/radar-juridico-pj'

interface PageProps {
  params: Promise<{ numero: string }>
}

export default function ProcessDetailPage({ params }: PageProps) {
  const { numero } = use(params)
  
  // Decodificar número do processo da URL
  const numeroProcesso = decodeURIComponent(numero)
  
  // Buscar processo em PF e PJ
  const processo = searchProcessoByNumero(numeroProcesso) || searchProcessoByNumeroPJ(numeroProcesso)
  
  // Estado de não encontrado
  if (!processo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processo não encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Não foram encontrados dados para o processo <span className="font-mono">{numeroProcesso}</span>
              </p>
              <Link href="/radar-juridico/pf/search">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Busca
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header do Processo */}
        <ProcessDetailHeader processo={processo} />
        
        {/* Alert informativo */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-sm text-blue-900">
            💡 Estas informações são atualizadas diariamente com base nos tribunais de origem.
            Última atualização: {new Date(processo.dataUltimaMovimentacao).toLocaleDateString('pt-BR')}
          </AlertDescription>
        </Alert>
        
        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* 1. Identificação */}
            <ProcessIdentificationCard processo={processo} />
            
            {/* 2. Tribunal */}
            <ProcessCourtCard processo={processo} />
            
            {/* 3. Datas */}
            <ProcessDatesCard processo={processo} />
            
            {/* 4. Status */}
            <ProcessStatusCard processo={processo} />
            
            {/* 5. Valores */}
            <ProcessValuesCard processo={processo} />
          </div>
          
          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* 6. Partes */}
            <ProcessPartiesCard processo={processo} />
            
            {/* 7. Assuntos */}
            <ProcessSubjectsCard processo={processo} />
            
            {/* 9. Processos Relacionados */}
            <RelatedProcessesCard processo={processo} />
            
            {/* 10. Documentos */}
            <ProcessDocumentsCard processo={processo} />
          </div>
        </div>
        
        {/* Timeline (Full Width) */}
        <div className="mt-6">
          <ProcessTimelineCard processo={processo} />
        </div>
      </div>
    </div>
  )
}
