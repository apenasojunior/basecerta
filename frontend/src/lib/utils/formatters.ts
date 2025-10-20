/**
 * Utilitários de formatação para documentos brasileiros
 */

/**
 * Formata CNPJ para o padrão XX.XXX.XXX/XXXX-XX
 * @example formatCNPJ("12345678000190") => "12.345.678/0001-90"
 */
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "")
  
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
}

/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 * @example formatCPF("12345678900") => "123.456.789-00"
 */
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, "")
  
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
}

/**
 * Formata telefone brasileiro
 * @example formatPhone("11987654321") => "(11) 98765-4321"
 */
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "")
  
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

/**
 * Formata CEP para o padrão XXXXX-XXX
 * @example formatCEP("12345678") => "12345-678"
 */
export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, "")
  
  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
}

/**
 * Formata valor monetário em BRL
 * @example formatCurrency(1234.56) => "R$ 1.234,56"
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue)
}

/**
 * Formata data para pt-BR
 * @example formatDate(new Date("2024-01-15")) => "15/01/2024"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat("pt-BR").format(dateObj)
}

/**
 * Formata data e hora para pt-BR
 * @example formatDateTime(new Date()) => "15/01/2024 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

/**
 * Formata número com separadores de milhares
 * @example formatNumber(1234567) => "1.234.567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

/**
 * Remove toda formatação de um documento
 * @example cleanDocument("12.345.678/0001-90") => "12345678000190"
 */
export function cleanDocument(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * Formata porcentagem
 * @example formatPercent(0.1234) => "12,34%"
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
