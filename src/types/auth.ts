export type RiskProfile = 'conservative' | 'moderate' | 'aggressive'
export type Currency = 'USD' | 'EUR' | 'INR' | 'GBP'

export interface UserPreferences {
  currency: Currency
  language: string
  notifications: boolean
  darkMode: boolean
  riskProfile: RiskProfile
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (user: Partial<User>) => Promise<void>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  acceptTerms: boolean
}
