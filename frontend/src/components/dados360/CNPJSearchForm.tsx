'use client'

import { Building2, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Função para formatar CNPJ: 00.000.000/0000-00
function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '').substring(0, 14)
  
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
}

interface CNPJSearchFormProps {
  cnpj: string
  isValid: boolean
  isLoading: boolean
  error: string | null
  onCnpjChange: (cnpj: string) => void
  onSearch: () => void
}

export function CNPJSearchForm({
  cnpj,
  isValid,
  isLoading,
  error,
  onCnpjChange,
  onSearch
}: CNPJSearchFormProps) {
  
  // Handler para input com máscara
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value)
    onCnpjChange(formatted)
  }
  
  // Verificar se CNPJ está completo
  const isComplete = cnpj.replace(/\D/g, '').length === 14
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-600" />
          Buscar por CNPJ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input CNPJ com validação visual */}
        <div className="relative">
          <Input
            type="text"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={handleInputChange}
            disabled={isLoading}
            className="pr-10 font-mono text-lg"
          />
          
          {/* Ícone de validação */}
          {isComplete && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          )}
        </div>
        
        {/* Mensagem de erro */}
        {error && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Botão de busca */}
        <Button
          onClick={onSearch}
          disabled={!isValid || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Consultando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Consultar Dossiê
            </>
          )}
        </Button>
        
        {/* Info sobre custo */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Consulta Dossiê 360° PJ
            </p>
            <p className="text-xs text-blue-700">
              Informações completas sobre a empresa
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-600 text-white text-sm px-3 py-1">
            12 créditos
          </Badge>
        </div>
        
        {/* Dados inclusos */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Dados inclusos na consulta:
          </p>
          <ul className="space-y-2">
            {[
              'Identificação e Situação Cadastral',
              'CNAEs e Atividades',
              'Sócios e Administradores',
              'Endereços e Contatos',
              'Dívidas e Restrições Financeiras',
              'Histórico de Funcionários',
              'Redes Sociais e Website'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Dica */}
        <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800">
            <strong>Dica:</strong> Digite apenas os números do CNPJ. A formatação será aplicada automaticamente.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
