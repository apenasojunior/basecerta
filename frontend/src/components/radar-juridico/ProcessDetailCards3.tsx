/**
 * Process Detail Cards - Part 3
 * Cards: Assuntos, Timeline, Relacionados, Documentos
 */

'use client'

import { Tag, Clock, Link2, FileText, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ProcessoJuridico } from '@/mocks/radar-juridico-pf'

// ============================================
// 7. ProcessSubjectsCard
// ============================================
interface ProcessSubjectsCardProps {
  processo: ProcessoJuridico
}

export function ProcessSubjectsCard({ processo }: ProcessSubjectsCardProps) {
  // Mapeamento de tipos para descrição
  const tipoDescricoes: Record<ProcessoJuridico['tipo'], string> = {
    CIVEL: 'Direito Civil',
    TRABALHISTA: 'Direito Trabalhista',
    CRIMINAL: 'Direito Criminal',
    TRIBUTARIO: 'Direito Tributário',
    FAMILIA: 'Direito de Família',
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="h-5 w-5 text-primary" />
          Assunto e Classificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Assunto Principal</p>
            <p className="text-base font-semibold text-gray-900">{processo.assunto}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Área do Direito</p>
              <Badge variant="secondary" className="text-sm">
                {tipoDescricoes[processo.tipo]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Tipo de Ação</p>
              <Badge variant="outline" className="text-sm">
                {processo.tipo}
              </Badge>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <p className="text-xs text-blue-900 font-medium mb-1">
              Classificação CNJ (Simulada)
            </p>
            <p className="text-xs text-blue-700">
              {processo.tipo === 'CIVEL' && 'Classe: 1.1.1.1 - Procedimento Comum'}
              {processo.tipo === 'TRABALHISTA' && 'Classe: 2.1.1.1 - Reclamação Trabalhista'}
              {processo.tipo === 'CRIMINAL' && 'Classe: 3.1.1.1 - Ação Penal'}
              {processo.tipo === 'TRIBUTARIO' && 'Classe: 4.1.1.1 - Execução Fiscal'}
              {processo.tipo === 'FAMILIA' && 'Classe: 5.1.1.1 - Divórcio Consensual'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 8. ProcessTimelineCard
// ============================================
interface ProcessTimelineCardProps {
  processo: ProcessoJuridico
}

export function ProcessTimelineCard({ processo }: ProcessTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Histórico de Movimentações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processo.movimentacoes.length > 0 ? (
            <div className="relative">
              {/* Linha vertical da timeline */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
              
              {/* Movimentações */}
              <div className="space-y-6">
                {processo.movimentacoes.map((mov, idx) => (
                  <div key={idx} className="relative pl-8">
                    {/* Ponto na timeline */}
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary border-2 border-white shadow"></div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">{mov.tipo}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(mov.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{mov.descricao}</p>
                      {mov.documento && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            <FileText className="inline h-3 w-3 mr-1" />
                            Documento: {mov.documento}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">Nenhuma movimentação registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 9. RelatedProcessesCard
// ============================================
interface RelatedProcessesCardProps {
  processo: ProcessoJuridico
}

export function RelatedProcessesCard({ processo }: RelatedProcessesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="h-5 w-5 text-primary" />
          Processos Relacionados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {processo.processosRelacionados && processo.processosRelacionados.length > 0 ? (
          <div className="space-y-3">
            {processo.processosRelacionados.map((numeroProcesso, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {numeroProcesso}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Processo relacionado à mesma causa
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Ver Processo
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">Nenhum processo relacionado encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================
// 10. ProcessDocumentsCard
// ============================================
interface ProcessDocumentsCardProps {
  processo: ProcessoJuridico
}

export function ProcessDocumentsCard({ processo }: ProcessDocumentsCardProps) {
  // Documentos mockados baseados nas movimentações
  const documentos = processo.movimentacoes
    .filter(m => m.documento)
    .map((m, idx) => ({
      id: idx + 1,
      nome: m.documento || 'Documento',
      tipo: m.tipo,
      data: m.data,
      tamanho: Math.floor(Math.random() * 500) + 100, // KB mockado
    }))
  
  // Adicionar petição inicial (sempre existe)
  const todosDocumentos = [
    {
      id: 0,
      nome: 'Petição Inicial',
      tipo: 'Petição',
      data: processo.dataDistribuicao,
      tamanho: 256,
    },
    ...documentos
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Documentos Processuais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todosDocumentos.map((doc) => (
            <div 
              key={doc.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.nome}
                  </p>
                  <p className="text-xs text-gray-600">
                    {doc.tipo} • {new Date(doc.data).toLocaleDateString('pt-BR')} • {doc.tamanho} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {todosDocumentos.length === 1 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Apenas petição inicial disponível</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
