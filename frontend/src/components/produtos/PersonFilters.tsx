"use client"

import { useState } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  UF_OPTIONS, 
  SEXO_OPTIONS, 
  ESTADO_CIVIL_OPTIONS, 
  FAIXA_ETARIA_OPTIONS 
} from "@/constants/person-filters"
import type { PersonSearchFilters } from "@/types/person"

interface PersonFiltersProps {
  filters: PersonSearchFilters
  onChange: (filters: PersonSearchFilters) => void
  onApply: () => void
}

export function PersonFilters({ filters, onChange, onApply }: PersonFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PersonSearchFilters>(filters)

  const activeFiltersCount = Object.values(localFilters).filter(Boolean).length

  const handleFilterChange = (key: keyof PersonSearchFilters, value: string | undefined) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    onChange(localFilters)
    onApply()
  }

  const handleClear = () => {
    const emptyFilters: PersonSearchFilters = {}
    setLocalFilters(emptyFilters)
    onChange(emptyFilters)
  }

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters)

  return (
    <div className="space-y-4">
      {/* Header com badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="bg-blue-600 animate-fadeIn">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Accordion com filtros */}
      <Accordion type="multiple" className="space-y-2">
        {/* UF */}
        <AccordionItem value="uf" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado (UF)</span>
              {localFilters.uf && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Selecione o estado
              </Label>
              <Select
                value={localFilters.uf}
                onValueChange={(value) => handleFilterChange("uf", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {UF_OPTIONS.map((uf) => (
                    <SelectItem key={uf.value} value={uf.value}>
                      {uf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sexo */}
        <AccordionItem value="sexo" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sexo</span>
              {localFilters.sexo && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Selecione o sexo
              </Label>
              <Select
                value={localFilters.sexo}
                onValueChange={(value) => handleFilterChange("sexo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {SEXO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Estado Civil */}
        <AccordionItem value="estadoCivil" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado Civil</span>
              {localFilters.estadoCivil && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Selecione o estado civil
              </Label>
              <Select
                value={localFilters.estadoCivil}
                onValueChange={(value) => handleFilterChange("estadoCivil", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ESTADO_CIVIL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Faixa Etária */}
        <AccordionItem value="faixaEtaria" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Faixa Etária</span>
              {localFilters.faixaEtaria && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Selecione a faixa etária
              </Label>
              <Select
                value={localFilters.faixaEtaria}
                onValueChange={(value) => handleFilterChange("faixaEtaria", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as idades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {FAIXA_ETARIA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Resumo dos filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2 pt-2 border-t animate-fadeIn">
          <span className="text-xs font-medium text-muted-foreground">
            Filtros ativos:
          </span>
          <div className="flex flex-wrap gap-2">
            {localFilters.uf && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("uf", undefined)}
              >
                UF: {localFilters.uf}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.sexo && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("sexo", undefined)}
              >
                Sexo: {SEXO_OPTIONS.find(s => s.value === localFilters.sexo)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.estadoCivil && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("estadoCivil", undefined)}
              >
                {ESTADO_CIVIL_OPTIONS.find(e => e.value === localFilters.estadoCivil)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.faixaEtaria && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("faixaEtaria", undefined)}
              >
                {FAIXA_ETARIA_OPTIONS.find(f => f.value === localFilters.faixaEtaria)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Botão Aplicar */}
      <Button
        onClick={handleApply}
        disabled={!hasChanges}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
      >
        <Filter className="mr-2 h-4 w-4" />
        Aplicar Filtros
      </Button>
    </div>
  )
}
