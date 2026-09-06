import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { daysUntilNextPayment } from '../../lib/amortizationService'
import { isPaymentDueSoon, isPaymentOverdue } from '../../lib/paymentService'

interface EMICountdownProps {
  dueDate: string
  amount: number
  status?: 'pending' | 'paid' | 'skipped' | 'late'
  compact?: boolean
}

export default function EMICountdown({
  dueDate,
  amount,
  status = 'pending',
  compact = false
}: EMICountdownProps) {
  const daysLeft = daysUntilNextPayment(dueDate)
  const dueSoon = isPaymentDueSoon(dueDate)
  const overdue = isPaymentOverdue(dueDate)

  const dueDateObj = new Date(dueDate)
  const dateStr = dueDateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

  if (status === 'paid') {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <CheckCircle2 size={16} className="text-[var(--success)]" />
        <span className="text-[var(--success)] font-medium">Paid on {dateStr}</span>
      </div>
    )
  }

  if (status === 'skipped') {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <AlertCircle size={16} className="text-[var(--muted-foreground)]" />
        <span className="text-[var(--muted-foreground)] font-medium">Skipped</span>
      </div>
    )
  }

  let badgeColor = 'text-[var(--foreground)]'
  let bgColor = 'bg-[var(--muted)]'
  let label = 'Pending'

  if (overdue) {
    badgeColor = 'text-[var(--danger)]'
    bgColor = 'bg-[var(--danger-soft)]'
    label = `${Math.abs(daysLeft)} days overdue`
  } else if (dueSoon) {
    badgeColor = 'text-[var(--warning)]'
    bgColor = 'bg-[var(--warning-soft)]'
    label = `Due in ${daysLeft} days`
  } else if (daysLeft > 0) {
    label = `Due in ${daysLeft} days`
  }

  return (
    <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      <Clock size={14} className={badgeColor} />
      <div>
        <span className={`font-medium ${badgeColor}`}>
          {label}
        </span>
        <span className="text-[var(--muted-foreground)] text-[11px] ml-1">
          ({dateStr})
        </span>
      </div>
      <span className={`${bgColor} ${badgeColor} text-[10px] px-2 py-0.5 rounded-full font-semibold ml-auto`}>
        ₹{amount.toLocaleString('en-IN')}
      </span>
    </div>
  )
}
