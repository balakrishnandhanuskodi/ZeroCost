import { analyzeFirstEMI, generatePaymentSchedule, FirstEMIAnalysis, PaymentScheduleItem } from '../../lib/loansService'
import Button from '../UI/Button'

interface EMIAnalysisDialogProps {
  principal: number
  interestRate: number
  tenure: number
  tenureUnit: 'months' | 'years'
  firstEMIDate: string
  firstEMIAmount: number
  currentBalance: number
  emirsPaidCount: number
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
  onConfirm,
  onCancel
}: EMIAnalysisDialogProps) {
  const analysis = analyzeFirstEMI(principal, interestRate, tenure, tenureUnit, firstEMIAmount)
  const tenureMonths = tenureUnit === 'years' ? tenure * 12 : tenure
  const schedule = generatePaymentSchedule(
    'temp',
    principal,
    interestRate,
    tenureMonths,
    firstEMIDate,
    firstEMIAmount,
    emirsPaidCount
  )

  // Calculate expected current balance after already-paid EMIs
  const lastPaidPayment = emirsPaidCount > 0 ? schedule[emirsPaidCount - 1] : null
  const expectedBalance = lastPaidPayment?.balance_after_payment || principal
  const balanceDifference = Math.abs(expectedBalance - currentBalance)
  const hasBalanceDiscrepancy = balanceDifference > 1 // Allow 1 rupee difference

  const handleConfirm = () => {
    onConfirm(schedule)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start md:items-center justify-center z-50 overflow-y-auto p-2 md:p-0">
      <div className="bg-[var(--card)] rounded-t-2xl md:rounded-xl w-full md:w-[650px] max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-2xl my-2 md:my-0">
        <h2 className="font-display font-700 text-base text-[var(--foreground)] mb-4">EMI Analysis & Validation</h2>

        {/* First EMI Analysis */}
        <div className="mb-4 p-3 bg-[var(--primary-soft)] border border-[var(--primary)] rounded-lg">
          <p className="text-[12px] font-semibold text-[var(--primary)] mb-2">First EMI Breakdown</p>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--muted-foreground)]">Standard EMI:</span>
              <span className="font-semibold text-[var(--foreground)]">₹{analysis.standardEMI.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--muted-foreground)]">Your First EMI:</span>
              <span className="font-semibold text-[var(--foreground)]">₹{analysis.firstEMIAmount.toLocaleString('en-IN')}</span>
            </div>
            {analysis.hasStubPeriod && (
              <div className="flex justify-between text-[11px] pt-1 border-t border-[var(--primary)]">
                <span className="text-[var(--muted-foreground)]">Pre-EMI Interest (Stub):</span>
                <span className="font-semibold text-[var(--warning)]">₹{analysis.stubInterest.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-[var(--primary)] mt-2 leading-relaxed">
            ✓ {analysis.note}
          </p>
        </div>

        {/* Balance Discrepancy Warning (if any) */}
        {hasBalanceDiscrepancy && emirsPaidCount > 0 && (
          <div className="mb-4 p-3 bg-[var(--warning-soft)] border border-[var(--warning)] rounded-lg">
            <p className="text-[12px] font-semibold text-[var(--warning)] mb-2">⚠️ Balance Mismatch Detected</p>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">You entered balance:</span>
                <span className="font-semibold">₹{currentBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Calculated balance (after {emirsPaidCount} EMIs):</span>
                <span className="font-semibold">₹{Math.round(expectedBalance).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[var(--warning)]">
                <span className="text-[var(--muted-foreground)]">Difference:</span>
                <span className="font-semibold">₹{Math.round(balanceDifference).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-2">
              This could mean: (1) You paid extra principal, (2) Payments were on different dates, or (3) Interest rates vary.
            </p>
            <p className="text-[11px] font-semibold text-[var(--warning)] mt-2">
              We'll use your entered balance. System can be adjusted later if needed.
            </p>
          </div>
        )}

        {/* Payment Schedule Summary */}
        <div className="mb-4 p-3 bg-[var(--muted)] rounded-lg">
          <p className="text-[12px] font-semibold text-[var(--foreground)] mb-2">Payment Schedule Summary</p>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Total EMIs:</span>
              <span className="font-semibold">{tenureMonths}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">First EMI Date:</span>
              <span className="font-semibold">{new Date(firstEMIDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Last EMI Date:</span>
              <span className="font-semibold">
                {schedule.length > 0
                  ? new Date(schedule[schedule.length - 1].due_date).toLocaleDateString('en-IN')
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">EMIs Already Marked Paid:</span>
              <span className="font-semibold text-[var(--success)]">{emirsPaidCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Remaining EMIs:</span>
              <span className="font-semibold text-[var(--info)]">{tenureMonths - emirsPaidCount}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 text-xs py-2"
          >
            Back to Form
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="flex-1 text-xs py-2"
          >
            Confirm & Create Loan
          </Button>
        </div>
      </div>
    </div>
  )
}
