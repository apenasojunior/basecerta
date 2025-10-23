'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { searchPersonByCPF } from '@/mocks/dados360-pf'
import { PersonHeader } from '@/components/dados360/pf/PersonHeader'
import { PersonalDataCard } from '@/components/dados360/pf/PersonalDataCard'
import { IncomeCard } from '@/components/dados360/pf/IncomeCard'
import { AddressesPFCard } from '@/components/dados360/pf/AddressesPFCard'
import { ContactsPFCard } from '@/components/dados360/pf/ContactsPFCard'
import { RelativesCard } from '@/components/dados360/pf/RelativesCard'
import { ProfessionalExperienceCard } from '@/components/dados360/pf/ProfessionalExperienceCard'
import { CompanyLinksCard } from '@/components/dados360/pf/CompanyLinksCard'
import { useFavorites } from '@/hooks/useFavorites'
import { toast } from '@/lib/toast'

interface PageProps {
  params: Promise<{
    cpf: string
  }>
}

export default function DossierPFPage({ params }: PageProps) {
  const router = useRouter()
  const { cpf } = use(params)
  const searchParams = useSearchParams()
  const { isFavorite, toggleFavorite, getStats } = useFavorites()
  const stats = getStats()
  
  // Limpar CPF para busca (remover pontos, traços)
  const cleanCPF = cpf.replace(/[.\-]/g, '')
  
  // Get origin page from query params
  const from = searchParams.get('from')
  
  // Define back link and text based on origin
  const getBackLink = () => {
    switch (from) {
      case 'favoritos':
        return { href: '/favoritos', text: 'Voltar aos Favoritos' }
      default:
        return { href: '/dados360/pf/search', text: 'Voltar para Busca' }
    }
  }
  
  const backLink = getBackLink()
  
  // Buscar pessoa nos dados mock
  const person = searchPersonByCPF(cleanCPF)
  
  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (!person) return

    const favorited = isFavorite(cleanCPF)

    // Verifica limite antes de adicionar
    if (!favorited && stats.isFull) {
      toast.warning(`Limite de ${stats.total} favoritos atingido. Remova alguns para adicionar novos.`)
      return
    }

    toggleFavorite({
      id: cleanCPF,
      type: 'PF',
      document: cleanCPF,
      name: person.nome,
      metadata: {}
    })

    if (!favorited) {
      toast.success(`"${person.nome}" adicionado aos favoritos`)
    } else {
      toast.success(`"${person.nome}" removido dos favoritos`)
    }
  }
  
  // Se pessoa não encontrada
  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com botão voltar */}
          <nav aria-label="Navegação">
            <Button
              variant="ghost"
              onClick={() => router.push(backLink.href)}
              className="mb-4"
              aria-label="Voltar para busca de pessoas"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4 mr-2" />
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
                    Pessoa não encontrada
                  </h1>
                  <p className="text-sm text-gray-600 mb-6 max-w-md">
                    Não foram encontrados dados para o CPF <span className="font-mono font-semibold">{cpf}</span>.
                    Verifique se o CPF está correto e tente novamente.
                  </p>
                  <Button onClick={() => router.push(backLink.href)} aria-label="Voltar para busca">
                    <ArrowLeft aria-hidden="true" className="h-4 w-4 mr-2" />
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <nav aria-label="Navegação">
          <Button
            variant="ghost"
            onClick={() => router.push(backLink.href)}
            aria-label="Voltar para busca de pessoas"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 mr-2" />
            {backLink.text}
          </Button>
        </nav>
        
        {/* Person Header */}
        <header>
          <PersonHeader
            person={person}
            isFavorite={isFavorite(cleanCPF)}
            onToggleFavorite={handleToggleFavorite}
          />
        </header>
        
        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal (2/3) */}
          <main role="main" className="lg:col-span-2 space-y-6">
            {/* Dados Pessoais */}
            <section aria-labelledby="personal-data-heading">
              <h2 id="personal-data-heading" className="sr-only">Dados Pessoais</h2>
              <PersonalDataCard person={person} />
            </section>
            
            {/* Renda e Score */}
            <section aria-labelledby="income-heading">
              <h2 id="income-heading" className="sr-only">Renda e Score</h2>
              <IncomeCard person={person} />
            </section>
            
            {/* Endereços */}
            <section aria-labelledby="addresses-heading">
              <h2 id="addresses-heading" className="sr-only">Endereços</h2>
              <AddressesPFCard person={person} />
            </section>
            
            {/* Contatos */}
            <section aria-labelledby="contacts-heading">
              <h2 id="contacts-heading" className="sr-only">Contatos</h2>
              <ContactsPFCard person={person} />
            </section>
          </main>
          
          {/* Coluna Lateral (1/3) */}
          <aside aria-label="Informações Complementares" className="space-y-6">
            {/* Familiares */}
            <section aria-labelledby="relatives-heading">
              <h2 id="relatives-heading" className="sr-only">Familiares</h2>
              <RelativesCard person={person} />
            </section>
            
            {/* Experiência Profissional */}
            <section aria-labelledby="professional-heading">
              <h2 id="professional-heading" className="sr-only">Experiência Profissional</h2>
              <ProfessionalExperienceCard person={person} />
            </section>
            
            {/* Vínculos Empresariais */}
            <section aria-labelledby="company-links-heading">
              <h2 id="company-links-heading" className="sr-only">Vínculos Empresariais</h2>
              <CompanyLinksCard person={person} />
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
