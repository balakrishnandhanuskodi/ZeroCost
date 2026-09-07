/**
 * Dashboard EMI Split Card
 * Shows aggregate Principal vs Interest for all active loans
 */

interface DashboardEMISplitProps {
  totalMonthlyEMI: number
  totalPrincipalPayment: number
  totalInterestPayment: number
}

export default function DashboardEMISplit({
  totalMonthlyEMI,
  totalPrincipalPayment,
  totalInterestPayment
}: DashboardEMISplitProps) {
  const principalPercent = totalMonthlyEMI > 0 ? (totalPrincipalPayment / totalMonthlyEMI) * 100 : 0
  const interestPercent = totalMonthlyEMI > 0 ? (totalInterestPayment / totalMonthlyEMI) * 100 : 0

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5">
      {/* Header */}
      <div className="mb-2">
        <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-0.5">
          Monthly EMI Breakdown
        </h3>
        <p className="text-[12px] text-[var(--muted-foreground)]">
          Total across all active loans
        </p>
      </div>

      {/* Total EMI */}
      <div className="bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg p-2 mb-2">
        <p className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase mb-0.5">
          Total Monthly EMI
        </p>
        <p className="font-display font-700 text-lg text-[var(--primary)]">
          ₹{totalMonthlyEMI.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Principal */}
        <div className="bg-[var(--muted)] rounded-lg p-2 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">
              Going to Principal
            </p>
            <span className="text-[12px] font-bold text-[var(--primary)]">
              {Math.round(principalPercent)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all"
              style={{ width: `${principalPercent}%` }}
            />
          </div>

          <p className="text-[12px] font-semibold text-[var(--primary)]">
            ₹{totalPrincipalPayment.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Interest */}
        <div className="bg-[var(--muted)] rounded-lg p-2 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase">
              Going to Interest
            </p>
            <span className="text-[12px] font-bold text-[var(--warning)]">
              {Math.round(interestPercent)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--warning)] transition-all"
              style={{ width: `${interestPercent}%` }}
            />
          </div>

          <p className="text-[12px] font-semibold text-[var(--warning)]">
            ₹{totalInterestPayment.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-2 p-2 bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg">
        <p className="text-[12px] text-[var(--muted-foreground)] leading-relaxed">
          <span className="font-semibold text-[var(--primary)]">Key Insight:</span> Of your ₹{totalMonthlyEMI.toLocaleString('en-IN')} monthly payment, only <span className="font-bold text-[var(--primary)]">₹{totalPrincipalPayment.toLocaleString('en-IN')}</span> reduces your debt. The rest ({Math.round(interestPercent)}%) goes to interest.
        </p>
      </div>
    </div>
  )
}
