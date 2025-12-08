/**
 * Smart CNPJ 360° API Service
 * Issue 2.2.3 - Service Layer
 * 
 * Service layer para integração com endpoints do Smart CNPJ 360°
 * Baseado nos tipos definidos em @/types/smart-cnpj
 */

import { apiClient } from '../client'
import type {
  SmartCNPJCompanyAPI,
  SmartCNPJSearchResponse,
  SmartCNPJBulkSearchRequest,
  SmartCNPJHistoricoResponse,
  SmartCNPJEstatisticas,
  TipoBusca,
  SmartCNPJFiltros,
} from '@/types/smart-cnpj'
import type { ApiResponse, ApiError } from '@/types/api'

// ================================================================
// TIPOS AUXILIARES
// ================================================================

/**
 * Opções para export de dados
 */
export interface SmartCNPJExportOptions {
  format: 'csv' | 'xlsx' | 'json'
  cnpjs?: string[]
  includeFields?: string[]
  excludeFields?: string[]
}

/**
 * Response de export
 */
export interface SmartCNPJExportResponse {
  downloadUrl: string
  fileName: string
  fileSize: number
  expiresAt: string
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

// ================================================================
// SERVICE CLASS
// ================================================================

/**
 * Service para gerenciar operações do Smart CNPJ 360°
 */
class SmartCNPJService {
  private readonly basePath = '/smart-cnpj'

  // ================================================================
  // BUSCA POR CNPJ ÚNICO
  // ================================================================

  /**
   * Busca empresa por CNPJ específico
   * 
   * Endpoint: GET /api/v1/smart-cnpj/{cnpj}
   * 
   * @param cnpj - CNPJ da empresa (com ou sem formatação)
   * @returns Dados completos da empresa
   * 
   * @example
   * ```typescript
   * const empresa = await smartCNPJService.getByCNPJ('33.345.748/0001-85')
   * console.log(empresa.razaoSocial)
   * ```
   */
  async getByCNPJ(cnpj: string): Promise<SmartCNPJCompanyAPI> {
    try {
      // Remove formatação do CNPJ
      const cleanCNPJ = cnpj.replace(/\D/g, '')

      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ inválido. Deve conter 14 dígitos.')
      }

      // Backend GET /{cnpj} retorna diretamente o objeto (não wrapped em ApiResponse)
      // apiClient.get() retorna response.data do Axios, que já é o objeto da empresa
      const company = await apiClient.get<SmartCNPJCompanyAPI>(
        `${this.basePath}/${cleanCNPJ}`
      ) as any as SmartCNPJCompanyAPI

      if (!company || !company.cnpj) {
        throw new Error('Dados da empresa não encontrados')
      }

      return company
    } catch (error) {
      this.handleError(error, 'Erro ao buscar empresa por CNPJ')
      throw error
    }
  }

  // ================================================================
  // BUSCA EM LOTE (BULK SEARCH)
  // ================================================================

  /**
   * Busca avançada com múltiplos filtros e paginação
   * 
   * Endpoint: POST /api/v1/smart-cnpj/bulk
   * 
   * @param request - Parâmetros de busca
   * @returns Resultado paginado com empresas
   * 
   * @example
   * ```typescript
   * const resultado = await smartCNPJService.bulkSearch({
   *   tipo_busca: 'razao_social',
   *   valor_busca: 'TECNOLOGIA',
   *   filtros: { uf: 'SP', porte: 'ME' },
   *   page: 1,
   *   limit: 20
   * })
   * console.log(`Encontradas ${resultado.pagination.total} empresas`)
   * ```
   */
  async bulkSearch(
    request: SmartCNPJBulkSearchRequest
  ): Promise<SmartCNPJSearchResponse> {
    try {
      // Validação básica
      if (!request.tipo_busca || !request.valor_busca) {
        throw new Error('Tipo de busca e valor são obrigatórios')
      }

      console.log('[SmartCNPJService] Request payload:', request)
      
      // Backend POST /search retorna { data: [...], pagination: {...}, ... }
      // apiClient.post() retorna response.data do Axios
      const response = await apiClient.post<SmartCNPJSearchResponse>(
        `${this.basePath}/search`,
        request
      ) as any as SmartCNPJSearchResponse

      console.log('[SmartCNPJService] Response da API:', response)

      if (!response || !response.data) {
        throw new Error('Resposta inválida do servidor')
      }

      return response
    } catch (error) {
      this.handleError(error, 'Erro ao realizar busca em lote')
      throw error
    }
  }

  /**
   * Busca simplificada (wrapper do bulkSearch)
   * 
   * @param tipoBusca - Tipo de busca
   * @param valorBusca - Valor a buscar
   * @param filtros - Filtros opcionais
   * @param pagination - Paginação
   * @returns Resultado da busca
   * 
   * @example
   * ```typescript
   * const empresas = await smartCNPJService.search(
   *   'cnpj',
   *   '33345748',
   *   { uf: 'SP' },
   *   { page: 1, limit: 10 }
   * )
   * ```
   */
  async search(
    tipoBusca: TipoBusca,
    valorBusca: string,
    filtros?: SmartCNPJFiltros,
    pagination?: PaginationParams
  ): Promise<SmartCNPJSearchResponse> {
    // Limpar valor de busca conforme o tipo
    let valorLimpo = valorBusca.trim()
    
    if (tipoBusca === 'cnpj') {
      // Remove formatação do CNPJ (pontos, barras, hífens)
      valorLimpo = valorBusca.replace(/[^\d]/g, '')
      console.log('[SmartCNPJService] CNPJ limpo:', valorBusca, '->', valorLimpo)
    }
    
    return this.bulkSearch({
      tipo_busca: tipoBusca,
      valor_busca: valorLimpo,
      filtros,
      page: pagination?.page || 1,
      limit: pagination?.limit || 20,
    })
  }

  // ================================================================
  // HISTÓRICO DE BUSCAS
  // ================================================================

  /**
   * Obtém histórico de buscas realizadas
   * 
   * Endpoint: GET /api/v1/smart-cnpj/historico
   * 
   * @param pagination - Parâmetros de paginação
   * @returns Histórico paginado
   * 
   * @example
   * ```typescript
   * const historico = await smartCNPJService.getHistorico({ page: 1, limit: 50 })
   * console.log(`Total de buscas: ${historico.pagination.total}`)
   * ```
   */
  async getHistorico(
    pagination?: PaginationParams
  ): Promise<SmartCNPJHistoricoResponse> {
    try {
      const params = {
        page: pagination?.page || 1,
        limit: pagination?.limit || 20,
      }

      // apiClient.get() retorna response.data do Axios
      const response = await apiClient.get<SmartCNPJHistoricoResponse>(
        `${this.basePath}/historico`,
        params
      ) as any as SmartCNPJHistoricoResponse

      if (!response || !response.data) {
        throw new Error('Histórico não encontrado')
      }

      return response
    } catch (error) {
      this.handleError(error, 'Erro ao buscar histórico')
      throw error
    }
  }

  /**
   * Limpa histórico de buscas
   * 
   * Endpoint: DELETE /api/v1/smart-cnpj/historico
   * 
   * @returns Confirmação da operação
   * 
   * @example
   * ```typescript
   * await smartCNPJService.clearHistorico()
   * ```
   */
  async clearHistorico(): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}/historico`)
    } catch (error) {
      this.handleError(error, 'Erro ao limpar histórico')
      throw error
    }
  }

  // ================================================================
  // ESTATÍSTICAS
  // ================================================================

  /**
   * Obtém estatísticas de uso do Smart CNPJ
   * 
   * Endpoint: GET /api/v1/smart-cnpj/estatisticas
   * 
   * @returns Estatísticas de uso
   * 
   * @example
   * ```typescript
   * const stats = await smartCNPJService.getEstatisticas()
   * console.log(`Total de buscas: ${stats.total_buscas}`)
   * console.log(`Tempo médio: ${stats.tempo_medio_resposta}ms`)
   * ```
   */
  async getEstatisticas(): Promise<SmartCNPJEstatisticas> {
    try {
      // apiClient.get() retorna response.data do Axios
      const response = await apiClient.get<SmartCNPJEstatisticas>(
        `${this.basePath}/estatisticas`
      ) as any as SmartCNPJEstatisticas

      if (!response) {
        throw new Error('Estatísticas não encontradas')
      }

      return response
    } catch (error) {
      this.handleError(error, 'Erro ao buscar estatísticas')
      throw error
    }
  }

  // ================================================================
  // EXPORT DE DADOS
  // ================================================================

  /**
   * Exporta dados de empresas em diferentes formatos
   * 
   * Endpoint: POST /api/v1/smart-cnpj/export
   * 
   * @param options - Opções de exportação
   * @returns URL para download do arquivo
   * 
   * @example
   * ```typescript
   * const exportData = await smartCNPJService.exportData({
   *   format: 'xlsx',
   *   cnpjs: ['33345748000185', '12345678000190'],
   *   includeFields: ['cnpj', 'razaoSocial', 'nomeFantasia']
   * })
   * window.open(exportData.downloadUrl, '_blank')
   * ```
   */
  async exportData(
    options: SmartCNPJExportOptions
  ): Promise<SmartCNPJExportResponse> {
    try {
      // Validação
      if (!['csv', 'xlsx', 'json'].includes(options.format)) {
        throw new Error('Formato inválido. Use: csv, xlsx ou json')
      }

      // apiClient.post() retorna response.data do Axios
      const response = await apiClient.post<SmartCNPJExportResponse>(
        `${this.basePath}/export`,
        options
      ) as any as SmartCNPJExportResponse

      if (!response || !response.downloadUrl) {
        throw new Error('Erro ao gerar arquivo de exportação')
      }

      return response
    } catch (error) {
      this.handleError(error, 'Erro ao exportar dados')
      throw error
    }
  }

  /**
   * Download direto de arquivo de exportação
   * 
   * @param options - Opções de exportação
   * @param filename - Nome do arquivo (opcional)
   * 
   * @example
   * ```typescript
   * await smartCNPJService.downloadExport({
   *   format: 'csv',
   *   cnpjs: ['33345748000185']
   * }, 'empresas.csv')
   * ```
   */
  async downloadExport(
    options: SmartCNPJExportOptions,
    filename?: string
  ): Promise<void> {
    try {
      const exportData = await this.exportData(options)

      // Criar link temporário para download
      const link = document.createElement('a')
      link.href = exportData.downloadUrl
      link.download = filename || exportData.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      this.handleError(error, 'Erro ao realizar download')
      throw error
    }
  }

  // ================================================================
  // VALIDAÇÕES E UTILITIES
  // ================================================================

  /**
   * Valida formato de CNPJ
   * 
   * @param cnpj - CNPJ a validar
   * @returns true se válido
   * 
   * @example
   * ```typescript
   * if (smartCNPJService.validateCNPJ('33.345.748/0001-85')) {
   *   // CNPJ válido
   * }
   * ```
   */
  validateCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/\D/g, '')

    // Verifica tamanho
    if (cleanCNPJ.length !== 14) {
      return false
    }

    // Verifica se não são todos dígitos iguais
    if (/^(\d)\1+$/.test(cleanCNPJ)) {
      return false
    }

    // Validação de dígitos verificadores
    let sum = 0
    let weight = 2

    // Primeiro dígito
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }

    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

    if (parseInt(cleanCNPJ.charAt(12)) !== digit1) {
      return false
    }

    // Segundo dígito
    sum = 0
    weight = 2

    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }

    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

    return parseInt(cleanCNPJ.charAt(13)) === digit2
  }

  /**
   * Formata CNPJ com máscara
   * 
   * @param cnpj - CNPJ sem formatação
   * @returns CNPJ formatado (XX.XXX.XXX/XXXX-XX)
   * 
   * @example
   * ```typescript
   * const formatted = smartCNPJService.formatCNPJ('33345748000185')
   * // '33.345.748/0001-85'
   * ```
   */
  formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/\D/g, '')

    if (cleanCNPJ.length !== 14) {
      return cnpj
    }

    return cleanCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    )
  }

  /**
   * Remove formatação do CNPJ
   * 
   * @param cnpj - CNPJ com formatação
   * @returns CNPJ apenas com números
   * 
   * @example
   * ```typescript
   * const clean = smartCNPJService.cleanCNPJ('33.345.748/0001-85')
   * // '33345748000185'
   * ```
   */
  cleanCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '')
  }

  // ================================================================
  // ERROR HANDLING
  // ================================================================

  /**
   * Trata erros de forma padronizada
   * 
   * @param error - Erro capturado
   * @param context - Contexto do erro
   */
  private handleError(error: any, context: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[SmartCNPJService] ${context}:`, error)
    }

    // Se for um ApiError, já está formatado
    if (this.isApiError(error)) {
      return
    }

    // Se for um Error padrão, lançar com contexto
    if (error instanceof Error) {
      throw new Error(`${context}: ${error.message}`)
    }

    // Erro desconhecido
    throw new Error(`${context}: Erro desconhecido`)
  }

  /**
   * Verifica se é um ApiError
   */
  private isApiError(error: any): error is ApiError {
    return (
      error &&
      typeof error === 'object' &&
      'success' in error &&
      error.success === false
    )
  }
}

// ================================================================
// EXPORT SINGLETON
// ================================================================

/**
 * Instância única do service (singleton)
 */
export const smartCNPJService = new SmartCNPJService()

// Exportar classe para testes
export { SmartCNPJService }
