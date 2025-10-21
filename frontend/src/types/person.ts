/**
 * Tipos relacionados a Pessoa Física (PF)
 */

export type Sexo = "M" | "F" | "O" | "NI"

export type EstadoCivil = 
  | "SOLTEIRO" 
  | "CASADO" 
  | "DIVORCIADO" 
  | "VIUVO" 
  | "SEPARADO" 
  | "UNIAO_ESTAVEL" 
  | "NAO_INFORMADO"

export type StatusPF = "REGULAR" | "PENDENCIAS" | "RESTRICOES"

/**
 * Interface principal de Pessoa Física
 */
export interface Person {
  id: string
  cpf: string
  nomeCompleto: string
  dataNascimento: string
  idade: number
  sexo: Sexo
  estadoCivil: EstadoCivil
  uf: string
  municipio: string
  status: StatusPF
  email?: string
  telefone?: string
  createdAt: string
  updatedAt: string
}

/**
 * Dados resumidos para exibição na tabela
 */
export interface PersonTableData {
  id: string
  cpf: string
  nomeCompleto: string
  idade: number
  sexo: string
  uf: string
  municipio: string
  status: StatusPF
}

/**
 * Filtros para busca de pessoas
 */
export interface PersonSearchFilters {
  uf?: string
  sexo?: Sexo
  estadoCivil?: EstadoCivil
  faixaEtaria?: string
  idadeMin?: number
  idadeMax?: number
}

/**
 * Resultado de busca paginado
 */
export interface PersonSearchResult {
  data: Person[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}
