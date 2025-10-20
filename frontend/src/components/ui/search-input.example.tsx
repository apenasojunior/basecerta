"use client"

import { useState } from "react"
import { SearchInput } from "@/components/ui/search-input"

/**
 * SearchInput Component - Input de busca com debounce e ícones
 * 
 * @example
 * // Busca básica
 * <SearchInput
 *   placeholder="Buscar..."
 *   onSearch={(value) => console.log('Buscando:', value)}
 * />
 * 
 * @example
 * // Busca com loading
 * const [isLoading, setIsLoading] = useState(false)
 * 
 * <SearchInput
 *   placeholder="Buscar produtos..."
 *   isLoading={isLoading}
 *   onSearch={async (value) => {
 *     setIsLoading(true)
 *     await fetchProducts(value)
 *     setIsLoading(false)
 *   }}
 * />
 * 
 * @example
 * // Busca com debounce customizado
 * <SearchInput
 *   placeholder="Buscar CNPJ..."
 *   debounceMs={1000}
 *   onSearch={(value) => searchCompany(value)}
 * />
 * 
 * @example
 * // Busca sem botão limpar
 * <SearchInput
 *   placeholder="Buscar..."
 *   showClearButton={false}
 *   onSearch={(value) => console.log(value)}
 * />
 * 
 * @example
 * // Busca com callback de limpar
 * <SearchInput
 *   placeholder="Buscar..."
 *   onSearch={(value) => console.log('Buscando:', value)}
 *   onClear={() => console.log('Busca limpa')}
 * />
 */

export default function SearchInputExample() {
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    console.log("Buscando:", value)
    
    if (!value) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    // Simula uma busca na API
    setTimeout(() => {
      const mockResults = [
        `Resultado 1 para "${value}"`,
        `Resultado 2 para "${value}"`,
        `Resultado 3 para "${value}"`,
      ]
      setSearchResults(mockResults)
      setIsLoading(false)
    }, 1000)
  }

  const handleClear = () => {
    console.log("Busca limpa")
    setSearchResults([])
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">SearchInput Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Busca Básica</h3>
            <SearchInput
              placeholder="Digite para buscar..."
              onSearch={(value) => console.log("Busca simples:", value)}
            />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Busca com Loading</h3>
            <SearchInput
              placeholder="Buscar produtos..."
              isLoading={isLoading}
              onSearch={handleSearch}
              onClear={handleClear}
            />
            
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Resultados:</p>
                <ul className="space-y-1">
                  {searchResults.map((result, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Debounce Rápido (300ms)</h3>
            <SearchInput
              placeholder="Busca instantânea..."
              debounceMs={300}
              onSearch={(value) => console.log("Busca rápida:", value)}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Debounce de 300ms para busca mais responsiva
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Debounce Lento (1500ms)</h3>
            <SearchInput
              placeholder="Busca com delay..."
              debounceMs={1500}
              onSearch={(value) => console.log("Busca lenta:", value)}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Debounce de 1500ms para economizar requisições
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Sem Botão Limpar</h3>
            <SearchInput
              placeholder="Buscar..."
              showClearButton={false}
              onSearch={(value) => console.log("Sem botão limpar:", value)}
            />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Exemplos Contextuais</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Buscar CNPJ
                </label>
                <SearchInput
                  placeholder="00.000.000/0000-00"
                  debounceMs={800}
                  onSearch={(value) => console.log("CNPJ:", value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Buscar Empresa
                </label>
                <SearchInput
                  placeholder="Nome da empresa..."
                  onSearch={(value) => console.log("Empresa:", value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Buscar CPF
                </label>
                <SearchInput
                  placeholder="000.000.000-00"
                  debounceMs={800}
                  onSearch={(value) => console.log("CPF:", value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Buscar Processo
                </label>
                <SearchInput
                  placeholder="Número do processo..."
                  onSearch={(value) => console.log("Processo:", value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-semibold">💡 Dicas de Uso</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• O debounce padrão é de 500ms</li>
              <li>• Use debounce maior (800-1000ms) para buscas custosas</li>
              <li>• Use debounce menor (300ms) para buscas locais/rápidas</li>
              <li>• O botão limpar (X) aparece automaticamente quando há texto</li>
              <li>• O spinner de loading substitui o botão limpar</li>
              <li>• Limpar o campo dispara onSearch("") imediatamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
