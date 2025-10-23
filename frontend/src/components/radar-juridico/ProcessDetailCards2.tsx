/**
 * Process Detail Cards - Part 2
 * Cards: Status, Valores, Partes
 */

'use client'

import { Activity, DollarSign, Users, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProcessoJuridico } from '@/mocks/radar-juridico-pf'

// Mapeamento de cores por status
const statusColors: Record<ProcessoJuridico['status'], { bg: string; text: string }> = {
  EM_ANDAMENTO: { bg: 'bg-green-100', text: 'text-green-800' },
  SUSPENSO: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  ARQUIVADO: { bg: 'bg-gray-100', text: 'text-gray-800' },
  SENTENCIADO: { bg: 'bg-blue-100', text: 'text-blue-800' },
  RECURSO: { bg: 'bg-purple-100', text: 'text-purple-800' },
}

const statusLabels: Record<ProcessoJuridico['status'], string> = {
  EM_ANDAMENTO: 'Em Andamento',
  SUSPENSO: 'Suspenso',
  ARQUIVADO: 'Arquivado',
  SENTENCIADO: 'Sentenciado',
  RECURSO: 'Recurso',
}

// ============================================
// 4. ProcessStatusCard
// ============================================
interface ProcessStatusCardProps {
  processo: ProcessoJuridico
}

export function ProcessStatusCard({ processo }: ProcessStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Status Atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Status do Processo</p>
            <Badge 
              className={`${statusColors[processo.status].bg} ${statusColors[processo.status].text} border-0 text-base px-3 py-1`}
            >
              {statusLabels[processo.status]}
            </Badge>
          </div>
          
          {processo.movimentacoes.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Último Andamento</p>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {processo.movimentacoes[0].tipo}
              </p>
              <p className="text-xs text-gray-600">
                {new Date(processo.movimentacoes[0].data).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
          
          {processo.observacoes && (
            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-1">Observações</p>
              <p className="text-sm text-gray-700 italic">{processo.observacoes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 5. ProcessValuesCard
// ============================================
interface ProcessValuesCardProps {
  processo: ProcessoJuridico
}

export function ProcessValuesCard({ processo }: ProcessValuesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-primary" />
          Valores e Custas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processo.valorCausa ? (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-1">Valor da Causa</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {processo.valorCausa.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Custas Judiciais</p>
                  <p className="text-sm font-medium text-gray-900">
                    R$ {(processo.valorCausa * 0.01).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Estimado (1%)</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Honorários (Est.)</p>
                  <p className="text-sm font-medium text-gray-900">
                    R$ {(processo.valorCausa * 0.1).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Estimado (10%)</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">Valor da causa não informado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 6. ProcessPartiesCard
// ============================================
interface ProcessPartiesCardProps {
  processo: ProcessoJuridico
}

export function ProcessPartiesCard({ processo }: ProcessPartiesCardProps) {
  // Separar partes por tipo
  const autores = processo.partes.filter(p => p.tipo === 'AUTOR')
  const reus = processo.partes.filter(p => p.tipo === 'REU')
  const terceiros = processo.partes.filter(p => p.tipo === 'TERCEIRO')
  const advogados = processo.partes.filter(p => p.tipo === 'ADVOGADO')
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Partes e Advogados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Polo Ativo */}
          {autores.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                <p className="text-sm font-semibold text-gray-900">Polo Ativo</p>
              </div>
              <div className="space-y-3 ml-3">
                {autores.map((parte, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{parte.nome}</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">{parte.cpfCnpj}</p>
                    {parte.qualificacao && (
                      <p className="text-xs text-gray-500 mt-1">{parte.qualificacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Polo Passivo */}
          {reus.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-red-500 rounded-full"></div>
                <p className="text-sm font-semibold text-gray-900">Polo Passivo</p>
              </div>
              <div className="space-y-3 ml-3">
                {reus.map((parte, idx) => (
                  <div key={idx} className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{parte.nome}</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">{parte.cpfCnpj}</p>
                    {parte.qualificacao && (
                      <p className="text-xs text-gray-500 mt-1">{parte.qualificacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Terceiros */}
          {terceiros.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-1 bg-gray-400 rounded-full"></div>
                <p className="text-sm font-semibold text-gray-900">Terceiros</p>
              </div>
              <div className="space-y-3 ml-3">
                {terceiros.map((parte, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{parte.nome}</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">{parte.cpfCnpj}</p>
                    {parte.qualificacao && (
                      <p className="text-xs text-gray-500 mt-1">{parte.qualificacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Advogados */}
          {advogados.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-gray-900">Advogados</p>
              </div>
              <div className="space-y-2 ml-6">
                {advogados.map((parte, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <div>
                      <p className="font-medium text-gray-900">{parte.nome}</p>
                      <p className="text-xs text-gray-600 font-mono">{parte.cpfCnpj}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
