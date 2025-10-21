"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Search, X, Building2, Mail, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateCNPJ } from "@/lib/utils/validators"
import { formatCNPJ, cleanDocument } from "@/lib/utils/formatters"

const searchTypes = [
  { value: "CNPJ", label: "CNPJ", icon: Building2 },
  { value: "RAZAO_SOCIAL", label: "Razão Social", icon: FileText },
  { value: "NOME_FANTASIA", label: "Nome Fantasia", icon: Building2 },
  { value: "INSCRICAO_ESTADUAL", label: "Inscrição Estadual", icon: FileText },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "TELEFONE", label: "Telefone", icon: Phone },
] as const

type SearchType = typeof searchTypes[number]["value"]

const createSchema = (searchType: SearchType) => {
  const baseSchema = z.object({
    searchType: z.string(),
    searchValue: z.string().min(1, "Campo obrigatório"),
  })

  if (searchType === "CNPJ") {
    return baseSchema.extend({
      searchValue: z.string()
        .min(14, "CNPJ deve ter 14 dígitos")
        .refine((val) => validateCNPJ(val.replace(/\D/g, "")), {
          message: "CNPJ inválido",
        }),
    })
  }

  if (searchType === "RAZAO_SOCIAL" || searchType === "NOME_FANTASIA") {
    return baseSchema.extend({
      searchValue: z.string().min(3, "Digite pelo menos 3 caracteres"),
    })
  }

  if (searchType === "INSCRICAO_ESTADUAL") {
    return baseSchema.extend({
      searchValue: z.string().min(9, "Inscrição Estadual deve ter pelo menos 9 dígitos"),
    })
  }

  if (searchType === "EMAIL") {
    return baseSchema.extend({
      searchValue: z.string().email("Email inválido"),
    })
  }

  if (searchType === "TELEFONE") {
    return baseSchema.extend({
      searchValue: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    })
  }

  return baseSchema
}

type SearchFormData = z.infer<ReturnType<typeof createSchema>>

interface CompanySearchFormProps {
  onSearch: (data: SearchFormData) => void
  isLoading?: boolean
}

export function CompanySearchForm({ onSearch, isLoading = false }: CompanySearchFormProps) {
  const [searchType, setSearchType] = useState<SearchType>("CNPJ")
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(createSchema(searchType)),
    defaultValues: {
      searchType: "CNPJ",
      searchValue: "",
    },
  })

  const searchValue = watch("searchValue")

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value as SearchType)
    setValue("searchType", value)
    setValue("searchValue", "")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Auto-formatação de CNPJ
    if (searchType === "CNPJ") {
      value = formatCNPJ(value)
    }

    // Auto-formatação de telefone
    if (searchType === "TELEFONE") {
      value = value.replace(/\D/g, "")
      if (value.length <= 11) {
        if (value.length <= 10) {
          value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
        } else {
          value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3")
        }
      }
    }

    setValue("searchValue", value)
  }

  const handleClear = () => {
    reset()
    setValue("searchValue", "")
  }

  const onSubmit = (data: any) => {
    // Remove formatação do CNPJ antes de enviar
    const cleanedData = {
      ...data,
      searchValue: data.searchType === "CNPJ" ? cleanDocument(data.searchValue) : data.searchValue,
    }
    onSearch(cleanedData)
  }

  const selectedType = searchTypes.find((t) => t.value === searchType)
  const Icon = selectedType?.icon || Search

  const getPlaceholder = () => {
    switch (searchType) {
      case "CNPJ":
        return "00.000.000/0000-00"
      case "RAZAO_SOCIAL":
        return "Ex: Empresa LTDA"
      case "NOME_FANTASIA":
        return "Ex: Minha Empresa"
      case "INSCRICAO_ESTADUAL":
        return "Ex: 123456789"
      case "EMAIL":
        return "Ex: contato@empresa.com"
      case "TELEFONE":
        return "Ex: (11) 98765-4321"
      default:
        return "Digite para buscar..."
    }
  }

  const getHelpText = () => {
    switch (searchType) {
      case "CNPJ":
        return "Digite apenas os números do CNPJ (14 dígitos)"
      case "RAZAO_SOCIAL":
        return "Digite a razão social ou parte dela (mínimo 3 caracteres)"
      case "NOME_FANTASIA":
        return "Digite o nome fantasia ou parte dele (mínimo 3 caracteres)"
      case "INSCRICAO_ESTADUAL":
        return "Digite a inscrição estadual sem formatação"
      case "EMAIL":
        return "Digite o email cadastrado na empresa"
      case "TELEFONE":
        return "Digite o telefone com DDD (10 ou 11 dígitos)"
      default:
        return ""
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Tipo de busca */}
      <div className="space-y-2">
        <Label htmlFor="searchType">Tipo de Busca</Label>
        <Select value={searchType} onValueChange={handleSearchTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {searchTypes.map((type) => {
              const TypeIcon = type.icon
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Campo de busca */}
      <div className="space-y-2">
        <Label htmlFor="searchValue">{selectedType?.label}</Label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="searchValue"
            {...register("searchValue")}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {errors.searchValue && (
          <p className="text-sm text-destructive">{errors.searchValue.message}</p>
        )}
        {!errors.searchValue && (
          <p className="text-xs text-muted-foreground">{getHelpText()}</p>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
        >
          Limpar
        </Button>
      </div>
    </form>
  )
}

