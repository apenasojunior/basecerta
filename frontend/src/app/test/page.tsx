'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, CheckCircle2, Copy } from 'lucide-react'
import { mockCompanies } from '@/mocks/smart-cnpj'

export default function TestPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Pegar primeiras 5 empresas para testes
  const testCompanies = mockCompanies.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Página de Testes - Smart CNPJ 360°
        </h1>
        <p className="text-gray-600">
          Use esta página para testar todas as funcionalidades implementadas
        </p>
      </div>

      {/* Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Sistema Funcionando</p>
              <p className="text-sm text-green-700">
                Frontend rodando em: <code className="bg-green-100 px-2 py-1 rounded">http://localhost:3000</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Página 1: Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="bg-blue-600">1</Badge>
            Página de Busca
          </CardTitle>
          <CardDescription>
            Teste os 7 tipos de busca e 8 filtros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-mono text-sm text-gray-700">/smart-cnpj/search</p>
              <p className="text-xs text-gray-500 mt-1">7 tipos de busca + 8 filtros + Mockdata</p>
            </div>
            <Link href="/smart-cnpj/search" target="_blank">
              <Button size="sm">
                <ExternalLink className="h-4 w-4" />
                Abrir
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-600 space-y-1 bg-blue-50 p-3 rounded-lg">
            <p className="font-semibold text-blue-900 mb-2">✅ O que testar:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Alternar entre os 7 tipos de busca</li>
              <li>Testar máscaras (CNPJ, CEP, Telefone)</li>
              <li>Expandir/colapsar filtros</li>
              <li>Aplicar múltiplos filtros</li>
              <li>Clicar em "Buscas Populares"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Página 2: Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="bg-purple-600">2</Badge>
            Página de Resultados
          </CardTitle>
          <CardDescription>
            Teste a listagem, paginação e filtros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Exemplos de busca:</p>
            
            {/* Busca por Razão Social */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-700">/smart-cnpj/results?type=razaoSocial&q=TECNOLOGIA</p>
                <p className="text-xs text-gray-500 mt-1">Busca por Razão Social "TECNOLOGIA"</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard('/smart-cnpj/results?type=razaoSocial&q=TECNOLOGIA', 'rs')}
                >
                  {copied === 'rs' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Link href="/smart-cnpj/results?type=razaoSocial&q=TECNOLOGIA" target="_blank">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Busca por Segmento */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-700">/smart-cnpj/results?type=segmento&q=Desenvolvimento</p>
                <p className="text-xs text-gray-500 mt-1">Busca por Segmento "Desenvolvimento"</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard('/smart-cnpj/results?type=segmento&q=Desenvolvimento', 'seg')}
                >
                  {copied === 'seg' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Link href="/smart-cnpj/results?type=segmento&q=Desenvolvimento" target="_blank">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Busca Genérica */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-700">/smart-cnpj/results?type=razaoSocial&q=SILVA</p>
                <p className="text-xs text-gray-500 mt-1">Busca genérica "SILVA"</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard('/smart-cnpj/results?type=razaoSocial&q=SILVA', 'gen')}
                >
                  {copied === 'gen' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Link href="/smart-cnpj/results?type=razaoSocial&q=SILVA" target="_blank">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-1 bg-purple-50 p-3 rounded-lg">
            <p className="font-semibold text-purple-900 mb-2">✅ O que testar:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-800">
              <li>Paginação (20 itens por página)</li>
              <li>Aplicar filtros na sidebar</li>
              <li>Favoritar empresas (ícone coração)</li>
              <li>Ver detalhes das empresas</li>
              <li>Filtros persistentes na URL</li>
              <li>Responsividade (mobile/tablet/desktop)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Página 3: Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="bg-green-600">3</Badge>
            Página de Detalhes
          </CardTitle>
          <CardDescription>
            Teste os detalhes completos de empresas reais do mock
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Empresas de teste:</p>
          
          {testCompanies.map((company, index) => (
            <div key={company.cnpj} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                  <Badge className={
                    company.situacaoCadastral === 'ATIVA' ? 'bg-green-100 text-green-700' :
                    company.situacaoCadastral === 'SUSPENSA' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {company.situacaoCadastral}
                  </Badge>
                </div>
                <p className="font-semibold text-gray-900 text-sm truncate">{company.razaoSocial}</p>
                <p className="font-mono text-xs text-gray-600">{company.cnpj}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {company.endereco.municipio}/{company.endereco.uf} • {company.socios.length} sócios
                </p>
              </div>
              <div className="flex gap-2 ml-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`/smart-cnpj/${company.cnpj}`, `det-${index}`)}
                >
                  {copied === `det-${index}` ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Link href={`/smart-cnpj/${company.cnpj}`} target="_blank">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          <div className="text-sm text-gray-600 space-y-1 bg-green-50 p-3 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">✅ O que testar:</p>
            <ul className="list-disc list-inside space-y-1 text-green-800">
              <li>Header com logo e badges</li>
              <li>6 cards informativos (Identificação, Classificação, etc)</li>
              <li>Grid 2 colunas responsivo</li>
              <li>Botões Favoritar, Compartilhar, Exportar</li>
              <li>Quadro societário completo</li>
              <li>Google Maps placeholder</li>
              <li>Links de contato (mailto, tel)</li>
              <li>CTA para Dossiê 360° PJ</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>📊 Estatísticas do Mock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockCompanies.length}</p>
              <p className="text-sm text-gray-600">Empresas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCompanies.filter(c => c.situacaoCadastral === 'ATIVA').length}
              </p>
              <p className="text-sm text-gray-600">Ativas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCompanies.filter(c => c.isMEI).length}
              </p>
              <p className="text-sm text-gray-600">MEIs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCompanies.reduce((acc, c) => acc + c.socios.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Sócios</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atalhos */}
      <Card>
        <CardHeader>
          <CardTitle>⌨️ Atalhos Úteis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/smart-cnpj/search">
              <Button variant="outline" className="w-full justify-start">
                Smart CNPJ - Busca
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
