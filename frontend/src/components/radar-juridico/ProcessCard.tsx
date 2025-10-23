/**
 * ProcessCard Component
 * Card para exibição individual de processo jurídico
 */

'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, DollarSign, MapPin, Scale } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProcessoJuridico } from '@/mocks/radar-juridico-pf'

interface ProcessCardProps {
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

export function ProcessCard({ processo }: ProcessCardProps) {
  // Separar partes por tipo
  const autores = processo.partes
    .filter(p => p.tipo === 'AUTOR')
    .map(p => p.nome)
  
  const reus = processo.partes
    .filter(p => p.tipo === 'REU')
    .map(p => p.nome)
  
  // Data da última movimentação
  const ultimaMovimentacao = processo.movimentacoes.length > 0
    ? new Date(processo.movimentacoes[0].data).toLocaleDateString('pt-BR')
    : null
  
  // Encode do número do processo para URL
  const numeroEncoded = encodeURIComponent(processo.numero)
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Cabeçalho: Número e Badges */}
          <div className="space-y-3">
            <Link 
              href={`/radar-juridico/processo/${numeroEncoded}`}
              className="text-lg font-semibold text-primary hover:underline inline-flex items-center gap-2"
            >
              <Scale className="h-4 w-4" />
              {processo.numero}
            </Link>
            
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
          
          {/* Assunto */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {processo.assunto}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{processo.vara} - {processo.comarca}</span>
            </div>
          </div>
          
          {/* Partes */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1">Polo Ativo</p>
                <p className="font-medium text-gray-900 truncate">
                  {autores.length > 0 ? autores.slice(0, 2).join(', ') : processo.poloAtivo}
                  {autores.length > 2 && ' +outros'}
                </p>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1">Polo Passivo</p>
                <p className="font-medium text-gray-900 truncate">
                  {reus.length > 0 ? reus.slice(0, 2).join(', ') : processo.poloPassivo}
                  {reus.length > 2 && ' +outros'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Informações Adicionais */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {processo.valorCausa && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>R$ {processo.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            
            {ultimaMovimentacao && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Atualizado em {ultimaMovimentacao}</span>
              </div>
            )}
          </div>
          
          {/* Botão Ver Detalhes */}
          <div className="pt-2">
            <Link href={`/radar-juridico/processo/${numeroEncoded}`}>
              <Button 
                variant="outline" 
                className="w-full"
                size="sm"
              >
                Ver Detalhes Completos
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
