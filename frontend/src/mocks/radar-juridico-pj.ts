/**
 * Mock Data - Radar Jurídico PJ
 * Dados de processos jurídicos para pessoas jurídicas
 */

import type { 
  ProcessoParte, 
  ProcessoMovimentacao, 
  ProcessoJuridico 
} from './radar-juridico-pf'

export interface RadarJuridicoEmpresa {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
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

// Função para gerar número de processo
function generateProcessNumber(year: number): string {
  const sequential = String(Math.floor(Math.random() * 1000000)).padStart(7, '0')
  const segment = Math.floor(Math.random() * 10)
  const tribunal = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  const origin = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${sequential}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}.${year}.${segment}.${tribunal}.${origin}`
}

// Função para gerar processos para uma empresa
function generateProcessosEmpresa(cnpj: string, razaoSocial: string, count: number): ProcessoJuridico[] {
  const processos: ProcessoJuridico[] = []
  const tribunais = ['TJSP', 'TRT', 'STJ', 'TST', 'TJRJ', 'TJMG']
  const tipos: ProcessoJuridico['tipo'][] = ['CIVEL', 'TRABALHISTA', 'CRIMINAL', 'TRIBUTARIO']
  const status: ProcessoJuridico['status'][] = ['EM_ANDAMENTO', 'SUSPENSO', 'ARQUIVADO', 'SENTENCIADO', 'RECURSO']
  
  // Assuntos por tipo (mais focado em empresas)
  const assuntosPorTipo: Record<ProcessoJuridico['tipo'], string[]> = {
    CIVEL: [
      'Indenização por Danos Materiais',
      'Rescisão de Contrato Empresarial',
      'Cobrança de Título de Crédito',
      'Ação de Despejo',
      'Indenização por Propaganda Enganosa',
      'Ação de Cobrança de Serviços'
    ],
    TRABALHISTA: [
      'Adicional de Periculosidade',
      'Horas Extras Não Pagas',
      'Acidente de Trabalho',
      'Verbas Rescisórias',
      'Equiparação Salarial',
      'Assédio Moral no Trabalho'
    ],
    CRIMINAL: [
      'Crimes Contra a Ordem Tributária',
      'Apropriação Indébita Previdenciária',
      'Falsificação de Documento',
      'Crimes Ambientais',
      'Estelionato',
      'Lavagem de Dinheiro'
    ],
    TRIBUTARIO: [
      'Execução Fiscal - ICMS',
      'Execução Fiscal - ISS',
      'Repetição de Indébito Tributário',
      'Embargos à Execução Fiscal',
      'Mandado de Segurança Tributário',
      'Ação Anulatória de Débito Fiscal'
    ],
    FAMILIA: [] // Empresas não têm processos de família
  }
  
  for (let i = 0; i < count; i++) {
    const year = 2020 + Math.floor(Math.random() * 5)
    const tribunal = tribunais[Math.floor(Math.random() * tribunais.length)]
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]
    const statusProcesso = status[Math.floor(Math.random() * status.length)]
    const assuntosDisponiveis = assuntosPorTipo[tipo]
    const assunto = assuntosDisponiveis[Math.floor(Math.random() * assuntosDisponiveis.length)]
    
    const numero = generateProcessNumber(year)
    const dataDistribuicao = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const diasDecorridos = Math.floor(Math.random() * 365 * 3)
    const dataUltimaMovimentacao = new Date(dataDistribuicao.getTime() + diasDecorridos * 24 * 60 * 60 * 1000)
    
    // Definir polos (empresa pode ser autora ou ré)
    const empresaComoAutora = Math.random() > 0.5
    
    // Gerar partes
    const partes: ProcessoParte[] = []
    
    if (empresaComoAutora) {
      // Empresa como autora
      partes.push({
        nome: razaoSocial,
        cpfCnpj: cnpj,
        tipo: 'AUTOR',
        qualificacao: 'Pessoa Jurídica de Direito Privado'
      })
      
      // Réu (pode ser pessoa física ou jurídica)
      if (Math.random() > 0.5) {
        partes.push({
          nome: `${['João', 'Maria', 'José', 'Ana', 'Carlos'][Math.floor(Math.random() * 5)]} ${['Silva', 'Santos', 'Oliveira', 'Souza'][Math.floor(Math.random() * 4)]}`,
          cpfCnpj: `${String(Math.floor(Math.random() * 100000000000)).padStart(11, '0')}`,
          tipo: 'REU',
          qualificacao: 'Pessoa Física'
        })
      } else {
        partes.push({
          nome: `${['Tech', 'Digital', 'Service', 'Global'][Math.floor(Math.random() * 4)]} ${['Ltda', 'S.A.', 'ME', 'EIRELI'][Math.floor(Math.random() * 4)]}`,
          cpfCnpj: `10.000.0${String(Math.floor(Math.random() * 100)).padStart(2, '0')}/0001-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
          tipo: 'REU',
          qualificacao: 'Pessoa Jurídica de Direito Privado'
        })
      }
    } else {
      // Empresa como ré
      partes.push({
        nome: razaoSocial,
        cpfCnpj: cnpj,
        tipo: 'REU',
        qualificacao: 'Pessoa Jurídica de Direito Privado'
      })
      
      // Autor (geralmente pessoa física em processos trabalhistas)
      if (tipo === 'TRABALHISTA') {
        partes.push({
          nome: `${['Pedro', 'Lucas', 'Juliana', 'Fernanda', 'Roberto'][Math.floor(Math.random() * 5)]} ${['Costa', 'Alves', 'Lima', 'Rodrigues'][Math.floor(Math.random() * 4)]}`,
          cpfCnpj: `${String(Math.floor(Math.random() * 100000000000)).padStart(11, '0')}`,
          tipo: 'AUTOR',
          qualificacao: 'Ex-funcionário'
        })
      } else {
        partes.push({
          nome: `${['Premium', 'Master', 'Elite', 'Pro'][Math.floor(Math.random() * 4)]} ${['Corp', 'Group', 'Holdings', 'Partners'][Math.floor(Math.random() * 4)]}`,
          cpfCnpj: `20.000.0${String(Math.floor(Math.random() * 100)).padStart(2, '0')}/0001-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
          tipo: 'AUTOR',
          qualificacao: 'Pessoa Jurídica de Direito Privado'
        })
      }
    }
    
    // Adicionar advogados
    for (let j = 0; j < Math.floor(Math.random() * 2) + 1; j++) {
      partes.push({
        nome: `Dr. ${['Alexandre', 'Beatriz', 'Carlos', 'Diana'][Math.floor(Math.random() * 4)]} ${['Ferreira', 'Cardoso', 'Martins', 'Pereira'][Math.floor(Math.random() * 4)]}`,
        cpfCnpj: `OAB/SP ${String(Math.floor(Math.random() * 500000) + 100000)}`,
        tipo: 'ADVOGADO'
      })
    }
    
    // Gerar movimentações
    const movimentacoes: ProcessoMovimentacao[] = []
    const numMovimentacoes = Math.floor(Math.random() * 8) + 3
    
    const tiposMovimentacao = [
      'Distribuição do Processo',
      'Juntada de Petição',
      'Decisão Interlocutória',
      'Audiência de Conciliação',
      'Intimação das Partes',
      'Apresentação de Contestação',
      'Produção de Provas',
      'Despacho do Juiz',
      'Sentença',
      'Recurso de Apelação'
    ]
    
    for (let j = 0; j < numMovimentacoes; j++) {
      const diasMovimentacao = Math.floor((diasDecorridos / numMovimentacoes) * j)
      const dataMovimentacao = new Date(dataDistribuicao.getTime() + diasMovimentacao * 24 * 60 * 60 * 1000)
      
      movimentacoes.unshift({
        data: dataMovimentacao.toISOString(),
        tipo: tiposMovimentacao[j % tiposMovimentacao.length],
        descricao: `${tiposMovimentacao[j % tiposMovimentacao.length]} referente ao processo ${numero}. Processo em andamento regular conforme rito processual.`,
        documento: Math.random() > 0.5 ? `Documento_${j + 1}.pdf` : undefined
      })
    }
    
    // Definir valor da causa (processos empresariais geralmente têm valores maiores)
    const valorCausa = tipo === 'TRIBUTARIO' || tipo === 'CIVEL' 
      ? Math.floor(Math.random() * 5000000) + 50000
      : tipo === 'TRABALHISTA'
      ? Math.floor(Math.random() * 500000) + 10000
      : undefined
    
    processos.push({
      numero,
      cpfConsultado: cnpj,
      tribunal,
      vara: tipo === 'TRABALHISTA' ? `${Math.floor(Math.random() * 50) + 1}ª Vara do Trabalho` : `${Math.floor(Math.random() * 30) + 1}ª Vara ${tipo === 'CIVEL' ? 'Cível' : tipo === 'TRIBUTARIO' ? 'da Fazenda Pública' : 'Criminal'}`,
      comarca: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Campinas'][Math.floor(Math.random() * 5)],
      tipo,
      assunto,
      status: statusProcesso,
      dataDistribuicao: dataDistribuicao.toISOString(),
      dataUltimaMovimentacao: dataUltimaMovimentacao.toISOString(),
      valorCausa,
      partes,
      poloAtivo: partes.find(p => p.tipo === 'AUTOR')?.nome || '',
      poloPassivo: partes.find(p => p.tipo === 'REU')?.nome || '',
      movimentacoes,
      processosRelacionados: Math.random() > 0.7 ? [generateProcessNumber(year), generateProcessNumber(year - 1)] : undefined,
      observacoes: Math.random() > 0.8 ? 'Processo de alta complexidade com múltiplas partes envolvidas.' : undefined
    })
  }
  
  return processos
}

// Gerar dados para 5 empresas
const mockEmpresasRadarJuridico: RadarJuridicoEmpresa[] = [
  {
    cnpj: '10.000.001/0001-90',
    razaoSocial: 'TECH SOLUTIONS LTDA',
    nomeFantasia: 'TechSol',
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
    cnpj: '10.000.002/0001-34',
    razaoSocial: 'COMERCIAL BRASIL S.A.',
    nomeFantasia: 'Brasil Atacado',
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
    cnpj: '10.000.003/0001-79',
    razaoSocial: 'INDUSTRIA MODERNA EIRELI',
    nomeFantasia: 'Moderna Industrial',
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
    cnpj: '10.000.004/0001-13',
    razaoSocial: 'SERVICOS DIGITAIS ME',
    nomeFantasia: 'Digital Pro',
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
    cnpj: '10.000.005/0001-58',
    razaoSocial: 'TRANSPORTADORA VELOZ LTDA',
    nomeFantasia: 'Veloz Transportes',
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

// Gerar processos para cada empresa e calcular estatísticas
mockEmpresasRadarJuridico.forEach((empresa, index) => {
  const numProcessos = Math.floor(Math.random() * 15) + 8 // 8-22 processos
  empresa.processos = generateProcessosEmpresa(empresa.cnpj, empresa.razaoSocial, numProcessos)
  empresa.totalProcessos = empresa.processos.length
  
  // Calcular estatísticas
  empresa.processos.forEach(processo => {
    // Por status
    if (processo.status === 'EM_ANDAMENTO') empresa.processosAtivos++
    if (processo.status === 'SUSPENSO') empresa.processosSuspensos++
    if (processo.status === 'ARQUIVADO') empresa.processosArquivados++
    if (processo.status === 'SENTENCIADO') empresa.processosSentenciados++
    if (processo.status === 'RECURSO') empresa.processosRecurso++
    
    // Por tipo
    if (processo.tipo === 'CIVEL') empresa.processosPorTipo.civeis++
    if (processo.tipo === 'TRABALHISTA') empresa.processosPorTipo.trabalhistas++
    if (processo.tipo === 'CRIMINAL') empresa.processosPorTipo.criminais++
    if (processo.tipo === 'TRIBUTARIO') empresa.processosPorTipo.tributarios++
    
    // Por polo
    if (processo.poloAtivo === empresa.razaoSocial) empresa.processosPorPolo.comoAutor++
    if (processo.poloPassivo === empresa.razaoSocial) empresa.processosPorPolo.comoReu++
    
    // Valor total
    if (processo.valorCausa) empresa.valorTotalCausas += processo.valorCausa
  })
})

// Função para buscar empresa por CNPJ
export function searchEmpresaByCNPJ(cnpj: string): RadarJuridicoEmpresa | null {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  return mockEmpresasRadarJuridico.find(e => e.cnpj.replace(/\D/g, '') === cleanCNPJ) || null
}

// Stats gerais
export const radarJuridicoPJStats = {
  totalEmpresas: mockEmpresasRadarJuridico.length,
  totalProcessos: mockEmpresasRadarJuridico.reduce((sum, e) => sum + e.totalProcessos, 0),
  processosAtivos: mockEmpresasRadarJuridico.reduce((sum, e) => sum + e.processosAtivos, 0),
  tribunaisUnicos: ['TJSP', 'TRT', 'STJ', 'TST', 'TJRJ', 'TJMG'].length
}

// Função para buscar processo por número (PJ)
export function searchProcessoByNumeroPJ(numero: string): ProcessoJuridico | null {
  // Buscar em todos os processos de todas as empresas
  for (const empresa of mockEmpresasRadarJuridico) {
    const processo = empresa.processos.find(p => p.numero === numero)
    if (processo) {
      return processo
    }
  }
  return null
}

// Exportar dados mock
export { mockEmpresasRadarJuridico }
