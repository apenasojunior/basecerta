// Mock Data: Dados 360° PJ (Pessoa Jurídica)
// 50 empresas com dados completos para dossiê expandido

export interface Dados360PJCompany {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  dataAbertura: string
  situacao: 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA'
  tipo: 'MATRIZ' | 'FILIAL'
  porte: 'MEI' | 'ME' | 'EPP' | 'DEMAIS'
  capitalSocial: number
  
  // Tributação
  naturezaJuridica: string
  opcaoSimples: boolean
  opcaoMEI: boolean
  formaTributacao?: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'
  
  // CNAEs
  cnae: {
    codigo: string
    descricao: string
  }
  cnaesSecundarios?: Array<{
    codigo: string
    descricao: string
  }>
  
  // Endereços
  enderecos: Array<{
    tipo: 'MATRIZ' | 'FILIAL' | 'CORRESPONDENCIA'
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cep: string
    municipio: string
    uf: string
    isPrincipal: boolean
  }>
  
  // Contatos
  contatos: {
    emailPrincipal?: string
    emailsSecundarios?: string[]
    telefonePrincipal?: string
    telefonesSecundarios?: string[]
    website?: string
    socialMedia?: {
      linkedin?: string
      instagram?: string
      facebook?: string
      twitter?: string
      youtube?: string
    }
  }
  
  // Sócios/Administradores
  socios: Array<{
    nome: string
    cpfCnpj: string
    qualificacao: string
    dataEntrada: string
    participacao?: number
  }>
  
  // Dívidas e Restrições
  dividas?: {
    totalDividas: number
    dividasAtivas: number
    protestos: number
    chequesSemFundo: number
    acoesCiveis: number
    acoesTrabalho: number
  }
  
  // Histórico de Funcionários
  historicoFuncionarios?: Array<{
    ano: number
    mes: number
    quantidade: number
    folhaPagamento?: number
  }>
  
  // Metadados
  dataConsulta?: string
  custoCreditos: number
}

// Helper: Validar CNPJ
export function validateCNPJ(cnpj: string): boolean {
  // Remove formatação
  const cleanCnpj = cnpj.replace(/[^\d]/g, '')
  
  if (cleanCnpj.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCnpj)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCnpj[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  if (parseInt(cleanCnpj[12]) !== digit1) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  weight = 6
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCnpj[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return parseInt(cleanCnpj[13]) === digit2
}

// Helper: Gerar CNPJ válido
function generateCNPJ(index: number): string {
  // Gerar base do CNPJ (primeiros 8 dígitos: raiz + filial)
  const raiz = String(10000000 + index).padStart(8, '0')
  const filial = '0001' // Sempre matriz para simplificar
  const cnpjBase = raiz + filial
  
  // Calcular dígito verificador 1
  let sum = 0
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpjBase[i]) * weights1[i]
  }
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  // Calcular dígito verificador 2
  const cnpjWithDigit1 = cnpjBase + digit1
  sum = 0
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpjWithDigit1[i]) * weights2[i]
  }
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  const fullCnpj = cnpjWithDigit1 + digit2
  
  // Formatar: 00.000.000/0000-00
  return `${fullCnpj.substring(0, 2)}.${fullCnpj.substring(2, 5)}.${fullCnpj.substring(5, 8)}/${fullCnpj.substring(8, 12)}-${fullCnpj.substring(12, 14)}`
}

// Helper: Gerar CPF válido (para sócios)
function generateCPF(index: number): string {
  const base = String(10000000000 + index).padStart(11, '0')
  const cpf = base.substring(0, 9)
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i)
  }
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  const cpfWithDigit1 = cpf + digit1
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfWithDigit1[i]) * (11 - i)
  }
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return cpfWithDigit1 + digit2
}

// Arrays de dados mock
const razoesSociais = [
  'TECH SOLUTIONS LTDA',
  'COMERCIO DE ALIMENTOS SAO PAULO LTDA',
  'INDUSTRIA E COMERCIO DE MOVEIS LTDA',
  'CONSULTORIA EMPRESARIAL BRASIL LTDA',
  'SERVICOS DE TECNOLOGIA DA INFORMACAO LTDA',
  'DISTRIBUIDORA DE PRODUTOS ELETRONICOS LTDA',
  'CONSTRUTORA E INCORPORADORA LTDA',
  'CLINICA MEDICA E ODONTOLOGICA LTDA',
  'TRANSPORTADORA RAPIDO SEGURO LTDA',
  'RESTAURANTE E LANCHONETE LTDA',
  'ACADEMIA DE GINASTICA E MUSCULACAO LTDA',
  'ESCOLA DE EDUCACAO INFANTIL LTDA',
  'FARMACIA E DROGARIA LTDA',
  'OFICINA MECANICA E ELETRICA LTDA',
  'HOTEL E POUSADA LTDA',
  'AGENCIA DE VIAGENS E TURISMO LTDA',
  'GRAFICA E EDITORA LTDA',
  'PADARIA E CONFEITARIA LTDA',
  'POSTO DE COMBUSTIVEIS LTDA',
  'LAVANDERIA E TINTURARIA LTDA',
  'PETSHOP E CLINICA VETERINARIA LTDA',
  'SALAO DE BELEZA E ESTETICA LTDA',
  'AUTOESCOLA E CENTRO DE FORMACAO LTDA',
  'IMOBILIARIA E CORRETORA LTDA',
  'ESCRITORIO DE CONTABILIDADE LTDA',
  'ADVOCACIA E CONSULTORIA JURIDICA LTDA',
  'CLINICA DE FISIOTERAPIA LTDA',
  'LABORATORIO DE ANALISES CLINICAS LTDA',
  'SUPERMERCADO E MERCEARIA LTDA',
  'LOJA DE ROUPAS E ACESSORIOS LTDA',
]

const nomesFantasia = [
  'TechSolutions',
  'Alimentos SP',
  'Móveis Prime',
  'Consultoria Brasil',
  'TI Solutions',
  'Eletrônicos Plus',
  'Construtora Master',
  'Clínica Saúde Total',
  'Rápido Transportes',
  'Restaurante Bom Sabor',
]

const cnaes = [
  { codigo: '6201-5/00', descricao: 'Desenvolvimento de programas de computador sob encomenda' },
  { codigo: '4711-3/02', descricao: 'Comércio varejista de mercadorias em geral' },
  { codigo: '3101-2/00', descricao: 'Fabricação de móveis com predominância de madeira' },
  { codigo: '7020-4/00', descricao: 'Atividades de consultoria em gestão empresarial' },
  { codigo: '6202-3/00', descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis' },
  { codigo: '4754-7/01', descricao: 'Comércio varejista de móveis' },
  { codigo: '4120-4/00', descricao: 'Construção de edifícios' },
  { codigo: '8630-5/03', descricao: 'Atividade médica ambulatorial com recursos para realização de exames complementares' },
  { codigo: '4930-2/02', descricao: 'Transporte rodoviário de carga' },
  { codigo: '5611-2/01', descricao: 'Restaurantes e similares' },
]

const qualificacoes = [
  'Administrador',
  'Sócio-Administrador',
  'Sócio',
  'Diretor',
  'Presidente',
  'Vice-Presidente',
  'Conselheiro',
  'Procurador',
]

const nomesSocios = [
  'João Silva Santos',
  'Maria Oliveira Costa',
  'Pedro Henrique Souza',
  'Ana Paula Ferreira',
  'Carlos Eduardo Lima',
  'Juliana Rodrigues Alves',
  'Fernando Antonio Martins',
  'Patricia Cristina Ribeiro',
  'Roberto Carlos Pereira',
  'Mariana Beatriz Cardoso',
]

const logradouros = [
  'Rua das Flores',
  'Avenida Paulista',
  'Rua Augusta',
  'Alameda Santos',
  'Rua Oscar Freire',
  'Avenida Brigadeiro Faria Lima',
  'Rua da Consolação',
  'Avenida Rebouças',
  'Rua Haddock Lobo',
  'Alameda Lorena',
]

const bairros = [
  'Centro',
  'Jardins',
  'Vila Mariana',
  'Pinheiros',
  'Moema',
  'Itaim Bibi',
  'Vila Olímpia',
  'Brooklin',
  'Santo Amaro',
  'Tatuapé',
]

const municipios = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Porto Alegre',
  'Salvador',
  'Brasília',
  'Fortaleza',
  'Recife',
  'Campinas',
]

const ufs = ['SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'DF', 'CE', 'PE']

// Gerar 50 empresas
export const mockCompanies: Dados360PJCompany[] = Array.from({ length: 50 }, (_, i) => {
  const cnpj = generateCNPJ(i + 1)
  const razaoSocial = razoesSociais[i % razoesSociais.length] + ` ${Math.floor(i / razoesSociais.length) + 1}`
  const nomeFantasia = i % 3 === 0 ? nomesFantasia[i % nomesFantasia.length] : undefined
  
  const uf = ufs[Math.floor(Math.random() * ufs.length)]
  const municipio = municipios[Math.floor(Math.random() * municipios.length)]
  const bairro = bairros[Math.floor(Math.random() * bairros.length)]
  const logradouro = logradouros[Math.floor(Math.random() * logradouros.length)]
  
  const numSocios = Math.floor(Math.random() * 4) + 1
  const numEnderecos = Math.random() > 0.7 ? 2 : 1
  const numCnaesSecundarios = Math.floor(Math.random() * 3)
  
  // Histórico de funcionários (últimos 12 meses)
  const hoje = new Date()
  const historicoFuncionarios = Array.from({ length: 12 }, (_, monthIndex) => {
    const mes = hoje.getMonth() - monthIndex
    const ano = hoje.getFullYear() + Math.floor(mes / 12)
    const mesAjustado = ((mes % 12) + 12) % 12
    
    const quantidade = Math.floor(Math.random() * 50) + 5
    const folhaPagamento = quantidade * (Math.random() * 3000 + 2000)
    
    return {
      ano,
      mes: mesAjustado + 1,
      quantidade,
      folhaPagamento: Math.round(folhaPagamento)
    }
  }).reverse()
  
  return {
    id: String(i + 1),
    cnpj,
    razaoSocial,
    nomeFantasia,
    dataAbertura: new Date(2000 + Math.floor(Math.random() * 24), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    situacao: ['ATIVA', 'ATIVA', 'ATIVA', 'ATIVA', 'SUSPENSA', 'INAPTA'][Math.floor(Math.random() * 6)] as any,
    tipo: Math.random() > 0.3 ? 'MATRIZ' : 'FILIAL',
    porte: ['MEI', 'ME', 'ME', 'EPP', 'EPP', 'DEMAIS'][Math.floor(Math.random() * 6)] as any,
    capitalSocial: Math.floor(Math.random() * 1000000) + 10000,
    
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    opcaoSimples: Math.random() > 0.5,
    opcaoMEI: Math.random() > 0.8,
    formaTributacao: ['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL'][Math.floor(Math.random() * 3)] as any,
    
    cnae: cnaes[i % cnaes.length],
    cnaesSecundarios: numCnaesSecundarios > 0 ? Array.from({ length: numCnaesSecundarios }, (_, j) => cnaes[(i + j + 1) % cnaes.length]) : undefined,
    
    enderecos: Array.from({ length: numEnderecos }, (_, j) => ({
      tipo: j === 0 ? 'MATRIZ' : 'FILIAL' as any,
      logradouro,
      numero: String(Math.floor(Math.random() * 9000) + 100),
      complemento: Math.random() > 0.7 ? `Sala ${Math.floor(Math.random() * 50) + 1}` : undefined,
      bairro,
      cep: `${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`,
      municipio,
      uf,
      isPrincipal: j === 0
    })),
    
    contatos: {
      emailPrincipal: Math.random() > 0.2 ? `contato@${razaoSocial.toLowerCase().replace(/\s+/g, '').substring(0, 10)}.com.br` : undefined,
      emailsSecundarios: Math.random() > 0.7 ? [`vendas@${razaoSocial.toLowerCase().replace(/\s+/g, '').substring(0, 10)}.com.br`] : undefined,
      telefonePrincipal: `(11) ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      telefonesSecundarios: Math.random() > 0.6 ? [`(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`] : undefined,
      website: Math.random() > 0.5 ? `https://www.${razaoSocial.toLowerCase().replace(/\s+/g, '').substring(0, 10)}.com.br` : undefined,
      socialMedia: Math.random() > 0.6 ? {
        linkedin: `https://linkedin.com/company/${razaoSocial.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`,
        instagram: Math.random() > 0.5 ? `https://instagram.com/${razaoSocial.toLowerCase().replace(/\s+/g, '').substring(0, 15)}` : undefined,
        facebook: Math.random() > 0.6 ? `https://facebook.com/${razaoSocial.toLowerCase().replace(/\s+/g, '').substring(0, 15)}` : undefined,
      } : undefined
    },
    
    socios: Array.from({ length: numSocios }, (_, j) => ({
      nome: nomesSocios[(i + j) % nomesSocios.length],
      cpfCnpj: Math.random() > 0.9 ? generateCNPJ(i * 10 + j + 100) : generateCPF(i * 10 + j),
      qualificacao: qualificacoes[j % qualificacoes.length],
      dataEntrada: new Date(2000 + Math.floor(Math.random() * 24), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      participacao: j === 0 ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30) + 10
    })),
    
    dividas: Math.random() > 0.3 ? {
      totalDividas: Math.floor(Math.random() * 500000) + 10000,
      dividasAtivas: Math.floor(Math.random() * 10),
      protestos: Math.floor(Math.random() * 5),
      chequesSemFundo: Math.floor(Math.random() * 3),
      acoesCiveis: Math.floor(Math.random() * 8),
      acoesTrabalho: Math.floor(Math.random() * 5)
    } : undefined,
    
    historicoFuncionarios,
    
    dataConsulta: new Date().toISOString(),
    custoCreditos: 12
  }
})

// Função de busca
export function searchCompanyByCNPJ(cnpj: string): Dados360PJCompany | undefined {
  const cleanCnpj = cnpj.replace(/[^\d]/g, '')
  return mockCompanies.find(company => company.cnpj.replace(/[^\d]/g, '') === cleanCnpj)
}

// Estatísticas agregadas
export const stats = {
  totalCompanies: mockCompanies.length,
  activeCompanies: mockCompanies.filter(c => c.situacao === 'ATIVA').length,
  totalPartners: mockCompanies.reduce((acc, c) => acc + c.socios.length, 0),
  averageEmployees: Math.floor(mockCompanies.reduce((acc, c) => acc + (c.historicoFuncionarios?.[c.historicoFuncionarios.length - 1]?.quantidade || 0), 0) / mockCompanies.length)
}
