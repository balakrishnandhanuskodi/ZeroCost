import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, AlertCircle, Briefcase, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/UI/Button'
import Alert from '../components/UI/Alert'
import LoanForm from '../components/Forms/LoanForm'
import LoanEMIPieChart from '../components/Loans/LoanEMIPieChart'
import EMIAnalysisDialog from '../components/Loans/EMIAnalysisDialog'
import { getLoansByUser, createLoan, updateLoan, deleteLoan, calculateEMI, calculateMonth1Amortization, generatePaymentSchedule, getLoanPaymentHistory, createLoanPaymentSchedule, PaymentScheduleItem, LoanRecord, LoanFormInput } from '../lib/loansService'

export default function Loans() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<LoanRecord[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Record<string, { count: number; totalAmount: number }>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLoan, setEditingLoan] = useState<LoanRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showEMIAnalysis, setShowEMIAnalysis] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<LoanFormInput | null>(null)
  const [pendingSchedule, setPendingSchedule] = useState<PaymentScheduleItem[]>([])

  const loadLoans = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)

    try {
      const data = await getLoansByUser(user.id)
      setLoans(data)

      // Load payment history for each loan
      const history: Record<string, { count: number; totalAmount: number }> = {}
      for (const loan of data) {
        history[loan.id] = await getLoanPaymentHistory(loan.id)
      }
      setPaymentHistory(history)
    } catch (err) {
      setError('Failed to load loans')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLoan = async (formData: LoanFormInput) => {
    // Show EMI analysis dialog before creating loan
    setPendingFormData(formData)
    setShowForm(false)
    setShowEMIAnalysis(true)
  }

  const handleEMIAnalysisConfirm = async (schedule: PaymentScheduleItem[]) => {
    if (!user || !pendingFormData) return

    setIsSubmitting(true)
    setError(null)

    try {
      const newLoan = await createLoan(user.id, pendingFormData)
      if (newLoan) {
        // Generate and save payment records
        const tenureMonths = pendingFormData.tenure_unit === 'years' ? parseInt(pendingFormData.tenure) * 12 : parseInt(pendingFormData.tenure)
        const paymentSchedule = generatePaymentSchedule(
          newLoan.id,
          parseFloat(pendingFormData.principal),
          parseFloat(pendingFormData.interest_rate),
          tenureMonths,
          pendingFormData.first_emi_date,
          parseFloat(pendingFormData.first_emi_amount),
          pendingFormData.emis_paid_count ? parseInt(pendingFormData.emis_paid_count) : 0
        )

        const scheduleCreated = await createLoanPaymentSchedule(user.id, newLoan.id, paymentSchedule)
        if (!scheduleCreated) {
          console.warn('Payment schedule creation returned false, but continuing with loan creation')
        }

        // Load payment history for the new loan
        const newLoanHistory = await getLoanPaymentHistory(newLoan.id)
        setPaymentHistory(prev => ({ ...prev, [newLoan.id]: newLoanHistory }))
        console.log(`Payment history loaded for loan ${newLoan.id}:`, newLoanHistory)

        setLoans([newLoan, ...loans])
        setShowForm(false)
        setShowEMIAnalysis(false)
        setPendingFormData(null)
        setPendingSchedule([])
        setSuccess('Loan added successfully! Payment schedule generated.')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add loan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEMIAnalysisCancel = () => {
    setShowEMIAnalysis(false)
    setPendingFormData(null)
    setPendingSchedule([])
  }

  const handleEditLoan = async (formData: LoanFormInput) => {
    if (!editingLoan) return

    setIsSubmitting(true)
    setError(null)

    try {
      const updated = await updateLoan(editingLoan.id, formData)
      if (updated) {
        setLoans(loans.map(l => l.id === editingLoan.id ? updated : l))
        setEditingLoan(null)
        setShowForm(false)
        setSuccess('Loan updated successfully')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return

    setDeletingId(loanId)
    setError(null)

    try {
      const success = await deleteLoan(loanId)
      if (success) {
        setLoans(loans.filter(l => l.id !== loanId))
        setSuccess('Loan deleted successfully')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan')
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenForm = (loan?: LoanRecord) => {
    if (loan) {
      setEditingLoan(loan)
    } else {
      setEditingLoan(null)
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingLoan(null)
  }

  // Load loans on mount
  useEffect(() => {
    loadLoans()
  }, [user])

  // If form is open, show full page form instead of modal
  if (showForm) {
    return (
      <div className="p-6 pb-20 md:pb-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleCloseForm}
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4"
            >
              <ChevronLeft size={16} />
              Back to Loans
            </button>
            <h1 className="font-display font-700 text-2xl text-[var(--foreground)]">
              {editingLoan ? 'Edit Loan' : 'Add New Loan'}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {editingLoan ? 'Update your loan details' : 'Add a new loan to track'}
            </p>
          </div>

          {error && <Alert type="error" title="Error">{error}</Alert>}

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
            <LoanForm
              onSubmit={editingLoan ? handleEditLoan : handleAddLoan}
              onCancel={handleCloseForm}
              initialData={
                editingLoan
                  ? {
                      lender_name: editingLoan.lender_name,
                      loan_type: editingLoan.loan_type,
                      principal: editingLoan.principal.toString(),
                      current_balance: editingLoan.current_balance.toString(),
                      interest_rate: editingLoan.interest_rate.toString(),
                      interest_type: editingLoan.interest_type,
                      tenure: editingLoan.tenure.toString(),
                      tenure_unit: editingLoan.tenure_unit,
                      start_date: editingLoan.start_date,
                      end_date: editingLoan.end_date || '',
                      monthly_payment_date: editingLoan.monthly_payment_date?.toString() || '',
                      first_emi_date: editingLoan.first_emi_date,
                      first_emi_amount: editingLoan.first_emi_amount.toString(),
                      emis_paid_count: editingLoan.emis_paid_count.toString(),
                      last_payment_date: editingLoan.last_payment_date || '',
                      status: editingLoan.status,
                      notes: editingLoan.notes || '',
                    }
                  : undefined
              }
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    )
  }

  // Calculate totals
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.current_balance, 0)
  const totalEMI = loans.reduce((sum, loan) => {
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure
    return sum + (loan.emi_amount || calculateEMI(loan.principal, loan.interest_rate, tenureMonths))
  }, 0)

  // Calculate EMI split (principal vs interest)
  const totalPrincipalInEMI = loans.reduce((sum, loan) => {
    const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure
    return sum + (tenureMonths > 0 ? loan.principal / tenureMonths : 0)
  }, 0)
  const totalInterestInEMI = totalEMI - totalPrincipalInEMI

  return (
    <div className="p-6 pb-20 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="font-display font-700 text-base md:text-lg text-[var(--foreground)]">Loans</h1>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{loans.length} active loans</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="p-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
          title="Add Loan"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Alerts */}
      {success && <Alert type="success" title="Success">{success}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* Summary Cards */}
      {loans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div className="bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg p-3">
            <div className="text-[var(--muted-foreground)] text-[10px] font-medium mb-0.5">Total Outstanding</div>
            <div className="font-display font-700 text-base text-[var(--primary)]">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg p-3">
            <div className="text-[var(--muted-foreground)] text-[10px] font-medium mb-0.5">Total Monthly EMI</div>
            <div className="font-display font-700 text-base text-[var(--warning)]">
              ₹{Math.round(totalEMI).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--muted)] mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-[var(--muted-foreground)]">Loading loans...</p>
          </div>
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <Briefcase size={32} className="mx-auto mb-2 text-[var(--muted-foreground)]" />
          <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-1">No loans yet</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">
            Add your first loan to get started.
          </p>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--primary)] bg-[var(--primary-soft)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors border border-[var(--primary)]"
          >
            <Plus size={14} />
            Add Loan
          </button>
        </div>
      ) : (
        /* Loans Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {loans.map(loan => {
            const tenureMonths = loan.tenure_unit === 'years' ? loan.tenure * 12 : loan.tenure
            const emi = loan.emi_amount || calculateEMI(loan.principal, loan.interest_rate, tenureMonths)
            const statusColors = {
              active: 'bg-[var(--success-soft)] text-[var(--success)]',
              closed: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
              defaulted: 'bg-[var(--danger-soft)] text-[var(--danger)]'
            }

            return (
              <div
                key={loan.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <h3 className="font-display font-700 text-[15px] text-[var(--foreground)] truncate">{loan.lender_name}</h3>
                      <span className={`text-[11px] font-semibold px-0.5 py-0.5 rounded-full whitespace-nowrap ${statusColors[loan.status]}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {new Date(loan.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => handleOpenForm(loan)}
                      className="p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteLoan(loan.id)}
                      disabled={deletingId === loan.id}
                      className="p-1 text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Principal</p>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">₹{loan.principal.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Balance</p>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">₹{loan.current_balance.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Rate p.a.</p>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">{loan.interest_rate.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Monthly EMI</p>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">₹{Math.round(emi).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Payment History Row */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[var(--border)]">
                    <div>
                      <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">EMIs Paid</p>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">{paymentHistory[loan.id]?.count || 0}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--muted-foreground)] mb-0.5 uppercase font-medium">Total Paid</p>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">₹{Math.round(paymentHistory[loan.id]?.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="flex justify-center">
                    {(() => {
                      const month1 = calculateMonth1Amortization(loan.principal, loan.interest_rate, emi)
                      return (
                        <LoanEMIPieChart
                          principalAmount={month1.principal}
                          interestAmount={month1.interest}
                          totalEMI={emi}
                        />
                      )
                    })()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Loan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start md:items-center justify-center z-50 overflow-y-auto p-2 md:p-0">
          <div className="bg-[var(--card)] rounded-t-2xl md:rounded-xl w-full md:w-[600px] max-h-[95vh] md:max-h-[95vh] overflow-y-auto p-4 md:p-5 shadow-2xl my-2 md:my-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-700 text-sm text-[var(--foreground)]">
                {editingLoan ? 'Edit Loan' : 'Add Loan'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-lg"
              >
                ✕
              </button>
            </div>

            <LoanForm
              onSubmit={editingLoan ? handleEditLoan : handleAddLoan}
              onCancel={handleCloseForm}
              initialData={
                editingLoan
                  ? {
                      lender_name: editingLoan.lender_name,
                      loan_type: editingLoan.loan_type,
                      principal: editingLoan.principal.toString(),
                      current_balance: editingLoan.current_balance.toString(),
                      interest_rate: editingLoan.interest_rate.toString(),
                      interest_type: editingLoan.interest_type,
                      tenure: editingLoan.tenure.toString(),
                      tenure_unit: editingLoan.tenure_unit,
                      start_date: editingLoan.start_date,
                      end_date: editingLoan.end_date || '',
                      monthly_payment_date: editingLoan.monthly_payment_date?.toString() || '',
                      first_emi_date: editingLoan.first_emi_date,
                      first_emi_amount: editingLoan.first_emi_amount.toString(),
                      emis_paid_count: editingLoan.emis_paid_count.toString(),
                      last_payment_date: editingLoan.last_payment_date || '',
                      status: editingLoan.status,
                      notes: editingLoan.notes || '',
                    }
                  : undefined
              }
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* EMI Analysis Dialog */}
      {showEMIAnalysis && pendingFormData && (
        <EMIAnalysisDialog
          principal={parseFloat(pendingFormData.principal)}
          interestRate={parseFloat(pendingFormData.interest_rate)}
          tenure={parseInt(pendingFormData.tenure)}
          tenureUnit={pendingFormData.tenure_unit}
          firstEMIDate={pendingFormData.first_emi_date}
          firstEMIAmount={parseFloat(pendingFormData.first_emi_amount)}
          currentBalance={parseFloat(pendingFormData.current_balance)}
          emirsPaidCount={pendingFormData.emis_paid_count ? parseInt(pendingFormData.emis_paid_count) : 0}
          onConfirm={handleEMIAnalysisConfirm}
          onCancel={handleEMIAnalysisCancel}
        />
      )}
    </div>
  )
}
