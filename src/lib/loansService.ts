import { supabase, isSupabaseConfigured } from './supabase'

export type LoanType = 'Home' | 'Personal' | 'Auto' | 'Education' | 'Other'
export type LoanStatus = 'active' | 'closed' | 'defaulted'
export type InterestType = 'fixed' | 'variable'
export type TenureUnit = 'months' | 'years'

export interface LoanRecord {
  id: string
  user_id: string
  lender_name: string
  loan_type?: LoanType
  principal: number
  current_balance: number
  interest_rate: number
  interest_type: InterestType
  tenure: number
  tenure_unit: TenureUnit
  start_date: string
  end_date: string | null
  monthly_payment_date: number | null
  emi_amount: number | null
  status: LoanStatus
  health_score?: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface LoanFormInput {
  lender_name: string
  loan_type?: LoanType
  principal: string
  current_balance: string
  interest_rate: string
  interest_type: InterestType
  tenure: string
  tenure_unit: TenureUnit
  start_date: string
  end_date?: string
  monthly_payment_date?: string
  status: LoanStatus
  notes?: string
}

// Convert form data to database format
function formatLoanData(data: LoanFormInput) {
  const tenureMonths = data.tenure_unit === 'years' ? parseInt(data.tenure) * 12 : parseInt(data.tenure)
  const emiAmount = calculateEMI(parseFloat(data.principal), parseFloat(data.interest_rate), tenureMonths)

  return {
    lender_name: data.lender_name,
    loan_type: data.loan_type || 'Other',
    principal: parseFloat(data.principal),
    current_balance: parseFloat(data.current_balance),
    interest_rate: parseFloat(data.interest_rate),
    interest_type: data.interest_type,
    tenure: parseInt(data.tenure),
    tenure_unit: data.tenure_unit,
    start_date: data.start_date,
    end_date: data.end_date || null,
    monthly_payment_date: data.monthly_payment_date ? parseInt(data.monthly_payment_date) : null,
    emi_amount: emiAmount,
    status: data.status,
    health_score: 75,
    notes: data.notes || null,
  }
}

// Calculate EMI (Equated Monthly Installment)
export function calculateEMI(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
}

// Calculate remaining tenure in months
export function getRemainingMonths(startDate: string, tenureMonths: number): number {
  const start = new Date(startDate)
  const now = new Date()
  const monthsPassed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(0, tenureMonths - monthsPassed)
}

// Get all loans for the current user
export async function getLoansByUser(userId: string): Promise<LoanRecord[]> {
  if (!isSupabaseConfigured || !supabase) {
    // Fallback to localStorage
    const stored = localStorage.getItem(`loans_${userId}`)
    return stored ? JSON.parse(stored) : []
  }

  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching loans:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to fetch loans:', err)
    return []
  }
}

// Create a new loan
export async function createLoan(userId: string, data: LoanFormInput): Promise<LoanRecord | null> {
  const formattedData = formatLoanData(data)

  if (!isSupabaseConfigured || !supabase) {
    // Fallback to localStorage
    const id = crypto.randomUUID()
    const loan: LoanRecord = {
      id,
      user_id: userId,
      ...formattedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const loans = await getLoansByUser(userId)
    loans.push(loan)
    localStorage.setItem(`loans_${userId}`, JSON.stringify(loans))
    return loan
  }

  try {
    const { data: newLoan, error } = await supabase
      .from('loans')
      .insert([
        {
          user_id: userId,
          ...formattedData,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating loan:', error)
      throw new Error(error.message)
    }

    return newLoan
  } catch (err) {
    console.error('Failed to create loan:', err)
    throw err
  }
}

// Update a loan
export async function updateLoan(loanId: string, data: LoanFormInput): Promise<LoanRecord | null> {
  const formattedData = formatLoanData(data)

  if (!isSupabaseConfigured || !supabase) {
    // Fallback to localStorage
    const loans = JSON.parse(localStorage.getItem('all_loans') || '[]') as LoanRecord[]
    const index = loans.findIndex(l => l.id === loanId)
    if (index !== -1) {
      loans[index] = {
        ...loans[index],
        ...formattedData,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('all_loans', JSON.stringify(loans))
      return loans[index]
    }
    return null
  }

  try {
    const { data: updatedLoan, error } = await supabase
      .from('loans')
      .update(formattedData)
      .eq('id', loanId)
      .select()
      .single()

    if (error) {
      console.error('Error updating loan:', error)
      throw new Error(error.message)
    }

    return updatedLoan
  } catch (err) {
    console.error('Failed to update loan:', err)
    throw err
  }
}

// Delete a loan
export async function deleteLoan(loanId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    // Fallback to localStorage
    const loans = JSON.parse(localStorage.getItem('all_loans') || '[]') as LoanRecord[]
    const filtered = loans.filter(l => l.id !== loanId)
    localStorage.setItem('all_loans', JSON.stringify(filtered))
    return true
  }

  try {
    const { error } = await supabase.from('loans').delete().eq('id', loanId)

    if (error) {
      console.error('Error deleting loan:', error)
      throw new Error(error.message)
    }

    return true
  } catch (err) {
    console.error('Failed to delete loan:', err)
    throw err
  }
}
