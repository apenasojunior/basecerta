'use client'

import { Users, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/formatters'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface EmployeesHistoryCardProps {
  company: Dados360PJCompany
}

export function EmployeesHistoryCard({ company }: EmployeesHistoryCardProps) {
  const { historicoFuncionarios } = company
  
  if (!historicoFuncionarios || historicoFuncionarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Histórico de Funcionários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Sem histórico disponível
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontrados dados de funcionários para esta empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Pegar dados mais recentes
  const ultimoMes = historicoFuncionarios[historicoFuncionarios.length - 1]
  const mesAnterior = historicoFuncionarios.length > 1 ? historicoFuncionarios[historicoFuncionarios.length - 2] : null
  
  // Calcular variação
  const variacaoFuncionarios = mesAnterior 
    ? ultimoMes.quantidade - mesAnterior.quantidade 
    : 0
  
  const variacaoPercentual = mesAnterior && mesAnterior.quantidade > 0
    ? ((variacaoFuncionarios / mesAnterior.quantidade) * 100).toFixed(1)
    : '0'
  
  const isPositive = variacaoFuncionarios > 0
  const isNegative = variacaoFuncionarios < 0
  
  // Meses em português
  const mesesPt = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          Histórico de Funcionários
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Atuais */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Funcionários Atuais</p>
            <p className="text-2xl font-bold text-blue-900">
              {ultimoMes.quantidade}
            </p>
            {mesAnterior && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive && <TrendingUp className="h-3 w-3 text-green-600" />}
                {isNegative && <TrendingDown className="h-3 w-3 text-red-600" />}
                <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
                  {isPositive && '+'}{variacaoFuncionarios} ({isPositive && '+'}{variacaoPercentual}%)
                </span>
              </div>
            )}
          </div>
          
          {ultimoMes.folhaPagamento && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1">Folha de Pagamento</p>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(ultimoMes.folhaPagamento)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Mês atual
              </p>
            </div>
          )}
        </div>
        
        {/* Tabela de Histórico (últimos 6 meses) */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Últimos 6 meses
          </p>
          
          <div className="space-y-2">
            {historicoFuncionarios.slice(-6).reverse().map((registro, index) => {
              const mesNome = mesesPt[registro.mes - 1]
              const isPrimeiro = index === 0
              
              return (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isPrimeiro 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isPrimeiro ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <Users className={`h-4 w-4 ${
                        isPrimeiro ? 'text-primary-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {mesNome}/{registro.ano}
                      </p>
                      {registro.folhaPagamento && (
                        <p className="text-xs text-gray-600">
                          {formatCurrency(registro.folhaPagamento)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {registro.quantidade}
                    </p>
                    {isPrimeiro && (
                      <Badge variant="secondary" className="text-xs bg-primary-100 text-primary-700 border-primary-200">
                        Atual
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Dados obtidos de registros públicos (CAGED/RAIS)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
