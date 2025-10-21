"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PersonFilters } from "./PersonFilters"
import { AdvancedFilters, type CompanyFilters } from "./AdvancedFilters"
import type { PersonSearchFilters } from "@/types/person"
import { Badge } from "@/components/ui/badge"

/**
 * MobileFilters for Person (PF) search
 */
interface PersonMobileFiltersProps {
  type: "person"
  filters: PersonSearchFilters
  onChange: (filters: PersonSearchFilters) => void
  onApply: () => void
}

/**
 * MobileFilters for Company (PJ) search
 */
interface CompanyMobileFiltersProps {
  type: "company"
  filters: CompanyFilters
  onFiltersChange: (filters: CompanyFilters) => void
  onApply: () => void
  onClear: () => void
}

type MobileFiltersProps = PersonMobileFiltersProps | CompanyMobileFiltersProps

export function MobileFilters(props: MobileFiltersProps) {
  if (props.type === "person") {
    const { filters, onChange, onApply } = props
    const activeFiltersCount = Object.values(filters).filter(Boolean).length

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 p-0 bg-blue-600 hover:bg-blue-700"
          >
            <Filter className="h-5 w-5" />
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
            <span className="sr-only">Abrir filtros</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filtros Avançados
            </SheetTitle>
            <SheetDescription>
              Refine sua busca com filtros específicos
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto mt-4 pb-6">
            <PersonFilters filters={filters} onChange={onChange} onApply={onApply} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Company filters (legacy)
  const { filters, onFiltersChange, onApply, onClear } = props
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros Avançados</SheetTitle>
          <SheetDescription>Refine sua busca com os filtros abaixo</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            onApply={onApply}
            onClear={onClear}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
