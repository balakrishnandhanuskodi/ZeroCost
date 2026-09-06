export interface AmortizationRow {
  month: number
  dueDate: string
  principalAmount: number
  interestAmount: number
  totalPayment: number
  balanceAfterPayment: number
}

export interface AmortizationSchedule {
  totalPayments: number
  totalPrincipal: number
  totalInterest: number
  rows: AmortizationRow[]
}

/**
 * Calculate EMI using standard formula
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where P = Principal, r = monthly rate, n = number of months
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  monthlyPaymentDayOfMonth: number,
  tenureMonths: number
): number {
  if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) return 0

  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / tenureMonths

  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1

  return numerator / denominator
}

/**
 * Generate full amortization schedule for a loan
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: string,
  monthlyPaymentDayOfMonth: number
): AmortizationSchedule {
  const emi = calculateEMI(principal, annualRate, monthlyPaymentDayOfMonth, tenureMonths)
  const monthlyRate = annualRate / 100 / 12

  const rows: AmortizationRow[] = []
  let remainingBalance = principal
  let accumulatedPrincipal = 0
  let accumulatedInterest = 0

  const startDateObj = new Date(startDate)

  for (let month = 1; month <= tenureMonths; month++) {
    // Calculate due date for this month
    const dueDate = new Date(startDateObj)
    dueDate.setMonth(dueDate.getMonth() + month)
    dueDate.setDate(monthlyPaymentDayOfMonth)

    const dueDateStr = dueDate.toISOString().split('T')[0]

    // Calculate interest for this month
    const interestPayment = remainingBalance * monthlyRate

    // Calculate principal for this month
    const principalPayment = Math.min(emi - interestPayment, remainingBalance)

    // Update balance
    remainingBalance -= principalPayment

    // Accumulate totals
    accumulatedPrincipal += principalPayment
    accumulatedInterest += interestPayment

    rows.push({
      month,
      dueDate: dueDateStr,
      principalAmount: Math.round(principalPayment * 100) / 100,
      interestAmount: Math.round(interestPayment * 100) / 100,
      totalPayment: Math.round((principalPayment + interestPayment) * 100) / 100,
      balanceAfterPayment: Math.max(0, Math.round(remainingBalance * 100) / 100)
    })
  }

  return {
    totalPayments: tenureMonths,
    totalPrincipal: Math.round(accumulatedPrincipal * 100) / 100,
    totalInterest: Math.round(accumulatedInterest * 100) / 100,
    rows
  }
}

/**
 * Calculate impact of extra monthly payment
 * Returns: interest saved, months saved, new closure date
 */
export function calculateEarlyRepaymentImpact(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  monthlyPaymentDayOfMonth: number,
  startDate: string,
  extraMonthlyPayment: number
): {
  standardEMI: number
  totalWithExtra: number
  interestSaved: number
  monthsSaved: number
  newClosureDate: string
  originalClosureDate: string
} {
  const standardEMI = calculateEMI(principal, annualRate, monthlyPaymentDayOfMonth, tenureMonths)
  const monthlyRate = annualRate / 100 / 12

  // Calculate with extra payment
  let remainingBalance = principal
  let monthsToClose = 0
  let totalInterestWithExtra = 0

  const startDateObj = new Date(startDate)
  let currentDate = new Date(startDateObj)

  while (remainingBalance > 0 && monthsToClose < tenureMonths * 2) {
    const interestPayment = remainingBalance * monthlyRate
    const principalPayment = Math.min(standardEMI + extraMonthlyPayment - interestPayment, remainingBalance)

    remainingBalance -= principalPayment
    totalInterestWithExtra += interestPayment
    monthsToClose++

    currentDate.setMonth(currentDate.getMonth() + 1)
    currentDate.setDate(monthlyPaymentDayOfMonth)
  }

  // Calculate standard scenario
  const standardSchedule = generateAmortizationSchedule(
    principal,
    annualRate,
    tenureMonths,
    startDate,
    monthlyPaymentDayOfMonth
  )

  const originalClosureDateObj = new Date(startDateObj)
  originalClosureDateObj.setMonth(originalClosureDateObj.getMonth() + tenureMonths)
  originalClosureDateObj.setDate(monthlyPaymentDayOfMonth)

  return {
    standardEMI: Math.round(standardEMI * 100) / 100,
    totalWithExtra: Math.round((standardEMI * tenureMonths + extraMonthlyPayment * monthsToClose) * 100) / 100,
    interestSaved: Math.round((standardSchedule.totalInterest - totalInterestWithExtra) * 100) / 100,
    monthsSaved: Math.max(0, tenureMonths - monthsToClose),
    newClosureDate: currentDate.toISOString().split('T')[0],
    originalClosureDate: originalClosureDateObj.toISOString().split('T')[0]
  }
}

/**
 * Calculate days until next payment
 */
export function daysUntilNextPayment(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)

  const diff = due.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
