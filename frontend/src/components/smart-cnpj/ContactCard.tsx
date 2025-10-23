'use client'

import { Mail, Phone, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SmartCNPJCompany } from '@/mocks/smart-cnpj'

interface ContactCardProps {
  company: SmartCNPJCompany
}

export function ContactCard({ company }: ContactCardProps) {
  const { contatos } = company

  const hasContacts = contatos.email || contatos.telefone

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary-600" />
          Contatos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasContacts ? (
          <div className="space-y-4">
            {/* Email */}
            {contatos.email && (
              <div>
                <p className="text-sm text-gray-500 mb-2">E-mail</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${contatos.email}`}
                      className="text-base text-primary-600 hover:text-primary-700 hover:underline truncate"
                    >
                      {contatos.email}
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${contatos.email}`, '_blank')}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}

            {/* Telefone */}
            {contatos.telefone && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Telefone</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${contatos.telefone.replace(/\D/g, '')}`}
                      className="text-base font-mono text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {contatos.telefone}
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => contatos.telefone && window.open(`tel:${contatos.telefone.replace(/\D/g, '')}`, '_blank')}
                  >
                    Ligar
                  </Button>
                </div>
              </div>
            )}

            {/* Website (mock - não temos no schema) */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Website</p>
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Não informado</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              Nenhum contato disponível
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
