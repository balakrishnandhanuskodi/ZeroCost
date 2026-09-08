import { Calendar, CheckCircle, Clock, Target } from 'lucide-react'

interface JewelLoanTimelineProps {
  loanStartDate: string
  firstEMIDate: string
  tenure: number
  emirsPaidCount: number
  lastPaymentDate?: string
}

export default function JewelLoanTimeline({
  loanStartDate,
  firstEMIDate,
  tenure,
  emirsPaidCount,
  lastPaymentDate
}: JewelLoanTimelineProps) {
  const today = new Date()
  const startDate = new Date(loanStartDate)
  const firstEMI = new Date(firstEMIDate)
  const maturityDate = new Date(firstEMI)
  maturityDate.setMonth(maturityDate.getMonth() + tenure - 1)

  // Calculate days
  const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.floor((maturityDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.floor((maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const progressPercent = Math.min(Math.round((daysElapsed / totalDays) * 100), 100)

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5 space-y-2.5">
      {/* Header */}
      <div>
        <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-0.5">
          Jewel Loan Timeline
        </h3>
        <p className="text-[11px] text-[var(--muted-foreground)]">
          {emirsPaidCount} of {tenure} payments completed
        </p>
      </div>

      {/* Timeline Progress */}
      <div className="space-y-2">
        <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--info)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--muted-foreground)]">
          <span>{progressPercent}% Progress</span>
          <span>{daysElapsed} of {totalDays} days</span>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-2">
        {/* Loan Start */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--success)] border-2 border-[var(--card)]" />
            <div className="w-0.5 h-8 bg-[var(--border)]" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[11px] font-semibold text-[var(--foreground)]">Loan Start</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">{formatDate(startDate)}</p>
          </div>
        </div>

        {/* First EMI */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full border-2 border-[var(--card)] ${
              emirsPaidCount > 0 ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'
            }`} />
            <div className="w-0.5 h-8 bg-[var(--border)]" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[11px] font-semibold text-[var(--foreground)]">First EMI Date</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">{formatDate(firstEMI)}</p>
          </div>
        </div>

        {/* Last Payment */}
        {lastPaymentDate && (
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[var(--success)] border-2 border-[var(--card)]" />
              <div className="w-0.5 h-8 bg-[var(--border)]" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-[11px] font-semibold text-[var(--foreground)]">Last Payment</p>
              <p className="text-[10px] text-[var(--muted-foreground)]">{formatDate(new Date(lastPaymentDate))}</p>
            </div>
          </div>
        )}

        {/* Today */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--primary)] border-2 border-[var(--card)]" />
            <div className="w-0.5 h-8 bg-[var(--border)]" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[11px] font-semibold text-[var(--foreground)]">Today</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">{formatDate(today)}</p>
          </div>
        </div>

        {/* Maturity */}
        <div className="flex gap-3 items-start">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 border-[var(--card)] ${
              today >= maturityDate ? 'bg-[var(--success)]' : 'bg-[var(--muted)]'
            }`} />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[11px] font-semibold text-[var(--foreground)]">Maturity Date</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">{formatDate(maturityDate)}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[var(--border)]">
        <div className="p-2 bg-[var(--success-soft)] border border-[var(--success)] rounded-lg text-center">
          <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Days Elapsed</p>
          <p className="text-[13px] font-bold text-[var(--success)]">{daysElapsed}</p>
        </div>
        <div className={`p-2 border rounded-lg text-center ${
          daysRemaining > 0
            ? 'bg-[var(--warning-soft)] border-[var(--warning)]'
            : 'bg-[var(--success-soft)] border-[var(--success)]'
        }`}>
          <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Days Remaining</p>
          <p className={`text-[13px] font-bold ${daysRemaining > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
            {Math.max(daysRemaining, 0)}
          </p>
        </div>
        <div className="p-2 bg-[var(--info-soft)] border border-[var(--info)] rounded-lg text-center">
          <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Remaining EMIs</p>
          <p className="text-[13px] font-bold text-[var(--info)]">{Math.max(tenure - emirsPaidCount, 0)}</p>
        </div>
      </div>
    </div>
  )
}
