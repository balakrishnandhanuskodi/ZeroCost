import { LoanRecord, calculateMonthlyInterest } from '../../lib/loansService'

interface PaymentDue {
  lenderName: string
  loanType: string
  emiAmount: number
  dueDate: string
  loanId: string
}

interface ThisMonthEMIsProps {
  loans: LoanRecord[]
}

interface PaymentDueWithStatus extends PaymentDue {
  isPaid: boolean
  paymentNumber: number
}

export default function ThisMonthEMIs({ loans }: ThisMonthEMIsProps) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get ALL payments due this month (both paid and pending)
  const thisMonthPayments: PaymentDueWithStatus[] = []

  loans.forEach(loan => {
    const firstEMIDate = new Date(loan.first_emi_date)
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure

    for (let i = 1; i <= tenureMonths; i++) {
      const dueDate = new Date(firstEMIDate)
      dueDate.setMonth(dueDate.getMonth() + (i - 1))

      if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear) {
        // Payment is paid if the payment number is <= emis_paid_count
        // (i.e., this payment has already been made in sequence)
        const isPaid = i <= loan.emis_paid_count

        // For Jewel Loans, calculate monthly interest; otherwise use emi_amount
        const emiAmount = loan.loan_type === 'Jewel Loan'
          ? calculateMonthlyInterest(loan.principal, loan.interest_rate)
          : (loan.emi_amount || 0)

        const loanTypeDisplay = loan.loan_type === 'Jewel Loan' ? 'Gold' : loan.loan_type

        thisMonthPayments.push({
          lenderName: loan.lender_name,
          loanType: loanTypeDisplay,
          emiAmount,
          dueDate: dueDate.toISOString().split('T')[0],
          loanId: loan.id,
          isPaid,
          paymentNumber: i
        })
      }
    }
  })

  // Sort by due date
  thisMonthPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const totalDue = thisMonthPayments.reduce((sum, p) => sum + p.emiAmount, 0)
  const paidAmount = thisMonthPayments.reduce((sum, p) => p.isPaid ? sum + p.emiAmount : sum, 0)
  const balanceToPay = thisMonthPayments.reduce((sum, p) => p.isPaid ? sum : sum + p.emiAmount, 0)

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
          <p className="text-[12px] font-semibold text-[var(--success)] mb-0.5">All Clear</p>
          <p className="text-[11px] text-[var(--muted-foreground)]">No EMIs due this month</p>
        </div>
      ) : (
        <>
          {/* Total Due Summary Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {/* Total EMI */}
            <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg p-2">
              <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-0.5">
                Total EMI
              </p>
              <p className="font-display font-700 text-base text-[var(--warning)]">
                ₹{totalDue.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Paid */}
            <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-lg p-2">
              <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-0.5">
                Paid
              </p>
              <p className="font-display font-700 text-base text-[var(--success)]">
                ₹{paidAmount.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Balance to Pay */}
            <div className="bg-orange-100/40 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-700 rounded-lg p-2">
              <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-0.5">
                Balance to Pay
              </p>
              <p className="font-display font-700 text-base text-orange-600 dark:text-orange-500">
                ₹{balanceToPay.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* EMI List */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {thisMonthPayments.map((payment, idx) => (
              <div
                key={`${payment.loanId}-${idx}`}
                className={`rounded-lg p-2 flex items-center justify-between ${
                  payment.isPaid
                    ? 'bg-[var(--success-soft)] border border-[var(--success)]'
                    : 'bg-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <p className="text-[11px] font-semibold text-[var(--foreground)] truncate">
                      {payment.lenderName}
                    </p>
                    <span className={`text-[9px] font-semibold px-1 py-0.5 rounded whitespace-nowrap ${
                      payment.loanType === 'Gold'
                        ? 'bg-yellow-100/40 text-yellow-700'
                        : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                    }`}>
                      {payment.loanType}
                    </span>
                    <span className={`text-[10px] font-semibold px-1 rounded whitespace-nowrap ${
                      payment.isPaid
                        ? 'bg-[var(--success)] text-white'
                        : 'bg-[var(--warning)] text-white'
                    }`}>
                      {payment.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
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
