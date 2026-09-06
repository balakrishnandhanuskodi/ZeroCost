-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  loan_amount NUMERIC(15, 2) NOT NULL CHECK (loan_amount > 0),
  interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate >= 0),
  loan_term INTEGER NOT NULL CHECK (loan_term > 0),
  loan_type TEXT NOT NULL DEFAULT 'home',
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS loans_user_id_idx ON loans(user_id);
CREATE INDEX IF NOT EXISTS loans_created_at_idx ON loans(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can only view their own loans
CREATE POLICY "Users can view their own loans"
  ON loans FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: users can insert their own loans
CREATE POLICY "Users can insert their own loans"
  ON loans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: users can update their own loans
CREATE POLICY "Users can update their own loans"
  ON loans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: users can delete their own loans
CREATE POLICY "Users can delete their own loans"
  ON loans FOR DELETE
  USING (auth.uid() = user_id);

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

-- Grant permissions (optional, if needed)
GRANT ALL ON loans TO authenticated;
