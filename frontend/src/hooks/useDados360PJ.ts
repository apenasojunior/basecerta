'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { validateCNPJ, searchCompanyByCNPJ, type Dados360PJCompany } from '@/mocks/dados360-pj'

export function useDados360PJ() {
  const router = useRouter()
  
  // Estados
  const [cnpj, setCnpj] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [showCostModal, setShowCostModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [company, setCompany] = useState<Dados360PJCompany | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Validar CNPJ em tempo real
  const handleCnpjChange = useCallback((value: string) => {
    setCnpj(value)
    setError(null)
    
    // Validar apenas se tiver 14 dígitos (CNPJ completo)
    const cleanCnpj = value.replace(/[^\d]/g, '')
    if (cleanCnpj.length === 14) {
      const valid = validateCNPJ(value)
      setIsValid(valid)
      
      if (!valid) {
        setError('CNPJ inválido')
      }
    } else {
      setIsValid(false)
    }
  }, [])
  
  // Iniciar busca (abre modal de confirmação)
  const handleSearch = useCallback(() => {
    if (!isValid) {
      setError('Por favor, insira um CNPJ válido')
      return
    }
    
    setShowCostModal(true)
  }, [isValid])
  
  // Confirmar busca e executar consulta
  const confirmSearch = useCallback(async () => {
    setShowCostModal(false)
    setIsLoading(true)
    setError(null)
    
    try {
      // Simular delay de API (1.5s)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Buscar empresa nos dados mock
      const foundCompany = searchCompanyByCNPJ(cnpj)
      
      if (foundCompany) {
        setCompany(foundCompany)
        
        // Redirecionar para página do dossiê
        const cleanCnpj = cnpj.replace(/[^\d]/g, '')
        router.push(`/dados360/pj/${cleanCnpj}`)
      } else {
        setError('Empresa não encontrada')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Erro ao realizar consulta. Tente novamente.')
      setIsLoading(false)
    }
  }, [cnpj, router])
  
  // Cancelar busca
  const cancelSearch = useCallback(() => {
    setShowCostModal(false)
  }, [])
  
  // Resetar formulário
  const reset = useCallback(() => {
    setCnpj('')
    setIsValid(false)
    setShowCostModal(false)
    setIsLoading(false)
    setCompany(null)
    setError(null)
  }, [])
  
  return {
    cnpj,
    isValid,
    showCostModal,
    isLoading,
    company,
    error,
    handleCnpjChange,
    handleSearch,
    confirmSearch,
    cancelSearch,
    reset
  }
}
