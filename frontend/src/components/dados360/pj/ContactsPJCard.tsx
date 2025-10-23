'use client'

import { Mail, Phone, Globe, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface ContactsPJCardProps {
  company: Dados360PJCompany
}

export function ContactsPJCard({ company }: ContactsPJCardProps) {
  const { contatos } = company
  
  // Verificar se há contatos
  const hasContacts =
    contatos.emailPrincipal ||
    (contatos.emailsSecundarios && contatos.emailsSecundarios.length > 0) ||
    contatos.telefonePrincipal ||
    (contatos.telefonesSecundarios && contatos.telefonesSecundarios.length > 0) ||
    contatos.website
  
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
              Não foram encontradas informações de contato para esta empresa.
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
          
          {/* Telefones */}
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
          
          {/* Website */}
          {contatos.website && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Website</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <a
                  href={contatos.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 underline truncate flex-1 min-w-0"
                >
                  {contatos.website}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(contatos.website, '_blank')}
                  className="ml-2 flex-shrink-0"
                >
                  Abrir
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
