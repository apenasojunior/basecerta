'use client'

import { Briefcase, AlertCircle, Calendar, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/formatters'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'

interface ProfessionalExperienceCardProps {
  person: Dados360PFPerson
}

export function ProfessionalExperienceCard({ person }: ProfessionalExperienceCardProps) {
  const { experienciaProfissional } = person
  
  if (!experienciaProfissional || experienciaProfissional.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary-600" />
            Experiência Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhuma experiência encontrada
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontrados registros de experiência profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Ordenar por data de início (mais recente primeiro)
  const sortedExperience = [...experienciaProfissional].sort((a, b) => {
    const dateA = new Date(a.dataInicio)
    const dateB = new Date(b.dataInicio)
    return dateB.getTime() - dateA.getTime()
  })
  
  // Calcular duração em meses
  const calculateDuration = (inicio: string, fim?: string) => {
    const startDate = new Date(inicio)
    const endDate = fim ? new Date(fim) : new Date()
    
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth())
    
    if (months < 12) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`
    }
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`
    }
    
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary-600" />
          Experiência Profissional
          <Badge variant="secondary" className="ml-auto">
            {experienciaProfissional.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Timeline */}
        <div className="relative space-y-6">
          {/* Linha vertical da timeline */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />
          
          {sortedExperience.map((job, index) => {
            const isCurrentJob = !job.dataFim
            const duration = calculateDuration(job.dataInicio, job.dataFim)
            
            return (
              <div key={index} className="relative pl-8">
                {/* Círculo da timeline */}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white ${
                  isCurrentJob 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`} />
                
                {/* Conteúdo do job */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {/* Cabeçalho */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {job.cargo}
                      </h4>
                      {isCurrentJob && (
                        <Badge variant="default" className="bg-green-600 text-white">
                          Atual
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium">{job.empresa}</span>
                    </div>
                    
                    {job.cnpj && (
                      <p className="text-xs text-gray-500 font-mono ml-5">
                        CNPJ: {job.cnpj}
                      </p>
                    )}
                  </div>
                  
                  {/* Período e duração */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {formatDate(job.dataInicio)} - {job.dataFim ? formatDate(job.dataFim) : 'Atual'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{duration}</span>
                  </div>
                  
                  {/* Situação e salário */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.salario && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(job.salario)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Total de experiência */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Total de experiências registradas
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {experienciaProfissional.length} {experienciaProfissional.length === 1 ? 'empresa' : 'empresas'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
