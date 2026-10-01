import { supabase } from './supabase'

export type ExpenseCategory =
  | 'Food' | 'Shopping' | 'Travel' | 'Petrol Expense' | 'Fuel'
  | 'Bills' | 'Sports' | 'Temple Pooja' | 'Travel Expense'
  | 'Transfer' | 'Moi' | 'Cycle' | 'Others'

export interface Expense {
  id: string
  user_id: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface ExpenseInput {
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  notes?: string
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food', 'Shopping', 'Travel', 'Petrol Expense', 'Fuel',
  'Bills', 'Sports', 'Temple Pooja', 'Travel Expense',
  'Transfer', 'Moi', 'Cycle', 'Others'
]

// Get expenses for a specific month
export async function getExpensesByMonth(userId: string, year: number, month: number): Promise<Expense[]> {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

// Get expenses for a date range
export async function getExpensesByDateRange(userId: string, startDate: string, endDate: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

// Add new expense
export async function addExpense(userId: string, expense: ExpenseInput): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: userId,
      ...expense
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Update expense
export async function updateExpense(expenseId: string, updates: Partial<ExpenseInput>): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', expenseId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete expense
export async function deleteExpense(expenseId: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)

  if (error) throw error
}

// Calculate monthly statistics
export async function getMonthlyStats(userId: string, year: number, month: number) {
  const expenses = await getExpensesByMonth(userId, year, month)

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const categoryBreakdown = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = { amount: 0, count: 0 }
    }
    acc[exp.category].amount += exp.amount
    acc[exp.category].count += 1
    return acc
  }, {} as Record<string, { amount: number; count: number }>)

  const topMerchants = expenses
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  const averageDaily = totalAmount / new Set(expenses.map(e => e.date)).size

  return {
    totalAmount,
    categoryBreakdown,
    topMerchants,
    averageDaily,
    transactionCount: expenses.length
  }
}

// Get daily total
export async function getDailyTotal(userId: string, date: string): Promise<number> {
  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw error

  return data?.reduce((sum, exp) => sum + exp.amount, 0) || 0
}
