"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Search, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { validateCPF } from "@/lib/utils/validators"
import { formatCPF, cleanDocument } from "@/lib/utils/formatters"

const SEARCH_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "nome", label: "Nome Completo" },
]

const searchSchema = z.object({
  searchType: z.enum(["cpf", "nome"]),
  searchValue: z.string().min(1, "Campo obrigatório"),
}).refine((data) => {
  if (data.searchType === "cpf") {
    const cleanedCPF = cleanDocument(data.searchValue)
    return validateCPF(cleanedCPF)
  }
  return data.searchValue.length >= 3
}, {
  message: "CPF inválido ou nome deve ter pelo menos 3 caracteres",
  path: ["searchValue"],
})

type SearchFormData = z.infer<typeof searchSchema>

interface PersonSearchFormProps {
  onSearch: (data: SearchFormData) => void
  isLoading?: boolean
}

export function PersonSearchForm({ onSearch, isLoading }: PersonSearchFormProps) {
  const [searchType, setSearchType] = useState<"cpf" | "nome">("cpf")
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchType: "cpf",
      searchValue: "",
    },
  })

  const searchValue = watch("searchValue")

  // Auto-formatar CPF durante digitação
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchType === "cpf") {
      const value = e.target.value
      const cleaned = cleanDocument(value)
      const formatted = formatCPF(cleaned)
      setValue("searchValue", formatted, { shouldValidate: true })
    } else {
      setValue("searchValue", e.target.value, { shouldValidate: true })
    }
  }

  const handleSearchTypeChange = (value: string) => {
    const newType = value as "cpf" | "nome"
    setSearchType(newType)
    setValue("searchType", newType)
    setValue("searchValue", "")
  }

  const handleClear = () => {
    reset()
    setSearchType("cpf")
  }

  const onSubmit = (data: SearchFormData) => {
    onSearch(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Tipo de Busca */}
      <div className="space-y-2">
        <Label>Tipo de Busca</Label>
        <Select value={searchType} onValueChange={handleSearchTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campo de Busca */}
      <div className="space-y-2">
        <Label htmlFor="searchValue">
          {searchType === "cpf" ? "CPF" : "Nome Completo"}
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="searchValue"
            {...register("searchValue")}
            onChange={handleCPFChange}
            placeholder={
              searchType === "cpf"
                ? "000.000.000-00"
                : "Digite o nome completo"
            }
            className="pl-9 pr-9"
            disabled={isLoading}
            maxLength={searchType === "cpf" ? 14 : undefined}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setValue("searchValue", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {errors.searchValue && (
          <p className="text-sm text-destructive">{errors.searchValue.message}</p>
        )}
        {searchType === "cpf" && (
          <p className="text-xs text-muted-foreground">
            Digite apenas os números do CPF
          </p>
        )}
        {searchType === "nome" && (
          <p className="text-xs text-muted-foreground">
            Mínimo de 3 caracteres para buscar
          </p>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
          disabled={isLoading}
          loading={isLoading}
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar Pessoa Física
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </div>

      {/* Info adicional */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Dica:</strong> Para buscar por CPF, digite apenas os números. A formatação será aplicada automaticamente.
          </p>
        </div>
      </div>
    </form>
  )
}
