# Phase 1B: Enhanced Loan Management System
## Implementation Plan & Architecture

---

## 📋 Overview
Building comprehensive loan payment tracking, amortization, health scoring, and financial analytics.

**Timeline**: 4-5 hours
**Components**: 12+ new/updated files
**Database Tables**: 1 new table (loan_payments)

---

## 🗄️ Database Schema Changes

### New Table: `loan_payments`
```sql
CREATE TABLE loan_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  
  -- Payment Identification
  payment_number INT NOT NULL, -- 1st, 2nd, 3rd payment etc
  payment_month DATE NOT NULL, -- YYYY-MM-01 format
  due_date DATE NOT NULL,
  
  -- Amounts (from amortization)
  principal_amount DECIMAL(12, 2) NOT NULL,
  interest_amount DECIMAL(12, 2) NOT NULL,
  total_payment DECIMAL(12, 2) NOT NULL,
  
  -- Skip Penalty (if applicable)
  skip_penalty DECIMAL(12, 2) DEFAULT 0,
  
  -- Payment Status
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'skipped', 'late')) DEFAULT 'pending',
  payment_date TIMESTAMP,
  
  -- Additional Info
  balance_after_payment DECIMAL(12, 2),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_loan_payments_user_id ON loan_payments(user_id);
CREATE INDEX idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_status ON loan_payments(status);
CREATE INDEX idx_loan_payments_due_date ON loan_payments(due_date);
```

### Updated `loans` Table
```sql
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_type VARCHAR(50) 
  CHECK (loan_type IN ('Home', 'Personal', 'Auto', 'Education', 'Other'));

ALTER TABLE loans ADD COLUMN IF NOT EXISTS health_score INT DEFAULT 75;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS health_score_updated_at TIMESTAMP;
```

---

## 📁 New/Updated Files

### Core Service Layer
1. **`src/lib/amortizationService.ts`** (NEW)
   - `generateAmortizationSchedule()` - Calculate full EMI breakdown
   - `createPaymentSchedule()` - Generate loan_payments records

2. **`src/lib/paymentService.ts`** (NEW)
   - `markPaymentPaid()` - Update payment status + current_balance
   - `markPaymentSkipped()` - Add skip penalty + fees
   - `getPaymentsByLoan()` - Fetch payment history

3. **`src/lib/loanHealthService.ts`** (NEW)
   - `calculateLoanHealthScore()` - Score based on payment discipline
   - `getLoanHealthMetrics()` - Detailed breakdown

4. **`src/lib/repaymentCalculatorService.ts`** (NEW)
   - `calculateEarlyRepayment()` - Interest saved with extra payments
   - `getForecastedClosureDate()` - Estimate when loan closes

5. **`src/lib/loansService.ts`** (UPDATED)
   - Add `loan_type` to `LoanRecord` interface
   - Export new types: `LoanPayment`, `LoanType`

### UI Components
6. **`src/components/Loans/LoanPaymentsList.tsx`** (NEW)
   - Display monthly payments in table/card format
   - Mark payments as paid/skipped
   - Show skip penalty input

7. **`src/components/Loans/EarlyRepaymentCalculator.tsx`** (NEW)
   - Modal/drawer with extra payment input
   - Show interest saved + new closure date
   - Visual comparison

8. **`src/components/Loans/LoanHealthScore.tsx`** (NEW)
   - Display score badge (0-100)
   - Show components: discipline, affordability, progress
   - Trend sparkline

9. **`src/components/Charts/InterestBreakdown.tsx`** (NEW)
   - Pie/Donut chart: Principal vs Interest paid

10. **`src/components/Charts/PaymentTrendChart.tsx`** (NEW)
    - Area chart: On-time vs late vs skipped payments

11. **`src/components/Forms/LoanForm.tsx`** (UPDATED)
    - Add `loan_type` dropdown field

12. **`src/pages/Loans.tsx`** (UPDATED)
    - Show loan health score on card
    - Display countdown: "EMI due in 5 days (Sep 10)"
    - Add expandable payments section
    - Integrate new charts

---

## 🔄 Data Flow

### Loan Creation Flow
```
Create Loan (Principal, Rate, Tenure, etc.)
  ↓
Generate Amortization Schedule
  ↓
Create loan_payments records (1 per month)
  ↓
Initialize health_score = 75
  ↓
Display loan with all payments
```

### Payment Tracking Flow
```
Monthly Payment Due
  ↓
Show countdown: "Due in 5 days"
  ↓
User clicks "Mark as Paid" or "Skip"
  ↓
If Paid:
  - Update payment.status = 'paid'
  - Decrease loans.current_balance by principal
  - Recalculate health_score
  
If Skipped:
  - Ask for penalty amount
  - Add to next month's payment
  - Mark status = 'skipped'
  - Decrease health_score
```

---

## 📊 Health Score Calculation

```
Health Score = 40% Discipline + 30% Affordability + 20% Progress + 10% Consistency

1. Payment Discipline (40%)
   - On-time payment rate: paid / total_payments
   - Score: 40 × (on_time_rate)
   - Example: 15/18 paid on time = 40 × 0.833 = 33.3/40

2. Affordability (30%)
   - EMI as % of monthly income
   - 0-5% = 30 points
   - 5-10% = 25 points
   - 10-15% = 20 points
   - 15%+ = 10 points

3. Progress (20%)
   - Months paid / total months
   - Score: 20 × (months_paid / total_months)

4. Consistency (10%)
   - Payment variance (low variance = high score)
   - Regular pattern bonus

Base: 75 (healthy)
```

---

## 🎯 Feature Implementation Order

### Step 1: Database & Types (30 min)
- [ ] Create loan_payments migration
- [ ] Update LoanRecord type
- [ ] Add new types: LoanPayment, LoanType

### Step 2: Amortization Engine (45 min)
- [ ] Implement amortizationService.ts
- [ ] Test with sample loans
- [ ] Verify calculations

### Step 3: Payment Service (45 min)
- [ ] Implement paymentService.ts
- [ ] Test mark paid/skipped logic
- [ ] Verify balance updates

### Step 4: Health Score (30 min)
- [ ] Implement loanHealthService.ts
- [ ] Test scoring algorithm
- [ ] Verify calculations

### Step 5: Early Repayment (30 min)
- [ ] Implement repaymentCalculatorService.ts
- [ ] Test various scenarios

### Step 6: UI Components (60 min)
- [ ] Build LoanPaymentsList
- [ ] Build EarlyRepaymentCalculator
- [ ] Build LoanHealthScore
- [ ] Build charts

### Step 7: Integration (30 min)
- [ ] Update Loans.tsx
- [ ] Update LoanForm.tsx
- [ ] Wire up all features
- [ ] Test end-to-end

---

## 💾 Sample Data

### Test Loan
```
Lender: ICICI Bank
Type: Personal
Principal: ₹1,50,000
Interest Rate: 10.7% p.a.
Tenure: 60 months
Monthly Payment Date: 5th
Start Date: 2026-01-01

Expected EMI: ₹3,215
Total Interest: ₹42,900
Total Payments: ₹1,92,900
```

### Amortization (First 3 Months)
```
Month 1 (Jan 5):
  Principal: ₹1,877
  Interest: ₹1,338
  Total: ₹3,215
  Balance: ₹1,48,123

Month 2 (Feb 5):
  Principal: ₹1,894
  Interest: ₹1,321
  Total: ₹3,215
  Balance: ₹1,46,229

Month 3 (Mar 5):
  Principal: ₹1,911
  Interest: ₹1,304
  Total: ₹3,215
  Balance: ₹1,44,318
```

---

## ✅ Validation Checklist

- [ ] All amortization calculations verified
- [ ] Payment status updates work correctly
- [ ] Health score calculation accurate
- [ ] Early repayment scenarios tested
- [ ] UI displays data correctly
- [ ] Responsive on mobile/tablet
- [ ] Error handling for edge cases
- [ ] No TypeScript errors

---

## 🚀 Next Phase (2B - Future)

1. Notification system for payment reminders
2. Bank integration for auto-sync
3. Loan comparison dashboard
4. Tax deduction calculator
5. Refinancing analyzer

---

## Notes

- All calculations use standard EMI formula
- Skip penalty is configurable (currently 0, user can add)
- Health score updates after each payment action
- Amortization schedule generated once at loan creation
- All dates in YYYY-MM-DD format for consistency
