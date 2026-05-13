import { cn } from '../../utils/helpers'

export function Spinner({ className }) {
  return (
    <div
      className={cn(
        'w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin',
        className
      )}
    />
  )
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export function TypingDots() {
  return (
    <div className="flex gap-1.5 px-4 py-3 chat-ai rounded-2xl rounded-bl-sm w-fit">
      {[1, 2, 3].map((i) => (
        <div key={i} className="typing-dot w-2 h-2 bg-slate-400 rounded-full" />
      ))}
    </div>
  )
}
