import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AddExpenseModal from '../components/Expenses/AddExpenseModal'
import ExpenseList from '../components/Expenses/ExpenseList'
import ExpenseSummary from '../components/Expenses/ExpenseSummary'
import { getExpensesByMonth, getMonthlyStats, addExpense, deleteExpense, type Expense, type ExpenseInput } from '../lib/expensesService'

export default function Expenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 })

  useEffect(() => {
    if (user) {
      loadExpenses()
    }
  }, [user, selectedMonth])

  const loadExpenses = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await getExpensesByMonth(user.id, selectedMonth.year, selectedMonth.month)
      setExpenses(data)
    } catch (err) {
      console.error('Failed to load expenses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExpense = async (expense: ExpenseInput) => {
    if (!user) return
    setIsSubmitting(true)
    try {
      await addExpense(user.id, expense)
      await loadExpenses()
    } catch (err) {
      console.error('Error adding expense:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Delete this expense?')) return
    try {
      await deleteExpense(expenseId)
      await loadExpenses()
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  const handlePrevMonth = () => {
    if (selectedMonth.month === 1) {
      setSelectedMonth({ year: selectedMonth.year - 1, month: 12 })
    } else {
      setSelectedMonth({ year: selectedMonth.year, month: selectedMonth.month - 1 })
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth.month === 12) {
      setSelectedMonth({ year: selectedMonth.year + 1, month: 1 })
    } else {
      setSelectedMonth({ year: selectedMonth.year, month: selectedMonth.month + 1 })
    }
  }

  const monthYear = new Date(selectedMonth.year, selectedMonth.month - 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  })

  // Calculate stats
  let stats = { totalAmount: 0, categoryBreakdown: {}, topMerchants: [], averageDaily: 0, transactionCount: 0 }
  if (expenses.length > 0) {
    stats.totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    stats.categoryBreakdown = expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) acc[exp.category] = { amount: 0, count: 0 }
      acc[exp.category].amount += exp.amount
      acc[exp.category].count += 1
      return acc
    }, {} as Record<string, { amount: number; count: number }>)
    stats.averageDaily = stats.totalAmount / new Set(expenses.map(e => e.date)).size
    stats.transactionCount = expenses.length
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-display font-700 text-[var(--foreground)] mb-1">
          Expenses
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Track your daily spending
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
        >
          ←
        </button>
        <p className="text-sm font-semibold text-[var(--foreground)] flex-1 text-center">
          {monthYear}
        </p>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
        >
          →
        </button>
      </div>

      {/* Summary Card */}
      {!isLoading && (
        <div className="mb-4">
          <ExpenseSummary
            totalAmount={stats.totalAmount}
            categoryBreakdown={stats.categoryBreakdown}
            transactionCount={stats.transactionCount}
            averageDaily={stats.averageDaily}
            onAddClick={() => setIsModalOpen(true)}
          />
        </div>
      )}

      {/* Expense List */}
      {isLoading ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-[var(--muted)] mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-[var(--muted-foreground)]">Loading expenses...</p>
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onDelete={handleDeleteExpense}
          isLoading={isSubmitting}
        />
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
        isLoading={isSubmitting}
      />
    </div>
  )
}
