import { useEffect, useState } from "react"

/**
 * Hook para debounce de valores
 * Útil para otimizar buscas e inputs que disparam requests
 * 
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState("")
 * const debouncedSearch = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     // Fazer busca na API
 *     searchAPI(debouncedSearch)
 *   }
 * }, [debouncedSearch])
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Cria timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancela o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de callbacks/funções
 * Útil para otimizar eventos como scroll, resize, etc
 * 
 * @param callback - Função a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Função debounced
 * 
 * @example
 * ```tsx
 * const handleSearch = (term: string) => {
 *   console.log("Searching:", term)
 * }
 * 
 * const debouncedSearch = useDebouncedCallback(handleSearch, 300)
 * 
 * return <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Cleanup ao desmontar
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return (...args: Parameters<T>) => {
    // Cancela timeout anterior se existir
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Cria novo timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }
}
