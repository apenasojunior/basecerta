/**
 * Constantes para filtros de Pessoa Física
 */

import { UF_OPTIONS } from "./filters"

export { UF_OPTIONS }

/**
 * Opções de sexo
 */
export const SEXO_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Feminino" },
  { value: "O", label: "Outro" },
  { value: "NI", label: "Não Informado" },
] as const

/**
 * Opções de estado civil
 */
export const ESTADO_CIVIL_OPTIONS = [
  { value: "SOLTEIRO", label: "Solteiro(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUVO", label: "Viúvo(a)" },
  { value: "SEPARADO", label: "Separado(a)" },
  { value: "UNIAO_ESTAVEL", label: "União Estável" },
  { value: "NAO_INFORMADO", label: "Não Informado" },
] as const

/**
 * Faixas etárias pré-definidas
 */
export const FAIXA_ETARIA_OPTIONS = [
  { value: "18-25", label: "18 a 25 anos" },
  { value: "26-35", label: "26 a 35 anos" },
  { value: "36-45", label: "36 a 45 anos" },
  { value: "46-60", label: "46 a 60 anos" },
  { value: "61-100", label: "Acima de 60 anos" },
] as const

/**
 * Ranges de idade personalizados
 */
export const IDADE_MIN = 18
export const IDADE_MAX = 100

/**
 * Status da pessoa física
 */
export const STATUS_PF_OPTIONS = [
  { value: "REGULAR", label: "Regular", color: "bg-green-500" },
  { value: "PENDENCIAS", label: "Pendências", color: "bg-yellow-500" },
  { value: "RESTRICOES", label: "Restrições", color: "bg-red-500" },
] as const

/**
 * Tipos de pessoa física para filtros
 */
export type Sexo = typeof SEXO_OPTIONS[number]["value"]
export type EstadoCivil = typeof ESTADO_CIVIL_OPTIONS[number]["value"]
export type FaixaEtaria = typeof FAIXA_ETARIA_OPTIONS[number]["value"]
export type StatusPF = typeof STATUS_PF_OPTIONS[number]["value"]
