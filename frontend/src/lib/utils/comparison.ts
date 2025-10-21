import { CompanyData } from "@/components/produtos/CompanyTable"

export type HighlightType = "best" | "worst" | "neutral" | "warning"

export interface ComparisonField {
  key: keyof CompanyData
  label: string
  format?: (value: any, company: CompanyData) => string
  highlight?: (values: any[], companies: CompanyData[]) => HighlightType[]
  sortOrder?: "asc" | "desc" // Para valores numéricos: asc = menor é melhor, desc = maior é melhor
}

/**
 * Configuração dos campos para comparação
 */
export const comparisonFields: ComparisonField[] = [
  {
    key: "cnpj",
    label: "CNPJ",
    format: (value) => value,
  },
  {
    key: "razaoSocial",
    label: "Razão Social",
    format: (value) => value,
  },
  {
    key: "nomeFantasia",
    label: "Nome Fantasia",
    format: (value) => value || "-",
  },
  {
    key: "situacao",
    label: "Situação Cadastral",
    format: (value) => value,
    highlight: (values) => {
      return values.map((v) => {
        if (v === "ATIVA") return "best"
        if (v === "SUSPENSA") return "warning"
        if (v === "INAPTA" || v === "BAIXADA" || v === "NULA") return "worst"
        return "neutral"
      })
    },
  },
  {
    key: "porte",
    label: "Porte da Empresa",
    format: (value) => {
      const labels: Record<string, string> = {
        MEI: "MEI",
        ME: "Microempresa",
        EPP: "Empresa de Pequeno Porte",
        MEDIA: "Empresa Média",
        GRANDE: "Empresa Grande",
      }
      return labels[value] || value
    },
    highlight: (values) => {
      // Considera maior porte como melhor (mais estruturada)
      const porteOrder: Record<string, number> = {
        MEI: 1,
        ME: 2,
        EPP: 3,
        MEDIA: 4,
        GRANDE: 5,
      }

      const scores = values.map((v) => porteOrder[v] || 0)
      const maxScore = Math.max(...scores)
      const minScore = Math.min(...scores)

      return scores.map((score) => {
        if (score === maxScore && maxScore !== minScore) return "best"
        if (score === minScore && maxScore !== minScore) return "neutral"
        return "neutral"
      })
    },
  },
  {
    key: "uf",
    label: "UF",
    format: (value) => value,
  },
  {
    key: "municipio",
    label: "Município",
    format: (value) => value,
  },
  {
    key: "dataAbertura",
    label: "Data de Abertura",
    format: (value, company) => {
      if (!value) return "-"

      // Calcula idade da empresa
      const abertura = new Date(value)
      const hoje = new Date()
      const diffMs = hoje.getTime() - abertura.getTime()
      const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))

      return `${value} (${diffYears} anos)`
    },
    highlight: (values, companies) => {
      // Empresa mais antiga = melhor (mais experiente)
      const dates = values.map((v, idx) => {
        if (!v) return 0
        return new Date(v).getTime()
      })

      const oldest = Math.min(...dates.filter((d) => d > 0))
      const newest = Math.max(...dates.filter((d) => d > 0))

      return dates.map((date) => {
        if (date === 0) return "neutral"
        if (date === oldest && oldest !== newest) return "best"
        if (date === newest && oldest !== newest) return "neutral"
        return "neutral"
      })
    },
  },
]

/**
 * Retorna classe CSS baseada no tipo de highlight
 */
export function getHighlightClass(type: HighlightType): string {
  const classes = {
    best: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    worst: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
    neutral: "bg-background border-border text-foreground",
  }
  return classes[type]
}

/**
 * Retorna ícone baseado no tipo de highlight
 */
export function getHighlightIcon(type: HighlightType): string {
  const icons = {
    best: "✓",
    worst: "✗",
    warning: "⚠",
    neutral: "",
  }
  return icons[type]
}

/**
 * Prepara dados para exportação da comparação
 */
export function prepareComparisonExport(companies: CompanyData[]) {
  const data: any[] = []

  comparisonFields.forEach((field) => {
    const row: any = { campo: field.label }

    companies.forEach((company, idx) => {
      const value = company[field.key]
      const formatted = field.format ? field.format(value, company) : value
      row[`empresa${idx + 1}`] = formatted
    })

    data.push(row)
  })

  return data
}
