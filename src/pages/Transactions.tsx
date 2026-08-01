import { useState } from 'react'
import { Search, Filter, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { transactions, formatCurrency } from '../data/mockData'

const categoryColors: Record<string, string> = {
  'Food & Dining': '#f97316',
  'Income': '#16a34a',
  'Shopping': '#ec4899',
  'Fuel': '#0ea5e9',
  'Medical': '#22c55e',
  'Loans': '#4f46e5',
  'Entertainment': '#a855f7',
  'Home': '#8b5cf6',
  'Education': '#f59e0b',
}

const tagColors: Record<string, string> = {
  food: 'bg-orange-50 text-orange-600',
  salary: 'bg-emerald-50 text-emerald-600',
  shopping: 'bg-pink-50 text-pink-600',
  fuel: 'bg-sky-50 text-sky-600',
  health: 'bg-green-50 text-green-600',
  loan: 'bg-indigo-50 text-indigo-600',
  subscription: 'bg-purple-50 text-purple-600',
  utility: 'bg-violet-50 text-violet-600',
  learning: 'bg-amber-50 text-amber-600',
}

export default function Transactions() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = transactions.filter(t =>
    t.merchant.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Transactions</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">July 2026 · {transactions.length} entries</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-emerald-100 transition-all text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl text-sm text-[var(--muted-foreground)] hover:border-[var(--primary)] transition-all">
          <Filter size={15} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
              {['Date', 'Merchant', 'Category', 'Amount', 'Method', 'Tag', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const isIncome = t.amount > 0
              const catColor = categoryColors[t.category] || '#94a3b8'
              return (
                <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
                  <td className="px-5 py-4 text-[var(--muted-foreground)] font-mono text-xs">{t.date}</td>
                  <td className="px-5 py-4 font-medium text-[var(--foreground)]">{t.merchant}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className={`flex items-center gap-1 font-bold text-sm ${isIncome ? 'text-emerald-600' : 'text-[var(--foreground)]'}`}>
                      {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} className="text-red-400" />}
                      {isIncome ? '+' : ''}{formatCurrency(t.amount)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--muted-foreground)]">{t.method}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tagColors[t.tag] || 'bg-slate-50 text-slate-500'}`}>
                      {t.tag}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5" />
                    <span className="text-xs text-[var(--muted-foreground)] capitalize">{t.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map(t => {
          const isIncome = t.amount > 0
          const catColor = categoryColors[t.category] || '#94a3b8'
          return (
            <div key={t.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[var(--foreground)]">{t.merchant}</div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{t.date} · {t.method}</div>
                </div>
                <div className={`font-bold text-sm ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(Math.abs(t.amount), true)}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ backgroundColor: catColor + '18', color: catColor }}>
                  {t.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tagColors[t.tag] || 'bg-slate-50 text-slate-500'}`}>
                  {t.tag}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Add Button — mobile */}
      <button
        onClick={() => setShowAdd(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-[var(--primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

      {/* Add Transaction Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-[var(--card)] rounded-t-3xl md:rounded-2xl w-full md:w-[460px] p-6 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-700 text-lg text-[var(--foreground)] mb-5">Add Transaction</h3>
            <div className="space-y-3">
              {['Merchant / Description', 'Amount (₹)', 'Category', 'Date'].map(field => (
                <div key={field}>
                  <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">{field}</label>
                  <input className="w-full px-4 py-2.5 bg-[var(--muted)] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-emerald-200 transition-all border border-transparent focus:border-[var(--primary)]" placeholder={field} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-all">Cancel</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-emerald-700 transition-all">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
