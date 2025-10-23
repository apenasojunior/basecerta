'use client'

import { Share2, Linkedin, Instagram, Facebook, Twitter, Youtube, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Dados360PJCompany } from '@/mocks/dados360-pj'

interface SocialMediaCardProps {
  company: Dados360PJCompany
}

export function SocialMediaCard({ company }: SocialMediaCardProps) {
  const { socialMedia } = company.contatos
  
  if (!socialMedia || Object.values(socialMedia).every(value => !value)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary-600" />
            Redes Sociais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Sem redes sociais cadastradas
            </p>
            <p className="text-sm text-gray-600">
              Não foram encontradas redes sociais para esta empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const socialNetworks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: socialMedia.linkedin,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-700'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: socialMedia.instagram,
      color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700',
      textColor: 'text-pink-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: socialMedia.facebook,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: socialMedia.twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-sky-600'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: socialMedia.youtube,
      color: 'bg-red-600 hover:bg-red-700',
      textColor: 'text-red-600'
    }
  ].filter(network => network.url)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary-600" />
          Redes Sociais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {socialNetworks.map((network, index) => {
            const Icon = network.icon
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${network.color.split(' ')[0]}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {network.name}
                    </p>
                    <a
                      href={network.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs ${network.textColor} hover:underline truncate block`}
                    >
                      {network.url?.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(network.url, '_blank')}
                  className="flex-shrink-0"
                >
                  Abrir
                </Button>
              </div>
            )
          })}
        </div>
        
        {/* Dica */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Links das redes sociais oficiais da empresa
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
