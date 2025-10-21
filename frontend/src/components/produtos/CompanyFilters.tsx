"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  UF_OPTIONS,
  PORTE_OPTIONS,
  NATUREZA_JURIDICA_OPTIONS,
  SITUACAO_CADASTRAL_OPTIONS,
  FAIXA_FATURAMENTO_OPTIONS,
  DATA_ABERTURA_OPTIONS,
  type Porte,
  type NaturezaJuridica,
  type SituacaoCadastral,
  type FaixaFaturamento,
  type DataAberturaRange,
} from "@/constants/company-filters"

export interface CompanyFilters {
  uf?: string
  porte?: Porte
  naturezaJuridica?: NaturezaJuridica
  situacaoCadastral?: SituacaoCadastral
  faixaFaturamento?: FaixaFaturamento
  dataAbertura?: DataAberturaRange
}

interface CompanyFiltersProps {
  filters: CompanyFilters
  onChange: (filters: CompanyFilters) => void
  onApply: () => void
}

export function CompanyFilters({ filters, onChange, onApply }: CompanyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CompanyFilters>(filters)

  const activeFiltersCount = Object.values(localFilters).filter(Boolean).length

  const handleFilterChange = (key: keyof CompanyFilters, value: string | undefined) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    onChange(localFilters)
    onApply()
  }

  const handleClear = () => {
    const emptyFilters: CompanyFilters = {}
    setLocalFilters(emptyFilters)
    onChange(emptyFilters)
  }

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters)

  return (
    <div className="space-y-4">
      {/* Header com badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-orange-600" />
          <span className="font-medium">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="bg-orange-600 animate-fadeIn">
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
          <AccordionContent className="pb-4">
            <Select
              value={localFilters.uf || ""}
              onValueChange={(value) => handleFilterChange("uf", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {UF_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Porte */}
        <AccordionItem value="porte" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Porte da Empresa</span>
              {localFilters.porte && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Select
              value={localFilters.porte || ""}
              onValueChange={(value) => handleFilterChange("porte", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {PORTE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Natureza Jurídica */}
        <AccordionItem value="natureza" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Natureza Jurídica</span>
              {localFilters.naturezaJuridica && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Select
              value={localFilters.naturezaJuridica || ""}
              onValueChange={(value) => handleFilterChange("naturezaJuridica", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a natureza jurídica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {NATUREZA_JURIDICA_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Situação Cadastral */}
        <AccordionItem value="situacao" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Situação Cadastral</span>
              {localFilters.situacaoCadastral && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Select
              value={localFilters.situacaoCadastral || ""}
              onValueChange={(value) => handleFilterChange("situacaoCadastral", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {SITUACAO_CADASTRAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.bgColor}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Faixa de Faturamento */}
        <AccordionItem value="faturamento" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Faixa de Faturamento</span>
              {localFilters.faixaFaturamento && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Select
              value={localFilters.faixaFaturamento || ""}
              onValueChange={(value) => handleFilterChange("faixaFaturamento", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {FAIXA_FATURAMENTO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Data de Abertura */}
        <AccordionItem value="dataAbertura" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Data de Abertura</span>
              {localFilters.dataAbertura && (
                <Badge variant="outline" className="ml-auto mr-2 animate-fadeIn">
                  1
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Select
              value={localFilters.dataAbertura || ""}
              onValueChange={(value) => handleFilterChange("dataAbertura", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {DATA_ABERTURA_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Resumo de filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2 pt-2">
          <Label className="text-xs text-muted-foreground">Filtros Ativos:</Label>
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
            {localFilters.porte && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("porte", undefined)}
              >
                {PORTE_OPTIONS.find(p => p.value === localFilters.porte)?.label.split(' - ')[0]}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.naturezaJuridica && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("naturezaJuridica", undefined)}
              >
                {NATUREZA_JURIDICA_OPTIONS.find(n => n.value === localFilters.naturezaJuridica)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.situacaoCadastral && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("situacaoCadastral", undefined)}
              >
                {SITUACAO_CADASTRAL_OPTIONS.find(s => s.value === localFilters.situacaoCadastral)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.faixaFaturamento && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("faixaFaturamento", undefined)}
              >
                {FAIXA_FATURAMENTO_OPTIONS.find(f => f.value === localFilters.faixaFaturamento)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
            {localFilters.dataAbertura && (
              <Badge
                variant="secondary"
                className="hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleFilterChange("dataAbertura", undefined)}
              >
                {DATA_ABERTURA_OPTIONS.find(d => d.value === localFilters.dataAbertura)?.label}
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
        className="w-full bg-orange-600 hover:bg-orange-700 transition-all hover:scale-[1.02] active:scale-95"
      >
        Aplicar Filtros
      </Button>
    </div>
  )
}
