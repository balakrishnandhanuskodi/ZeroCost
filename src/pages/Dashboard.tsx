import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLoansByUser, calculateEMI, LoanRecord } from '../lib/loansService'
import DashboardEMISplit from '../components/Loans/DashboardEMISplit'

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
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure
    return sum + (loan.emi_amount || calculateEMI(loan.principal, loan.interest_rate, tenureMonths))
  }, 0)

  // Calculate EMI split
  const totalPrincipalInEMI = loans.reduce((sum, loan) => {
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure
    return sum + (tenureMonths > 0 ? loan.principal / tenureMonths : 0)
  }, 0)
  const totalInterestInEMI = totalEMI - totalPrincipalInEMI

  return (
    <div className="p-6 pb-20 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {user?.email}
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Total Loans */}
        <div className="bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-xs font-medium mb-0.5">Total Loans</div>
          <div className="font-display font-700 text-lg text-[var(--primary)]">
            ₹{totalLoanAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            {activeLoanCount} active {activeLoanCount === 1 ? 'loan' : 'loans'}
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-xs font-medium mb-0.5">Outstanding Balance</div>
          <div className="font-display font-700 text-lg text-[var(--warning)]">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Amount to be paid
          </p>
        </div>

        {/* Monthly EMI */}
        <div className="bg-[var(--info-soft)] border border-[var(--info)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-xs font-medium mb-0.5">Monthly EMI</div>
          <div className="font-display font-700 text-lg text-[var(--info)]">
            ₹{Math.round(totalEMI).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Total across all loans
          </p>
        </div>

        {/* Net Worth */}
        <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-lg p-4">
          <div className="text-[var(--muted-foreground)] text-xs font-medium mb-0.5">Net Worth</div>
          <div className="font-display font-700 text-lg text-[var(--success)]">
            ₹{(totalLoanAmount - totalOutstanding).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Principal paid
          </p>
        </div>
      </div>

      {/* EMI Split Card */}
      {loans.length > 0 && (
        <div className="mb-4">
          <DashboardEMISplit
            totalMonthlyEMI={totalEMI}
            totalPrincipalPayment={Math.round(totalPrincipalInEMI)}
            totalInterestPayment={Math.round(totalInterestInEMI)}
          />
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
          <h2 className="font-display font-700 text-sm text-[var(--foreground)] mb-2">Loan Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-[9px] text-[var(--muted-foreground)] mb-1">Total Loans</p>
              <p className="font-semibold text-xs text-[var(--foreground)]">{activeLoanCount}</p>
            </div>
            <div>
              <p className="text-[9px] text-[var(--muted-foreground)] mb-1">Avg Interest Rate</p>
              <p className="font-semibold text-xs text-[var(--foreground)]">
                {(loans.reduce((sum, l) => sum + l.interest_rate, 0) / loans.length).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-[9px] text-[var(--muted-foreground)] mb-1">Months to Clear</p>
              <p className="font-semibold text-xs text-[var(--foreground)]">
                {Math.max(...loans.map(l => l.tenure_unit === 'years' ? l.tenure * 12 : l.tenure))}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-[var(--muted-foreground)] mb-1">Healthy Loans</p>
              <p className="font-semibold text-xs text-[var(--success)]">
                {loans.filter(l => (l.health_score || 75) >= 60).length}/{activeLoanCount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
