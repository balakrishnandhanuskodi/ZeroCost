import { AlertCircle } from 'lucide-react'
import { getHealthScoreBadge, getHealthScoreDescription } from '../../lib/loanHealthService'

interface LoanHealthScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
}

export default function LoanHealthScore({
  score,
  size = 'md',
  showDescription = false
}: LoanHealthScoreProps) {
  const badge = getHealthScoreBadge(score)
  const description = getHealthScoreDescription(score)

  const sizeClasses = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-2',
    lg: 'text-base gap-3'
  }

  const scoreClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex flex-col gap-2 ${sizeClasses[size]}`}>
      <div className={`${badge.bgColor} border border-[var(--border)] rounded-lg p-3 flex items-center justify-between`}>
        <div>
          <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5 uppercase font-semibold">Health Score</p>
          <div className="flex items-baseline gap-1">
            <span className={`font-display font-700 ${scoreClasses[size]}`} style={{ color: badge.color }}>
              {Math.round(score)}
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)]">/100</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold" style={{ color: badge.color }}>
            {badge.label}
          </p>
        </div>
      </div>

      {showDescription && (
        <div className="flex gap-2 p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg">
          <AlertCircle size={14} className="text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
