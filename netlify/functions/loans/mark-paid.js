import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { loanId, paymentDate, paymentNumber } = JSON.parse(event.body)

    if (!loanId || !paymentDate || !paymentNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    // Get the current loan record
    const { data: loan, error: fetchError } = await supabase
      .from('loans')
      .select('emis_paid_count, user_id')
      .eq('id', loanId)
      .single()

    if (fetchError || !loan) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Loan not found' })
      }
    }

    // Update emis_paid_count to the max of current value and paymentNumber
    const newEmisPaidCount = Math.max(loan.emis_paid_count, paymentNumber)

    const { error: updateError } = await supabase
      .from('loans')
      .update({
        emis_paid_count: newEmisPaidCount,
        last_payment_date: paymentDate
      })
      .eq('id', loanId)

    if (updateError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update payment status' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, emis_paid_count: newEmisPaidCount })
    }
  } catch (error) {
    console.error('Error marking payment as paid:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
