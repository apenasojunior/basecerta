'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { searchCompanyByCNPJ } from '@/mocks/dados360-pj'
import { CompanyHeaderFull } from '@/components/dados360/pj/CompanyHeaderFull'
import { CompanyIdentificationCard } from '@/components/dados360/pj/CompanyIdentificationCard'
import { CompanyActivityCard } from '@/components/dados360/pj/CompanyActivityCard'
import { PartnersCard } from '@/components/dados360/pj/PartnersCard'
import { DebtsCard } from '@/components/dados360/pj/DebtsCard'
import { EmployeesHistoryCard } from '@/components/dados360/pj/EmployeesHistoryCard'
import { AddressesPJCard } from '@/components/dados360/pj/AddressesPJCard'
import { ContactsPJCard } from '@/components/dados360/pj/ContactsPJCard'
import { SocialMediaCard } from '@/components/dados360/pj/SocialMediaCard'

interface PageProps {
  params: Promise<{
    cnpj: string
  }>
}

export default function DossierPJPage({ params }: PageProps) {
  const router = useRouter()
  const { cnpj } = use(params)
  
  // Limpar CNPJ para busca (remover pontos, traços, barra)
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  
  // Buscar empresa nos dados mock
  const company = searchCompanyByCNPJ(cleanCNPJ)
  
  // State para favoritos (será integrado com backend posteriormente)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Se empresa não encontrada
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com botão voltar */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dados360/pj/search')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Busca
            </Button>
          </div>
          
          {/* Card de erro */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Empresa não encontrada
                </h2>
                <p className="text-sm text-gray-600 mb-6 max-w-md">
                  Não foram encontrados dados para o CNPJ <span className="font-mono font-semibold">{cnpj}</span>.
                  Verifique se o CNPJ está correto e tente novamente.
                </p>
                <Button onClick={() => router.push('/dados360/pj/search')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Busca
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dados360/pj/search')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Busca
          </Button>
        </div>
        
        {/* Company Header */}
        <CompanyHeaderFull
          company={company}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
        />
        
        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identificação */}
            <CompanyIdentificationCard company={company} />
            
            {/* Atividade */}
            <CompanyActivityCard company={company} />
            
            {/* Endereços */}
            <AddressesPJCard company={company} />
            
            {/* Contatos */}
            <ContactsPJCard company={company} />
          </div>
          
          {/* Coluna Lateral (1/3) */}
          <div className="space-y-6">
            {/* Sócios */}
            <PartnersCard company={company} />
            
            {/* Dívidas e Restrições */}
            <DebtsCard company={company} />
            
            {/* Histórico de Funcionários */}
            <EmployeesHistoryCard company={company} />
            
            {/* Redes Sociais */}
            <SocialMediaCard company={company} />
          </div>
        </div>
      </div>
    </div>
  )
}
