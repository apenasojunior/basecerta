"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCPF, formatCNPJ, cleanDocument } from "@/lib/utils/formatters"
import { validateCPF, validateCNPJ } from "@/lib/utils/validators"

interface FinancialSearchFormProps {
  type: "cpf" | "cnpj"
  onSearch: (data: { document: string }) => void
  isLoading?: boolean
}

// Schema dinâmico baseado no tipo
const createSchema = (type: "cpf" | "cnpj") => {
  if (type === "cpf") {
    return z.object({
      document: z
        .string()
        .min(1, "CPF é obrigatório")
        .refine((val) => cleanDocument(val).length === 11, {
          message: "CPF deve ter 11 dígitos",
        })
        .refine((val) => validateCPF(val), {
          message: "CPF inválido",
        }),
    })
  } else {
    return z.object({
      document: z
        .string()
        .min(1, "CNPJ é obrigatório")
        .refine((val) => cleanDocument(val).length === 14, {
          message: "CNPJ deve ter 14 dígitos",
        })
        .refine((val) => validateCNPJ(val), {
          message: "CNPJ inválido",
        }),
    })
  }
}

export function FinancialSearchForm({ type, onSearch, isLoading = false }: FinancialSearchFormProps) {
  const [documentValue, setDocumentValue] = useState("")

  const schema = createSchema(type)
  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = type === "cpf" ? formatCPF(value) : formatCNPJ(value)
    setDocumentValue(formatted)
    setValue("document", formatted, { shouldValidate: true })
  }

  const handleClear = () => {
    setDocumentValue("")
    reset()
  }

  const onSubmit = (data: FormData) => {
    onSearch({
      document: cleanDocument(data.document),
    })
  }

  const placeholder = type === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"
  const label = type === "cpf" ? "CPF" : "CNPJ"
  const helpText = type === "cpf" 
    ? "Digite o CPF (apenas números ou formatado)" 
    : "Digite o CNPJ (apenas números ou formatado)"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document">{label}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="document"
            type="text"
            placeholder={placeholder}
            value={documentValue}
            onChange={handleDocumentChange}
            className={`pl-9 pr-9 ${errors.document ? "border-destructive" : ""}`}
            disabled={isLoading}
            autoComplete="off"
          />
          {documentValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {errors.document ? (
          <p className="text-sm text-destructive">{errors.document.message}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Buscar Dossiê
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isLoading || !documentValue}
        >
          Limpar
        </Button>
      </div>
    </form>
  )
}
