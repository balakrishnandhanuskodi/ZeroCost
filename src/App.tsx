import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Loans from './pages/Loans'
import Goals from './pages/Goals'
import Savings from './pages/Savings'
import Reports from './pages/Reports'
import AICoach from './pages/AICoach'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Signup from './pages/Signup'

type Page = 'dashboard' | 'transactions' | 'budget' | 'loans' | 'goals' | 'savings' | 'reports' | 'ai-coach' | 'settings' | 'notifications'

function PageContent({ page, onNavigate }: { page: Page; onNavigate: (p: string) => void }) {
  switch (page) {
    case 'dashboard': return <Dashboard onNavigate={onNavigate} />
    case 'transactions': return <Transactions />
    case 'budget': return <Budget />
    case 'loans': return <Loans />
    case 'goals': return <Goals />
    case 'savings': return <Savings />
    case 'reports': return <Reports />
    case 'ai-coach': return <AICoach />
    case 'settings': return <Settings />
    case 'notifications': return <Notifications onBack={() => onNavigate('dashboard')} />
    default: return <Dashboard onNavigate={onNavigate} />
  }
}

function AppContent() {
  const [page, setPage] = useState<Page>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return authPage === 'login' ? (
      <Login onSignUpClick={() => setAuthPage('signup')} />
    ) : (
      <Signup onLoginClick={() => setAuthPage('login')} />
    )
  }

  const navigate = (p: string) => setPage(p as Page)
  const isAICoach = page === 'ai-coach'

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar
        active={page}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNotifications={() => navigate('notifications')}
      />

      <main className={`flex-1 overflow-y-auto ${isAICoach ? 'overflow-hidden' : ''}`}>
        <PageContent page={page} onNavigate={navigate} />
      </main>

      <BottomNav active={page} onNavigate={navigate} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
