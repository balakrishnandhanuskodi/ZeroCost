import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../UI/Button'
import Input from '../UI/Input'

interface LoanFormData {
  bankName: string
  loanAmount: string
  interestRate: string
  loanTerm: string
  loanType: string
  startDate: string
}

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => Promise<void>
  onCancel: () => void
  initialData?: LoanFormData
  isLoading?: boolean
}

export default function LoanForm({ onSubmit, onCancel, initialData, isLoading = false }: LoanFormProps) {
  const [formData, setFormData] = useState<LoanFormData>(
    initialData || {
      bankName: '',
      loanAmount: '',
      interestRate: '',
      loanTerm: '',
      loanType: 'home',
      startDate: '',
    }
  )
  const [errors, setErrors] = useState<Partial<LoanFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<LoanFormData> = {}

    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required'
    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) newErrors.loanAmount = 'Valid loan amount required'
    if (!formData.interestRate || parseFloat(formData.interestRate) < 0) newErrors.interestRate = 'Valid interest rate required'
    if (!formData.loanTerm || parseInt(formData.loanTerm) <= 0) newErrors.loanTerm = 'Valid loan term required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof LoanFormData]) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bank Name */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Bank Name
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="e.g., HDFC Bank, ICICI Bank"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        {errors.bankName && <p className="text-xs text-[var(--danger)] mt-1">{errors.bankName}</p>}
      </div>

      {/* Loan Type */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Loan Type
        </label>
        <select
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="home">Home Loan</option>
          <option value="personal">Personal Loan</option>
          <option value="auto">Auto Loan</option>
          <option value="education">Education Loan</option>
          <option value="business">Business Loan</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Loan Amount */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Loan Amount (₹)
        </label>
        <input
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          placeholder="e.g., 1000000"
          min="0"
          step="1000"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        {errors.loanAmount && <p className="text-xs text-[var(--danger)] mt-1">{errors.loanAmount}</p>}
      </div>

      {/* Interest Rate */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Interest Rate (% p.a.)
        </label>
        <input
          type="number"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleChange}
          placeholder="e.g., 7.5"
          min="0"
          max="100"
          step="0.1"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        {errors.interestRate && <p className="text-xs text-[var(--danger)] mt-1">{errors.interestRate}</p>}
      </div>

      {/* Loan Term */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Loan Term (Months)
        </label>
        <input
          type="number"
          name="loanTerm"
          value={formData.loanTerm}
          onChange={handleChange}
          placeholder="e.g., 60"
          min="1"
          step="1"
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        {errors.loanTerm && <p className="text-xs text-[var(--danger)] mt-1">{errors.loanTerm}</p>}
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
          Loan Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        {errors.startDate && <p className="text-xs text-[var(--danger)] mt-1">{errors.startDate}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1"
        >
          {isSubmitting || isLoading ? 'Saving...' : 'Save Loan'}
        </Button>
      </div>
    </form>
  )
}
