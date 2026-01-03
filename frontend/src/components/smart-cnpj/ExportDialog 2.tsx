'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { FileDown, FileSpreadsheet, FileJson, Loader2, CheckCircle2 } from 'lucide-react'
import { useSmartCNPJExport, useSmartCNPJDownload } from '@/hooks/useSmartCNPJ'
import { toast } from '@/lib/toast'
import type { ExportFormat, ExportOptions } from '@/types/smart-cnpj'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cnpjs: string[]
  defaultFormat?: ExportFormat
}

export function ExportDialog({
  open,
  onOpenChange,
  cnpjs,
  defaultFormat = 'csv',
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>(defaultFormat)
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'cnpj',
    'razaoSocial',
    'nomeFantasia',
    'situacaoCadastral',
    'porte',
  ])

  const exportMutation = useSmartCNPJExport()
  const downloadMutation = useSmartCNPJDownload()

  // Campos disponíveis para exportação
  const availableFields = [
    { id: 'cnpj', label: 'CNPJ', group: 'Identificação' },
    { id: 'razaoSocial', label: 'Razão Social', group: 'Identificação' },
    { id: 'nomeFantasia', label: 'Nome Fantasia', group: 'Identificação' },
    { id: 'situacaoCadastral', label: 'Situação Cadastral', group: 'Status' },
    { id: 'dataSituacaoCadastral', label: 'Data Situação', group: 'Status' },
    { id: 'motivoSituacaoCadastral', label: 'Motivo Situação', group: 'Status' },
    { id: 'porte', label: 'Porte', group: 'Classificação' },
    { id: 'naturezaJuridica', label: 'Natureza Jurídica', group: 'Classificação' },
    { id: 'capitalSocial', label: 'Capital Social', group: 'Financeiro' },
    { id: 'dataAbertura', label: 'Data Abertura', group: 'Datas' },
    { id: 'dataInicioAtividade', label: 'Início Atividade', group: 'Datas' },
    { id: 'cnaePrincipal', label: 'CNAE Principal', group: 'Atividade' },
    { id: 'endereco', label: 'Endereço Completo', group: 'Localização' },
    { id: 'uf', label: 'UF', group: 'Localização' },
    { id: 'municipio', label: 'Município', group: 'Localização' },
    { id: 'bairro', label: 'Bairro', group: 'Localização' },
    { id: 'cep', label: 'CEP', group: 'Localização' },
    { id: 'email', label: 'E-mail', group: 'Contato' },
    { id: 'telefone', label: 'Telefone', group: 'Contato' },
    { id: 'socios', label: 'Sócios', group: 'Sociedade' },
  ]

  // Agrupar campos por categoria
  const groupedFields = availableFields.reduce((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = []
    }
    acc[field.group].push(field)
    return acc
  }, {} as Record<string, typeof availableFields>)

  // Toggle campo individual
  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    )
  }

  // Selecionar todos os campos de um grupo
  const toggleGroup = (group: string, fields: typeof availableFields) => {
    const groupFieldIds = fields.map(f => f.id)
    const allSelected = groupFieldIds.every(id => selectedFields.includes(id))
    
    if (allSelected) {
      setSelectedFields(prev => prev.filter(id => !groupFieldIds.includes(id)))
    } else {
      setSelectedFields(prev => [...new Set([...prev, ...groupFieldIds])])
    }
  }

  // Selecionar campos básicos
  const selectBasicFields = () => {
    setSelectedFields([
      'cnpj',
      'razaoSocial',
      'nomeFantasia',
      'situacaoCadastral',
      'porte',
    ])
  }

  // Selecionar todos os campos
  const selectAllFields = () => {
    setSelectedFields(availableFields.map(f => f.id))
  }

  // Desselecionar todos
  const deselectAll = () => {
    setSelectedFields([])
  }

  // Executar export
  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error('Selecione pelo menos um campo para exportar')
      return
    }

    const options: ExportOptions = {
      cnpjs,
      format,
      campos: selectedFields,
    }

    try {
      // Gerar arquivo e fazer download direto
      await downloadMutation.mutateAsync({
        options,
        filename: `empresas_${new Date().toISOString().split('T')[0]}.${format}`,
      })

      toast.success(`Arquivo ${format.toUpperCase()} baixado com sucesso!`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao exportar dados. Tente novamente.')
      console.error('Export error:', error)
    }
  }

  const formatIcons = {
    csv: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    json: FileJson,
  }

  const FormatIcon = formatIcons[format]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary-600" />
            Exportar Empresas
          </DialogTitle>
          <DialogDescription>
            Exporte {cnpjs.length} {cnpjs.length === 1 ? 'empresa' : 'empresas'} nos formatos CSV, XLSX ou JSON
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formato */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Formato do Arquivo</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`relative flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                    format === 'csv'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormat('csv')}
                >
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="font-medium">CSV</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Planilhas e Excel</p>
                  </Label>
                </div>

                <div
                  className={`relative flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                    format === 'xlsx'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormat('xlsx')}
                >
                  <RadioGroupItem value="xlsx" id="xlsx" />
                  <Label htmlFor="xlsx" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="font-medium">XLSX</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Excel nativo</p>
                  </Label>
                </div>

                <div
                  className={`relative flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                    format === 'json'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormat('json')}
                >
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      <span className="font-medium">JSON</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">APIs e sistemas</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Seleção de Campos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                Campos para Exportar
                <Badge variant="secondary" className="ml-2">
                  {selectedFields.length} selecionados
                </Badge>
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectBasicFields}
                  className="text-xs"
                >
                  Básicos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllFields}
                  className="text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAll}
                  className="text-xs"
                >
                  Nenhum
                </Button>
              </div>
            </div>

            <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
              {Object.entries(groupedFields).map(([group, fields]) => {
                const groupFieldIds = fields.map(f => f.id)
                const allSelected = groupFieldIds.every(id => selectedFields.includes(id))
                const someSelected = groupFieldIds.some(id => selectedFields.includes(id))

                return (
                  <div key={group} className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => toggleGroup(group, fields)}
                        className={someSelected && !allSelected ? 'opacity-50' : ''}
                      />
                      <Label className="text-sm font-semibold text-gray-700 cursor-pointer">
                        {group}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {fields.filter(f => selectedFields.includes(f.id)).length}/{fields.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      {fields.map(field => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Checkbox
                            id={field.id}
                            checked={selectedFields.includes(field.id)}
                            onCheckedChange={() => toggleField(field.id)}
                          />
                          <Label
                            htmlFor={field.id}
                            className="text-sm cursor-pointer hover:text-primary-600"
                          >
                            {field.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          {selectedFields.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Preview da Exportação:</p>
              <div className="flex flex-wrap gap-1">
                {selectedFields.map(fieldId => {
                  const field = availableFields.find(f => f.id === fieldId)
                  return (
                    <Badge key={fieldId} variant="secondary" className="text-xs">
                      {field?.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={downloadMutation.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={downloadMutation.isPending || selectedFields.length === 0}>
            {downloadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <FormatIcon className="h-4 w-4" />
                Exportar {format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
