'use client'

import { User, FileText, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'
import { estadoCivilLabels } from '@/mocks/dados360-pf'
import { formatDate } from '@/lib/formatters'

interface PersonalDataCardProps {
  person: Dados360PFPerson
}

export function PersonalDataCard({ person }: PersonalDataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" />
          Dados Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Nome Completo */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">Nome Completo</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900 font-semibold">{person.nome}</p>
            </div>
          </div>
          
          {/* Nome Social */}
          {person.nomeSocial && (
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-600">Nome Social</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-900">{person.nomeSocial}</p>
              </div>
            </div>
          )}
          
          {/* CPF */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">CPF</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900 font-mono">{person.cpf}</p>
            </div>
          </div>
          
          {/* RG */}
          {person.rg && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <p className="text-sm font-medium text-gray-600">RG</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-900 font-mono">{person.rg}</p>
                </div>
              </div>
              
              {person.rgOrgaoEmissor && person.rgUfEmissao && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-sm font-medium text-gray-600">Órgão Emissor</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-900">
                      {person.rgOrgaoEmissor}/{person.rgUfEmissao}
                      {person.rgDataEmissao && ` - ${formatDate(person.rgDataEmissao)}`}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Título de Eleitor */}
          {person.tituloEleitor && (
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <p className="text-sm font-medium text-gray-600">Título Eleitor</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-900 font-mono">{person.tituloEleitor}</p>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 my-4" />
          
          {/* Data de Nascimento */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">Data Nascimento</p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900">{formatDate(person.dataNascimento)}</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  {person.idade} anos
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Sexo */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">Sexo</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900">
                {person.sexo === 'M' ? 'Masculino' : 'Feminino'}
              </p>
            </div>
          </div>
          
          {/* Estado Civil */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">Estado Civil</p>
            </div>
            <div className="col-span-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                {estadoCivilLabels[person.estadoCivil]}
              </Badge>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-4" />
          
          {/* Nacionalidade */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">Nacionalidade</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900">{person.nacionalidade}</p>
            </div>
          </div>
          
          {/* Naturalidade */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-600">Naturalidade</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-900">{person.naturalidade}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-4" />
          
          {/* Filiação */}
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Filiação</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Mãe</Badge>
                  <p className="text-sm text-gray-900">{person.nomeMae}</p>
                </div>
                {person.nomePai && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Pai</Badge>
                    <p className="text-sm text-gray-900">{person.nomePai}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
