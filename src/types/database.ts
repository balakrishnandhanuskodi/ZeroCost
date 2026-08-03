export type Transaction = {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category: string
  description: string
  date: string
  created_at: string
  updated_at: string
}

export type Budget = {
  id: string
  user_id: string
  category: string
  limit_amount: number
  spent_amount: number
  month: string
  created_at: string
  updated_at: string
}

export type Loan = {
  id: string
  user_id: string
  name: string
  principal_amount: number
  interest_rate: number
  monthly_payment: number
  remaining_amount: number
  start_date: string
  end_date: string
  status: 'active' | 'paid_off'
  created_at: string
  updated_at: string
}

export type Goal = {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string
  category: string
  status: 'active' | 'completed'
  created_at: string
  updated_at: string
}

export type Savings = {
  id: string
  user_id: string
  account_name: string
  balance: number
  interest_rate: number
  account_type: 'savings' | 'fixed' | 'recurring'
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
      }
      budgets: {
        Row: Budget
        Insert: Omit<Budget, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>
      }
      loans: {
        Row: Loan
        Insert: Omit<Loan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Loan, 'id' | 'created_at' | 'updated_at'>>
      }
      goals: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Goal, 'id' | 'created_at' | 'updated_at'>>
      }
      savings: {
        Row: Savings
        Insert: Omit<Savings, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Savings, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
