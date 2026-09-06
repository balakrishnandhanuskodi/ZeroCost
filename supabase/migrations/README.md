# Supabase Migrations

Database schema migrations for ZeroCost Loans Management System.

## Migration Files

- **001_loans.sql** - Core loans table with loan tracking fields (principal, interest rate, tenure, status, health score, etc.)
- **002_loan_payments.sql** - Loan payments table for tracking individual EMI payments and amortization schedule
- **003_user_profiles.sql** - User profiles table storing user information and preferences

## Running Migrations

Execute migrations in Supabase SQL Editor in the order listed above:

1. Copy contents of `001_loans.sql` → Run in Supabase
2. Copy contents of `002_loan_payments.sql` → Run in Supabase  
3. Copy contents of `003_user_profiles.sql` → Run in Supabase

## Table Schemas

### loans
Stores loan records for each user with principal amount, interest rate, tenure, and payment tracking.

**Key Fields:**
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `principal` - Original loan amount
- `current_balance` - Remaining balance
- `interest_rate` - Annual interest rate (decimal - supports 10.65%)
- `tenure` - Loan duration
- `tenure_unit` - 'months' or 'years'
- `emi_amount` - Calculated monthly EMI
- `loan_type` - 'Home', 'Personal', 'Auto', 'Education', 'Other'
- `status` - 'active', 'closed', 'defaulted'
- `health_score` - 0-100 loan health indicator

### loan_payments
Amortization schedule - one record per month showing principal/interest breakdown.

**Key Fields:**
- `id` - UUID primary key
- `loan_id` - References loans table
- `payment_number` - Month sequence (1, 2, 3...)
- `principal_amount` - Principal portion of EMI for this month
- `interest_amount` - Interest portion of EMI for this month
- `total_payment` - Total EMI (principal + interest)
- `status` - 'pending', 'paid', 'skipped', 'late'
- `skip_penalty` - Penalty if payment is skipped
- `balance_after_payment` - Remaining balance after this payment

### user_profiles
User profile information linked to auth.users.

**Key Fields:**
- `id` - UUID (foreign key to auth.users)
- `email` - Unique email address
- `name` - Full name
- `preferences` - JSON preferences (currency, darkMode, language, riskProfile, notifications)
