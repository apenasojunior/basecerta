/**
 * Tipos para requisições e respostas da API
 */

import {
  User,
  Plan,
  CreditPackage,
  UserCredits,
  CreditTransaction,
  SearchQuery,
  Payment,
  Subscription,
  Company,
} from './entities'

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

/**
 * Parâmetros de paginação
 */
export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Filtros de busca de empresas
 */
export interface CompanySearchFilters {
  situacao_cadastral?: string[]
  tipo?: 'matriz' | 'filial'
  porte?: string[]
  capital_social_min?: number
  capital_social_max?: number
  opcao_mei?: boolean
  opcao_simples?: boolean
  data_abertura_inicio?: string
  data_abertura_fim?: string
  uf?: string
  municipio?: string
}

/**
 * Request: Busca de empresas
 */
export interface CompanySearchRequest extends PaginationParams {
  query?: string           // CNPJ, Razão Social, etc.
  search_type?: 'cnpj' | 'razao_social' | 'segmento' | 'email' | 'telefone' | 'socio' | 'cep'
  filters?: CompanySearchFilters
}

/**
 * Request: Adicionar créditos
 */
export interface AddCreditsRequest {
  user_id: number
  amount: number
  description?: string
  package_id?: number
}

/**
 * Request: Deduzir créditos
 */
export interface DeductCreditsRequest {
  user_id: number
  amount: number
  product_type: string
  description: string
  reference_id?: string
}

/**
 * Request: Criar pesquisa
 */
export interface CreateSearchRequest {
  product_type: string
  query_params: Record<string, any>
}

/**
 * Request: Criar pagamento
 */
export interface CreatePaymentRequest {
  package_id?: number
  plan_id?: number
  payment_method: string
  return_url?: string
}

/**
 * Response: Saldo de créditos
 */
export interface CreditsBalanceResponse {
  balance: number
  total_purchased: number
  total_spent: number
  last_transaction?: CreditTransaction
}

/**
 * Response: Histórico de créditos
 */
export interface CreditsHistoryResponse extends PaginatedResponse<CreditTransaction> {}

/**
 * Response: Estatísticas do Dashboard
 */
export interface DashboardStatsResponse {
  credits: {
    balance: number
    total_spent_today: number
    total_spent_week: number
    total_spent_month: number
  }
  searches: {
    total_today: number
    total_week: number
    total_month: number
    total_all: number
  }
  recent_activity: SearchQuery[]
  popular_products: {
    product_type: string
    count: number
    total_credits: number
  }[]
}

/**
 * Response: Lista de planos
 */
export interface PlansResponse {
  plans: Plan[]
}

/**
 * Response: Lista de pacotes
 */
export interface PackagesResponse {
  packages: CreditPackage[]
}

/**
 * Response: Perfil do usuário
 */
export interface UserProfileResponse {
  user: User
  credits: UserCredits
  subscription?: Subscription
}

/**
 * Request: Atualizar perfil
 */
export interface UpdateProfileRequest {
  name?: string
  phone?: string
  avatar_url?: string
}

/**
 * Request: Alterar senha
 */
export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

/**
 * Tipos de erro da API
 */
export interface ApiError {
  success: false
  error: string
  message?: string
  details?: any
  status_code?: number
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  services: {
    database: 'ok' | 'error'
    redis: 'ok' | 'error'
    celery: 'ok' | 'error'
  }
}
