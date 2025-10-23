'use client'

import { Users, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCPF } from '@/lib/formatters'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'

interface RelativesCardProps {
  person: Dados360PFPerson
}

export function RelativesCard({ person }: RelativesCardProps) {
  const { parentes } = person
  
  if (!parentes || parentes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Familiares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhum familiar encontrado
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontrados vínculos familiares para esta pessoa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Agrupar familiares por grau
  const familyByDegree = parentes.reduce((acc, familiar) => {
    const grau = familiar.parentesco
    if (!acc[grau]) {
      acc[grau] = []
    }
    acc[grau].push(familiar)
    return acc
  }, {} as Record<string, typeof parentes>)
  
  // Ordem de exibição dos graus
  const degreeOrder = [
    'Pai',
    'Mãe',
    'Cônjuge',
    'Filho(a)',
    'Irmão(ã)',
    'Avô(ó)',
    'Neto(a)',
    'Tio(a)',
    'Sobrinho(a)',
    'Outro'
  ]
  
  // Cores para badges de grau de parentesco
  const getDegreeColor = (grau: string): 'default' | 'secondary' | 'outline' => {
    if (['Pai', 'Mãe'].includes(grau)) return 'default'
    if (['Cônjuge', 'Filho(a)'].includes(grau)) return 'secondary'
    return 'outline'
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          Familiares
          <Badge variant="secondary" className="ml-auto">
            {parentes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {degreeOrder.map(degree => {
            const relatives = familyByDegree[degree]
            if (!relatives || relatives.length === 0) return null
            
            return (
              <div key={degree}>
                {/* Cabeçalho do grau */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getDegreeColor(degree)} className="text-xs">
                    {degree}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {relatives.length} {relatives.length === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                </div>
                
                {/* Lista de familiares */}
                <div className="space-y-2">
                  {relatives.map((familiar, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {familiar.nome}
                        </p>
                      </div>
                      
                      {familiar.cpf && (
                        <p className="text-xs text-gray-600 font-mono">
                          CPF: {formatCPF(familiar.cpf)}
                        </p>
                      )}
                      
                      {familiar.dataNascimento && (
                        <p className="text-xs text-gray-500 mt-1">
                          Nascimento: {new Date(familiar.dataNascimento).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Informações de vínculos familiares obtidas de fontes públicas
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
