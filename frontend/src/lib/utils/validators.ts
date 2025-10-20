/**
 * Validadores para documentos brasileiros
 */

/**
 * Valida CNPJ
 * @param cnpj - CNPJ com ou sem formatação
 */
export function validateCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, "")

  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) return false

  // Verifica se todos dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false

  // Validação dos dígitos verificadores
  let size = numbers.length - 2
  let nums = numbers.substring(0, size)
  const digits = numbers.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(nums.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  size = size + 1
  nums = numbers.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(nums.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

/**
 * Valida CPF
 * @param cpf - CPF com ou sem formatação
 */
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "")

  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false

  // Verifica se todos dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i)
  }
  let result = (sum * 10) % 11
  if (result === 10 || result === 11) result = 0
  if (result !== parseInt(numbers.charAt(9))) return false

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i)
  }
  result = (sum * 10) % 11
  if (result === 10 || result === 11) result = 0
  if (result !== parseInt(numbers.charAt(10))) return false

  return true
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida telefone brasileiro (10 ou 11 dígitos)
 */
export function validatePhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, "")
  return numbers.length === 10 || numbers.length === 11
}

/**
 * Valida CEP (8 dígitos)
 */
export function validateCEP(cep: string): boolean {
  const numbers = cep.replace(/\D/g, "")
  return numbers.length === 8
}

/**
 * Valida se string não está vazia (remove espaços)
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Valida tamanho mínimo
 */
export function validateMinLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Valida tamanho máximo
 */
export function validateMaxLength(value: string, max: number): boolean {
  return value.length <= max
}

/**
 * Valida URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida se é número
 */
export function validateNumber(value: string): boolean {
  return !isNaN(Number(value))
}

/**
 * Valida se número está em range
 */
export function validateNumberRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}
