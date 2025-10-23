'use client'

import { MapPin, Navigation } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'

interface LocationCardProps {
  company: SmartCNPJCompany
}

export function LocationCard({ company }: LocationCardProps) {
  const { endereco } = company

  // Format full address
  const fullAddress = [
    `${endereco.logradouro}, ${endereco.numero}`,
    endereco.complemento,
    endereco.bairro,
    `${endereco.municipio} - ${endereco.uf}`,
    endereco.cep,
  ].filter(Boolean).join('\n')

  // Google Maps URL
  const addressQuery = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.municipio}, ${endereco.uf}, ${endereco.cep}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Details */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Endereço</p>
            <p className="text-base text-gray-900">
              {endereco.logradouro}, {endereco.numero}
            </p>
            {endereco.complemento && (
              <p className="text-sm text-gray-600">
                {endereco.complemento}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Bairro</p>
              <p className="text-base text-gray-900">{endereco.bairro}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">CEP</p>
              <p className="text-base font-mono text-gray-900">{endereco.cep}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Município</p>
              <p className="text-base text-gray-900">{endereco.municipio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">UF</p>
              <p className="text-base text-gray-900">{endereco.uf}</p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="pt-4 border-t border-gray-200">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
            {/* Google Maps Embed would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Mapa interativo</p>
                <p className="text-xs text-gray-500">(Google Maps)</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(mapsUrl, '_blank')}
          >
            <Navigation className="h-4 w-4" />
            Abrir no Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
