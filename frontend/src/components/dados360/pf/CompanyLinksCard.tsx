'use client'

import { Building2, AlertCircle, Calendar, TrendingUp, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCNPJ } from '@/lib/formatters'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'

interface CompanyLinksCardProps {
  person: Dados360PFPerson
}

export function CompanyLinksCard({ person }: CompanyLinksCardProps) {
  const { vinculosEmpresariais } = person
  
  if (!vinculosEmpresariais || vinculosEmpresariais.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-600" />
            Vínculos Empresariais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhum vínculo encontrado
            </p>
            <p className="text-sm text-gray-600">
              Esta pessoa não possui vínculos empresariais registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Separar vínculos ativos e inativos
  const activeLinks = vinculosEmpresariais.filter(v => !v.dataSaida)
  const inactiveLinks = vinculosEmpresariais.filter(v => v.dataSaida)
  
  // Ordenar por data de entrada (mais recente primeiro)
  const sortedLinks = [...vinculosEmpresariais].sort((a, b) => {
    const dateA = new Date(a.dataEntrada)
    const dateB = new Date(b.dataEntrada)
    return dateB.getTime() - dateA.getTime()
  })
  
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
          <Building2 className="h-5 w-5 text-primary-600" />
          Vínculos Empresariais
          <Badge variant="secondary" className="ml-auto">
            {vinculosEmpresariais.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats rápidas */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Ativos</span>
            </div>
            <p className="text-xl font-bold text-green-900">
              {activeLinks.length}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Inativos</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {inactiveLinks.length}
            </p>
          </div>
        </div>
        
        {/* Lista de vínculos */}
        <div className="space-y-3">
          {sortedLinks.map((vinculo, index) => {
            const isActive = !vinculo.dataSaida
            const cleanCnpj = vinculo.cnpj.replace(/[.\-\/]/g, '')
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isActive 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {vinculo.razaoSocial}
                    </h4>
                    {vinculo.nomeFantasia && vinculo.nomeFantasia !== vinculo.razaoSocial && (
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {vinculo.nomeFantasia}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-mono">
                      {formatCNPJ(vinculo.cnpj)}
                    </p>
                  </div>
                  
                  {isActive && (
                    <Badge variant="default" className="bg-green-600 text-white ml-2 flex-shrink-0">
                      Ativo
                    </Badge>
                  )}
                </div>
                
                {/* Qualificação */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getQualificationColor(vinculo.qualificacao)} className="text-xs">
                    {vinculo.qualificacao}
                  </Badge>
                  
                  {vinculo.participacao !== undefined && vinculo.participacao > 0 && (
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {vinculo.participacao}%
                    </Badge>
                  )}
                </div>
                
                {/* Período */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>
                    {formatDate(vinculo.dataEntrada)} - {vinculo.dataSaida ? formatDate(vinculo.dataSaida) : 'Atual'}
                  </span>
                </div>
                
                {/* Botão Ver Empresa */}
                <Link href={`/smart-cnpj/${cleanCnpj}`} passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <Building2 className="h-3.5 w-3.5 mr-2" />
                    Ver Detalhes da Empresa
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Informações de vínculos obtidas da Receita Federal
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
