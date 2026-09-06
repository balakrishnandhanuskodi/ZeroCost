# Phase 1B: Loan Management UI Base

## Overview

Phase 1B UI base establishes the complete visual framework and layout structure for the Loan Management module. This foundation uses the **Adminator admin dashboard** design system as the design authority, adapted for ZeroCost's financial app context.

**Status:** ✅ UI Framework Ready | Ready for Feature Implementation

---

## Design System: Adminator Integration

### Design Tokens (CSS Variables)

All colors, spacing, typography, and effects are defined as CSS variables in `src/index.css`:

#### Light Theme (Default)
```css
:root[data-theme="light"] {
  /* Surfaces */
  --background: #F0F4F8;      /* Page background */
  --card: #FFFFFF;             /* Card/panel background */
  --hover: #F8FAFC;            /* Hover state */
  --muted: #F1F5F9;            /* Secondary background */

  /* Text */
  --foreground: #1E293B;       /* Primary text */
  --muted-foreground: #64748B; /* Secondary text */

  /* Colors */
  --primary: #2563EB;          /* Brand blue */
  --success: #10B981;          /* Green (positive) */
  --warning: #F59E0B;          /* Amber (caution) */
  --danger: #EF4444;           /* Red (alert) */
  --info: #0EA5E9;             /* Sky blue (info) */

  /* Borders & Shadows */
  --border: #E4E8EF;
  --shadow-card: 0 1px 3px 0 rgb(15 23 42 / 0.06);
}
```

#### Dark Theme
Identical structure with adjusted values for optimal contrast.

---

## Layout Structure

### Desktop Layout (248px sidebar + content)

```
┌─────────────────────────────────────────┐
│ SIDEBAR (248px fixed)  │ MAIN CONTENT   │
├─────────────────────────┼────────────────┤
│                         │   HEADER       │
│                         ├────────────────┤
│   Navigation            │                │
│   - Dashboard           │   PAGE         │
│   - Transactions        │   CONTENT      │
│   - Budget              │   (scroll)     │
│   - Loans ⭐            │                │
│   - Goals               │                │
│   - Savings             ├────────────────┤
│   - Reports             │ (Mobile: Bottom│
│   - AI Coach            │  Navigation)   │
│   - Settings            │                │
│                         │                │
└─────────────────────────┴────────────────┘
```

### Mobile Layout (Bottom Navigation)

```
┌─────────────────────────┐
│                         │
│    PAGE CONTENT         │
│   (Full width)          │
│                         │
│                         │
├─────────────────────────┤
│ 🏠 📱 📊 📈 ⚙️          │
│ Bottom Navigation       │
└─────────────────────────┘
```

---

## Components Architecture

### Layout Components

#### 1. Layout Wrapper (`src/components/Layout.tsx`)
- Combines Sidebar + main content
- Manages navigation state
- Handles logout functionality
- Responsive: Shows sidebar on desktop, bottom nav on mobile

**Usage:**
```tsx
<Layout>
  <PageContent />
</Layout>
```

#### 2. Sidebar (`src/components/Sidebar.tsx`)
- Fixed 248px width on desktop
- Sticky positioning (stays visible while scrolling)
- Navigation menu with active state indicators
- Collapse/expand toggle
- User profile section
- Notifications badge

#### 3. BottomNav (`src/components/BottomNav.tsx`)
- Mobile-only navigation
- Sticky footer
- Icon-based navigation items
- Active state highlighting

---

## Color Palette for Loans

### Primary Colors
| Color | Hex | Usage | CSS Variable |
|-------|-----|-------|--------------|
| **Blue** | #2563EB | Brand, primary actions | `--primary` |
| **Green** | #10B981 | Paid loans, positive metrics | `--success` |
| **Amber** | #F59E0B | Interest rates, warnings | `--warning` |
| **Red** | #EF4444 | Overdue, high risk | `--danger` |
| **Sky** | #0EA5E9 | Info messages | `--info` |

### Semantic Color Variants
- **Soft backgrounds** for colored status badges: `--success-soft`, `--warning-soft`, etc.
- **Primary ring** for focus states: `--primary-ring`

### Card Color System
```css
--card: #FFFFFF;              /* Card background */
--hover: #F8FAFC;             /* Hover background */
--muted: #F1F5F9;             /* Secondary cards */
```

---

## Typography System

### Font Families
- **Headings (h1-h6):** Inter Tight, weight 700, -0.02em letter-spacing
- **Body text:** Inter, weights 400/500/600
- **Code/Labels:** JetBrains Mono, weight 500/700

### Font Sizes (via Tailwind scale)
```
xs: 0.75rem   (12px)
sm: 0.875rem  (14px)
base: 1rem    (16px)
lg: 1.125rem  (18px)
xl: 1.25rem   (20px)
2xl: 1.5rem   (24px)
```

---

## Existing UI Components

### Card Component (`src/components/UI/Card.tsx`)
```tsx
<Card className="p-6">
  <h3 className="font-semibold mb-4">Loan Details</h3>
  {/* Content */}
</Card>
```

### Button Component (`src/components/UI/Button.tsx`)
```tsx
<Button variant="primary">Add Loan</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Edit</Button>
```

### Input Component (`src/components/UI/Input.tsx`)
```tsx
<Input label="Loan Amount" type="number" placeholder="₹0" />
```

### Alert Component (`src/components/UI/Alert.tsx`)
```tsx
<Alert type="success" title="Loan Added">
  Your loan has been saved successfully.
</Alert>
```

---

## Loans Page UI Features (Phase 1B)

### Page Header
- Title: "Loan Management"
- Subtitle: Active loan count
- Right-aligned: Total outstanding balance

### Summary Cards
Grid of 3 summary metrics:
1. **Monthly EMI** - Total EMI amount (blue background)
2. **Outstanding Balance** - Total remaining (orange background)
3. **Principal Paid** - Amount already paid (green background)

### Loan Cards Grid
- 2 columns on desktop, 1 on mobile
- Each card shows:
  - Bank logo (colored circle with first letter)
  - Loan name & type
  - Interest rate badge
  - Repayment progress circle (visual percentage)
  - Key metrics: Outstanding, EMI, Principal Paid, Remaining months
  - Footer: End date, Interest paid

### Loan Detail Modal (Mobile-bottom drawer on mobile, centered on desktop)
- Key stats: Principal, Outstanding, Rate, EMI
- Repayment progress bar
- Principal vs Interest bar chart (12-month view)
- AI Advisor section with recommendations

---

## Page Structure Examples

### Loans Page (`src/pages/Loans.tsx`)
Modern financial dashboard with:
- Header section
- Summary stat cards
- Loan card grid with hover effects
- Modal detail view
- Chart integration (recharts)
- Progress indicators

### Dashboard Page (`src/pages/Dashboard.tsx`)
- Welcome message with user name
- Stat cards: Total Loans, Savings, Budget, Net Worth
- Getting Started section with action cards
- Quick links to add loan, record transaction, view reports

---

## Responsive Breakpoints

```
Mobile:  < 768px (md)    → Bottom navigation, single column
Tablet:  768px - 1024px  → Sidebar + content, 2 columns
Desktop: > 1024px        → Sidebar + content, 2-3 columns
```

---

## Spacing Scale

```css
xs: 0.25rem  (4px)
sm: 0.5rem   (8px)
md: 1rem     (16px)
lg: 1.5rem   (24px)
xl: 2rem     (32px)
2xl: 3rem    (48px)
```

---

## Border Radius

```css
sm: 4px    (0.25rem)
md: 6px    (0.375rem)
lg: 8px    (0.5rem)
xl: 12px   (0.75rem)
```

---

## Shadow System

```css
--shadow-sm:   0 1px 2px 0 rgb(15 23 42 / 0.04);
--shadow-card: 0 1px 3px 0 rgb(15 23 42 / 0.06);
--shadow-lg:   0 10px 15px -3px rgb(15 23 42 / 0.08);
```

---

## Animation Patterns

### Fade-in Animation
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}
```

### Transitions
```css
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Files and Locations

### Core Layout
- `src/components/Layout.tsx` - Main layout wrapper
- `src/components/Sidebar.tsx` - Desktop navigation
- `src/components/BottomNav.tsx` - Mobile navigation
- `src/components/ProtectedRoute.tsx` - Route protection + Layout wrapper

### Pages (Phase 1B Focus)
- `src/pages/Loans.tsx` - Loan management hub ⭐
- `src/pages/Dashboard.tsx` - Main dashboard
- `src/pages/Transactions.tsx` - Placeholder
- `src/pages/Budget.tsx` - Placeholder
- `src/pages/Savings.tsx` - Placeholder
- `src/pages/Goals.tsx` - Placeholder
- `src/pages/Reports.tsx` - Placeholder
- `src/pages/AICoach.tsx` - Placeholder
- `src/pages/Settings.tsx` - Placeholder

### Components
- `src/components/UI/Button.tsx` - Button variants
- `src/components/UI/Card.tsx` - Card container
- `src/components/UI/Input.tsx` - Form input
- `src/components/UI/Alert.tsx` - Alert messages

### Styles
- `src/index.css` - Design tokens + global styles
- Tailwind CSS v4 via `@import 'tailwindcss'`

---

## Theme Support

### Activating Dark Theme
Set `data-theme="dark"` on the root element:
```tsx
document.documentElement.setAttribute('data-theme', 'dark')
```

### CSS Variable Fallbacks
All variables have fallback values in `:root` selector for light theme compatibility.

---

## Next Steps (Phase 1B Implementation)

### Features to Build
1. **Add Loan Form** - Modal for adding new loans
2. **Edit Loan** - Update existing loan details
3. **Delete Loan** - Remove loans from list
4. **Loan Search/Filter** - By bank, status, date range
5. **EMI Calculator** - Interactive calculator in modal
6. **Amortization Schedule** - Detailed payment breakdown
7. **AI Advisor Suggestions** - Smart recommendations
8. **Loan Status Badges** - Active, Closed, Overdue indicators

### Database Integration
- Connect loan form to Supabase `loans` table
- Real data binding replacing mock data
- User-specific loan filtering (RLS policies)

### Validation
- Form validation for loan creation
- Number formatting (currency inputs)
- Date validation
- Interest rate bounds checking

### Charts & Visualization
- Principal vs Interest breakdown
- Loan distribution pie chart
- EMI payment timeline
- Interest savings projection

---

## Design References

- **Adminator GitHub:** https://github.com/puikinsh/adminator-admin-dashboard
- **SCSS Tokens:** `/home/user/puikinsh/adminator-admin-dashboard/src/assets/styles/2026/_tokens.scss`
- **Shell Layout:** `/home/user/puikinsh/adminator-admin-dashboard/src/assets/styles/2026/_shell.scss`

---

## Accessibility

- ARIA labels on navigation items
- Keyboard navigation: Tab through sidebar, Enter to select
- Color contrast: WCAG AA compliant
- Focus states: `--primary-ring` variable for focus indicators
- Semantic HTML: `<nav>`, `<button>`, `<article>`, etc.

---

## Performance

- CSS variables enable instant theme switching (no JS overhead)
- Compiled Tailwind CSS (~46KB gzipped)
- Icons from lucide-react (tree-shakeable)
- Charts from recharts (optimized for financial data)
- Sidebar sticky positioning: CSS-only (no JavaScript)

---

## Status Summary

✅ **Completed:**
- Design token system (Adminator colors, typography, spacing)
- Layout wrapper (Sidebar + content)
- Responsive navigation (desktop sidebar + mobile bottom nav)
- Loans page UI with cards, charts, and modals
- Dashboard welcome page
- Authentication context and flows
- Route protection and navigation

⏳ **Next Phase:**
- Loan CRUD operations (add, edit, delete)
- Supabase data binding
- Form validation
- Advanced features (EMI calculator, recommendations)

---

## Build & Deploy

**Build Command:**
```bash
pnpm build
```

**Output:** `dist/` directory ready for Netlify deployment

**Current Size:**
- CSS: 46.23 KB (gzipped: 9.09 KB)
- JS: 714.66 KB (gzipped: 206.95 KB)
- Note: Size due to dependencies. Can optimize with code splitting in Phase 2.

---

*Last Updated: 2026-09-06*
*Phase 1B UI Base Complete*
