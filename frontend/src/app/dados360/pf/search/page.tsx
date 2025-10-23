'use client'

import { useEffect, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { User, TrendingUp, MapPin, Briefcase, Users, FileText, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDados360PF } from '@/hooks/useDados360PF'
import { mockPessoas } from '@/mocks/dados360-pf'

// Lazy load components para reduzir TBT
const CPFSearchForm = lazy(() => import('@/components/dados360/CPFSearchForm').then(mod => ({ default: mod.CPFSearchForm })))
const CostConfirmationModal = lazy(() => import('@/components/dados360/CostConfirmationModal').then(mod => ({ default: mod.CostConfirmationModal })))

export default function Dados360PFSearchPage() {
  const router = useRouter()
  const {
    cpf,
    setCpf,
    isSearching,
    cpfError,
    isValidCPF,
    showCostModal,
    costCredits,
    person,
    notFound,
    handleSearch,
    confirmSearch,
    cancelSearch,
  } = useDados360PF()
  
  // Redirecionar para página de dossiê após encontrar pessoa
  useEffect(() => {
    if (person) {
      const cleanCpf = person.cpf.replace(/[.\-]/g, '')
      router.push(`/dados360/pf/${cleanCpf}`)
    }
  }, [person, router])
  
  // Stats da base de dados
  const totalPessoas = mockPessoas.length
  const pessoasAtivas = mockPessoas.filter(p => p.experienciaProfissional?.some(e => e.situacao === 'ATIVO')).length
  const pessoasComVinculos = mockPessoas.filter(p => p.vinculosEmpresariais && p.vinculosEmpresariais.length > 0).length
  const mediaIdade = Math.round(mockPessoas.reduce((acc, p) => acc + p.idade, 0) / mockPessoas.length)
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dados 360° Pessoa Física
            </h1>
            <p className="text-gray-600 mt-1">
              Dossiê completo com dados pessoais, profissionais e empresariais
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary" className="bg-primary-100 text-primary-700 border-primary-200">
            <FileText className="h-3 w-3 mr-1" />
            8 créditos por consulta
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Dados verificados
          </Badge>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Base de Dados</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPessoas}</p>
                <p className="text-xs text-gray-500 mt-1">pessoas cadastradas</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empregados</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pessoasAtivas}</p>
                <p className="text-xs text-gray-500 mt-1">com vínculo ativo</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empresários</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pessoasComVinculos}</p>
                <p className="text-xs text-gray-500 mt-1">com participação em empresas</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média de Idade</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mediaIdade}</p>
                <p className="text-xs text-gray-500 mt-1">anos na base</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Pessoa Física</CardTitle>
              <CardDescription>
                Digite o CPF para acessar o dossiê completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                </div>
              }>
                <CPFSearchForm
                  cpf={cpf}
                  onCpfChange={setCpf}
                  onSearch={handleSearch}
                  isSearching={isSearching}
                  error={cpfError}
                  isValid={isValidCPF}
                />
              </Suspense>
              
              {/* Not Found Message */}
              {notFound && (
                <Card className="mt-6 bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <User className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900">CPF não encontrado</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Não foram encontrados registros para o CPF informado.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* O que está incluído */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">O que está incluído</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Dados Pessoais</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Nome, CPF, RG, data nascimento, filiação, documentos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Renda e Score</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Faixa de renda estimada, classe econômica, score de crédito
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Endereços</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Endereços residenciais, comerciais e de correspondência
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Relacionamentos</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Parentes identificados e vínculos familiares
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Profissional</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Histórico de empregos, cargos e salários estimados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Empresarial</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Participações em empresas, qualificações e percentuais
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Exemplo de CPF */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">💡 Dica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">
                Use um destes CPFs para testar:
              </p>
              <div className="space-y-2">
                {mockPessoas.slice(0, 3).map((pessoa) => (
                  <button
                    key={pessoa.id}
                    onClick={() => setCpf(pessoa.cpf)}
                    className="w-full text-left p-2 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {pessoa.cpf}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {pessoa.nome}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Cost Confirmation Modal */}
      <Suspense fallback={null}>
        <CostConfirmationModal
          open={showCostModal}
          onConfirm={confirmSearch}
          onCancel={cancelSearch}
          costCredits={costCredits}
          productName="Dossiê 360° PF"
          cpf={cpf}
        />
      </Suspense>
    </div>
  )
}
