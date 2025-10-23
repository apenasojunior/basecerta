'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { useFavorites } from '@/hooks/useFavorites'
import { toast } from '@/lib/toast'

interface PageProps {
  params: Promise<{
    cnpj: string
  }>
}

export default function DossierPJPage({ params }: PageProps) {
  const router = useRouter()
  const { cnpj } = use(params)
  const searchParams = useSearchParams()
  const { isFavorite, toggleFavorite, getStats } = useFavorites()
  const stats = getStats()
  
  // Limpar CNPJ para busca (remover pontos, traços, barra)
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  
  // Get origin page from query params
  const from = searchParams.get('from')
  
  // Define back link and text based on origin
  const getBackLink = () => {
    switch (from) {
      case 'favoritos':
        return { href: '/favoritos', text: 'Voltar aos Favoritos' }
      default:
        return { href: '/dados360/pj/search', text: 'Voltar para Busca' }
    }
  }
  
  const backLink = getBackLink()
  
  // Buscar empresa nos dados mock
  const company = searchCompanyByCNPJ(cleanCNPJ)
  
  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (!company) return

    const favorited = isFavorite(cleanCNPJ)

    // Verifica limite antes de adicionar
    if (!favorited && stats.isFull) {
      toast.warning(`Limite de ${stats.total} favoritos atingido. Remova alguns para adicionar novos.`)
      return
    }

    toggleFavorite({
      id: cleanCNPJ,
      type: 'PJ',
      document: cleanCNPJ,
      name: company.razaoSocial,
      metadata: {
        status: company.situacao,
        uf: company.enderecos?.[0]?.uf || '',
        municipio: company.enderecos?.[0]?.municipio || '',
      }
    })

    if (!favorited) {
      toast.success(`"${company.razaoSocial}" adicionado aos favoritos`)
    } else {
      toast.success(`"${company.razaoSocial}" removido dos favoritos`)
    }
  }
  
  // Se empresa não encontrada
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com botão voltar */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push(backLink.href)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLink.text}
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
                <Button onClick={() => router.push(backLink.href)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backLink.text}
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
            onClick={() => router.push(backLink.href)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLink.text}
          </Button>
        </div>
        
        {/* Company Header */}
        <CompanyHeaderFull
          company={company}
          isFavorite={isFavorite(cleanCNPJ)}
          onToggleFavorite={handleToggleFavorite}
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
