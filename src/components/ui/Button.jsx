import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const variants = {
  default: 'bg-primary text-white shadow hover:bg-primary/90',
  destructive: 'bg-rose-500 text-white shadow-sm hover:bg-rose-600',
  outline: 'border border-white/15 bg-transparent shadow-sm hover:bg-white/5 text-slate-300',
  secondary: 'bg-white/10 text-slate-200 shadow-sm hover:bg-white/15',
  ghost: 'hover:bg-white/5 text-slate-300',
  link: 'text-indigo-400 underline-offset-4 hover:underline',
}

const sizes = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9',
}

const Button = forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
          'disabled:pointer-events-none disabled:opacity-50',
          '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          variants[variant] || variants.default,
          sizes[size] || sizes.default,
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
