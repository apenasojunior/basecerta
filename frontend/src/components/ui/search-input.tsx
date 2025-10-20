"use client"

import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface SearchInputProps extends Omit<InputProps, "onChange"> {
  onSearch?: (value: string) => void
  onClear?: () => void
  debounceMs?: number
  isLoading?: boolean
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      onClear,
      debounceMs = 500,
      isLoading = false,
      showClearButton = true,
      className,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState<string>("")
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (value) {
        timeoutRef.current = setTimeout(() => {
          onSearch?.(value)
        }, debounceMs)
      } else {
        // Se limpar, chama imediatamente
        onSearch?.("")
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [value, debounceMs, onSearch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    }

    const handleClear = () => {
      setValue("")
      onClear?.()
      onSearch?.("")
    }

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          className={cn("pl-10 pr-20", className)}
          {...props}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          
          {showClearButton && value && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleClear}
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput }
