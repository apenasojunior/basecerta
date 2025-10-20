import {
  PlanType,
  TransactionType,
  TransactionStatus,
  ProductType,
  ProductCostLevel,
  UserRole,
  UserStatus,
  PaymentStatus,
  PaymentMethod,
} from './enums'

/**
 * Entidade: Usuário
 */
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  created_at: string
  updated_at: string
  email_verified?: boolean
  phone?: string
}

/**
 * Entidade: Plano
 */
export interface Plan {
  id: number
  name: string
  type: PlanType
  description: string
  price: number
  credits_included: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Entidade: Pacote de Créditos
 */
export interface CreditPackage {
  id: number
  name: string
  description: string
  price: number
  credits_amount: number
  basic_limit?: number      // Limite para pesquisas básicas
  advanced_limit?: number   // Limite para pesquisas avançadas
  ultra_limit?: number      // Limite para pesquisas ultra
  is_active: boolean
  discount_percentage?: number
  created_at: string
  updated_at: string
}

/**
 * Entidade: Saldo de Créditos do Usuário
 */
export interface UserCredits {
  id: number
  user_id: number
  balance: number
  total_purchased: number
  total_spent: number
  last_updated: string
  created_at: string
  updated_at: string
}

/**
 * Entidade: Transação de Créditos
 */
export interface CreditTransaction {
  id: number
  user_id: number
  type: TransactionType
  amount: number
  balance_before: number
  balance_after: number
  description: string
  status: TransactionStatus
  product_type?: ProductType
  reference_id?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Entidade: Pesquisa/Consulta
 */
export interface SearchQuery {
  id: number
  user_id: number
  product_type: ProductType
  query_params: Record<string, any>
  credits_cost: number
  result_data?: Record<string, any>
  status: 'pending' | 'completed' | 'failed'
  error_message?: string
  created_at: string
  completed_at?: string
}

/**
 * Entidade: Pagamento
 */
export interface Payment {
  id: number
  user_id: number
  amount: number
  status: PaymentStatus
  payment_method: PaymentMethod
  transaction_id?: string
  package_id?: number
  plan_id?: number
  credits_amount?: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  completed_at?: string
}

/**
 * Entidade: Assinatura
 */
export interface Subscription {
  id: number
  user_id: number
  plan_id: number
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  start_date: string
  end_date?: string
  next_billing_date?: string
  auto_renew: boolean
  created_at: string
  updated_at: string
  cancelled_at?: string
}

/**
 * Entidade: Empresa (dados básicos)
 */
export interface Company {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  natureza_juridica?: string
  porte?: string
  situacao_cadastral: string
  data_abertura?: string
  capital_social?: number
  cnae_principal?: string
  tipo?: 'matriz' | 'filial'
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  telefone?: string
  email?: string
}

/**
 * Entidade: Log de Auditoria (para Sprint 12)
 */
export interface AuditLog {
  id: number
  user_id: number
  action: string
  resource: string
  resource_id?: string
  details?: Record<string, any>
  ip_address: string
  user_agent: string
  status: 'success' | 'fail'
  created_at: string
}
