/**
 * Constantes para filtros de produtos
 */

// Estados brasileiros
export const UF_OPTIONS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
] as const

// Situação cadastral de empresas
export const SITUACAO_OPTIONS = [
  { value: "ATIVA", label: "Ativa" },
  { value: "SUSPENSA", label: "Suspensa" },
  { value: "INAPTA", label: "Inapta" },
  { value: "BAIXADA", label: "Baixada" },
  { value: "NULA", label: "Nula" },
] as const

// Porte da empresa
export const PORTE_OPTIONS = [
  { value: "MEI", label: "MEI - Microempreendedor Individual" },
  { value: "ME", label: "ME - Microempresa" },
  { value: "EPP", label: "EPP - Empresa de Pequeno Porte" },
  { value: "MEDIA", label: "Empresa de Médio Porte" },
  { value: "GRANDE", label: "Empresa de Grande Porte" },
] as const

// Natureza jurídica (principais)
export const NATUREZA_JURIDICA_OPTIONS = [
  { value: "2062", label: "Sociedade Empresária Limitada" },
  { value: "2135", label: "Empresário Individual" },
  { value: "2305", label: "Sociedade Anônima Fechada" },
  { value: "2313", label: "Sociedade Anônima Aberta" },
  { value: "2240", label: "Sociedade Simples Limitada" },
  { value: "2046", label: "Sociedade Empresária em Nome Coletivo" },
  { value: "2054", label: "Sociedade Empresária em Comandita Simples" },
] as const

// Tipos de pesquisa
export const TIPO_PESQUISA_OPTIONS = [
  { value: "CNPJ", label: "CNPJ" },
  { value: "RAZAO_SOCIAL", label: "Razão Social" },
  { value: "NOME_FANTASIA", label: "Nome Fantasia" },
] as const

// Status de processos
export const STATUS_PROCESSO_OPTIONS = [
  { value: "EM_ANDAMENTO", label: "Em Andamento" },
  { value: "ARQUIVADO", label: "Arquivado" },
  { value: "SUSPENSO", label: "Suspenso" },
  { value: "BAIXADO", label: "Baixado" },
  { value: "EXTINTO", label: "Extinto" },
] as const

// Tipos de processo
export const TIPO_PROCESSO_OPTIONS = [
  { value: "CIVEL", label: "Cível" },
  { value: "CRIMINAL", label: "Criminal" },
  { value: "TRABALHISTA", label: "Trabalhista" },
  { value: "TRIBUTARIO", label: "Tributário" },
  { value: "FAMILIA", label: "Família" },
] as const

// Opções de ordenação
export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "name_asc", label: "Nome (A-Z)" },
  { value: "name_desc", label: "Nome (Z-A)" },
  { value: "date_desc", label: "Mais recentes" },
  { value: "date_asc", label: "Mais antigos" },
] as const

// Opções de paginação
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const

// Principais CNAEs (simplificado - em produção viria do backend)
export const CNAE_OPTIONS = [
  { value: "4711301", label: "4711-3/01 - Comércio varejista de mercadorias em geral" },
  { value: "4712100", label: "4712-1/00 - Comércio varejista de mercadorias em geral" },
  { value: "6201501", label: "6201-5/01 - Desenvolvimento de programas de computador sob encomenda" },
  { value: "6202300", label: "6202-3/00 - Desenvolvimento e licenciamento de programas de computador customizáveis" },
  { value: "4751201", label: "4751-2/01 - Comércio varejista especializado de equipamentos e suprimentos de informática" },
  { value: "4781400", label: "4781-4/00 - Comércio varejista de artigos do vestuário e acessórios" },
  { value: "5611201", label: "5611-2/01 - Restaurantes e similares" },
  { value: "5620101", label: "5620-1/01 - Fornecimento de alimentos preparados preponderantemente para empresas" },
] as const
