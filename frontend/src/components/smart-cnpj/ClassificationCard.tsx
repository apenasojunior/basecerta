'use client'

import { TrendingUp, DollarSign, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'
import { formatCurrency } from '@/lib/formatters'

interface ClassificationCardProps {
  company: SmartCNPJCompany
}

export function ClassificationCard({ company }: ClassificationCardProps) {
  const porteLabels: Record<SmartCNPJCompany['porte'], string> = {
    MEI: 'MEI - Microempreendedor Individual',
    ME: 'ME - Microempresa',
    EPP: 'EPP - Empresa de Pequeno Porte',
    MEDIO: 'Médio Porte',
    GRANDE: 'Grande Porte',
  }

  const formaTributacaoLabels: Record<SmartCNPJCompany['formaTributacao'], string> = {
    SIMPLES_NACIONAL: 'Simples Nacional',
    LUCRO_PRESUMIDO: 'Lucro Presumido',
    LUCRO_REAL: 'Lucro Real',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          Classificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Porte */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Porte da Empresa</p>
          <p className="text-base font-semibold text-gray-900">
            {porteLabels[company.porte]}
          </p>
        </div>

        {/* Capital Social */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Capital Social</p>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(company.capitalSocial)}
          </p>
        </div>

        {/* Forma de Tributação */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Regime Tributário</p>
          <Badge variant="outline" className="text-sm">
            {formaTributacaoLabels[company.formaTributacao]}
          </Badge>
        </div>

        {/* Opções Fiscais */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Opções Fiscais</p>
          <div className="flex flex-wrap gap-2">
            {company.isMEI && (
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                MEI
              </Badge>
            )}
            {company.isSimplesNacional && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Optante pelo Simples Nacional
              </Badge>
            )}
            {!company.isMEI && !company.isSimplesNacional && (
              <Badge variant="outline">
                Não optante pelo Simples
              </Badge>
            )}
          </div>
        </div>

        {/* CNAE Principal */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">CNAE Principal</p>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="flex-shrink-0">
              {company.cnaesPrimario.codigo}
            </Badge>
            <p className="text-sm text-gray-900 leading-relaxed">
              {company.cnaesPrimario.descricao}
            </p>
          </div>
        </div>

        {/* CNAEs Secundários */}
        {company.cnaesSecundarios.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              CNAEs Secundários ({company.cnaesSecundarios.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {company.cnaesSecundarios.map((cnae, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="flex-shrink-0 text-xs">
                    {cnae.codigo}
                  </Badge>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {cnae.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
