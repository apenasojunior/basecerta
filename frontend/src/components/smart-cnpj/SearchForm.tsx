'use client'

import { useState } from 'react'
import { Search, Building2, Mail, Phone, User, MapPin, Grid3x3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SearchType } from '@/hooks/useSmartCNPJ'
import { segmentoOptions } from '@/mocks/smart-cnpj'

interface SearchFormProps {
  searchType: SearchType
  searchValue: string
  onSearchTypeChange: (type: SearchType) => void
  onSearchValueChange: (value: string) => void
  onSearch: () => void
  isSearching?: boolean
  className?: string
}

const searchTypes = [
  { value: 'cnpj' as const, label: 'CNPJ', icon: Grid3x3, placeholder: '00.000.000/0000-00' },
  { value: 'razaoSocial' as const, label: 'Razão Social', icon: Building2, placeholder: 'Digite a razão social ou nome fantasia' },
  { value: 'segmento' as const, label: 'Segmento (CNAE)', icon: Search, placeholder: 'Digite o segmento ou atividade' },
  { value: 'email' as const, label: 'E-mail', icon: Mail, placeholder: 'exemplo@empresa.com.br' },
  { value: 'telefone' as const, label: 'Telefone', icon: Phone, placeholder: '(00) 00000-0000' },
  { value: 'nomeSocio' as const, label: 'Nome do Sócio', icon: User, placeholder: 'Digite o nome do sócio' },
  { value: 'cep' as const, label: 'CEP', icon: MapPin, placeholder: '00000-000' },
]

export function SearchForm({
  searchType,
  searchValue,
  onSearchTypeChange,
  onSearchValueChange,
  onSearch,
  isSearching = false,
  className,
}: SearchFormProps) {
  const [showAllTypes, setShowAllTypes] = useState(false)
  
  const currentType = searchTypes.find(t => t.value === searchType)
  const Icon = currentType?.icon ?? Search

  // Aplicar máscaras conforme o tipo
  const handleInputChange = (value: string) => {
    let maskedValue = value

    switch (searchType) {
      case 'cnpj':
        // Máscara CNPJ: 00.000.000/0000-00
        maskedValue = value
          .replace(/\D/g, '')
          .replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .substring(0, 18)
        break
      
      case 'telefone':
        // Máscara Telefone: (00) 00000-0000
        maskedValue = value
          .replace(/\D/g, '')
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .substring(0, 15)
        break
      
      case 'cep':
        // Máscara CEP: 00000-000
        maskedValue = value
          .replace(/\D/g, '')
          .replace(/^(\d{5})(\d)/, '$1-$2')
          .substring(0, 9)
        break
    }

    onSearchValueChange(maskedValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  const visibleTypes = showAllTypes ? searchTypes : searchTypes.slice(0, 4)

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Busca - Tabs */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Tipo de Busca
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {visibleTypes.map((type) => {
                const TypeIcon = type.icon
                const isActive = searchType === type.value
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => onSearchTypeChange(type.value)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200',
                      'hover:border-primary-300 hover:bg-primary-50',
                      isActive
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                        : 'border-gray-200 bg-white text-gray-600'
                    )}
                  >
                    <TypeIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{type.label}</span>
                  </button>
                )
              })}
            </div>
            
            {/* Botão Mostrar Mais */}
            {!showAllTypes && searchTypes.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllTypes(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 hover:underline"
              >
                + Mostrar mais opções ({searchTypes.length - 4})
              </button>
            )}
            
            {showAllTypes && (
              <button
                type="button"
                onClick={() => setShowAllTypes(false)}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium mt-2 hover:underline"
              >
                Mostrar menos
              </button>
            )}
          </div>

          {/* Campo de Busca */}
          <div>
            <Label htmlFor="search-input" className="text-sm font-medium text-gray-700 mb-2 block">
              {currentType?.label}
            </Label>
            
            {searchType === 'segmento' ? (
              // Select para Segmento (com autocomplete)
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="search-input"
                  list="segmentos"
                  value={searchValue}
                  onChange={(e) => onSearchValueChange(e.target.value)}
                  placeholder={currentType?.placeholder}
                  className="pl-10 h-12 text-base"
                  autoComplete="off"
                />
                <datalist id="segmentos">
                  {segmentoOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>
            ) : (
              // Input normal com ícone
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="search-input"
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentType?.placeholder}
                  className="pl-10 h-12 text-base"
                  autoComplete="off"
                />
              </div>
            )}
          </div>

          {/* Botão de Buscar */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={!searchValue.trim() || isSearching}
          >
            {isSearching ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Buscar {currentType?.label}</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
