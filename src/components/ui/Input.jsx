import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-xl border border-white/10 bg-white/5',
      'px-3 py-2 text-sm text-slate-100 shadow-sm transition-colors',
      'placeholder:text-slate-600',
      'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      className
    )}
    {...props}
  />
))

Input.displayName = 'Input'
export { Input }
