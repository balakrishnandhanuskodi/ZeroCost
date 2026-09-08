import { useState } from 'react'
import { ChevronDown, ChevronUp, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'

interface PaymentRecord {
  paymentNumber: number
  dueDate: string
  principalAmount: number
  interestAmount: number
  totalAmount: number
  isPaid: boolean
  paidDate?: string
}

interface LoanPaymentScheduleProps {
  loanType: string
  payments: PaymentRecord[]
  loanStartDate: string
  firstEMIDate: string
  lastPaymentDate?: string
  totalPaid: number
  totalRemaining: number
}

export default function LoanPaymentSchedule({
  loanType,
  payments,
  loanStartDate,
  firstEMIDate,
  lastPaymentDate,
  totalPaid,
  totalRemaining
}: LoanPaymentScheduleProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const paidCount = payments.filter(p => p.isPaid).length
  const progressPercentage = payments.length > 0 ? (paidCount / payments.length) * 100 : 0

  // Calculate days info
  const today = new Date()
  const loanStart = new Date(loanStartDate)
  const daysElapsed = Math.floor((today.getTime() - loanStart.getTime()) / (1000 * 60 * 60 * 24))

  // Find last payment date or first EMI date for timeline
  const referenceDate = lastPaymentDate ? new Date(lastPaymentDate) : new Date(firstEMIDate)
  const daysSinceLastPayment = Math.floor((today.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24))

  // Find next due payment
  const nextPending = payments.find(p => !p.isPaid)
  const daysUntilNextPayment = nextPending
    ? Math.floor((new Date(nextPending.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const isJewelLoan = loanType === 'Jewel Loan'

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5 space-y-2.5">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex items-center justify-between hover:bg-[var(--muted)] p-2 rounded-lg transition-colors"
      >
        <div>
          <h3 className="font-display font-700 text-sm text-[var(--foreground)]">Payment Schedule</h3>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {paidCount} of {payments.length} EMIs paid
          </p>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--success)] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--muted-foreground)]">
          <span>{Math.round(progressPercentage)}% Complete</span>
          <span>{paidCount}/{payments.length} EMIs</span>
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-[var(--muted)] rounded-lg">
        <div className="text-center">
          <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Days Elapsed</p>
          <p className="text-[13px] font-bold text-[var(--foreground)]">{daysElapsed}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Days Since Payment</p>
          <p className="text-[13px] font-bold text-[var(--foreground)]">{daysSinceLastPayment}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Days to Next</p>
          <p className={`text-[13px] font-bold ${nextPending ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
            {nextPending ? daysUntilNextPayment : '—'}
          </p>
        </div>
      </div>

      {/* Expanded Payment List */}
      {isExpanded && (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {payments.map((payment) => (
            <div
              key={payment.paymentNumber}
              className={`p-2 rounded-lg border text-[11px] ${
                payment.isPaid
                  ? 'bg-[var(--success-soft)] border-[var(--success)]'
                  : 'bg-[var(--muted)] border-[var(--border)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-[var(--foreground)]">EMI #{payment.paymentNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                      payment.isPaid
                        ? 'bg-[var(--success)] text-white'
                        : 'bg-[var(--warning)] text-white'
                    }`}>
                      {payment.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-0.5">
                    <Calendar size={12} />
                    <span>Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  {payment.isPaid && payment.paidDate && (
                    <div className="flex items-center gap-2 text-[var(--success)] text-[10px]">
                      <CheckCircle size={12} />
                      <span>Paid: {new Date(payment.paidDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                  {!isJewelLoan && (
                    <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                      Principal: ₹{payment.principalAmount.toLocaleString('en-IN')} | Interest: ₹{payment.interestAmount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--foreground)]">
                    ₹{payment.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[var(--border)]">
        <div className="p-2 bg-[var(--success-soft)] border border-[var(--success)] rounded-lg">
          <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Total Paid</p>
          <p className="text-[12px] font-bold text-[var(--success)]">₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-2 bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg">
          <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Total Remaining</p>
          <p className="text-[12px] font-bold text-[var(--warning)]">₹{totalRemaining.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  )
}
