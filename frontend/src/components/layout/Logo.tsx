import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  collapsed?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function Logo({ size = 'md', collapsed = false, className }: LogoProps) {
  if (collapsed) {
    return (
      <Link href="/dashboard" className={cn('flex items-center justify-center', className)}>
        <span className="font-bold text-primary-500 text-2xl">B</span>
      </Link>
    )
  }

  return (
    <Link href="/dashboard" className={cn('flex items-center', className)}>
      <h1 className={cn('font-bold', sizeClasses[size])}>
        <span className="text-primary-500">Base</span>
        <span className="text-gray-800">Certa</span>
        <span className="text-primary-500">.</span>
      </h1>
    </Link>
  )
}
