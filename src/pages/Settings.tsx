import { useState } from 'react'
import {
  Moon, Globe, Bell, Shield, Fingerprint, CloudUpload,
  ChevronRight, User, DollarSign, Users, Target, TrendingUp, LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function SettingRow({ icon: Icon, label, desc, right }: {
  icon: React.ElementType
  label: string
  desc?: string
  right: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center">
          <Icon size={16} className="text-[var(--muted-foreground)]" />
        </div>
        <div>
          <div className="text-sm font-medium text-[var(--foreground)]">{label}</div>
          {desc && <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{desc}</div>}
        </div>
      </div>
      {right}
    </div>
  )
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)
  const [cloudBackup, setCloudBackup] = useState(true)
  const { user, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out failed:', err)
    }
    setSigningOut(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#16a34a] to-[#4f46e5] rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold font-display">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-display font-700 text-xl">{user?.email?.split('@')[0]}</div>
            <div className="text-sm opacity-80">{user?.email}</div>
            <div className="text-xs opacity-60 mt-1">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
          </div>
          <button className="px-4 py-2 bg-white/20 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/20">
          <div className="text-center">
            <div className="font-display font-700 text-lg">₹1.18L</div>
            <div className="text-xs opacity-70">Monthly Income</div>
          </div>
          <div className="text-center">
            <div className="font-display font-700 text-lg">74/100</div>
            <div className="text-xs opacity-70">Health Score</div>
          </div>
          <div className="text-center">
            <div className="font-display font-700 text-lg">2</div>
            <div className="text-xs opacity-70">Active Loans</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Preferences */}
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-2">Preferences</h3>
          <SettingRow icon={Moon} label="Dark Mode" desc="Switch to dark theme" right={<Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} />
          <SettingRow icon={Globe} label="Currency" desc="Indian Rupee (₹)" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
          <SettingRow icon={Globe} label="Language" desc="English (India)" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
          <SettingRow icon={Bell} label="Notifications" desc="EMI reminders, budget alerts" right={<Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />} />
        </div>

        {/* Security */}
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-2">Security & Backup</h3>
          <SettingRow icon={Shield} label="Two-Factor Auth" desc="SMS or authenticator app" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
          <SettingRow icon={Fingerprint} label="Biometric Login" desc="Face ID / Fingerprint" right={<Toggle checked={biometric} onChange={() => setBiometric(!biometric)} />} />
          <SettingRow icon={CloudUpload} label="Cloud Backup" desc="Auto backup to cloud" right={<Toggle checked={cloudBackup} onChange={() => setCloudBackup(!cloudBackup)} />} />
          <SettingRow icon={Shield} label="Change Password" desc="Last changed 3 months ago" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-600 rounded-xl font-medium transition-colors"
          >
            <LogOut size={16} />
            {signingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>

        {/* Financial Profile */}
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm lg:col-span-2">
          <h3 className="font-display font-600 text-[var(--foreground)] mb-2">Financial Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <SettingRow icon={DollarSign} label="Monthly Income" desc="₹1,18,540" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
            <SettingRow icon={Users} label="Family Members" desc="4 members, 2 dependents" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
            <SettingRow icon={Target} label="Financial Goals" desc="5 active goals" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
            <SettingRow icon={TrendingUp} label="Risk Profile" desc="Moderate investor" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
            <SettingRow icon={TrendingUp} label="Investment Preference" desc="Mutual Funds, FD, Gold" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
            <SettingRow icon={Shield} label="Emergency Fund Target" desc="6 months of expenses" right={<ChevronRight size={16} className="text-[var(--muted-foreground)]" />} />
          </div>
        </div>
      </div>
    </div>
  )
}
