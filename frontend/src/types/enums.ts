/**
 * Enums para tipos de dados do BaseCerta
 */

/**
 * Tipos de planos disponíveis
 */
export enum PlanType {
  BASIC = 'basic',
  SMART = 'smart',
  PRO = 'pro',
  EMPRESARIAL = 'empresarial',
}

/**
 * Tipos de transações de créditos
 */
export enum TransactionType {
  PURCHASE = 'purchase',           // Compra de créditos
  DEDUCTION = 'deduction',          // Dedução por uso
  REFUND = 'refund',                // Estorno
  BONUS = 'bonus',                  // Bônus/Crédito promocional
  SUBSCRIPTION = 'subscription',    // Créditos de assinatura
}

/**
 * Status de transações
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Tipos de pesquisas/produtos
 */
export enum ProductType {
  DADOS_EMPRESAS = 'dados_empresas',
  DADOS_CADASTRAIS_PF = 'dados_cadastrais_pf',
  DADOS_CADASTRAIS_PJ = 'dados_cadastrais_pj',
  DOSSIE_FINANCEIRO = 'dossie_financeiro',
  PESQUISA_JURIDICA = 'pesquisa_juridica',
  SCORE_CREDITO = 'score_credito',
  PROTESTOS = 'protestos',
  CADIN = 'cadin',
  ANTIFRAUDE_PIX = 'antifraude_pix',
}

/**
 * Níveis de custo de produtos
 */
export enum ProductCostLevel {
  BASIC = 'basic',      // Até 50 créditos
  ADVANCED = 'advanced', // Até 30 créditos
  ULTRA = 'ultra',      // Até 25 créditos
}

/**
 * Roles de usuário
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * Status de usuário
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/**
 * Status de pagamento
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Métodos de pagamento
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PIX = 'pix',
  BOLETO = 'boleto',
  DEBIT_CARD = 'debit_card',
}
