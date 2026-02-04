/**
 * InsightCard Component
 * Sprint: Smart CNPJ Search - ISSUE-00-B
 * Sprint S03: Feature P3 - Drill-Down Interativo
 * 
 * Card clicável que exibe estatísticas B2B em cache.
 * Ao clicar, navega para /results com filtros pré-aplicados.
 * Com P3: Clique no ícone "Info" abre modal de drill-down detalhado.
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  ArrowRight, 
  Info,
  MapPin,
  DollarSign,
  Factory,
  Maximize2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { InsightCardProps } from '@/types/insights'
import { 
  formatCompanies, 
  formatCurrency, 
  getDemandColor, 
  getBadgeLabel 
} from '@/types/insights'
import DrillDownModal from '@/components/DrillDownModal'

/**
 * Card individual de insight
 */
export function InsightCard({ 
  insight, 
  onClick, 
  className = '',
  variant = 'default' 
}: InsightCardProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [drillDownData, setDrillDownData] = useState<any>(null)
  const [loadingDrillDown, setLoadingDrillDown] = useState(false)
  
  const badgeLabel = getBadgeLabel(insight)
  const demandColor = getDemandColor(insight.metadata.demanda_score)
  
  /**
   * Carregar dados detalhados para drill-down
   */
  const loadDrillDownData = async () => {
    setLoadingDrillDown(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/insights/${insight.insight_key}/details`
      )
      if (!response.ok) throw new Error('Erro ao carregar detalhes')
      const data = await response.json()
      setDrillDownData(data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Erro ao carregar drill-down:', error)
    } finally {
      setLoadingDrillDown(false)
    }
  }
  
  /**
   * Handler de clique - navega para /results com filtros
   */
  const handleClick = () => {
    if (onClick) {
      onClick(insight)
    } else {
      // Converte filters para query string
      const params = new URLSearchParams()
      
      Object.entries(insight.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)))
          } else {
            params.set(key, String(value))
          }
        }
      })
      
      // Navega com filtros pré-aplicados
      router.push(`/smart-cnpj/results?${params.toString()}`)
    }
  }
  
  /**
   * Ícone da categoria
   */
  const getCategoryIcon = () => {
    switch (insight.categoria) {
      case 'setor':
        return <Factory className="h-5 w-5 text-primary-600" />
      case 'estado':
        return <MapPin className="h-5 w-5 text-primary-600" />
      case 'capital':
        return <DollarSign className="h-5 w-5 text-primary-600" />
      default:
        return <Info className="h-5 w-5 text-primary-600" />
    }
  }
  
  return (
    <>
      <Card 
        className={`
          group cursor-pointer transition-all duration-200
          hover:shadow-lg hover:border-primary-300 hover:-translate-y-1
          ${className}
        `}
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-3xl">{insight.metadata.icone}</span>
              <span className="group-hover:text-primary-600 transition-colors">
                {insight.titulo}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getCategoryIcon()}
              {/* Botão de Drill-Down */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  loadDrillDownData()
                }}
                disabled={loadingDrillDown}
                className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors group/drill disabled:opacity-50"
                title="Ver análise detalhada"
              >
                <Maximize2 
                  className={`w-4 h-4 text-gray-400 group-hover/drill:text-orange-600 transition-colors ${
                    loadingDrillDown ? 'animate-pulse' : ''
                  }`} 
                />
              </button>
            </div>
          </div>
        
        {/* Badge de destaque (se houver) */}
        {badgeLabel && (
          <Badge 
            className={`
              mt-2 w-fit
              ${demandColor === 'red' ? 'bg-red-100 text-red-700 border-red-200' : ''}
              ${demandColor === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
              ${demandColor === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
              ${demandColor === 'gray' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
            `}
          >
            {badgeLabel}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Número de empresas */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Total de Empresas</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-3xl font-bold text-gray-900">
              {formatCompanies(insight.total_empresas)}
            </p>
            {insight.percentual && (
              <span className="text-sm text-gray-500">
                ({insight.percentual.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
        
        {/* Metadata dinâmica baseada na categoria */}
        {insight.categoria === 'setor' && (
          <>
            {/* Ticket Médio */}
            {insight.metadata.ticket_medio_min && insight.metadata.ticket_medio_max && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Ticket Médio</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(insight.metadata.ticket_medio_min)} - {formatCurrency(insight.metadata.ticket_medio_max)}
                </p>
              </div>
            )}
            
            {/* O que compram */}
            {insight.metadata.o_que_compram && insight.metadata.o_que_compram.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">O que compram</p>
                <div className="flex flex-wrap gap-1">
                  {insight.metadata.o_que_compram.slice(0, 3).map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {insight.metadata.o_que_compram.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{insight.metadata.o_que_compram.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        
        {insight.categoria === 'estado' && (
          <>
            {/* Rank */}
            {insight.metadata.rank && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Ranking Nacional</p>
                <p className="text-2xl font-bold text-primary-600">
                  #{insight.metadata.rank}
                </p>
              </div>
            )}
            
            {/* Top Setores */}
            {insight.metadata.top_setores && insight.metadata.top_setores.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Top Setores</p>
                <div className="flex flex-wrap gap-1">
                  {insight.metadata.top_setores.slice(0, 2).map((setor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {setor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {insight.categoria === 'capital' && (
          <>
            {/* Perfil */}
            {insight.metadata.perfil && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Perfil</p>
                <p className="text-sm text-gray-900">{insight.metadata.perfil}</p>
              </div>
            )}
            
            {/* Ciclo de Venda */}

    {/* Modal de Drill-Down */}
    <DrillDownModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      insight={insight}
      detailsData={drillDownData}
    />
  </>
  )
}                <p className="text-sm text-gray-500 mb-1">Ciclo de Venda</p>
                <p className="text-sm text-gray-900">{insight.metadata.ciclo_venda}</p>
              </div>
            )}
          </>
        )}
        
        {/* CTA Button */}
        <Button 
          variant="outline" 
          className="w-full mt-4 group-hover:bg-primary-50 group-hover:border-primary-300"
        >
          Ver Empresas
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}
