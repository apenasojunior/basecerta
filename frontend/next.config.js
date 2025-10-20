/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Otimizações de imagem
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'BaseCerta',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Configurações experimentais
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
