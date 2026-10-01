import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Expense } from '../../lib/expensesService'

interface CalendarViewProps {
  expenses: Expense[]
  selectedMonth: { year: number; month: number }
  onPrevMonth: () => void
  onNextMonth: () => void
  onDeleteExpense: (id: string) => void
  isLoading: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'Shopping': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Travel': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  'Petrol Expense': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'Bills': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'Sports': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  'Others': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
  'Transfer': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
}

export default function CalendarView({ expenses, selectedMonth, onPrevMonth, onNextMonth, onDeleteExpense, isLoading }: CalendarViewProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  const groupExpensesByDay = () => {
    const grouped: Record<number, Expense[]> = {}
    expenses.forEach(exp => {
      const [year, month, day] = exp.date.split('-').map(Number)
      if (year === selectedMonth.year && month === selectedMonth.month) {
        if (!grouped[day]) grouped[day] = []
        grouped[day].push(exp)
      }
    })
    return grouped
  }

  const expensesByDay = groupExpensesByDay()
  const daysInMonth = getDaysInMonth(selectedMonth.year, selectedMonth.month)
  const firstDay = getFirstDayOfMonth(selectedMonth.year, selectedMonth.month)
  const monthName = new Date(selectedMonth.year, selectedMonth.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const days = Array.from({ length: firstDay }).fill(null)
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handleMouseEnter = (day: number | null, e: React.MouseEvent) => {
    if (day === null) return
    setHoveredDay(day)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltipPos({ x: rect.left, y: rect.bottom + 5 })
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrevMonth} className="p-2 hover:bg-[var(--muted)] rounded transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{monthName}</h2>
        <button onClick={onNextMonth} className="p-2 hover:bg-[var(--muted)] rounded transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-[11px] font-semibold text-[var(--muted-foreground)] py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, idx) => {
          const dayExpenses = day ? expensesByDay[day as number] : undefined
          const dayTotal = dayExpenses?.reduce((sum, exp) => sum + exp.amount, 0) ?? 0

          return (
            <div
              key={idx}
              onMouseEnter={(e) => handleMouseEnter(day as number, e)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`min-h-24 p-2 rounded border relative ${
                day === null
                  ? 'bg-[var(--muted)]/30'
                  : dayExpenses && dayExpenses.length > 0
                  ? 'border-[var(--primary)] bg-[var(--muted)]/50 hover:bg-[var(--muted)]/80 cursor-pointer'
                  : 'border-[var(--border)] hover:bg-[var(--muted)]/30'
              } transition-colors`}
            >
              {day && (
                <>
                  <div className="text-[12px] font-semibold text-[var(--foreground)] mb-1">{day}</div>
                  {dayTotal > 0 && (
                    <div>
                      <div className="text-[14px] font-bold text-[var(--primary)] mb-1">
                        ₹{dayTotal.toLocaleString('en-IN')}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dayExpenses?.slice(0, 3).map((exp, i) => (
                          <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Others']}`}>
                            {exp.category.split(' ')[0]}
                          </span>
                        ))}
                        {dayExpenses && dayExpenses.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 text-[var(--muted-foreground)]">
                            +{dayExpenses.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Tooltip - Expense List */}
      {hoveredDay !== null && expensesByDay[hoveredDay] && tooltipPos && (
        <div
          className="fixed z-50 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-3 min-w-80 max-w-md"
          style={{ left: `${Math.min(tooltipPos.x, window.innerWidth - 320)}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="text-[12px] font-semibold text-[var(--foreground)] mb-2">
            {new Date(selectedMonth.year, selectedMonth.month - 1, hoveredDay).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {expensesByDay[hoveredDay]?.map(exp => (
              <div key={exp.id} className="flex items-start justify-between gap-2 py-1.5 border-b border-[var(--border)] last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Others']}`}>
                      {exp.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">{exp.description}</div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div className="text-[12px] font-semibold text-[var(--foreground)]">₹{exp.amount.toLocaleString('en-IN')}</div>
                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    disabled={isLoading}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 text-[12px]"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-[var(--border)] text-[11px] font-semibold text-[var(--foreground)]">
            Total: ₹{expensesByDay[hoveredDay]?.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </div>
  )
}
