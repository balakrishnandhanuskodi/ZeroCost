import { useState } from 'react'
import { analyzeFirstEMI, generatePaymentSchedule, FirstEMIAnalysis, PaymentScheduleItem } from '../../lib/loansService'
import Button from '../UI/Button'
import { ChevronLeft, BarChart3, Calendar, AlertTriangle, Info, CheckCircle } from 'lucide-react'

interface EMIAnalysisDialogProps {
  principal: number
  interestRate: number
  tenure: number
  tenureUnit: 'months' | 'years'
  firstEMIDate: string
  firstEMIAmount: number
  currentBalance: number
  emirsPaidCount: number
  loanType?: string
  onConfirm: (schedule: PaymentScheduleItem[]) => void
  onCancel: () => void
}

export default function EMIAnalysisDialog({
  principal,
  interestRate,
  tenure,
  tenureUnit,
  firstEMIDate,
  firstEMIAmount,
  currentBalance,
  emirsPaidCount,
  loanType,
  onConfirm,
  onCancel
}: EMIAnalysisDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)

  const analysis = analyzeFirstEMI(principal, interestRate, tenure, tenureUnit, firstEMIAmount, loanType as any)
  const tenureMonths = tenureUnit === 'years' ? tenure * 12 : tenure
  const schedule = generatePaymentSchedule(
    'temp',
    principal,
    interestRate,
    tenureMonths,
    firstEMIDate,
    firstEMIAmount,
    firstEMIAmount,
    emirsPaidCount,
    0,
    loanType as any
  )

  // Calculate expected current balance after already-paid EMIs
  const lastPaidPayment = emirsPaidCount > 0 ? schedule[emirsPaidCount - 1] : null
  const expectedBalance = lastPaidPayment?.balance_after_payment || principal
  const balanceDifference = Math.abs(expectedBalance - currentBalance)
  const hasBalanceDiscrepancy = balanceDifference > 1

  const handleConfirm = () => {
    onConfirm(schedule)
  }

  const handleNextStep = () => {
    setStep(2)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-2xl">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Step {step} of 2
              </p>
              <h2 className="font-display font-700 text-lg text-[var(--foreground)] mt-1">
                {step === 1 ? 'Review EMI Details' : 'Validate & Confirm'}
              </h2>
            </div>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
                title="Back to Step 1"
              >
                <ChevronLeft size={18} className="text-[var(--muted-foreground)]" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* STEP 1: Review EMI Details */}
        {step === 1 && (
          <div className="space-y-4">
            {/* First EMI Analysis */}
            <div className="p-4 bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={16} className="text-[var(--primary)]" />
                <p className="text-[13px] font-semibold text-[var(--primary)]">First EMI Breakdown</p>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[var(--muted-foreground)]">Standard EMI:</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">
                    ₹{analysis.standardEMI.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[var(--muted-foreground)]">Your First EMI:</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">
                    ₹{analysis.firstEMIAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                {analysis.hasStubPeriod && (
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--primary)] border-opacity-30">
                    <span className="text-[12px] text-[var(--muted-foreground)]">Pre-EMI Interest (Stub):</span>
                    <span className="text-[13px] font-bold text-[var(--warning)]">
                      ₹{analysis.stubInterest.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-[12px] text-[var(--primary)] mt-3 leading-relaxed bg-white/10 p-2 rounded flex items-start gap-2">
                <CheckCircle size={14} className="flex-shrink-0 mt-0.5 text-[var(--primary)]" />
                <span>{analysis.note}</span>
              </div>
            </div>

            {/* Payment Schedule Summary */}
            <div className="p-4 bg-[var(--muted)] rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-[var(--foreground)]" />
                <p className="text-[13px] font-semibold text-[var(--foreground)]">Payment Schedule</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-[var(--muted-foreground)] uppercase font-medium">Total EMIs</p>
                  <p className="text-[14px] font-bold text-[var(--foreground)]">{tenureMonths}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-[var(--muted-foreground)] uppercase font-medium">First EMI Date</p>
                  <p className="text-[14px] font-bold text-[var(--foreground)]">
                    {new Date(firstEMIDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-[var(--muted-foreground)] uppercase font-medium">Last EMI Date</p>
                  <p className="text-[14px] font-bold text-[var(--foreground)]">
                    {schedule.length > 0
                      ? new Date(schedule[schedule.length - 1].due_date).toLocaleDateString('en-IN')
                      : '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-[var(--muted-foreground)] uppercase font-medium">Already Paid</p>
                  <p className="text-[14px] font-bold text-[var(--success)]">{emirsPaidCount} EMIs</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 text-sm py-2.5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleNextStep}
                className="flex-1 text-sm py-2.5"
              >
                Next: Review Balance →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Validate & Confirm */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Balance Check */}
            {hasBalanceDiscrepancy && emirsPaidCount > 0 ? (
              <div className="p-4 bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-[var(--warning)]" />
                  <p className="text-[13px] font-semibold text-[var(--warning)]">Balance Mismatch Detected</p>
                </div>
                <div className="space-y-2.5 mb-3">
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[var(--muted-foreground)]">You entered:</span>
                    <span className="text-[13px] font-bold text-[var(--foreground)]">
                      ₹{currentBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[var(--muted-foreground)]">System calculated (after {emirsPaidCount} EMIs):</span>
                    <span className="text-[13px] font-bold text-[var(--foreground)]">
                      ₹{Math.round(expectedBalance).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--warning)] border-opacity-30">
                    <span className="text-[12px] text-[var(--muted-foreground)]">Difference:</span>
                    <span className="text-[13px] font-bold text-[var(--warning)]">
                      ₹{Math.round(balanceDifference).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="bg-white/10 p-2.5 rounded space-y-1.5">
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                    This difference could occur due to:
                  </p>
                  <ul className="text-[11px] text-[var(--muted-foreground)] space-y-1 ml-2">
                    <li>• Extra principal payments made</li>
                    <li>• Different payment dates or partial payments</li>
                    <li>• Variable interest rates</li>
                  </ul>
                </div>
                <div className="text-[11px] font-semibold text-[var(--warning)] mt-3 bg-white/5 p-2 rounded flex items-start gap-2">
                  <Info size={14} className="flex-shrink-0 mt-0.5" />
                  <span>We'll use your entered balance. You can adjust it later if needed.</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[var(--success-soft)] border border-[var(--success)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-[var(--success)]" />
                  <p className="text-[13px] font-semibold text-[var(--success)]">Balance Verified</p>
                </div>
                <p className="text-[12px] text-[var(--muted-foreground)]">
                  Your entered balance matches the calculated balance. Everything looks good!
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={16} className="text-[var(--primary)]" />
                <p className="text-[13px] font-semibold text-[var(--primary)]">Loan Summary</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[12px] text-[var(--muted-foreground)]">Principal Amount:</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">
                    ₹{principal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[var(--muted-foreground)]">Interest Rate:</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">{interestRate.toFixed(2)}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[var(--muted-foreground)]">Tenure:</span>
                  <span className="text-[13px] font-bold text-[var(--foreground)]">{tenureMonths} months</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--primary)] border-opacity-30">
                  <span className="text-[12px] text-[var(--muted-foreground)]">Remaining EMIs:</span>
                  <span className="text-[13px] font-bold text-[var(--info)]">{tenureMonths - emirsPaidCount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 text-sm py-2.5"
              >
                ← Back
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                className="flex-1 text-sm py-2.5 flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Confirm & Create Loan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
