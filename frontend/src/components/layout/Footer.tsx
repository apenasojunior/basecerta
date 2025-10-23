'use client'

import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white px-4 py-4 md:px-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Copyright */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>© {currentYear} BaseCerta. Todos os direitos reservados.</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-primary-600 transition-colors">
            Termos de Uso
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/privacy" className="hover:text-primary-600 transition-colors">
            Privacidade
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/help" className="hover:text-primary-600 transition-colors">
            Ajuda
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/contact" className="hover:text-primary-600 transition-colors">
            Contato
          </Link>
        </div>

        {/* Made with love */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>Feito com</span>
          <Heart className="h-4 w-4 text-error fill-current" />
          <span>pela equipe BaseCerta</span>
        </div>
      </div>
    </footer>
  )
}
