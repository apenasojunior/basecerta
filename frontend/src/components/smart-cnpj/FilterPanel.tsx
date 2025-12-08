'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  SITUACAO_CADASTRAL,
  PORTE_EMPRESA,
  UF_BRASIL,
  NATUREZAS_JURIDICAS_PRINCIPAIS,
} from '@/lib/constants/filtros'
import type { SearchFilters } from '@/hooks/useSmartCNPJ'

interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  resultsCount?: number
  className?: string
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onClearFilters,
  hasActiveFilters,
  resultsCount,
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Count active filters (exclude empty strings)
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  }).length

  // Handler para situação cadastral (single select)
  const handleSituacaoChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      situacao: value === 'TODOS' ? undefined : value 
    })
  }

  // Handler para porte (single select)
  const handlePorteChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      porte: value === 'TODOS' ? undefined : value 
    })
  }

  // Handler para UF (single select)
  const handleUFChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      uf: value === 'TODOS' ? undefined : value 
    })
  }

  // Handler para natureza jurídica (single select)
  const handleNaturezaChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      natureza_juridica: value === 'TODOS' ? undefined : value 
    })
  }

  // Handler para capital social
  const handleCapitalChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined
    
    if (type === 'min') {
      onFiltersChange({ ...filters, capital_social_min: numValue })
    } else {
      onFiltersChange({ ...filters, capital_social_max: numValue })
    }
  }

  // Handler para data de abertura
  const handleDataAberturaChange = (type: 'inicio' | 'fim', value: string) => {
    if (type === 'inicio') {
      onFiltersChange({ ...filters, data_abertura_inicio: value || undefined })
    } else {
      onFiltersChange({ ...filters, data_abertura_fim: value || undefined })
    }
  }

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary-600" />
            <CardTitle className="text-lg">Filtros</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="bg-primary-600">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
        
        {resultsCount !== undefined && (
          <p className="text-sm text-gray-600 mt-2">
            {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 1. UF - Estado (Select) */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Estado (UF)</Label>
          <Select
            value={filters.uf || 'TODOS'}
            onValueChange={handleUFChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os estados</SelectItem>
              {UF_BRASIL.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-gray-200" />

        {/* 2. Situação Cadastral (Select) */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Situação Cadastral</Label>
          <Select
            value={filters.situacao || 'TODOS'}
            onValueChange={handleSituacaoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas</SelectItem>
              {Object.entries(SITUACAO_CADASTRAL).map(([codigo, descricao]) => (
                <SelectItem key={codigo} value={codigo}>
                  {descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-gray-200" />

        {/* 3. Porte da Empresa (Select) */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Porte da Empresa</Label>
          <Select
            value={filters.porte || 'TODOS'}
            onValueChange={handlePorteChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o porte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              {Object.entries(PORTE_EMPRESA).map(([codigo, descricao]) => (
                <SelectItem key={codigo} value={codigo}>
                  {descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-gray-200" />

        {/* 4. Natureza Jurídica (Select) */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Natureza Jurídica</Label>
          <Select
            value={filters.natureza_juridica || 'TODOS'}
            onValueChange={handleNaturezaChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a natureza" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas</SelectItem>
              {Object.entries(NATUREZAS_JURIDICAS_PRINCIPAIS).map(([codigo, descricao]) => (
                <SelectItem key={codigo} value={codigo}>
                  {descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-gray-200" />

        {/* 5. Capital Social (Range) */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <Label className="font-medium text-gray-700 cursor-pointer">
              Capital Social (R$)
              {(filters.capital_social_min || filters.capital_social_max) && (
                <Badge variant="secondary" className="ml-2">•</Badge>
              )}
            </Label>
            <ChevronDown className="h-4 w-4 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div>
              <Label htmlFor="capital-min" className="text-xs text-gray-600 mb-1 block">
                Mínimo
              </Label>
              <Input
                id="capital-min"
                type="number"
                placeholder="Ex: 10000"
                value={filters.capital_social_min ?? ''}
                onChange={(e) => handleCapitalChange('min', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="capital-max" className="text-xs text-gray-600 mb-1 block">
                Máximo
              </Label>
              <Input
                id="capital-max"
                type="number"
                placeholder="Ex: 1000000"
                value={filters.capital_social_max ?? ''}
                onChange={(e) => handleCapitalChange('max', e.target.value)}
                className="h-9"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-200" />

        {/* 6. Data de Abertura (Date Range) */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <Label className="font-medium text-gray-700 cursor-pointer">
              Data de Abertura
              {(filters.data_abertura_inicio || filters.data_abertura_fim) && (
                <Badge variant="secondary" className="ml-2">•</Badge>
              )}
            </Label>
            <ChevronDown className="h-4 w-4 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div>
              <Label htmlFor="date-start" className="text-xs text-gray-600 mb-1 block">
                De
              </Label>
              <Input
                id="date-start"
                type="date"
                value={filters.data_abertura_inicio ?? ''}
                onChange={(e) => handleDataAberturaChange('inicio', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="date-end" className="text-xs text-gray-600 mb-1 block">
                Até
              </Label>
              <Input
                id="date-end"
                type="date"
                value={filters.data_abertura_fim ?? ''}
                onChange={(e) => handleDataAberturaChange('fim', e.target.value)}
                className="h-9"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
