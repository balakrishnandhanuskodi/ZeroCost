import { AmortizationSchedule } from '../../lib/amortizationService'

interface AmortizationScheduleProps {
  schedule: AmortizationSchedule
  title?: string
  maxRows?: number
}

export default function AmortizationScheduleComponent({
  schedule,
  title = 'Amortization Schedule',
  maxRows = 12
}: AmortizationScheduleProps) {
  const displayRows = schedule.rows.slice(0, maxRows)
  const hasMore = schedule.rows.length > maxRows

  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-2">
          {title}
        </h3>
        <p className="text-[9px] text-[var(--muted-foreground)] mb-2.5">
          Total Interest: ₹{schedule.totalInterest.toLocaleString('en-IN')} |
          Total Payments: ₹{(schedule.totalPrincipal + schedule.totalInterest).toLocaleString('en-IN')}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-1.5 px-2 font-semibold text-[var(--muted-foreground)]">Month</th>
              <th className="text-right py-1.5 px-2 font-semibold text-[var(--muted-foreground)]">Principal</th>
              <th className="text-right py-1.5 px-2 font-semibold text-[var(--muted-foreground)]">Interest</th>
              <th className="text-right py-1.5 px-2 font-semibold text-[var(--muted-foreground)]">Payment</th>
              <th className="text-right py-1.5 px-2 font-semibold text-[var(--muted-foreground)]">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr key={row.month} className="border-b border-[var(--border)] hover:bg-[var(--muted)]">
                <td className="py-1.5 px-2 text-[var(--foreground)] font-medium">
                  {row.month}
                </td>
                <td className="text-right py-1.5 px-2 text-[var(--foreground)]">
                  ₹{row.principalAmount.toLocaleString('en-IN')}
                </td>
                <td className="text-right py-1.5 px-2 text-[var(--warning)]">
                  ₹{row.interestAmount.toLocaleString('en-IN')}
                </td>
                <td className="text-right py-1.5 px-2 font-medium text-[var(--foreground)]">
                  ₹{row.totalPayment.toLocaleString('en-IN')}
                </td>
                <td className="text-right py-1.5 px-2 text-[var(--primary)]">
                  ₹{row.balanceAfterPayment.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <p className="text-[9px] text-[var(--muted-foreground)] text-center py-2">
          Showing {maxRows} of {schedule.rows.length} months
        </p>
      )}
    </div>
  )
}
