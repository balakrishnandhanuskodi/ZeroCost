export const user = {
  name: 'Bala',
  avatar: 'BK',
  income: 118540,
  expenses: 79254,
  emis: 46421,
  savings: 620,
  healthScore: 74,
  netWorth: 2847500,
}

export const summaryCards = [
  { label: 'Monthly Income', value: 118540, change: 8.2, trend: 'up', color: '#16a34a', icon: 'TrendingUp' },
  { label: 'Total Expenses', value: 79254, change: -3.1, trend: 'down', color: '#f97316', icon: 'TrendingDown' },
  { label: 'Savings', value: 620, change: -62.4, trend: 'down', color: '#4f46e5', icon: 'PiggyBank' },
  { label: 'EMIs Paid', value: 46421, change: 0, trend: 'neutral', color: '#0ea5e9', icon: 'CreditCard' },
  { label: 'Remaining Balance', value: 38665, change: 5.3, trend: 'up', color: '#8b5cf6', icon: 'Wallet' },
  { label: 'Net Worth', value: 2847500, change: 2.8, trend: 'up', color: '#16a34a', icon: 'BarChart3' },
]

export const budgetCategories = [
  { name: 'Food & Dining', budget: 15000, spent: 13240, icon: '🍽️', color: '#f97316' },
  { name: 'Fuel & Transport', budget: 8000, spent: 6180, icon: '⛽', color: '#0ea5e9' },
  { name: 'Shopping', budget: 10000, spent: 12450, icon: '🛍️', color: '#ec4899' },
  { name: 'Home & Utilities', budget: 12000, spent: 9800, icon: '🏠', color: '#8b5cf6' },
  { name: 'Medical', budget: 5000, spent: 2100, icon: '💊', color: '#22c55e' },
  { name: 'Education', budget: 8000, spent: 7200, icon: '📚', color: '#f59e0b' },
  { name: 'Travel', budget: 5000, spent: 3400, icon: '✈️', color: '#06b6d4' },
  { name: 'Entertainment', budget: 4000, spent: 4850, icon: '🎬', color: '#a855f7' },
]

export const transactions = [
  { id: 1, date: '2026-07-31', category: 'Food & Dining', merchant: 'Swiggy', amount: -842, method: 'UPI', tag: 'food', status: 'completed' },
  { id: 2, date: '2026-07-31', category: 'Income', merchant: 'Employer - TCS', amount: 118540, method: 'NEFT', tag: 'salary', status: 'completed' },
  { id: 3, date: '2026-07-30', category: 'Shopping', merchant: 'Amazon India', amount: -3240, method: 'Credit Card', tag: 'shopping', status: 'completed' },
  { id: 4, date: '2026-07-30', category: 'Fuel', merchant: 'Indian Oil', amount: -2800, method: 'UPI', tag: 'fuel', status: 'completed' },
  { id: 5, date: '2026-07-29', category: 'Medical', merchant: 'Apollo Pharmacy', amount: -1240, method: 'Debit Card', tag: 'health', status: 'completed' },
  { id: 6, date: '2026-07-28', category: 'Loans', merchant: 'ICICI Bank EMI', amount: -28421, method: 'Auto Debit', tag: 'loan', status: 'completed' },
  { id: 7, date: '2026-07-28', category: 'Entertainment', merchant: 'Netflix', amount: -649, method: 'Credit Card', tag: 'subscription', status: 'completed' },
  { id: 8, date: '2026-07-27', category: 'Food & Dining', merchant: 'Zomato', amount: -520, method: 'UPI', tag: 'food', status: 'completed' },
  { id: 9, date: '2026-07-26', category: 'Home', merchant: 'BESCOM Electricity', amount: -2400, method: 'Net Banking', tag: 'utility', status: 'completed' },
  { id: 10, date: '2026-07-25', category: 'Education', merchant: 'Udemy Course', amount: -1999, method: 'Credit Card', tag: 'learning', status: 'completed' },
]

export const loans = [
  {
    id: 1,
    name: 'ICICI Personal Loan',
    bank: 'ICICI Bank',
    bankColor: '#f97316',
    principal: 500000,
    outstanding: 318000,
    interestRate: 14.5,
    emi: 18421,
    remainingMonths: 22,
    totalMonths: 36,
    interestPaid: 82000,
    principalPaid: 182000,
    startDate: '2023-09-01',
    endDate: '2026-08-01',
    type: 'Personal',
  },
  {
    id: 2,
    name: 'HDFC Home Loan',
    bank: 'HDFC Bank',
    bankColor: '#1d4ed8',
    principal: 4500000,
    outstanding: 3980000,
    interestRate: 8.75,
    emi: 28000,
    remainingMonths: 228,
    totalMonths: 240,
    interestPaid: 186000,
    principalPaid: 520000,
    startDate: '2025-04-01',
    endDate: '2045-03-01',
    type: 'Home',
  },
]

export const goals = [
  { id: 1, name: 'Emergency Fund', target: 350000, current: 210000, icon: '🛡️', color: '#16a34a', deadline: '2026-12-31' },
  { id: 2, name: 'New Car', target: 1200000, current: 340000, icon: '🚗', color: '#0ea5e9', deadline: '2027-06-30' },
  { id: 3, name: 'Europe Vacation', target: 250000, current: 87000, icon: '✈️', color: '#a855f7', deadline: '2027-03-15' },
  { id: 4, name: 'House Down Payment', target: 2500000, current: 890000, icon: '🏠', color: '#f97316', deadline: '2029-01-01' },
  { id: 5, name: 'Retirement Corpus', target: 30000000, current: 1240000, icon: '🌅', color: '#f59e0b', deadline: '2055-01-01' },
]

export const savings = [
  { name: 'Emergency Fund', value: 210000, color: '#16a34a', icon: '🛡️' },
  { name: 'Fixed Deposits', value: 800000, color: '#0ea5e9', icon: '🏦' },
  { name: 'Mutual Funds', value: 580000, color: '#4f46e5', icon: '📈' },
  { name: 'Gold', value: 240000, color: '#f59e0b', icon: '🥇' },
  { name: 'Stocks', value: 320000, color: '#ec4899', icon: '📊' },
  { name: 'PF / EPF', value: 445000, color: '#8b5cf6', icon: '💼' },
  { name: 'NPS', value: 180000, color: '#06b6d4', icon: '🏛️' },
  { name: 'Monthly SIP', value: 12000, color: '#f97316', icon: '🔄' },
]

export const spendingTrend = [
  { month: 'Feb', income: 110000, expenses: 72000 },
  { month: 'Mar', income: 112000, expenses: 81000 },
  { month: 'Apr', income: 110000, expenses: 68000 },
  { month: 'May', income: 118000, expenses: 74000 },
  { month: 'Jun', income: 118540, expenses: 82000 },
  { month: 'Jul', income: 118540, expenses: 79254 },
]

export const categoryPie = [
  { name: 'Food', value: 13240, color: '#f97316' },
  { name: 'Shopping', value: 12450, color: '#ec4899' },
  { name: 'Home', value: 9800, color: '#8b5cf6' },
  { name: 'Transport', value: 6180, color: '#0ea5e9' },
  { name: 'Education', value: 7200, color: '#f59e0b' },
  { name: 'Medical', value: 2100, color: '#22c55e' },
  { name: 'Travel', value: 3400, color: '#06b6d4' },
  { name: 'Others', value: 4850, color: '#a855f7' },
]

export const healthBreakdown = [
  { label: 'Budget Discipline', score: 68, max: 20, color: '#f97316' },
  { label: 'Savings Rate', score: 45, max: 20, color: '#16a34a' },
  { label: 'Debt Management', score: 62, max: 20, color: '#4f46e5' },
  { label: 'Investments', score: 80, max: 20, color: '#0ea5e9' },
  { label: 'Emergency Fund', score: 60, max: 20, color: '#f59e0b' },
]

export const notifications = [
  { id: 1, type: 'warning', title: 'EMI Due Tomorrow', body: 'ICICI Personal Loan EMI of ₹18,421 is due tomorrow.', time: '2h ago', read: false },
  { id: 2, type: 'danger', title: 'Budget Exceeded', body: 'Shopping budget exceeded by ₹2,450 (124% used).', time: '5h ago', read: false },
  { id: 3, type: 'info', title: 'Salary Received', body: '₹1,18,540 credited from TCS. Great month ahead!', time: '1d ago', read: true },
  { id: 4, type: 'warning', title: 'Insurance Renewal', body: 'Your health insurance renews in 15 days.', time: '2d ago', read: true },
  { id: 5, type: 'info', title: 'Credit Card Due', body: 'HDFC Credit Card bill of ₹24,380 due in 5 days.', time: '3d ago', read: true },
]

export const aiMessages: Array<{ role: 'user' | 'assistant'; content: string; time: string }> = [
  {
    role: 'assistant',
    content: "Good morning, Bala! 👋 I've analyzed your finances for August 2026. Your health score is 74/100 — solid but there's room to optimize. What would you like to explore?",
    time: '09:00 AM',
  },
]

export const aiSuggestions = [
  'Can I buy a car?',
  'How do I become debt-free faster?',
  'Where am I overspending?',
  'Should I close my ICICI loan first?',
  'Can I afford a Europe vacation?',
]

export const formatCurrency = (value: number, compact = false): string => {
  if (compact && Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`
  }
  if (compact && Math.abs(value) >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`
  }
  return `₹${Math.abs(value).toLocaleString('en-IN')}`
}
