'use client'

import { MapPin, Home, Building2, Mail as MailIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'
import { formatDate } from '@/lib/formatters'

interface AddressesPFCardProps {
  person: Dados360PFPerson
}

export function AddressesPFCard({ person }: AddressesPFCardProps) {
  // Ordenar endereços: principal primeiro
  const sortedEnderecos = [...person.enderecos].sort((a, b) => {
    if (a.isPrincipal) return -1
    if (b.isPrincipal) return 1
    return 0
  })
  
  // Ícone por tipo de endereço
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'RESIDENCIAL':
        return <Home className="h-4 w-4" />
      case 'COMERCIAL':
        return <Building2 className="h-4 w-4" />
      case 'CORRESPONDENCIA':
        return <MailIcon className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }
  
  // Label do tipo
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'RESIDENCIAL':
        return 'Residencial'
      case 'COMERCIAL':
        return 'Comercial'
      case 'CORRESPONDENCIA':
        return 'Correspondência'
      default:
        return tipo
    }
  }
  
  // Cores por tipo
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'RESIDENCIAL':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'COMERCIAL':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'CORRESPONDENCIA':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  
  // Google Maps URL
  const getMapUrl = (endereco: typeof person.enderecos[0]) => {
    const address = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.municipio} - ${endereco.uf}, ${endereco.cep}`
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          Endereços
          <Badge variant="secondary" className="ml-auto">
            {person.enderecos.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedEnderecos.map((endereco, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Header do endereço */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getTipoColor(endereco.tipo)}>
                    {getTipoIcon(endereco.tipo)}
                    <span className="ml-1">{getTipoLabel(endereco.tipo)}</span>
                  </Badge>
                  {endereco.isPrincipal && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                      Principal
                    </Badge>
                  )}
                </div>
                {endereco.dataInicio && (
                  <span className="text-xs text-gray-500">
                    Desde {formatDate(endereco.dataInicio)}
                  </span>
                )}
              </div>
              
              {/* Endereço completo */}
              <div className="space-y-1 mb-3">
                <p className="text-sm text-gray-900 font-medium">
                  {endereco.logradouro}, {endereco.numero}
                </p>
                {endereco.complemento && (
                  <p className="text-sm text-gray-600">{endereco.complemento}</p>
                )}
                <p className="text-sm text-gray-600">{endereco.bairro}</p>
                <p className="text-sm text-gray-900 font-medium">
                  {endereco.municipio} - {endereco.uf}
                </p>
                <p className="text-sm text-gray-600 font-mono">CEP: {endereco.cep}</p>
              </div>
              
              {/* Botão Google Maps */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(getMapUrl(endereco), '_blank')}
              >
                <MapPin className="h-4 w-4" />
                Abrir no Google Maps
              </Button>
            </div>
          ))}
          
          {/* Google Maps Placeholder */}
          {sortedEnderecos.length > 0 && (
            <div className="mt-4">
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                {/* Placeholder do mapa */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                  <div className="text-center p-6">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Visualização no Mapa
                    </p>
                    <p className="text-xs text-blue-700">
                      Integração com Google Maps será implementada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
