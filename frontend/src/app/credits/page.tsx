/**
 * Dashboard de Créditos
 * Visualização de saldo, histórico e uso de créditos
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Gift,
  ShoppingCart,
  ArrowRight,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { 
  mockCreditBalance, 
  mockTransactions, 
  mockProductUsage,
  mockMonthlyUsage,
  type CreditTransaction 
} from '@/mocks/credits'

export default function CreditsPage() {
  const balance = mockCreditBalance
  const transactions = mockTransactions
  const productUsage = mockProductUsage
  const monthlyUsage = mockMonthlyUsage

  // Calcular taxa de uso
  const usageRate = balance.totalPurchased > 0 
    ? ((balance.totalUsed / balance.totalPurchased) * 100).toFixed(1)
    : '0'

  // Filtrar transações por tipo
  const purchases = transactions.filter(t => t.type === 'PURCHASE' || t.type === 'BONUS')
  const usages = transactions.filter(t => t.type === 'USAGE')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              💳 Créditos
            </h1>
            <p className="text-gray-600">
              Gerencie seus créditos, planos e histórico de uso
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/plans">
              <Button variant="outline" size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Planos
              </Button>
            </Link>
            <Link href="/packages">
              <Button size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Comprar Créditos
              </Button>
            </Link>
          </div>
        </div>

        {/* Saldo Atual */}
        <Card className="bg-gradient-to-br from-primary to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Saldo Disponível</p>
                  <h2 className="text-5xl font-bold">{balance.currentBalance.toLocaleString('pt-BR')}</h2>
                  <p className="text-sm opacity-90 mt-1">créditos</p>
                </div>
                
                <div className="p-4 bg-white/20 rounded-full">
                  <CreditCard className="h-12 w-12" />
                </div>
              </div>
              
              {balance.currentPlan && (
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Plano Atual</p>
                      <p className="font-semibold">{balance.currentPlan}</p>
                    </div>
                    {balance.planRenewalDate && (
                      <div className="text-right">
                        <p className="text-sm opacity-90">Renovação</p>
                        <p className="font-semibold">
                          {new Date(balance.planRenewalDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total Adquirido</p>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {balance.totalPurchased.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">créditos comprados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total Usado</p>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {balance.totalUsed.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">créditos consumidos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Taxa de Uso</p>
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {usageRate}%
                </p>
                <p className="text-xs text-gray-500">dos créditos comprados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Consultas Realizadas</p>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {usages.length}
                </p>
                <p className="text-xs text-gray-500">no último mês</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uso por Produto e Histórico Mensal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Uso por Produto */}
          <Card>
            <CardHeader>
              <CardTitle>Uso por Produto</CardTitle>
              <CardDescription>Distribuição de créditos por tipo de consulta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productUsage.map((item) => (
                  <div key={item.product} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{item.product}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{item.creditsUsed} créditos</span>
                        <Badge variant="secondary">{item.usageCount}x</Badge>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico Mensal</CardTitle>
              <CardDescription>Uso e compras nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyUsage.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{month.month}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {month.credits} créditos usados
                        </p>
                        <p className="text-xs text-gray-600">
                          {month.purchases > 0 
                            ? `+${month.purchases} adquiridos`
                            : 'Sem compras'
                          }
                        </p>
                      </div>
                    </div>
                    {index === monthlyUsage.length - 1 && (
                      <Badge>Atual</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Últimas Transações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Últimas Transações</CardTitle>
                <CardDescription>Histórico completo de compras e uso de créditos</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver Todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente para cada item de transação
function TransactionItem({ transaction }: { transaction: CreditTransaction }) {
  const isPositive = transaction.credits > 0
  
  const typeConfig = {
    PURCHASE: { icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    USAGE: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    REFUND: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    BONUS: { icon: Gift, color: 'text-purple-600', bg: 'bg-purple-50' }
  }
  
  const config = typeConfig[transaction.type]
  const Icon = config.icon
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 ${config.bg} rounded-lg`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-600">
              {new Date(transaction.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {transaction.documentSearched && (
              <>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-600 font-mono">
                  {transaction.documentSearched}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>
          {isPositive ? '+' : ''}{transaction.credits}
        </p>
        
        {transaction.status === 'COMPLETED' ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : transaction.status === 'FAILED' ? (
          <XCircle className="h-5 w-5 text-red-600" />
        ) : (
          <Clock className="h-5 w-5 text-yellow-600" />
        )}
      </div>
    </div>
  )
}
