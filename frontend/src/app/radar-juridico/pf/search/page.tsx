/**
 * Página de Busca - Radar Jurídico PF
 * Permite buscar processos jurídicos por CPF
 */

'use client'

import { lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Scale, 
  FileText, 
  AlertCircle, 
  TrendingUp, 
  Users,
  Info
} from 'lucide-react'
import { useRadarJuridico } from '@/hooks/useRadarJuridico'
import { radarJuridicoStats } from '@/mocks/radar-juridico-pf'
import { RadarJuridicoPFSearchSkeleton } from '@/components/radar-juridico/pf/RadarJuridicoPFSearchSkeleton'

// Lazy load components para reduzir TBT
const CPFSearchForm = lazy(() => import('@/components/dados360/CPFSearchForm').then(mod => ({ default: mod.CPFSearchForm })))
const CostConfirmationModal = lazy(() => import('@/components/dados360/CostConfirmationModal').then(mod => ({ default: mod.CostConfirmationModal })))

export default function RadarJuridicoPFSearchPage() {
  const {
    cpfCnpj,
    setCpfCnpj,
    isValid,
    isSearching,
    showCostModal,
    handleSearch,
    confirmSearch,
    cancelSearch
  } = useRadarJuridico('PF')

  const exampleCPFs = [
    { cpf: '111.444.777-35', nome: 'João Silva Santos', processos: 8 },
    { cpf: '222.555.888-46', nome: 'Maria Oliveira Costa', processos: 12 },
    { cpf: '333.666.999-57', nome: 'Pedro Henrique Souza', processos: 6 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Radar Jurídico - Pessoa Física</h1>
              <p className="text-gray-600 mt-1">
                Consulte processos jurídicos em todos os tribunais do Brasil
              </p>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              O Radar Jurídico pesquisa processos em mais de 90 tribunais brasileiros, incluindo
              TJSP, TRT, STJ, TST e tribunais estaduais.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Busca */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Pessoas</p>
                      <p className="text-2xl font-bold text-gray-900">{radarJuridicoStats.totalPessoas}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Processos</p>
                      <p className="text-2xl font-bold text-gray-900">{radarJuridicoStats.totalProcessos}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Processos Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{radarJuridicoStats.processosAtivos}</p>
                      <div className="flex items-center text-green-600 text-xs mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>Em andamento</span>
                      </div>
                    </div>
                    <Scale className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tribunais</p>
                      <p className="text-2xl font-bold text-gray-900">{radarJuridicoStats.tribunaisUnicos}</p>
                      <p className="text-xs text-gray-500 mt-1">Diferentes</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Busca */}
            <Card>
              <CardHeader>
                <CardTitle>Consultar Processos Jurídicos</CardTitle>
                <CardDescription>
                  Digite o CPF para consultar todos os processos judiciais vinculados
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
                    cpf={cpfCnpj}
                    onCpfChange={setCpfCnpj}
                    isValid={isValid}
                    isSearching={isSearching}
                    onSearch={handleSearch}
                    error={null}
                  />
                </Suspense>

                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    O que está incluído nesta consulta?
                  </h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>✓ Processos Cíveis (ações, execuções, recursos)</li>
                    <li>✓ Processos Trabalhistas (reclamações, dissídios)</li>
                    <li>✓ Processos Criminais (inquéritos, ações penais)</li>
                    <li>✓ Processos Tributários (execuções fiscais, MS)</li>
                    <li>✓ Processos de Família (divórcio, alimentos, guarda)</li>
                    <li>✓ Histórico completo de movimentações</li>
                    <li>✓ Partes envolvidas e advogados</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Exemplos e Dicas */}
          <div className="space-y-6">
            {/* Exemplos de CPF */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exemplos de Consulta</CardTitle>
                <CardDescription>Clique em um CPF para testar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {exampleCPFs.map((example) => (
                  <button
                    key={example.cpf}
                    onClick={() => setCpfCnpj(example.cpf)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">{example.cpf}</p>
                        <p className="text-sm text-gray-600 mt-1">{example.nome}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {example.processos} processos
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dicas de Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p>
                    <strong className="text-gray-900">Processos em todos os graus:</strong> A busca
                    inclui 1ª e 2ª instâncias, além de tribunais superiores.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p>
                    <strong className="text-gray-900">Histórico completo:</strong> Veja todas as
                    movimentações processuais desde a distribuição até a decisão final.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p>
                    <strong className="text-gray-900">Partes e advogados:</strong> Identifique todas
                    as partes envolvidas e seus respectivos advogados.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">4</span>
                  </div>
                  <p>
                    <strong className="text-gray-900">Processos relacionados:</strong> Visualize
                    conexões entre processos, como recursos e ações conexas.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Custo */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Custo por consulta</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      20 créditos
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Consulta completa em todos os tribunais
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Suspense fallback={null}>
        <CostConfirmationModal
          open={showCostModal}
          onConfirm={confirmSearch}
          onCancel={cancelSearch}
          costCredits={20}
          productName="Radar Jurídico - Pessoa Física"
          cpf={cpfCnpj}
        />
      </Suspense>
    </div>
  )
}
