import { type HTMLAttributes } from 'react'
import { cn } from '@/utils'

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'outline' | 'solid' }) {
  const styles = {
    default: 'bg-ink-100 text-ink-700',
    outline: 'border border-ink-300 text-ink-700 bg-transparent',
    solid: 'bg-ink-900 text-ink-50',
  }[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        styles,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
