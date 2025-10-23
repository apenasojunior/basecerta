'use client'

import { AlertTriangle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface CostConfirmationModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  costCredits: number
  productName?: string
  cpf?: string
}

export function CostConfirmationModal({
  open,
  onConfirm,
  onCancel,
  costCredits,
  productName = 'Dossiê 360° PF',
  cpf,
}: CostConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">Confirmar Consulta</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Você está prestes a realizar uma consulta que consumirá créditos da sua conta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Produto */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Produto:</span>
              <span className="font-semibold text-gray-900">{productName}</span>
            </div>
            
            {cpf && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">CPF:</span>
                <span className="font-mono text-gray-900">{cpf}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Custo:</span>
              <Badge variant="secondary" className="bg-primary-100 text-primary-700 border-primary-200">
                <CreditCard className="h-3 w-3 mr-1" />
                {costCredits} {costCredits === 1 ? 'crédito' : 'créditos'}
              </Badge>
            </div>
          </div>
          
          {/* Aviso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Sobre os créditos
                </h4>
                <p className="text-sm text-blue-700">
                  Os créditos serão debitados imediatamente após a confirmação e 
                  não poderão ser reembolsados, mesmo que não encontre resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Confirmar e Consultar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
