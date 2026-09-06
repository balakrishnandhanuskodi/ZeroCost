-- Add emi_amount column to loans table
-- Stores the standard EMI amount entered by user for all 60 payments

ALTER TABLE loans
ADD COLUMN emi_amount numeric(12, 2) DEFAULT 0;

-- Add comment explaining the column
COMMENT ON COLUMN loans.emi_amount IS 'The standard EMI amount entered by user, used for all 60 payments (except first which may use first_emi_amount if different).';
