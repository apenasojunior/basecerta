'use client'

import { CompanyCard } from './CompanyCard'
import { Pagination } from '@/components/ui/pagination'
import { useFavorites } from '@/hooks/useFavorites'
import { toast } from '@/lib/toast'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'

interface ResultsListProps {
  companies: SmartCNPJCompany[]
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
  from?: string // Origem da navegação
}

export function ResultsList({
  companies,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  className,
  from = 'results', // Default
}: ResultsListProps) {
  const { isFavorite, toggleFavorite, getStats } = useFavorites()
  const stats = getStats()

  const handleToggleFavorite = (cnpj: string, company: SmartCNPJCompany) => {
    const favorited = isFavorite(cnpj)

    // Verifica limite antes de adicionar
    if (!favorited && stats.isFull) {
      toast.warning(`Limite de ${stats.total} favoritos atingido. Remova alguns para adicionar novos.`)
      return
    }

    toggleFavorite({
      id: cnpj,
      type: 'PJ',
      document: cnpj,
      name: company.razaoSocial,
      metadata: {
        status: company.situacaoCadastral,
        uf: company.endereco.uf,
        municipio: company.endereco.municipio,
      },
    })

    if (!favorited) {
      toast.success(`"${company.razaoSocial}" adicionado aos favoritos`)
    } else {
      toast.success(`"${company.razaoSocial}" removido dos favoritos`)
    }
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum resultado encontrado
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Tente ajustar seus filtros ou realizar uma nova busca com termos diferentes.
        </p>
      </div>
    )
  }

  const totalItems = companies.length * totalPages // Approximation

  return (
    <div className={className}>
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {companies.map((company) => (
          <CompanyCard
            key={company.cnpj}
            company={company}
            isFavorite={isFavorite(company.cnpj)}
            onToggleFavorite={() => handleToggleFavorite(company.cnpj, company)}
            from={from}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
