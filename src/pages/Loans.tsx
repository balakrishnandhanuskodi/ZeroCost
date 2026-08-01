import { useState } from 'react'
import { ChevronRight, Sparkles, TrendingDown, Calendar, DollarSign } from 'lucide-react'
import { loans, formatCurrency } from '../data/mockData'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid
} from 'recharts'

function ProgressCircle({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (pct / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={color} fontSize={13} fontWeight="700">
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

function LoanCard({ loan, onClick }: { loan: typeof loans[0]; onClick: () => void }) {
  const paid = loan.principal - loan.outstanding
  const pct = (paid / loan.principal) * 100

  return (
    <div
      className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: loan.bankColor }}>
              {loan.bank[0]}
            </div>
            <div>
              <div className="font-display font-600 text-sm text-[var(--foreground)]">{loan.name}</div>
              <div className="text-[10px] text-[var(--muted-foreground)]">{loan.type} Loan</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600">{loan.interestRate}% p.a.</span>
          <ChevronRight size={16} className="text-[var(--muted-foreground)]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ProgressCircle pct={pct} color={loan.bankColor} />
        <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[var(--muted-foreground)]">Outstanding</div>
            <div className="font-bold text-[var(--foreground)] text-sm">{formatCurrency(loan.outstanding, true)}</div>
          </div>
          <div>
            <div className="text-[var(--muted-foreground)]">EMI / Month</div>
            <div className="font-bold text-[var(--foreground)] text-sm">{formatCurrency(loan.emi, true)}</div>
          </div>
          <div>
            <div className="text-[var(--muted-foreground)]">Principal Paid</div>
            <div className="font-bold text-emerald-600 text-sm">{formatCurrency(loan.principalPaid, true)}</div>
          </div>
          <div>
            <div className="text-[var(--muted-foreground)]">Remaining</div>
            <div className="font-bold text-orange-500 text-sm">{loan.remainingMonths} months</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
          <Calendar size={11} />
          <span>Ends {loan.endDate.slice(0, 7)}</span>
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <DollarSign size={11} />
          <span>Interest paid: {formatCurrency(loan.interestPaid, true)}</span>
        </div>
      </div>
    </div>
  )
}

function LoanDetail({ loan, onClose }: { loan: typeof loans[0]; onClose: () => void }) {
  const paid = loan.principal - loan.outstanding
  const pct = (paid / loan.principal) * 100

  // Build simple amortization schedule (first 12 months)
  const amortData = Array.from({ length: 12 }, (_, i) => {
    const remaining = loan.outstanding - i * loan.emi * 0.6
    return {
      month: `M${i + 1}`,
      Principal: Math.round(loan.emi * 0.6),
      Interest: Math.round(loan.emi * 0.4),
    }
  })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[var(--background)] rounded-t-3xl md:rounded-2xl w-full md:w-[700px] max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-700 text-lg text-[var(--foreground)]">{loan.name}</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{loan.bank} · {loan.type} Loan</p>
          </div>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xl font-bold">×</button>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Principal', value: formatCurrency(loan.principal, true), color: '#4f46e5' },
            { label: 'Outstanding', value: formatCurrency(loan.outstanding, true), color: '#f97316' },
            { label: 'Interest Rate', value: `${loan.interestRate}%`, color: '#0ea5e9' },
            { label: 'EMI', value: formatCurrency(loan.emi, true), color: '#16a34a' },
          ].map(s => (
            <div key={s.label} className="bg-[var(--card)] rounded-xl p-3 border border-[var(--border)] text-center">
              <div className="font-display font-700 text-base" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-[var(--foreground)]">Repayment Progress</span>
            <span className="font-bold text-emerald-600">{Math.round(pct)}% complete</span>
          </div>
          <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: loan.bankColor, transition: 'width 1s ease' }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5 text-[var(--muted-foreground)]">
            <span>Paid: {formatCurrency(paid, true)}</span>
            <span>Remaining: {formatCurrency(loan.outstanding, true)}</span>
          </div>
        </div>

        {/* Amortization chart */}
        <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] mb-4">
          <h3 className="font-semibold text-sm text-[var(--foreground)] mb-3">Principal vs Interest</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={amortData} barCategoryGap="25%">
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: any) => formatCurrency(v, true)} />
              <Bar dataKey="Principal" fill="#16a34a" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="Interest" fill="#f97316" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Advisor */}
        <div className="rounded-2xl p-5 border border-[var(--border)]" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1.5">AI Loan Advisor</div>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                Pay ₹50,000 extra towards this loan. You will save <strong>₹1,42,500</strong> in interest and close the loan <strong>18 months earlier.</strong>
              </p>
              <div className="flex gap-3 mt-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-emerald-600">₹1.42L</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Saved</div>
                </div>
                <div className="w-px h-8 bg-[var(--border)]" />
                <div className="text-center">
                  <div className="text-sm font-bold text-indigo-600">18 mo</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Earlier</div>
                </div>
                <div className="w-px h-8 bg-[var(--border)]" />
                <div className="text-center">
                  <div className="text-sm font-bold text-sky-600">94%</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Loans() {
  const [selected, setSelected] = useState<typeof loans[0] | null>(null)
  const totalEmi = loans.reduce((s, l) => s + l.emi, 0)
  const totalOutstanding = loans.reduce((s, l) => s + l.outstanding, 0)

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Loan Management</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{loans.length} active loans</p>
        </div>
        <div className="text-right">
          <div className="font-display font-700 text-lg text-[var(--foreground)]">{formatCurrency(totalOutstanding, true)}</div>
          <div className="text-xs text-[var(--muted-foreground)]">Total Outstanding</div>
        </div>
      </div>

      {/* Summary banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <div className="font-display font-700 text-xl text-indigo-600">{formatCurrency(totalEmi, true)}</div>
          <div className="text-xs text-indigo-500 mt-0.5">Monthly EMI</div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
          <div className="font-display font-700 text-xl text-orange-500">{formatCurrency(totalOutstanding, true)}</div>
          <div className="text-xs text-orange-400 mt-0.5">Outstanding Balance</div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="font-display font-700 text-xl text-emerald-600">
            {formatCurrency(loans.reduce((s, l) => s + l.principalPaid, 0), true)}
          </div>
          <div className="text-xs text-emerald-500 mt-0.5">Principal Paid</div>
        </div>
      </div>

      {/* Loan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loans.map(loan => (
          <LoanCard key={loan.id} loan={loan} onClick={() => setSelected(loan)} />
        ))}
      </div>

      {selected && <LoanDetail loan={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
