import { useState } from 'react'
import { EXPENSE_CATEGORIES, ExpenseInput } from '../../lib/expensesService'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (expense: ExpenseInput) => Promise<void>
  isLoading?: boolean
}

export default function AddExpenseModal({ isOpen, onClose, onSubmit, isLoading = false }: AddExpenseModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const [formData, setFormData] = useState<ExpenseInput>({
    date: today,
    category: 'Food',
    description: '',
    amount: 0,
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || formData.amount <= 0) return

    try {
      await onSubmit(formData)
      setFormData({
        date: today,
        category: 'Food',
        description: '',
        amount: 0,
        notes: ''
      })
      onClose()
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 w-full max-w-sm">
        <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-4">
          Add Expense
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Date */}
          <div>
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-1 block">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-2 py-1.5 border border-[var(--border)] rounded bg-[var(--muted)] text-[var(--foreground)] text-[12px]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-1 block">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-2 py-1.5 border border-[var(--border)] rounded bg-[var(--muted)] text-[var(--foreground)] text-[12px]"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-1 block">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Merchant or description"
              className="w-full px-2 py-1.5 border border-[var(--border)] rounded bg-[var(--muted)] text-[var(--foreground)] text-[12px]"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-1 block">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-2 py-1.5 border border-[var(--border)] rounded bg-[var(--muted)] text-[var(--foreground)] text-[12px]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase mb-1 block">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes..."
              className="w-full px-2 py-1.5 border border-[var(--border)] rounded bg-[var(--muted)] text-[var(--foreground)] text-[12px] resize-none h-16"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded border border-[var(--border)] text-[12px] font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.description || formData.amount <= 0}
              className="flex-1 px-3 py-2 rounded bg-[var(--primary)] text-white text-[12px] font-semibold hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
