import { notifications } from '../data/mockData'
import { Bell, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react'

const icons = {
  warning: AlertTriangle,
  danger: AlertTriangle,
  info: Info,
}

const colors = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
  danger: { bg: 'bg-red-50', border: 'border-red-100', icon: 'text-red-500', badge: 'bg-red-100 text-red-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
}

export default function Notifications({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center hover:bg-[var(--border)] transition-all">
          <X size={16} className="text-[var(--muted-foreground)]" />
        </button>
        <div>
          <h1 className="font-display font-700 text-xl text-[var(--foreground)]">Notifications</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{notifications.filter(n => !n.read).length} unread</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(n => {
          const style = colors[n.type as keyof typeof colors] || colors.info
          const Icon = icons[n.type as keyof typeof icons] || Bell
          return (
            <div key={n.id} className={`rounded-2xl p-5 border ${style.bg} ${style.border} ${!n.read ? 'shadow-sm' : 'opacity-70'}`}>
              <div className="flex items-start gap-3">
                <Icon size={18} className={`${style.icon} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-[var(--foreground)]">{n.title}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] flex-shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{n.body}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0 mt-1.5" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
