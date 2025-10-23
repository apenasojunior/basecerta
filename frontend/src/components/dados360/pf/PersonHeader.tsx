'use client'

import { useState } from 'react'
import { User, Heart, Share2, FileDown, Calendar, MapPin, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'
import { estadoCivilLabels, classeEconomicaLabels } from '@/mocks/dados360-pf'
import { formatDate } from '@/lib/formatters'

interface PersonHeaderProps {
  person: Dados360PFPerson
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function PersonHeader({
  person,
  isFavorite = false,
  onToggleFavorite,
}: PersonHeaderProps) {
  const [isSharing, setIsSharing] = useState(false)
  
  const handleShare = async () => {
    setIsSharing(true)
    // Simular compartilhamento
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSharing(false)
  }
  
  const handleExport = () => {
    // Simular exportação PDF
    alert('Exportação de PDF será implementada em breve')
  }
  
  // Calcular idade atual
  const idade = person.idade
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Background gradient */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
        
        <div className="px-6 pb-6">
          {/* Avatar e Info Principal */}
          <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-primary-600" />
                </div>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-16 sm:pt-2">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {person.nome}
                  </h1>
                  {person.nomeSocial && (
                    <p className="text-sm text-gray-600 mb-2">
                      Nome Social: {person.nomeSocial}
                    </p>
                  )}
                  <p className="text-sm font-mono text-gray-600 mb-3">
                    CPF: {person.cpf}
                  </p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      <Calendar className="h-3 w-3 mr-1" />
                      {idade} anos
                    </Badge>
                    
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                      {estadoCivilLabels[person.estadoCivil]}
                    </Badge>
                    
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {classeEconomicaLabels[person.classeEconomica]}
                    </Badge>
                    
                    {person.sexo && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                        {person.sexo === 'M' ? 'Masculino' : 'Feminino'}
                      </Badge>
                    )}
                    
                    {person.experienciaProfissional?.some(e => e.situacao === 'ATIVO') && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Empregado
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleFavorite}
                    className="group"
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isFavorite && 'fill-red-500 text-red-500'
                      )}
                    />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    disabled={isSharing}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Data de Nascimento</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(person.dataNascimento)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Naturalidade</p>
                <p className="font-semibold text-gray-900">
                  {person.naturalidade}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Experiências</p>
                <p className="font-semibold text-gray-900">
                  {person.experienciaProfissional?.length || 0} {person.experienciaProfissional?.length === 1 ? 'registro' : 'registros'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
