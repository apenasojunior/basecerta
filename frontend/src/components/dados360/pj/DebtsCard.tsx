'use client'

import { AlertTriangle, TrendingDown, FileX, CreditCard, Scale, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/formatters'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface DebtsCardProps {
  company: Dados360PJCompany
}

export function DebtsCard({ company }: DebtsCardProps) {
  const { dividas } = company
  
  if (!dividas || dividas.totalDividas === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary-600" />
            Dívidas e Restrições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Sem restrições financeiras
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontradas dívidas ou restrições ativas para esta empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const hasRestrictions = 
    dividas.dividasAtivas > 0 || 
    dividas.protestos > 0 || 
    dividas.chequesSemFundo > 0 || 
    dividas.acoesCiveis > 0 || 
    dividas.acoesTrabalho > 0
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary-600" />
          Dívidas e Restrições
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Total de Dívidas */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
          <p className="text-sm text-red-700 mb-1">Total de Dívidas</p>
          <p className="text-2xl font-bold text-red-900">
            {formatCurrency(dividas.totalDividas)}
          </p>
        </div>
        
        {/* Grid de Restrições */}
        <div className="grid grid-cols-2 gap-3">
          {/* Dívidas Ativas */}
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-orange-700 font-medium">Dívidas Ativas</p>
            </div>
            <p className="text-xl font-bold text-orange-900">
              {dividas.dividasAtivas}
            </p>
          </div>
          
          {/* Protestos */}
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <FileX className="h-4 w-4 text-red-600" />
              <p className="text-xs text-red-700 font-medium">Protestos</p>
            </div>
            <p className="text-xl font-bold text-red-900">
              {dividas.protestos}
            </p>
          </div>
          
          {/* Cheques sem Fundo */}
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-yellow-700 font-medium">Cheques s/ Fundo</p>
            </div>
            <p className="text-xl font-bold text-yellow-900">
              {dividas.chequesSemFundo}
            </p>
          </div>
          
          {/* Ações Cíveis */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-purple-700 font-medium">Ações Cíveis</p>
            </div>
            <p className="text-xl font-bold text-purple-900">
              {dividas.acoesCiveis}
            </p>
          </div>
          
          {/* Ações Trabalhistas (ocupa 2 colunas) */}
          <div className="col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-blue-700 font-medium">Ações Trabalhistas</p>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {dividas.acoesTrabalho}
              </p>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Status Financeiro</p>
            <Badge 
              variant={hasRestrictions ? 'secondary' : 'default'}
              className={hasRestrictions ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}
            >
              {hasRestrictions ? 'Com Restrições' : 'Sem Restrições'}
            </Badge>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            <strong>Atenção:</strong> Informações obtidas de fontes públicas. 
            Para análise detalhada de crédito, consulte órgãos especializados.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
