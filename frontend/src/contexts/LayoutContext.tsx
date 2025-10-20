/**
 * Layout Context
 * Gerenciamento de estado global do layout (sidebar, mobile drawer, breadcrumbs)
 */

"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Breadcrumb {
  label: string
  href?: string
}

interface LayoutContextType {
  // Sidebar desktop
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Mobile drawer
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void

  // Breadcrumbs
  breadcrumbs: Breadcrumb[]
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

// LocalStorage key
const SIDEBAR_STORAGE_KEY = 'basecerta-sidebar-open'

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // Sidebar desktop - inicializar do localStorage
  const [sidebarOpen, setSidebarOpenState] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])

  // Carregar estado da sidebar do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored !== null) {
      setSidebarOpenState(stored === 'true')
    }
  }, [])

  // Salvar estado da sidebar no localStorage
  const setSidebarOpen = (open: boolean) => {
    setSidebarOpenState(open)
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Fechar mobile menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  const value: LayoutContextType = {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    mobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    breadcrumbs,
    setBreadcrumbs,
  }

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

// Hook para definir breadcrumbs de uma página
export function useBreadcrumbs(breadcrumbs: Breadcrumb[]) {
  const { setBreadcrumbs } = useLayout()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    // Limpar ao desmontar
    return () => setBreadcrumbs([])
  }, [JSON.stringify(breadcrumbs), setBreadcrumbs])
}
