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
import { AdvancedFilters, type CompanyFilters } from "./AdvancedFilters"
import { Badge } from "@/components/ui/badge"

interface MobileFiltersProps {
  filters: CompanyFilters
  onFiltersChange: (filters: CompanyFilters) => void
  onApply: () => void
  onClear: () => void
}

export function MobileFilters({
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: MobileFiltersProps) {
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
          <SheetDescription>
            Refine sua busca com os filtros abaixo
          </SheetDescription>
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
