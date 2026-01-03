/**
 * Constantes de Filtros - Smart CNPJ
 * Mapeamento entre frontend e backend (códigos da Receita Federal)
 */

// ================================================================
// SITUAÇÃO CADASTRAL
// ================================================================

export const SITUACAO_CADASTRAL = {
  '01': 'Nula',
  '02': 'Ativa',
  '03': 'Suspensa',
  '04': 'Inapta',
  '08': 'Baixada',
} as const

export type SituacaoCadastralCodigo = keyof typeof SITUACAO_CADASTRAL

// ================================================================
// PORTE DA EMPRESA
// ================================================================

export const PORTE_EMPRESA = {
  '00': 'Não Informado',
  '01': 'Microempresa (ME)',
  '03': 'Empresa de Pequeno Porte (EPP)',
  '05': 'Microempreendedor Individual (MEI)',
  '07': 'Médio Porte',
  '09': 'Grande Porte',
} as const

export type PorteEmpresaCodigo = keyof typeof PORTE_EMPRESA

// ================================================================
// UF (ESTADOS)
// ================================================================

export const UF_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const

export type UF = typeof UF_BRASIL[number]

// ================================================================
// NATUREZA JURÍDICA (principais)
// ================================================================

export const NATUREZAS_JURIDICAS_PRINCIPAIS = {
  '2062': 'Sociedade Empresária Limitada',
  '2135': 'Empresário Individual',
  '2240': 'Sociedade Anônima Fechada',
  '2305': 'Sociedade Anônima Aberta',
  '2011': 'Empresa Individual de Responsabilidade Limitada (EIRELI)',
  '2143': 'Sociedade Empresária em Nome Coletivo',
  '2151': 'Sociedade Empresária em Comandita Simples',
  '2194': 'Sociedade Empresária em Comandita por Ações',
  '2046': 'Sociedade Simples Pura',
  '2054': 'Sociedade Simples Limitada',
  '3999': 'Associação Privada',
  '3034': 'Serviço Social Autônomo',
  '1015': 'Órgão Público do Poder Executivo Federal',
  '1023': 'Órgão Público do Poder Executivo Estadual',
  '1031': 'Órgão Público do Poder Executivo Municipal',
} as const

export type NaturezaJuridicaCodigo = keyof typeof NATUREZAS_JURIDICAS_PRINCIPAIS

// ================================================================
// FILTROS SUPORTADOS PELA API
// ================================================================

export interface FiltrosSmartCNPJ {
  // ✅ Filtros implementados no backend
  uf?: string                      // Códigos: AC, AL, SP, RJ...
  situacao?: string                // Códigos: 02, 03, 04, 08
  porte?: string                   // Códigos: 01, 03, 05, 07, 09
  natureza_juridica?: string       // Código da natureza jurídica
  capital_social_min?: number      // Valor mínimo
  capital_social_max?: number      // Valor máximo
  data_abertura_inicio?: string    // ISO 8601: YYYY-MM-DD
  data_abertura_fim?: string       // ISO 8601: YYYY-MM-DD
}

// ================================================================
// HELPERS
// ================================================================

/**
 * Converte código de situação para label
 */
export function getSituacaoLabel(codigo: string): string {
  return SITUACAO_CADASTRAL[codigo as SituacaoCadastralCodigo] || codigo
}

/**
 * Converte código de porte para label
 */
export function getPorteLabel(codigo: string): string {
  return PORTE_EMPRESA[codigo as PorteEmpresaCodigo] || codigo
}

/**
 * Converte código de natureza jurídica para label
 */
export function getNaturezaLabel(codigo: string): string {
  return NATUREZAS_JURIDICAS_PRINCIPAIS[codigo as NaturezaJuridicaCodigo] || codigo
}

/**
 * Valida se UF é válida
 */
export function isValidUF(uf: string): uf is UF {
  return UF_BRASIL.includes(uf as UF)
}

/**
 * Formata valor monetário
 */
export function formatCapitalSocial(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// ================================================================
// FAIXAS DE CAPITAL SOCIAL (para selects)
// ================================================================

export const FAIXAS_CAPITAL_SOCIAL = [
  { label: 'Até R$ 10 mil', min: 0, max: 10000 },
  { label: 'R$ 10 mil - R$ 50 mil', min: 10000, max: 50000 },
  { label: 'R$ 50 mil - R$ 100 mil', min: 50000, max: 100000 },
  { label: 'R$ 100 mil - R$ 500 mil', min: 100000, max: 500000 },
  { label: 'R$ 500 mil - R$ 1 milhão', min: 500000, max: 1000000 },
  { label: 'R$ 1 milhão - R$ 5 milhões', min: 1000000, max: 5000000 },
  { label: 'Acima de R$ 5 milhões', min: 5000000, max: undefined },
] as const
