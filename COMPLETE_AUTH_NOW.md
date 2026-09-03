# Complete Authentication in 5 Minutes ⚡

Your Supabase project is already created! Now let's finish setup.

## Step 1: Get Your Credentials (2 min)

In your Supabase dashboard:

1. Click **Settings** (bottom left) → **API**
2. You'll see:
   - **Project URL** (copy this)
   - **Anon Key** (public key - copy this)

Example:
```
Project URL: https://gmgvjmpeatmcafmhdwon.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Create `.env.local` (1 min)

In your project root (`/home/user/ZeroCost/`), create a file named `.env.local`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Replace with YOUR actual values!**

## Step 3: Create Database Tables (2 min)

In Supabase, go to **SQL Editor** and run this:

### Step 3A: User Profiles Table
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

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles 
  FOR UPDATE USING (auth.uid() = id);
```

### Step 3B: Loans Table (for Phase 1B)
```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lender_name TEXT NOT NULL,
  principal DECIMAL NOT NULL,
  current_balance DECIMAL NOT NULL,
  interest_rate DECIMAL NOT NULL,
  interest_type TEXT NOT NULL,
  tenure INTEGER NOT NULL,
  tenure_unit TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_payment_date INTEGER,
  emi_amount DECIMAL,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_loans_user_id ON loans(user_id);
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loans" ON loans 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own loans" ON loans 
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own loans" ON loans 
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own loans" ON loans 
  FOR DELETE USING (user_id = auth.uid());
```

---

## Step 4: Test It! (Optional)

1. **Restart dev server:**
   ```bash
   pnpm run dev
   ```

2. **Register new account:**
   - Go to http://localhost:8443/register
   - Fill in the form
   - Click "Create Account"
   - You should see the Dashboard

3. **Verify in Supabase:**
   - Go to **Authentication → Users** (should see your user)
   - Go to **Table Editor → user_profiles** (should see profile)

---

## Step 5: Deploy to Netlify (2 min)

1. **Add environment variables in Netlify:**
   - Go to Site settings → Build & deploy → Environment
   - Add:
     - `VITE_SUPABASE_URL=...`
     - `VITE_SUPABASE_ANON_KEY=...`

2. **Trigger deployment:**
   - Push to GitHub (or redeploy in Netlify)
   - Wait for build to complete
   - Test at https://zerocostindia.netlify.app/register

---

## ✅ Done!

Once you complete these steps, you'll have:
- ✅ Cloud authentication working
- ✅ User profiles stored
- ✅ Ready for Phase 1B (Loan Management)

---

## 🆘 Troubleshooting

**"VITE_SUPABASE_URL is undefined"**
- Ensure `.env.local` is in project root
- Restart dev server
- Check spelling exactly

**"User not found" error**
- User_profiles table not created
- Run the SQL from Step 3A

**Works locally but not on Netlify**
- Add env vars to Netlify settings
- Redeploy site

---

That's it! You're done with authentication! 🎉

Next: **Phase 1B - Loan Management** 🏦

