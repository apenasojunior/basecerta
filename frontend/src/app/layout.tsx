import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'
import { SonnerToaster } from '@/components/ui/sonner-toaster'
import { AppLayout } from '@/components/layout/AppLayout'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BaseCerta - Plataforma de Consulta de Dados',
  description: 'Consulte dados empresariais, cadastrais, financeiros e jurídicos de forma rápida e segura.',
  keywords: ['consulta', 'dados', 'empresas', 'CNPJ', 'CPF', 'Brasil'],
  authors: [{ name: 'BaseCerta' }],
  creator: 'BaseCerta',
  publisher: 'BaseCerta',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://basecerta.com.br',
    title: 'BaseCerta - Plataforma de Consulta de Dados',
    description: 'Consulte dados empresariais com agilidade e segurança',
    siteName: 'BaseCerta',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <SonnerToaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
