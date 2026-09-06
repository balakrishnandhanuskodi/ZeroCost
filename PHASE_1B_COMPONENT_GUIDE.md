# Phase 1B Component Reference Guide

## Quick Start

All components are pre-built and ready to use. Just import and place in your pages.

---

## Layout Components

### Layout Wrapper (Full Page)

```tsx
import Layout from './components/Layout'

// Automatically wraps pages with Sidebar + Header + Bottom Nav
// Usage in ProtectedRoute is automatic
export default function MyPage() {
  return (
    <div className="p-6">
      {/* Your page content - Layout provides sidebar + nav */}
    </div>
  )
}
```

**Features:**
- ✅ Desktop sidebar with navigation
- ✅ Mobile bottom navigation
- ✅ Automatic route tracking
- ✅ Logout button in header
- ✅ Notifications integration

---

## Page Header Pattern

```tsx
// Loans Page Header Example
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="font-display font-700 text-xl md:text-2xl text-[var(--foreground)]">
      Loan Management
    </h1>
    <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
      {loans.length} active loans
    </p>
  </div>
  <div className="text-right">
    <div className="font-display font-700 text-lg text-[var(--foreground)]">
      ₹12,50,000
    </div>
    <div className="text-xs text-[var(--muted-foreground)]">
      Total Outstanding
    </div>
  </div>
</div>
```

---

## Summary Card Grid Pattern

```tsx
{/* Summary stat cards - 3 columns on desktop, 1 on mobile */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
  {/* Success card - green */}
  <div className="bg-[var(--success-soft)] rounded-2xl p-4 border border-[var(--success)]">
    <div className="font-display font-700 text-xl text-[var(--success)]">
      ₹1,50,000
    </div>
    <div className="text-xs text-[var(--success)] mt-0.5">
      Monthly EMI
    </div>
  </div>

  {/* Warning card - amber */}
  <div className="bg-[var(--warning-soft)] rounded-2xl p-4 border border-[var(--warning)]">
    <div className="font-display font-700 text-xl text-[var(--warning)]">
      ₹12,50,000
    </div>
    <div className="text-xs text-[var(--warning)] mt-0.5">
      Outstanding
    </div>
  </div>

  {/* Info card - blue */}
  <div className="bg-[var(--primary-soft)] rounded-2xl p-4 border border-[var(--primary)]">
    <div className="font-display font-700 text-xl text-[var(--primary)]">
      ₹5,00,000
    </div>
    <div className="text-xs text-[var(--primary)] mt-0.5">
      Principal Paid
    </div>
  </div>
</div>
```

---

## Card Grid Pattern

```tsx
{/* Loan cards - 2 columns desktop, 1 mobile, with hover effect */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {loans.map(loan => (
    <div
      key={loan.id}
      className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
      onClick={() => handleSelectLoan(loan)}
    >
      {/* Card content */}
    </div>
  ))}
</div>
```

---

## Modal/Dialog Pattern

```tsx
{/* Mobile bottom drawer / Desktop centered modal */}
{selectedLoan && (
  <div 
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
    onClick={handleClose}
  >
    <div
      className="bg-[var(--card)] rounded-t-3xl md:rounded-2xl w-full md:w-[700px] max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-fade-in"
      onClick={e => e.stopPropagation()}
    >
      {/* Content */}
    </div>
  </div>
)}
```

---

## Status Badge Pattern

```tsx
{/* Status badges using semantic colors */}

{/* Success badge */}
<span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--success-soft)] text-[var(--success)]">
  Active
</span>

{/* Warning badge */}
<span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--warning-soft)] text-[var(--warning)]">
  High Interest
</span>

{/* Danger badge */}
<span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
  Overdue
</span>

{/* Info badge */}
<span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--info-soft)] text-[var(--info)]">
  Refinance Available
</span>
```

---

## Progress Indicator Pattern

```tsx
{/* Progress bar with label */}
<div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
  <div className="flex items-center justify-between text-sm mb-2">
    <span className="font-medium text-[var(--foreground)]">Repayment Progress</span>
    <span className="font-bold text-[var(--success)]">65% complete</span>
  </div>
  
  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
    <div 
      className="h-full rounded-full bg-[var(--success)] transition-all duration-1000"
      style={{ width: '65%' }}
    />
  </div>
  
  <div className="flex justify-between text-xs mt-1.5 text-[var(--muted-foreground)]">
    <span>Paid: ₹5,00,000</span>
    <span>Remaining: ₹2,70,000</span>
  </div>
</div>
```

---

## Chart Container Pattern

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

<div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
  <h3 className="font-semibold text-sm text-[var(--foreground)] mb-3">
    Principal vs Interest
  </h3>
  
  <ResponsiveContainer width="100%" height={160}>
    <BarChart data={chartData} barCategoryGap="25%">
      <XAxis 
        dataKey="month" 
        tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis 
        tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
      <Bar dataKey="Principal" fill="var(--success)" radius={[3, 3, 0, 0]} stackId="a" />
      <Bar dataKey="Interest" fill="var(--warning)" radius={[3, 3, 0, 0]} stackId="a" />
    </BarChart>
  </ResponsiveContainer>
</div>
```

---

## AI Advisor Card Pattern

```tsx
{/* Gradient background advisory card */}
<div 
  className="rounded-2xl p-5 border border-[var(--border)]"
  style={{ background: 'linear-gradient(135deg, var(--success-soft) 0%, var(--primary-soft) 100%)' }}
>
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--success)] to-[var(--primary)] flex items-center justify-center flex-shrink-0">
      <span className="text-white text-sm">✨</span>
    </div>
    
    <div>
      <div className="text-xs font-semibold text-[var(--success)] bg-[var(--success-soft)] px-2 py-0.5 rounded-full inline-block mb-1.5">
        AI Loan Advisor
      </div>
      
      <p className="text-sm text-[var(--foreground)] leading-relaxed">
        Pay <strong>₹50,000</strong> extra towards this loan. You will save 
        <strong>₹1,42,500</strong> in interest and close the loan 
        <strong>18 months earlier.</strong>
      </p>
      
      <div className="flex gap-3 mt-3">
        <div className="text-center">
          <div className="text-sm font-bold text-[var(--success)]">₹1.42L</div>
          <div className="text-[10px] text-[var(--muted-foreground)]">Saved</div>
        </div>
        <div className="w-px h-8 bg-[var(--border)]" />
        <div className="text-center">
          <div className="text-sm font-bold text-[var(--primary)]">18 mo</div>
          <div className="text-[10px] text-[var(--muted-foreground)]">Earlier</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Form Input Pattern

```tsx
import Input from './components/UI/Input'

<div className="space-y-4">
  <Input 
    label="Loan Amount"
    type="number"
    placeholder="₹0"
    required
  />
  
  <Input 
    label="Interest Rate (%)"
    type="number"
    placeholder="7.5"
    step="0.1"
  />
  
  <Input 
    label="Loan Period (Months)"
    type="number"
    placeholder="60"
  />
</div>
```

---

## Button Patterns

```tsx
import Button from './components/UI/Button'

{/* Primary action - blue */}
<Button variant="primary">Add Loan</Button>

{/* Secondary action - outlined */}
<Button variant="secondary">Edit</Button>

{/* Outline - subtle */}
<Button variant="outline">Cancel</Button>

{/* In a button group */}
<div className="flex gap-2 mt-6">
  <Button variant="outline" className="flex-1">Cancel</Button>
  <Button variant="primary" className="flex-1">Save</Button>
</div>
```

---

## Typography Reference

```tsx
{/* Display/Large headings - use font-display class */}
<h1 className="font-display font-700 text-2xl text-[var(--foreground)]">
  Main Title
</h1>

{/* Subheading */}
<h2 className="font-display font-700 text-lg text-[var(--foreground)]">
  Section Title
</h2>

{/* Regular body text */}
<p className="text-sm text-[var(--muted-foreground)]">
  Secondary information
</p>

{/* Emphasized text */}
<span className="font-semibold text-[var(--foreground)]">Important</span>

{/* Small text */}
<small className="text-xs text-[var(--light)]">Caption</small>
```

---

## Spacing Reference

```tsx
{/* Margin bottom utilities */}
<div className="mb-6">Large spacing</div>
<div className="mb-4">Medium spacing</div>
<div className="mb-2">Small spacing</div>

{/* Padding utilities */}
<div className="p-6">Large padding (all sides)</div>
<div className="px-4 py-2">Horizontal & vertical padding</div>
<div className="pt-4 pb-6">Top & bottom specific</div>

{/* Gap between items */}
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## Responsive Classes

```tsx
{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">
  Desktop only content
</div>

{/* Show on mobile, hide on desktop */}
<div className="md:hidden">
  Mobile only content
</div>

{/* Responsive sizing */}
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

{/* Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item</div>
</div>
```

---

## Color Usage Examples

```tsx
{/* Using CSS variables */}

{/* Primary action */}
<button style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
  Primary
</button>

{/* Success state */}
<div className="text-[var(--success)]">✓ Completed</div>

{/* Warning state */}
<div className="text-[var(--warning)]">⚠ High Interest Rate</div>

{/* Danger state */}
<div className="text-[var(--danger)]">✗ Overdue</div>

{/* Soft backgrounds */}
<div className="bg-[var(--success-soft)] text-[var(--success)]">
  Success message
</div>
```

---

## Dark Mode Support

The app automatically detects and applies dark theme based on `data-theme="dark"` attribute.

No component changes needed - all CSS variables automatically adapt:

```tsx
// Users will see:
// - Light theme by default
// - Dark theme if their system prefers it
// - Manual toggle option (future feature)
```

---

## Common Patterns Summary

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Summary Cards** | KPI overview at top of page | Total EMI, Outstanding, Paid |
| **Card Grid** | List of items with actions | Loan cards with click-to-view |
| **Modal Dialog** | Detailed view or forms | Loan details, add loan form |
| **Status Badge** | Quick status indication | Active, Overdue, Closed |
| **Progress Bar** | Visual progress tracking | Loan repayment progress |
| **Chart Container** | Data visualization | Principal vs Interest |
| **AI Advisory** | Recommendations/tips | Interest savings suggestions |
| **Form Inputs** | Data entry | Loan creation form |
| **Buttons** | Actions | Save, Cancel, Delete |

---

## File Structure

```
src/
├── components/
│   ├── Layout.tsx              ← Main layout wrapper
│   ├── Sidebar.tsx             ← Desktop navigation
│   ├── BottomNav.tsx           ← Mobile navigation
│   ├── ProtectedRoute.tsx      ← Auto-wraps with Layout
│   └── UI/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Alert.tsx
├── pages/
│   ├── Loans.tsx               ← Complete UI demo
│   ├── Dashboard.tsx
│   └── [other pages]/
├── context/
│   └── AuthContext.tsx
├── index.css                   ← Design tokens (Adminator)
└── main.tsx
```

---

## Next Implementation Tasks

1. **Loan Form Component** - Create reusable form for add/edit
2. **Form Validation** - Client-side validation for loan inputs
3. **Search & Filter** - Filter loans by bank, status, date
4. **CRUD Operations** - Connect to Supabase database
5. **EMI Calculator** - Interactive calculation tool
6. **Amortization Table** - Payment schedule breakdown

---

*Last Updated: 2026-09-06*
