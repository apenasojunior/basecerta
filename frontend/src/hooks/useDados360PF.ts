import { useState, useCallback } from 'react'
import {
  Dados360PFPerson,
  searchPersonByCPF,
  validateCPF,
} from '@/mocks/dados360-pf'

export interface UseDados360PFReturn {
  // Search state
  cpf: string
  setCpf: (cpf: string) => void
  isSearching: boolean
  hasSearched: boolean
  
  // Validation
  cpfError: string | null
  isValidCPF: boolean
  
  // Cost confirmation
  showCostModal: boolean
  setShowCostModal: (show: boolean) => void
  costCredits: number
  
  // Result
  person: Dados360PFPerson | null
  notFound: boolean
  
  // Actions
  handleSearch: () => void
  confirmSearch: () => Promise<void>
  cancelSearch: () => void
  reset: () => void
}

export function useDados360PF(): UseDados360PFReturn {
  // Search state
  const [cpf, setCpf] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Validation
  const [cpfError, setCpfError] = useState<string | null>(null)
  
  // Cost confirmation
  const [showCostModal, setShowCostModal] = useState(false)
  const costCredits = 8
  
  // Result
  const [person, setPerson] = useState<Dados360PFPerson | null>(null)
  const [notFound, setNotFound] = useState(false)
  
  // Validate CPF
  const isValidCPF = useCallback(() => {
    if (!cpf) return false
    return validateCPF(cpf)
  }, [cpf])()
  
  // Handle initial search (show confirmation modal)
  const handleSearch = useCallback(() => {
    // Reset previous errors
    setCpfError(null)
    setNotFound(false)
    
    // Validate CPF
    if (!cpf.trim()) {
      setCpfError('CPF é obrigatório')
      return
    }
    
    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido. Verifique os dígitos verificadores.')
      return
    }
    
    // Show cost confirmation modal
    setShowCostModal(true)
  }, [cpf])
  
  // Confirm and execute search
  const confirmSearch = useCallback(async () => {
    setShowCostModal(false)
    setIsSearching(true)
    setCpfError(null)
    setNotFound(false)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Search person
    const foundPerson = searchPersonByCPF(cpf)
    
    if (foundPerson) {
      setPerson(foundPerson)
      setNotFound(false)
    } else {
      setPerson(null)
      setNotFound(true)
    }
    
    setHasSearched(true)
    setIsSearching(false)
  }, [cpf])
  
  // Cancel search
  const cancelSearch = useCallback(() => {
    setShowCostModal(false)
  }, [])
  
  // Reset state
  const reset = useCallback(() => {
    setCpf('')
    setPerson(null)
    setHasSearched(false)
    setIsSearching(false)
    setCpfError(null)
    setNotFound(false)
    setShowCostModal(false)
  }, [])
  
  return {
    // Search state
    cpf,
    setCpf,
    isSearching,
    hasSearched,
    
    // Validation
    cpfError,
    isValidCPF,
    
    // Cost confirmation
    showCostModal,
    setShowCostModal,
    costCredits,
    
    // Result
    person,
    notFound,
    
    // Actions
    handleSearch,
    confirmSearch,
    cancelSearch,
    reset,
  }
}
