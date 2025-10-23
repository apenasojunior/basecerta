'use client'

import { Building2, Heart, Share2, FileDown, Calendar, MapPin, Briefcase } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCNPJ } from '@/lib/formatters'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface CompanyHeaderFullProps {
  company: Dados360PJCompany
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function CompanyHeaderFull({ company, isFavorite = false, onToggleFavorite }: CompanyHeaderFullProps) {
  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'ATIVA': return 'bg-green-100 text-green-800 border-green-200'
      case 'SUSPENSA': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'INAPTA': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'BAIXADA': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getPorteLabel = (porte: string) => {
    switch (porte) {
      case 'MEI': return 'Microempreendedor Individual'
      case 'ME': return 'Microempresa'
      case 'EPP': return 'Empresa de Pequeno Porte'
      case 'DEMAIS': return 'Demais'
      default: return porte
    }
  }
  
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <Building2 className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          
          {/* Company Info */}
          <div className="flex-1 min-w-0">
            {/* Nome e CNPJ */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {company.razaoSocial}
            </h1>
            
            {company.nomeFantasia && (
              <p className="text-lg text-gray-600 mb-2">
                {company.nomeFantasia}
              </p>
            )}
            
            <p className="text-sm font-mono text-gray-500 mb-4">
              CNPJ: {formatCNPJ(company.cnpj)}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getSituacaoColor(company.situacao)}>
                {company.situacao}
              </Badge>
              
              <Badge variant="outline">
                {company.tipo}
              </Badge>
              
              <Badge variant="secondary">
                {getPorteLabel(company.porte)}
              </Badge>
              
              {company.opcaoMEI && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  MEI
                </Badge>
              )}
              
              {company.opcaoSimples && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Simples Nacional
                </Badge>
              )}
            </div>
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Data de Abertura</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(company.dataAbertura)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">Localização</p>
                  <p className="text-sm font-medium text-gray-900">
                    {company.enderecos[0].municipio}/{company.enderecos[0].uf}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600">CNAE Principal</p>
                  <p className="text-sm font-medium text-gray-900">
                    {company.cnae.codigo}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex md:flex-col gap-2">
            <Button
              variant={isFavorite ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleFavorite}
              className="flex-1 md:flex-none"
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              Favoritar
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
