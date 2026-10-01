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
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

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
          const isSelected = selectedDay === day

          return (
            <button
              key={idx}
              onClick={() => dayExpenses && dayExpenses.length > 0 ? setSelectedDay(isSelected ? null : (day as number)) : null}
              className={`min-h-24 p-2 rounded border relative text-left ${
                day === null
                  ? 'bg-[var(--muted)]/30'
                  : dayExpenses && dayExpenses.length > 0
                  ? `border-[var(--primary)] ${isSelected ? 'bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]' : 'bg-[var(--muted)]/50 hover:bg-[var(--muted)]/80'} cursor-pointer`
                  : 'border-[var(--border)] hover:bg-[var(--muted)]/30'
              } transition-all`}
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
            </button>
          )
        })}
      </div>

      {/* Details Panel - Click-based */}
      {selectedDay !== null && expensesByDay[selectedDay] && (
        <div className="mt-6 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-semibold text-[var(--foreground)] mb-1">
                {new Date(selectedMonth.year, selectedMonth.month - 1, selectedDay).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="text-[12px] text-[var(--muted-foreground)]">
                {expensesByDay[selectedDay]?.length} transaction{expensesByDay[selectedDay]?.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {expensesByDay[selectedDay]?.map(exp => (
              <div key={exp.id} className={`flex items-start justify-between gap-3 p-3 rounded-lg ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Others']}`}>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-[var(--foreground)] mb-1">{exp.description}</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">{exp.category}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-[13px] font-bold text-[var(--foreground)]">₹{exp.amount.toLocaleString('en-IN')}</div>
                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    disabled={isLoading}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 text-[14px] leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--border)]">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-semibold text-[var(--foreground)]">Daily Total:</span>
              <span className="text-[16px] font-bold text-[var(--primary)]">₹{expensesByDay[selectedDay]?.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
