'use client'

import { MapPin, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface AddressesPJCardProps {
  company: Dados360PJCompany
}

export function AddressesPJCard({ company }: AddressesPJCardProps) {
  const { enderecos } = company
  
  if (!enderecos || enderecos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Endereços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhum endereço disponível
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontrados endereços para esta empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const openInMaps = (endereco: typeof enderecos[0]) => {
    const address = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.municipio} - ${endereco.uf}, ${endereco.cep}`
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank')
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          Endereços
          <Badge variant="secondary" className="ml-auto">
            {enderecos.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enderecos.map((endereco, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Header com tipo e badge */}
              <div className="flex items-start justify-between mb-3">
                <Badge 
                  variant={endereco.tipo === 'MATRIZ' ? 'default' : 'secondary'}
                  className={endereco.tipo === 'MATRIZ' ? 'bg-blue-600 text-white' : ''}
                >
                  {endereco.tipo}
                </Badge>
                
                {endereco.isPrincipal && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Principal
                  </Badge>
                )}
              </div>
              
              {/* Endereço completo */}
              <div className="space-y-1 mb-3">
                <p className="text-sm font-medium text-gray-900">
                  {endereco.logradouro}, {endereco.numero}
                </p>
                
                {endereco.complemento && (
                  <p className="text-sm text-gray-600">
                    {endereco.complemento}
                  </p>
                )}
                
                <p className="text-sm text-gray-600">
                  {endereco.bairro}
                </p>
                
                <p className="text-sm text-gray-600">
                  CEP: {endereco.cep}
                </p>
                
                <p className="text-sm font-medium text-gray-900">
                  {endereco.municipio}/{endereco.uf}
                </p>
              </div>
              
              {/* Botão Google Maps */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => openInMaps(endereco)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Ver no Google Maps
              </Button>
            </div>
          ))}
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Endereços obtidos de registros da Receita Federal
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
