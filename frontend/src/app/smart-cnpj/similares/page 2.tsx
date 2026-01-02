/**
 * Smart CNPJ - Encontre Empresas Similares
 * Sprint: Smart CNPJ Search - ISSUE-00-B (Refinamento)
 * 
 * Funcionalidade:
 * 1. Cliente informa um CNPJ de referência
 * 2. Sistema busca os CNAEs deste CNPJ
 * 3. Vasculha as top empresas que mais faturam por estado (mesmo CNAE)
 * 4. Exibe ranking por estado (Top 10 que mais faturam)
 * 5. Ao clicar no estado, vai para /results com filtros:
 *    - UF=estado
 *    - Segmento=CNAE_principal
 *    - Capital Social DESC (maiores primeiro)
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Building2, 
  Search, 
  TrendingUp, 
  MapPin,
  DollarSign,
  ArrowRight,
  Loader2,
  AlertCircle,
  Copy,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/**
 * Interface para resultado por estado
 */
interface StateRanking {
  uf: string
  uf_nome: string
  total_empresas: number
  capital_total: number
  top_empresa: {
    razao_social: string
    cnpj: string
    capital_social: number
  }
}

/**
 * Interface para análise do CNPJ
 */
interface CNPJAnalysis {
  cnpj_referencia: string
  razao_social: string
  cnae_principal: string
  cnae_descricao: string
  capital_social: number
  uf: string
  rankings_por_estado: StateRanking[]
}

export default function EmpresasSimilaresPage() {
  const router = useRouter()
  const [cnpj, setCnpj] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [analysis, setAnalysis] = useState<CNPJAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Formata CNPJ com máscara
   */
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return value
  }

  /**
   * Handler de busca
   */
  const handleSearch = async () => {
    if (cnpj.replace(/\D/g, '').length !== 14) {
      setError('Digite um CNPJ válido (14 dígitos)')
      return
    }

    setIsSearching(true)
    setError(null)
    setAnalysis(null)

    try {
      // Chamada real à API
      const cnpjLimpo = cnpj.replace(/\D/g, '')
      const response = await fetch(`/api/v1/smart-cnpj/similares/${cnpjLimpo}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CNPJ não encontrado na base de dados')
        }
        throw new Error('Erro ao buscar empresas similares. Tente novamente.')
      }
      
      const data = await response.json()
      setAnalysis(data)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados')
      console.error('Erro na busca:', err)
    } finally {
      setIsSearching(false)
    }
  }

  /**
   * Handler de clique no estado - redireciona para resultados com filtros
   */
  const handleStateClick = (state: StateRanking) => {
    if (!analysis) return

    // Redireciona para página de resultados com filtros por CNAE e UF
    // A busca será feita automaticamente pela página de resultados
    const params = new URLSearchParams({
      type: 'cnae',                          // Tipo de busca: CNAE
      q: analysis.cnae_principal,            // Ex: '4781400'
      uf: state.uf,                          // Ex: 'SP'
      situacao_cadastral: 'ATIVA',
      orderBy: 'capital_social',
      orderDirection: 'desc',
      limit: '10'                            // TOP 10 empresas
    })

    router.push(`/smart-cnpj/results?${params.toString()}`)
  }

  /**
   * Formata valor monetário
   */
  const formatMoney = (value: number) => {
    if (value >= 1_000_000_000) {
      return `R$ ${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `R$ ${(value / 1_000).toFixed(1)}K`
    }
    return `R$ ${value.toLocaleString('pt-BR')}`
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Copy className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Encontre Empresas Similares
                </h1>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Novo
                </Badge>
              </div>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Informe um CNPJ e descubra as top empresas do mesmo segmento em cada estado
              </p>
            </div>
          </div>
        </div>

        {/* Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary-600" />
              Buscar por CNPJ de Referência
            </CardTitle>
            <CardDescription>
              Digite o CNPJ de uma empresa para encontrar similares por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
                maxLength={18}
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || cnpj.replace(/\D/g, '').length !== 14}
                className="gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        {analysis && (
          <>
            {/* Info da Empresa de Referência */}
            <Card className="border-primary-200 bg-primary-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5 text-primary-600" />
                  Empresa de Referência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Razão Social</p>
                  <p className="font-semibold text-gray-900">{analysis.razao_social}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">CNPJ</p>
                    <p className="font-mono text-sm text-gray-900">{analysis.cnpj_referencia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CNAE Principal</p>
                    <p className="font-mono text-sm text-gray-900">{analysis.cnae_principal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capital Social</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {formatMoney(analysis.capital_social)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Segmento</p>
                  <Badge variant="outline" className="mt-1">
                    {analysis.cnae_descricao}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Ranking por Estado */}
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Top Empresas por Estado
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  Clique em um estado para ver todas as empresas similares ordenadas por capital social
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.rankings_por_estado.map((state, idx) => (
                  <Card 
                    key={state.uf}
                    className="cursor-pointer hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 transition-all duration-200 group"
                    onClick={() => handleStateClick(state)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary-600" />
                          <CardTitle className="text-lg">{state.uf_nome}</CardTitle>
                        </div>
                        <Badge className="bg-primary-100 text-primary-700 border-primary-200">
                          #{idx + 1}
                        </Badge>
                      </div>
                    </CardHeader>
                                        <CardContent className="space-y-4">
                      {/* Métricas */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Total de Empresas</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {state.total_empresas.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          com CNAE {analysis.cnae_principal}
                        </p>
                      </div>

                      {/* Top Empresa */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-yellow-600" />
                          <p className="text-xs font-semibold text-gray-700">Líder do Ranking</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {state.top_empresa.razao_social}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs font-mono text-gray-500">
                            {state.top_empresa.cnpj}
                          </p>
                          <div className="flex items-center gap-1 text-green-700">
                            <DollarSign className="h-3 w-3" />
                            <p className="text-xs font-semibold">
                              {formatMoney(state.top_empresa.capital_social)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 group-hover:bg-primary-50 group-hover:border-primary-300"
                      >
                        Ver Top 10 em {state.uf}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Estado vazio */}
        {!analysis && !isSearching && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Copy className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    Encontre empresas do mesmo segmento
                  </p>
                  <p className="text-sm text-gray-600">
                    Digite um CNPJ acima para começar a análise
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  )
}
