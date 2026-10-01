-- Create expenses table for daily expense tracking
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'Food', 'Shopping', 'Travel', 'Petrol Expense', 'Fuel',
    'Bills', 'Sports', 'Temple Pooja', 'Travel Expense',
    'Transfer', 'Moi', 'Cycle', 'Others'
  )),
  description TEXT NOT NULL,
  amount DECIMAL NOT NULL CHECK (amount > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own expenses
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can create own expenses
CREATE POLICY "Users can create own expenses"
  ON expenses FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update own expenses
CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Users can delete own expenses
CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $update_expenses_updated_at$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$update_expenses_updated_at$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at_trigger
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_expenses_updated_at();
