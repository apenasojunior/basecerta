/**
 * Mock Data - Sistema de Créditos e Planos
 */

export interface CreditTransaction {
  id: string
  date: string
  type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS'
  description: string
  credits: number
  product?: string
  documentSearched?: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
}

export interface Plan {
  id: string
  name: string
  description: string
  credits: number
  price: number
  pricePerCredit: number
  features: string[]
  popular?: boolean
  recommended?: boolean
  savings?: string
}

export interface Package {
  id: string
  name: string
  credits: number
  price: number
  pricePerCredit: number
  bonus?: number
  popular?: boolean
}

export interface CreditBalance {
  userId: number
  currentBalance: number
  totalPurchased: number
  totalUsed: number
  totalRefunded: number
  lastPurchaseDate?: string
  currentPlan?: string
  planRenewalDate?: string
}

// Mock de saldo de créditos
export const mockCreditBalance: CreditBalance = {
  userId: 1,
  currentBalance: 847,
  totalPurchased: 1500,
  totalUsed: 653,
  totalRefunded: 0,
  lastPurchaseDate: '2025-10-15T10:30:00Z',
  currentPlan: 'Profissional',
  planRenewalDate: '2025-11-15'
}

// Mock de histórico de transações
export const mockTransactions: CreditTransaction[] = [
  {
    id: 'tx-001',
    date: '2025-10-23T14:30:00Z',
    type: 'USAGE',
    description: 'Dados 360° PJ',
    credits: -12,
    product: 'Dados 360° - Pessoa Jurídica',
    documentSearched: '12.345.678/0001-90',
    status: 'COMPLETED'
  },
  {
    id: 'tx-002',
    date: '2025-10-23T10:15:00Z',
    type: 'USAGE',
    description: 'Radar Jurídico PF',
    credits: -20,
    product: 'Radar Jurídico - Pessoa Física',
    documentSearched: '123.456.789-00',
    status: 'COMPLETED'
  },
  {
    id: 'tx-003',
    date: '2025-10-22T16:45:00Z',
    type: 'USAGE',
    description: 'Smart CNPJ - Consulta Detalhada',
    credits: -5,
    product: 'Smart CNPJ 360°',
    documentSearched: '98.765.432/0001-10',
    status: 'COMPLETED'
  },
  {
    id: 'tx-004',
    date: '2025-10-20T11:20:00Z',
    type: 'USAGE',
    description: 'Dados 360° PF',
    credits: -8,
    product: 'Dados 360° - Pessoa Física',
    documentSearched: '987.654.321-00',
    status: 'COMPLETED'
  },
  {
    id: 'tx-005',
    date: '2025-10-15T10:30:00Z',
    type: 'PURCHASE',
    description: 'Plano Profissional - Recarga Mensal',
    credits: 500,
    status: 'COMPLETED'
  },
  {
    id: 'tx-006',
    date: '2025-10-14T15:10:00Z',
    type: 'USAGE',
    description: 'Radar Jurídico PJ',
    credits: -20,
    product: 'Radar Jurídico - Pessoa Jurídica',
    documentSearched: '11.222.333/0001-44',
    status: 'COMPLETED'
  },
  {
    id: 'tx-007',
    date: '2025-10-12T09:30:00Z',
    type: 'BONUS',
    description: 'Bônus de Indicação',
    credits: 50,
    status: 'COMPLETED'
  },
  {
    id: 'tx-008',
    date: '2025-10-10T14:00:00Z',
    type: 'USAGE',
    description: 'Dados 360° PJ',
    credits: -12,
    product: 'Dados 360° - Pessoa Jurídica',
    documentSearched: '55.666.777/0001-88',
    status: 'COMPLETED'
  },
  {
    id: 'tx-009',
    date: '2025-10-08T11:45:00Z',
    type: 'USAGE',
    description: 'Score de Crédito',
    credits: -15,
    product: 'Radar Financeiro - Score de Crédito',
    documentSearched: '111.222.333-44',
    status: 'COMPLETED'
  },
  {
    id: 'tx-010',
    date: '2025-10-05T16:20:00Z',
    type: 'USAGE',
    description: 'Análise de Risco',
    credits: -25,
    product: 'Radar Financeiro - Análise de Risco',
    documentSearched: '22.333.444/0001-55',
    status: 'COMPLETED'
  }
]

// Mock de planos de assinatura
export const mockPlans: Plan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    description: 'Ideal para começar a usar a plataforma',
    credits: 100,
    price: 99.90,
    pricePerCredit: 0.999,
    features: [
      '100 créditos mensais',
      'Acesso a todos os produtos',
      'Suporte por email',
      'Histórico 30 dias',
      '20 exportações mensais (PDF/TXT/CSV/Excel)'
    ]
  },
  {
    id: 'plan-professional',
    name: 'Profissional',
    description: 'Para profissionais que fazem consultas frequentes',
    credits: 500,
    price: 399.90,
    pricePerCredit: 0.799,
    features: [
      '500 créditos mensais',
      'Acesso a todos os produtos',
      'Suporte prioritário',
      'Histórico ilimitado',
      '50 exportações mensais (PDF/TXT/CSV/Excel)',
      'Alertas personalizados'
    ],
    popular: true,
    savings: '20% de economia'
  },
  {
    id: 'plan-business',
    name: 'Business',
    description: 'Para empresas com alto volume de consultas',
    credits: 1500,
    price: 999.90,
    pricePerCredit: 0.666,
    features: [
      '1.500 créditos mensais',
      'Acesso a todos os produtos',
      'Suporte dedicado 24/7',
      'Histórico ilimitado',
      '100 exportações mensais (PDF/TXT/CSV/Excel)',
      'Alertas personalizados',
      'Múltiplos usuários (até 5)',
      'Relatórios customizados',
      'Treinamento incluso'
    ],
    recommended: true,
    savings: '33% de economia'
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'Solução completa para grandes corporações',
    credits: 5000,
    price: 2999.90,
    pricePerCredit: 0.599,
    features: [
      '5.000 créditos mensais',
      'Acesso a todos os produtos',
      'Suporte dedicado 24/7',
      'Histórico ilimitado',
      '500 exportações mensais (PDF/TXT/CSV/Excel)',
      'API de integração ilimitada',
      'Alertas personalizados',
      'Usuários ilimitados',
      'Relatórios customizados',
      'Treinamento e consultoria',
      'SLA garantido',
      'Gerente de conta dedicado'
    ],
    savings: '40% de economia'
  }
]

// Mock de pacotes avulsos
export const mockPackages: Package[] = [
  {
    id: 'pack-50',
    name: 'Pacote Inicial',
    credits: 50,
    price: 59.90,
    pricePerCredit: 1.198
  },
  {
    id: 'pack-100',
    name: 'Pacote Básico',
    credits: 100,
    price: 109.90,
    pricePerCredit: 1.099,
    popular: true
  },
  {
    id: 'pack-250',
    name: 'Pacote Plus',
    credits: 250,
    price: 249.90,
    pricePerCredit: 0.999,
    bonus: 25
  },
  {
    id: 'pack-500',
    name: 'Pacote Premium',
    credits: 500,
    price: 449.90,
    pricePerCredit: 0.899,
    bonus: 50
  },
  {
    id: 'pack-1000',
    name: 'Pacote Mega',
    credits: 1000,
    price: 799.90,
    pricePerCredit: 0.799,
    bonus: 100
  },
  {
    id: 'pack-2500',
    name: 'Pacote Ultra',
    credits: 2500,
    price: 1749.90,
    pricePerCredit: 0.699,
    bonus: 300
  }
]

// Estatísticas de uso por produto
export interface ProductUsage {
  product: string
  usageCount: number
  creditsUsed: number
  percentage: number
}

export const mockProductUsage: ProductUsage[] = [
  {
    product: 'Dados 360° PJ',
    usageCount: 28,
    creditsUsed: 336,
    percentage: 51
  },
  {
    product: 'Radar Jurídico PF',
    usageCount: 12,
    creditsUsed: 240,
    percentage: 37
  },
  {
    product: 'Smart CNPJ 360°',
    usageCount: 8,
    creditsUsed: 40,
    percentage: 6
  },
  {
    product: 'Dados 360° PF',
    usageCount: 3,
    creditsUsed: 24,
    percentage: 4
  },
  {
    product: 'Radar Financeiro',
    usageCount: 1,
    creditsUsed: 13,
    percentage: 2
  }
]

// Histórico de uso mensal (últimos 6 meses)
export interface MonthlyUsage {
  month: string
  credits: number
  purchases: number
}

export const mockMonthlyUsage: MonthlyUsage[] = [
  { month: 'Mai', credits: 95, purchases: 0 },
  { month: 'Jun', credits: 142, purchases: 100 },
  { month: 'Jul', credits: 178, purchases: 200 },
  { month: 'Ago', credits: 201, purchases: 250 },
  { month: 'Set', credits: 189, purchases: 200 },
  { month: 'Out', credits: 148, purchases: 500 }
]
