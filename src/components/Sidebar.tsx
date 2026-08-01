import {
  LayoutDashboard, ArrowLeftRight, PieChart, CreditCard, Target,
  TrendingUp, BarChart2, Bot, Settings, Bell, ChevronLeft, ChevronRight,
  LogOut, Wallet
} from 'lucide-react'
import { notifications } from '../data/mockData'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budget', label: 'Budget', icon: PieChart },
  { id: 'loans', label: 'Loans', icon: CreditCard },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'savings', label: 'Savings', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'ai-coach', label: 'AI Coach', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  active: string
  onNavigate: (id: string) => void
  collapsed: boolean
  onToggle: () => void
  onNotifications: () => void
}

export default function Sidebar({ active, onNavigate, collapsed, onToggle, onNotifications }: SidebarProps) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <aside
      className="hidden md:flex flex-col h-screen bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 sticky top-0 z-30"
      style={{ width: collapsed ? '72px' : '240px', minWidth: collapsed ? '72px' : '240px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center flex-shrink-0">
          <Wallet size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-700 text-sm text-[var(--foreground)] leading-tight">FinPilot</div>
            <div className="text-[10px] text-[var(--muted-foreground)] font-medium tracking-wide">AI Finance</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && id === 'ai-coach' && (
                <span className="ml-auto text-[9px] font-semibold bg-gradient-to-r from-[#16a34a] to-[#4f46e5] text-white px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 pb-4 space-y-1 border-t border-[var(--border)] pt-3">
        <button
          onClick={onNotifications}
          className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-150"
          title={collapsed ? 'Notifications' : undefined}
        >
          <Bell size={18} className="flex-shrink-0" />
          {!collapsed && <span>Notifications</span>}
          {unread > 0 && (
            <span className={`${collapsed ? 'absolute top-1.5 right-1.5' : 'ml-auto'} bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
              {unread}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#16a34a] to-[#4f46e5] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            BK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--foreground)] truncate">Bala Kumar</div>
              <div className="text-[10px] text-[var(--muted-foreground)] truncate">bala@finpilot.ai</div>
            </div>
          )}
          {!collapsed && <LogOut size={14} className="text-[var(--muted-foreground)] flex-shrink-0" />}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
