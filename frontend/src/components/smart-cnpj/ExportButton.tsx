'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileDown, FileSpreadsheet, FileJson, Settings2 } from 'lucide-react'
import { ExportDialog } from './ExportDialog'
import { useSmartCNPJDownload } from '@/hooks/useSmartCNPJ'
import { toast } from '@/lib/toast'
import type { ExportFormat, ExportOptions } from '@/types/smart-cnpj'

interface ExportButtonProps {
  cnpjs: string[]
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  showLabel?: boolean
}

export function ExportButton({
  cnpjs,
  variant = 'outline',
  size = 'default',
  disabled = false,
  showLabel = true,
}: ExportButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const downloadMutation = useSmartCNPJDownload()

  // Export rápido com campos básicos
  const quickExport = async (format: ExportFormat) => {
    const options: ExportOptions = {
      cnpjs,
      format,
      campos: ['cnpj', 'razaoSocial', 'nomeFantasia', 'situacaoCadastral', 'porte'],
    }

    try {
      await downloadMutation.mutateAsync({
        options,
        filename: `empresas_${new Date().toISOString().split('T')[0]}.${format}`,
      })

      toast.success(`Arquivo ${format.toUpperCase()} baixado com sucesso!`)
    } catch (error) {
      toast.error('Erro ao exportar dados. Tente novamente.')
      console.error('Export error:', error)
    }
  }

  const isEmpty = cnpjs.length === 0
  const isDisabled = disabled || isEmpty || downloadMutation.isPending

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={isDisabled}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            {showLabel && (
              <>
                Exportar
                {cnpjs.length > 0 && (
                  <span className="ml-1 text-xs opacity-75">({cnpjs.length})</span>
                )}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-gray-500">
            Export Rápido (campos básicos)
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => quickExport('csv')}
            disabled={downloadMutation.isPending}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">CSV</div>
              <div className="text-xs text-gray-500">Planilhas e Excel</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => quickExport('xlsx')}
            disabled={downloadMutation.isPending}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">XLSX</div>
              <div className="text-xs text-gray-500">Excel nativo</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => quickExport('json')}
            disabled={downloadMutation.isPending}
            className="gap-2"
          >
            <FileJson className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">JSON</div>
              <div className="text-xs text-gray-500">APIs e sistemas</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-gray-500">
            Export Personalizado
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setDialogOpen(true)}
            disabled={downloadMutation.isPending}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">Personalizar</div>
              <div className="text-xs text-gray-500">Escolher campos e formato</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cnpjs={cnpjs}
      />
    </>
  )
}
