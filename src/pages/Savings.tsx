import { savings, formatCurrency } from '../data/mockData'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const netWorthHistory = [
  { month: 'Jan', value: 2200000 },
  { month: 'Feb', value: 2310000 },
  { month: 'Mar', value: 2390000 },
  { month: 'Apr', value: 2480000 },
  { month: 'May', value: 2590000 },
  { month: 'Jun', value: 2720000 },
  { month: 'Jul', value: 2847500 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-lg text-xs">
      <div className="font-semibold mb-1 text-[var(--foreground)]">{label}</div>
      <span className="text-emerald-600 font-bold">{formatCurrency(payload[0].value, true)}</span>
    </div>
  )
}

export default function Savings() {
  const total = savings.reduce((s, i) => s + i.value, 0)

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Savings & Investments</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Portfolio overview</p>
      </div>

      {/* Net Worth */}
      <div className="bg-gradient-to-br from-[#16a34a] to-[#4f46e5] rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="text-sm font-medium opacity-80 mb-1">Total Net Worth</div>
        <div className="font-display font-700 text-3xl mb-1">{formatCurrency(total, true)}</div>
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span>↑ 2.8% from last month</span>
          <span>·</span>
          <span>+₹78,500</span>
        </div>
      </div>

      {/* Chart + Pie row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Net Worth Growth</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={netWorthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={savings} cx="50%" cy="50%" outerRadius={65} innerRadius={40} paddingAngle={2} dataKey="value">
                {savings.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(v, true)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {savings.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[var(--muted-foreground)] truncate">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {savings.map(item => {
          const pct = (item.value / total) * 100
          return (
            <div key={item.name} className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color + '18', color: item.color }}>
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div className="font-display font-700 text-lg text-[var(--foreground)]">{formatCurrency(item.value, true)}</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5 mb-3">{item.name}</div>
              <div className="h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
