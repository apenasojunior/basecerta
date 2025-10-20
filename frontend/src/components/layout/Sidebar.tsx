'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { NAVIGATION, isNavGroup, NavItem, NavGroup } from '@/constants/navigation'
import { useLayout } from '@/contexts/LayoutContext'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useLayout()
  const collapsed = !sidebarOpen
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['PRODUTOS', 'CONFIGURAÇÕES'])
  const pathname = usePathname()

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col',
        collapsed ? 'w-20' : 'w-72',
        className
      )}
    >
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        <Logo size="sm" collapsed={collapsed} />
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <X className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-3">
          {NAVIGATION.map((item, index) => {
            if (isNavGroup(item)) {
              const isExpanded = expandedGroups.includes(item.title)
              
              return (
                <li key={index}>
                  {/* Group Header */}
                  <button
                    onClick={() => !collapsed && toggleGroup(item.title)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider transition-colors',
                      collapsed ? 'justify-center' : '',
                      'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {collapsed ? (
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                    ) : (
                      <>
                        <span>{item.title}</span>
                        {!collapsed && (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        )}
                      </>
                    )}
                  </button>

                  {/* Group Items */}
                  {(!collapsed && isExpanded) && (
                    <ul className="mt-1 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          item={subItem}
                          isActive={isActive(subItem.href)}
                          collapsed={collapsed}
                        />
                      ))}
                    </ul>
                  )}

                  {/* Collapsed Group Items (show on hover) */}
                  {collapsed && (
                    <div className="group relative">
                      <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px]">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500">
                            {item.title}
                          </div>
                          <ul>
                            {item.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                                    isActive(subItem.href)
                                      ? 'bg-primary-50 text-primary-600 font-medium'
                                      : 'text-gray-700 hover:bg-gray-50'
                                  )}
                                >
                                  <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            }

            // Single nav item (like Dashboard)
            return (
              <NavLink
                key={index}
                item={item as NavItem}
                isActive={isActive((item as NavItem).href)}
                collapsed={collapsed}
              />
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

interface NavLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

function NavLink({ item, isActive, collapsed }: NavLinkProps) {
  const Icon = item.icon

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          collapsed ? 'justify-center' : '',
          isActive
            ? 'bg-primary-50 text-primary-600 shadow-sm'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )}
        title={collapsed ? item.title : undefined}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-500')} />
        {!collapsed && (
          <span className="flex-1 truncate">{item.title}</span>
        )}
        {!collapsed && item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  )
}
