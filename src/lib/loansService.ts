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
  first_emi_date: string
  first_emi_amount: number
  first_payment_interest: number | null
  first_payment_principal: number | null
  emis_paid_count: number
  last_payment_date: string | null
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
  emi_amount: string
  first_emi_date: string
  first_emi_amount: string
  first_payment_interest?: string
  emis_paid_count?: string
  last_payment_date?: string
  status: LoanStatus
  notes?: string
}

// Analyze first EMI amount to detect stub period
export interface FirstEMIAnalysis {
  standardEMI: number
  firstEMIAmount: number
  stubInterest: number
  hasStubPeriod: boolean
  note: string
}

export function analyzeFirstEMI(principal: number, rate: number, tenure: number, tenureUnit: TenureUnit, firstEMIAmount: number): FirstEMIAnalysis {
  const tenureMonths = tenureUnit === 'years' ? tenure * 12 : tenure
  const standardEMI = calculateEMI(principal, rate, tenureMonths)
  const stubInterest = Math.round((firstEMIAmount - standardEMI) * 100) / 100

  const hasStubPeriod = Math.abs(stubInterest) > 1 // Allow 1 rupee difference for rounding

  let note = ''
  if (hasStubPeriod && stubInterest > 0) {
    note = `First payment includes ₹${Math.round(stubInterest)} pre-EMI interest (stub period). Remaining ${tenureMonths - 1} payments: ₹${Math.round(standardEMI)} each.`
  } else {
    note = `All ${tenureMonths} payments: ₹${Math.round(standardEMI)} each.`
  }

  return {
    standardEMI: Math.round(standardEMI),
    firstEMIAmount: Math.round(firstEMIAmount),
    stubInterest: Math.round(stubInterest),
    hasStubPeriod,
    note
  }
}

// Convert form data to database format
function formatLoanData(data: LoanFormInput) {
  const firstPaymentInterest = data.first_payment_interest ? parseFloat(data.first_payment_interest) : 0
  const firstEMIAmount = parseFloat(data.first_emi_amount)
  const firstPaymentPrincipal = firstPaymentInterest > 0 ? firstEMIAmount - firstPaymentInterest : 0

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
    emi_amount: parseFloat(data.emi_amount),
    first_emi_date: data.first_emi_date,
    first_emi_amount: firstEMIAmount,
    first_payment_interest: firstPaymentInterest || null,
    first_payment_principal: firstPaymentPrincipal || null,
    emis_paid_count: data.emis_paid_count ? parseInt(data.emis_paid_count) : 0,
    last_payment_date: data.last_payment_date || null,
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

// Calculate Month 1 amortization (actual principal and interest for first month)
export function calculateMonth1Amortization(principal: number, annualRate: number, emi: number): { principal: number; interest: number } {
  const monthlyRate = annualRate / 100 / 12
  const interestMonth1 = principal * monthlyRate
  const principalMonth1 = emi - interestMonth1

  return {
    principal: Math.max(0, principalMonth1),
    interest: Math.max(0, interestMonth1)
  }
}

// Generate complete payment schedule
export interface PaymentScheduleItem {
  payment_number: number
  payment_month: string
  due_date: string
  principal_amount: number
  interest_amount: number
  emi_amount: number
  total_payment: number
  balance_after_payment: number
  status: 'pending' | 'paid'
  payment_date?: string
}

export function generatePaymentSchedule(
  loanId: string,
  principal: number,
  rate: number,
  tenureMonths: number,
  firstEMIDate: string,
  emiAmount: number,
  firstEMIAmount: number,
  emirsPaidCount: number = 0,
  firstPaymentInterest: number = 0
): PaymentScheduleItem[] {
  const monthlyRate = rate / 100 / 12
  const schedule: PaymentScheduleItem[] = []

  let balance = principal
  const firstDate = new Date(firstEMIDate)

  for (let i = 1; i <= tenureMonths; i++) {
    // Calculate due date (first EMI date + (i-1) months)
    const dueDate = new Date(firstDate)
    dueDate.setMonth(dueDate.getMonth() + (i - 1))

    let interestAmount = Math.round(balance * monthlyRate * 100) / 100
    let principalAmount: number
    let totalPayment: number
    const standardEMI = Math.round(emiAmount * 100) / 100

    if (i === 1) {
      // First payment - use official interest if provided, otherwise calculate
      if (firstPaymentInterest > 0) {
        interestAmount = Math.round(firstPaymentInterest * 100) / 100
        principalAmount = firstEMIAmount - interestAmount
      } else {
        totalPayment = firstEMIAmount
        principalAmount = totalPayment - interestAmount
      }
      totalPayment = firstEMIAmount
    } else {
      // Subsequent payments - use standard EMI entered by user
      totalPayment = standardEMI
      principalAmount = totalPayment - interestAmount
    }

    balance = Math.max(0, balance - principalAmount)

    const paymentMonth = new Date(firstDate)
    paymentMonth.setMonth(paymentMonth.getMonth() + (i - 1))

    schedule.push({
      payment_number: i,
      payment_month: paymentMonth.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      principal_amount: Math.round(principalAmount * 100) / 100,
      interest_amount: Math.round(interestAmount * 100) / 100,
      emi_amount: standardEMI,
      total_payment: Math.round(totalPayment * 100) / 100,
      balance_after_payment: Math.round(balance * 100) / 100,
      status: i <= emirsPaidCount ? 'paid' : 'pending'
    })
  }

  return schedule
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

// Create payment schedule records in loan_payments table
export async function createLoanPaymentSchedule(userId: string, loanId: string, schedule: PaymentScheduleItem[]): Promise<boolean> {
  console.log('createLoanPaymentSchedule called:', { isSupabaseConfigured, hasSupabase: !!supabase, scheduleLength: schedule.length })

  if (!isSupabaseConfigured || !supabase) {
    console.warn('⚠️ Supabase not configured, skipping payment record creation', { isSupabaseConfigured, supabase })
    return true // Skip for localStorage fallback
  }

  try {
    console.log(`Preparing ${schedule.length} payment records for loan ${loanId}`)
    console.log('User ID:', userId)

    const paymentRecords = schedule.map(item => ({
      user_id: userId,
      loan_id: loanId,
      payment_number: item.payment_number,
      payment_month: item.payment_month,
      due_date: item.due_date,
      principal_amount: item.principal_amount,
      interest_amount: item.interest_amount,
      emi_amount: item.emi_amount,
      total_payment: item.total_payment,
      balance_after_payment: item.balance_after_payment,
      status: item.status,
      payment_date: item.payment_date ? item.payment_date : null,
      skip_penalty: 0,
    }))

    console.log('First record to insert:', paymentRecords[0])

    const { error, data } = await supabase
      .from('loan_payments')
      .insert(paymentRecords)
      .select()

    if (error) {
      console.error('Supabase error creating payment records:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return false
    }

    console.log(`Successfully created ${data?.length || 0} payment records for loan ${loanId}`)
    return true
  } catch (err) {
    console.error('Exception creating payment records:', err)
    return false
  }
}

// Get payment history for a loan
export async function getLoanPaymentHistory(loanId: string): Promise<{ count: number; totalAmount: number }> {
  if (!isSupabaseConfigured || !supabase) {
    return { count: 0, totalAmount: 0 }
  }

  try {
    const { data, error } = await supabase
      .from('loan_payments')
      .select('total_payment')
      .eq('loan_id', loanId)
      .eq('status', 'paid')
      .order('payment_number', { ascending: true })

    if (error) {
      console.error('Error fetching payment history:', error)
      return { count: 0, totalAmount: 0 }
    }

    const payments = data || []
    const totalAmount = payments.reduce((sum, p) => sum + (p.total_payment || 0), 0)

    return { count: payments.length, totalAmount }
  } catch (err) {
    console.error('Failed to fetch payment history:', err)
    return { count: 0, totalAmount: 0 }
  }
}

// Get principal and interest breakdown for paid EMIs
export async function getPaidEMIBreakdown(loanId: string, loanRecord?: LoanRecord): Promise<{ principalPaid: number; interestPaid: number; totalPaid: number }> {
  if (!isSupabaseConfigured || !supabase) {
    return { principalPaid: 0, interestPaid: 0, totalPaid: 0 }
  }

  try {
    const { data, error } = await supabase
      .from('loan_payments')
      .select('payment_number, principal_amount, interest_amount, total_payment')
      .eq('loan_id', loanId)
      .eq('status', 'paid')
      .order('payment_number', { ascending: true })

    if (error) {
      console.error('Error fetching payment breakdown:', error)
      return { principalPaid: 0, interestPaid: 0, totalPaid: 0 }
    }

    const payments = data || []
    const totalPaid = payments.reduce((sum, p) => sum + (p.total_payment || 0), 0)

    if (!loanRecord || totalPaid === 0) {
      return { principalPaid: 0, interestPaid: 0, totalPaid }
    }

    // DIFFERENTIATE BY LOAN TYPE:
    // Personal Loans: Use fixed amortization schedule (sum individual payment breakdowns)
    // Home/Mortgage/LAP: Use actual ledger balance (current balance is ground truth)
    const isHomeOrMortgage = ['Home', 'Mortgage', 'LAP'].includes(loanRecord.loan_type)

    if (isHomeOrMortgage) {
      // HOME/MORTGAGE LOGIC: Principal Paid = Sanctioned Principal - Current Balance
      // Interest Paid = Total Amount Paid - Principal Paid
      const principalPaid = Math.max(0, loanRecord.principal - loanRecord.current_balance)
      const interestPaid = Math.max(0, totalPaid - principalPaid)

      console.log('Home/Mortgage Loan Breakdown (Ledger-Based):', {
        loanId,
        loanType: loanRecord.loan_type,
        sanctionedPrincipal: loanRecord.principal,
        currentBalance: loanRecord.current_balance,
        principalPaid,
        totalPaid,
        interestPaid,
        principalPercent: Math.round((principalPaid / totalPaid) * 100),
        paymentsCount: payments.length
      })

      return { principalPaid, interestPaid, totalPaid }
    } else {
      // PERSONAL LOAN LOGIC: Sum individual EMI breakdowns from amortization schedule
      let principalPaid = 0
      let interestPaid = 0
      const hasOfficialBreakdown = loanRecord.first_payment_interest && loanRecord.first_payment_principal

      for (const payment of payments) {
        if (payment.payment_number === 1 && hasOfficialBreakdown) {
          // Use official breakdown for payment 1 from repayment schedule
          principalPaid += loanRecord.first_payment_principal || 0
          interestPaid += loanRecord.first_payment_interest || 0
        } else {
          // Use calculated values from amortization for other payments
          principalPaid += payment.principal_amount || 0
          interestPaid += payment.interest_amount || 0
        }
      }

      console.log('Personal Loan Breakdown (Schedule-Based):', {
        loanId,
        loanType: loanRecord.loan_type,
        principalPaid,
        totalPaid,
        interestPaid,
        principalPercent: Math.round((principalPaid / totalPaid) * 100),
        paymentsCount: payments.length
      })

      return { principalPaid, interestPaid, totalPaid }
    }
  } catch (err) {
    console.error('Failed to fetch payment breakdown:', err)
    return { principalPaid: 0, interestPaid: 0, totalPaid: 0 }
  }
}

// Update payment schedule records (deletes old ones and creates new ones)
export async function updateLoanPaymentSchedule(userId: string, loanId: string, schedule: PaymentScheduleItem[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Supabase not configured, skipping payment record update')
    return true
  }

  try {
    console.log(`Updating payment schedule for loan ${loanId}: deleting old records and creating ${schedule.length} new ones`)

    // First, delete all existing payment records for this loan
    const { error: deleteError } = await supabase
      .from('loan_payments')
      .delete()
      .eq('loan_id', loanId)

    if (deleteError) {
      console.error('Error deleting old payment records:', deleteError)
      return false
    }

    console.log(`Deleted existing payment records for loan ${loanId}`)

    // Then insert new payment records
    const paymentRecords = schedule.map(item => ({
      user_id: userId,
      loan_id: loanId,
      payment_number: item.payment_number,
      payment_month: item.payment_month,
      due_date: item.due_date,
      principal_amount: item.principal_amount,
      interest_amount: item.interest_amount,
      emi_amount: item.emi_amount,
      total_payment: item.total_payment,
      balance_after_payment: item.balance_after_payment,
      status: item.status,
      payment_date: item.payment_date ? item.payment_date : null,
      skip_penalty: 0,
    }))

    const { error: insertError, data } = await supabase
      .from('loan_payments')
      .insert(paymentRecords)
      .select()

    if (insertError) {
      console.error('Error creating new payment records:', insertError)
      return false
    }

    console.log(`Successfully created ${data?.length || 0} new payment records for loan ${loanId}`)
    return true
  } catch (err) {
    console.error('Exception updating payment records:', err)
    return false
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
