'use client'

import { Mail, Phone, Smartphone, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Dados360PFPerson } from '@/mocks/dados360-pf'

interface ContactsPFCardProps {
  person: Dados360PFPerson
}

export function ContactsPFCard({ person }: ContactsPFCardProps) {
  const { contatos } = person
  
  // Verificar se há contatos
  const hasContacts =
    contatos.emailPrincipal ||
    (contatos.emailsSecundarios && contatos.emailsSecundarios.length > 0) ||
    contatos.telefonePrincipal ||
    (contatos.telefonesSecundarios && contatos.telefonesSecundarios.length > 0) ||
    contatos.celular ||
    (contatos.celularesSecundarios && contatos.celularesSecundarios.length > 0)
  
  if (!hasContacts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary-600" />
            Contatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Nenhum contato disponível
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontradas informações de contato para esta pessoa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary-600" />
          Contatos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* E-mails */}
          {(contatos.emailPrincipal || (contatos.emailsSecundarios && contatos.emailsSecundarios.length > 0)) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">E-mails</p>
              </div>
              
              <div className="space-y-3">
                {/* E-mail Principal */}
                {contatos.emailPrincipal && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 flex-shrink-0">
                        Principal
                      </Badge>
                      <a
                        href={`mailto:${contatos.emailPrincipal}`}
                        className="text-sm text-gray-900 hover:text-primary-600 underline truncate"
                      >
                        {contatos.emailPrincipal}
                      </a>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `mailto:${contatos.emailPrincipal}`}
                      className="ml-2 flex-shrink-0"
                    >
                      Enviar
                    </Button>
                  </div>
                )}
                
                {/* E-mails Secundários */}
                {contatos.emailsSecundarios?.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-gray-900 hover:text-primary-600 underline truncate flex-1 min-w-0"
                    >
                      {email}
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `mailto:${email}`}
                      className="ml-2 flex-shrink-0"
                    >
                      Enviar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Telefones Fixos */}
          {(contatos.telefonePrincipal || (contatos.telefonesSecundarios && contatos.telefonesSecundarios.length > 0)) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Telefones</p>
              </div>
              
              <div className="space-y-3">
                {/* Telefone Principal */}
                {contatos.telefonePrincipal && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                        Principal
                      </Badge>
                      <span className="text-sm text-gray-900 font-mono">
                        {contatos.telefonePrincipal}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${contatos.telefonePrincipal?.replace(/\D/g, '')}`}
                    >
                      Ligar
                    </Button>
                  </div>
                )}
                
                {/* Telefones Secundários */}
                {contatos.telefonesSecundarios?.map((telefone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-sm text-gray-900 font-mono">{telefone}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${telefone.replace(/\D/g, '')}`}
                    >
                      Ligar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Celulares */}
          {(contatos.celular || (contatos.celularesSecundarios && contatos.celularesSecundarios.length > 0)) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Celulares</p>
              </div>
              
              <div className="space-y-3">
                {/* Celular Principal */}
                {contatos.celular && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        Principal
                      </Badge>
                      <span className="text-sm text-gray-900 font-mono">
                        {contatos.celular}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${contatos.celular?.replace(/\D/g, '')}`}
                    >
                      Ligar
                    </Button>
                  </div>
                )}
                
                {/* Celulares Secundários */}
                {contatos.celularesSecundarios?.map((celular, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-sm text-gray-900 font-mono">{celular}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${celular.replace(/\D/g, '')}`}
                    >
                      Ligar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
