import { useState } from 'react'
import Button from '../UI/Button'
import { LoanFormInput } from '../../lib/loansService'

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
      principal: '',
      current_balance: '',
      interest_rate: '',
      interest_type: 'fixed',
      tenure: '',
      tenure_unit: 'months',
      start_date: '',
      status: 'active',
    }
  )
  const [errors, setErrors] = useState<Partial<LoanFormInput>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<LoanFormInput> = {}

    if (!formData.lender_name.trim()) newErrors.lender_name = 'Lender name is required'
    if (!formData.principal || parseFloat(formData.principal) <= 0) newErrors.principal = 'Valid principal amount required'
    if (!formData.current_balance || parseFloat(formData.current_balance) < 0) newErrors.current_balance = 'Valid balance required'
    if (!formData.interest_rate || parseFloat(formData.interest_rate) < 0) newErrors.interest_rate = 'Valid interest rate required'
    if (!formData.tenure || parseInt(formData.tenure) <= 0) newErrors.tenure = 'Valid tenure required'
    if (!formData.start_date) newErrors.start_date = 'Start date is required'

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
      {/* Lender Name */}
      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Lender Name</label>
        <input
          type="text"
          name="lender_name"
          value={formData.lender_name}
          onChange={handleChange}
          placeholder="e.g., HDFC Bank"
          className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        {errors.lender_name && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.lender_name}</p>}
      </div>

      {/* Principal & Current Balance */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Principal (₹)</label>
          <input
            type="number"
            name="principal"
            value={formData.principal}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1000"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          {errors.principal && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.principal}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Balance (₹)</label>
          <input
            type="number"
            name="current_balance"
            value={formData.current_balance}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1000"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          {errors.current_balance && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.current_balance}</p>}
        </div>
      </div>

      {/* Interest Rate & Type */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Rate (%)</label>
          <input
            type="number"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            placeholder="7.5"
            min="0"
            max="100"
            step="0.1"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          {errors.interest_rate && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.interest_rate}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Type</label>
          <select
            name="interest_type"
            value={formData.interest_type}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </select>
        </div>
      </div>

      {/* Tenure */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Tenure</label>
          <input
            type="number"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            placeholder="60"
            min="1"
            step="1"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          {errors.tenure && <p className="text-[10px] text-[var(--danger)] mt-0.5">{errors.tenure}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Unit</label>
          <select
            name="tenure_unit"
            value={formData.tenure_unit}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {/* Payment Date & Status */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Pay Date (1-31)</label>
          <input
            type="number"
            name="monthly_payment_date"
            value={formData.monthly_payment_date || ''}
            onChange={handleChange}
            placeholder="15"
            min="1"
            max="31"
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-0.5">Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Add any notes..."
          rows={2}
          className="w-full px-2.5 py-1.5 border border-[var(--border)] rounded-lg bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="flex-1 text-xs py-1.5"
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
      </div>
    </form>
  )
}
