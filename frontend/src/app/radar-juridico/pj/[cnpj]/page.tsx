/**
 * Página de Listagem de Processos - Radar Jurídico PJ
 * Exibe todos os processos de uma empresa com filtros e paginação
 */

'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ProcessCard } from '@/components/radar-juridico/ProcessCard'
import { searchEmpresaByCNPJ } from '@/mocks/radar-juridico-pj'
import { formatCNPJ } from '@/lib/formatters'
import type { ProcessoJuridico } from '@/mocks/radar-juridico-pf'

interface PageProps {
  params: Promise<{ cnpj: string }>
}

// Opções de filtros
const tribunaisOptions = ['TJSP', 'TRT', 'STJ', 'TST', 'TJRJ', 'TJMG']
const statusOptions = [
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'SUSPENSO', label: 'Suspenso' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
  { value: 'SENTENCIADO', label: 'Sentenciado' },
  { value: 'RECURSO', label: 'Recurso' },
] as const

const tiposOptions = [
  { value: 'CIVEL', label: 'Cível' },
  { value: 'TRABALHISTA', label: 'Trabalhista' },
  { value: 'CRIMINAL', label: 'Criminal' },
  { value: 'TRIBUTARIO', label: 'Tributário' },
] as const

type SortOption = 'mais-recentes' | 'mais-antigos' | 'maior-valor' | 'menor-valor'

export default function RadarJuridicoPJProcessesPage({ params }: PageProps) {
  const { cnpj } = use(params)
  
  // Buscar empresa
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  const empresa = searchEmpresaByCNPJ(cleanCNPJ)
  
  // Estados dos filtros
  const [selectedTribunais, setSelectedTribunais] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('mais-recentes')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  
  // Toggle filtro de tribunal
  const toggleTribunal = (tribunal: string) => {
    setSelectedTribunais(prev => 
      prev.includes(tribunal)
        ? prev.filter(t => t !== tribunal)
        : [...prev, tribunal]
    )
    setCurrentPage(1)
  }
  
  // Toggle filtro de status
  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
    setCurrentPage(1)
  }
  
  // Toggle filtro de tipo
  const toggleTipo = (tipo: string) => {
    setSelectedTipos(prev =>
      prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    )
    setCurrentPage(1)
  }
  
  // Limpar todos os filtros
  const clearFilters = () => {
    setSelectedTribunais([])
    setSelectedStatus([])
    setSelectedTipos([])
    setCurrentPage(1)
  }
  
  // Aplicar filtros e ordenação
  const processedProcessos = useMemo(() => {
    if (!empresa) return []
    
    let filtered = [...empresa.processos]
    
    // Filtrar por tribunal
    if (selectedTribunais.length > 0) {
      filtered = filtered.filter(p => selectedTribunais.includes(p.tribunal))
    }
    
    // Filtrar por status
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(p => selectedStatus.includes(p.status))
    }
    
    // Filtrar por tipo
    if (selectedTipos.length > 0) {
      filtered = filtered.filter(p => selectedTipos.includes(p.tipo))
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'mais-recentes':
          return new Date(b.dataUltimaMovimentacao).getTime() - new Date(a.dataUltimaMovimentacao).getTime()
        case 'mais-antigos':
          return new Date(a.dataUltimaMovimentacao).getTime() - new Date(b.dataUltimaMovimentacao).getTime()
        case 'maior-valor':
          return (b.valorCausa || 0) - (a.valorCausa || 0)
        case 'menor-valor':
          return (a.valorCausa || 0) - (b.valorCausa || 0)
        default:
          return 0
      }
    })
    
    return filtered
  }, [empresa, selectedTribunais, selectedStatus, selectedTipos, sortBy])
  
  // Paginação
  const totalPages = Math.ceil(processedProcessos.length / itemsPerPage)
  const paginatedProcessos = processedProcessos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Verificar se há filtros ativos
  const hasActiveFilters = selectedTribunais.length > 0 || selectedStatus.length > 0 || selectedTipos.length > 0
  
  // Estado de não encontrado
  if (!empresa) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                CNPJ não encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Não foram encontrados dados para o CNPJ informado.
              </p>
              <Link href="/radar-juridico/pj/search">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Nova Consulta
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Breadcrumb e Voltar */}
        <div className="flex items-center gap-2">
          <Link 
            href="/radar-juridico/pj/search"
            className="text-sm text-gray-600 hover:text-primary"
          >
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </Link>
        </div>
        
        {/* Header com informações da empresa */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {empresa.razaoSocial}
                </h1>
                {empresa.nomeFantasia && (
                  <p className="text-gray-600 mb-2">
                    Nome Fantasia: {empresa.nomeFantasia}
                  </p>
                )}
                <p className="text-gray-600 font-mono text-sm mb-3">
                  CNPJ: {formatCNPJ(empresa.cnpj)}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {empresa.totalProcessos} processo(s)
                  </Badge>
                  
                  {empresa.processosAtivos > 0 && (
                    <Badge variant="default" className="flex items-center gap-1">
                      {empresa.processosAtivos} ativo(s)
                    </Badge>
                  )}
                  
                  {empresa.valorTotalCausas > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      R$ {empresa.valorTotalCausas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{empresa.processosPorTipo.civeis}</p>
                  <p className="text-xs text-gray-600 mt-1">Cíveis</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{empresa.processosPorTipo.trabalhistas}</p>
                  <p className="text-xs text-gray-600 mt-1">Trabalhistas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{empresa.processosPorTipo.criminais}</p>
                  <p className="text-xs text-gray-600 mt-1">Criminais</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{empresa.processosPorTipo.tributarios}</p>
                  <p className="text-xs text-gray-600 mt-1">Tributários</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Layout principal: Filtros + Lista */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Filtros */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Título e Limpar */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </h3>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                  
                  {/* Filtro: Tribunal */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tribunal</Label>
                    <div className="space-y-2">
                      {tribunaisOptions.map(tribunal => (
                        <div key={tribunal} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tribunal-${tribunal}`}
                            checked={selectedTribunais.includes(tribunal)}
                            onCheckedChange={() => toggleTribunal(tribunal)}
                          />
                          <label
                            htmlFor={`tribunal-${tribunal}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {tribunal}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Filtro: Status */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="space-y-2">
                      {statusOptions.map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${value}`}
                            checked={selectedStatus.includes(value)}
                            onCheckedChange={() => toggleStatus(value)}
                          />
                          <label
                            htmlFor={`status-${value}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Filtro: Tipo */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tipo de Processo</Label>
                    <div className="space-y-2">
                      {tiposOptions.map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tipo-${value}`}
                            checked={selectedTipos.includes(value)}
                            onCheckedChange={() => toggleTipo(value)}
                          />
                          <label
                            htmlFor={`tipo-${value}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Lista de Processos */}
          <div className="lg:col-span-3 space-y-4">
            {/* Barra de controle: Ordenação e Resultados */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {processedProcessos.length} processo(s) encontrado(s)
                    </span>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        Filtrado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-600">Ordenar por:</Label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mais-recentes">Mais Recentes</SelectItem>
                        <SelectItem value="mais-antigos">Mais Antigos</SelectItem>
                        <SelectItem value="maior-valor">Maior Valor</SelectItem>
                        <SelectItem value="menor-valor">Menor Valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Grid de ProcessCards */}
            {paginatedProcessos.length > 0 ? (
              <div className="space-y-4">
                {paginatedProcessos.map(processo => (
                  <ProcessCard key={processo.numero} processo={processo} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Nenhum processo encontrado com os filtros aplicados.
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Paginação */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
