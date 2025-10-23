/**
 * Página de Pacotes Avulsos de Créditos
 * Compra única de créditos sem recorrência
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, ShoppingCart, ArrowLeft, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import { mockPackages, type Package } from '@/mocks/credits'

export default function PackagesPage() {
  const packages = mockPackages

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
              🎁 Pacotes de Créditos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compre créditos avulsos sem compromisso mensal. Ideal para uso esporádico ou 
              complementar seu plano.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-blue-900">Crédito Vitalício</p>
                  <p className="text-sm text-blue-800">
                    Seus créditos nunca expiram. Use quando precisar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-purple-900">Bônus Inclusos</p>
                  <p className="text-sm text-purple-800">
                    Pacotes maiores ganham créditos extras de bônus.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-green-900">Compra Única</p>
                  <p className="text-sm text-green-800">
                    Sem mensalidade. Pague apenas quando precisar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Pacotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pack) => (
            <PackageCard key={pack.id} package={pack} />
          ))}
        </div>

        {/* Comparativo com Planos */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              💡 Dica: Economize com Planos de Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Se você faz consultas regularmente, os <strong>planos de assinatura</strong> podem 
                ser mais vantajosos:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">📦 Pacote Avulso (500 créditos)</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 449,90</p>
                  <p className="text-sm text-gray-600">R$ 0,899 por crédito</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-primary">📋 Plano Profissional (500 créditos/mês)</p>
                  <p className="text-2xl font-bold text-primary">R$ 399,90/mês</p>
                  <p className="text-sm text-gray-600">R$ 0,799 por crédito</p>
                  <Badge className="bg-green-600">11% de economia</Badge>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/plans">
                  <Button variant="outline" className="w-full md:w-auto">
                    Ver Planos de Assinatura
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Como Usar seus Créditos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Escolha o Produto</p>
                    <p className="text-sm text-gray-600">
                      Acesse qualquer produto disponível na plataforma
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Confirme a Consulta</p>
                    <p className="text-sm text-gray-600">
                      Veja o custo em créditos e confirme a operação
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Receba os Dados</p>
                    <p className="text-sm text-gray-600">
                      Créditos são descontados e você recebe as informações
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Custo por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-700">Smart CNPJ 360°</span>
                  <Badge variant="secondary">5 créditos</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-700">Dados 360° PF</span>
                  <Badge variant="secondary">8 créditos</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-700">Dados 360° PJ</span>
                  <Badge variant="secondary">12 créditos</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-700">Radar Jurídico</span>
                  <Badge variant="secondary">20 créditos</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-700">Radar Financeiro</span>
                  <Badge variant="secondary">10-50 créditos</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente de Card de Pacote
function PackageCard({ package: pack }: { package: Package }) {
  const totalCredits = pack.credits + (pack.bonus || 0)
  
  return (
    <Card className={`relative ${
      pack.popular ? 'border-2 border-primary shadow-lg' : ''
    }`}>
      {/* Badge Popular */}
      {pack.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-white">
            Mais Vendido
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-6 pt-8">
        <CardTitle className="text-xl">{pack.name}</CardTitle>
        
        <div className="mt-4 space-y-3">
          {/* Preço */}
          <div>
            <p className="text-3xl font-bold text-gray-900">
              R$ {pack.price.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              R$ {pack.pricePerCredit.toFixed(3)} por crédito
            </p>
          </div>
          
          {/* Créditos */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-primary">
                {pack.credits}
              </p>
              <p className="text-gray-600">créditos</p>
            </div>
            
            {/* Bônus */}
            {pack.bonus && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">
                    +{pack.bonus} bônus
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  Total: {totalCredits} créditos
                </p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Features */}
        <div className="space-y-2 py-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Créditos base</span>
            <span className="font-semibold text-gray-900">{pack.credits}</span>
          </div>
          {pack.bonus && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Bônus grátis</span>
              <span className="font-semibold text-green-600">+{pack.bonus}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-primary text-lg">{totalCredits}</span>
          </div>
        </div>
        
        {/* Botão */}
        <Button 
          className="w-full" 
          size="lg"
          variant={pack.popular ? 'default' : 'outline'}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Comprar Agora
        </Button>
      </CardContent>
    </Card>
  )
}
