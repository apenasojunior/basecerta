'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  BellOff,
  User, 
  Building2, 
  Search, 
  Trash2, 
  Eye, 
  Calendar,
  Play,
  Pause,
  Plus,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Smartphone,
  TrendingUp,
  FileText,
  Shield,
  Activity
} from 'lucide-react'
import { 
  mockAlerts,
  mockAlertTriggers,
  alertStats,
  type Alert,
  type AlertTrigger
} from '@/mocks/favorites-alerts'
import Link from 'next/link'

export default function AlertasPage() {
  const [activeView, setActiveView] = useState<'alerts' | 'history'>('alerts')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'TRIGGERED'>('ALL')
  const [filterType, setFilterType] = useState<'ALL' | 'PF' | 'PJ'>('ALL')

  // Filtrar alertas
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchSearch = searchQuery === '' || 
      alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.document.includes(searchQuery)
    
    const matchStatus = filterStatus === 'ALL' || alert.status === filterStatus
    const matchType = filterType === 'ALL' || alert.type === filterType
    
    return matchSearch && matchStatus && matchType
  })

  // Filtrar histórico
  const filteredHistory = mockAlertTriggers.filter(trigger => {
    const matchSearch = searchQuery === '' || 
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.document.includes(searchQuery)
    
    return matchSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              Sistema de Alertas
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitore mudanças automáticas em seus favoritos
            </p>
          </div>
          
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Plus className="h-4 w-4 mr-2" />
            Criar Alerta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 border-blue-200 dark:border-blue-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alertas</p>
                <p className="text-2xl font-bold">{alertStats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">{alertStats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 border-yellow-200 dark:border-yellow-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pausados</p>
                <p className="text-2xl font-bold">{alertStats.paused}</p>
              </div>
              <Pause className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4 border-red-200 dark:border-red-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disparados</p>
                <p className="text-2xl font-bold">{alertStats.triggered}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-4 border-purple-200 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Não Visualizados</p>
                <p className="text-2xl font-bold">{alertStats.unviewedTriggers}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* View Tabs */}
        <Card className="p-6">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <Button
                variant={activeView === 'alerts' ? 'default' : 'outline'}
                onClick={() => setActiveView('alerts')}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Alertas Configurados ({alertStats.total})
              </Button>
              <Button
                variant={activeView === 'history' ? 'default' : 'outline'}
                onClick={() => setActiveView('history')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Histórico de Disparos ({alertStats.totalTriggers})
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou documento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtros - apenas para view de alertas */}
          {activeView === 'alerts' && (
            <div className="flex gap-2 mb-6 flex-wrap">
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
                variant={filterStatus === 'ACTIVE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ACTIVE')}
              >
                <Activity className="h-3 w-3 mr-1" />
                Ativos
              </Button>
              <Button
                variant={filterStatus === 'PAUSED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('PAUSED')}
              >
                <Pause className="h-3 w-3 mr-1" />
                Pausados
              </Button>
              <Button
                variant={filterStatus === 'TRIGGERED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('TRIGGERED')}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Disparados
              </Button>

              <div className="w-px h-6 bg-border mx-2" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tipo:</span>
              </div>
              <Button
                variant={filterType === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('ALL')}
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'PF' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('PF')}
              >
                <User className="h-3 w-3 mr-1" />
                PF
              </Button>
              <Button
                variant={filterType === 'PJ' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('PJ')}
              >
                <Building2 className="h-3 w-3 mr-1" />
                PJ
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            {activeView === 'alerts' ? (
              filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'ALL' || filterType !== 'ALL'
                      ? 'Nenhum alerta encontrado com os filtros aplicados'
                      : 'Nenhum alerta configurado ainda'
                    }
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )
            ) : (
              filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? 'Nenhum disparo encontrado'
                      : 'Nenhum alerta foi disparado ainda'
                    }
                  </p>
                </div>
              ) : (
                filteredHistory.map((trigger) => (
                  <TriggerCard key={trigger.id} trigger={trigger} />
                ))
              )
            )}
          </div>
        </Card>

      </div>
    </div>
  )
}

// Componente para cada card de alerta
function AlertCard({ alert }: { alert: Alert }) {
  const Icon = alert.type === 'PF' ? User : Building2
  const iconColor = alert.type === 'PF' ? 'text-blue-500' : 'text-purple-500'
  const bgColor = alert.type === 'PF' ? 'bg-blue-500/10' : 'bg-purple-500/10'
  
  const statusConfig = {
    ACTIVE: { label: 'Ativo', color: 'bg-green-500', icon: Activity },
    PAUSED: { label: 'Pausado', color: 'bg-yellow-500', icon: Pause },
    TRIGGERED: { label: 'Disparado', color: 'bg-red-500', icon: AlertCircle }
  }

  const frequencyLabels = {
    DAILY: 'Diário',
    WEEKLY: 'Semanal',
    MONTHLY: 'Mensal'
  }

  const status = statusConfig[alert.status]
  const StatusIcon = status.icon

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
      alert.status === 'TRIGGERED' ? 'border-l-red-500' : 
      alert.status === 'ACTIVE' ? 'border-l-green-500' : 'border-l-yellow-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{alert.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {alert.document}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${status.color} text-white border-transparent`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
            </div>

            {/* Frequência e Monitoramentos */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Frequência: <strong>{frequencyLabels[alert.frequency]}</strong></span>
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">Monitorando:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.monitoringTypes.map(type => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notificações */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className={`h-4 w-4 ${alert.notifications.email ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={alert.notifications.email ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                    Email
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className={`h-4 w-4 ${alert.notifications.push ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={alert.notifications.push ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                    Push
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Criado: {formatDateTime(alert.createdAt)}</span>
              </div>
              {alert.lastCheck && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Última verificação: {formatDateTime(alert.lastCheck)}</span>
                </div>
              )}
              {alert.lastTrigger && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Último disparo: {formatDateTime(alert.lastTrigger)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Disparos: {alert.triggerCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {alert.status === 'ACTIVE' ? (
            <Button size="sm" variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
          ) : (
            <Button size="sm" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Ativar
            </Button>
          )}
          
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
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

// Componente para cada card de disparo
function TriggerCard({ trigger }: { trigger: AlertTrigger }) {
  const severityConfig = {
    LOW: { label: 'Baixa', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    MEDIUM: { label: 'Média', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    HIGH: { label: 'Alta', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
    CRITICAL: { label: 'Crítica', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
  }

  const severity = severityConfig[trigger.severity]

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
    <Card className={`p-4 hover:shadow-md transition-all ${
      !trigger.viewed ? 'border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : ''
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${severity.bgColor}`}>
          <AlertCircle className={`h-6 w-6 ${severity.textColor}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{trigger.triggerType}</h3>
                <Badge className={`${severity.color} text-white border-transparent text-xs`}>
                  {severity.label}
                </Badge>
                {!trigger.viewed && (
                  <Badge variant="outline" className="bg-orange-500 text-white border-transparent text-xs">
                    Novo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{trigger.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{trigger.document}</p>
            </div>
          </div>

          <p className="text-sm mb-3">{trigger.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDateTime(trigger.triggeredAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>
    </Card>
  )
}
