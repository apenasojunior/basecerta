"use client"

import { useState } from "react"
import { FileDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { exportToCSV, exportToExcel } from "@/lib/utils/export"
import { toast } from "@/lib/toast"

export type ExportFormat = "csv" | "excel" | "pdf"

export interface ExportField {
  id: string
  label: string
  enabled?: boolean
}

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: any[]
  availableFields: ExportField[]
  filename?: string
}

export function ExportModal({
  open,
  onOpenChange,
  title,
  data,
  availableFields,
  filename = "export",
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("csv")
  const [fields, setFields] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    availableFields.forEach((field) => {
      initial[field.id] = field.enabled ?? true
    })
    return initial
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleToggleField = (fieldId: string) => {
    setFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleSelectAll = () => {
    const allSelected = Object.values(fields).every((v) => v)
    const newFields: Record<string, boolean> = {}
    availableFields.forEach((field) => {
      newFields[field.id] = !allSelected
    })
    setFields(newFields)
  }

  const handleExport = async () => {
    const selectedFields = Object.entries(fields)
      .filter(([_, enabled]) => enabled)
      .map(([id]) => id)

    if (selectedFields.length === 0) {
      toast.warning("Selecione ao menos um campo para exportar")
      return
    }

    setIsExporting(true)

    try {
      if (format === "csv") {
        exportToCSV(data, filename, selectedFields)
        toast.success("Arquivo CSV baixado com sucesso")
      } else if (format === "excel") {
        exportToExcel(data, filename, selectedFields)
        toast.success("Arquivo Excel baixado com sucesso")
      } else if (format === "pdf") {
        toast.info("Exportação PDF será implementada em breve")
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao exportar:", error)
      toast.error("Ocorreu um erro ao exportar os dados")
    } finally {
      setIsExporting(false)
    }
  }

  const selectedCount = Object.values(fields).filter((v) => v).length
  const allSelected = selectedCount === availableFields.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar {title}</DialogTitle>
          <DialogDescription>
            Selecione o formato e os campos que deseja exportar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seleção de Formato */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formato de Exportação</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="csv" id="csv" />
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label htmlFor="csv" className="cursor-pointer font-medium">
                      CSV
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Compatível com Excel, Google Sheets
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="excel" id="excel" />
                <div className="flex items-center gap-2 flex-1">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label htmlFor="excel" className="cursor-pointer font-medium">
                      Excel
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Formatação e fórmulas preservadas
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border border-border p-3 opacity-50 cursor-not-allowed">
                <RadioGroupItem value="pdf" id="pdf" disabled />
                <div className="flex items-center gap-2 flex-1">
                  <FileDown className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label htmlFor="pdf" className="cursor-not-allowed font-medium">
                      PDF
                    </Label>
                    <p className="text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Seleção de Campos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Campos para Exportar</Label>
              <Button
                variant="link"
                size="sm"
                onClick={handleSelectAll}
                className="h-auto p-0 text-xs"
              >
                {allSelected ? "Desmarcar todos" : "Selecionar todos"}
              </Button>
            </div>

            <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-lg border border-border p-3">
              {availableFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={fields[field.id]}
                    onCheckedChange={() => handleToggleField(field.id)}
                  />
                  <Label
                    htmlFor={field.id}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {selectedCount} de {availableFields.length} campos selecionados
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedCount === 0}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
