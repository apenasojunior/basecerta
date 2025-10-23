'use client'

import { useState } from 'react'
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CPFSearchFormProps {
  cpf: string
  onCpfChange: (cpf: string) => void
  onSearch: () => void
  isSearching?: boolean
  error?: string | null
  isValid?: boolean
  disabled?: boolean
}

export function CPFSearchForm({
  cpf,
  onCpfChange,
  onSearch,
  isSearching = false,
  error = null,
  isValid = false,
  disabled = false,
}: CPFSearchFormProps) {
  const [isFocused, setIsFocused] = useState(false)
  
  // Aplicar máscara de CPF
  const handleCpfChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Limita a 11 dígitos
    const limited = numbers.substring(0, 11)
    
    // Aplica máscara: 000.000.000-00
    let formatted = limited
    if (limited.length > 3) {
      formatted = `${limited.substring(0, 3)}.${limited.substring(3)}`
    }
    if (limited.length > 6) {
      formatted = `${limited.substring(0, 3)}.${limited.substring(3, 6)}.${limited.substring(6)}`
    }
    if (limited.length > 9) {
      formatted = `${limited.substring(0, 3)}.${limited.substring(3, 6)}.${limited.substring(6, 9)}-${limited.substring(9, 11)}`
    }
    
    onCpfChange(formatted)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled && !isSearching) {
      onSearch()
    }
  }
  
  const showSuccess = isValid && cpf.length === 14 && !error
  const showError = error !== null
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        {/* Input CPF */}
        <div className="space-y-2">
          <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
            CPF
          </Label>
          <div className="relative">
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => handleCpfChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled || isSearching}
              className={cn(
                'pr-10 font-mono text-lg',
                showSuccess && 'border-green-500 focus-visible:ring-green-500',
                showError && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            
            {/* Ícone de validação */}
            {showSuccess && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            )}
            {showError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            )}
          </div>
          
          {/* Mensagem de erro */}
          {showError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
          
          {/* Dica */}
          {!showError && !showSuccess && isFocused && (
            <p className="text-sm text-gray-500">
              Digite o CPF com 11 dígitos. Os dígitos verificadores serão validados.
            </p>
          )}
          
          {/* Sucesso */}
          {showSuccess && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              CPF válido
            </p>
          )}
        </div>
        
        {/* Botão de busca */}
        <Button
          type="submit"
          size="lg"
          disabled={disabled || isSearching || !cpf || cpf.length < 14}
          className="w-full"
        >
          {isSearching ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Consultar Dossiê
            </>
          )}
        </Button>
        
        {/* Info sobre créditos */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Consulta de Dossiê Pessoa Física
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  Esta consulta consome <strong>8 créditos</strong> e retorna:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Dados pessoais completos</li>
                  <li>• Endereços e contatos</li>
                  <li>• Renda estimada e score de crédito</li>
                  <li>• Vínculos familiares</li>
                  <li>• Experiência profissional</li>
                  <li>• Participações empresariais</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
