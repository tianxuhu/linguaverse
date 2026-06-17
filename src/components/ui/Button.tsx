import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  hard?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', hard = false, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap'
    const sizes: Record<string, string> = {
      sm: 'h-9 px-4 text-sm rounded-full',
      md: 'h-11 px-6 text-sm rounded-full',
      lg: 'h-14 px-8 text-base rounded-full',
    }
    const variants: Record<string, string> = {
      primary:
        'bg-ink-900 text-ink-50 hover:bg-ink-700 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2)]',
      secondary:
        'bg-ink-100 text-ink-900 hover:bg-ink-200',
      ghost: 'bg-transparent text-ink-900 hover:bg-ink-100',
      outline:
        'bg-transparent text-ink-900 border-2 border-ink-900 hover:bg-ink-900 hover:text-ink-50',
      gradient:
        'text-white shadow-lg hover:shadow-xl bg-[linear-gradient(135deg,#FF6B9D_0%,#F59E0B_100%)]',
    }
    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], hard && 'btn-hard', className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
