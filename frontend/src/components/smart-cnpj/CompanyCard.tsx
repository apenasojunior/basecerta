'use client'

import { Building2, MapPin, Calendar, TrendingUp, Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'
import { formatCurrency, formatDate } from '@/lib/formatters'

interface CompanyCardProps {
  company: SmartCNPJCompany
  isFavorite?: boolean
  onToggleFavorite?: (cnpj: string) => void
  className?: string
}

export function CompanyCard({
  company,
  isFavorite = false,
  onToggleFavorite,
  className,
}: CompanyCardProps) {
  // Remove formatting from CNPJ for URL
  const cleanCnpj = company.cnpj.replace(/[.\-\/]/g, '')
  
  const situacaoColors: Record<SmartCNPJCompany['situacaoCadastral'], string> = {
    ATIVA: 'bg-green-100 text-green-700 border-green-200',
    SUSPENSA: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    INAPTA: 'bg-orange-100 text-orange-700 border-orange-200',
    BAIXADA: 'bg-red-100 text-red-700 border-red-200',
    NULA: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const porteLabels: Record<SmartCNPJCompany['porte'], string> = {
    MEI: 'MEI',
    ME: 'Microempresa',
    EPP: 'Pequeno Porte',
    MEDIO: 'Médio Porte',
    GRANDE: 'Grande Porte',
  }

  const tipoColors: Record<SmartCNPJCompany['tipo'], string> = {
    MATRIZ: 'bg-blue-100 text-blue-700 border-blue-200',
    FILIAL: 'bg-purple-100 text-purple-700 border-purple-200',
  }

  return (
    <Card className={cn('hover:shadow-lg transition-all duration-200 group', className)}>
      <CardContent className="p-5">
        {/* Header com Badges */}
        <div className="flex items-start justify-between mb-4">
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
                Simples
              </Badge>
            )}
          </div>
          
          {/* Botão Favoritar */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(company.cnpj)
              }}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                isFavorite
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
              )}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
            </button>
          )}
        </div>

        {/* Razão Social e Nome Fantasia */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
            {company.razaoSocial}
          </h3>
          {company.nomeFantasia !== company.razaoSocial && (
            <p className="text-sm text-gray-600">
              {company.nomeFantasia}
            </p>
          )}
        </div>

        {/* CNPJ */}
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm font-mono text-gray-700">{company.cnpj}</span>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Porte e Capital Social */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Porte</p>
            <p className="text-sm font-medium text-gray-900">{porteLabels[company.porte]}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Capital Social</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(company.capitalSocial)}</p>
          </div>

          {/* CNAE Principal */}
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs text-gray-500">CNAE Principal</p>
            <p className="text-sm text-gray-700">
              <span className="font-mono text-xs text-gray-500">{company.cnaesPrimario.codigo}</span>
              {' - '}
              {company.cnaesPrimario.descricao}
            </p>
          </div>

          {/* Localização */}
          <div className="md:col-span-2 flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              {company.endereco.municipio}/{company.endereco.uf}
              {' - '}
              {company.endereco.bairro}
            </p>
          </div>

          {/* Data de Abertura */}
          <div className="md:col-span-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Aberta em {formatDate(company.dataAbertura)}
            </p>
          </div>
        </div>

        {/* Sócios */}
        {company.socios.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              {company.socios.length} {company.socios.length === 1 ? 'Sócio' : 'Sócios'}
            </p>
            <div className="flex flex-wrap gap-1">
              {company.socios.slice(0, 2).map((socio, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {socio.nome}
                </Badge>
              ))}
              {company.socios.length > 2 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{company.socios.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer com Botão */}
      <CardFooter className="p-4 bg-gray-50 border-t border-gray-200">
        <Link href={`/smart-cnpj/${cleanCnpj}`} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-200"
          >
            <span>Ver Detalhes Completos</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
