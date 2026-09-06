-- Create loan_payments table
CREATE TABLE IF NOT EXISTS loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loan_payments_user_id ON loan_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_payments_status ON loan_payments(status);
CREATE INDEX IF NOT EXISTS idx_loan_payments_due_date ON loan_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_loan_payments_payment_month ON loan_payments(payment_month);
CREATE UNIQUE INDEX IF NOT EXISTS idx_loan_payments_unique ON loan_payments(loan_id, payment_number);

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
