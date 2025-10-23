'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Number of pages to show
    
    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = 4
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }
      
      // Add ellipsis before
      if (start > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis after
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Info */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{' '}
        <span className="font-medium text-gray-900">{endItem}</span> de{' '}
        <span className="font-medium text-gray-900">{totalItems}</span> resultados
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            const isActive = pageNumber === currentPage

            return (
              <Button
                key={pageNumber}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  'min-w-[40px]',
                  isActive && 'bg-primary-600 text-white hover:bg-primary-700'
                )}
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
