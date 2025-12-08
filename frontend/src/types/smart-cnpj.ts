/**
 * Tipos TypeScript para Smart CNPJ 360° API
 * Issue 2.2.2 - Alinhar Tipos TypeScript com Backend
 * 
 * Baseado nos schemas Pydantic do backend:
 * backend/app/schemas/smart_cnpj_response.py
 */

// ================================================================
// TIPOS DE OBJETOS ANINHADOS
// ================================================================

/**
 * Endereço do estabelecimento
 * Alinhado com: EnderecoResponse (Pydantic)
 */
export interface Endereco {
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cep: string
  municipio: string
  uf: string
}

/**
 * Contatos do estabelecimento
 * Alinhado com: ContatosResponse (Pydantic)
 */
export interface Contatos {
  email: string | null
  telefone: string | null
  telefone2: string | null
  fax: string | null
}

/**
 * CNAE - Classificação Nacional de Atividades Econômicas
 * Alinhado com: CNAEResponse (Pydantic)
 */
export interface CNAE {
  codigo: string
  descricao: string
}

/**
 * Sócio da empresa
 * Alinhado com: SocioResponse (Pydantic)
 */
export interface Socio {
  nome: string
  cpfCnpj: string | null
  qualificacao: string
  dataEntrada: string | null
}

// ================================================================
// INTERFACE PRINCIPAL - API RESPONSE
// ================================================================

/**
 * Response completo do Smart CNPJ 360° (do backend)
 * Alinhado com: SmartCNPJCompanyResponse (Pydantic)
 * 
 * Esta interface representa EXATAMENTE o que o backend retorna
 */
export interface SmartCNPJCompanyAPI {
  // Identificação
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  
  // Natureza Jurídica (NOVO - não existe no mock)
  naturezaJuridica: string
  codigoNaturezaJuridica: string
  
  // Porte e Capital
  porte: string                    // Descrição: "Microempresa", "Pequena", etc
  codigoPorte: string              // Código: "01", "03", "05"
  capitalSocial: string            // Decimal vem como string do backend
  
  // Situação Cadastral
  situacaoCadastral: string        // Descrição: "Ativa", "Inapta", etc
  codigoSituacaoCadastral: string  // Código: "02", "04", etc
  dataSituacaoCadastral: string    // ISO 8601: "2023-05-10"
  motivoSituacaoCadastral: string | null
  
  // Datas
  dataInicioAtividade: string      // ISO 8601: "2020-01-15"
  dataAbertura: string             // ISO 8601: "2020-01-15"
  
  // Objetos aninhados
  endereco: Endereco
  contatos: Contatos
  cnaePrincipal: CNAE              // ⚠️ BACKEND USA "cnaePrincipal"
  cnaesSecundarios: CNAE[]
  socios: Socio[]
}

// ================================================================
// INTERFACE DO FRONTEND (Mock - será substituída)
// ================================================================

/**
 * Interface usada atualmente no frontend (dados mock)
 * Esta interface será SUBSTITUÍDA pela SmartCNPJCompanyAPI
 * 
 * Mantida aqui temporariamente para compatibilidade
 */
export interface SmartCNPJCompanyMock {
  id: string                       // ❌ NÃO EXISTE NO BACKEND
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  situacaoCadastral: 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA'
  tipo: 'MATRIZ' | 'FILIAL'        // ❌ NÃO EXISTE NO BACKEND
  porte: 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE'
  capitalSocial: number
  isMEI: boolean                   // ❌ NÃO EXISTE NO BACKEND (calcular)
  isSimplesNacional: boolean       // ❌ NÃO EXISTE NO BACKEND
  formaTributacao: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'  // ❌ NÃO EXISTE
  dataAbertura: string
  cnaesPrimario: CNAE              // ⚠️ NOME DIFERENTE (mock usa "cnaesPrimario", backend "cnaePrincipal")
  cnaesSecundarios: CNAE[]
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

// ================================================================
// TIPOS DE RESPOSTA PAGINADA
// ================================================================

/**
 * Metadados de paginação
 * Alinhado com: PaginationMetadata (Pydantic)
 */
export interface PaginationMetadata {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  isEstimate?: boolean  // Se total é estimado (LIMIT+1 pattern) ou exato
}

/**
 * Response de busca paginada
 * Alinhado com: SmartCNPJSearchResponse (Pydantic)
 */
export interface SmartCNPJSearchResponse {
  data: SmartCNPJCompanyAPI[]
  pagination: PaginationMetadata
  filters: Record<string, any>
  searchType: string
  searchValue: string
  tempoResposta?: number
}

// ================================================================
// TIPOS DE REQUEST
// ================================================================

/**
 * Tipos de busca disponíveis
 */
export type TipoBusca = 
  | 'cnpj'
  | 'razao_social'
  | 'nome_fantasia'
  | 'cnae'           // Busca por código CNAE
  | 'segmento'
  | 'email'
  | 'telefone'
  | 'socio'
  | 'cep'

/**
 * Filtros de busca
 */
export interface SmartCNPJFiltros {
  uf?: string
  situacao?: string
  porte?: string
  natureza_juridica?: string
  capital_social_min?: number
  capital_social_max?: number
  data_abertura_inicio?: string
  data_abertura_fim?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  limit?: number // Quantidade de resultados por página
}

/**
 * Request para busca em lote
 * Alinhado com: POST /api/v1/smart-cnpj/bulk
 */
export interface SmartCNPJBulkSearchRequest {
  tipo_busca: TipoBusca
  valor_busca: string
  filtros?: SmartCNPJFiltros
  page?: number
  limit?: number
}

// ================================================================
// TIPOS DE HISTÓRICO E ESTATÍSTICAS
// ================================================================

/**
 * Item de histórico de busca
 */
export interface SmartCNPJHistoricoItem {
  id: number
  tipo_busca: string
  valor_busca: string
  resultados_encontrados: number
  tempo_resposta: number
  data_pesquisa: string
  usuario_id?: number
}

/**
 * Response de histórico paginado
 */
export interface SmartCNPJHistoricoResponse {
  data: SmartCNPJHistoricoItem[]
  pagination: PaginationMetadata
}

/**
 * Estatísticas de uso
 */
export interface SmartCNPJEstatisticas {
  total_buscas: number
  empresas_unicas: number
  tipos_busca: Record<string, number>
  buscas_por_periodo: {
    hoje: number
    semana: number
    mes: number
  }
  tempo_medio_resposta: number
}

// ================================================================
// MAPEAMENTO DE CAMPOS (Documentação)
// ================================================================

/**
 * DIFERENÇAS ENTRE MOCK E API:
 * 
 * ❌ Campos que NÃO EXISTEM no backend:
 * - id: string (gerado localmente no mock)
 * - tipo: 'MATRIZ' | 'FILIAL' (pode ser calculado)
 * - isMEI: boolean (calcular: codigoPorte === '01')
 * - isSimplesNacional: boolean (não disponível)
 * - formaTributacao: string (não disponível)
 * 
 * ➕ Campos NOVOS do backend:
 * - naturezaJuridica: string
 * - codigoNaturezaJuridica: string
 * - codigoPorte: string
 * - codigoSituacaoCadastral: string
 * - dataSituacaoCadastral: string
 * - motivoSituacaoCadastral: string | null
 * - dataInicioAtividade: string
 * - contatos.telefone2: string | null
 * - contatos.fax: string | null
 * 
 * 🔄 Campos com NOMES DIFERENTES:
 * - cnaesPrimario (mock) → cnaePrincipal (backend)
 * 
 * 🔄 Campos com TIPOS DIFERENTES:
 * - capitalSocial: number (mock) → string (backend - Decimal)
 * - porte: enum limitado (mock) → string livre (backend)
 * - situacaoCadastral: enum limitado (mock) → string livre (backend)
 */

// ================================================================
// TYPE GUARDS E VALIDAÇÕES
// ================================================================

/**
 * Verifica se um objeto é uma empresa válida da API
 */
export function isSmartCNPJCompanyAPI(obj: any): obj is SmartCNPJCompanyAPI {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.cnpj === 'string' &&
    typeof obj.razaoSocial === 'string' &&
    typeof obj.naturezaJuridica === 'string' &&
    typeof obj.endereco === 'object' &&
    typeof obj.contatos === 'object' &&
    typeof obj.cnaePrincipal === 'object' &&
    Array.isArray(obj.cnaesSecundarios) &&
    Array.isArray(obj.socios)
  )
}

/**
 * Valida se um CNPJ está no formato correto
 */
export function isValidCNPJFormat(cnpj: string): boolean {
  // Aceita com ou sem formatação
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  return cleanCNPJ.length === 14
}

// ================================================================
// TIPOS DE EXPORTAÇÃO
// ================================================================

/**
 * Formatos de exportação disponíveis
 */
export type ExportFormat = 'csv' | 'xlsx' | 'json'

/**
 * Opções para exportação de dados
 */
export interface ExportOptions {
  cnpjs: string[]
  format: ExportFormat
  campos?: string[]
}

/**
 * Request para download de arquivo exportado
 */
export interface DownloadRequest {
  options: ExportOptions
  filename: string
}
