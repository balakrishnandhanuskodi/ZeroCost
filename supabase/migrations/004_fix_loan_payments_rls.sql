-- Fix loan_payments RLS policies - drop and recreate to ensure correct setup

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can select their own loan payments" ON loan_payments;
DROP POLICY IF EXISTS "Users can insert their own loan payments" ON loan_payments;
DROP POLICY IF EXISTS "Users can update their own loan payments" ON loan_payments;
DROP POLICY IF EXISTS "Users can delete their own loan payments" ON loan_payments;

-- Recreate RLS policies with explicit checks

-- SELECT policy - Users can see their own payments
CREATE POLICY "Users can view loan payments"
ON loan_payments
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT policy - Users can create payments for their loans
CREATE POLICY "Users can create loan payments"
ON loan_payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE policy - Users can update their own payments
CREATE POLICY "Users can modify loan payments"
ON loan_payments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE policy - Users can delete their own payments
CREATE POLICY "Users can delete loan payments"
ON loan_payments
FOR DELETE
USING (auth.uid() = user_id);

-- Verify policies are in place
-- SELECT * FROM pg_policies WHERE tablename = 'loan_payments';
