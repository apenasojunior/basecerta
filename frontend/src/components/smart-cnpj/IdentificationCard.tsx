'use client'

import { Building2, Calendar, FileText, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'
import { formatDate } from '@/lib/formatters'

interface IdentificationCardProps {
  company: SmartCNPJCompany
}

export function IdentificationCard({ company }: IdentificationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" />
          Identificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CNPJ */}
          <div>
            <p className="text-sm text-gray-500 mb-1">CNPJ</p>
            <p className="text-base font-mono font-semibold text-gray-900">
              {company.cnpj}
            </p>
          </div>

          {/* Razão Social */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Razão Social</p>
            <p className="text-base font-semibold text-gray-900">
              {company.razaoSocial}
            </p>
          </div>

          {/* Nome Fantasia */}
          {company.nomeFantasia !== company.razaoSocial && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Nome Fantasia</p>
              <p className="text-base font-semibold text-gray-900">
                {company.nomeFantasia}
              </p>
            </div>
          )}

          {/* Tipo */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Tipo</p>
            <p className="text-base text-gray-900">
              {company.tipo}
            </p>
          </div>

          {/* Situação Cadastral */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Situação Cadastral</p>
            <p className="text-base text-gray-900">
              {company.situacaoCadastral}
            </p>
          </div>

          {/* Data de Abertura */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Data de Abertura</p>
            <p className="text-base text-gray-900">
              {formatDate(company.dataAbertura)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
