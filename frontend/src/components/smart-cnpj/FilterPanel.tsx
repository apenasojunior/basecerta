'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  situacaoCadastralOptions,
  porteOptions,
  formaTributacaoOptions,
} from '@/mocks/smart-cnpj'
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

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null
  }).length

  // Handler para situação cadastral (multi-select)
  const handleSituacaoChange = (value: string, checked: boolean) => {
    const current = filters.situacaoCadastral || []
    const updated = checked
      ? [...current, value]
      : current.filter(v => v !== value)
    
    onFiltersChange({ ...filters, situacaoCadastral: updated.length > 0 ? updated : undefined })
  }

  // Handler para porte (multi-select)
  const handlePorteChange = (value: string, checked: boolean) => {
    const current = filters.porte || []
    const updated = checked
      ? [...current, value]
      : current.filter(v => v !== value)
    
    onFiltersChange({ ...filters, porte: updated.length > 0 ? updated : undefined })
  }

  // Handler para tipo (radio)
  const handleTipoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      tipo: value === 'TODOS' ? undefined : value as 'MATRIZ' | 'FILIAL',
    })
  }

  // Handler para capital social
  const handleCapitalChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined
    
    if (type === 'min') {
      onFiltersChange({ ...filters, capitalSocialMin: numValue })
    } else {
      onFiltersChange({ ...filters, capitalSocialMax: numValue })
    }
  }

  // Handler para checkboxes simples
  const handleCheckboxChange = (key: 'isMEI' | 'isSimplesNacional', checked: boolean) => {
    onFiltersChange({ ...filters, [key]: checked ? true : undefined })
  }

  // Handler para forma de tributação
  const handleFormaTributacaoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      formaTributacao: value === 'TODOS' ? undefined : value,
    })
  }

  // Handler para datas
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      onFiltersChange({ ...filters, dataAberturaStart: value || undefined })
    } else {
      onFiltersChange({ ...filters, dataAberturaEnd: value || undefined })
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
        {/* 1. Situação Cadastral (Multi-select) */}
        <Collapsible defaultOpen className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <Label className="font-medium text-gray-700 cursor-pointer">
              Situação Cadastral
              {filters.situacaoCadastral && filters.situacaoCadastral.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.situacaoCadastral.length}
                </Badge>
              )}
            </Label>
            <ChevronDown className="h-4 w-4 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {situacaoCadastralOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`situacao-${option.value}`}
                  checked={filters.situacaoCadastral?.includes(option.value) ?? false}
                  onCheckedChange={(checked) => handleSituacaoChange(option.value, checked as boolean)}
                />
                <label
                  htmlFor={`situacao-${option.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-200" />

        {/* 2. Tipo (Radio) */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Tipo</Label>
          <Select
            value={filters.tipo || 'TODOS'}
            onValueChange={handleTipoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="MATRIZ">Matriz</SelectItem>
              <SelectItem value="FILIAL">Filial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-gray-200" />

        {/* 3. Porte (Multi-select) */}
        <Collapsible defaultOpen className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <Label className="font-medium text-gray-700 cursor-pointer">
              Porte da Empresa
              {filters.porte && filters.porte.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.porte.length}
                </Badge>
              )}
            </Label>
            <ChevronDown className="h-4 w-4 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {porteOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`porte-${option.value}`}
                  checked={filters.porte?.includes(option.value) ?? false}
                  onCheckedChange={(checked) => handlePorteChange(option.value, checked as boolean)}
                />
                <label
                  htmlFor={`porte-${option.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-200" />

        {/* 4. Capital Social (Range) */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <Label className="font-medium text-gray-700 cursor-pointer">
              Capital Social (R$)
              {(filters.capitalSocialMin || filters.capitalSocialMax) && (
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
                value={filters.capitalSocialMin ?? ''}
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
                value={filters.capitalSocialMax ?? ''}
                onChange={(e) => handleCapitalChange('max', e.target.value)}
                className="h-9"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-200" />

        {/* 5. MEI (Checkbox) */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-mei"
            checked={filters.isMEI ?? false}
            onCheckedChange={(checked) => handleCheckboxChange('isMEI', checked as boolean)}
          />
          <label
            htmlFor="filter-mei"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Apenas MEI
          </label>
        </div>

        {/* 6. Simples Nacional (Checkbox) */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filter-simples"
            checked={filters.isSimplesNacional ?? false}
            onCheckedChange={(checked) => handleCheckboxChange('isSimplesNacional', checked as boolean)}
          />
          <label
            htmlFor="filter-simples"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Optante pelo Simples Nacional
          </label>
        </div>

        <div className="border-t border-gray-200" />

        {/* 7. Forma de Tributação (Select) */}
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">Forma de Tributação</Label>
          <Select
            value={filters.formaTributacao || 'TODOS'}
            onValueChange={handleFormaTributacaoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas</SelectItem>
              {formaTributacaoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-gray-200" />

        {/* 8. Data de Abertura (Date Range) */}
        <Collapsible className="space-y-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <Label className="font-medium text-gray-700 cursor-pointer">
              Data de Abertura
              {(filters.dataAberturaStart || filters.dataAberturaEnd) && (
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
                value={filters.dataAberturaStart ?? ''}
                onChange={(e) => handleDateChange('start', e.target.value)}
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
                value={filters.dataAberturaEnd ?? ''}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="h-9"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
