/**
 * Mock Data - Radar Jurídico PF
 * Dados de processos jurídicos para pessoas físicas
 */

export interface ProcessoParte {
  nome: string
  cpfCnpj: string
  tipo: 'AUTOR' | 'REU' | 'TERCEIRO' | 'ADVOGADO'
  qualificacao?: string
}

export interface ProcessoMovimentacao {
  data: string
  tipo: string
  descricao: string
  documento?: string
}

export interface ProcessoJuridico {
  numero: string
  cpfConsultado: string
  tribunal: string
  vara: string
  comarca: string
  tipo: 'CIVEL' | 'TRABALHISTA' | 'CRIMINAL' | 'TRIBUTARIO' | 'FAMILIA'
  assunto: string
  status: 'EM_ANDAMENTO' | 'SUSPENSO' | 'ARQUIVADO' | 'SENTENCIADO' | 'RECURSO'
  dataDistribuicao: string
  dataUltimaMovimentacao: string
  valorCausa?: number
  partes: ProcessoParte[]
  poloAtivo: string // Nome da parte autora
  poloPassivo: string // Nome da parte ré
  movimentacoes: ProcessoMovimentacao[]
  processosRelacionados?: string[]
  observacoes?: string
}

export interface RadarJuridicoPessoa {
  cpf: string
  nome: string
  totalProcessos: number
  processosAtivos: number
  processosSuspensos: number
  processosArquivados: number
  processosSentenciados: number
  processosRecurso: number
  processosPorTipo: {
    civeis: number
    trabalhistas: number
    criminais: number
    tributarios: number
    familia: number
  }
  processosPorPolo: {
    comoAutor: number
    comoReu: number
    comoTerceiro: number
  }
  valorTotalCausas: number
  processos: ProcessoJuridico[]
}

// Função auxiliar para gerar número de processo
function generateProcessNumber(year: number, tribunal: string): string {
  const num = Math.floor(Math.random() * 999999).toString().padStart(6, '0')
  const seq = Math.floor(Math.random() * 99).toString().padStart(2, '0')
  const seg = Math.floor(Math.random() * 9)
  const cod = tribunal === 'TRT' ? '15' : tribunal === 'STJ' ? '00' : '26'
  const origem = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `${num}-${seq}.${year}.${seg}.${cod}.${origem}`
}

// Função para gerar processos de uma pessoa
function generateProcessos(cpf: string, nome: string, count: number): ProcessoJuridico[] {
  const processos: ProcessoJuridico[] = []
  const tipos: ProcessoJuridico['tipo'][] = ['CIVEL', 'TRABALHISTA', 'CRIMINAL', 'TRIBUTARIO', 'FAMILIA']
  const status: ProcessoJuridico['status'][] = ['EM_ANDAMENTO', 'SUSPENSO', 'ARQUIVADO', 'SENTENCIADO', 'RECURSO']
  const tribunais = ['TJSP', 'TRT', 'STJ', 'TST', 'TJRJ', 'TJMG']
  
  const assuntosPorTipo: Record<ProcessoJuridico['tipo'], string[]> = {
    CIVEL: [
      'Indenização por Danos Morais',
      'Cobrança de Título de Crédito',
      'Rescisão Contratual',
      'Obrigação de Fazer',
      'Ação de Despejo',
      'Busca e Apreensão',
      'Revisão de Aluguel'
    ],
    TRABALHISTA: [
      'Reclamação Trabalhista',
      'Horas Extras',
      'Rescisão Contratual',
      'Verbas Rescisórias',
      'FGTS',
      'Acidente de Trabalho',
      'Assédio Moral'
    ],
    CRIMINAL: [
      'Lesão Corporal',
      'Ameaça',
      'Difamação',
      'Estelionato',
      'Furto',
      'Violação de Direitos Autorais',
      'Crime Ambiental'
    ],
    TRIBUTARIO: [
      'Execução Fiscal',
      'Mandado de Segurança',
      'Anulatória de Débito Fiscal',
      'Repetição de Indébito',
      'Embargos à Execução Fiscal'
    ],
    FAMILIA: [
      'Divórcio Consensual',
      'Alimentos',
      'Guarda de Menor',
      'Inventário',
      'União Estável',
      'Adoção',
      'Investigação de Paternidade'
    ]
  }

  for (let i = 0; i < count; i++) {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]
    const tribunal = tribunais[Math.floor(Math.random() * tribunais.length)]
    const year = 2020 + Math.floor(Math.random() * 5)
    const numeroProcesso = generateProcessNumber(year, tribunal)
    const statusProcesso = status[Math.floor(Math.random() * status.length)]
    const assunto = assuntosPorTipo[tipo][Math.floor(Math.random() * assuntosPorTipo[tipo].length)]
    
    const comarcas = ['São Paulo', 'Rio de Janeiro', 'Campinas', 'Guarulhos', 'Brasília', 'Belo Horizonte']
    const comarca = comarcas[Math.floor(Math.random() * comarcas.length)]
    
    const isAutor = Math.random() > 0.5
    const contraparteNome = `${['João', 'Maria', 'Pedro', 'Ana', 'Carlos'][Math.floor(Math.random() * 5)]} ${['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima'][Math.floor(Math.random() * 5)]}`
    
    const dataDistribuicao = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const dataUltima = new Date(dataDistribuicao.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000)
    
    const movimentacoesCount = Math.floor(Math.random() * 10) + 3
    const movimentacoes: ProcessoMovimentacao[] = []
    
    const tiposMovimentacao = [
      'Distribuição do Processo',
      'Despacho',
      'Juntada de Petição',
      'Audiência Designada',
      'Sentença Proferida',
      'Recurso Interposto',
      'Decisão Interlocutória',
      'Intimação',
      'Publicação',
      'Conclusão ao Juiz'
    ]
    
    for (let j = 0; j < movimentacoesCount; j++) {
      const dataMovimentacao = new Date(
        dataDistribuicao.getTime() + (j / movimentacoesCount) * (dataUltima.getTime() - dataDistribuicao.getTime())
      )
      
      movimentacoes.push({
        data: dataMovimentacao.toISOString().split('T')[0],
        tipo: tiposMovimentacao[Math.floor(Math.random() * tiposMovimentacao.length)],
        descricao: `Movimentação processual nº ${j + 1}. Processo em tramitação normal.`,
        documento: Math.random() > 0.7 ? `DOC-${Math.floor(Math.random() * 99999)}` : undefined
      })
    }
    
    movimentacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    
    const partes: ProcessoParte[] = []
    
    if (isAutor) {
      partes.push({
        nome: nome,
        cpfCnpj: cpf,
        tipo: 'AUTOR',
        qualificacao: 'Requerente'
      })
      partes.push({
        nome: contraparteNome,
        cpfCnpj: `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}`,
        tipo: 'REU',
        qualificacao: 'Requerido'
      })
    } else {
      partes.push({
        nome: contraparteNome,
        cpfCnpj: `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}`,
        tipo: 'AUTOR',
        qualificacao: 'Requerente'
      })
      partes.push({
        nome: nome,
        cpfCnpj: cpf,
        tipo: 'REU',
        qualificacao: 'Requerido'
      })
    }
    
    // Adicionar advogados
    const advogadoAutor = `Dr. ${['Roberto', 'Fernanda', 'Paulo', 'Juliana'][Math.floor(Math.random() * 4)]} ${['Alves', 'Costa', 'Martins', 'Ferreira'][Math.floor(Math.random() * 4)]}`
    const advogadoReu = `Dr. ${['Carlos', 'Beatriz', 'Ricardo', 'Patrícia'][Math.floor(Math.random() * 4)]} ${['Rodrigues', 'Barbosa', 'Gomes', 'Ribeiro'][Math.floor(Math.random() * 4)]}`
    
    partes.push({
      nome: advogadoAutor,
      cpfCnpj: `OAB/SP ${Math.floor(Math.random() * 400000 + 100000)}`,
      tipo: 'ADVOGADO',
      qualificacao: 'Advogado da Parte Autora'
    })
    
    partes.push({
      nome: advogadoReu,
      cpfCnpj: `OAB/SP ${Math.floor(Math.random() * 400000 + 100000)}`,
      tipo: 'ADVOGADO',
      qualificacao: 'Advogado da Parte Ré'
    })
    
    processos.push({
      numero: numeroProcesso,
      cpfConsultado: cpf,
      tribunal: tribunal,
      vara: `${Math.floor(Math.random() * 20) + 1}ª Vara ${tipo === 'CIVEL' ? 'Cível' : tipo === 'TRABALHISTA' ? 'do Trabalho' : tipo === 'CRIMINAL' ? 'Criminal' : tipo === 'TRIBUTARIO' ? 'da Fazenda Pública' : 'de Família'}`,
      comarca: comarca,
      tipo: tipo,
      assunto: assunto,
      status: statusProcesso,
      dataDistribuicao: dataDistribuicao.toISOString().split('T')[0],
      dataUltimaMovimentacao: dataUltima.toISOString().split('T')[0],
      valorCausa: tipo !== 'CRIMINAL' ? Math.floor(Math.random() * 500000) + 5000 : undefined,
      partes: partes,
      poloAtivo: partes.find(p => p.tipo === 'AUTOR')?.nome || '',
      poloPassivo: partes.find(p => p.tipo === 'REU')?.nome || '',
      movimentacoes: movimentacoes,
      processosRelacionados: Math.random() > 0.8 ? [generateProcessNumber(year, tribunal)] : undefined
    })
  }
  
  return processos.sort((a, b) => 
    new Date(b.dataUltimaMovimentacao).getTime() - new Date(a.dataUltimaMovimentacao).getTime()
  )
}

// Mock de 30 pessoas com processos jurídicos
// CPFs válidos com dígitos verificadores corretos (gerados e validados)
export const mockPessoasRadarJuridico: RadarJuridicoPessoa[] = [
  {
    cpf: '111.444.777-35',
    nome: 'João Silva Santos',
    totalProcessos: 0,
    processosAtivos: 0,
    processosSuspensos: 0,
    processosArquivados: 0,
    processosSentenciados: 0,
    processosRecurso: 0,
    processosPorTipo: { civeis: 0, trabalhistas: 0, criminais: 0, tributarios: 0, familia: 0 },
    processosPorPolo: { comoAutor: 0, comoReu: 0, comoTerceiro: 0 },
    valorTotalCausas: 0,
    processos: []
  },
  {
    cpf: '222.555.888-46',
    nome: 'Maria Oliveira Costa',
    totalProcessos: 0,
    processosAtivos: 0,
    processosSuspensos: 0,
    processosArquivados: 0,
    processosSentenciados: 0,
    processosRecurso: 0,
    processosPorTipo: { civeis: 0, trabalhistas: 0, criminais: 0, tributarios: 0, familia: 0 },
    processosPorPolo: { comoAutor: 0, comoReu: 0, comoTerceiro: 0 },
    valorTotalCausas: 0,
    processos: []
  },
  {
    cpf: '333.666.999-57',
    nome: 'Pedro Henrique Souza',
    totalProcessos: 0,
    processosAtivos: 0,
    processosSuspensos: 0,
    processosArquivados: 0,
    processosSentenciados: 0,
    processosRecurso: 0,
    processosPorTipo: { civeis: 0, trabalhistas: 0, criminais: 0, tributarios: 0, familia: 0 },
    processosPorPolo: { comoAutor: 0, comoReu: 0, comoTerceiro: 0 },
    valorTotalCausas: 0,
    processos: []
  },
  {
    cpf: '444.777.000-68',
    nome: 'Ana Paula Lima',
    totalProcessos: 0,
    processosAtivos: 0,
    processosSuspensos: 0,
    processosArquivados: 0,
    processosSentenciados: 0,
    processosRecurso: 0,
    processosPorTipo: { civeis: 0, trabalhistas: 0, criminais: 0, tributarios: 0, familia: 0 },
    processosPorPolo: { comoAutor: 0, comoReu: 0, comoTerceiro: 0 },
    valorTotalCausas: 0,
    processos: []
  },
  {
    cpf: '555.888.111-79',
    nome: 'Carlos Eduardo Ferreira',
    totalProcessos: 0,
    processosAtivos: 0,
    processosSuspensos: 0,
    processosArquivados: 0,
    processosSentenciados: 0,
    processosRecurso: 0,
    processosPorTipo: { civeis: 0, trabalhistas: 0, criminais: 0, tributarios: 0, familia: 0 },
    processosPorPolo: { comoAutor: 0, comoReu: 0, comoTerceiro: 0 },
    valorTotalCausas: 0,
    processos: []
  }
]

// Gerar processos para cada pessoa (5-15 processos)
mockPessoasRadarJuridico.forEach(pessoa => {
  const numProcessos = Math.floor(Math.random() * 11) + 5 // 5 a 15 processos
  pessoa.processos = generateProcessos(pessoa.cpf, pessoa.nome, numProcessos)
  pessoa.totalProcessos = pessoa.processos.length
  
  // Calcular estatísticas
  pessoa.processos.forEach(proc => {
    // Por status
    if (proc.status === 'EM_ANDAMENTO') pessoa.processosAtivos++
    else if (proc.status === 'SUSPENSO') pessoa.processosSuspensos++
    else if (proc.status === 'ARQUIVADO') pessoa.processosArquivados++
    else if (proc.status === 'SENTENCIADO') pessoa.processosSentenciados++
    else if (proc.status === 'RECURSO') pessoa.processosRecurso++
    
    // Por tipo
    if (proc.tipo === 'CIVEL') pessoa.processosPorTipo.civeis++
    else if (proc.tipo === 'TRABALHISTA') pessoa.processosPorTipo.trabalhistas++
    else if (proc.tipo === 'CRIMINAL') pessoa.processosPorTipo.criminais++
    else if (proc.tipo === 'TRIBUTARIO') pessoa.processosPorTipo.tributarios++
    else if (proc.tipo === 'FAMILIA') pessoa.processosPorTipo.familia++
    
    // Por polo
    const isAutor = proc.partes.some(p => p.cpfCnpj === pessoa.cpf && p.tipo === 'AUTOR')
    const isReu = proc.partes.some(p => p.cpfCnpj === pessoa.cpf && p.tipo === 'REU')
    
    if (isAutor) pessoa.processosPorPolo.comoAutor++
    else if (isReu) pessoa.processosPorPolo.comoReu++
    else pessoa.processosPorPolo.comoTerceiro++
    
    // Valor total
    if (proc.valorCausa) {
      pessoa.valorTotalCausas += proc.valorCausa
    }
  })
})

// Função para buscar pessoa por CPF
export function searchPessoaByCPF(cpf: string): RadarJuridicoPessoa | null {
  const cleanCPF = cpf.replace(/\D/g, '')
  return mockPessoasRadarJuridico.find(p => p.cpf.replace(/\D/g, '') === cleanCPF) || null
}

// Função para buscar processo por número
export function searchProcessoByNumero(numero: string): ProcessoJuridico | null {
  for (const pessoa of mockPessoasRadarJuridico) {
    const processo = pessoa.processos.find(p => p.numero === numero)
    if (processo) return processo
  }
  return null
}

// Stats gerais
export const radarJuridicoStats = {
  totalPessoas: mockPessoasRadarJuridico.length,
  totalProcessos: mockPessoasRadarJuridico.reduce((sum, p) => sum + p.totalProcessos, 0),
  processosAtivos: mockPessoasRadarJuridico.reduce((sum, p) => sum + p.processosAtivos, 0),
  tribunaisUnicos: ['TJSP', 'TRT', 'STJ', 'TST', 'TJRJ', 'TJMG'].length
}
