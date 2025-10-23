'use client'

import { Activity, Calendar, Users, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'
import { formatDate } from '@/lib/formatters'

interface StatusCardProps {
  company: SmartCNPJCompany
}

export function StatusCard({ company }: StatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-600" />
          Status e Informações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Situação Cadastral */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Situação Cadastral</p>
          <Badge
            className={
              company.situacaoCadastral === 'ATIVA'
                ? 'bg-green-100 text-green-700 border-green-200'
                : company.situacaoCadastral === 'SUSPENSA'
                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                : company.situacaoCadastral === 'INAPTA'
                ? 'bg-orange-100 text-orange-700 border-orange-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }
          >
            {company.situacaoCadastral}
          </Badge>
        </div>

        {/* Data de Abertura */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Data de Abertura</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <p className="text-base text-gray-900">
              {formatDate(company.dataAbertura)}
            </p>
          </div>
        </div>

        {/* Número de Sócios */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Quadro Societário</p>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {company.socios.length}
              </p>
              <p className="text-sm text-gray-600">
                {company.socios.length === 1 ? 'Sócio' : 'Sócios'}
              </p>
            </div>
          </div>
        </div>

        {/* Sócios List */}
        <div className="space-y-2">
          {company.socios.map((socio, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900 text-sm mb-1">
                {socio.nome}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {socio.qualificacao}
                </Badge>
                <span className="text-xs text-gray-500">
                  Desde {formatDate(socio.dataEntrada)}
                </span>
              </div>
              <p className="text-xs font-mono text-gray-600 mt-1">
                {socio.cpfCnpj}
              </p>
            </div>
          ))}
        </div>

        {/* Tipo e Porte */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tipo</p>
            <Badge variant="outline">
              {company.tipo}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Porte</p>
            <Badge variant="outline">
              {company.porte === 'MEI' ? 'MEI' :
               company.porte === 'ME' ? 'Microempresa' :
               company.porte === 'EPP' ? 'Pequeno Porte' :
               company.porte === 'MEDIO' ? 'Médio Porte' : 'Grande Porte'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
