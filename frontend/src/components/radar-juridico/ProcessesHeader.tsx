/**
 * ProcessesHeader Component
 * Header com informações da pessoa e resumo dos processos
 */

'use client'

import { User, Scale, TrendingUp, AlertCircle, Users, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCPF } from '@/lib/formatters'
import type { RadarJuridicoPessoa } from '@/mocks/radar-juridico-pf'

interface ProcessesHeaderProps {
  pessoa: RadarJuridicoPessoa
}

export function ProcessesHeader({ pessoa }: ProcessesHeaderProps) {
  // Calcular iniciais do nome
  const initials = pessoa.nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  
  return (
    <div className="space-y-6">
      {/* Informações da Pessoa */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {pessoa.nome}
              </h1>
              <p className="text-gray-600 font-mono text-sm mb-3">
                CPF: {formatCPF(pessoa.cpf)}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Scale className="h-3 w-3" />
                  {pessoa.totalProcessos} processo(s)
                </Badge>
                
                {pessoa.processosAtivos > 0 && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {pessoa.processosAtivos} ativo(s)
                  </Badge>
                )}
                
                {pessoa.valorTotalCausas > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    R$ {pessoa.valorTotalCausas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total de Processos */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Scale className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pessoa.totalProcessos}
              </p>
              <p className="text-xs text-gray-600 mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Processos Ativos */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pessoa.processosAtivos}
              </p>
              <p className="text-xs text-gray-600 mt-1">Ativos</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Processos Arquivados */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pessoa.processosArquivados}
              </p>
              <p className="text-xs text-gray-600 mt-1">Arquivados</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Como Autor */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pessoa.processosPorPolo.comoAutor}
              </p>
              <p className="text-xs text-gray-600 mt-1">Como Autor</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Como Réu */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pessoa.processosPorPolo.comoReu}
              </p>
              <p className="text-xs text-gray-600 mt-1">Como Réu</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Processos Cíveis */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pessoa.processosPorTipo.civeis}
              </p>
              <p className="text-xs text-gray-600 mt-1">Cíveis</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resumo por Tipo */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Distribuição por Tipo de Processo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {pessoa.processosPorTipo.civeis}
              </p>
              <p className="text-xs text-gray-600 mt-1">Cíveis</p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {pessoa.processosPorTipo.trabalhistas}
              </p>
              <p className="text-xs text-gray-600 mt-1">Trabalhistas</p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">
                {pessoa.processosPorTipo.criminais}
              </p>
              <p className="text-xs text-gray-600 mt-1">Criminais</p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">
                {pessoa.processosPorTipo.tributarios}
              </p>
              <p className="text-xs text-gray-600 mt-1">Tributários</p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">
                {pessoa.processosPorTipo.familia}
              </p>
              <p className="text-xs text-gray-600 mt-1">Família</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
