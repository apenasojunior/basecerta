// Mock Data: Dados 360° PF (Pessoa Física)
// 50 pessoas com dados completos para dossiê

export interface Dados360PFPerson {
  id: string
  cpf: string
  nome: string
  nomeSocial?: string
  dataNascimento: string
  idade: number
  sexo: 'M' | 'F'
  estadoCivil: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL'
  nacionalidade: string
  naturalidade: string
  nomeMae: string
  nomePai?: string
  
  // Documentos
  rg?: string
  rgOrgaoEmissor?: string
  rgUfEmissao?: string
  rgDataEmissao?: string
  tituloEleitor?: string
  
  // Renda e Situação Financeira
  rendaEstimada?: number
  faixaRenda: 'ATE_2K' | '2K_5K' | '5K_10K' | '10K_20K' | 'ACIMA_20K'
  classeEconomica: 'A' | 'B' | 'C' | 'D' | 'E'
  scoreCredito?: number
  
  // Endereços
  enderecos: Array<{
    tipo: 'RESIDENCIAL' | 'COMERCIAL' | 'CORRESPONDENCIA'
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cep: string
    municipio: string
    uf: string
    isPrincipal: boolean
    dataInicio?: string
  }>
  
  // Contatos
  contatos: {
    emailPrincipal?: string
    emailsSecundarios?: string[]
    telefonePrincipal?: string
    telefonesSecundarios?: string[]
    celular?: string
    celularesSecundarios?: string[]
  }
  
  // Parentes e Relacionamentos
  parentes?: Array<{
    nome: string
    parentesco: string
    cpf?: string
    dataNascimento?: string
  }>
  
  // Experiência Profissional
  experienciaProfissional?: Array<{
    empresa: string
    cnpj?: string
    cargo: string
    dataInicio: string
    dataFim?: string
    situacao: 'ATIVO' | 'INATIVO'
    salario?: number
  }>
  
  // Vínculos Empresariais
  vinculosEmpresariais?: Array<{
    cnpj: string
    razaoSocial: string
    nomeFantasia?: string
    qualificacao: string
    dataEntrada: string
    dataSaida?: string
    participacao?: number
  }>
  
  // Metadados
  dataConsulta?: string
  custoCreditos: number
}

// Helper: Gerar CPF válido
function generateCPF(index: number): string {
  const base = String(10000000000 + index).padStart(11, '0')
  const cpf = base.substring(0, 9)
  
  // Calcular dígito verificador 1
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i)
  }
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  // Calcular dígito verificador 2
  sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (11 - i)
  }
  sum += digit1 * 2
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  const fullCpf = cpf + digit1 + digit2
  return `${fullCpf.substring(0, 3)}.${fullCpf.substring(3, 6)}.${fullCpf.substring(6, 9)}-${fullCpf.substring(9, 11)}`
}

// Helper: Gerar data aleatória
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

// Helper: Calcular idade
function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Dados auxiliares
const nomes = [
  'João Silva Santos', 'Maria Oliveira Costa', 'Pedro Souza Lima', 'Ana Paula Rodrigues',
  'Carlos Eduardo Almeida', 'Juliana Ferreira Gomes', 'Ricardo Martins Pereira', 'Fernanda Santos Cruz',
  'Paulo Roberto Dias', 'Mariana Costa Ribeiro', 'Lucas Henrique Barbosa', 'Camila Alves Cardoso',
  'Rafael Oliveira Cunha', 'Beatriz Lima Monteiro', 'Gustavo Pereira Rocha', 'Larissa Santos Melo',
  'Felipe Rodrigues Nunes', 'Amanda Costa Carvalho', 'Bruno Silva Araújo', 'Gabriela Ferreira Pinto',
  'Thiago Almeida Castro', 'Isabella Martins Freitas', 'Rodrigo Santos Cavalcanti', 'Letícia Oliveira Teixeira',
  'Diego Costa Fernandes', 'Natália Lima Ramos', 'Vinícius Souza Mendes', 'Carolina Rodrigues Correia',
  'Leonardo Silva Moreira', 'Patrícia Ferreira Duarte', 'Marcelo Almeida Barros', 'Renata Martins Campos',
  'André Costa Rezende', 'Vanessa Santos Azevedo', 'Fábio Oliveira Farias', 'Tatiana Lima Guimarães',
  'Márcio Souza Peixoto', 'Cristina Rodrigues Nogueira', 'Alexandre Silva Machado', 'Luciana Ferreira Lopes',
  'Roberto Almeida Silveira', 'Daniela Martins Vieira', 'Eduardo Costa Amaral', 'Adriana Santos Batista',
  'Sérgio Oliveira Moura', 'Simone Lima Nascimento', 'Henrique Souza Coelho', 'Priscila Rodrigues Tavares',
  'Antônio Silva Borges', 'Eliane Ferreira Fonseca'
]

const nomesMaternos = [
  'Maria Silva', 'Ana Costa', 'Joana Santos', 'Rosa Lima', 'Helena Souza',
  'Antônia Oliveira', 'Francisca Rodrigues', 'Terezinha Almeida', 'Conceição Ferreira', 'Aparecida Martins'
]

const nomesPaternos = [
  'José Silva', 'João Costa', 'Pedro Santos', 'Paulo Lima', 'Carlos Souza',
  'Antônio Oliveira', 'Francisco Rodrigues', 'Manuel Almeida', 'Sebastião Ferreira', 'Luiz Martins'
]

const estadosCivis: Dados360PFPerson['estadoCivil'][] = [
  'SOLTEIRO', 'CASADO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL'
]

const faixasRenda: Dados360PFPerson['faixaRenda'][] = [
  'ATE_2K', 'ATE_2K', '2K_5K', '2K_5K', '2K_5K', '5K_10K', '5K_10K', '10K_20K', 'ACIMA_20K'
]

const classesEconomicas: Dados360PFPerson['classeEconomica'][] = [
  'C', 'C', 'C', 'B', 'B', 'B', 'A', 'D', 'E'
]

const cargos = [
  'Analista', 'Gerente', 'Coordenador', 'Assistente', 'Supervisor', 'Diretor',
  'Consultor', 'Especialista', 'Técnico', 'Auxiliar', 'Desenvolvedor', 'Engenheiro'
]

const empresas = [
  'Tech Solutions Ltda', 'Comercial Moderna S/A', 'Indústria Nacional Ltda',
  'Serviços Express', 'Consultoria Business', 'Alimentos Premium Ltda',
  'Transportadora Rápida', 'Construtora Forte S/A', 'Educacional Master',
  'Saúde Total Clínicas', 'Varejo Fácil', 'Agropecuária Verde'
]

const qualificacoes = [
  'Sócio Administrador', 'Sócio', 'Diretor', 'Procurador', 'Administrador'
]

const ufs = ['SP', 'RJ', 'MG', 'RS', 'BA', 'PR', 'PE', 'CE', 'SC', 'GO']
const municipios: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'São José dos Campos', 'Ribeirão Preto'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Campos dos Goytacazes'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
}

// Gerar CEP
function generateCEP(uf: string): string {
  const ranges: Record<string, string> = {
    SP: '01000',
    RJ: '20000',
    MG: '30000',
    RS: '90000',
    BA: '40000',
    PR: '80000',
    PE: '50000',
    CE: '60000',
    SC: '88000',
    GO: '70000'
  }
  const base = ranges[uf] || '01000'
  const num = parseInt(base) + Math.floor(Math.random() * 9000)
  const cep = String(num).padStart(8, '0')
  return `${cep.substring(0, 5)}-${cep.substring(5, 8)}`
}

// Gerar telefone
function generatePhone(uf: string): string {
  const ddds: Record<string, string[]> = {
    SP: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    RJ: ['21', '22', '24'],
    MG: ['31', '32', '33', '34', '35', '37', '38'],
    RS: ['51', '53', '54', '55'],
    BA: ['71', '73', '74', '75', '77'],
  }
  const ddd = (ddds[uf] || ddds.SP)[Math.floor(Math.random() * (ddds[uf] || ddds.SP).length)]
  const num = String(Math.floor(20000000 + Math.random() * 79999999))
  return `(${ddd}) ${num.substring(0, 4)}-${num.substring(4, 8)}`
}

// Gerar celular
function generateCelular(uf: string): string {
  const ddds: Record<string, string[]> = {
    SP: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    RJ: ['21', '22', '24'],
    MG: ['31', '32', '33', '34', '35', '37', '38'],
    RS: ['51', '53', '54', '55'],
    BA: ['71', '73', '74', '75', '77'],
  }
  const ddd = (ddds[uf] || ddds.SP)[Math.floor(Math.random() * (ddds[uf] || ddds.SP).length)]
  const num = String(Math.floor(900000000 + Math.random() * 99999999))
  return `(${ddd}) 9${num.substring(0, 4)}-${num.substring(4, 8)}`
}

// Gerar mock data de 50 pessoas
export const mockPessoas: Dados360PFPerson[] = Array.from({ length: 50 }, (_, index) => {
  const nome = nomes[index % nomes.length]
  const dataNascimento = randomDate(new Date(1950, 0, 1), new Date(2000, 11, 31))
  const idade = calculateAge(dataNascimento)
  const uf = ufs[Math.floor(Math.random() * ufs.length)]
  const municipiosList = municipios[uf] || municipios.SP
  const municipio = municipiosList[Math.floor(Math.random() * municipiosList.length)]
  const faixaRenda = faixasRenda[Math.floor(Math.random() * faixasRenda.length)]
  const classeEconomica = classesEconomicas[Math.floor(Math.random() * classesEconomicas.length)]
  
  // Definir renda estimada baseada na faixa
  let rendaEstimada: number | undefined
  switch (faixaRenda) {
    case 'ATE_2K':
      rendaEstimada = 1500 + Math.random() * 500
      break
    case '2K_5K':
      rendaEstimada = 2000 + Math.random() * 3000
      break
    case '5K_10K':
      rendaEstimada = 5000 + Math.random() * 5000
      break
    case '10K_20K':
      rendaEstimada = 10000 + Math.random() * 10000
      break
    case 'ACIMA_20K':
      rendaEstimada = 20000 + Math.random() * 30000
      break
  }
  
  const hasExperiencia = Math.random() > 0.2
  const hasVinculos = Math.random() > 0.3
  const numEnderecos = Math.random() > 0.7 ? 2 : 1
  const numParentes = Math.floor(Math.random() * 4) + 1
  
  return {
    id: `pf-${String(index + 1).padStart(3, '0')}`,
    cpf: generateCPF(index),
    nome,
    dataNascimento,
    idade,
    sexo: Math.random() > 0.5 ? 'M' : 'F',
    estadoCivil: estadosCivis[Math.floor(Math.random() * estadosCivis.length)],
    nacionalidade: 'Brasileira',
    naturalidade: `${municipio}/${uf}`,
    nomeMae: nomesMaternos[Math.floor(Math.random() * nomesMaternos.length)],
    nomePai: Math.random() > 0.3 ? nomesPaternos[Math.floor(Math.random() * nomesPaternos.length)] : undefined,
    
    // Documentos
    rg: Math.random() > 0.1 ? String(Math.floor(10000000 + Math.random() * 89999999)) : undefined,
    rgOrgaoEmissor: 'SSP',
    rgUfEmissao: uf,
    rgDataEmissao: randomDate(new Date(1990, 0, 1), new Date(2020, 11, 31)),
    tituloEleitor: Math.random() > 0.2 ? String(Math.floor(100000000000 + Math.random() * 899999999999)) : undefined,
    
    // Renda
    rendaEstimada,
    faixaRenda,
    classeEconomica,
    scoreCredito: Math.floor(300 + Math.random() * 700),
    
    // Endereços
    enderecos: Array.from({ length: numEnderecos }, (_, i) => ({
      tipo: i === 0 ? 'RESIDENCIAL' : Math.random() > 0.5 ? 'COMERCIAL' : 'CORRESPONDENCIA',
      logradouro: `Rua ${['das Flores', 'Principal', 'do Comércio', 'Central', 'da Paz'][Math.floor(Math.random() * 5)]}`,
      numero: String(Math.floor(1 + Math.random() * 9999)),
      complemento: Math.random() > 0.7 ? `Apto ${Math.floor(1 + Math.random() * 500)}` : undefined,
      bairro: ['Centro', 'Jardim', 'Vila Nova', 'Boa Vista', 'São João'][Math.floor(Math.random() * 5)],
      cep: generateCEP(uf),
      municipio,
      uf,
      isPrincipal: i === 0,
      dataInicio: randomDate(new Date(2010, 0, 1), new Date(2024, 11, 31)),
    })),
    
    // Contatos
    contatos: {
      emailPrincipal: Math.random() > 0.1 ? `${nome.toLowerCase().replace(/\s+/g, '.')}@email.com` : undefined,
      emailsSecundarios: Math.random() > 0.7 ? [`${nome.toLowerCase().replace(/\s+/g, '.')}@gmail.com`] : undefined,
      telefonePrincipal: Math.random() > 0.3 ? generatePhone(uf) : undefined,
      celular: generateCelular(uf),
      celularesSecundarios: Math.random() > 0.8 ? [generateCelular(uf)] : undefined,
    },
    
    // Parentes
    parentes: Array.from({ length: numParentes }, (_, i) => ({
      nome: nomes[Math.floor(Math.random() * nomes.length)],
      parentesco: ['Cônjuge', 'Filho(a)', 'Pai', 'Mãe', 'Irmão(ã)'][Math.min(i, 4)],
      cpf: Math.random() > 0.5 ? generateCPF(index * 10 + i) : undefined,
      dataNascimento: Math.random() > 0.5 ? randomDate(new Date(1940, 0, 1), new Date(2015, 11, 31)) : undefined,
    })),
    
    // Experiência Profissional
    experienciaProfissional: hasExperiencia ? Array.from({ length: Math.floor(1 + Math.random() * 3) }, () => {
      const dataInicio = randomDate(new Date(2010, 0, 1), new Date(2022, 11, 31))
      const isAtivo = Math.random() > 0.4
      return {
        empresa: empresas[Math.floor(Math.random() * empresas.length)],
        cargo: cargos[Math.floor(Math.random() * cargos.length)],
        dataInicio,
        dataFim: isAtivo ? undefined : randomDate(new Date(dataInicio), new Date(2024, 11, 31)),
        situacao: isAtivo ? 'ATIVO' : 'INATIVO',
        salario: rendaEstimada ? rendaEstimada * (0.8 + Math.random() * 0.4) : undefined,
      }
    }) : undefined,
    
    // Vínculos Empresariais
    vinculosEmpresariais: hasVinculos ? Array.from({ length: Math.floor(1 + Math.random() * 2) }, () => {
      const dataEntrada = randomDate(new Date(2010, 0, 1), new Date(2022, 11, 31))
      const isAtivo = Math.random() > 0.5
      return {
        cnpj: `${String(Math.floor(10000000 + Math.random() * 89999999)).padStart(8, '0')}/0001-${String(Math.floor(10 + Math.random() * 89)).padStart(2, '0')}`,
        razaoSocial: `${empresas[Math.floor(Math.random() * empresas.length)]}`,
        nomeFantasia: Math.random() > 0.5 ? empresas[Math.floor(Math.random() * empresas.length)] : undefined,
        qualificacao: qualificacoes[Math.floor(Math.random() * qualificacoes.length)],
        dataEntrada,
        dataSaida: isAtivo ? undefined : randomDate(new Date(dataEntrada), new Date(2024, 11, 31)),
        participacao: Math.random() > 0.5 ? Math.floor(1 + Math.random() * 100) : undefined,
      }
    }) : undefined,
    
    custoCreditos: 8,
  }
})

// Função de busca por CPF
export function searchPersonByCPF(cpf: string): Dados360PFPerson | undefined {
  // Remove formatação para comparação
  const cleanCpf = cpf.replace(/[.\-]/g, '')
  return mockPessoas.find(person => {
    const personCleanCpf = person.cpf.replace(/[.\-]/g, '')
    return personCleanCpf === cleanCpf
  })
}

// Validar CPF (dígitos verificadores)
export function validateCPF(cpf: string): boolean {
  const cleanCpf = cpf.replace(/[^\d]/g, '')
  
  if (cleanCpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCpf)) return false
  
  // Validar primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i)
  }
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (digit1 !== parseInt(cleanCpf[9])) return false
  
  // Validar segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i)
  }
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (digit2 !== parseInt(cleanCpf[10])) return false
  
  return true
}

// Labels para exibição
export const estadoCivilLabels: Record<Dados360PFPerson['estadoCivil'], string> = {
  SOLTEIRO: 'Solteiro(a)',
  CASADO: 'Casado(a)',
  DIVORCIADO: 'Divorciado(a)',
  VIUVO: 'Viúvo(a)',
  UNIAO_ESTAVEL: 'União Estável',
}

export const faixaRendaLabels: Record<Dados360PFPerson['faixaRenda'], string> = {
  ATE_2K: 'Até R$ 2.000',
  '2K_5K': 'R$ 2.000 - R$ 5.000',
  '5K_10K': 'R$ 5.000 - R$ 10.000',
  '10K_20K': 'R$ 10.000 - R$ 20.000',
  ACIMA_20K: 'Acima de R$ 20.000',
}

export const classeEconomicaLabels: Record<Dados360PFPerson['classeEconomica'], string> = {
  A: 'Classe A',
  B: 'Classe B',
  C: 'Classe C',
  D: 'Classe D',
  E: 'Classe E',
}
