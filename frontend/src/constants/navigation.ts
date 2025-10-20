import {
  LayoutDashboard,
  Building2,
  FileText,
  DollarSign,
  Scale,
  User,
  Wallet,
  HelpCircle,
  LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
  disabled?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const NAVIGATION: (NavItem | NavGroup)[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'PRODUTOS',
    items: [
      {
        title: 'Dados de Empresas no Brasil',
        href: '/produtos/dados-empresas',
        icon: Building2,
      },
      {
        title: 'Dados Cadastrais',
        href: '/produtos/dados-cadastrais',
        icon: FileText,
      },
      {
        title: 'Dossie Financeiro',
        href: '/produtos/dossie-financeiro',
        icon: DollarSign,
      },
      {
        title: 'Pesquisas Jurídicas',
        href: '/produtos/pesquisas-juridicas',
        icon: Scale,
      },
    ],
  },
  {
    title: 'CONFIGURAÇÕES',
    items: [
      {
        title: 'Perfil',
        href: '/configuracoes/perfil',
        icon: User,
      },
      {
        title: 'Financeiro',
        href: '/configuracoes/financeiro',
        icon: Wallet,
      },
    ],
  },
  {
    title: 'SITE',
    items: [
      {
        title: 'Central de Ajuda',
        href: '/ajuda',
        icon: HelpCircle,
      },
    ],
  },
]

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'items' in item
}
