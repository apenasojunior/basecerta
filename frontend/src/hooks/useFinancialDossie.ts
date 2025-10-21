"use client"

import { useQuery } from "@tanstack/react-query"
import { getFinancialDossieByCPF, getFinancialDossieByCNPJ } from "@/lib/api/endpoints/financial"

/**
 * Hook para buscar dossiê financeiro por CPF (Pessoa Física)
 * 
 * @param cpf - CPF da pessoa (com ou sem formatação)
 * @param enabled - Se a query deve ser executada automaticamente
 */
export function useFinancialDossieCPF(cpf: string, enabled = true) {
  return useQuery({
    queryKey: ["financial-dossie", "cpf", cpf],
    queryFn: () => getFinancialDossieByCPF(cpf),
    enabled: enabled && !!cpf && cpf.replace(/\D/g, "").length === 11,
    staleTime: 10 * 60 * 1000, // 10 minutos (dados mais sensíveis)
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook para buscar dossiê financeiro por CNPJ (Pessoa Jurídica)
 * 
 * @param cnpj - CNPJ da empresa (com ou sem formatação)
 * @param enabled - Se a query deve ser executada automaticamente
 */
export function useFinancialDossieCNPJ(cnpj: string, enabled = true) {
  return useQuery({
    queryKey: ["financial-dossie", "cnpj", cnpj],
    queryFn: () => getFinancialDossieByCNPJ(cnpj),
    enabled: enabled && !!cnpj && cnpj.replace(/\D/g, "").length === 14,
    staleTime: 10 * 60 * 1000, // 10 minutos (dados mais sensíveis)
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
