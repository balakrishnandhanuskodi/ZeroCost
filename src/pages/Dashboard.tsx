import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLoansByUser, calculateEMI, calculateMonthlyInterest, LoanRecord } from '../lib/loansService'
import DashboardEMISplit from '../components/Loans/DashboardEMISplit'
import ThisMonthEMIs from '../components/Loans/ThisMonthEMIs'

export default function Dashboard() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<LoanRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadLoans()
    }
  }, [user])

  const loadLoans = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await getLoansByUser(user.id)
      setLoans(data)
    } catch (err) {
      console.error('Failed to load loans:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate metrics
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.principal, 0)
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.current_balance, 0)
  const activeLoanCount = loans.filter(l => l.status === 'active').length

  const totalEMI = loans.reduce((sum, loan) => {
    if (loan.loan_type === 'Jewel Loan') {
      // For Jewel Loans, use the monthly interest calculation
      return sum + calculateMonthlyInterest(loan.principal, loan.interest_rate)
    }
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure
    return sum + (loan.emi_amount || calculateEMI(loan.principal, loan.interest_rate, tenureMonths))
  }, 0)

  // Calculate this month's EMI split (using Payment 1 as reference for upcoming EMIs)
  // This gives accurate principal vs interest breakdown for the current EMI cycle
  const getThisMonthEMISplit = () => {
    let totalPrincipal = 0
    let totalInterest = 0

    loans.forEach(loan => {
      const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure

      // For Jewel Loans: 100% of payment is interest, 0% is principal
      if (loan.loan_type === 'Jewel Loan') {
        const monthlyInterest = calculateMonthlyInterest(loan.principal, loan.interest_rate)
        totalInterest += monthlyInterest
        totalPrincipal += 0
      } else if (loan.first_payment_interest && loan.first_payment_principal) {
        // For Payment 1: use official breakdown if available
        totalInterest += loan.first_payment_interest
        totalPrincipal += loan.first_payment_principal
      } else {
        // Fallback: calculate using reducing balance for first month
        const monthlyRate = loan.interest_rate / 100 / 12
        const monthlyInterest = Math.round(loan.principal * monthlyRate * 100) / 100
        const monthlyPrincipal = (loan.emi_amount || calculateEMI(loan.principal, loan.interest_rate, tenureMonths)) - monthlyInterest

        totalInterest += monthlyInterest
        totalPrincipal += monthlyPrincipal
      }
    })

    return { totalPrincipal, totalInterest }
  }

  const emiSplit = getThisMonthEMISplit()
  const totalPrincipalInEMI = emiSplit.totalPrincipal
  const totalInterestInEMI = emiSplit.totalInterest

  return (
    <div className="p-6 pb-20 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {user?.email}
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Total Loans */}
        <div className="bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-0.5">Total Loans</div>
          <div className="font-display font-700 text-[24px] text-[var(--primary)]">
            ₹{totalLoanAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-[13px] text-[var(--muted-foreground)] mt-1">
            {activeLoanCount} active {activeLoanCount === 1 ? 'loan' : 'loans'}
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-0.5">Outstanding Balance</div>
          <div className="font-display font-700 text-[24px] text-[var(--warning)]">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <p className="text-[13px] text-[var(--muted-foreground)] mt-1">
            Amount to be paid
          </p>
        </div>

        {/* Monthly EMI */}
        <div className="bg-[var(--info-soft)] border border-[var(--info)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-0.5">Monthly EMI</div>
          <div className="font-display font-700 text-[24px] text-[var(--info)]">
            ₹{Math.round(totalEMI).toLocaleString('en-IN')}
          </div>
          <p className="text-[13px] text-[var(--muted-foreground)] mt-1">
            Total across all loans
          </p>
        </div>

        {/* Net Worth */}
        <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-0.5">Net Worth</div>
          <div className="font-display font-700 text-[24px] text-[var(--success)]">
            ₹{(totalLoanAmount - totalOutstanding).toLocaleString('en-IN')}
          </div>
          <p className="text-[13px] text-[var(--muted-foreground)] mt-1">
            Principal paid
          </p>
        </div>
      </div>

      {/* EMI Split Card & This Month's EMIs */}
      {loans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <DashboardEMISplit
            totalMonthlyEMI={totalEMI}
            totalPrincipalPayment={Math.round(totalPrincipalInEMI)}
            totalInterestPayment={Math.round(totalInterestInEMI)}
          />
          <ThisMonthEMIs loans={loans} />
        </div>
      )}

      {/* Account Overview */}
      {isLoading ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-[var(--muted)] mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-[var(--muted-foreground)]">Loading your financial data...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <h2 className="font-display font-700 text-sm text-[var(--foreground)] mb-1">Get Started</h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Add your first loan in the Loans section to see your financial overview here. We'll track your EMI payments, interest, and help you achieve your financial goals.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
          <h2 className="font-display font-700 text-base text-[var(--foreground)] mb-2">Loan Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-[12px] text-[var(--muted-foreground)] mb-1">Total Loans</p>
              <p className="font-semibold text-sm text-[var(--foreground)]">{activeLoanCount}</p>
            </div>
            <div>
              <p className="text-[12px] text-[var(--muted-foreground)] mb-1">Avg Interest Rate</p>
              <p className="font-semibold text-sm text-[var(--foreground)]">
                {(loans.reduce((sum, l) => sum + l.interest_rate, 0) / loans.length).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[var(--muted-foreground)] mb-1">Months to Clear</p>
              <p className="font-semibold text-sm text-[var(--foreground)]">
                {Math.max(...loans.map(l => l.tenure_unit === 'years' ? l.tenure * 12 : l.tenure))}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[var(--muted-foreground)] mb-1">Healthy Loans</p>
              <p className="font-semibold text-sm text-[var(--success)]">
                {loans.filter(l => (l.health_score || 75) >= 60).length}/{activeLoanCount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
