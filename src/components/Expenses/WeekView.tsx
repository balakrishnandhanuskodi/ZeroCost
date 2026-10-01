import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Expense } from '../../lib/expensesService'

interface WeekViewProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
  isLoading: boolean
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Food': { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400' },
  'Shopping': { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400' },
  'Travel': { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400' },
  'Petrol Expense': { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400' },
  'Bills': { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400' },
  'Sports': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400' },
  'Others': { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-600 dark:text-gray-400' },
  'Transfer': { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400' },
}

export default function WeekView({ expenses, onDeleteExpense, isLoading }: WeekViewProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const touchStart = useRef(0)

  const getWeekDates = () => {
    const today = new Date()
    const currentDate = new Date(today.setDate(today.getDate() + weekOffset * 7))
    const monday = new Date(currentDate)
    monday.setDate(currentDate.getDate() - currentDate.getDay() + 1)

    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      week.push({ date, dateStr })
    }
    return week
  }

  const groupExpensesByDay = (weekDates: ReturnType<typeof getWeekDates>) => {
    const grouped: Record<string, Expense[]> = {}
    weekDates.forEach(({ dateStr }) => {
      grouped[dateStr] = expenses.filter(exp => exp.date === dateStr)
    })
    return grouped
  }

  const weekDates = getWeekDates()
  const expensesByDay = groupExpensesByDay(weekDates)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    if (touchStart.current - touchEnd > 50) {
      setWeekOffset(prev => prev + 1)
    } else if (touchEnd - touchStart.current > 50) {
      setWeekOffset(prev => prev - 1)
    }
  }

  const weekRange = `${weekDates[0].date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${weekDates[6].date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset(prev => prev - 1)}
          className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center flex-1">
          <div className="text-[12px] font-semibold text-[var(--muted-foreground)]">Week of</div>
          <div className="text-sm font-semibold text-[var(--foreground)]">{weekRange}</div>
        </div>
        <button
          onClick={() => setWeekOffset(prev => prev + 1)}
          className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Daily Cards */}
      <div className="space-y-3">
        {weekDates.map(({ date, dateStr }) => {
          const dayExpenses = expensesByDay[dateStr]
          const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
          const isExpanded = expandedDay === dateStr
          const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' })

          return (
            <button
              key={dateStr}
              onClick={() => setExpandedDay(isExpanded ? null : dateStr)}
              className={`w-full p-3 rounded-lg border transition-all text-left ${
                dayTotal > 0
                  ? 'border-[var(--primary)] bg-[var(--muted)]/50 hover:bg-[var(--muted)]/80'
                  : 'border-[var(--border)] bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-semibold text-[var(--muted-foreground)]">{dayName}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">{new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div className="flex items-center gap-2">
                  {dayTotal > 0 && (
                    <div className="text-right">
                      <div className="text-[14px] font-bold text-[var(--primary)]">₹{dayTotal.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">{dayExpenses.length} transaction{dayExpenses.length !== 1 ? 's' : ''}</div>
                    </div>
                  )}
                  {dayExpenses.length > 0 && (
                    <div className="text-[var(--muted-foreground)]">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && dayExpenses.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
                  {dayExpenses.map(exp => (
                    <div key={exp.id} className={`flex items-start justify-between gap-2 p-2 rounded ${CATEGORY_COLORS[exp.category]?.bg || CATEGORY_COLORS['Others'].bg}`}>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-semibold mb-0.5 ${CATEGORY_COLORS[exp.category]?.text || CATEGORY_COLORS['Others'].text}`}>
                          {exp.category}
                        </div>
                        <div className="text-[11px] text-[var(--foreground)] truncate">{exp.description}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className={`text-[11px] font-semibold ${CATEGORY_COLORS[exp.category]?.text || CATEGORY_COLORS['Others'].text}`}>
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteExpense(exp.id)
                          }}
                          disabled={isLoading}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 text-[12px]"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
