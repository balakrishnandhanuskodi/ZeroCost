-- Create loans table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lender_name TEXT NOT NULL,
  principal DECIMAL NOT NULL CHECK (principal > 0),
  current_balance DECIMAL NOT NULL CHECK (current_balance >= 0),
  interest_rate DECIMAL NOT NULL CHECK (interest_rate >= 0),
  interest_type TEXT NOT NULL CHECK (interest_type IN ('fixed', 'variable')),
  tenure INTEGER NOT NULL CHECK (tenure > 0),
  tenure_unit TEXT NOT NULL CHECK (tenure_unit IN ('months', 'years')),
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_payment_date INTEGER CHECK (monthly_payment_date BETWEEN 1 AND 31),
  emi_amount DECIMAL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'defaulted')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see own loans
CREATE POLICY "Users can view own loans"
  ON loans FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can insert own loans
CREATE POLICY "Users can create own loans"
  ON loans FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update own loans
CREATE POLICY "Users can update own loans"
  ON loans FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Users can delete own loans
CREATE POLICY "Users can delete own loans"
  ON loans FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_loans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loans_updated_at_trigger
BEFORE UPDATE ON loans
FOR EACH ROW
EXECUTE FUNCTION update_loans_updated_at();
