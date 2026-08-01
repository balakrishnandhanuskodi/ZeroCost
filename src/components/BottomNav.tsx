import { LayoutDashboard, ArrowLeftRight, CreditCard, Bot, User } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'transactions', label: 'Txns', icon: ArrowLeftRight },
  { id: 'loans', label: 'Loans', icon: CreditCard },
  { id: 'ai-coach', label: 'AI', icon: Bot },
  { id: 'settings', label: 'Profile', icon: User },
]

interface BottomNavProps {
  active: string
  onNavigate: (id: string) => void
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] z-40 px-2 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-3 transition-all ${
                isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[var(--primary)] mt-0.5" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
