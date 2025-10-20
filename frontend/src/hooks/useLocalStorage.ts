import { useState, useEffect, useCallback } from "react"

/**
 * Hook para gerenciar estado sincronizado com localStorage
 * Persiste automaticamente mudanças e sincroniza entre tabs
 * 
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial caso não exista no localStorage
 * @returns [value, setValue, removeValue] - Tuple com valor, setter e remover
 * 
 * @example
 * ```tsx
 * const [user, setUser, removeUser] = useLocalStorage("user", null)
 * 
 * // Salvar
 * setUser({ name: "João", email: "joao@example.com" })
 * 
 * // Remover
 * removeUser()
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Função para atualizar o valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permite valor ser uma função como setState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          
          // Dispara evento customizado para sincronização entre componentes
          window.dispatchEvent(
            new CustomEvent("local-storage", {
              detail: { key, value: valueToStore },
            })
          )
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Função para remover o valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
        
        // Dispara evento customizado
        window.dispatchEvent(
          new CustomEvent("local-storage", {
            detail: { key, value: null },
          })
        )
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Sincroniza mudanças do localStorage entre tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        // Evento nativo do localStorage (entre tabs)
        if (e.key === key && e.newValue) {
          try {
            setStoredValue(JSON.parse(e.newValue))
          } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error)
          }
        }
      } else {
        // Evento customizado (mesma tab)
        const { key: eventKey, value } = e.detail
        if (eventKey === key) {
          setStoredValue(value !== null ? value : initialValue)
        }
      }
    }

    // Escuta eventos nativos (entre tabs)
    window.addEventListener("storage", handleStorageChange as EventListener)
    
    // Escuta eventos customizados (mesma tab)
    window.addEventListener("local-storage", handleStorageChange as EventListener)

    return () => {
      window.removeEventListener("storage", handleStorageChange as EventListener)
      window.removeEventListener("local-storage", handleStorageChange as EventListener)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook simplificado para gerenciar múltiplas configurações no localStorage
 * Ideal para preferências do usuário, settings, etc
 * 
 * @param key - Chave base do localStorage (ex: "app-settings")
 * @param initialSettings - Objeto com configurações iniciais
 * @returns [settings, updateSetting, resetSettings]
 * 
 * @example
 * ```tsx
 * const [settings, updateSetting, reset] = useSettings("user-prefs", {
 *   theme: "light",
 *   language: "pt-BR",
 *   notifications: true
 * })
 * 
 * // Atualizar uma configuração
 * updateSetting("theme", "dark")
 * 
 * // Resetar tudo
 * reset()
 * ```
 */
export function useSettings<T extends Record<string, any>>(
  key: string,
  initialSettings: T
): [T, <K extends keyof T>(key: K, value: T[K]) => void, () => void] {
  const [settings, setSettings, removeSettings] = useLocalStorage<T>(key, initialSettings)

  const updateSetting = useCallback(
    <K extends keyof T>(settingKey: K, value: T[K]) => {
      setSettings((prev) => ({
        ...prev,
        [settingKey]: value,
      }))
    },
    [setSettings]
  )

  return [settings, updateSetting, removeSettings]
}
