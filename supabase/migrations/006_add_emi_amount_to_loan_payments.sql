-- Add emi_amount column to loan_payments table
-- This stores the actual EMI amount for each payment (separate from total_payment which includes interest)

ALTER TABLE loan_payments
ADD COLUMN emi_amount numeric(12, 2) DEFAULT 0;

-- Add comment explaining the column
COMMENT ON COLUMN loan_payments.emi_amount IS 'The base EMI amount for this payment period. First EMI may differ from standard EMI if there is a stub period.';
