-- Add RLS policies for authenticated users on loan_payments table

-- SELECT policy for authenticated users
CREATE POLICY "auth_select_loan_payments"
ON loan_payments
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT policy for authenticated users
CREATE POLICY "auth_insert_loan_payments"
ON loan_payments
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE policy for authenticated users
CREATE POLICY "auth_update_loan_payments"
ON loan_payments
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE policy for authenticated users
CREATE POLICY "auth_delete_loan_payments"
ON loan_payments
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
