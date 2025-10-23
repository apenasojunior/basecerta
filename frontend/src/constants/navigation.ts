import {
  LayoutDashboard,
  Building2,
  FileText,
  TrendingUp,
  Scale,
  User as UserIcon,
  CreditCard,
  Star,
  Bell,
  FileBarChart,
  Wallet,
  HelpCircle,
  Search,
  Users,
  Building,
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
        title: 'Smart CNPJ 360°',
        href: '/smart-cnpj/search',
        icon: Search,
      },
      {
        title: 'Dados 360° - Pessoa Física',
        href: '/dados360/pf/search',
        icon: UserIcon,
      },
      {
        title: 'Dados 360° - Pessoa Jurídica',
        href: '/dados360/pj/search',
        icon: Building2,
      },
      {
        title: 'Radar Financeiro',
        href: '/radar-financeiro',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'RADAR JURÍDICO',
    items: [
      {
        title: 'Pessoa Física',
        href: '/radar-juridico/pf/search',
        icon: Users,
      },
      {
        title: 'Pessoa Jurídica',
        href: '/radar-juridico/pj/search',
        icon: Building,
      },
    ],
  },
  {
    title: 'GESTÃO',
    items: [
      {
        title: 'Créditos e Planos',
        href: '/credits',
        icon: CreditCard,
      },
      {
        title: 'Favoritos',
        href: '/favorites',
        icon: Star,
      },
      {
        title: 'Alertas',
        href: '/alerts',
        icon: Bell,
      },
      {
        title: 'Relatórios',
        href: '/reports',
        icon: FileBarChart,
      },
    ],
  },
  {
    title: 'AJUDA',
    items: [
      {
        title: 'Central de Ajuda',
        href: '/help',
        icon: HelpCircle,
      },
    ],
  },
]

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'items' in item
}
