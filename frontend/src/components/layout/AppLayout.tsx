'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext'

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { mobileMenuOpen } = useLayout()
  const pathname = usePathname()

  // Páginas que não usam o layout (login, etc.)
  const publicPages = ['/login', '/register', '/forgot-password']
  const isPublicPage = publicPages.includes(pathname || '')

  // Se for página pública, não renderiza Header/Sidebar/Footer
  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Sidebar Mobile */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  )
}
