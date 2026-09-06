import { createClient } from '@supabase/supabase-js'

export interface LoanPayment {
  id: string
  loan_id: string
  user_id: string
  payment_number: number
  payment_month: string
  due_date: string
  principal_amount: number
  interest_amount: number
  total_payment: number
  skip_penalty: number
  status: 'pending' | 'paid' | 'skipped' | 'late'
  payment_date: string | null
  balance_after_payment: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreatePaymentInput {
  loan_id: string
  user_id: string
  payment_number: number
  payment_month: string
  due_date: string
  principal_amount: number
  interest_amount: number
  total_payment: number
  balance_after_payment: number
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)

/**
 * Create payment records from amortization schedule
 */
export async function createPaymentSchedule(
  payments: CreatePaymentInput[]
): Promise<LoanPayment[] | null> {
  try {
    const { data, error } = await supabase
      .from('loan_payments')
      .insert(payments)
      .select()

    if (error) throw error
    return data as LoanPayment[]
  } catch (err) {
    console.error('Failed to create payment schedule:', err)
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem('loan_payments') || '[]')
    const newPayments = payments.map((p, i) => ({
      ...p,
      id: `payment_${Date.now()}_${i}`,
      status: 'pending' as const,
      payment_date: null,
      skip_penalty: 0,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    localStorage.setItem('loan_payments', JSON.stringify([...existing, ...newPayments]))
    return newPayments as LoanPayment[]
  }
}

/**
 * Get all payments for a loan
 */
export async function getPaymentsByLoan(loanId: string): Promise<LoanPayment[]> {
  try {
    const { data, error } = await supabase
      .from('loan_payments')
      .select('*')
      .eq('loan_id', loanId)
      .order('payment_number', { ascending: true })

    if (error) throw error
    return (data as LoanPayment[]) || []
  } catch (err) {
    console.error('Failed to fetch payments:', err)
    // Fallback to localStorage
    const payments = JSON.parse(localStorage.getItem('loan_payments') || '[]')
    return payments.filter((p: LoanPayment) => p.loan_id === loanId)
  }
}

/**
 * Mark payment as paid
 */
export async function markPaymentPaid(
  paymentId: string,
  principalAmount: number
): Promise<LoanPayment | null> {
  try {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('loan_payments')
      .update({
        status: 'paid',
        payment_date: now,
        updated_at: now
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error

    // Update loan's current_balance
    const payment = data as LoanPayment
    await supabase
      .from('loans')
      .update({
        current_balance: supabase.rpc('subtract_from_current_balance', {
          loan_id: payment.loan_id,
          amount: principalAmount
        })
      })
      .eq('id', payment.loan_id)

    return payment
  } catch (err) {
    console.error('Failed to mark payment as paid:', err)
    // Fallback to localStorage
    const payments = JSON.parse(localStorage.getItem('loan_payments') || '[]')
    const index = payments.findIndex((p: LoanPayment) => p.id === paymentId)
    if (index !== -1) {
      payments[index].status = 'paid'
      payments[index].payment_date = new Date().toISOString()
      localStorage.setItem('loan_payments', JSON.stringify(payments))
      return payments[index]
    }
    return null
  }
}

/**
 * Mark payment as skipped with optional penalty
 */
export async function markPaymentSkipped(
  paymentId: string,
  skipPenalty: number = 0
): Promise<LoanPayment | null> {
  try {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('loan_payments')
      .update({
        status: 'skipped',
        skip_penalty: skipPenalty,
        updated_at: now
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data as LoanPayment
  } catch (err) {
    console.error('Failed to mark payment as skipped:', err)
    // Fallback to localStorage
    const payments = JSON.parse(localStorage.getItem('loan_payments') || '[]')
    const index = payments.findIndex((p: LoanPayment) => p.id === paymentId)
    if (index !== -1) {
      payments[index].status = 'skipped'
      payments[index].skip_penalty = skipPenalty
      localStorage.setItem('loan_payments', JSON.stringify(payments))
      return payments[index]
    }
    return null
  }
}

/**
 * Get payment statistics for a loan
 */
export async function getPaymentStats(loanId: string): Promise<{
  totalPayments: number
  paidPayments: number
  pendingPayments: number
  skippedPayments: number
  latePayments: number
  paymentRate: number
}> {
  const payments = await getPaymentsByLoan(loanId)

  const stats = {
    totalPayments: payments.length,
    paidPayments: payments.filter(p => p.status === 'paid').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    skippedPayments: payments.filter(p => p.status === 'skipped').length,
    latePayments: payments.filter(p => p.status === 'late').length,
    paymentRate: 0
  }

  stats.paymentRate = stats.totalPayments > 0 ? (stats.paidPayments / stats.totalPayments) * 100 : 0

  return stats
}

/**
 * Check if payment is overdue (more than 7 days late)
 */
export function isPaymentOverdue(dueDate: string): boolean {
  const due = new Date(dueDate)
  const today = new Date()
  const daysOverdue = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  return daysOverdue > 7
}

/**
 * Check if payment is due soon (within 3 days)
 */
export function isPaymentDueSoon(dueDate: string): boolean {
  const due = new Date(dueDate)
  const today = new Date()
  const daysTillDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysTillDue > 0 && daysTillDue <= 3
}
