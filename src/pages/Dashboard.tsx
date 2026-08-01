import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, BarChart3,
  Sparkles, ArrowUpRight, ArrowDownRight, ChevronRight, Bell
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  user, summaryCards, budgetCategories, spendingTrend,
  categoryPie, healthBreakdown, formatCurrency
} from '../data/mockData'

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, BarChart3
}

function SummaryCard({ card, index }: { card: typeof summaryCards[0]; index: number }) {
  const [displayed, setDisplayed] = useState(0)
  const Icon = iconMap[card.icon] || Wallet

  useEffect(() => {
    let start = 0
    const end = card.value
    const duration = 800
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplayed(end); clearInterval(timer) }
      else setDisplayed(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [card.value])

  const trendUp = card.trend === 'up'
  const trendDown = card.trend === 'down'

  return (
    <div
      className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: card.color + '18' }}
        >
          <Icon size={18} style={{ color: card.color }} />
        </div>
        {card.change !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            trendUp ? 'bg-emerald-50 text-emerald-600' : trendDown ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'
          }`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(card.change)}%
          </div>
        )}
      </div>
      <div className="font-display font-700 text-xl text-[var(--foreground)] mb-0.5">
        {formatCurrency(displayed, true)}
      </div>
      <div className="text-xs text-[var(--muted-foreground)] font-medium">{card.label}</div>
    </div>
  )
}

function HealthGauge({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300)
    return () => clearTimeout(t)
  }, [score])

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (animated / 100) * circumference * 0.75
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-600 text-[var(--foreground)]">Financial Health</h3>
        <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-lg">August 2026</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeLinecap="round" />
            <circle
              cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-700 text-2xl" style={{ color }}>{score}</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-medium">/100</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {healthBreakdown.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--muted-foreground)]">{item.label}</span>
                <span className="font-semibold text-[var(--foreground)]">{item.score}%</span>
              </div>
              <div className="h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.score}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AIInsightCard() {
  return (
    <div className="rounded-2xl p-5 border border-[var(--border)] animate-fade-in"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">AI Insight</span>
            <span className="text-xs text-[var(--muted-foreground)]">High confidence</span>
          </div>
          <p className="text-sm text-[var(--foreground)] leading-relaxed font-medium">
            If you pay an additional <strong>₹30,000</strong> towards your Personal Loan this month, you'll save approximately <strong>₹78,000</strong> in future interest and become debt-free <strong>8 months earlier.</strong>
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="text-center">
              <div className="text-sm font-bold text-emerald-600">₹78,000</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">Interest Saved</div>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div className="text-center">
              <div className="text-sm font-bold text-indigo-600">8 months</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">Earlier Closure</div>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div className="text-center">
              <div className="text-sm font-bold text-sky-600">92%</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">Confidence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BudgetOverview() {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-600 text-[var(--foreground)]">Budget Overview</h3>
        <button className="text-xs text-[var(--primary)] font-medium flex items-center gap-1 hover:gap-2 transition-all">
          View All <ChevronRight size={13} />
        </button>
      </div>
      <div className="space-y-3">
        {budgetCategories.slice(0, 6).map(cat => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100)
          const over = cat.spent > cat.budget
          const warn = pct >= 80
          const barColor = over ? '#ef4444' : warn ? '#f97316' : '#16a34a'

          return (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span className="font-medium text-[var(--foreground)] text-xs">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={over ? 'text-red-500 font-semibold' : 'text-[var(--muted-foreground)]'}>
                    {formatCurrency(cat.spent, true)}
                  </span>
                  <span className="text-[var(--muted-foreground)]">/</span>
                  <span className="text-[var(--foreground)] font-medium">{formatCurrency(cat.budget, true)}</span>
                </div>
              </div>
              <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          )
        })}
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
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[var(--muted-foreground)]">{p.name}:</span>
          <span className="font-semibold text-[var(--foreground)]">{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">
            Good Morning, {user.name} 👋
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Here's your financial snapshot for August 2026
          </p>
        </div>
        <button
          onClick={() => onNavigate('notifications')}
          className="relative w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] transition-all"
        >
          <Bell size={18} className="text-[var(--muted-foreground)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      {/* AI Insight */}
      <AIInsightCard />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {summaryCards.map((card, i) => (
          <SummaryCard key={card.label} card={card} index={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Trend */}
        <div className="lg:col-span-2 bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-600 text-[var(--foreground)]">Income vs Expenses</h3>
            <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-lg">6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendingTrend}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)]">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                {categoryPie.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value, true)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {categoryPie.slice(0, 6).map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[var(--muted-foreground)] truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health + Budget row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthGauge score={user.healthScore} />
        <BudgetOverview />
      </div>

      {/* Monthly Summary Bar */}
      <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)]">
        <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Monthly Summary — August 2026</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Income', value: 118540, color: '#16a34a' },
            { label: 'Spent', value: 79254, color: '#f97316' },
            { label: 'Loans Paid', value: 46421, color: '#4f46e5' },
            { label: 'Savings', value: 620, color: '#0ea5e9' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="font-display font-700 text-lg" style={{ color: item.color }}>
                {formatCurrency(item.value, true)}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-700" style={{ width: '40%' }} />
          <div className="h-full bg-orange-400 transition-all duration-700" style={{ width: '27%' }} />
          <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: '16%' }} />
          <div className="h-full bg-sky-400 rounded-r-full transition-all duration-700" style={{ width: '0.5%' }} />
        </div>
        <div className="flex items-center gap-4 mt-2">
          {[
            { label: 'Income', color: 'bg-emerald-500' },
            { label: 'Expenses', color: 'bg-orange-400' },
            { label: 'EMI', color: 'bg-indigo-500' },
            { label: 'Savings', color: 'bg-sky-400' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <div className={`w-2 h-2 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
