'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface PageProps {
  params: Promise<{
    cpf: string
  }>
}

export default function DossierPFPage({ params }: PageProps) {
  const router = useRouter()
  const { cpf } = use(params)
  
  // Limpar CPF para busca (remover pontos, traços)
  const cleanCPF = cpf.replace(/[.\-]/g, '')
  
  // Buscar pessoa nos dados mock
  const person = searchPersonByCPF(cleanCPF)
  
  // State para favoritos (será integrado com backend posteriormente)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Se pessoa não encontrada
  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com botão voltar */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dados360/pf/search')}
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
                  Pessoa não encontrada
                </h2>
                <p className="text-sm text-gray-600 mb-6 max-w-md">
                  Não foram encontrados dados para o CPF <span className="font-mono font-semibold">{cpf}</span>.
                  Verifique se o CPF está correto e tente novamente.
                </p>
                <Button onClick={() => router.push('/dados360/pf/search')}>
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
            onClick={() => router.push('/dados360/pf/search')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Busca
          </Button>
        </div>
        
        {/* Person Header */}
        <PersonHeader
          person={person}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
        />
        
        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados Pessoais */}
            <PersonalDataCard person={person} />
            
            {/* Renda e Score */}
            <IncomeCard person={person} />
            
            {/* Endereços */}
            <AddressesPFCard person={person} />
            
            {/* Contatos */}
            <ContactsPFCard person={person} />
          </div>
          
          {/* Coluna Lateral (1/3) */}
          <div className="space-y-6">
            {/* Familiares */}
            <RelativesCard person={person} />
            
            {/* Experiência Profissional */}
            <ProfessionalExperienceCard person={person} />
            
            {/* Vínculos Empresariais */}
            <CompanyLinksCard person={person} />
          </div>
        </div>
      </div>
    </div>
  )
}
