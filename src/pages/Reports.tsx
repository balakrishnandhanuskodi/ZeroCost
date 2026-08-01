import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency, spendingTrend } from '../data/mockData'
import { Download, FileText } from 'lucide-react'

const quarterlyData = [
  { q: 'Q1 2026', income: 338000, expenses: 221000, savings: 117000 },
  { q: 'Q2 2026', income: 346000, expenses: 235000, savings: 111000 },
  { q: 'Q3 2026', income: 118540, expenses: 79254, savings: 620 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-lg text-xs">
      <div className="font-semibold mb-1 text-[var(--foreground)]">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-[var(--muted-foreground)]">{p.name}:</span>
          <span className="font-semibold">{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

const reportTypes = [
  { label: 'Monthly Report', desc: 'July 2026 — Income, Expenses, Savings breakdown', color: '#16a34a' },
  { label: 'Quarterly Report', desc: 'Q2 2026 — Comparative analysis', color: '#4f46e5' },
  { label: 'Loan Report', desc: 'All loans, EMIs, interest paid', color: '#f97316' },
  { label: 'Budget vs Actual', desc: 'Category-wise variance report', color: '#0ea5e9' },
  { label: 'Cash Flow', desc: 'Daily/weekly cash flow analysis', color: '#a855f7' },
  { label: 'Net Worth', desc: 'Assets, liabilities, net worth trend', color: '#f59e0b' },
]

export default function Reports() {
  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Reports</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Professional financial reports</p>
        </div>
        <div className="flex gap-2">
          {['PDF', 'Excel', 'CSV'].map(fmt => (
            <button key={fmt} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--card)] border border-[var(--border)] rounded-xl text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
              <Download size={12} />
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={spendingTrend} barCategoryGap="30%" barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#f97316" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Quarterly Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quarterlyData} barCategoryGap="30%" barGap={3}>
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#f97316" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="savings" fill="#16a34a" radius={[4, 4, 0, 0]} name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reportTypes.map(r => (
          <div key={r.label} className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: r.color + '18' }}>
                <FileText size={18} style={{ color: r.color }} />
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {['PDF', 'XLS'].map(f => (
                  <span key={f} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)]">{f}</span>
                ))}
              </div>
            </div>
            <div className="font-display font-600 text-sm text-[var(--foreground)] mb-1">{r.label}</div>
            <div className="text-xs text-[var(--muted-foreground)]">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
