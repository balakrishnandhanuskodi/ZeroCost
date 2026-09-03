# ZeroCost App - Phased Implementation Plan

## Overview
ZeroCost is a comprehensive financial management platform built with React + Vite + Tailwind CSS. The app helps users manage loans, transactions, budgets, and financial goals with AI-powered insights.

---

## Phase 1: Core Financial Intelligence (Loans & Interest)
**Timeline:** Weeks 1-3  
**Focus:** Authentication, user profiles, and loan management with intelligent calculations

### Phase 1A: Authentication & User Management
#### Components to Build:
- `LoginPage` - Email/password login with validation
- `RegisterPage` - New user registration flow
- `ForgotPasswordPage` - Password recovery
- `UserProfilePage` - User profile management (name, email, phone)
- `OnboardingFlow` - First-time user setup (financial goals, risk profile)

#### Features:
- Email & password authentication
- Session management (JWT tokens / local storage)
- User profile data storage
- Password validation & security requirements
- Email verification (if using backend)

#### Data Structures:
```typescript
interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  createdAt: Date
  preferences: UserPreferences
}

interface UserPreferences {
  currency: 'USD' | 'EUR' | 'INR' | 'GBP'
  language: string
  notifications: boolean
  darkMode: boolean
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
}
```

#### Files to Create:
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/pages/UserProfile.tsx`
- `src/pages/Onboarding.tsx`
- `src/components/AuthForm.tsx`
- `src/context/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/types/auth.ts`

---

### Phase 1B: Loan Management & Interest Calculation
#### Core Features:
1. **Add Loan** - Create new loans with:
   - Loan amount
   - Interest rate (fixed/variable)
   - Loan tenure (months/years)
   - Start date
   - Monthly payment date
   - Lender/bank name

2. **Loan Dashboard** - Display all loans with:
   - Total outstanding balance
   - Next payment date & amount
   - Interest paid vs. principal
   - Time to payoff
   - Multiple loan comparison

3. **Interest Calculations:**
   - Simple Interest: `SI = (P × R × T) / 100`
   - Compound Interest: `CI = P(1 + r/n)^(nt) - P`
   - EMI (Equated Monthly Installment): `EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]`
   - Amortization schedule generation
   - Prepayment scenarios

4. **Loan Intelligence Parcels:**
   - Interest paid to date vs. remaining
   - Payoff timeline projections
   - Opportunity cost analysis
   - Refinancing recommendations
   - Consolidation opportunities (multiple loans)
   - Early repayment benefit calculator

#### Data Structures:
```typescript
interface Loan {
  id: string
  userId: string
  lenderName: string
  principal: number
  currentBalance: number
  interestRate: number
  interestType: 'fixed' | 'variable'
  tenure: number
  tenureUnit: 'months' | 'years'
  startDate: Date
  endDate: Date
  monthlyPaymentDate: number
  emiAmount: number
  status: 'active' | 'closed' | 'defaulted'
  payments: LoanPayment[]
  notes?: string
}

interface LoanPayment {
  id: string
  loanId: string
  date: Date
  principal: number
  interest: number
  totalAmount: number
  type: 'scheduled' | 'prepayment'
}

interface LoanIntelligence {
  totalInterestPaid: number
  remainingInterest: number
  principalPaid: number
  principalRemaining: number
  payoffDate: Date
  payoffInMonths: number
  monthsElapsed: number
  interestPaidPercentage: number
  prepaymentBenefit: number // Interest saved if paid off early
}
```

#### Components to Build:
- `src/pages/Loans.tsx` (enhanced)
- `src/components/LoanForm.tsx`
- `src/components/LoanCard.tsx`
- `src/components/InterestCalculator.tsx`
- `src/components/AmortizationSchedule.tsx`
- `src/components/LoanComparison.tsx`
- `src/components/LoanIntelligence.tsx`

#### Files to Create:
- `src/utils/loanCalculations.ts` - All loan calculation formulas
- `src/utils/interestCalculations.ts` - Interest rate calculations
- `src/hooks/useLoanIntelligence.ts`
- `src/types/loans.ts`
- `src/data/loanMockData.ts`

---

## Phase 2: Transaction Management & Credit Cards
**Timeline:** Weeks 4-6  
**Focus:** Transaction tracking and credit card management

### Phase 2A: Transaction Management
#### Features:
1. **Add Transactions** - Record income/expenses with:
   - Amount, date, category
   - Payment method (cash, card, online transfer)
   - Description/notes
   - Receipt attachment

2. **Transaction Categories:**
   - Food & Dining
   - Shopping
   - Transportation
   - Entertainment
   - Utilities
   - Healthcare
   - Education
   - Other (custom)

3. **Transaction History:**
   - Searchable transaction list
   - Filter by date range, category, amount
   - Recurring transactions (subscriptions)
   - Bulk categorization

#### Data Structures:
```typescript
interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: Date
  paymentMethod: 'cash' | 'card' | 'online' | 'check'
  tags: string[]
  receipt?: string
  createdAt: Date
}
```

### Phase 2B: Credit Card Management
#### Features:
1. **Add Credit Cards:**
   - Card details (last 4 digits, issuer, credit limit)
   - Billing cycle dates
   - Due dates
   - Interest rate (APR)
   - Rewards program info

2. **Credit Card Dashboard:**
   - Total credit limit across cards
   - Current balance
   - Credit utilization ratio
   - Available credit
   - Statement preview

3. **Credit Card Intelligence:**
   - Due date reminders
   - Minimum payment alerts
   - Interest calculation (if balance carried)
   - Rewards tracking
   - Payment recommendations
   - Fraud detection alerts

#### Data Structures:
```typescript
interface CreditCard {
  id: string
  userId: string
  cardIssuer: string
  lastFourDigits: string
  creditLimit: number
  currentBalance: number
  apr: number
  billingCycleStart: number
  billingCycleEnd: number
  dueDate: number
  rewardType: 'cash-back' | 'points' | 'miles' | 'none'
  rewardRate: number
  isActive: boolean
}

interface CreditCardStatement {
  id: string
  cardId: string
  statementDate: Date
  dueDate: Date
  previousBalance: number
  payments: number
  charges: number
  currentBalance: number
  minimumPayment: number
  interestCharged: number
}
```

#### Components to Build:
- `src/pages/Transactions.tsx` (enhanced)
- `src/pages/CreditCards.tsx` (new)
- `src/components/TransactionForm.tsx`
- `src/components/TransactionList.tsx`
- `src/components/TransactionFilter.tsx`
- `src/components/CreditCardForm.tsx`
- `src/components/CreditCardCard.tsx`
- `src/components/CreditCardIntelligence.tsx`

#### Files to Create:
- `src/types/transactions.ts`
- `src/types/creditCards.ts`
- `src/utils/transactionUtils.ts`
- `src/utils/creditCardCalculations.ts`
- `src/data/transactionMockData.ts`

---

## Phase 3: Budget Planning & Financial Goals
**Timeline:** Weeks 7-8

### Phase 3A: Budget Management
- Create budget categories
- Set spending limits
- Track vs. actual spending
- Budget alerts & notifications
- Budget performance analytics

### Phase 3B: Financial Goals
- Create savings goals
- Track progress toward goals
- Goal-based recommendations
- Milestone tracking

#### Components:
- Enhanced `src/pages/Budget.tsx`
- Enhanced `src/pages/Goals.tsx`
- `src/components/BudgetForm.tsx`
- `src/components/GoalTracker.tsx`

---

## Phase 4: Reports, Analytics & AI Insights
**Timeline:** Weeks 9-10

### Phase 4A: Reporting & Analytics
- Income vs. Expense analysis
- Category-wise spending breakdown
- Monthly/yearly trend analysis
- Comparison reports (month-over-month, year-over-year)
- Export functionality (PDF, CSV)

### Phase 4B: AI Coach Integration
- Smart recommendations based on spending patterns
- Savings opportunities identification
- Debt repayment strategies
- Investment suggestions
- Personalized financial advice

#### Components:
- Enhanced `src/pages/Reports.tsx`
- Enhanced `src/pages/AICoach.tsx`
- `src/components/AnalyticsChart.tsx`
- `src/components/InsightCard.tsx`

---

## Technical Architecture

### State Management:
- React Context API for global state (auth, user, settings)
- Local component state for UI interactions
- Consider Redux/Zustand for complex state if needed

### Storage:
- **Frontend:** LocalStorage for cached data, SessionStorage for temporary data
- **Backend:** Database for permanent storage (if implementing backend)
- Mock data structure for development

### Key Hooks to Create:
```
src/hooks/
├── useAuth.ts
├── useLoans.ts
├── useTransactions.ts
├── useCreditCards.ts
├── useBudget.ts
├── useGoals.ts
├── useFinancialIntelligence.ts
└── useNotifications.ts
```

### Context Structure:
```
src/context/
├── AuthContext.tsx
├── FinanceContext.tsx
├── NotificationContext.tsx
└── UserPreferencesContext.tsx
```

### Utility Modules:
```
src/utils/
├── calculations/
│   ├── loanCalculations.ts
│   ├── interestCalculations.ts
│   ├── budgetCalculations.ts
│   └── creditCardCalculations.ts
├── formatters.ts (currency, dates, numbers)
├── validators.ts
├── storage.ts (localStorage helpers)
└── api.ts (backend API calls - future)
```

---

## Development Priorities for Phase 1

1. **Week 1:** Authentication & User Profile
2. **Week 2:** Loan Management CRUD
3. **Week 3:** Interest Calculations & Intelligence

### Deliverables:
- [ ] User can register & login
- [ ] User can create loan records
- [ ] Loan calculator shows accurate EMI & interest
- [ ] Dashboard displays loan summary
- [ ] All calculations validated with test cases

---

## Database Schema (When Backend is Ready)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  passwordHash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  avatar VARCHAR,
  currency VARCHAR DEFAULT 'USD',
  darkMode BOOLEAN DEFAULT false,
  riskProfile VARCHAR,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Loans Table
```sql
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  lenderName VARCHAR NOT NULL,
  principal DECIMAL NOT NULL,
  currentBalance DECIMAL NOT NULL,
  interestRate DECIMAL NOT NULL,
  interestType VARCHAR,
  tenure INT NOT NULL,
  tenureUnit VARCHAR,
  startDate DATE,
  endDate DATE,
  monthlyPaymentDate INT,
  emiAmount DECIMAL,
  status VARCHAR,
  createdAt TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  amount DECIMAL NOT NULL,
  type VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description VARCHAR,
  date DATE NOT NULL,
  paymentMethod VARCHAR,
  createdAt TIMESTAMP
);
```

### Credit Cards Table
```sql
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  cardIssuer VARCHAR NOT NULL,
  lastFourDigits VARCHAR NOT NULL,
  creditLimit DECIMAL NOT NULL,
  currentBalance DECIMAL NOT NULL,
  apr DECIMAL,
  billingCycleStart INT,
  billingCycleEnd INT,
  dueDate INT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP
);
```

---

## Testing Strategy

- Unit tests for calculation functions
- Component tests with React Testing Library
- E2E tests for critical user flows
- Test cases for different edge cases (0% interest, prepayment, etc.)

---

## Success Metrics

**Phase 1:**
- User onboarding completion rate > 80%
- Loan calculation accuracy to 2 decimal places
- < 2 second load time for loan dashboard

**Phase 2:**
- Transaction categorization accuracy > 95%
- Credit card data sync within 1 minute

**Phase 3 & 4:**
- Report generation < 3 seconds
- AI recommendations relevance > 80%

---

## Notes

- All calculations should handle edge cases (0% interest, very large loans, micro-transactions)
- UI/UX should be intuitive for users unfamiliar with finance
- All monetary values to be stored as integers (cents) to avoid floating-point errors
- Implement proper error handling and user feedback
- Consider accessibility (WCAG 2.1 AA)
- Plan for mobile responsiveness from Day 1
