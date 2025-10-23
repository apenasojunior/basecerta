'use client'

import { TrendingUp, DollarSign, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'
import { faixaRendaLabels, classeEconomicaLabels } from '@/mocks/dados360-pf'
import { formatCurrency } from '@/lib/formatters'

interface IncomeCardProps {
  person: Dados360PFPerson
}

export function IncomeCard({ person }: IncomeCardProps) {
  // Calcular cor do score
  const getScoreColor = (score?: number) => {
    if (!score) return 'gray'
    if (score >= 700) return 'green'
    if (score >= 500) return 'yellow'
    if (score >= 300) return 'orange'
    return 'red'
  }
  
  const scoreColor = getScoreColor(person.scoreCredito)
  const scorePercentage = person.scoreCredito ? ((person.scoreCredito - 300) / 700) * 100 : 0
  
  // Cores das classes econômicas
  const classeColors: Record<Dados360PFPerson['classeEconomica'], string> = {
    A: 'bg-green-100 text-green-700 border-green-200',
    B: 'bg-blue-100 text-blue-700 border-blue-200',
    C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    D: 'bg-orange-100 text-orange-700 border-orange-200',
    E: 'bg-red-100 text-red-700 border-red-200',
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          Situação Financeira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Renda Estimada */}
          {person.rendaEstimada && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Renda Estimada</p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(person.rendaEstimada)}
                </p>
                <span className="text-sm text-gray-500">/mês</span>
              </div>
            </div>
          )}
          
          {/* Faixa de Renda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Faixa de Renda</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                {faixaRendaLabels[person.faixaRenda]}
              </Badge>
            </div>
            
            {/* Classe Econômica */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Classe Econômica</p>
              <Badge variant="secondary" className={classeColors[person.classeEconomica]}>
                {classeEconomicaLabels[person.classeEconomica]}
              </Badge>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-4" />
          
          {/* Score de Crédito */}
          {person.scoreCredito && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Score de Crédito</p>
                <p className="text-2xl font-bold text-gray-900">{person.scoreCredito}</p>
              </div>
              
              {/* Barra de progresso */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                    scoreColor === 'green'
                      ? 'bg-green-500'
                      : scoreColor === 'yellow'
                      ? 'bg-yellow-500'
                      : scoreColor === 'orange'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(scorePercentage, 0), 100)}%` }}
                />
              </div>
              
              {/* Legenda */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>300</span>
                <span className="font-semibold">
                  {person.scoreCredito >= 700
                    ? 'Excelente'
                    : person.scoreCredito >= 500
                    ? 'Bom'
                    : person.scoreCredito >= 300
                    ? 'Regular'
                    : 'Ruim'}
                </span>
                <span>1000</span>
              </div>
              
              {/* Interpretação */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  {person.scoreCredito >= 700 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-orange-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Interpretação do Score
                    </p>
                    <p className="text-xs text-gray-600">
                      {person.scoreCredito >= 700 ? (
                        'Excelente histórico de crédito. Alta probabilidade de aprovação em financiamentos.'
                      ) : person.scoreCredito >= 500 ? (
                        'Bom histórico de crédito. Boa probabilidade de aprovação em créditos.'
                      ) : person.scoreCredito >= 300 ? (
                        'Histórico de crédito regular. Pode enfrentar dificuldades em obter crédito.'
                      ) : (
                        'Histórico de crédito ruim. Dificuldade em obter aprovação de crédito.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Info sobre estimativa */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              ℹ️ <strong>Nota:</strong> Renda estimada e score de crédito são valores aproximados 
              baseados em análise de dados públicos e histórico financeiro disponível.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
