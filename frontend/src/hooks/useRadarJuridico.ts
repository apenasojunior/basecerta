/**
 * Hook useRadarJuridico
 * Gerencia busca de processos jurídicos por CPF/CNPJ
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseRadarJuridicoReturn {
  cpfCnpj: string
  setCpfCnpj: (value: string) => void
  isValid: boolean
  isSearching: boolean
  showCostModal: boolean
  handleSearch: () => void
  confirmSearch: () => void
  cancelSearch: () => void
}

export function useRadarJuridico(tipo: 'PF' | 'PJ' = 'PF'): UseRadarJuridicoReturn {
  const router = useRouter()
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showCostModal, setShowCostModal] = useState(false)

  // Validação CPF (dígitos verificadores)
  const validateCPF = useCallback((cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '')
    
    if (cleanCPF.length !== 11) return false
    if (/^(\d)\1+$/.test(cleanCPF)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleanCPF.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cleanCPF.charAt(10))) return false

    return true
  }, [])

  // Validação CNPJ (dígitos verificadores)
  const validateCNPJ = useCallback((cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    
    if (cleanCNPJ.length !== 14) return false
    if (/^(\d)\1+$/.test(cleanCNPJ)) return false

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i]
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (digit !== parseInt(cleanCNPJ.charAt(12))) return false

    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i]
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (digit !== parseInt(cleanCNPJ.charAt(13))) return false

    return true
  }, [])

  // Atualizar CPF/CNPJ e validar
  const handleSetCpfCnpj = useCallback((value: string) => {
    setCpfCnpj(value)
    
    const cleanValue = value.replace(/\D/g, '')
    if (tipo === 'PF') {
      setIsValid(validateCPF(value))
    } else {
      setIsValid(validateCNPJ(value))
    }
  }, [tipo, validateCPF, validateCNPJ])

  // Iniciar busca (mostrar modal de confirmação)
  const handleSearch = useCallback(() => {
    if (!isValid) return
    setShowCostModal(true)
  }, [isValid])

  // Confirmar busca e redirecionar
  const confirmSearch = useCallback(() => {
    setShowCostModal(false)
    setIsSearching(true)

    // Simular delay de busca
    setTimeout(() => {
      const cleanValue = cpfCnpj.replace(/\D/g, '')
      const route = tipo === 'PF' 
        ? `/radar-juridico/pf/${cleanValue}`
        : `/radar-juridico/pj/${cleanValue}`
      
      router.push(route)
      setIsSearching(false)
    }, 800)
  }, [cpfCnpj, tipo, router])

  // Cancelar busca
  const cancelSearch = useCallback(() => {
    setShowCostModal(false)
  }, [])

  return {
    cpfCnpj,
    setCpfCnpj: handleSetCpfCnpj,
    isValid,
    isSearching,
    showCostModal,
    handleSearch,
    confirmSearch,
    cancelSearch
  }
}
