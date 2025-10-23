'use client'

import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCNPJ } from '@/lib/formatters'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface CompanyIdentificationCardProps {
  company: Dados360PJCompany
}

export function CompanyIdentificationCard({ company }: CompanyIdentificationCardProps) {
  const getSituacaoColor = (situacao: string): 'default' | 'secondary' | 'outline' => {
    if (situacao === 'ATIVA') return 'default'
    if (situacao === 'SUSPENSA' || situacao === 'INAPTA') return 'secondary'
    return 'outline'
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" />
          Identificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">CNPJ</dt>
            <dd className="text-sm text-gray-900 font-mono">{formatCNPJ(company.cnpj)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Razão Social</dt>
            <dd className="text-sm text-gray-900 font-semibold">{company.razaoSocial}</dd>
          </div>
          
          {company.nomeFantasia && (
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Nome Fantasia</dt>
              <dd className="text-sm text-gray-900">{company.nomeFantasia}</dd>
            </div>
          )}
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Tipo</dt>
            <dd>
              <Badge variant="outline">{company.tipo}</Badge>
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Situação Cadastral</dt>
            <dd>
              <Badge variant={getSituacaoColor(company.situacao)}>
                {company.situacao}
              </Badge>
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Data de Abertura</dt>
            <dd className="text-sm text-gray-900">{formatDate(company.dataAbertura)}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Natureza Jurídica</dt>
            <dd className="text-sm text-gray-900">{company.naturezaJuridica}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
