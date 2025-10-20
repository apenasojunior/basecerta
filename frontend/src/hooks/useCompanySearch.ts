"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "@/lib/toast"
import type { CompanyData } from "@/components/produtos/CompanyTable"
import type { CompanyFilters } from "@/components/produtos/AdvancedFilters"

interface SearchParams {
  searchType: "CNPJ" | "RAZAO_SOCIAL" | "NOME_FANTASIA"
  searchValue: string
  filters?: CompanyFilters
}

interface SearchResponse {
  data: CompanyData[]
  total: number
  page: number
  pageSize: number
}

const MOCK_RESPONSE: SearchResponse = {
  data: [
    {
      cnpj: "12345678000190",
      razaoSocial: "EMPRESA EXEMPLO LTDA",
      nomeFantasia: "Empresa Exemplo",
      situacao: "ATIVA",
      porte: "ME",
      uf: "SP",
      municipio: "São Paulo",
    },
    {
      cnpj: "98765432000123",
      razaoSocial: "COMERCIO DE PRODUTOS TECNOLOGICOS LTDA",
      nomeFantasia: "Tech Store",
      situacao: "ATIVA",
      porte: "EPP",
      uf: "RJ",
      municipio: "Rio de Janeiro",
    },
    {
      cnpj: "11223344000155",
      razaoSocial: "SERVICOS PROFISSIONAIS LTDA",
      situacao: "SUSPENSA",
      porte: "MEDIA",
      uf: "MG",
      municipio: "Belo Horizonte",
    },
  ],
  total: 3,
  page: 1,
  pageSize: 20,
}

/**
 * Hook para buscar empresas
 * Por enquanto usa mock data, mas está preparado para integração real
 */
export function useCompanySearch() {
  const queryClient = useQueryClient()

  const searchMutation = useMutation({
    mutationFn: async (params: SearchParams): Promise<SearchResponse> => {
      // Simula delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Substituir por chamada real à API quando backend estiver pronto
      // const response = await api.products.searchCompanies({
      //   user_id: 1, // Mock user ID
      //   search_type: params.searchType,
      //   search_value: params.searchValue,
      //   situacao: params.filters?.situacao,
      //   porte: params.filters?.porte,
      //   uf: params.filters?.uf,
      //   cnae: params.filters?.cnae,
      // })

      // Por enquanto retorna mock data
      console.log("Buscando com params:", params)
      return MOCK_RESPONSE
    },
    onSuccess: (data) => {
      toast.success(`${data.total} empresa(s) encontrada(s)!`)
      // Invalida cache de buscas anteriores
      queryClient.invalidateQueries({ queryKey: ["company-search"] })
    },
    onError: (error: any) => {
      console.error("Erro na busca:", error)
      toast.error(error?.message || "Erro ao buscar empresas. Tente novamente.")
    },
  })

  return {
    search: searchMutation.mutate,
    searchAsync: searchMutation.mutateAsync,
    data: searchMutation.data,
    isLoading: searchMutation.isPending,
    isError: searchMutation.isError,
    error: searchMutation.error,
    isSuccess: searchMutation.isSuccess,
    reset: searchMutation.reset,
  }
}

/**
 * Hook para obter detalhes de uma empresa específica
 */
export function useCompanyDetails(cnpj: string | null) {
  return useQuery({
    queryKey: ["company-details", cnpj],
    queryFn: async (): Promise<CompanyData | null> => {
      if (!cnpj) return null

      // Simula delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Substituir por chamada real à API
      // const response = await api.products.getCompanyDetails({
      //   user_id: 1,
      //   cnpj: cnpj,
      // })

      // Mock data
      return {
        cnpj,
        razaoSocial: "EMPRESA DETALHADA LTDA",
        nomeFantasia: "Empresa Detalhada",
        situacao: "ATIVA",
        porte: "EPP",
        uf: "SP",
        municipio: "São Paulo",
        dataAbertura: "2020-01-15",
      }
    },
    enabled: !!cnpj,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
  })
}

/**
 * Hook para histórico de buscas do usuário
 */
export function useSearchHistory(userId: number = 1) {
  return useQuery({
    queryKey: ["search-history", userId],
    queryFn: async () => {
      // TODO: Implementar quando backend tiver endpoint
      // const response = await api.products.getSearchHistory(userId)
      
      // Mock data
      return [
        {
          id: 1,
          searchType: "CNPJ",
          searchValue: "12345678000190",
          createdAt: new Date().toISOString(),
          resultsCount: 1,
        },
        {
          id: 2,
          searchType: "RAZAO_SOCIAL",
          searchValue: "EMPRESA EXEMPLO",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          resultsCount: 3,
        },
      ]
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

/**
 * Hook para estatísticas de uso
 */
export function useCompanySearchStats(userId: number = 1) {
  return useQuery({
    queryKey: ["company-search-stats", userId],
    queryFn: async () => {
      // TODO: Implementar quando backend tiver endpoint
      
      // Mock data
      return {
        totalSearches: 45,
        totalCompaniesFound: 128,
        averageResultsPerSearch: 2.8,
        lastSearchDate: new Date().toISOString(),
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
