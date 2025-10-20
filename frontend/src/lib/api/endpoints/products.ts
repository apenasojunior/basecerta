import { apiClient } from '../client'
import {
  Company,
  SearchQuery,
  CompanySearchRequest,
  CreateSearchRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

/**
 * Endpoints relacionados a produtos/pesquisas
 */
export const productsApi = {
  /**
   * Buscar empresas (Categoria 1)
   */
  searchCompanies: async (
    params: CompanySearchRequest
  ): Promise<ApiResponse<PaginatedResponse<Company>>> => {
    const response = await apiClient.post<PaginatedResponse<Company>>('/search/companies', params)
    return response as ApiResponse<PaginatedResponse<Company>>
  },

  /**
   * Buscar detalhes de uma empresa por CNPJ
   */
  getCompany: async (cnpj: string): Promise<ApiResponse<Company>> => {
    return apiClient.get<Company>(`/companies/${cnpj}`)
  },

  /**
   * Criar nova pesquisa (genérico)
   */
  createSearch: async (data: CreateSearchRequest): Promise<ApiResponse<SearchQuery>> => {
    return apiClient.post<SearchQuery>('/research', data)
  },

  /**
   * Buscar resultado de uma pesquisa
   */
  getSearchResult: async (searchId: number): Promise<ApiResponse<SearchQuery>> => {
    return apiClient.get<SearchQuery>(`/research/${searchId}`)
  },

  /**
   * Histórico de pesquisas do usuário
   */
  getSearchHistory: async (userId: number): Promise<ApiResponse<SearchQuery[]>> => {
    return apiClient.get<SearchQuery[]>(`/search/history/${userId}`)
  },

  /**
   * Pesquisa de Pessoa Física (Predictus)
   * TODO Sprint 4: Implementar integração completa
   */
  searchPessoaFisica: async (cpf: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/research/pf', { cpf })
  },

  /**
   * Pesquisa de Pessoa Jurídica (Predictus)
   * TODO Sprint 5: Implementar integração completa
   */
  searchPessoaJuridica: async (cnpj: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/research/pj', { cnpj })
  },

  /**
   * Pesquisa Jurídica (Processos)
   * TODO Sprint 6: Implementar integração completa
   */
  searchJudicial: async (cpfOrCnpj: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/research/judicial', { cpf_cnpj: cpfOrCnpj })
  },

  /**
   * Pesquisa de Score de Crédito (DirectData)
   * TODO Sprint 7: Implementar integração completa
   */
  searchCreditScore: async (cpfOrCnpj: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/research/credit/score', { cpf_cnpj: cpfOrCnpj })
  },

  /**
   * Pesquisa de Protestos (DirectData)
   * TODO Sprint 8: Implementar integração completa
   */
  searchProtestos: async (cpfOrCnpj: string, nacional: boolean = true): Promise<ApiResponse<any>> => {
    const endpoint = nacional ? '/research/protestos/nacional' : '/research/protestos/sp'
    return apiClient.post<any>(endpoint, { cpf_cnpj: cpfOrCnpj })
  },

  /**
   * Pesquisa CADIN-SP (DirectData)
   * TODO Sprint 8: Implementar integração completa
   */
  searchCADIN: async (cpfOrCnpj: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/research/cadin', { cpf_cnpj: cpfOrCnpj })
  },

  /**
   * Antifraude PIX (DirectData)
   * TODO Sprint 8: Implementar integração completa
   */
  searchAntifraundePix: async (chavePix: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/research/antifraude-pix', { chave_pix: chavePix })
  },
}
