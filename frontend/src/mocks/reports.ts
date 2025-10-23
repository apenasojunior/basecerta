/**
 * Mock Data - Relatórios
 */

export interface Report {
  id: string
  name: string
  type: 'CONSOLIDADO' | 'POR_PERIODO' | 'POR_PRODUTO' | 'PERSONALIZADO'
  format: 'PDF' | 'EXCEL' | 'CSV' | 'TXT'
  status: 'GENERATING' | 'READY' | 'FAILED' | 'EXPIRED'
  createdAt: string
  completedAt?: string
  expiresAt?: string
  fileSize?: string
  parameters: {
    startDate?: string
    endDate?: string
    products?: string[]
    documentType?: 'PF' | 'PJ' | 'BOTH'
    includeDetails?: boolean
  }
  generatedBy: string
  downloadCount: number
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'CONSOLIDADO' | 'POR_PERIODO' | 'POR_PRODUTO' | 'PERSONALIZADO'
  icon: string
  estimatedTime: string
  requiredCredits: number
  availableFormats: ('PDF' | 'EXCEL' | 'CSV' | 'TXT')[]
  parameters: {
    name: string
    type: 'date' | 'dateRange' | 'select' | 'multiSelect' | 'boolean'
    required: boolean
    label: string
    options?: string[]
  }[]
}

// Mock de Relatórios Gerados
export const mockReports: Report[] = [
  {
    id: 'rep-001',
    name: 'Relatório Consolidado - Outubro 2025',
    type: 'CONSOLIDADO',
    format: 'PDF',
    status: 'READY',
    createdAt: '2025-10-23T10:30:00Z',
    completedAt: '2025-10-23T10:35:00Z',
    expiresAt: '2025-11-23T10:35:00Z',
    fileSize: '2.4 MB',
    parameters: {
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      documentType: 'BOTH',
      includeDetails: true
    },
    generatedBy: 'João Silva',
    downloadCount: 3
  },
  {
    id: 'rep-002',
    name: 'Consultas PJ - Trimestre Q3',
    type: 'POR_PRODUTO',
    format: 'EXCEL',
    status: 'READY',
    createdAt: '2025-10-20T14:15:00Z',
    completedAt: '2025-10-20T14:18:00Z',
    expiresAt: '2025-11-20T14:18:00Z',
    fileSize: '1.8 MB',
    parameters: {
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      products: ['Dados 360° PJ', 'Radar Jurídico PJ'],
      documentType: 'PJ',
      includeDetails: false
    },
    generatedBy: 'João Silva',
    downloadCount: 5
  },
  {
    id: 'rep-003',
    name: 'Análise Mensal - Setembro',
    type: 'POR_PERIODO',
    format: 'PDF',
    status: 'READY',
    createdAt: '2025-10-15T09:00:00Z',
    completedAt: '2025-10-15T09:03:00Z',
    expiresAt: '2025-11-15T09:03:00Z',
    fileSize: '1.2 MB',
    parameters: {
      startDate: '2025-09-01',
      endDate: '2025-09-30',
      documentType: 'BOTH',
      includeDetails: true
    },
    generatedBy: 'João Silva',
    downloadCount: 2
  },
  {
    id: 'rep-004',
    name: 'Relatório Personalizado - Clientes VIP',
    type: 'PERSONALIZADO',
    format: 'EXCEL',
    status: 'GENERATING',
    createdAt: '2025-10-23T11:45:00Z',
    parameters: {
      startDate: '2025-10-01',
      endDate: '2025-10-23',
      products: ['Smart CNPJ 360°', 'Dados 360° PJ', 'Radar Jurídico PJ', 'Radar Financeiro PJ'],
      documentType: 'PJ',
      includeDetails: true
    },
    generatedBy: 'João Silva',
    downloadCount: 0
  },
  {
    id: 'rep-005',
    name: 'Consultas PF - Última Semana',
    type: 'POR_PERIODO',
    format: 'CSV',
    status: 'READY',
    createdAt: '2025-10-18T16:30:00Z',
    completedAt: '2025-10-18T16:32:00Z',
    expiresAt: '2025-11-18T16:32:00Z',
    fileSize: '450 KB',
    parameters: {
      startDate: '2025-10-11',
      endDate: '2025-10-18',
      documentType: 'PF',
      includeDetails: false
    },
    generatedBy: 'João Silva',
    downloadCount: 1
  },
  {
    id: 'rep-006',
    name: 'Radar Jurídico - Resumo Semestral',
    type: 'POR_PRODUTO',
    format: 'PDF',
    status: 'READY',
    createdAt: '2025-10-10T11:20:00Z',
    completedAt: '2025-10-10T11:25:00Z',
    expiresAt: '2025-11-10T11:25:00Z',
    fileSize: '3.1 MB',
    parameters: {
      startDate: '2025-04-01',
      endDate: '2025-09-30',
      products: ['Radar Jurídico PF', 'Radar Jurídico PJ'],
      documentType: 'BOTH',
      includeDetails: true
    },
    generatedBy: 'João Silva',
    downloadCount: 8
  },
  {
    id: 'rep-007',
    name: 'Exportação TXT - Backup',
    type: 'CONSOLIDADO',
    format: 'TXT',
    status: 'EXPIRED',
    createdAt: '2025-09-15T08:00:00Z',
    completedAt: '2025-09-15T08:02:00Z',
    expiresAt: '2025-10-15T08:02:00Z',
    fileSize: '800 KB',
    parameters: {
      startDate: '2025-08-01',
      endDate: '2025-08-31',
      documentType: 'BOTH',
      includeDetails: false
    },
    generatedBy: 'João Silva',
    downloadCount: 2
  },
  {
    id: 'rep-008',
    name: 'Análise de Risco - Q3 2025',
    type: 'POR_PRODUTO',
    format: 'PDF',
    status: 'FAILED',
    createdAt: '2025-10-12T15:45:00Z',
    parameters: {
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      products: ['Radar Financeiro PF', 'Radar Financeiro PJ'],
      documentType: 'BOTH',
      includeDetails: true
    },
    generatedBy: 'João Silva',
    downloadCount: 0
  }
]

// Templates de Relatórios
export const reportTemplates: ReportTemplate[] = [
  {
    id: 'template-001',
    name: 'Relatório Consolidado',
    description: 'Visão completa de todas as consultas realizadas no período',
    type: 'CONSOLIDADO',
    icon: 'FileText',
    estimatedTime: '5-7 minutos',
    requiredCredits: 50,
    availableFormats: ['PDF', 'EXCEL', 'CSV'],
    parameters: [
      {
        name: 'dateRange',
        type: 'dateRange',
        required: true,
        label: 'Período'
      },
      {
        name: 'documentType',
        type: 'select',
        required: true,
        label: 'Tipo de Documento',
        options: ['Todos', 'Apenas PF', 'Apenas PJ']
      },
      {
        name: 'includeDetails',
        type: 'boolean',
        required: false,
        label: 'Incluir detalhes completos'
      }
    ]
  },
  {
    id: 'template-002',
    name: 'Relatório por Período',
    description: 'Análise temporal das consultas e tendências',
    type: 'POR_PERIODO',
    icon: 'Calendar',
    estimatedTime: '3-5 minutos',
    requiredCredits: 30,
    availableFormats: ['PDF', 'EXCEL'],
    parameters: [
      {
        name: 'dateRange',
        type: 'dateRange',
        required: true,
        label: 'Período de Análise'
      },
      {
        name: 'documentType',
        type: 'select',
        required: true,
        label: 'Tipo de Documento',
        options: ['Todos', 'Apenas PF', 'Apenas PJ']
      }
    ]
  },
  {
    id: 'template-003',
    name: 'Relatório por Produto',
    description: 'Detalhamento por tipo de consulta realizada',
    type: 'POR_PRODUTO',
    icon: 'Package',
    estimatedTime: '4-6 minutos',
    requiredCredits: 40,
    availableFormats: ['PDF', 'EXCEL', 'CSV'],
    parameters: [
      {
        name: 'dateRange',
        type: 'dateRange',
        required: true,
        label: 'Período'
      },
      {
        name: 'products',
        type: 'multiSelect',
        required: true,
        label: 'Produtos',
        options: [
          'Smart CNPJ 360°',
          'Dados 360° PF',
          'Dados 360° PJ',
          'Radar Jurídico PF',
          'Radar Jurídico PJ',
          'Radar Financeiro PF',
          'Radar Financeiro PJ'
        ]
      },
      {
        name: 'includeDetails',
        type: 'boolean',
        required: false,
        label: 'Incluir detalhes por consulta'
      }
    ]
  },
  {
    id: 'template-004',
    name: 'Relatório Personalizado',
    description: 'Configure todos os parâmetros do seu relatório',
    type: 'PERSONALIZADO',
    icon: 'Settings',
    estimatedTime: '7-10 minutos',
    requiredCredits: 75,
    availableFormats: ['PDF', 'EXCEL', 'CSV', 'TXT'],
    parameters: [
      {
        name: 'dateRange',
        type: 'dateRange',
        required: true,
        label: 'Período'
      },
      {
        name: 'products',
        type: 'multiSelect',
        required: true,
        label: 'Produtos',
        options: [
          'Smart CNPJ 360°',
          'Dados 360° PF',
          'Dados 360° PJ',
          'Radar Jurídico PF',
          'Radar Jurídico PJ',
          'Radar Financeiro PF',
          'Radar Financeiro PJ'
        ]
      },
      {
        name: 'documentType',
        type: 'select',
        required: true,
        label: 'Tipo de Documento',
        options: ['Todos', 'Apenas PF', 'Apenas PJ']
      },
      {
        name: 'includeDetails',
        type: 'boolean',
        required: false,
        label: 'Incluir detalhes completos'
      }
    ]
  }
]

// Estatísticas
export const reportStats = {
  total: mockReports.length,
  ready: mockReports.filter(r => r.status === 'READY').length,
  generating: mockReports.filter(r => r.status === 'GENERATING').length,
  failed: mockReports.filter(r => r.status === 'FAILED').length,
  expired: mockReports.filter(r => r.status === 'EXPIRED').length,
  totalDownloads: mockReports.reduce((acc, r) => acc + r.downloadCount, 0),
  totalSize: '10.7 MB',
  thisMonth: mockReports.filter(r => {
    const date = new Date(r.createdAt)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length
}

// Uso de exportações por plano (relacionado com limits de plans)
export const exportUsage = {
  used: 12,
  limit: 50, // Para plano Professional
  period: 'Outubro 2025',
  byFormat: {
    PDF: 6,
    EXCEL: 4,
    CSV: 1,
    TXT: 1
  }
}
