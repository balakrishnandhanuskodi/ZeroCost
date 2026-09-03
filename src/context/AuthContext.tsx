import { createContext, useContext, useState, useEffect } from 'react'
import type { User, UserPreferences, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  language: 'en',
  notifications: true,
  darkMode: false,
  riskProfile: 'moderate'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem('zerocost_user')
        if (stored) {
          const userData = JSON.parse(stored)
          setUser(userData)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const allUsers = JSON.parse(localStorage.getItem('zerocost_users') || '{}')
      const userKey = email.toLowerCase()

      if (!allUsers[userKey]) {
        throw new Error('User not found')
      }

      const storedUser = allUsers[userKey]
      if (storedUser.password !== password) {
        throw new Error('Invalid password')
      }

      const userData: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        phone: storedUser.phone,
        avatar: storedUser.avatar,
        createdAt: new Date(storedUser.createdAt),
        preferences: storedUser.preferences || DEFAULT_PREFERENCES
      }

      setUser(userData)
      localStorage.setItem('zerocost_user', JSON.stringify(userData))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const allUsers = JSON.parse(localStorage.getItem('zerocost_users') || '{}')
      const userKey = email.toLowerCase()

      if (allUsers[userKey]) {
        throw new Error('Email already registered')
      }

      const userId = crypto.randomUUID()
      const newUser: User = {
        id: userId,
        email,
        name,
        phone: '',
        avatar: '',
        createdAt: new Date(),
        preferences: DEFAULT_PREFERENCES
      }

      allUsers[userKey] = {
        id: userId,
        email,
        password,
        name,
        phone: '',
        avatar: '',
        createdAt: new Date().toISOString(),
        preferences: DEFAULT_PREFERENCES
      }

      localStorage.setItem('zerocost_users', JSON.stringify(allUsers))
      localStorage.setItem('zerocost_user', JSON.stringify(newUser))
      setUser(newUser)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('zerocost_user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('zerocost_user', JSON.stringify(updatedUser))

      const allUsers = JSON.parse(localStorage.getItem('zerocost_users') || '{}')
      const userKey = user.email.toLowerCase()
      if (allUsers[userKey]) {
        allUsers[userKey] = { ...allUsers[userKey], ...updates }
        localStorage.setItem('zerocost_users', JSON.stringify(allUsers))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
      throw new Error(message)
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) throw new Error('No user logged in')

    try {
      const updatedPreferences = { ...user.preferences, ...preferences }
      const updatedUser = { ...user, preferences: updatedPreferences }

      setUser(updatedUser)
      localStorage.setItem('zerocost_user', JSON.stringify(updatedUser))

      const allUsers = JSON.parse(localStorage.getItem('zerocost_users') || '{}')
      const userKey = user.email.toLowerCase()
      if (allUsers[userKey]) {
        allUsers[userKey].preferences = updatedPreferences
        localStorage.setItem('zerocost_users', JSON.stringify(allUsers))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Preference update failed'
      setError(message)
      throw new Error(message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, updateProfile, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
