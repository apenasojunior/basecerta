import { UF_OPTIONS } from "./filters"

/**
 * Porte da empresa (Tamanho)
 */
export const PORTE_OPTIONS = [
  { value: "MEI", label: "MEI - Microempreendedor Individual" },
  { value: "ME", label: "ME - Microempresa" },
  { value: "EPP", label: "EPP - Empresa de Pequeno Porte" },
  { value: "MEDIO", label: "Médio Porte" },
  { value: "GRANDE", label: "Grande Porte" },
] as const

export type Porte = typeof PORTE_OPTIONS[number]["value"]

/**
 * Natureza Jurídica (principais tipos)
 */
export const NATUREZA_JURIDICA_OPTIONS = [
  { value: "LTDA", label: "Sociedade Limitada (LTDA)" },
  { value: "SA", label: "Sociedade Anônima (S.A.)" },
  { value: "EIRELI", label: "EIRELI - Empresa Individual" },
  { value: "EI", label: "Empresário Individual (EI)" },
  { value: "MEI", label: "Microempreendedor Individual (MEI)" },
  { value: "SLU", label: "Sociedade Limitada Unipessoal (SLU)" },
  { value: "COOPERATIVA", label: "Cooperativa" },
  { value: "ASSOCIACAO", label: "Associação" },
  { value: "FUNDACAO", label: "Fundação Privada" },
  { value: "OUTROS", label: "Outros" },
] as const

export type NaturezaJuridica = typeof NATUREZA_JURIDICA_OPTIONS[number]["value"]

/**
 * Situação Cadastral da empresa
 */
export const SITUACAO_CADASTRAL_OPTIONS = [
  { 
    value: "ATIVA", 
    label: "Ativa",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  { 
    value: "SUSPENSA", 
    label: "Suspensa",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  { 
    value: "INAPTA", 
    label: "Inapta",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
  { 
    value: "BAIXADA", 
    label: "Baixada",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  { 
    value: "NULA", 
    label: "Nula",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
] as const

export type SituacaoCadastral = typeof SITUACAO_CADASTRAL_OPTIONS[number]["value"]

/**
 * Faixa de Faturamento Anual (em milhões de R$)
 */
export const FAIXA_FATURAMENTO_OPTIONS = [
  { value: "0-360K", label: "Até R$ 360 mil (MEI)" },
  { value: "360K-4.8M", label: "R$ 360 mil - R$ 4,8 mi (ME)" },
  { value: "4.8M-300M", label: "R$ 4,8 mi - R$ 300 mi (EPP/Médio)" },
  { value: "300M+", label: "Acima de R$ 300 mi (Grande)" },
] as const

export type FaixaFaturamento = typeof FAIXA_FATURAMENTO_OPTIONS[number]["value"]

/**
 * Opções de data de abertura (faixas de anos)
 */
export const DATA_ABERTURA_OPTIONS = [
  { value: "0-1", label: "Menos de 1 ano" },
  { value: "1-3", label: "1 a 3 anos" },
  { value: "3-5", label: "3 a 5 anos" },
  { value: "5-10", label: "5 a 10 anos" },
  { value: "10-20", label: "10 a 20 anos" },
  { value: "20+", label: "Mais de 20 anos" },
] as const

export type DataAberturaRange = typeof DATA_ABERTURA_OPTIONS[number]["value"]

/**
 * Re-export UF options para conveniência
 */
export { UF_OPTIONS }
