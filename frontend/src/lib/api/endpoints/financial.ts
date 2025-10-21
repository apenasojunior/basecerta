import { apiClient } from "../client"
import type { FinancialScoreData } from "@/components/produtos/FinancialScoreCards"
import type { ProtestData } from "@/components/produtos/ProtestTable"
import type { DebtData } from "@/components/produtos/DebtTable"

export interface FinancialDossieResponse {
  score: FinancialScoreData
  protestos: ProtestData[]
  dividas: DebtData[]
}

// Mock data - PF
const MOCK_PF_DATA: FinancialDossieResponse = {
  score: {
    creditScore: {
      value: 720,
      lastUpdate: "2025-10-15",
      trend: "up",
    },
    protestos: {
      quantidade: 0,
      valorTotal: 0,
    },
    dividasAtivas: {
      quantidade: 1,
      valorTotal: 15000,
      porTipo: {
        tributaria: 15000,
        previdenciaria: 0,
        fgts: 0,
        trabalhista: 0,
      },
    },
    chequesSemFundo: {
      quantidade: 0,
      periodo: "Últimos 12 meses",
    },
  },
  protestos: [],
  dividas: [
    {
      id: "1",
      orgao: "Receita Federal do Brasil",
      tipo: "TRIBUTARIA",
      valor: 15000,
      data: "2024-03-15",
      status: "PENDENTE",
    },
  ],
}

const MOCK_PF_DATA_2: FinancialDossieResponse = {
  score: {
    creditScore: {
      value: 450,
      lastUpdate: "2025-10-18",
      trend: "down",
    },
    protestos: {
      quantidade: 2,
      valorTotal: 45000,
      ultimaOcorrencia: "2025-09-20",
    },
    dividasAtivas: {
      quantidade: 3,
      valorTotal: 85000,
      porTipo: {
        tributaria: 50000,
        previdenciaria: 25000,
        fgts: 10000,
        trabalhista: 0,
      },
    },
    chequesSemFundo: {
      quantidade: 1,
      periodo: "Últimos 12 meses",
      valorTotal: 5000,
    },
  },
  protestos: [
    {
      id: "1",
      data: "2025-08-10",
      cartorio: "1º Tabelionato de Protesto de São Paulo",
      cidade: "São Paulo",
      uf: "SP",
      valor: 25000,
      status: "ATIVO",
    },
    {
      id: "2",
      data: "2025-09-20",
      cartorio: "2º Tabelionato de Protesto de São Paulo",
      cidade: "São Paulo",
      uf: "SP",
      valor: 20000,
      status: "ATIVO",
    },
  ],
  dividas: [
    {
      id: "1",
      orgao: "Receita Federal do Brasil",
      tipo: "TRIBUTARIA",
      valor: 50000,
      data: "2023-06-15",
      status: "EM_NEGOCIACAO",
    },
    {
      id: "2",
      orgao: "Instituto Nacional do Seguro Social - INSS",
      tipo: "PREVIDENCIARIA",
      valor: 25000,
      data: "2024-01-20",
      status: "PENDENTE",
    },
    {
      id: "3",
      orgao: "Caixa Econômica Federal",
      tipo: "FGTS",
      valor: 10000,
      data: "2024-05-10",
      status: "PARCELADO",
    },
  ],
}

// Mock data - PJ
const MOCK_PJ_DATA: FinancialDossieResponse = {
  score: {
    creditScore: {
      value: 650,
      lastUpdate: "2025-10-16",
      trend: "stable",
    },
    protestos: {
      quantidade: 1,
      valorTotal: 30000,
      ultimaOcorrencia: "2025-07-05",
    },
    dividasAtivas: {
      quantidade: 2,
      valorTotal: 120000,
      porTipo: {
        tributaria: 80000,
        previdenciaria: 40000,
        fgts: 0,
        trabalhista: 0,
      },
    },
    chequesSemFundo: {
      quantidade: 0,
      periodo: "Últimos 12 meses",
    },
  },
  protestos: [
    {
      id: "1",
      data: "2025-07-05",
      cartorio: "1º Tabelionato de Protesto do Rio de Janeiro",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      valor: 30000,
      status: "ATIVO",
    },
  ],
  dividas: [
    {
      id: "1",
      orgao: "Secretaria da Fazenda do Estado de SP",
      tipo: "TRIBUTARIA",
      valor: 80000,
      data: "2023-11-10",
      status: "EM_NEGOCIACAO",
    },
    {
      id: "2",
      orgao: "Receita Federal do Brasil - Contribuições",
      tipo: "PREVIDENCIARIA",
      valor: 40000,
      data: "2024-02-15",
      status: "PARCELADO",
    },
  ],
}

const MOCK_PJ_DATA_2: FinancialDossieResponse = {
  score: {
    creditScore: {
      value: 850,
      lastUpdate: "2025-10-19",
      trend: "up",
    },
    protestos: {
      quantidade: 0,
      valorTotal: 0,
    },
    dividasAtivas: {
      quantidade: 0,
      valorTotal: 0,
    },
    chequesSemFundo: {
      quantidade: 0,
      periodo: "Últimos 12 meses",
    },
  },
  protestos: [],
  dividas: [],
}

/**
 * Busca dossiê financeiro por CPF
 */
export async function getFinancialDossieByCPF(cpf: string): Promise<FinancialDossieResponse> {
  try {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1200))

    // TODO: Substituir por chamada real à API
    // const response = await apiClient.get<FinancialDossieResponse>(`/api/v1/financial/cpf/${cpf}`)
    // return response.data

    // Mock: Alterna entre dois perfis baseado no CPF
    const cleanCPF = cpf.replace(/\D/g, "")
    const lastDigit = parseInt(cleanCPF.slice(-1))
    
    return lastDigit % 2 === 0 ? MOCK_PF_DATA : MOCK_PF_DATA_2
  } catch (error) {
    console.error("Erro ao buscar dossiê financeiro PF:", error)
    throw new Error("Falha ao buscar dossiê financeiro. Tente novamente.")
  }
}

/**
 * Busca dossiê financeiro por CNPJ
 */
export async function getFinancialDossieByCNPJ(cnpj: string): Promise<FinancialDossieResponse> {
  try {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1200))

    // TODO: Substituir por chamada real à API
    // const response = await apiClient.get<FinancialDossieResponse>(`/api/v1/financial/cnpj/${cnpj}`)
    // return response.data

    // Mock: Alterna entre dois perfis baseado no CNPJ
    const cleanCNPJ = cnpj.replace(/\D/g, "")
    const lastDigit = parseInt(cleanCNPJ.slice(-1))
    
    return lastDigit % 2 === 0 ? MOCK_PJ_DATA : MOCK_PJ_DATA_2
  } catch (error) {
    console.error("Erro ao buscar dossiê financeiro PJ:", error)
    throw new Error("Falha ao buscar dossiê financeiro. Tente novamente.")
  }
}
