/**
 * Página de Planos de Assinatura
 * Planos mensais com recarga automática de créditos
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { mockPlans, type Plan } from '@/mocks/credits'

export default function PlansPage() {
  const plans = mockPlans

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/credits">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Créditos
            </Button>
          </Link>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">
              📋 Planos de Assinatura
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades. Recarga automática mensal de créditos 
              com economia de até 40%.
            </p>
          </div>
        </div>

        {/* Comparativo de Economia */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <p className="text-lg font-semibold text-green-900">
                💡 Economize até 40% com planos de assinatura vs compra avulsa
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Tabela Comparativa */}
        <Card>
          <CardHeader>
            <CardTitle>Comparação Detalhada</CardTitle>
            <CardDescription>
              Veja todas as funcionalidades incluídas em cada plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Recursos</th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="text-center py-4 px-4 font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-700">Créditos mensais</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-3 px-4 font-semibold text-primary">
                        {plan.credits}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">Preço por crédito</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-3 px-4 font-semibold">
                        R$ {plan.pricePerCredit.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-700">Todos os produtos</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-3 px-4">
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">Exportações (PDF/TXT/CSV/Excel)</td>
                    <td className="text-center py-3 px-4 font-semibold">20/mês</td>
                    <td className="text-center py-3 px-4 font-semibold">50/mês</td>
                    <td className="text-center py-3 px-4 font-semibold">100/mês</td>
                    <td className="text-center py-3 px-4 font-semibold">500/mês</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-700">API de integração</td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">Múltiplos usuários</td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4 text-gray-400">—</td>
                    <td className="text-center py-3 px-4 font-semibold">Até 5</td>
                    <td className="text-center py-3 px-4 font-semibold">Ilimitado</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-gray-700">Suporte dedicado</td>
                    <td className="text-center py-3 px-4 text-gray-400">Email</td>
                    <td className="text-center py-3 px-4">Prioritário</td>
                    <td className="text-center py-3 px-4">24/7</td>
                    <td className="text-center py-3 px-4">24/7 + Gerente</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  O que acontece com os créditos não utilizados?
                </h3>
                <p className="text-sm text-gray-600">
                  Créditos não utilizados acumulam! Não há perda, você pode usar quando quiser.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-sm text-gray-600">
                  Sim! Não há fidelidade. Cancele quando quiser e continue usando seus créditos.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  Posso trocar de plano depois?
                </h3>
                <p className="text-sm text-gray-600">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  Há desconto para pagamento anual?
                </h3>
                <p className="text-sm text-gray-600">
                  Sim! Entre em contato para planos anuais com desconto adicional de 15%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente de Card de Plano
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className={`relative ${
      plan.recommended 
        ? 'border-2 border-primary shadow-xl scale-105' 
        : plan.popular
        ? 'border-2 border-orange-500'
        : ''
    }`}>
      {/* Badge de Recomendado/Popular */}
      {plan.recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-white px-4 py-1 text-sm">
            <Star className="h-3 w-3 mr-1 inline" />
            Recomendado
          </Badge>
        </div>
      )}
      {plan.popular && !plan.recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-orange-500 text-white px-4 py-1 text-sm">
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-8 pt-8">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="mt-2">{plan.description}</CardDescription>
        
        <div className="mt-6 space-y-2">
          <div>
            <span className="text-4xl font-bold text-gray-900">
              R$ {plan.price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-gray-600">/mês</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              {plan.credits} créditos
            </p>
            {plan.savings && (
              <Badge variant="secondary" className="text-xs">
                {plan.savings}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            R$ {plan.pricePerCredit.toFixed(3)} por crédito
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Lista de Features */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
        
        {/* Botão */}
        <Button 
          className="w-full" 
          size="lg"
          variant={plan.recommended ? 'default' : 'outline'}
        >
          Assinar Plano
        </Button>
      </CardContent>
    </Card>
  )
}
