import { budgetCategories, formatCurrency } from '../data/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function BudgetCard({ cat }: { cat: typeof budgetCategories[0] }) {
  const pct = Math.min((cat.spent / cat.budget) * 100, 100)
  const over = cat.spent > cat.budget
  const warn = pct >= 80
  const remaining = cat.budget - cat.spent
  const barColor = over ? '#ef4444' : warn ? '#f97316' : '#16a34a'
  const bgColor = over ? '#fef2f2' : warn ? '#fff7ed' : '#f0fdf4'
  const textColor = over ? '#ef4444' : warn ? '#f97316' : '#16a34a'

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{cat.icon}</span>
          <span className="font-semibold text-sm text-[var(--foreground)]">{cat.name}</span>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-xl"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {Math.round(pct)}%
        </span>
      </div>

      <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <div className="font-bold text-[var(--foreground)]">{formatCurrency(cat.spent, true)}</div>
          <div className="text-[var(--muted-foreground)]">spent</div>
        </div>
        <div className="text-center">
          <div className={`font-bold ${over ? 'text-red-500' : 'text-[var(--muted-foreground)]'}`}>
            {over ? `+${formatCurrency(Math.abs(remaining), true)}` : formatCurrency(remaining, true)}
          </div>
          <div className="text-[var(--muted-foreground)]">{over ? 'over' : 'remaining'}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-[var(--foreground)]">{formatCurrency(cat.budget, true)}</div>
          <div className="text-[var(--muted-foreground)]">budget</div>
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-lg text-xs">
      <div className="font-semibold mb-1 text-[var(--foreground)]">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-[var(--muted-foreground)]">{p.name}:</span>
          <span className="font-semibold">{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Budget() {
  const totalBudget = budgetCategories.reduce((s, c) => s + c.budget, 0)
  const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0)
  const overBudget = budgetCategories.filter(c => c.spent > c.budget).length

  const chartData = budgetCategories.map(c => ({
    name: c.name.split(' ')[0],
    Budget: c.budget,
    Spent: c.spent,
    over: c.spent > c.budget,
  }))

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Budget Overview</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">August 2026 · Monthly plan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--border)] shadow-sm text-center">
          <div className="font-display font-700 text-xl text-[var(--primary)]">{formatCurrency(totalBudget, true)}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">Total Budget</div>
        </div>
        <div className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--border)] shadow-sm text-center">
          <div className="font-display font-700 text-xl text-orange-500">{formatCurrency(totalSpent, true)}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">Spent So Far</div>
        </div>
        <div className={`rounded-2xl p-4 border shadow-sm text-center ${overBudget > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className={`font-display font-700 text-xl ${overBudget > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{overBudget}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">Over Budget</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm mb-6">
        <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Budget vs Spent</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Budget" />
            <Bar dataKey="Spent" radius={[4, 4, 0, 0]} name="Spent">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.over ? '#ef4444' : '#16a34a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {budgetCategories.map(cat => (
          <BudgetCard key={cat.name} cat={cat} />
        ))}
      </div>
    </div>
  )
}
