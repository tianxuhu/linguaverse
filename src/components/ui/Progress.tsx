interface ProgressProps {
  value: number
  max?: number
  variant?: 'amber' | 'jade' | 'sakura' | 'electric' | 'ink'
  showLabel?: boolean
  className?: string
}

export function Progress({ value, max = 100, variant = 'amber', showLabel = false, className = '' }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const colors = {
    amber: 'from-amber to-sakura',
    jade: 'from-jade to-electric',
    sakura: 'from-sakura to-amber',
    electric: 'from-electric to-jade',
    ink: 'from-ink-700 to-ink-900',
  }[variant]
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-400 mb-1.5 tnum">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
