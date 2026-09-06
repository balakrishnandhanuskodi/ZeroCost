import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const getActiveNav = () => {
    const path = location.pathname.replace('/', '')
    return path || 'dashboard'
  }

  const handleNavigate = (id: string) => {
    navigate(`/${id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNotifications = () => {
    navigate('/notifications')
  }

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar - Desktop */}
      <Sidebar
        active={getActiveNav()}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onNotifications={handleNotifications}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Desktop */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 bg-[var(--card)] border-b border-[var(--border)]">
          <div>
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              {getActiveNav().charAt(0).toUpperCase() + getActiveNav().slice(1).replace('-', ' ')}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Nav - Mobile */}
        <BottomNav
          active={getActiveNav()}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  )
}
