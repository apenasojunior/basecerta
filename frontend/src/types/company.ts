import type {
  Porte,
  NaturezaJuridica,
  SituacaoCadastral,
  FaixaFaturamento,
  DataAberturaRange,
} from "@/constants/company-filters"

/**
 * Interface principal de Empresa (Pessoa Jurídica)
 */
export interface Company {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  dataAbertura: string
  uf: string
  municipio: string
  porte: Porte
  naturezaJuridica: NaturezaJuridica
  situacaoCadastral: SituacaoCadastral
  inscricaoEstadual?: string
  email?: string
  telefone?: string
  faturamentoAnual?: number
  numeroFuncionarios?: number
  createdAt: string
  updatedAt: string
}

/**
 * Dados resumidos para exibição na tabela
 */
export interface CompanyTableData {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  uf: string
  municipio: string
  situacaoCadastral: SituacaoCadastral
  porte: Porte
}

/**
 * Filtros para busca de empresas
 */
export interface CompanySearchFilters {
  uf?: string
  porte?: Porte
  naturezaJuridica?: NaturezaJuridica
  situacaoCadastral?: SituacaoCadastral
  faixaFaturamento?: FaixaFaturamento
  dataAbertura?: DataAberturaRange
}

/**
 * Resultado de busca paginado
 */
export interface CompanySearchResult {
  data: Company[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}
