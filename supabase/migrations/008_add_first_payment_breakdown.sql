-- Add first payment breakdown columns to loans table
-- Captures the official interest and principal from the repayment schedule for Payment 1

ALTER TABLE loans
ADD COLUMN first_payment_interest numeric(12, 2) DEFAULT 0,
ADD COLUMN first_payment_principal numeric(12, 2) DEFAULT 0;

-- Add comments explaining the columns
COMMENT ON COLUMN loans.first_payment_interest IS 'Official interest amount for Payment 1 from the repayment schedule (includes stub period if any).';
COMMENT ON COLUMN loans.first_payment_principal IS 'Official principal amount for Payment 1 from the repayment schedule (calculated as first_emi_amount - first_payment_interest).';
