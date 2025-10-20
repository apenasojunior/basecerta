"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UF_OPTIONS, SITUACAO_OPTIONS, PORTE_OPTIONS, CNAE_OPTIONS } from "@/constants/filters"

export interface CompanyFilters {
  situacao?: string
  porte?: string
  uf?: string
  cnae?: string
}

interface AdvancedFiltersProps {
  filters: CompanyFilters
  onFiltersChange: (filters: CompanyFilters) => void
  onApply: () => void
  onClear: () => void
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: AdvancedFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const handleFilterChange = (key: keyof CompanyFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const hasFilters = activeFiltersCount > 0

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 transition-transform hover:rotate-12" />
            <span>Filtros Avançados</span>
          </div>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="animate-fadeIn">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {/* Situação */}
          <AccordionItem value="situacao">
            <AccordionTrigger className="text-sm">
              Situação Cadastral
              {filters.situacao && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  1
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label htmlFor="situacao" className="text-xs">
                  Selecione a situação
                </Label>
                <Select
                  value={filters.situacao}
                  onValueChange={(value) => handleFilterChange("situacao", value)}
                >
                  <SelectTrigger id="situacao">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    {SITUACAO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Porte */}
          <AccordionItem value="porte">
            <AccordionTrigger className="text-sm">
              Porte da Empresa
              {filters.porte && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  1
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label htmlFor="porte" className="text-xs">
                  Selecione o porte
                </Label>
                <Select
                  value={filters.porte}
                  onValueChange={(value) => handleFilterChange("porte", value)}
                >
                  <SelectTrigger id="porte">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    {PORTE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* UF */}
          <AccordionItem value="uf">
            <AccordionTrigger className="text-sm">
              Estado (UF)
              {filters.uf && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  1
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label htmlFor="uf" className="text-xs">
                  Selecione o estado
                </Label>
                <Select
                  value={filters.uf}
                  onValueChange={(value) => handleFilterChange("uf", value)}
                >
                  <SelectTrigger id="uf">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="ALL">Todos</SelectItem>
                    {UF_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value} - {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* CNAE */}
          <AccordionItem value="cnae">
            <AccordionTrigger className="text-sm">
              Atividade Econômica (CNAE)
              {filters.cnae && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  1
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label htmlFor="cnae" className="text-xs">
                  Selecione a atividade
                </Label>
                <Select
                  value={filters.cnae}
                  onValueChange={(value) => handleFilterChange("cnae", value)}
                >
                  <SelectTrigger id="cnae">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="ALL">Todas</SelectItem>
                    {CNAE_OPTIONS.map((option) => (
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

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            onClick={onApply}
            className="flex-1 transition-all hover:scale-[1.02] active:scale-95 hover:shadow-primary"
          >
            Aplicar Filtros
          </Button>
          {hasFilters && (
            <Button
              onClick={onClear}
              variant="outline"
              size="icon"
              className="transition-all hover:scale-110 active:scale-95 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Resumo dos Filtros Ativos */}
        {hasFilters && (
          <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3 animate-fadeIn">
            <p className="text-xs font-medium">Filtros ativos:</p>
            <div className="flex flex-wrap gap-1">
              {filters.situacao && (
                <Badge variant="secondary" className="text-xs transition-all hover:scale-105">
                  {SITUACAO_OPTIONS.find((o) => o.value === filters.situacao)?.label}
                </Badge>
              )}
              {filters.porte && (
                <Badge variant="secondary" className="text-xs transition-all hover:scale-105">
                  {PORTE_OPTIONS.find((o) => o.value === filters.porte)?.label}
                </Badge>
              )}
              {filters.uf && (
                <Badge variant="secondary" className="text-xs transition-all hover:scale-105">
                  {UF_OPTIONS.find((o) => o.value === filters.uf)?.label}
                </Badge>
              )}
              {filters.cnae && (
                <Badge variant="secondary" className="text-xs transition-all hover:scale-105">
                  CNAE selecionado
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
