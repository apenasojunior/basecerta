/**
 * Mock Data: Smart CNPJ 360°
 * 100 empresas fictícias para desenvolvimento frontend
 */

export interface SmartCNPJCompany {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  situacaoCadastral: 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA'
  tipo: 'MATRIZ' | 'FILIAL'
  porte: 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE'
  capitalSocial: number
  isMEI: boolean
  isSimplesNacional: boolean
  formaTributacao: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'
  dataAbertura: string
  cnaesPrimario: {
    codigo: string
    descricao: string
  }
  cnaesSecundarios: Array<{
    codigo: string
    descricao: string
  }>
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    municipio: string
    uf: string
  }
  contatos: {
    email?: string
    telefone?: string
  }
  socios: Array<{
    nome: string
    cpfCnpj: string
    qualificacao: string
    dataEntrada: string
  }>
}

// Helpers para gerar dados
const situacoes: SmartCNPJCompany['situacaoCadastral'][] = ['ATIVA', 'ATIVA', 'ATIVA', 'ATIVA', 'SUSPENSA', 'INAPTA', 'BAIXADA']
const portes: SmartCNPJCompany['porte'][] = ['MEI', 'ME', 'ME', 'EPP', 'EPP', 'MEDIO', 'GRANDE']
const formasTributacao: SmartCNPJCompany['formaTributacao'][] = ['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL']
const ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'DF', 'GO', 'ES', 'PA', 'MA', 'AM', 'MT', 'MS', 'PB', 'RN', 'AL']

const cnaes = [
  { codigo: '6201-5/00', descricao: 'Desenvolvimento de programas de computador sob encomenda' },
  { codigo: '6202-3/00', descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis' },
  { codigo: '6203-1/00', descricao: 'Desenvolvimento e licenciamento de programas de computador não customizáveis' },
  { codigo: '4711-3/01', descricao: 'Comércio varejista de mercadorias em geral' },
  { codigo: '4712-1/00', descricao: 'Comércio varejista de mercadorias em lojas de conveniência' },
  { codigo: '5611-2/01', descricao: 'Restaurantes e similares' },
  { codigo: '5620-1/01', descricao: 'Fornecimento de alimentos preparados preponderantemente para empresas' },
  { codigo: '4520-0/01', descricao: 'Serviços de manutenção e reparação mecânica de veículos automotores' },
  { codigo: '4530-7/03', descricao: 'Comércio a varejo de peças e acessórios novos para veículos automotores' },
  { codigo: '8599-6/04', descricao: 'Treinamento em desenvolvimento profissional e gerencial' },
  { codigo: '8211-3/00', descricao: 'Serviços combinados de escritório e apoio administrativo' },
  { codigo: '7020-4/00', descricao: 'Atividades de consultoria em gestão empresarial' },
  { codigo: '4221-9/01', descricao: 'Construção de redes de abastecimento de água' },
  { codigo: '4313-4/00', descricao: 'Obras de terraplenagem' },
  { codigo: '8630-5/02', descricao: 'Atividades de serviços de complementação diagnóstica e terapêutica' },
  { codigo: '8630-5/03', descricao: 'Serviços de diagnóstico por imagem sem uso de radiação ionizante' },
  { codigo: '1091-1/01', descricao: 'Fabricação de produtos de panificação industrial' },
  { codigo: '1091-1/02', descricao: 'Fabricação de produtos de padaria e confeitaria com predominância de produção própria' },
  { codigo: '2330-3/01', descricao: 'Fabricação de estruturas pré-moldadas de concreto armado' },
  { codigo: '2342-7/01', descricao: 'Fabricação de artefatos de cerâmica e barro cozido para uso na construção' },
]

const razoesSociais = [
  'ACME TECNOLOGIA', 'BETA SOLUÇÕES', 'GAMMA SISTEMAS', 'DELTA INOVAÇÃO', 'EPSILON SOFTWARE',
  'COMERCIAL SILVA E SILVA', 'PADARIA E CONFEITARIA PÃES & CIA', 'RESTAURANTE BOM SABOR',
  'AUTO MECÂNICA RÁPIDA', 'CONSTRUTORA FUNDAÇÕES LTDA', 'CLÍNICA MÉDICA SÃO LUCAS',
  'FARMÁCIA POPULAR', 'SUPERMERCADO BONS PREÇOS', 'LOJA DE ROUPAS FASHION STORE',
  'CONSULTORIA EMPRESARIAL PRO', 'ESCOLA DE IDIOMAS GLOBAL', 'ACADEMIA FITNESS TOTAL',
  'TRANSPORTADORA ENTREGAS RÁPIDAS', 'GRÁFICA IMPRESSA CERTA', 'ADVOCACIA JUSTIÇA & LEI',
]

const nomesFantasia = [
  'Tech Solutions', 'Beta Dev', 'Gamma Code', 'Delta Lab', 'Epsilon Apps',
  'Silva & Silva', 'Pães & Cia', 'Bom Sabor', 'Auto Rápida', 'Fundações',
  'Clínica São Lucas', 'Farmácia Popular', 'Bons Preços', 'Fashion Store',
  'Pro Consultoria', 'Global School', 'Fitness Total', 'Entregas Rápidas',
  'Impressa Certa', 'Advocacia JL',
]

const municipios = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba',
  'Florianópolis', 'Salvador', 'Recife', 'Fortaleza', 'Brasília', 'Goiânia',
  'Vitória', 'Belém', 'São Luís', 'Manaus', 'Cuiabá', 'Campo Grande',
  'João Pessoa', 'Natal', 'Maceió', 'Campinas', 'Santos', 'Guarulhos',
  'Niterói', 'Juiz de Fora', 'Caxias do Sul', 'Londrina', 'Joinville',
]

const nomesSocios = [
  'João Silva Santos', 'Maria Oliveira Costa', 'Pedro Henrique Almeida', 'Ana Paula Rodrigues',
  'Carlos Eduardo Ferreira', 'Juliana Martins Lima', 'Roberto Carlos Souza', 'Fernanda Silva Rocha',
  'Lucas Gabriel Pereira', 'Camila Vitória Ribeiro', 'Rafael Augusto Dias', 'Mariana Santos Costa',
  'Bruno Henrique Oliveira', 'Larissa Fernandes Silva', 'Thiago Rodrigues Alves', 'Beatriz Costa Lima',
  'Felipe Santos Martins', 'Amanda Oliveira Souza', 'Diego Almeida Ferreira', 'Gabriela Rocha Santos',
]

const qualificacoes = [
  'Sócio-Administrador',
  'Sócio',
  'Sócio Quotista',
  'Administrador',
  'Diretor',
]

function generateCNPJ(): string {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  const base = String(rand(10000000, 99999999)) + String(rand(1000, 9999))
  const digits = base.split('').map(Number)
  
  // Cálculo simplificado (não é validação real, apenas gera formato)
  const d1 = rand(0, 9)
  const d2 = rand(0, 9)
  
  const cnpj = base + d1 + d2
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

function generateCPF(): string {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  const base = String(rand(100000000, 999999999))
  const d1 = rand(0, 9)
  const d2 = rand(0, 9)
  const cpf = base + d1 + d2
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

function generateCEP(): string {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  const cep = String(rand(10000, 99999)) + String(rand(100, 999))
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Gerar 100 empresas
export const mockCompanies: SmartCNPJCompany[] = Array.from({ length: 100 }, (_, index) => {
  const isMatriz = Math.random() > 0.3
  const porte = randomElement(portes)
  const isMEI = porte === 'MEI'
  const situacao = randomElement(situacoes)
  const uf = randomElement(ufs)
  const municipio = randomElement(municipios)
  const cnae = randomElement(cnaes)
  const razaoBase = randomElement(razoesSociais)
  const nomeFantasia = randomElement(nomesFantasia)
  
  const capitalRanges = {
    MEI: [1000, 81000],
    ME: [10000, 360000],
    EPP: [360000, 4800000],
    MEDIO: [4800000, 20000000],
    GRANDE: [20000000, 100000000],
  }
  
  const [minCapital, maxCapital] = capitalRanges[porte]
  const capitalSocial = Math.floor(Math.random() * (maxCapital - minCapital + 1)) + minCapital
  
  const numSocios = Math.floor(Math.random() * 3) + 1 // 1 a 3 sócios
  const socios = Array.from({ length: numSocios }, () => ({
    nome: randomElement(nomesSocios),
    cpfCnpj: generateCPF(),
    qualificacao: randomElement(qualificacoes),
    dataEntrada: randomDate(new Date(2010, 0, 1), new Date(2023, 11, 31)),
  }))
  
  const numCnaesSecundarios = Math.floor(Math.random() * 4) // 0 a 3 CNAEs secundários
  const cnaesSecundarios = randomElements(
    cnaes.filter(c => c.codigo !== cnae.codigo),
    numCnaesSecundarios
  )

  return {
    id: `company-${index + 1}`,
    cnpj: generateCNPJ(),
    razaoSocial: `${razaoBase} ${isMatriz ? 'LTDA' : 'FILIAL ' + Math.floor(Math.random() * 99 + 1)}`,
    nomeFantasia: nomeFantasia + (isMatriz ? '' : ` - ${municipio}`),
    situacaoCadastral: situacao,
    tipo: isMatriz ? 'MATRIZ' : 'FILIAL',
    porte,
    capitalSocial,
    isMEI,
    isSimplesNacional: porte === 'MEI' || porte === 'ME' || porte === 'EPP' ? Math.random() > 0.3 : false,
    formaTributacao: isMEI ? 'SIMPLES_NACIONAL' : randomElement(formasTributacao),
    dataAbertura: randomDate(new Date(2000, 0, 1), new Date(2024, 9, 1)),
    cnaesPrimario: cnae,
    cnaesSecundarios,
    endereco: {
      cep: generateCEP(),
      logradouro: `Rua ${randomElement(['das Flores', 'dos Pinheiros', 'da Consolação', 'Paulista', 'Augusta', 'Vergueiro', 'da República', 'São João', 'Barão de Itapetininga', 'Brigadeiro Luis Antônio'])}`,
      numero: String(Math.floor(Math.random() * 2000) + 1),
      complemento: Math.random() > 0.7 ? `Sala ${Math.floor(Math.random() * 200) + 1}` : undefined,
      bairro: randomElement(['Centro', 'Jardins', 'Vila Mariana', 'Pinheiros', 'Moema', 'Itaim Bibi', 'Consolação', 'Liberdade', 'Bela Vista', 'Santa Cecília']),
      municipio,
      uf,
    },
    contatos: {
      email: Math.random() > 0.2 ? `contato@${nomeFantasia.toLowerCase().replace(/\s+/g, '')}.com.br` : undefined,
      telefone: Math.random() > 0.3 ? `(${Math.floor(Math.random() * 89) + 11}) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
    },
    socios,
  }
})

// Funções auxiliares para filtros
export function searchCompanies(query: {
  type: 'cnpj' | 'razaoSocial' | 'segmento' | 'email' | 'telefone' | 'nomeSocio' | 'cep'
  value: string
}): SmartCNPJCompany[] {
  const { type, value } = query
  const lowerValue = value.toLowerCase()

  return mockCompanies.filter((company) => {
    switch (type) {
      case 'cnpj':
        return company.cnpj.includes(value)
      case 'razaoSocial':
        return company.razaoSocial.toLowerCase().includes(lowerValue) ||
               company.nomeFantasia.toLowerCase().includes(lowerValue)
      case 'segmento':
        return company.cnaesPrimario.descricao.toLowerCase().includes(lowerValue) ||
               company.cnaesSecundarios.some(cnae => cnae.descricao.toLowerCase().includes(lowerValue))
      case 'email':
        return company.contatos.email?.toLowerCase().includes(lowerValue) ?? false
      case 'telefone':
        return company.contatos.telefone?.includes(value) ?? false
      case 'nomeSocio':
        return company.socios.some(socio => socio.nome.toLowerCase().includes(lowerValue))
      case 'cep':
        return company.endereco.cep.includes(value)
      default:
        return false
    }
  })
}

export function filterCompanies(
  companies: SmartCNPJCompany[],
  filters: {
    situacaoCadastral?: string[]
    tipo?: 'MATRIZ' | 'FILIAL'
    porte?: string[]
    capitalSocialMin?: number
    capitalSocialMax?: number
    isMEI?: boolean
    isSimplesNacional?: boolean
    formaTributacao?: string
    dataAberturaStart?: string
    dataAberturaEnd?: string
  }
): SmartCNPJCompany[] {
  return companies.filter((company) => {
    // Filtro: Situação Cadastral
    if (filters.situacaoCadastral && filters.situacaoCadastral.length > 0) {
      if (!filters.situacaoCadastral.includes(company.situacaoCadastral)) {
        return false
      }
    }

    // Filtro: Tipo (Matriz/Filial)
    if (filters.tipo && company.tipo !== filters.tipo) {
      return false
    }

    // Filtro: Porte
    if (filters.porte && filters.porte.length > 0) {
      if (!filters.porte.includes(company.porte)) {
        return false
      }
    }

    // Filtro: Capital Social
    if (filters.capitalSocialMin !== undefined && company.capitalSocial < filters.capitalSocialMin) {
      return false
    }
    if (filters.capitalSocialMax !== undefined && company.capitalSocial > filters.capitalSocialMax) {
      return false
    }

    // Filtro: MEI
    if (filters.isMEI !== undefined && company.isMEI !== filters.isMEI) {
      return false
    }

    // Filtro: Simples Nacional
    if (filters.isSimplesNacional !== undefined && company.isSimplesNacional !== filters.isSimplesNacional) {
      return false
    }

    // Filtro: Forma de Tributação
    if (filters.formaTributacao && company.formaTributacao !== filters.formaTributacao) {
      return false
    }

    // Filtro: Data de Abertura
    if (filters.dataAberturaStart && company.dataAbertura < filters.dataAberturaStart) {
      return false
    }
    if (filters.dataAberturaEnd && company.dataAbertura > filters.dataAberturaEnd) {
      return false
    }

    return true
  })
}

export function getCompanyByCNPJ(cnpj: string): SmartCNPJCompany | undefined {
  // Remove formatting to match both formatted and unformatted CNPJs
  const cleanCnpj = cnpj.replace(/[.\-\/]/g, '')
  return mockCompanies.find(company => {
    const cleanCompanyCnpj = company.cnpj.replace(/[.\-\/]/g, '')
    return cleanCompanyCnpj === cleanCnpj
  })
}

// Dados para autocomplete e selects
export const segmentoOptions = Array.from(
  new Set(cnaes.map(cnae => cnae.descricao))
).sort()

export const situacaoCadastralOptions = [
  { value: 'ATIVA', label: 'Ativa' },
  { value: 'SUSPENSA', label: 'Suspensa' },
  { value: 'INAPTA', label: 'Inapta' },
  { value: 'BAIXADA', label: 'Baixada' },
  { value: 'NULA', label: 'Nula' },
]

export const porteOptions = [
  { value: 'MEI', label: 'MEI' },
  { value: 'ME', label: 'Microempresa' },
  { value: 'EPP', label: 'Pequeno Porte' },
  { value: 'MEDIO', label: 'Médio Porte' },
  { value: 'GRANDE', label: 'Grande Porte' },
]

export const formaTributacaoOptions = [
  { value: 'SIMPLES_NACIONAL', label: 'Simples Nacional' },
  { value: 'LUCRO_PRESUMIDO', label: 'Lucro Presumido' },
  { value: 'LUCRO_REAL', label: 'Lucro Real' },
]
