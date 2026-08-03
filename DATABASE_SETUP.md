# ZeroCost Database Setup

This guide explains how to set up the database schema in Supabase for the ZeroCost application.

## Tables Overview

The database includes the following tables:

- **transactions** - Track income, expenses, and transfers
- **budgets** - Set and monitor spending budgets by category
- **loans** - Manage loan accounts and track remaining balance
- **goals** - Set financial goals and track progress
- **savings** - Track savings accounts and their balances

## Setup Instructions

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `migrations/001_create_tables.sql`
5. Paste it into the SQL editor
6. Click **Run**
7. Verify all tables are created (check the Tables section in the database)

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref gmgvjmpeatmcafmhdwon

# Apply migrations
supabase db push
```

## What Gets Created

### Security

- **Row Level Security (RLS)** is enabled on all tables
- Each user can only view and modify their own data
- Automatic enforcement via policies

### Indexes

Indexes are created on commonly queried fields for better performance:
- User ID lookups
- Date ranges (transactions)
- Categories (transactions, goals)
- Status fields (loans, goals)

## Database Types

TypeScript types are defined in `src/types/database.ts` for full type safety.

## Using the Database

The database service is available in `src/lib/database.ts`:

```typescript
import { db } from '@/lib/database'
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user } = useAuth()

  // Create a transaction
  const transaction = await db.transactions.create(user.id, {
    amount: 100,
    type: 'expense',
    category: 'Food',
    description: 'Lunch',
    date: new Date().toISOString()
  })

  // List all transactions
  const transactions = await db.transactions.list(user.id)

  // Update a transaction
  await db.transactions.update(transaction.id, { amount: 120 })

  // Delete a transaction
  await db.transactions.delete(transaction.id)
}
```

## Testing the Setup

After creating the tables, you can test with a quick query in the SQL Editor:

```sql
SELECT * FROM transactions LIMIT 10;
SELECT * FROM budgets LIMIT 10;
SELECT * FROM loans LIMIT 10;
SELECT * FROM goals LIMIT 10;
SELECT * FROM savings LIMIT 10;
```

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
