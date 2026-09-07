import { LoanRecord } from '../../lib/loansService'

interface PaymentDue {
  lenderName: string
  emiAmount: number
  dueDate: string
  loanId: string
}

interface ThisMonthEMIsProps {
  loans: LoanRecord[]
}

export default function ThisMonthEMIs({ loans }: ThisMonthEMIsProps) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get all pending payments due this month
  const thisMonthPayments: PaymentDue[] = []

  loans.forEach(loan => {
    const firstEMIDate = new Date(loan.first_emi_date)
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure

    for (let i = 1; i <= tenureMonths; i++) {
      const dueDate = new Date(firstEMIDate)
      dueDate.setMonth(dueDate.getMonth() + (i - 1))

      if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear) {
        if (i <= loan.emis_paid_count) {
          continue // Skip already paid EMIs
        }

        thisMonthPayments.push({
          lenderName: loan.lender_name,
          emiAmount: loan.emi_amount || 0,
          dueDate: dueDate.toISOString().split('T')[0],
          loanId: loan.id
        })
      }
    }
  })

  // Sort by due date
  thisMonthPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const totalDue = thisMonthPayments.reduce((sum, p) => sum + p.emiAmount, 0)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5">
      {/* Header */}
      <div className="mb-2">
        <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-0.5">
          This Month's EMIs
        </h3>
        <p className="text-[12px] text-[var(--muted-foreground)]">
          Due dates and amounts
        </p>
      </div>

      {thisMonthPayments.length === 0 ? (
        <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-lg p-2 text-center">
          <p className="text-[12px] font-semibold text-[var(--success)] mb-0.5">✓ All Clear</p>
          <p className="text-[11px] text-[var(--muted-foreground)]">No EMIs due this month</p>
        </div>
      ) : (
        <>
          {/* Total Due */}
          <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg p-2 mb-2">
            <p className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase mb-0.5">
              Total Due This Month
            </p>
            <p className="font-display font-700 text-lg text-[var(--warning)]">
              ₹{totalDue.toLocaleString('en-IN')}
            </p>
          </div>

          {/* EMI List */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {thisMonthPayments.map((payment, idx) => (
              <div
                key={`${payment.loanId}-${idx}`}
                className="bg-[var(--muted)] rounded-lg p-2 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[var(--foreground)] truncate">
                    {payment.lenderName}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    Due: {formatDate(payment.dueDate)}
                  </p>
                </div>
                <p className="text-[12px] font-bold text-[var(--foreground)] ml-2 flex-shrink-0">
                  ₹{payment.emiAmount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
