import { cn } from '@/lib/utils'

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 -z-10 opacity-80', className)}
    />
  )
}
