import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white text-black border-[#1a1a1a]',
  success: 'bg-[#1acb5b] text-black border-black',
  warning: 'bg-yellow-400 text-black border-black',
  error:   'bg-red-500 text-white border-black',
  info:    'bg-blue-500 text-white border-black',
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wider font-[Space_Grotesk,sans-serif] border-2',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
