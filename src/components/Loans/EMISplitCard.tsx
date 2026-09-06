/**
 * EMI Split Card - Shows Principal vs Interest breakdown
 * Key indicator: Makes users aware of interest they're paying
 */

interface EMISplitCardProps {
  totalEMI: number
  principalAmount: number
  interestAmount: number
  showPercentages?: boolean
  compact?: boolean
}

export default function EMISplitCard({
  totalEMI,
  principalAmount,
  interestAmount,
  showPercentages = true,
  compact = false
}: EMISplitCardProps) {
  const principalPercent = totalEMI > 0 ? (principalAmount / totalEMI) * 100 : 0
  const interestPercent = totalEMI > 0 ? (interestAmount / totalEMI) * 100 : 0

  const containerClass = compact
    ? 'p-1.5 gap-1.5'
    : 'p-2 gap-1.5'

  const labelClass = compact
    ? 'text-[8px]'
    : 'text-[9px]'

  const valueClass = compact
    ? 'text-[9px]'
    : 'text-xs'

  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg ${containerClass} space-y-1`}>
      {/* Total EMI */}
      <div className="pb-1 border-b border-[var(--border)]">
        <p className={`${labelClass} text-[var(--muted-foreground)] mb-0.5`}>Total Monthly EMI</p>
        <p className={`font-display font-700 ${valueClass} text-[var(--foreground)]`}>
          ₹{totalEMI.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Principal Component */}
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <p className={`${labelClass} text-[var(--muted-foreground)]`}>Principal</p>
          {showPercentages && (
            <span className={`${labelClass} font-semibold text-[var(--primary)]`}>
              {Math.round(principalPercent)}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all"
            style={{ width: `${principalPercent}%` }}
          />
        </div>

        <p className={`${labelClass} text-[var(--primary)] font-medium`}>
          ₹{principalAmount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Interest Component */}
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <p className={`${labelClass} text-[var(--muted-foreground)]`}>Interest</p>
          {showPercentages && (
            <span className={`${labelClass} font-semibold text-[var(--warning)]`}>
              {Math.round(interestPercent)}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--warning)] transition-all"
            style={{ width: `${interestPercent}%` }}
          />
        </div>

        <p className={`${labelClass} text-[var(--warning)] font-medium`}>
          ₹{interestAmount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Info Message */}
      <div className="pt-1 border-t border-[var(--border)]">
        <p className={`${labelClass} text-[var(--muted-foreground)] leading-relaxed`}>
          💡 Each month, {Math.round(principalPercent)}% goes to reducing your debt, {Math.round(interestPercent)}% goes to interest
        </p>
      </div>
    </div>
  )
}
