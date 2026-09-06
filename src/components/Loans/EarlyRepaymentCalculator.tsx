import { useState } from 'react'
import { X, TrendingDown } from 'lucide-react'
import { calculateEarlyRepaymentImpact } from '../../lib/amortizationService'
import Button from '../UI/Button'

interface EarlyRepaymentCalculatorProps {
  isOpen: boolean
  onClose: () => void
  principal: number
  interestRate: number
  tenureMonths: number
  monthlyPaymentDayOfMonth: number
  startDate: string
  currentEMI: number
}

export default function EarlyRepaymentCalculator({
  isOpen,
  onClose,
  principal,
  interestRate,
  tenureMonths,
  monthlyPaymentDayOfMonth,
  startDate,
  currentEMI
}: EarlyRepaymentCalculatorProps) {
  const [extraPayment, setExtraPayment] = useState(0)

  if (!isOpen) return null

  const impact = calculateEarlyRepaymentImpact(
    principal,
    interestRate,
    tenureMonths,
    monthlyPaymentDayOfMonth,
    startDate,
    extraPayment
  )

  const scenarios = [
    { label: 'No Extra Payment', extra: 0 },
    { label: '₹2,000/month', extra: 2000 },
    { label: '₹5,000/month', extra: 5000 },
    { label: '₹10,000/month', extra: 10000 }
  ]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start md:items-center justify-center z-50 overflow-y-auto p-2 md:p-0">
      <div className="bg-[var(--card)] rounded-t-2xl md:rounded-xl w-full md:w-[600px] max-h-[95vh] overflow-y-auto p-4 md:p-5 shadow-2xl my-2 md:my-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown size={18} className="text-[var(--primary)]" />
            <h2 className="font-display font-700 text-sm text-[var(--foreground)]">
              Early Repayment Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-[10px] text-[var(--muted-foreground)] mb-4">
          See how extra payments can save you interest and close your loan faster
        </p>

        {/* Extra Payment Input */}
        <div className="mb-4 p-3 bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg">
          <label className="text-xs font-semibold text-[var(--foreground)] mb-1.5 block">
            Extra Monthly Payment (₹)
          </label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Enter amount"
            min="0"
          />
        </div>

        {/* Quick Scenarios */}
        <div className="mb-4">
          <p className="text-[9px] font-semibold text-[var(--muted-foreground)] mb-2 uppercase">Quick Scenarios</p>
          <div className="grid grid-cols-2 gap-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.label}
                onClick={() => setExtraPayment(scenario.extra)}
                className={`text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  extraPayment === scenario.extra
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Summary */}
        <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-lg p-3 mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5">Standard EMI</p>
              <p className="font-display font-700 text-sm text-[var(--foreground)]">
                ₹{impact.standardEMI.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5">New Total EMI</p>
              <p className="font-display font-700 text-sm text-[var(--foreground)]">
                ₹{(impact.standardEMI + extraPayment).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--success)] pt-2">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] text-[var(--muted-foreground)]">Interest Saved:</span>
              <span className="font-display font-700 text-sm text-[var(--success)]">
                ₹{impact.interestSaved.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-[var(--muted-foreground)]">Months Saved:</span>
              <span className="font-display font-700 text-sm text-[var(--success)]">
                {impact.monthsSaved} months
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Comparison */}
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-[9px] font-semibold text-[var(--muted-foreground)] mb-1">Original Timeline</p>
            <div className="bg-[var(--muted)] rounded-lg p-2.5">
              <p className="text-[11px] font-medium text-[var(--foreground)]">
                {tenureMonths} months
              </p>
              <p className="text-[9px] text-[var(--muted-foreground)]">
                Closure: {impact.originalClosureDate}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-semibold text-[var(--muted-foreground)] mb-1">With Extra Payment</p>
            <div className={`rounded-lg p-2.5 ${
              impact.monthsSaved > 0
                ? 'bg-[var(--success-soft)] border border-[var(--success)]'
                : 'bg-[var(--muted)]'
            }`}>
              <p className={`text-[11px] font-medium ${
                impact.monthsSaved > 0
                  ? 'text-[var(--success)]'
                  : 'text-[var(--foreground)]'
              }`}>
                {Math.max(1, tenureMonths - impact.monthsSaved)} months
              </p>
              <p className="text-[9px] text-[var(--muted-foreground)]">
                Closure: {impact.newClosureDate}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={onClose}
          className="w-full"
        >
          Got it
        </Button>
      </div>
    </div>
  )
}
