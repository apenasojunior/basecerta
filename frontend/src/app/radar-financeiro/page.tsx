/**
 * Radar Financeiro - Menu Principal
 * Grid com 7 subprodutos de análise financeira
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  FileText,
  Shield
} from 'lucide-react'
import Link from 'next/link'

interface FinancialProduct {
  id: string
  icon: React.ElementType
  title: string
  description: string
  features: string[]
  credits: number
  available: boolean
  href: string
  color: string
  bgColor: string
}

const financialProducts: FinancialProduct[] = [
  {
    id: 'score-credito',
    icon: TrendingUp,
    title: 'Score de Crédito',
    description: 'Análise completa do score de crédito e histórico financeiro',
    features: ['Score detalhado', 'Histórico 24 meses', 'Tendência', 'Comparativo mercado'],
    credits: 15,
    available: true,
    href: '/radar-financeiro/score-credito',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  {
    id: 'restricoes',
    icon: AlertTriangle,
    title: 'Restrições Financeiras',
    description: 'Consulta de restrições, protestos e negativações',
    features: ['Protestos', 'Serasa/SPC', 'Cheques sem fundo', 'Dívidas ativas'],
    credits: 10,
    available: true,
    href: '/radar-financeiro/restricoes',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100'
  },
  {
    id: 'dividas-tributarias',
    icon: FileText,
    title: 'Dívidas Tributárias',
    description: 'Consulta de débitos fiscais federais, estaduais e municipais',
    features: ['Dívida Ativa União', 'ICMS', 'ISS', 'Certidões negativas'],
    credits: 12,
    available: true,
    href: '/radar-financeiro/dividas-tributarias',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  {
    id: 'limite-credito',
    icon: CreditCard,
    title: 'Limite de Crédito Estimado',
    description: 'Estimativa de limite de crédito com base no perfil financeiro',
    features: ['Limite sugerido', 'Análise de risco', 'Taxa de juros', 'Prazo médio'],
    credits: 18,
    available: true,
    href: '/radar-financeiro/limite-credito',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    id: 'renda-patrimonio',
    icon: DollarSign,
    title: 'Renda e Patrimônio',
    description: 'Estimativa de renda mensal e patrimônio declarado',
    features: ['Renda estimada', 'Bens móveis', 'Bens imóveis', 'Investimentos'],
    credits: 20,
    available: true,
    href: '/radar-financeiro/renda-patrimonio',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100'
  },
  {
    id: 'analise-risco',
    icon: Shield,
    title: 'Análise de Risco',
    description: 'Avaliação de risco de crédito e probabilidade de inadimplência',
    features: ['Risk score', 'Probabilidade inadimplência', 'Histórico pagamentos', 'Recomendação'],
    credits: 25,
    available: true,
    href: '/radar-financeiro/analise-risco',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    id: 'relatorio-completo',
    icon: BarChart3,
    title: 'Relatório Financeiro Completo',
    description: 'Relatório unificado com todas as informações financeiras',
    features: ['Todos os produtos', 'PDF exportável', 'Gráficos', 'Histórico completo'],
    credits: 50,
    available: true,
    href: '/radar-financeiro/relatorio-completo',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100'
  }
]

export default function RadarFinanceiroPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            💰 Radar Financeiro
          </h1>
          <p className="text-lg text-gray-600">
            Análise completa do perfil financeiro e de crédito de pessoas físicas e jurídicas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Produtos Disponíveis</p>
                <p className="text-3xl font-bold text-primary">7</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Consultas Realizadas</p>
                <p className="text-3xl font-bold text-green-600">1.234</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Créditos a partir de</p>
                <p className="text-3xl font-bold text-blue-600">10</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Economia no Pacote</p>
                <p className="text-3xl font-bold text-orange-600">40%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  💡 Dica: Economize com o Relatório Completo
                </p>
                <p className="text-sm text-blue-800">
                  Ao contratar o <strong>Relatório Financeiro Completo</strong>, você tem acesso a todos os 6 produtos individuais 
                  por apenas 50 créditos (economia de 40% em relação à compra individual de 100 créditos).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            Escolha o produto desejado
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialProducts.map((product) => {
              const Icon = product.icon
              
              return (
                <Card 
                  key={product.id} 
                  className={`${product.bgColor} border-2 hover:shadow-lg transition-all duration-200 ${
                    !product.available ? 'opacity-60' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-white shadow-sm ${product.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        {product.credits} créditos
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <CardTitle className="text-xl">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {product.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features List */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        O que está incluído:
                      </p>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Button */}
                    {product.available ? (
                      <Link href={product.href}>
                        <Button className="w-full" size="lg">
                          Consultar Agora
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full" size="lg" disabled>
                        Em Breve
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              📋 Como funciona?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900">Escolha o Produto</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Selecione o tipo de análise financeira que deseja realizar
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900">Informe CPF/CNPJ</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Digite o CPF ou CNPJ da pessoa/empresa a ser consultada
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900">Receba o Relatório</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Visualize, exporte ou compartilhe o relatório completo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
