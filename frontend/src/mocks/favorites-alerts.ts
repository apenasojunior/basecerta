/**
 * Mock Data - Favoritos e Alertas
 */

export interface Favorite {
  id: string
  type: 'PF' | 'PJ'
  document: string
  name: string
  addedAt: string
  lastUpdated?: string
  tags?: string[]
  notes?: string
}

export interface Alert {
  id: string
  type: 'PF' | 'PJ'
  document: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'TRIGGERED'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  monitoringTypes: string[]
  createdAt: string
  lastCheck?: string
  lastTrigger?: string
  triggerCount: number
  notifications: {
    email: boolean
    push: boolean
  }
}

export interface AlertTrigger {
  id: string
  alertId: string
  document: string
  name: string
  triggerType: string
  description: string
  triggeredAt: string
  viewed: boolean
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

// Mock de Favoritos PF
export const mockFavoritesPF: Favorite[] = [
  {
    id: 'fav-pf-001',
    type: 'PF',
    document: '111.444.777-35',
    name: 'João Silva Santos',
    addedAt: '2025-10-20T10:30:00Z',
    lastUpdated: '2025-10-23T14:20:00Z',
    tags: ['Cliente', 'Parceiro'],
    notes: 'Cliente VIP - Acompanhar processos mensalmente'
  },
  {
    id: 'fav-pf-002',
    type: 'PF',
    document: '222.555.888-46',
    name: 'Maria Oliveira Costa',
    addedAt: '2025-10-18T15:45:00Z',
    lastUpdated: '2025-10-22T09:10:00Z',
    tags: ['Fornecedor']
  },
  {
    id: 'fav-pf-003',
    type: 'PF',
    document: '333.666.999-57',
    name: 'Pedro Henrique Souza',
    addedAt: '2025-10-15T08:20:00Z',
    tags: ['Candidato', 'RH'],
    notes: 'Verificar background antes de contratação'
  },
  {
    id: 'fav-pf-004',
    type: 'PF',
    document: '444.777.000-68',
    name: 'Ana Paula Lima',
    addedAt: '2025-10-10T11:30:00Z',
    lastUpdated: '2025-10-20T16:45:00Z',
    tags: ['Monitoramento']
  },
  {
    id: 'fav-pf-005',
    type: 'PF',
    document: '555.888.111-79',
    name: 'Carlos Eduardo Ferreira',
    addedAt: '2025-10-05T14:15:00Z',
    tags: ['Parceiro', 'Investidor']
  }
]

// Mock de Favoritos PJ
export const mockFavoritesPJ: Favorite[] = [
  {
    id: 'fav-pj-001',
    type: 'PJ',
    document: '10.000.001/0001-90',
    name: 'Tech Solutions Ltda',
    addedAt: '2025-10-22T09:00:00Z',
    lastUpdated: '2025-10-23T11:30:00Z',
    tags: ['Fornecedor', 'TI'],
    notes: 'Fornecedor de software - Renovação contrato em Nov/2025'
  },
  {
    id: 'fav-pj-002',
    type: 'PJ',
    document: '20.000.002/0001-81',
    name: 'Comercial Brasil S.A.',
    addedAt: '2025-10-19T14:20:00Z',
    tags: ['Cliente', 'Distribuidor']
  },
  {
    id: 'fav-pj-003',
    type: 'PJ',
    document: '30.000.003/0001-72',
    name: 'Indústria Moderna Ltda',
    addedAt: '2025-10-15T10:45:00Z',
    lastUpdated: '2025-10-21T15:20:00Z',
    tags: ['Parceiro', 'Produção'],
    notes: 'Parceiro estratégico - Monitorar saúde financeira'
  },
  {
    id: 'fav-pj-004',
    type: 'PJ',
    document: '40.000.004/0001-63',
    name: 'Serviços Digitais ME',
    addedAt: '2025-10-12T16:30:00Z',
    tags: ['Prestador']
  },
  {
    id: 'fav-pj-005',
    type: 'PJ',
    document: '50.000.005/0001-54',
    name: 'Transportadora Veloz Ltda',
    addedAt: '2025-10-08T08:15:00Z',
    tags: ['Logística', 'Fornecedor']
  }
]

// Mock de Alertas Ativos
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'PF',
    document: '111.444.777-35',
    name: 'João Silva Santos',
    status: 'ACTIVE',
    frequency: 'WEEKLY',
    monitoringTypes: ['Processos Jurídicos', 'Restrições Financeiras', 'Dados Cadastrais'],
    createdAt: '2025-10-15T10:00:00Z',
    lastCheck: '2025-10-23T08:00:00Z',
    lastTrigger: '2025-10-20T14:30:00Z',
    triggerCount: 3,
    notifications: {
      email: true,
      push: true
    }
  },
  {
    id: 'alert-002',
    type: 'PJ',
    document: '10.000.001/0001-90',
    name: 'Tech Solutions Ltda',
    status: 'ACTIVE',
    frequency: 'DAILY',
    monitoringTypes: ['Processos Jurídicos', 'Situação Cadastral', 'Sócios'],
    createdAt: '2025-10-18T14:30:00Z',
    lastCheck: '2025-10-23T10:00:00Z',
    triggerCount: 0,
    notifications: {
      email: true,
      push: false
    }
  },
  {
    id: 'alert-003',
    type: 'PJ',
    document: '30.000.003/0001-72',
    name: 'Indústria Moderna Ltda',
    status: 'TRIGGERED',
    frequency: 'WEEKLY',
    monitoringTypes: ['Processos Jurídicos', 'Restrições Financeiras', 'Protestos'],
    createdAt: '2025-10-10T09:00:00Z',
    lastCheck: '2025-10-23T08:00:00Z',
    lastTrigger: '2025-10-23T08:15:00Z',
    triggerCount: 5,
    notifications: {
      email: true,
      push: true
    }
  },
  {
    id: 'alert-004',
    type: 'PF',
    document: '222.555.888-46',
    name: 'Maria Oliveira Costa',
    status: 'PAUSED',
    frequency: 'MONTHLY',
    monitoringTypes: ['Processos Jurídicos'],
    createdAt: '2025-10-05T11:20:00Z',
    lastCheck: '2025-10-15T08:00:00Z',
    lastTrigger: '2025-10-12T16:45:00Z',
    triggerCount: 1,
    notifications: {
      email: false,
      push: false
    }
  },
  {
    id: 'alert-005',
    type: 'PJ',
    document: '40.000.004/0001-63',
    name: 'Serviços Digitais ME',
    status: 'ACTIVE',
    frequency: 'WEEKLY',
    monitoringTypes: ['Situação Cadastral', 'Dados Cadastrais'],
    createdAt: '2025-10-12T15:30:00Z',
    lastCheck: '2025-10-22T08:00:00Z',
    triggerCount: 0,
    notifications: {
      email: true,
      push: true
    }
  }
]

// Mock de Disparos de Alerta (Histórico)
export const mockAlertTriggers: AlertTrigger[] = [
  {
    id: 'trigger-001',
    alertId: 'alert-003',
    document: '30.000.003/0001-72',
    name: 'Indústria Moderna Ltda',
    triggerType: 'Novo Processo Judicial',
    description: 'Novo processo trabalhista identificado: 0001234-56.2025.5.02.0000',
    triggeredAt: '2025-10-23T08:15:00Z',
    viewed: false,
    severity: 'HIGH'
  },
  {
    id: 'trigger-002',
    alertId: 'alert-001',
    document: '111.444.777-35',
    name: 'João Silva Santos',
    triggerType: 'Restrição Financeira',
    description: 'Nova restrição identificada no Serasa: Protesto no valor de R$ 5.430,00',
    triggeredAt: '2025-10-20T14:30:00Z',
    viewed: true,
    severity: 'CRITICAL'
  },
  {
    id: 'trigger-003',
    alertId: 'alert-001',
    document: '111.444.777-35',
    name: 'João Silva Santos',
    triggerType: 'Atualização Cadastral',
    description: 'Alteração de endereço residencial detectada',
    triggeredAt: '2025-10-18T11:20:00Z',
    viewed: true,
    severity: 'LOW'
  },
  {
    id: 'trigger-004',
    alertId: 'alert-003',
    document: '30.000.003/0001-72',
    name: 'Indústria Moderna Ltda',
    triggerType: 'Novo Protesto',
    description: 'Protesto registrado no valor de R$ 127.500,00',
    triggeredAt: '2025-10-19T16:45:00Z',
    viewed: true,
    severity: 'HIGH'
  },
  {
    id: 'trigger-005',
    alertId: 'alert-004',
    document: '222.555.888-46',
    name: 'Maria Oliveira Costa',
    triggerType: 'Novo Processo Judicial',
    description: 'Novo processo cível identificado: 0009876-54.2025.8.26.0100',
    triggeredAt: '2025-10-12T16:45:00Z',
    viewed: true,
    severity: 'MEDIUM'
  },
  {
    id: 'trigger-006',
    alertId: 'alert-001',
    document: '111.444.777-35',
    name: 'João Silva Santos',
    triggerType: 'Processo Atualizado',
    description: 'Sentença publicada em processo 0012345-67.2024.8.26.0100',
    triggeredAt: '2025-10-15T09:30:00Z',
    viewed: true,
    severity: 'MEDIUM'
  }
]

// Estatísticas
export const favoriteStats = {
  totalPF: mockFavoritesPF.length,
  totalPJ: mockFavoritesPJ.length,
  total: mockFavoritesPF.length + mockFavoritesPJ.length,
  addedThisMonth: 7,
  updatedToday: 2
}

export const alertStats = {
  active: mockAlerts.filter(a => a.status === 'ACTIVE').length,
  paused: mockAlerts.filter(a => a.status === 'PAUSED').length,
  triggered: mockAlerts.filter(a => a.status === 'TRIGGERED').length,
  total: mockAlerts.length,
  unviewedTriggers: mockAlertTriggers.filter(t => !t.viewed).length,
  totalTriggers: mockAlertTriggers.length
}
