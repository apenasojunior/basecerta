'use client'

import { Users, AlertCircle, TrendingUp, Calendar, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCPF, formatCNPJ } from '@/lib/formatters'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface PartnersCardProps {
  company: Dados360PJCompany
}

export function PartnersCard({ company }: PartnersCardProps) {
  const { socios } = company
  
  if (!socios || socios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Sócios e Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhum sócio encontrado
            </p>
            <p className="text-sm text-gray-600">
              Não há informações de sócios para esta empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Ordenar por participação (maior primeiro)
  const sortedSocios = [...socios].sort((a, b) => {
    const partA = a.participacao || 0
    const partB = b.participacao || 0
    return partB - partA
  })
  
  // Verificar se é CPF ou CNPJ
  const isCPF = (doc: string) => doc.replace(/\D/g, '').length === 11
  
  // Cores para badges de qualificação
  const getQualificationColor = (qualificacao: string): 'default' | 'secondary' | 'outline' => {
    if (qualificacao.includes('Administrador') || qualificacao.includes('Presidente')) return 'default'
    if (qualificacao.includes('Sócio')) return 'secondary'
    return 'outline'
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          Sócios e Administradores
          <Badge variant="secondary" className="ml-auto">
            {socios.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSocios.map((socio, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Cabeçalho */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {socio.nome}
                    </h4>
                    <p className="text-xs font-mono text-gray-600">
                      {isCPF(socio.cpfCnpj) ? formatCPF(socio.cpfCnpj) : formatCNPJ(socio.cpfCnpj)}
                    </p>
                  </div>
                </div>
                
                {socio.participacao !== undefined && socio.participacao > 0 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 ml-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {socio.participacao}%
                  </Badge>
                )}
              </div>
              
              {/* Qualificação */}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getQualificationColor(socio.qualificacao)}>
                  {socio.qualificacao}
                </Badge>
              </div>
              
              {/* Data de Entrada */}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>Entrada: {formatDate(socio.dataEntrada)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Total de participação */}
        {socios.some(s => s.participacao !== undefined && s.participacao > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Total de Participação Declarada
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {socios.reduce((acc, s) => acc + (s.participacao || 0), 0)}%
              </p>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Informações obtidas da Receita Federal
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
