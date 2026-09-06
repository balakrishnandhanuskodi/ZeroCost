import { supabase, isSupabaseConfigured } from './supabase'

export interface LoanRecord {
  id: string
  userId: string
  bankName: string
  loanAmount: number
  interestRate: number
  loanTerm: number
  loanType: string
  startDate: string
  createdAt: string
  updatedAt: string
}

export interface LoanFormInput {
  bankName: string
  loanAmount: string
  interestRate: string
  loanTerm: string
  loanType: string
  startDate: string
}

// Convert form data to database format
function formatLoanData(data: LoanFormInput): Omit<LoanRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  return {
    bankName: data.bankName,
    loanAmount: parseFloat(data.loanAmount),
    interestRate: parseFloat(data.interestRate),
    loanTerm: parseInt(data.loanTerm),
    loanType: data.loanType,
    startDate: data.startDate,
  }
}

// Calculate EMI
export function calculateEMI(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 100 / 12
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
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
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

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
      userId,
      ...formattedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
          userId,
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
        updatedAt: new Date().toISOString(),
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
