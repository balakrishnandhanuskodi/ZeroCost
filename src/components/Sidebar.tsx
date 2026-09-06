import {
  LayoutDashboard, Bell, ChevronLeft, ChevronRight,
  LogOut, Wallet
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

interface SidebarProps {
  active: string
  onNavigate: (id: string) => void
  collapsed: boolean
  onToggle: () => void
  onNotifications: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-blue-500',
  ]
  const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1)
  return colors[hash % colors.length]
}

export default function Sidebar({ active, onNavigate, collapsed, onToggle, onNotifications }: SidebarProps) {
  const { user } = useAuth()

  return (
    <aside
      className="hidden md:flex flex-col h-screen bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 sticky top-0 z-30"
      style={{ width: collapsed ? '72px' : '240px', minWidth: collapsed ? '72px' : '240px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Wallet size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-display font-700 text-sm text-[var(--foreground)] leading-tight">ZeroCost</div>
            <div className="text-[10px] text-[var(--muted-foreground)] font-medium tracking-wide">Financial Hub</div>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
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
        </button>

        {/* User Profile - Real Data */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {getInitials(user.name)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[var(--foreground)] truncate">{user.name}</div>
                <div className="text-[10px] text-[var(--muted-foreground)] truncate">{user.email}</div>
              </div>
            )}
          </div>
        )}

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
