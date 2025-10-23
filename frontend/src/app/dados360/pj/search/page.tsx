'use client'

import { lazy, Suspense } from 'react'
import { Building2, TrendingUp, Users, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDados360PJ } from '@/hooks/useDados360PJ'
import { stats } from '@/mocks/dados360-pj'

// Lazy load components para reduzir TBT
const CNPJSearchForm = lazy(() => import('@/components/dados360/CNPJSearchForm').then(mod => ({ default: mod.CNPJSearchForm })))
const CostConfirmationModal = lazy(() => import('@/components/dados360/CostConfirmationModal').then(mod => ({ default: mod.CostConfirmationModal })))

export default function SearchDados360PJPage() {
  const {
    cnpj,
    isValid,
    showCostModal,
    isLoading,
    error,
    handleCnpjChange,
    handleSearch,
    confirmSearch,
    cancelSearch
  } = useDados360PJ()
  
  // CNPJs de exemplo (gerados com algoritmo válido)
  const exampleCNPJs = [
    '10.000.001/0001-90',
    '10.000.002/0001-34',
    '10.000.003/0001-89',
    '10.000.004/0001-23'
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dados 360° - Pessoa Jurídica
              </h1>
              <p className="text-gray-600">
                Consulte informações completas sobre empresas
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Empresas na Base</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalCompanies.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Empresas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeCompanies.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Sócios</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalPartners.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Média Funcionários</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageEmployees}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Form */}
          <div className="lg:col-span-2">
            <Suspense fallback={
              <div className="space-y-4 p-6 bg-white rounded-lg border">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            }>
              <CNPJSearchForm
                cnpj={cnpj}
                isValid={isValid}
                isLoading={isLoading}
                error={error}
                onCnpjChange={handleCnpjChange}
                onSearch={handleSearch}
              />
            </Suspense>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* CNPJs de Exemplo */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  CNPJs para Teste
                </h3>
                <div className="space-y-2">
                  {exampleCNPJs.map((exampleCnpj, index) => (
                    <button
                      key={index}
                      onClick={() => handleCnpjChange(exampleCnpj)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                    >
                      <p className="text-xs text-gray-600 mb-1">Exemplo {index + 1}</p>
                      <p className="text-sm font-mono text-gray-900">{exampleCnpj}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Dicas */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Dicas de Uso
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 flex-shrink-0">1</Badge>
                    <p className="text-sm text-gray-600">
                      Digite o CNPJ completo da empresa que deseja consultar
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 flex-shrink-0">2</Badge>
                    <p className="text-sm text-gray-600">
                      Aguarde a validação automática do CNPJ (ícone verde)
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 flex-shrink-0">3</Badge>
                    <p className="text-sm text-gray-600">
                      Confirme o custo de 12 créditos para visualizar o dossiê
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 flex-shrink-0">4</Badge>
                    <p className="text-sm text-gray-600">
                      Acesse informações detalhadas sobre a empresa
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Info Adicional */}
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-600 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Consulta Completa
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      O Dossiê 360° PJ reúne todas as informações públicas disponíveis sobre a empresa, 
                      incluindo dados cadastrais, financeiros, sócios e histórico de funcionários.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modal de Confirmação de Custo */}
      <Suspense fallback={null}>
        <CostConfirmationModal
          open={showCostModal}
          onConfirm={confirmSearch}
          onCancel={cancelSearch}
          costCredits={12}
          productName="Dossiê 360° - Pessoa Jurídica"
          cpf={cnpj}
        />
      </Suspense>
    </div>
  )
}
