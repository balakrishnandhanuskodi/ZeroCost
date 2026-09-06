import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 pb-20 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-700 text-2xl md:text-3xl text-[var(--foreground)]">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          {user?.email}
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Loans */}
        <div className="bg-[var(--primary-soft)] border border-[var(--primary)] rounded-2xl p-6">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Total Loans</div>
          <div className="font-display font-700 text-2xl text-[var(--primary)]">₹0</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">Ready to add your first loan</p>
        </div>

        {/* Total Savings */}
        <div className="bg-[var(--success-soft)] border border-[var(--success)] rounded-2xl p-6">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Total Savings</div>
          <div className="font-display font-700 text-2xl text-[var(--success)]">₹0</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">Start saving today</p>
        </div>

        {/* Monthly Budget */}
        <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-2xl p-6">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Monthly Budget</div>
          <div className="font-display font-700 text-2xl text-[var(--warning)]">₹0</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">Set your budget</p>
        </div>

        {/* Net Worth */}
        <div className="bg-[var(--info-soft)] border border-[var(--info)] rounded-2xl p-6">
          <div className="text-[var(--muted-foreground)] text-sm font-medium mb-1">Net Worth</div>
          <div className="font-display font-700 text-2xl text-[var(--info)]">₹0</div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">Calculated from all assets</p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <h2 className="font-display font-700 text-lg text-[var(--foreground)] mb-2">Account Overview</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Your dashboard is ready. More features coming soon as we build each module step by step.
        </p>
      </div>
    </div>
  )
}
