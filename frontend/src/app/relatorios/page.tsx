'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  FileText,
  Download,
  Calendar,
  Package,
  Settings,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HardDrive,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Loader2,
  FileSpreadsheet,
  File
} from 'lucide-react'
import { 
  mockReports,
  reportTemplates,
  reportStats,
  exportUsage,
  type Report,
  type ReportTemplate
} from '@/mocks/reports'

export default function RelatoriosPage() {
  const [activeView, setActiveView] = useState<'list' | 'templates'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'READY' | 'GENERATING' | 'FAILED' | 'EXPIRED'>('ALL')
  const [filterFormat, setFilterFormat] = useState<'ALL' | 'PDF' | 'EXCEL' | 'CSV' | 'TXT'>('ALL')

  // Filtrar relatórios
  const filteredReports = mockReports.filter(report => {
    const matchSearch = searchQuery === '' || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchStatus = filterStatus === 'ALL' || report.status === filterStatus
    const matchFormat = filterFormat === 'ALL' || report.format === filterFormat
    
    return matchSearch && matchStatus && matchFormat
  })

  // Calcular porcentagem de uso
  const usagePercentage = (exportUsage.used / exportUsage.limit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              Relatórios e Exportações
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere relatórios consolidados de suas consultas
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 border-blue-200 dark:border-blue-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{reportStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prontos</p>
                <p className="text-2xl font-bold">{reportStats.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 border-orange-200 dark:border-orange-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gerando</p>
                <p className="text-2xl font-bold">{reportStats.generating}</p>
              </div>
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          </Card>

          <Card className="p-4 border-purple-200 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">{reportStats.totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4 border-indigo-200 dark:border-indigo-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">{reportStats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-500" />
            </div>
          </Card>
        </div>

        {/* Export Usage Card */}
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Limite de Exportações</h3>
              <p className="text-sm text-muted-foreground">{exportUsage.period}</p>
            </div>
            <Badge variant="outline" className="text-lg">
              {exportUsage.used} / {exportUsage.limit}
            </Badge>
          </div>

          <Progress value={usagePercentage} className="h-2 mb-4" />

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <p className="text-sm font-semibold">{exportUsage.byFormat.PDF}</p>
              <p className="text-xs text-muted-foreground">PDF</p>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-sm font-semibold">{exportUsage.byFormat.EXCEL}</p>
              <p className="text-xs text-muted-foreground">Excel</p>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <File className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-sm font-semibold">{exportUsage.byFormat.CSV}</p>
              <p className="text-xs text-muted-foreground">CSV</p>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
              <File className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="text-sm font-semibold">{exportUsage.byFormat.TXT}</p>
              <p className="text-xs text-muted-foreground">TXT</p>
            </div>
          </div>

          {usagePercentage >= 80 && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-700 dark:text-orange-400">
                  Limite próximo de ser atingido
                </p>
                <p className="text-muted-foreground">
                  Você usou {exportUsage.used} de {exportUsage.limit} exportações disponíveis neste mês. 
                  Considere fazer upgrade do seu plano.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* View Tabs */}
        <Card className="p-6">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <Button
                variant={activeView === 'list' ? 'default' : 'outline'}
                onClick={() => setActiveView('list')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Meus Relatórios ({reportStats.total})
              </Button>
              <Button
                variant={activeView === 'templates' ? 'default' : 'outline'}
                onClick={() => setActiveView('templates')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Gerar Novo Relatório
              </Button>
            </div>
          </div>

          {activeView === 'list' ? (
            <>
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar relatórios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Status:</span>
                  </div>
                  <Button
                    variant={filterStatus === 'ALL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('ALL')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === 'READY' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('READY')}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Prontos
                  </Button>
                  <Button
                    variant={filterStatus === 'GENERATING' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('GENERATING')}
                  >
                    <Loader2 className="h-3 w-3 mr-1" />
                    Gerando
                  </Button>
                  <Button
                    variant={filterStatus === 'FAILED' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('FAILED')}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Falhou
                  </Button>

                  <div className="w-px h-6 bg-border mx-2" />

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Formato:</span>
                  </div>
                  <Button
                    variant={filterFormat === 'ALL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterFormat('ALL')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterFormat === 'PDF' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterFormat('PDF')}
                  >
                    PDF
                  </Button>
                  <Button
                    variant={filterFormat === 'EXCEL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterFormat('EXCEL')}
                  >
                    Excel
                  </Button>
                  <Button
                    variant={filterFormat === 'CSV' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterFormat('CSV')}
                  >
                    CSV
                  </Button>
                  <Button
                    variant={filterFormat === 'TXT' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterFormat('TXT')}
                  >
                    TXT
                  </Button>
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {searchQuery || filterStatus !== 'ALL' || filterFormat !== 'ALL'
                        ? 'Nenhum relatório encontrado com os filtros aplicados'
                        : 'Nenhum relatório gerado ainda'
                      }
                    </p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </>
          )}
        </Card>

      </div>
    </div>
  )
}

// Componente para cada card de relatório
function ReportCard({ report }: { report: Report }) {
  const statusConfig = {
    READY: { 
      label: 'Pronto', 
      color: 'bg-green-500', 
      icon: CheckCircle,
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    },
    GENERATING: { 
      label: 'Gerando', 
      color: 'bg-orange-500', 
      icon: Loader2,
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50'
    },
    FAILED: { 
      label: 'Falhou', 
      color: 'bg-red-500', 
      icon: XCircle,
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    },
    EXPIRED: { 
      label: 'Expirado', 
      color: 'bg-gray-500', 
      icon: Clock,
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50'
    }
  }

  const formatConfig = {
    PDF: { icon: FileText, color: 'text-red-500' },
    EXCEL: { icon: FileSpreadsheet, color: 'text-green-500' },
    CSV: { icon: File, color: 'text-blue-500' },
    TXT: { icon: File, color: 'text-purple-500' }
  }

  const status = statusConfig[report.status]
  const format = formatConfig[report.format]
  const StatusIcon = status.icon
  const FormatIcon = format.icon

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className={`p-4 hover:shadow-md transition-all border-l-4 ${
      report.status === 'READY' ? 'border-l-green-500' : 
      report.status === 'GENERATING' ? 'border-l-orange-500' :
      report.status === 'FAILED' ? 'border-l-red-500' : 'border-l-gray-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${status.bgColor}`}>
            <FormatIcon className={`h-6 w-6 ${format.color}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{report.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {report.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={`${status.color} text-white border-transparent text-xs`}>
                    <StatusIcon className={`h-3 w-3 mr-1 ${report.status === 'GENERATING' ? 'animate-spin' : ''}`} />
                    {status.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {report.format}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Criado: {formatDateTime(report.createdAt)}</span>
              </div>
              {report.completedAt && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Concluído: {formatDateTime(report.completedAt)}</span>
                </div>
              )}
              {report.fileSize && (
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  <span>{report.fileSize}</span>
                </div>
              )}
              {report.status === 'READY' && (
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{report.downloadCount} download(s)</span>
                </div>
              )}
            </div>

            {/* Expires */}
            {report.expiresAt && report.status === 'READY' && (
              <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                <Calendar className="h-3 w-3 inline mr-1" />
                Expira em: {formatDateTime(report.expiresAt)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {report.status === 'READY' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          )}
          
          {report.status === 'GENERATING' && (
            <Button size="sm" variant="outline" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Aguarde...
            </Button>
          )}

          {(report.status === 'READY' || report.status === 'EXPIRED') && (
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Detalhes
            </Button>
          )}

          {report.status === 'FAILED' && (
            <Button size="sm" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Componente para cada template
function TemplateCard({ template }: { template: ReportTemplate }) {
  const iconMap: Record<string, any> = {
    FileText,
    Calendar,
    Package,
    Settings
  }

  const Icon = iconMap[template.icon] || FileText

  return (
    <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-l-blue-500">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{template.name}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tempo estimado:</span>
          <span className="font-medium">{template.estimatedTime}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Custo em créditos:</span>
          <Badge variant="outline" className="font-semibold">
            {template.requiredCredits} créditos
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Formatos disponíveis:</span>
          <div className="flex gap-1">
            {template.availableFormats.map(format => (
              <Badge key={format} variant="secondary" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
        <Plus className="h-4 w-4 mr-2" />
        Gerar Relatório
      </Button>
    </Card>
  )
}
