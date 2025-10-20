'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface DashboardLayoutProps {
  children: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  className?: string
}

function DashboardLayoutContent({
  children,
  breadcrumbs,
  className,
}: DashboardLayoutProps) {
  const { sidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useLayout()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "md:ml-0" : "md:ml-0"
        )}
      >
        {/* Header */}
        <Header breadcrumbs={breadcrumbs} />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 md:p-6',
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <LayoutProvider>
      <DashboardLayoutContent {...props} />
    </LayoutProvider>
  )
}
