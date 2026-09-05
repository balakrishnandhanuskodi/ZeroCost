import { createContext, useContext, useState, useEffect } from 'react'
import type { User, UserPreferences, AuthContextType } from '../types/auth'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'INR',
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
        if (isSupabaseConfigured && supabase) {
          // Check Supabase session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()

          if (sessionError) {
            console.error('Session error:', sessionError)
          }

          if (session?.user) {
            // Get user profile from Supabase
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Profile error:', profileError)
            }

            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.user_metadata?.name || 'User',
              phone: profile?.phone || '',
              avatar: profile?.avatar || '',
              createdAt: new Date(session.user.created_at || Date.now()),
              preferences: profile?.preferences || DEFAULT_PREFERENCES
            }

            setUser(userData)
          }

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.name || session.user.user_metadata?.name || 'User',
                phone: profile?.phone || '',
                avatar: profile?.avatar || '',
                createdAt: new Date(session.user.created_at || Date.now()),
                preferences: profile?.preferences || DEFAULT_PREFERENCES
              }
              setUser(userData)
            } else {
              setUser(null)
            }
          })

          return () => {
            subscription?.unsubscribe()
          }
        } else {
          // Fallback: localStorage
          const stored = localStorage.getItem('zerocost_user')
          if (stored) {
            const userData = JSON.parse(stored)
            setUser(userData)
          }
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
      if (isSupabaseConfigured && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.name || data.user.user_metadata?.name || 'User',
            phone: profile?.phone || '',
            avatar: profile?.avatar || '',
            createdAt: new Date(data.user.created_at || Date.now()),
            preferences: profile?.preferences || DEFAULT_PREFERENCES
          }

          setUser(userData)
          localStorage.setItem('zerocost_user', JSON.stringify(userData))
        }
      } else {
        // Fallback: localStorage
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
      }
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
      if (isSupabaseConfigured && supabase) {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              preferences: DEFAULT_PREFERENCES
            }
          }
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              id: data.user.id,
              name,
              email,
              preferences: DEFAULT_PREFERENCES
            }])

          if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
            console.error('Profile creation error:', profileError)
          }

          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            phone: '',
            avatar: '',
            createdAt: new Date(data.user.created_at || Date.now()),
            preferences: DEFAULT_PREFERENCES
          }

          setUser(userData)
          localStorage.setItem('zerocost_user', JSON.stringify(userData))
        }
      } else {
        // Fallback: localStorage
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
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut()
      }
    } catch (err) {
      console.error('Logout error:', err)
    }

    setUser(null)
    setError(null)
    localStorage.removeItem('zerocost_user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in')

    try {
      const updatedUser = { ...user, ...updates }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: updates.name,
            phone: updates.phone,
            avatar: updates.avatar,
          })
          .eq('id', user.id)

        if (error) throw error
      }

      setUser(updatedUser)
      localStorage.setItem('zerocost_user', JSON.stringify(updatedUser))
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

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ preferences: updatedPreferences })
          .eq('id', user.id)

        if (error) throw error
      }

      setUser(updatedUser)
      localStorage.setItem('zerocost_user', JSON.stringify(updatedUser))
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
