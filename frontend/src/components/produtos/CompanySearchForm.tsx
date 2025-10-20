"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/forms/FormInput"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateCNPJ } from "@/lib/utils/validators"
import { formatCNPJ, cleanDocument } from "@/lib/utils/formatters"
import { TIPO_PESQUISA_OPTIONS } from "@/constants/filters"

const searchSchema = z.object({
  searchType: z.enum(["CNPJ", "RAZAO_SOCIAL", "NOME_FANTASIA"]),
  searchValue: z.string().min(1, "Campo obrigatório"),
}).refine((data) => {
  if (data.searchType === "CNPJ") {
    return validateCNPJ(data.searchValue)
  }
  return true
}, {
  message: "CNPJ inválido",
  path: ["searchValue"],
})

type SearchFormData = z.infer<typeof searchSchema>

interface CompanySearchFormProps {
  onSearch: (data: SearchFormData) => void
  isLoading?: boolean
}

export function CompanySearchForm({ onSearch, isLoading = false }: CompanySearchFormProps) {
  const [searchType, setSearchType] = useState<"CNPJ" | "RAZAO_SOCIAL" | "NOME_FANTASIA">("CNPJ")
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchType: "CNPJ",
      searchValue: "",
    },
  })

  const searchValue = watch("searchValue")

  const handleSearchTypeChange = (type: "CNPJ" | "RAZAO_SOCIAL" | "NOME_FANTASIA") => {
    setSearchType(type)
    setValue("searchType", type)
    setValue("searchValue", "") // Limpa ao trocar tipo
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (searchType === "CNPJ") {
      // Aplica máscara de CNPJ
      value = formatCNPJ(value)
    }

    setValue("searchValue", value)
  }

  const handleClear = () => {
    reset()
    setSearchType("CNPJ")
  }

  const onSubmit = (data: SearchFormData) => {
    // Remove formatação do CNPJ antes de enviar
    const cleanedData = {
      ...data,
      searchValue: data.searchType === "CNPJ" ? cleanDocument(data.searchValue) : data.searchValue,
    }
    onSearch(cleanedData)
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
          Buscar Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tipo de Pesquisa */}
          <div className="space-y-2">
            <label className="text-xs font-medium sm:text-sm">Tipo de Pesquisa</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {TIPO_PESQUISA_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={searchType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSearchTypeChange(option.value as any)}
                  disabled={isLoading}
                  className="w-full text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Campo de Busca */}
          <FormInput
            label={
              searchType === "CNPJ"
                ? "CNPJ"
                : searchType === "RAZAO_SOCIAL"
                ? "Razão Social"
                : "Nome Fantasia"
            }
            placeholder={
              searchType === "CNPJ"
                ? "00.000.000/0000-00"
                : searchType === "RAZAO_SOCIAL"
                ? "Digite a razão social..."
                : "Digite o nome fantasia..."
            }
            {...register("searchValue")}
            onChange={handleInputChange}
            error={errors.searchValue?.message}
            required
            disabled={isLoading}
          />

          {/* Botões */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              className="flex-1 transition-all hover:scale-[1.02] active:scale-95 hover:shadow-primary"
              disabled={isLoading}
              loading={isLoading}
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isLoading || !searchValue}
              className="sm:w-auto transition-all hover:scale-[1.02] active:scale-95"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>

          {/* Dica */}
          <div className="rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground sm:p-3 border border-muted transition-colors hover:bg-muted/70">
            <strong>Dica:</strong> Para buscar por CNPJ, digite apenas os números ou use a
            formatação completa (XX.XXX.XXX/XXXX-XX).
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
