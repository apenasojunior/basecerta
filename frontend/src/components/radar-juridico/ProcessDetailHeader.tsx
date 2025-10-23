/**
 * ProcessDetailHeader Component
 * Header para página de detalhamento de processo
 */

'use client'

import { ArrowLeft, Scale, Share2, FileDown } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProcessoJuridico } from '@/mocks/radar-juridico-pf'

interface ProcessDetailHeaderProps {
  processo: ProcessoJuridico
}

// Mapeamento de cores por status
const statusColors: Record<ProcessoJuridico['status'], { bg: string; text: string }> = {
  EM_ANDAMENTO: { bg: 'bg-green-100', text: 'text-green-800' },
  SUSPENSO: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  ARQUIVADO: { bg: 'bg-gray-100', text: 'text-gray-800' },
  SENTENCIADO: { bg: 'bg-blue-100', text: 'text-blue-800' },
  RECURSO: { bg: 'bg-purple-100', text: 'text-purple-800' },
}

// Mapeamento de cores por tipo
const tipoColors: Record<ProcessoJuridico['tipo'], { bg: string; text: string }> = {
  CIVEL: { bg: 'bg-blue-100', text: 'text-blue-800' },
  TRABALHISTA: { bg: 'bg-green-100', text: 'text-green-800' },
  CRIMINAL: { bg: 'bg-red-100', text: 'text-red-800' },
  TRIBUTARIO: { bg: 'bg-orange-100', text: 'text-orange-800' },
  FAMILIA: { bg: 'bg-purple-100', text: 'text-purple-800' },
}

// Formatação de labels
const statusLabels: Record<ProcessoJuridico['status'], string> = {
  EM_ANDAMENTO: 'Em Andamento',
  SUSPENSO: 'Suspenso',
  ARQUIVADO: 'Arquivado',
  SENTENCIADO: 'Sentenciado',
  RECURSO: 'Recurso',
}

const tipoLabels: Record<ProcessoJuridico['tipo'], string> = {
  CIVEL: 'Cível',
  TRABALHISTA: 'Trabalhista',
  CRIMINAL: 'Criminal',
  TRIBUTARIO: 'Tributário',
  FAMILIA: 'Família',
}

export function ProcessDetailHeader({ processo }: ProcessDetailHeaderProps) {
  // Detectar se é CPF (11 dígitos) ou CNPJ (14 dígitos) pelo formato
  const documento = processo.cpfConsultado
  const cleanDocumento = documento.replace(/\D/g, '') // Remover formatação para URL
  const isCNPJ = cleanDocumento.length === 14
  const baseUrl = isCNPJ ? '/radar-juridico/pj' : '/radar-juridico/pf'
  
  return (
    <div className="space-y-4">
      {/* Breadcrumb e Voltar */}
      <div className="flex items-center gap-2">
        <Link 
          href={`${baseUrl}/${cleanDocumento}`}
          className="text-sm text-gray-600 hover:text-primary"
        >
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista
          </Button>
        </Link>
      </div>
      
      {/* Card Principal */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Número do Processo e Ícone */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Processo {processo.numero}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {processo.tribunal}
                    </Badge>
                    
                    <Badge 
                      className={`${tipoColors[processo.tipo].bg} ${tipoColors[processo.tipo].text} border-0`}
                    >
                      {tipoLabels[processo.tipo]}
                    </Badge>
                    
                    <Badge 
                      className={`${statusColors[processo.status].bg} ${statusColors[processo.status].text} border-0`}
                    >
                      {statusLabels[processo.status]}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
            
            {/* Assunto */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Assunto</p>
              <p className="text-lg font-semibold text-gray-900">
                {processo.assunto}
              </p>
            </div>
            
            {/* Informações Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-600 mb-1">Comarca</p>
                <p className="text-sm font-medium text-gray-900">{processo.comarca}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Vara</p>
                <p className="text-sm font-medium text-gray-900">{processo.vara}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Distribuição</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(processo.dataDistribuicao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Última Movimentação</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(processo.dataUltimaMovimentacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
