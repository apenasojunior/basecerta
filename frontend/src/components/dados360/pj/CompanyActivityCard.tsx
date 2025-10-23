'use client'

import { Briefcase, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/formatters'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface CompanyActivityCardProps {
  company: Dados360PJCompany
}

export function CompanyActivityCard({ company }: CompanyActivityCardProps) {
  const getPorteLabel = (porte: string) => {
    switch (porte) {
      case 'MEI': return 'Microempreendedor Individual'
      case 'ME': return 'Microempresa'
      case 'EPP': return 'Empresa de Pequeno Porte'
      case 'DEMAIS': return 'Demais'
      default: return porte
    }
  }
  
  const getFormaTributacaoLabel = (forma?: string) => {
    if (!forma) return 'Não informado'
    switch (forma) {
      case 'SIMPLES_NACIONAL': return 'Simples Nacional'
      case 'LUCRO_PRESUMIDO': return 'Lucro Presumido'
      case 'LUCRO_REAL': return 'Lucro Real'
      default: return forma
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary-600" />
          Classificação e Atividade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Porte</dt>
            <dd className="text-sm text-gray-900">{getPorteLabel(company.porte)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Capital Social</dt>
            <dd className="text-sm text-gray-900 font-semibold">
              {formatCurrency(company.capitalSocial)}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Forma de Tributação</dt>
            <dd className="text-sm text-gray-900">
              {getFormaTributacaoLabel(company.formaTributacao)}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-2">Opções Tributárias</dt>
            <dd className="flex flex-wrap gap-2">
              {company.opcaoMEI && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  MEI
                </Badge>
              )}
              {company.opcaoSimples && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Simples Nacional
                </Badge>
              )}
              {!company.opcaoMEI && !company.opcaoSimples && (
                <span className="text-sm text-gray-500">Nenhuma opção ativa</span>
              )}
            </dd>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <dt className="text-sm font-medium text-gray-600 mb-2">CNAE Principal</dt>
            <dd className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-mono text-blue-900 mb-1">
                {company.cnae.codigo}
              </p>
              <p className="text-sm text-blue-700">
                {company.cnae.descricao}
              </p>
            </dd>
          </div>
          
          {company.cnaesSecundarios && company.cnaesSecundarios.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-2">
                CNAEs Secundários ({company.cnaesSecundarios.length})
              </dt>
              <dd className="space-y-2 max-h-64 overflow-y-auto">
                {company.cnaesSecundarios.map((cnae, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-mono text-gray-900 mb-1">
                      {cnae.codigo}
                    </p>
                    <p className="text-xs text-gray-600">
                      {cnae.descricao}
                    </p>
                  </div>
                ))}
              </dd>
            </div>
          )}
          
          {(!company.cnaesSecundarios || company.cnaesSecundarios.length === 0) && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-600">
                Nenhum CNAE secundário registrado
              </p>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
