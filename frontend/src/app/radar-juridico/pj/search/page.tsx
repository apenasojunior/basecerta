/**
 * Página de Busca - Radar Jurídico PJ
 * Busca de processos jurídicos por CNPJ
 */

'use client'

import { Scale, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CNPJSearchForm } from '@/components/dados360/CNPJSearchForm'
import { CostConfirmationModal } from '@/components/dados360/CostConfirmationModal'
import { useRadarJuridico } from '@/hooks/useRadarJuridico'
import { radarJuridicoPJStats } from '@/mocks/radar-juridico-pj'

export default function RadarJuridicoPJSearchPage() {
  const {
    cpfCnpj: cnpj,
    setCpfCnpj: handleSetCnpj,
    isValid,
    isSearching,
    showCostModal,
    handleSearch,
    confirmSearch,
    cancelSearch,
  } = useRadarJuridico('PJ')
  
  // CNPJs de exemplo (das empresas mockadas)
  const exemplosCNPJ = [
    { cnpj: '10.000.001/0001-90', nome: 'Tech Solutions Ltda', processos: 12 },
    { cnpj: '10.000.002/0001-34', nome: 'Comercial Brasil S.A.', processos: 18 },
    { cnpj: '10.000.003/0001-79', nome: 'Indústria Moderna Eireli', processos: 15 },
  ]
  
  const handleCnpjChange = (novoCnpj: string) => {
    handleSetCnpj(novoCnpj)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Radar Jurídico - Pessoa Jurídica
            </h1>
          </div>
          <p className="text-gray-600">
            Consulte processos jurídicos vinculados a empresas em tribunais de todo o Brasil
          </p>
          
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-900">
              💡 Esta consulta inclui processos cíveis, trabalhistas, criminais e tributários
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Scale className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {radarJuridicoPJStats.totalEmpresas}
                </p>
                <p className="text-xs text-gray-600 mt-1">Empresas Consultadas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {radarJuridicoPJStats.totalProcessos}
                </p>
                <p className="text-xs text-gray-600 mt-1">Total de Processos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {radarJuridicoPJStats.processosAtivos}
                </p>
                <p className="text-xs text-gray-600 mt-1">Processos Ativos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {radarJuridicoPJStats.tribunaisUnicos}
                </p>
                <p className="text-xs text-gray-600 mt-1">Tribunais Cobertos</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Busca */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Consultar Processos
                </h2>
                
                <CNPJSearchForm
                  cnpj={cnpj}
                  isValid={isValid}
                  isLoading={isSearching}
                  error={null}
                  onCnpjChange={handleCnpjChange}
                  onSearch={handleSearch}
                />
              </CardContent>
            </Card>
            
            {/* Card Informativo */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-orange-600" />
                  O que está incluído nesta consulta?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Processos cíveis (contratos, indenizações, cobranças)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Processos trabalhistas (ações de ex-funcionários)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Processos criminais (crimes empresariais)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Processos tributários (execuções fiscais, contestações)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Histórico completo de movimentações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Partes envolvidas e advogados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Valores de causas e documentos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Exemplos e Dicas */}
          <div className="space-y-6">
            {/* Exemplos de CNPJs */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Exemplos de Consulta
                </h3>
                <div className="space-y-3">
                  {exemplosCNPJ.map((exemplo, index) => (
                    <button
                      key={index}
                      onClick={() => handleCnpjChange(exemplo.cnpj)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <p className="text-sm font-mono font-medium text-primary">
                        {exemplo.cnpj}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{exemplo.nome}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {exemplo.processos} processos
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Dicas */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  💡 Dicas de Uso
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Digite o CNPJ completo da empresa</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Use os filtros para refinar resultados</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">3.</span>
                    <span>Clique em qualquer processo para ver detalhes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">4.</span>
                    <span>Acompanhe processos trabalhistas e tributários</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
            
            {/* Custo */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">Custo por consulta</p>
                  <p className="text-4xl font-bold mb-2">20</p>
                  <p className="text-sm opacity-90">créditos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modal de Confirmação */}
      <CostConfirmationModal
        open={showCostModal}
        onConfirm={confirmSearch}
        onCancel={cancelSearch}
        costCredits={20}
        productName="Radar Jurídico - Pessoa Jurídica"
      />
    </div>
  )
}
