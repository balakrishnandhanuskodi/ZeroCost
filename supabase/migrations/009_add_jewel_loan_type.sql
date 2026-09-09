-- Add Jewel Loan to allowed loan types
ALTER TABLE loans DROP CONSTRAINT loans_loan_type_check;
ALTER TABLE loans ADD CONSTRAINT loans_loan_type_check
  CHECK (loan_type IN ('Home', 'Personal', 'Auto', 'Education', 'Jewel Loan', 'Other'));
