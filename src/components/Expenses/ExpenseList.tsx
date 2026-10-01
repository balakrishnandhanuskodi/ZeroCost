import { Expense } from '../../lib/expensesService'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete?: (expenseId: string) => void
  isLoading?: boolean
}

export default function ExpenseList({ expenses, onDelete, isLoading = false }: ExpenseListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100/40 text-orange-700',
      'Shopping': 'bg-blue-100/40 text-blue-700',
      'Travel': 'bg-green-100/40 text-green-700',
      'Petrol Expense': 'bg-red-100/40 text-red-700',
      'Fuel': 'bg-red-100/40 text-red-700',
      'Bills': 'bg-purple-100/40 text-purple-700',
      'Sports': 'bg-pink-100/40 text-pink-700',
      'Others': 'bg-gray-100/40 text-gray-700'
    }
    return colors[category] || colors['Others']
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-lg p-3 text-center">
        <p className="text-[12px] font-semibold text-[var(--success)] mb-0.5">No Expenses</p>
        <p className="text-[11px] text-[var(--muted-foreground)]">Add your first expense to get started</p>
      </div>
    )
  }

  // Group expenses by date
  const groupedByDate = expenses.reduce((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = []
    acc[exp.date].push(exp)
    return acc
  }, {} as Record<string, Expense[]>)

  return (
    <div className="space-y-3">
      {Object.entries(groupedByDate).map(([date, dayExpenses]) => {
        const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)

        return (
          <div key={date} className="bg-[var(--muted)] rounded-lg overflow-hidden">
            {/* Date Header */}
            <div className="bg-[var(--muted)] p-2 flex justify-between items-center border-b border-[var(--border)]">
              <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
                {formatDate(date)}
              </p>
              <p className="text-[12px] font-bold text-[var(--foreground)]">
                ₹{dayTotal.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Day's Expenses */}
            <div className="space-y-1 p-2">
              {dayExpenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between gap-2 bg-[var(--card)] p-1.5 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${getCategoryColor(exp.category)}`}>
                        {exp.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--foreground)] truncate mt-0.5">
                      {exp.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold text-[var(--foreground)] flex-shrink-0">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </p>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(exp.id)}
                        disabled={isLoading}
                        className="text-[11px] px-1.5 py-0.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded disabled:opacity-50"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
