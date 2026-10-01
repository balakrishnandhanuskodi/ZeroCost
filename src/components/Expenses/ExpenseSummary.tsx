interface CategoryBreakdown {
  amount: number
  count: number
}

interface ExpenseSummaryProps {
  totalAmount: number
  categoryBreakdown: Record<string, CategoryBreakdown>
  transactionCount: number
  averageDaily: number
  onAddClick: () => void
}

export default function ExpenseSummary({
  totalAmount,
  categoryBreakdown,
  transactionCount,
  averageDaily,
  onAddClick
}: ExpenseSummaryProps) {
  // Get top 3 categories
  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 3)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100/40 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
      'Shopping': 'bg-blue-100/40 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
      'Travel': 'bg-green-100/40 text-green-700 dark:bg-green-950/30 dark:text-green-400',
      'Petrol Expense': 'bg-red-100/40 text-red-700 dark:bg-red-950/30 dark:text-red-400',
      'Fuel': 'bg-red-100/40 text-red-700 dark:bg-red-950/30 dark:text-red-400',
      'Bills': 'bg-purple-100/40 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
      'Sports': 'bg-pink-100/40 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400',
      'Others': 'bg-gray-100/40 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
    }
    return colors[category] || colors['Others']
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-2.5">
      {/* Header */}
      <div className="mb-2 flex justify-between items-start">
        <div>
          <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-0.5">
            Monthly Expenses
          </h3>
          <p className="text-[12px] text-[var(--muted-foreground)]">
            This month's spending
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="px-2.5 py-1 rounded bg-[var(--primary)] text-white text-[10px] font-semibold hover:opacity-80 transition-opacity"
        >
          + Add
        </button>
      </div>

      {/* Total Amount */}
      <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg p-2 mb-2">
        <p className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase mb-0.5">
          Total Expenses
        </p>
        <p className="font-display font-700 text-lg text-[var(--warning)]">
          ₹{totalAmount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        <div className="bg-[var(--muted)] rounded-lg p-2">
          <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold mb-0.5">
            Transactions
          </p>
          <p className="text-[14px] font-bold text-[var(--foreground)]">
            {transactionCount}
          </p>
        </div>
        <div className="bg-[var(--muted)] rounded-lg p-2">
          <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold mb-0.5">
            Daily Avg
          </p>
          <p className="text-[14px] font-bold text-[var(--foreground)]">
            ₹{Math.round(averageDaily).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-[var(--muted)] rounded-lg p-2">
        <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold mb-1.5">
          Top Categories
        </p>
        <div className="space-y-1">
          {topCategories.map(([category, data]) => (
            <div key={category} className="flex items-center justify-between gap-2">
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${getCategoryColor(category)}`}>
                {category}
              </span>
              <div className="flex-1 flex items-center gap-1">
                <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)]"
                    style={{ width: `${(data.amount / totalAmount) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-[var(--foreground)] min-w-fit">
                  ₹{data.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
