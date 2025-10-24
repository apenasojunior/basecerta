import type { Metadata } from 'next'
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
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

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-mono',
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
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for other potential origins */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-sans antialiased`}>
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
