import { useState, useEffect } from 'react'
import { Pin } from 'lucide-react'
import Button from '../UI/Button'
import { LoanFormInput, LoanType, calculateMonthlyInterest } from '../../lib/loansService'

interface LoanFormProps {
  onSubmit: (data: LoanFormInput) => Promise<void>
  onCancel: () => void
  initialData?: LoanFormInput
  isLoading?: boolean
}

export default function LoanForm({ onSubmit, onCancel, initialData, isLoading = false }: LoanFormProps) {
  const [formData, setFormData] = useState<LoanFormInput>(
    initialData || {
      lender_name: '',
      loan_type: 'Personal',
      principal: '',
      current_balance: '',
      interest_rate: '',
      interest_type: 'fixed',
      tenure: '',
      tenure_unit: 'months',
      start_date: '',
      end_date: '',
      monthly_payment_date: '',
      emi_amount: '',
      first_emi_date: '',
      first_emi_amount: '',
      first_payment_interest: '',
      emis_paid_count: '',
      last_payment_date: '',
      status: 'active',
      notes: '',
    }
  )
  const [errors, setErrors] = useState<Partial<LoanFormInput>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(!initialData)

  // Auto-calculate EMI and balance for Jewel Loans
  useEffect(() => {
    if (formData.loan_type === 'Jewel Loan' && formData.principal && formData.interest_rate) {
      const monthlyInterest = calculateMonthlyInterest(parseFloat(formData.principal), parseFloat(formData.interest_rate))
      setFormData(prev => ({
        ...prev,
        emi_amount: monthlyInterest.toString(),
        first_emi_amount: monthlyInterest.toString(),
        current_balance: formData.principal
      }))
    }
  }, [formData.loan_type, formData.principal, formData.interest_rate])

  const validateForm = (): boolean => {
    const newErrors: Partial<LoanFormInput> = {}

    if (!formData.lender_name.trim()) newErrors.lender_name = 'Lender name is required'
    if (!formData.principal || parseFloat(formData.principal) <= 0) newErrors.principal = 'Valid principal amount required'
    if (!formData.current_balance || parseFloat(formData.current_balance) < 0) newErrors.current_balance = 'Valid balance required'
    if (!formData.interest_rate || parseFloat(formData.interest_rate) < 0) newErrors.interest_rate = 'Valid interest rate required'
    if (!formData.tenure || parseInt(formData.tenure) <= 0) newErrors.tenure = 'Valid tenure required'
    if (!formData.start_date) newErrors.start_date = 'Start date is required'
    if (!formData.emi_amount || parseFloat(formData.emi_amount) <= 0) newErrors.emi_amount = 'Valid EMI amount required'
    if (!formData.first_emi_date) newErrors.first_emi_date = 'First EMI date is required'
    if (!formData.first_emi_amount || parseFloat(formData.first_emi_amount) <= 0) newErrors.first_emi_amount = 'Valid first EMI amount required'

    // Jewel Loan specific validation
    if (formData.loan_type === 'Jewel Loan') {
      const principal = parseFloat(formData.principal)
      const balance = parseFloat(formData.current_balance)
      if (Math.abs(principal - balance) > 0.01) {
        newErrors.current_balance = 'For Jewel Loans, balance must equal principal (interest-only)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value as any }))
    if (errors[name as keyof LoanFormInput]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 max-h-[80vh] overflow-y-auto">
      {/* Form Mode Toggle */}
      {!isEditing && (
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex-1 text-xs py-1.5"
            type="button"
          >
            Edit Loan Details
          </Button>
        </div>
      )}

      {/* Lender Name & Loan Type & Status */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Lender Name</label>
          <input
            type="text"
            name="lender_name"
            value={formData.lender_name}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="e.g., HDFC Bank"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
          {errors.lender_name && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.lender_name}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Type</label>
          <select
            name="loan_type"
            value={formData.loan_type || 'Personal'}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          >
            <option value="Home">Home</option>
            <option value="Personal">Personal</option>
            <option value="Auto">Auto</option>
            <option value="Education">Education</option>
            <option value="Jewel Loan">Jewel Loan (Gold)</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
      </div>

      {/* Principal & Current Balance & Interest Rate */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Principal (₹)</label>
          <input
            type="number"
            name="principal"
            value={formData.principal}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="0"
            min="0"
            step="1"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
          {errors.principal && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.principal}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Balance (₹) {formData.loan_type === 'Jewel Loan' && <span className="text-[10px] text-[var(--muted-foreground)]">(Auto)</span>}</label>
          <input
            type="number"
            name="current_balance"
            value={formData.current_balance}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1"
            disabled={formData.loan_type === 'Jewel Loan' || !isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
          {errors.current_balance && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.current_balance}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Rate (%) p.a.</label>
          <input
            type="number"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="10.65"
            min="0"
            max="100"
            step="0.01"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
          {errors.interest_rate && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.interest_rate}</p>}
        </div>
      </div>

      {/* Interest Type & Tenure & Unit */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Interest Type</label>
          <select
            name="interest_type"
            value={formData.interest_type}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          >
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Tenure</label>
          <input
            type="number"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="60"
            min="1"
            step="1"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
          {errors.tenure && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.tenure}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Unit</label>
          <select
            name="tenure_unit"
            value={formData.tenure_unit}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>

      {/* Start Date & End Date & Pay Date */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
          {errors.start_date && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.start_date}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">End Date (Opt)</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Pay Date (1-31)</label>
          <input
            type="number"
            name="monthly_payment_date"
            value={formData.monthly_payment_date || ''}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="15"
            min="1"
            max="31"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
          />
        </div>
      </div>

      {/* EMI Amount & First EMI Details */}
      <div>
        <div className="mb-2 p-2 bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg">
          <p className="text-[11px] text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--primary)] flex items-center gap-1.5 mb-1">
              <Pin size={14} className="text-[var(--primary)]" />
              EMI & First Payment Details
            </span><br/>
            {formData.loan_type === 'Jewel Loan'
              ? 'Monthly payment is auto-calculated as: Principal × (Rate ÷ 12 ÷ 100). Payments are interest-only.'
              : 'Enter the standard EMI for all payments. If your first payment differs (stub interest), enter that amount separately.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">EMI Amount (₹) *</label>
            <input
              type="number"
              name="emi_amount"
              value={formData.emi_amount}
              onChange={handleChange}
              disabled={formData.loan_type === 'Jewel Loan' || !isEditing}
              placeholder="32352"
              min="0"
              step="0.01"
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
            {errors.emi_amount && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.emi_amount}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">First EMI Date *</label>
            <input
              type="date"
              name="first_emi_date"
              value={formData.first_emi_date}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
            {errors.first_emi_date && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.first_emi_date}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">First EMI Amount (₹) *</label>
            <input
              type="number"
              name="first_emi_amount"
              value={formData.first_emi_amount}
              onChange={handleChange}
              disabled={formData.loan_type === 'Jewel Loan' || !isEditing}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
            {errors.first_emi_amount && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.first_emi_amount}</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">First Payment Interest (₹)</label>
            <input
              type="number"
              name="first_payment_interest"
              value={formData.first_payment_interest || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="From schedule"
              min="0"
              step="0.01"
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5 text-[var(--muted-foreground)]">First Payment Principal (₹)</label>
            <input
              type="text"
              disabled
              value={formData.first_emi_amount && formData.first_payment_interest ? `₹${(parseFloat(formData.first_emi_amount) - parseFloat(formData.first_payment_interest)).toFixed(2)}` : '—'}
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] opacity-75"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5 text-[var(--muted-foreground)]">EMI Difference (₹)</label>
            <input
              type="text"
              disabled
              value={formData.first_emi_amount && formData.emi_amount ? `₹${(parseFloat(formData.first_emi_amount) - parseFloat(formData.emi_amount)).toFixed(2)}` : '—'}
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] opacity-75"
            />
          </div>
        </div>
      </div>

      {/* Payment History (Optional) */}
      <div>
        <div className="mb-2 p-2 bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg">
          <p className="text-[11px] text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--warning)]">Already Paying? (Optional)</span><br/>
            If you've already paid some EMIs, enter the count and last payment date. System will mark them as paid.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">EMIs Already Paid</label>
            <input
              type="number"
              name="emis_paid_count"
              value={formData.emis_paid_count || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="0"
              min="0"
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Last Payment Date</label>
            <input
              type="date"
              name="last_payment_date"
              value={formData.last_payment_date || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Add any notes..."
              rows={1}
              className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting || isLoading}
              className="flex-1 text-xs py-1.5"
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 text-xs py-1.5"
            >
              {isSubmitting || isLoading ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="flex-1 text-xs py-1.5"
              type="button"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting || isLoading}
              className="flex-1 text-xs py-1.5"
              type="button"
            >
              Edit & Update
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
