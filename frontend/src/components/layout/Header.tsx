'use client'

import { Bell, ChevronDown, Coins, Loader2, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useCredits } from '@/hooks/useCredits'
import { useLayout } from '@/contexts/LayoutContext'

interface HeaderProps {
  className?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function Header({ className, breadcrumbs = [] }: HeaderProps) {
  // Integração com API
  const { balance, total_added, isLoadingBalance } = useCredits()
  const { toggleMobileMenu } = useLayout()

  // Mock data - será substituído por dados reais da API
  const user = {
    name: 'João Silva',
    email: 'joao@empresa.com.br',
    avatar: '',
    initials: 'JS',
  }

  const credits = {
    available: balance ?? 150,
    total: total_added ?? 500,
  }

  const notifications = [
    {
      id: 1,
      title: 'Créditos recarregados',
      description: '500 créditos adicionados à sua conta',
      time: '5 min atrás',
      read: false,
    },
    {
      id: 2,
      title: 'Consulta concluída',
      description: 'Relatório de Empresa #1234 está disponível',
      time: '1 hora atrás',
      read: false,
    },
    {
      id: 3,
      title: 'Pagamento aprovado',
      description: 'Seu pagamento foi processado com sucesso',
      time: '2 horas atrás',
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header
      className={cn(
        'h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6',
        className
      )}
    >
      {/* Mobile Menu Button + Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 ? (
          <nav className="hidden sm:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <h1 className="text-base md:text-lg font-semibold text-gray-900">Dashboard</h1>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Credits Display */}
        <Link
          href="/configuracoes/financeiro"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors group"
        >
          {isLoadingBalance ? (
            <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
          ) : (
            <Coins className="h-5 w-5 text-primary-600" />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">Créditos</span>
            <span className="text-sm font-bold text-primary-600">
              {isLoadingBalance ? '...' : `${credits.available} / ${credits.total}`}
            </span>
          </div>
        </Link>

        {/* Mobile Credits - Icon only */}
        <Link
          href="/configuracoes/financeiro"
          className="sm:hidden p-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
        >
          {isLoadingBalance ? (
            <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
          ) : (
            <Coins className="h-5 w-5 text-primary-600" />
          )}
        </Link>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {unreadCount} novas
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3 cursor-pointer',
                    !notification.read && 'bg-primary-50'
                  )}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 mt-1" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600">
                    {notification.description}
                  </span>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary-600 font-medium cursor-pointer">
              Ver todas notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-medium">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/configuracoes/perfil" className="cursor-pointer">
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes/financeiro" className="cursor-pointer">
                Financeiro
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/site/central-ajuda" className="cursor-pointer">
                Central de Ajuda
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
