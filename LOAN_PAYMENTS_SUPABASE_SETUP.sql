-- Loan Payments Table - Phase 1B Implementation
-- Run this migration in Supabase SQL Editor to set up payment tracking

-- Create loan_payments table
CREATE TABLE IF NOT EXISTS loan_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,

  -- Payment Identification
  payment_number INT NOT NULL,
  payment_month DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Amounts (from amortization)
  principal_amount DECIMAL(12, 2) NOT NULL CHECK (principal_amount >= 0),
  interest_amount DECIMAL(12, 2) NOT NULL CHECK (interest_amount >= 0),
  total_payment DECIMAL(12, 2) NOT NULL CHECK (total_payment >= 0),

  -- Skip Penalty
  skip_penalty DECIMAL(12, 2) DEFAULT 0 CHECK (skip_penalty >= 0),

  -- Payment Status
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'skipped', 'late')) DEFAULT 'pending',
  payment_date TIMESTAMP,

  -- Additional Info
  balance_after_payment DECIMAL(12, 2),
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_loan_payments_user_id ON loan_payments(user_id);
CREATE INDEX idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_status ON loan_payments(status);
CREATE INDEX idx_loan_payments_due_date ON loan_payments(due_date);
CREATE INDEX idx_loan_payments_payment_month ON loan_payments(payment_month);
CREATE UNIQUE INDEX idx_loan_payments_unique ON loan_payments(loan_id, payment_number);

-- Enable RLS
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: SELECT - Users can see their own payments
CREATE POLICY "Users can select their own loan payments"
ON loan_payments
FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: INSERT - Users can create payments for their loans
CREATE POLICY "Users can insert their own loan payments"
ON loan_payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: UPDATE - Users can update their own payments
CREATE POLICY "Users can update their own loan payments"
ON loan_payments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: DELETE - Users can delete their own payments
CREATE POLICY "Users can delete their own loan payments"
ON loan_payments
FOR DELETE
USING (auth.uid() = user_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_loan_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loan_payments_updated_at_trigger
BEFORE UPDATE ON loan_payments
FOR EACH ROW
EXECUTE FUNCTION update_loan_payments_updated_at();

-- Add loan_type and health_score columns to loans table if they don't exist
ALTER TABLE loans
ADD COLUMN IF NOT EXISTS loan_type VARCHAR(50)
  CHECK (loan_type IN ('Home', 'Personal', 'Auto', 'Education', 'Other'))
  DEFAULT 'Personal';

ALTER TABLE loans
ADD COLUMN IF NOT EXISTS health_score INT DEFAULT 75 CHECK (health_score >= 0 AND health_score <= 100);

ALTER TABLE loans
ADD COLUMN IF NOT EXISTS health_score_updated_at TIMESTAMP;

-- Create index on loan_type for filtering
CREATE INDEX IF NOT EXISTS idx_loans_loan_type ON loans(loan_type);
CREATE INDEX IF NOT EXISTS idx_loans_health_score ON loans(health_score);

-- Sample Data for Testing (Optional - uncomment to use)
-- INSERT INTO loan_payments (
--   user_id, loan_id, payment_number, payment_month, due_date,
--   principal_amount, interest_amount, total_payment, balance_after_payment, status
-- ) VALUES (
--   'your-user-id-here',
--   'your-loan-id-here',
--   1,
--   '2026-01-01',
--   '2026-01-05',
--   1877.00,
--   1338.00,
--   3215.00,
--   148123.00,
--   'pending'
-- );
