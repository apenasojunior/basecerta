'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CompanyHeader } from '@/components/smart-cnpj/CompanyHeader'
import { IdentificationCard } from '@/components/smart-cnpj/IdentificationCard'
import { ClassificationCard } from '@/components/smart-cnpj/ClassificationCard'
import { LocationCard } from '@/components/smart-cnpj/LocationCard'
import { ContactCard } from '@/components/smart-cnpj/ContactCard'
import { StatusCard } from '@/components/smart-cnpj/StatusCard'
import { getCompanyByCNPJ } from '@/mocks/smart-cnpj'
import { Card, CardContent } from '@/components/ui/card'

interface CompanyDetailsPageProps {
  params: Promise<{
    cnpj: string
  }>
}

export default function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)

  // Decode CNPJ from URL
  const cnpj = decodeURIComponent(resolvedParams.cnpj)
  
  // Get company data
  const company = getCompanyByCNPJ(cnpj)

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Persist to localStorage or API
  }

  // Loading state (simulated)
  if (!company) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/smart-cnpj/results">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Detalhes da Empresa
          </h1>
        </div>

        {/* Not Found Card */}
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Empresa não encontrada
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Não foi possível encontrar uma empresa com o CNPJ <strong>{cnpj}</strong>.
            </p>
            <Link href="/smart-cnpj/search">
              <Button>
                <ArrowLeft className="h-4 w-4" />
                Voltar para Busca
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/smart-cnpj/results">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar aos Resultados</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
        </Link>
      </div>

      {/* Company Header */}
      <CompanyHeader
        company={company}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Main Content - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identification */}
          <IdentificationCard company={company} />

          {/* Classification */}
          <ClassificationCard company={company} />

          {/* Location */}
          <LocationCard company={company} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Status */}
          <StatusCard company={company} />

          {/* Contact */}
          <ContactCard company={company} />
        </div>
      </div>

      {/* Bottom Actions */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Precisa de mais informações?
              </h3>
              <p className="text-sm text-gray-600">
                Consulte o Dossiê Completo 360° desta empresa
              </p>
            </div>
            <Button size="lg" className="whitespace-nowrap">
              Ver Dossiê 360° PJ
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">
                15 créditos
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
