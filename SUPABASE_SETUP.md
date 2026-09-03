# Supabase Setup Guide for ZeroCost

This guide walks you through setting up Supabase authentication and database for ZeroCost.

## Step 1: Create a Supabase Project

1. Go to **https://supabase.com**
2. Click **"New Project"**
3. Select your organization (create one if needed)
4. **Project name:** `zerocost` (or your choice)
5. **Database password:** Create a strong password and save it
6. **Region:** Choose closest to your location
7. Click **"Create new project"** (takes 2-3 minutes)

## Step 2: Get Your Credentials

Once project is created:

1. Go to **Settings → API** in the left sidebar
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Key** (public key, safe to expose)

## Step 3: Create Environment File

1. Create `.env.local` in project root:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Replace with YOUR actual values from Step 2

## Step 4: Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

### Create user_profiles table:
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  preferences JSONB DEFAULT '{"currency":"USD","language":"en","notifications":true,"darkMode":false,"riskProfile":"moderate"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Service role can do everything
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### Create loans table (for Phase 1B):
```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lender_name TEXT NOT NULL,
  principal DECIMAL NOT NULL CHECK (principal > 0),
  current_balance DECIMAL NOT NULL CHECK (current_balance >= 0),
  interest_rate DECIMAL NOT NULL CHECK (interest_rate >= 0),
  interest_type TEXT NOT NULL CHECK (interest_type IN ('fixed', 'variable')),
  tenure INTEGER NOT NULL CHECK (tenure > 0),
  tenure_unit TEXT NOT NULL CHECK (tenure_unit IN ('months', 'years')),
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_payment_date INTEGER CHECK (monthly_payment_date BETWEEN 1 AND 31),
  emi_amount DECIMAL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'defaulted')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see own loans
CREATE POLICY "Users can view own loans"
  ON loans FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can insert own loans
CREATE POLICY "Users can create own loans"
  ON loans FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update own loans
CREATE POLICY "Users can update own loans"
  ON loans FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Users can delete own loans
CREATE POLICY "Users can delete own loans"
  ON loans FOR DELETE
  USING (user_id = auth.uid());
```

## Step 5: Test Authentication

1. Save the `.env.local` file
2. Restart dev server: `pnpm run dev`
3. Go to **http://localhost:8443/register**
4. Create a new account
5. You should see it in Supabase: **Authentication → Users**

## Step 6: Verify User Profile Created

1. In Supabase, go to **SQL Editor**
2. Run: `SELECT * FROM user_profiles;`
3. You should see your registered user

## Environment Variables

### Development (.env.local):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Production (Netlify):
1. Go to **Site settings → Build & deploy → Environment**
2. Add these variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Fallback Mode

If Supabase is not configured:
- App uses localStorage (demo mode)
- Demo credentials: `demo@example.com` / `demo123`
- Perfect for testing without backend

## Troubleshooting

### "User not found" error
- Check credentials in `.env.local`
- Ensure user_profiles table exists
- Verify Supabase auth is working

### "CORS error"
- Go to **Settings → API → CORS Configuration**
- Add your Netlify domain: `https://yourdomain.netlify.app`

### "Row level security violation"
- Check RLS policies are set correctly
- Verify user_id matches auth.uid()

### Authentication works locally but not on Netlify
- Verify environment variables are set in Netlify
- Restart the Netlify deployment
- Check Supabase logs: **Logs → Edge Functions**

## Next Steps

1. ✅ Create Supabase project
2. ✅ Get credentials
3. ✅ Set up `.env.local`
4. ✅ Create tables with SQL
5. ✅ Test authentication
6. ⏭️ **Phase 1B: Loan Management** (uses loans table)

## Security Notes

- **Anon Key:** Public, safe in frontend (has limited access)
- **Service Role Key:** Secret, NEVER expose to client
- **RLS Policies:** Enforce data ownership at database level
- **Passwords:** Hashed by Supabase, never stored in plain text

## Support

- Supabase Docs: https://supabase.com/docs
- Auth Guides: https://supabase.com/docs/guides/auth
- Database Guide: https://supabase.com/docs/guides/database

