import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/UI/Button'
import Alert from '../components/UI/Alert'
import LoanForm from '../components/Forms/LoanForm'
import { getLoansByUser, createLoan, updateLoan, deleteLoan, calculateEMI, LoanRecord, LoanFormInput } from '../lib/loansService'

export default function Loans() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<LoanRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingLoan, setEditingLoan] = useState<LoanRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load loans on mount
  useEffect(() => {
    loadLoans()
  }, [user])

  const loadLoans = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)

    try {
      const data = await getLoansByUser(user.id)
      setLoans(data)
    } catch (err) {
      setError('Failed to load loans')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLoan = async (formData: LoanFormInput) => {
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const newLoan = await createLoan(user.id, formData)
      if (newLoan) {
        setLoans([newLoan, ...loans])
        setShowForm(false)
        setSuccess('Loan added successfully')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add loan')
    } finally {
      setIsSubmitting(false)
    }
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

  // Calculate totals
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.loanAmount, 0)
  const totalEMI = loans.reduce((sum, loan) => sum + calculateEMI(loan.loanAmount, loan.interestRate, loan.loanTerm), 0)

  return (
    <div className="p-6 pb-20 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-2xl md:text-3xl text-[var(--foreground)]">Loans</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{loans.length} active loans</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenForm()}>
          <Plus size={16} className="mr-1" />
          Add Loan
        </Button>
      </div>

      {/* Alerts */}
      {success && <Alert type="success" title="Success">{success}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* Summary Cards */}
      {loans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[var(--primary-soft)] border border-[var(--primary)] rounded-2xl p-6">
            <div className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Total Outstanding</div>
            <div className="font-display font-700 text-2xl text-[var(--primary)]">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-2xl p-6">
            <div className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Monthly EMI</div>
            <div className="font-display font-700 text-2xl text-[var(--warning)]">
              ₹{Math.round(totalEMI).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--muted)] mx-auto mb-4 animate-pulse" />
            <p className="text-[var(--muted-foreground)]">Loading loans...</p>
          </div>
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="font-display font-700 text-lg text-[var(--foreground)] mb-2">No loans yet</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Add your first loan to get started with loan management and track your EMIs.
          </p>
          <Button variant="primary" onClick={() => handleOpenForm()}>
            <Plus size={16} className="mr-1" />
            Add Your First Loan
          </Button>
        </div>
      ) : (
        /* Loans List */
        <div className="space-y-3">
          {loans.map(loan => {
            const emi = calculateEMI(loan.loanAmount, loan.interestRate, loan.loanTerm)
            const isOverdue = new Date(loan.startDate) < new Date()

            return (
              <div
                key={loan.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-700 text-[var(--foreground)]">{loan.bankName}</h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--info-soft)] text-[var(--info)]">
                        {loan.loanType}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Started {new Date(loan.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenForm(loan)}
                      className="p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLoan(loan.id)}
                      disabled={deletingId === loan.id}
                      className="p-2 text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Amount</p>
                    <p className="font-semibold text-[var(--foreground)]">₹{loan.loanAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Rate p.a.</p>
                    <p className="font-semibold text-[var(--foreground)]">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">EMI</p>
                    <p className="font-semibold text-[var(--foreground)]">₹{Math.round(emi).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Term</p>
                    <p className="font-semibold text-[var(--foreground)]">{loan.loanTerm} months</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Loan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-t-3xl md:rounded-2xl w-full md:w-[500px] max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-700 text-lg text-[var(--foreground)]">
                {editingLoan ? 'Edit Loan' : 'Add New Loan'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
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
                      bankName: editingLoan.bankName,
                      loanAmount: editingLoan.loanAmount.toString(),
                      interestRate: editingLoan.interestRate.toString(),
                      loanTerm: editingLoan.loanTerm.toString(),
                      loanType: editingLoan.loanType,
                      startDate: editingLoan.startDate,
                    }
                  : undefined
              }
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  )
}
