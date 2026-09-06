import { getPaymentStats } from './paymentService'

export interface HealthMetrics {
  overall: number // 0-100
  discipline: {
    score: number
    percentage: number
    details: string
  }
  affordability: {
    score: number
    emiPercentage: number
    category: 'Excellent' | 'Good' | 'Fair' | 'Poor'
    details: string
  }
  progress: {
    score: number
    percentage: number
    monthsPaid: number
    totalMonths: number
    details: string
  }
  consistency: {
    score: number
    onTimeRate: number
    details: string
  }
}

/**
 * Calculate loan health score (0-100)
 * Components:
 * - Payment Discipline (40%): on-time payment rate
 * - Affordability (30%): EMI as % of monthly income
 * - Progress (20%): months paid vs total months
 * - Consistency (10%): regular payment pattern
 */
export async function calculateLoanHealthScore(
  loanId: string,
  monthlyIncome: number,
  totalMonths: number,
  paidMonths: number,
  monthlyEMI: number
): Promise<HealthMetrics> {
  const stats = await getPaymentStats(loanId)

  // 1. Payment Discipline (40%)
  const paymentRate = stats.paymentRate / 100
  const disciplineScore = Math.round(40 * paymentRate)
  const disciplineDetails = `${stats.paidPayments}/${stats.totalPayments} payments on time`

  // 2. Affordability (30%)
  const emiPercentage = monthlyIncome > 0 ? (monthlyEMI / monthlyIncome) * 100 : 0
  let affordabilityScore = 0
  let affordabilityCategory: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good'

  if (emiPercentage <= 5) {
    affordabilityScore = 30
    affordabilityCategory = 'Excellent'
  } else if (emiPercentage <= 10) {
    affordabilityScore = 25
    affordabilityCategory = 'Good'
  } else if (emiPercentage <= 15) {
    affordabilityScore = 20
    affordabilityCategory = 'Fair'
  } else {
    affordabilityScore = 10
    affordabilityCategory = 'Poor'
  }

  // 3. Progress (20%)
  const progressPercentage = totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0
  const progressScore = Math.round(20 * (progressPercentage / 100))
  const progressDetails = `${paidMonths}/${totalMonths} months paid (${Math.round(progressPercentage)}%)`

  // 4. Consistency (10%)
  // If no skipped or late payments and regular schedule, award full score
  const skipCount = stats.skippedPayments
  const lateCount = stats.latePayments
  const consistency = Math.max(0, 10 - (skipCount * 2 + lateCount * 1.5))
  const consistencyScore = Math.round(consistency)
  const onTimeRate = totalMonths > 0 ? Math.round((stats.paidPayments / totalMonths) * 100) : 0
  const consistencyDetails = skipCount === 0 && lateCount === 0 ? 'Perfect consistency' : `${skipCount} skipped, ${lateCount} late`

  // Overall Score (capped at 100)
  const overallScore = Math.min(
    100,
    Math.round(disciplineScore + affordabilityScore + progressScore + consistencyScore)
  )

  return {
    overall: overallScore,
    discipline: {
      score: disciplineScore,
      percentage: Math.round(paymentRate * 100),
      details: disciplineDetails
    },
    affordability: {
      score: affordabilityScore,
      emiPercentage: Math.round(emiPercentage * 10) / 10,
      category: affordabilityCategory,
      details: `EMI is ${affordabilityCategory.toLowerCase()} (${Math.round(emiPercentage)}% of income)`
    },
    progress: {
      score: progressScore,
      percentage: Math.round(progressPercentage),
      monthsPaid: paidMonths,
      totalMonths: totalMonths,
      details: progressDetails
    },
    consistency: {
      score: consistencyScore,
      onTimeRate,
      details: consistencyDetails
    }
  }
}

/**
 * Get health score badge color and label
 */
export function getHealthScoreBadge(score: number): {
  color: string
  bgColor: string
  label: string
} {
  if (score >= 80) {
    return {
      color: '#22c55e', // green
      bgColor: 'bg-[var(--success-soft)]',
      label: 'Excellent'
    }
  } else if (score >= 60) {
    return {
      color: '#f59e0b', // amber
      bgColor: 'bg-[var(--warning-soft)]',
      label: 'Good'
    }
  } else if (score >= 40) {
    return {
      color: '#f97316', // orange
      bgColor: 'bg-[var(--warning-soft)]',
      label: 'Fair'
    }
  } else {
    return {
      color: '#ef4444', // red
      bgColor: 'bg-[var(--danger-soft)]',
      label: 'Poor'
    }
  }
}

/**
 * Get health score description
 */
export function getHealthScoreDescription(score: number): string {
  if (score >= 80) {
    return 'Excellent loan management. Keep up the great payment discipline!'
  } else if (score >= 60) {
    return 'Good management. Minor improvements in payment discipline would help.'
  } else if (score >= 40) {
    return 'Fair management. Consider prioritizing timely payments to improve score.'
  } else {
    return 'Needs improvement. Establish a regular payment schedule to strengthen your profile.'
  }
}

/**
 * Calculate how health score will improve with extra payments
 */
export function projectHealthScoreImprovement(
  currentScore: number,
  currentProgress: number,
  monthsSavedWithExtra: number,
  totalMonths: number
): {
  projectedScore: number
  improvement: number
  newProgressPercentage: number
} {
  const currentMonthsPaid = Math.floor((currentProgress / 100) * totalMonths)
  const newMonthsPaid = currentMonthsPaid + monthsSavedWithExtra
  const newProgress = Math.round((newMonthsPaid / totalMonths) * 100)

  // Extra payments boost progress score
  const progressBoost = Math.round(((monthsSavedWithExtra / totalMonths) * 20) / 2) // 50% weight on progress improvement
  const projectedScore = Math.min(100, Math.round(currentScore + progressBoost))

  return {
    projectedScore,
    improvement: projectedScore - currentScore,
    newProgressPercentage: newProgress
  }
}
