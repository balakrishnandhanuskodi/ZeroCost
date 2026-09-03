import type { UserPreferences } from './auth'

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  preferences: UserPreferences
  created_at: string
  updated_at: string
}

export interface Loan {
  id: string
  user_id: string
  lender_name: string
  principal: number
  current_balance: number
  interest_rate: number
  interest_type: 'fixed' | 'variable'
  tenure: number
  tenure_unit: 'months' | 'years'
  start_date: string
  end_date?: string
  monthly_payment_date?: number
  emi_amount?: number
  status: 'active' | 'closed' | 'defaulted'
  notes?: string
  created_at: string
  updated_at: string
}

export interface LoanPayment {
  id: string
  loan_id: string
  date: string
  principal: number
  interest: number
  total_amount: number
  type: 'scheduled' | 'prepayment'
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: string
  payment_method: 'cash' | 'card' | 'online' | 'check'
  tags: string[]
  created_at: string
}

export interface CreditCard {
  id: string
  user_id: string
  card_issuer: string
  last_four_digits: string
  credit_limit: number
  current_balance: number
  apr: number
  billing_cycle_start: number
  billing_cycle_end: number
  due_date: number
  reward_type: 'cash-back' | 'points' | 'miles' | 'none'
  reward_rate: number
  is_active: boolean
  created_at: string
}
