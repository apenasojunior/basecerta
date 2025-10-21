import { apiClient } from "../client"
import type { CompanyData } from "@/components/produtos/CompanyTable"

// Mock data expandido para demonstração
export const MOCK_COMPANIES: CompanyData[] = [
  {
    cnpj: "12345678000190",
    razaoSocial: "EMPRESA EXEMPLO LTDA",
    nomeFantasia: "Exemplo Corp",
    situacao: "ATIVA",
    porte: "ME",
    uf: "SP",
    municipio: "São Paulo",
    dataAbertura: "2015-03-15",
  },
  {
    cnpj: "98765432000111",
    razaoSocial: "TECNOLOGIA AVANCADA S.A.",
    nomeFantasia: "TechAvançada",
    situacao: "ATIVA",
    porte: "EPP",
    uf: "RJ",
    municipio: "Rio de Janeiro",
    dataAbertura: "2018-07-22",
  },
  {
    cnpj: "45678912000133",
    razaoSocial: "COMERCIO ATACADO LTDA",
    nomeFantasia: "Atacado Express",
    situacao: "SUSPENSA",
    porte: "GRANDE",
    uf: "MG",
    municipio: "Belo Horizonte",
    dataAbertura: "2010-01-10",
  },
  {
    cnpj: "78945612000155",
    razaoSocial: "INDUSTRIA METALURGICA BRASIL S.A.",
    nomeFantasia: "MetalBrasil",
    situacao: "ATIVA",
    porte: "GRANDE",
    uf: "RS",
    municipio: "Porto Alegre",
    dataAbertura: "2005-11-30",
  },
  {
    cnpj: "32165498000177",
    razaoSocial: "SERVICOS TECNOLOGICOS LTDA",
    nomeFantasia: "TechServices",
    situacao: "ATIVA",
    porte: "EPP",
    uf: "SP",
    municipio: "Campinas",
    dataAbertura: "2019-02-14",
  },
  {
    cnpj: "65432198000199",
    razaoSocial: "COMERCIO VAREJISTA DE ELETRONICOS LTDA",
    nomeFantasia: "EletroShop",
    situacao: "INAPTA",
    porte: "ME",
    uf: "BA",
    municipio: "Salvador",
    dataAbertura: "2016-08-05",
  },
  {
    cnpj: "14725836000122",
    razaoSocial: "TRANSPORTADORA NACIONAL S.A.",
    nomeFantasia: "TransNacional",
    situacao: "ATIVA",
    porte: "MEDIA",
    uf: "PR",
    municipio: "Curitiba",
    dataAbertura: "2012-04-18",
  },
  {
    cnpj: "96385274000144",
    razaoSocial: "CONSTRUTORA EDIFICAR LTDA",
    nomeFantasia: "Edificar",
    situacao: "BAIXADA",
    porte: "EPP",
    uf: "SC",
    municipio: "Florianópolis",
    dataAbertura: "2014-09-25",
  },
  {
    cnpj: "85274196000166",
    razaoSocial: "MICROEMPREENDEDOR INDIVIDUAL SILVA",
    nomeFantasia: "Silva MEI",
    situacao: "ATIVA",
    porte: "MEI",
    uf: "CE",
    municipio: "Fortaleza",
    dataAbertura: "2020-06-10",
  },
  {
    cnpj: "74185296000188",
    razaoSocial: "AGROPECUARIA CAMPO VERDE LTDA",
    nomeFantasia: "Campo Verde",
    situacao: "ATIVA",
    porte: "MEDIA",
    uf: "MT",
    municipio: "Cuiabá",
    dataAbertura: "2008-12-03",
  },
]

export interface CompanySearchParams {
  searchType: "cnpj" | "razaoSocial" | "nomeFantasia" | "inscricaoEstadual" | "email" | "telefone"
  searchValue: string
  uf?: string
  porte?: string
  naturezaJuridica?: string
  situacao?: string
  faixaFaturamento?: string
  dataAbertura?: string
}

export interface CompanySearchResponse {
  data: CompanyData[]
  total: number
  page: number
  pageSize: number
}

/**
 * Busca empresas com filtros avançados
 */
export async function searchCompanies(params: CompanySearchParams): Promise<CompanySearchResponse> {
  try {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 800))

    // TODO: Substituir por chamada real à API
    // const response = await apiClient.post<CompanySearchResponse>("/api/v1/companies/search", params)
    // return response.data

    // Mock: Filtra dados baseado nos parâmetros
    let filtered = [...MOCK_COMPANIES]

    // Filtro de busca principal
    const searchLower = params.searchValue.toLowerCase()
    switch (params.searchType) {
      case "cnpj":
        filtered = filtered.filter(c => c.cnpj.includes(params.searchValue.replace(/\D/g, "")))
        break
      case "razaoSocial":
        filtered = filtered.filter(c => c.razaoSocial.toLowerCase().includes(searchLower))
        break
      case "nomeFantasia":
        filtered = filtered.filter(c => c.nomeFantasia?.toLowerCase().includes(searchLower))
        break
      default:
        // Para outros tipos, retorna todos por enquanto
        break
    }

    // Filtros adicionais
    if (params.uf) {
      filtered = filtered.filter(c => c.uf === params.uf)
    }
    if (params.porte) {
      filtered = filtered.filter(c => c.porte === params.porte)
    }
    if (params.situacao) {
      filtered = filtered.filter(c => c.situacao === params.situacao)
    }

    return {
      data: filtered,
      total: filtered.length,
      page: 1,
      pageSize: filtered.length,
    }
  } catch (error) {
    console.error("Erro ao buscar empresas:", error)
    throw new Error("Falha ao buscar empresas. Tente novamente.")
  }
}

/**
 * Busca empresa por CNPJ específico
 */
export async function getCompanyByCNPJ(cnpj: string): Promise<CompanyData | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // TODO: Substituir por chamada real à API
    // const response = await apiClient.get<CompanyData>(`/api/v1/companies/${cnpj}`)
    // return response.data

    const cleanCNPJ = cnpj.replace(/\D/g, "")
    const company = MOCK_COMPANIES.find(c => c.cnpj === cleanCNPJ)
    return company || null
  } catch (error) {
    console.error("Erro ao buscar empresa:", error)
    throw new Error("Falha ao buscar empresa. Tente novamente.")
  }
}
