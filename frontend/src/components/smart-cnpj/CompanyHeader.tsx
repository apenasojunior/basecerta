'use client'

import { Building2, Heart, Share2, Download, ExternalLink, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'
import { formatDate } from '@/lib/formatters'

interface CompanyHeaderProps {
  company: SmartCNPJCompany
  isFavorite?: boolean
  onToggleFavorite?: () => void
  className?: string
}

export function CompanyHeader({
  company,
  isFavorite = false,
  onToggleFavorite,
  className,
}: CompanyHeaderProps) {
  const situacaoColors: Record<SmartCNPJCompany['situacaoCadastral'], string> = {
    ATIVA: 'bg-green-100 text-green-700 border-green-200',
    SUSPENSA: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    INAPTA: 'bg-orange-100 text-orange-700 border-orange-200',
    BAIXADA: 'bg-red-100 text-red-700 border-red-200',
    NULA: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const tipoColors: Record<SmartCNPJCompany['tipo'], string> = {
    MATRIZ: 'bg-blue-100 text-blue-700 border-blue-200',
    FILIAL: 'bg-purple-100 text-purple-700 border-purple-200',
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm p-6', className)}>
      {/* Top Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          {/* Logo Placeholder */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <Building2 className="h-10 w-10 text-white" />
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
              {company.razaoSocial}
            </h1>
            {company.nomeFantasia !== company.razaoSocial && (
              <p className="text-lg text-gray-600 mb-3">
                {company.nomeFantasia}
              </p>
            )}
            
            {/* CNPJ */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-500">CNPJ:</span>
              <span className="text-base font-mono font-semibold text-gray-900">
                {company.cnpj}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={cn('border', situacaoColors[company.situacaoCadastral])}>
                {company.situacaoCadastral}
              </Badge>
              <Badge className={cn('border', tipoColors[company.tipo])}>
                {company.tipo}
              </Badge>
              {company.isMEI && (
                <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
                  MEI
                </Badge>
              )}
              {company.isSimplesNacional && (
                <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                  Simples Nacional
                </Badge>
              )}
              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                {company.porte === 'MEI' ? 'MEI' :
                 company.porte === 'ME' ? 'Microempresa' :
                 company.porte === 'EPP' ? 'Pequeno Porte' :
                 company.porte === 'MEDIO' ? 'Médio Porte' : 'Grande Porte'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFavorite}
            className={cn(
              'transition-all',
              isFavorite && 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            <span className="hidden md:inline">
              {isFavorite ? 'Favoritado' : 'Favoritar'}
            </span>
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
            <span className="hidden md:inline">Compartilhar</span>
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Bottom Section - Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Abertura</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(company.dataAbertura)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Localização</p>
            <p className="text-sm font-semibold text-gray-900">
              {company.endereco.municipio}/{company.endereco.uf}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Building2 className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">CNAEs</p>
            <p className="text-sm font-semibold text-gray-900">
              {company.cnaesSecundarios.length + 1} atividades
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
