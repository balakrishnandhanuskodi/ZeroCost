import { goals, formatCurrency } from '../data/mockData'
import { Plus, Target } from 'lucide-react'

function GoalCard({ goal }: { goal: typeof goals[0] }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100)
  const remaining = goal.target - goal.current
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const monthlyNeeded = remaining / Math.max(Math.ceil(daysLeft / 30), 1)

  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.icon}</span>
          <div>
            <div className="font-display font-600 text-[var(--foreground)]">{goal.name}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Target: {goal.deadline}
            </div>
          </div>
        </div>
        <span
          className="text-sm font-bold px-2.5 py-1 rounded-xl"
          style={{ backgroundColor: goal.color + '18', color: goal.color }}
        >
          {Math.round(pct)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-[var(--muted)] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: goal.color }}
        />
      </div>

      <div className="flex items-center justify-between text-xs mb-4">
        <div>
          <div className="font-bold text-[var(--foreground)]" style={{ color: goal.color }}>
            {formatCurrency(goal.current, true)}
          </div>
          <div className="text-[var(--muted-foreground)]">saved</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[var(--muted-foreground)]">{formatCurrency(remaining, true)}</div>
          <div className="text-[var(--muted-foreground)]">to go</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-[var(--foreground)]">{formatCurrency(goal.target, true)}</div>
          <div className="text-[var(--muted-foreground)]">target</div>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>{daysLeft} days left</span>
        <span className="font-semibold text-[var(--foreground)]">{formatCurrency(monthlyNeeded, true)}/month needed</span>
      </div>
    </div>
  )
}

export default function Goals() {
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const totalSaved = goals.reduce((s, g) => s + g.current, 0)

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Financial Goals</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{goals.length} active goals</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">New Goal</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200">
          <Target size={20} className="text-emerald-600 mb-2" />
          <div className="font-display font-700 text-xl text-emerald-700">{formatCurrency(totalSaved, true)}</div>
          <div className="text-xs text-emerald-600 mt-0.5">Total Saved</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-5 border border-indigo-200">
          <Target size={20} className="text-indigo-600 mb-2" />
          <div className="font-display font-700 text-xl text-indigo-700">{formatCurrency(totalTarget, true)}</div>
          <div className="text-xs text-indigo-600 mt-0.5">Total Target</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-[var(--foreground)]">Overall Goal Progress</span>
          <span className="font-bold text-emerald-600">{Math.round((totalSaved / totalTarget) * 100)}%</span>
        </div>
        <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
            style={{ width: `${(totalSaved / totalTarget) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
          <span>{formatCurrency(totalSaved, true)} saved</span>
          <span>{formatCurrency(totalTarget - totalSaved, true)} remaining</span>
        </div>
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  )
}
