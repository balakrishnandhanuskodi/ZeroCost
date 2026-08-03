-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Budgets table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  limit_amount DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  month VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category, month)
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_month ON budgets(month);

-- Loans table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  monthly_payment DECIMAL(15, 2) NOT NULL,
  remaining_amount DECIMAL(15, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid_off')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  deadline DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_deadline ON goals(deadline);

-- Savings table
CREATE TABLE savings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  interest_rate DECIMAL(5, 2) DEFAULT 0,
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('savings', 'fixed', 'recurring')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_savings_user_id ON savings(user_id);
CREATE INDEX idx_savings_account_type ON savings(account_type);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for budgets
CREATE POLICY "Users can view their own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for loans
CREATE POLICY "Users can view their own loans" ON loans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own loans" ON loans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own loans" ON loans
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own loans" ON loans
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for savings
CREATE POLICY "Users can view their own savings" ON savings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own savings" ON savings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own savings" ON savings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own savings" ON savings
  FOR DELETE USING (auth.uid() = user_id);
