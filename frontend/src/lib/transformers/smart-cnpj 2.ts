/**
 * Transformers para Smart CNPJ 360°
 * Issue 2.2.2 - Alinhar Tipos TypeScript
 * 
 * Funções para converter entre tipos do Mock e da API
 */

import type {
  SmartCNPJCompanyAPI,
  SmartCNPJCompanyMock,
} from '@/types/smart-cnpj'

// ================================================================
// API → MOCK (Transformação de dados da API para o formato mock)
// ================================================================

/**
 * Converte resposta da API para o formato mock (compatibilidade temporária)
 * 
 * ⚠️ TEMPORÁRIO: Esta função será removida quando todos os componentes
 * forem migrados para usar SmartCNPJCompanyAPI diretamente
 * 
 * @param apiData - Dados vindos do backend
 * @returns Dados no formato mock (compatível com código existente)
 */
export function transformAPIToMock(
  apiData: SmartCNPJCompanyAPI
): SmartCNPJCompanyMock {
  return {
    // ❌ Campos que não existem no backend - gerar valores default
    id: apiData.cnpj, // Usar CNPJ como ID temporário
    tipo: determinaTipo(apiData.cnpj), // Calcular a partir do CNPJ
    isMEI: apiData.codigoPorte === '01', // Código 01 = MEI
    isSimplesNacional: false, // ⚠️ Não disponível - assumir false
    formaTributacao: inferirFormaTributacao(apiData.codigoPorte),

    // ✅ Campos básicos - mapeamento direto
    cnpj: apiData.cnpj,
    razaoSocial: apiData.razaoSocial,
    nomeFantasia: apiData.nomeFantasia || '',
    dataAbertura: apiData.dataAbertura,

    // 🔄 Campos com transformação
    situacaoCadastral: normalizaSituacaoCadastral(apiData.situacaoCadastral),
    porte: normalizaPorte(apiData.porte, apiData.codigoPorte),
    capitalSocial: parseFloat(apiData.capitalSocial), // string → number

    // 🔄 CNAE - nome diferente no backend
    cnaesPrimario: apiData.cnaePrincipal, // ⚠️ cnaePrincipal → cnaesPrimario
    cnaesSecundarios: apiData.cnaesSecundarios,

    // ✅ Objetos aninhados - ajuste de estrutura
    endereco: {
      cep: apiData.endereco.cep,
      logradouro: apiData.endereco.logradouro,
      numero: apiData.endereco.numero,
      complemento: apiData.endereco.complemento || undefined,
      bairro: apiData.endereco.bairro,
      municipio: apiData.endereco.municipio,
      uf: apiData.endereco.uf,
    },

    contatos: {
      email: apiData.contatos.email || undefined,
      telefone: apiData.contatos.telefone || undefined,
    },

    socios: apiData.socios.map((socio) => ({
      nome: socio.nome,
      cpfCnpj: socio.cpfCnpj || '',
      qualificacao: socio.qualificacao,
      dataEntrada: socio.dataEntrada || '',
    })),
  }
}

// ================================================================
// FUNÇÕES AUXILIARES DE NORMALIZAÇÃO
// ================================================================

/**
 * Determina se é MATRIZ ou FILIAL baseado no CNPJ
 * Os 4 últimos dígitos antes do DV indicam:
 * - 0001 = MATRIZ
 * - 0002+ = FILIAL
 */
function determinaTipo(cnpj: string): 'MATRIZ' | 'FILIAL' {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  const ordem = cleanCNPJ.substring(8, 12)
  return ordem === '0001' ? 'MATRIZ' : 'FILIAL'
}

/**
 * Normaliza situação cadastral para o enum do mock
 * Backend retorna strings livres, mock usa enum limitado
 */
function normalizaSituacaoCadastral(
  situacao: string
): 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA' {
  const situacaoUpper = situacao.toUpperCase()

  // Mapeamento de valores conhecidos
  const mapeamento: Record<string, 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA'> = {
    ATIVA: 'ATIVA',
    SUSPENSA: 'SUSPENSA',
    INAPTA: 'INAPTA',
    BAIXADA: 'BAIXADA',
    NULA: 'NULA',
    // Variações
    'ATIVA REGULAR': 'ATIVA',
    'SUSPENSÃO': 'SUSPENSA',
  }

  return mapeamento[situacaoUpper] || 'ATIVA' // Default: ATIVA
}

/**
 * Normaliza porte para o enum do mock
 * Backend retorna strings livres, mock usa enum limitado
 */
function normalizaPorte(
  porteDescricao: string,
  codigoPorte: string
): 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE' {
  // Usar código para maior precisão
  const codigoMap: Record<string, 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE'> = {
    '01': 'MEI', // Microempreendedor Individual
    '03': 'ME', // Microempresa
    '05': 'EPP', // Empresa de Pequeno Porte
    '07': 'MEDIO', // Média Empresa
    '09': 'GRANDE', // Grande Empresa
  }

  if (codigoMap[codigoPorte]) {
    return codigoMap[codigoPorte]
  }

  // Fallback: usar descrição
  const descricaoUpper = porteDescricao.toUpperCase()
  if (descricaoUpper.includes('MEI')) return 'MEI'
  if (descricaoUpper.includes('MICRO')) return 'ME'
  if (descricaoUpper.includes('PEQUENO')) return 'EPP'
  if (descricaoUpper.includes('MÉDIA') || descricaoUpper.includes('MEDIA')) return 'MEDIO'
  if (descricaoUpper.includes('GRANDE')) return 'GRANDE'

  return 'ME' // Default: ME
}

/**
 * Infere forma de tributação baseado no porte
 * ⚠️ APROXIMAÇÃO: Backend não fornece esta informação
 */
function inferirFormaTributacao(
  codigoPorte: string
): 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' {
  if (codigoPorte === '01' || codigoPorte === '03') {
    return 'SIMPLES_NACIONAL' // MEI e ME geralmente são Simples
  }
  if (codigoPorte === '05') {
    return 'LUCRO_PRESUMIDO' // EPP pode ser Simples ou Presumido
  }
  return 'LUCRO_REAL' // Médias e Grandes geralmente Lucro Real
}

// ================================================================
// MOCK → API (Preparação de dados para envio ao backend)
// ================================================================

/**
 * Converte dados do mock para formato aceito pela API
 * 
 * ⚠️ USO LIMITADO: A maioria dos dados vem do backend, não do frontend
 * Esta função é útil principalmente para testes
 * 
 * @param mockData - Dados no formato mock
 * @returns Dados no formato esperado pela API
 */
export function transformMockToAPI(
  mockData: SmartCNPJCompanyMock
): SmartCNPJCompanyAPI {
  return {
    cnpj: mockData.cnpj,
    razaoSocial: mockData.razaoSocial,
    nomeFantasia: mockData.nomeFantasia || null,

    // ❌ Campos que não existem no mock - gerar valores default
    naturezaJuridica: 'Não informado',
    codigoNaturezaJuridica: '0000',
    codigoPorte: reversePorteCode(mockData.porte),
    codigoSituacaoCadastral: reverseSituacaoCode(mockData.situacaoCadastral),
    dataSituacaoCadastral: new Date().toISOString().split('T')[0],
    motivoSituacaoCadastral: null,
    dataInicioAtividade: mockData.dataAbertura,

    // ✅ Campos com mapeamento direto
    porte: mockData.porte,
    capitalSocial: mockData.capitalSocial.toString(),
    situacaoCadastral: mockData.situacaoCadastral,
    dataAbertura: mockData.dataAbertura,

    // 🔄 CNAE - nome diferente
    cnaePrincipal: mockData.cnaesPrimario,
    cnaesSecundarios: mockData.cnaesSecundarios,

    // ✅ Objetos aninhados
    endereco: {
      logradouro: mockData.endereco.logradouro,
      numero: mockData.endereco.numero,
      complemento: mockData.endereco.complemento || null,
      bairro: mockData.endereco.bairro,
      cep: mockData.endereco.cep,
      municipio: mockData.endereco.municipio,
      uf: mockData.endereco.uf,
    },

    contatos: {
      email: mockData.contatos.email || null,
      telefone: mockData.contatos.telefone || null,
      telefone2: null,
      fax: null,
    },

    socios: mockData.socios.map((socio) => ({
      nome: socio.nome,
      cpfCnpj: socio.cpfCnpj || null,
      qualificacao: socio.qualificacao,
      dataEntrada: socio.dataEntrada || null,
    })),
  }
}

/**
 * Reverte porte enum para código
 */
function reversePorteCode(porte: string): string {
  const map: Record<string, string> = {
    MEI: '01',
    ME: '03',
    EPP: '05',
    MEDIO: '07',
    GRANDE: '09',
  }
  return map[porte] || '03'
}

/**
 * Reverte situação enum para código
 */
function reverseSituacaoCode(situacao: string): string {
  const map: Record<string, string> = {
    ATIVA: '02',
    SUSPENSA: '03',
    INAPTA: '04',
    BAIXADA: '08',
    NULA: '01',
  }
  return map[situacao] || '02'
}

// ================================================================
// FUNÇÕES DE ARRAY (para listas)
// ================================================================

/**
 * Transforma array de API para array de Mock
 */
export function transformAPIArrayToMock(
  apiArray: SmartCNPJCompanyAPI[]
): SmartCNPJCompanyMock[] {
  return apiArray.map(transformAPIToMock)
}

/**
 * Transforma array de Mock para array de API
 */
export function transformMockArrayToAPI(
  mockArray: SmartCNPJCompanyMock[]
): SmartCNPJCompanyAPI[] {
  return mockArray.map(transformMockToAPI)
}

// ================================================================
// FUNÇÕES DE VALIDAÇÃO
// ================================================================

/**
 * Valida se os dados da API estão completos e válidos
 */
export function validateAPIData(data: SmartCNPJCompanyAPI): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validações obrigatórias
  if (!data.cnpj || data.cnpj.length !== 14) {
    errors.push('CNPJ inválido ou ausente')
  }
  if (!data.razaoSocial || data.razaoSocial.trim() === '') {
    errors.push('Razão Social é obrigatória')
  }
  if (!data.endereco || typeof data.endereco !== 'object') {
    errors.push('Endereço é obrigatório')
  }
  if (!data.contatos || typeof data.contatos !== 'object') {
    errors.push('Contatos são obrigatórios')
  }
  if (!data.cnaePrincipal || typeof data.cnaePrincipal !== 'object') {
    errors.push('CNAE Principal é obrigatório')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitiza dados da API removendo campos null/undefined opcionais
 */
export function sanitizeAPIData(
  data: SmartCNPJCompanyAPI
): SmartCNPJCompanyAPI {
  return {
    ...data,
    nomeFantasia: data.nomeFantasia || null,
    motivoSituacaoCadastral: data.motivoSituacaoCadastral || null,
    endereco: {
      ...data.endereco,
      complemento: data.endereco.complemento || null,
    },
    contatos: {
      ...data.contatos,
      email: data.contatos.email || null,
      telefone: data.contatos.telefone || null,
      telefone2: data.contatos.telefone2 || null,
      fax: data.contatos.fax || null,
    },
    socios: data.socios.map((socio) => ({
      ...socio,
      cpfCnpj: socio.cpfCnpj || null,
      dataEntrada: socio.dataEntrada || null,
    })),
  }
}
