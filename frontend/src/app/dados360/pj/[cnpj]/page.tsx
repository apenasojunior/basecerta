'use client'

import { use, Suspense, lazy } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { searchCompanyByCNPJ } from '@/mocks/dados360-pj'
import { Dados360PJSkeleton } from '@/components/dados360/pj/Dados360PJSkeleton'
import { useFavorites } from '@/hooks/useFavorites'
import { toast } from '@/lib/toast'

// Lazy load heavy components
const CompanyHeaderFull = lazy(() => import('@/components/dados360/pj/CompanyHeaderFull').then(mod => ({ default: mod.CompanyHeaderFull })))
const CompanyIdentificationCard = lazy(() => import('@/components/dados360/pj/CompanyIdentificationCard').then(mod => ({ default: mod.CompanyIdentificationCard })))
const CompanyActivityCard = lazy(() => import('@/components/dados360/pj/CompanyActivityCard').then(mod => ({ default: mod.CompanyActivityCard })))
const PartnersCard = lazy(() => import('@/components/dados360/pj/PartnersCard').then(mod => ({ default: mod.PartnersCard })))
const DebtsCard = lazy(() => import('@/components/dados360/pj/DebtsCard').then(mod => ({ default: mod.DebtsCard })))
const EmployeesHistoryCard = lazy(() => import('@/components/dados360/pj/EmployeesHistoryCard').then(mod => ({ default: mod.EmployeesHistoryCard })))
const AddressesPJCard = lazy(() => import('@/components/dados360/pj/AddressesPJCard').then(mod => ({ default: mod.AddressesPJCard })))
const ContactsPJCard = lazy(() => import('@/components/dados360/pj/ContactsPJCard').then(mod => ({ default: mod.ContactsPJCard })))
const SocialMediaCard = lazy(() => import('@/components/dados360/pj/SocialMediaCard').then(mod => ({ default: mod.SocialMediaCard })))

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
          <nav className="mb-6" aria-label="Navegação">
            <Button
              variant="ghost"
              onClick={() => router.push(backLink.href)}
              className="mb-4"
              aria-label={backLink.text}
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              {backLink.text}
            </Button>
          </nav>
          
          {/* Card de erro */}
          <main role="main">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 bg-red-100 rounded-full mb-4" aria-hidden="true">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">
                    Empresa não encontrada
                  </h1>
                  <p className="text-sm text-gray-600 mb-6 max-w-md">
                    Não foram encontrados dados para o CNPJ <span className="font-mono font-semibold">{cnpj}</span>.
                    Verifique se o CNPJ está correto e tente novamente.
                  </p>
                  <Button onClick={() => router.push(backLink.href)} aria-label={backLink.text}>
                    <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                    {backLink.text}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }
  
  return (
    <Suspense fallback={<Dados360PJSkeleton />}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com botão voltar */}
          <nav className="mb-6" aria-label="Navegação">
            <Button
              variant="ghost"
              onClick={() => router.push(backLink.href)}
              aria-label={backLink.text}
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              {backLink.text}
            </Button>
          </nav>
          
          {/* Company Header */}
          <header>
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg mb-6" />}>
              <CompanyHeaderFull
                company={company}
                isFavorite={isFavorite(cleanCNPJ)}
                onToggleFavorite={handleToggleFavorite}
              />
            </Suspense>
          </header>
          
          {/* Grid de Cards */}
          <main role="main">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '800px' }}>
              {/* Coluna Principal (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Identificação */}
                <section aria-labelledby="identification-heading">
                  <h2 id="identification-heading" className="sr-only">Dados de Identificação</h2>
                  <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded-lg" />}>
                    <CompanyIdentificationCard company={company} />
                  </Suspense>
                </section>
                
                {/* Atividade */}
                <section aria-labelledby="activity-heading">
                  <h2 id="activity-heading" className="sr-only">Atividade Econômica</h2>
                  <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
                    <CompanyActivityCard company={company} />
                  </Suspense>
                </section>
                
                {/* Endereços */}
                <section aria-labelledby="addresses-heading">
                  <h2 id="addresses-heading" className="sr-only">Endereços</h2>
                  <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
                    <AddressesPJCard company={company} />
                  </Suspense>
                </section>
                
                {/* Contatos */}
                <section aria-labelledby="contacts-heading">
                  <h2 id="contacts-heading" className="sr-only">Informações de Contato</h2>
                  <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-lg" />}>
                    <ContactsPJCard company={company} />
                  </Suspense>
                </section>
              </div>
              
              {/* Coluna Lateral (1/3) */}
              <aside aria-label="Informações Complementares">
                <div className="space-y-6">
                  {/* Sócios */}
                  <section aria-labelledby="partners-heading">
                    <h2 id="partners-heading" className="sr-only">Quadro Societário</h2>
                    <Suspense fallback={<div className="h-80 animate-pulse bg-gray-100 rounded-lg" />}>
                      <PartnersCard company={company} />
                    </Suspense>
                  </section>
                  
                  {/* Dívidas e Restrições */}
                  <section aria-labelledby="debts-heading">
                    <h2 id="debts-heading" className="sr-only">Dívidas e Restrições</h2>
                    <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-lg" />}>
                      <DebtsCard company={company} />
                    </Suspense>
                  </section>
                  
                  {/* Histórico de Funcionários */}
                  <section aria-labelledby="employees-heading">
                    <h2 id="employees-heading" className="sr-only">Histórico de Funcionários</h2>
                    <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
                      <EmployeesHistoryCard company={company} />
                    </Suspense>
                  </section>
              
                  {/* Redes Sociais */}
                  <section aria-labelledby="social-heading">
                    <h2 id="social-heading" className="sr-only">Redes Sociais</h2>
                    <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-lg" />}>
                      <SocialMediaCard company={company} />
                    </Suspense>
                  </section>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  )
}