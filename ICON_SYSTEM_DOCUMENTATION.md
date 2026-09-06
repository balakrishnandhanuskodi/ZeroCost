# Icon System Documentation

## Overview
All emoji icons have been replaced with **lucide-react** icons for consistency, maintainability, and professional appearance throughout the ZeroCost application.

---

## Icon Mapping

### Budget Categories
| Category | Emoji | Lucide Icon | Import |
|----------|-------|-----------|--------|
| Food & Dining | 🍽️ | `UtensilsCrossed` | `lucide-react` |
| Fuel & Transport | ⛽ | `Zap` | `lucide-react` |
| Shopping | 🛍️ | `ShoppingBag` | `lucide-react` |
| Home & Utilities | 🏠 | `Home` | `lucide-react` |
| Medical | 💊 | `Pill` | `lucide-react` |
| Education | 📚 | `Book` | `lucide-react` |
| Travel | ✈️ | `Plane` | `lucide-react` |
| Entertainment | 🎬 | `Film` | `lucide-react` |

### Goals
| Goal | Emoji | Lucide Icon |
|------|-------|-----------|
| Emergency Fund | 🛡️ | `Shield` |
| New Car | 🚗 | `Car` |
| Europe Vacation | ✈️ | `Plane` |
| House Down Payment | 🏠 | `Home` |
| Retirement Corpus | 🌅 | `Sun` |

### Savings/Assets
| Asset | Emoji | Lucide Icon |
|-------|-------|-----------|
| Emergency Fund | 🛡️ | `Shield` |
| Fixed Deposits | 🏦 | `Building2` |
| Mutual Funds | 📈 | `TrendingUp` |
| Gold | 🥇 | `Award` |
| Stocks | 📊 | `BarChart3` |
| PF / EPF | 💼 | `Briefcase` |
| NPS | 🏛️ | `Building` |
| Monthly SIP | 🔄 | `RotateCw` |

### Navigation & UI
| Component | Lucide Icon |
|-----------|------------|
| Dashboard | `LayoutDashboard` |
| Loans | `Banknote` |
| Add/Plus | `Plus` |
| Delete | `Trash2` |
| Edit | `Edit2` |
| Alert | `AlertCircle` |
| Bell (Notifications) | `Bell` |
| Logout | `LogOut` |

---

## Icon Resolver Utility

### File
`src/lib/iconResolver.ts`

### Available Functions

#### 1. `getIcon(iconName, size, className)`
Returns a rendered lucide-react icon component.

**Example:**
```tsx
import { getIcon } from '@/lib/iconResolver'

// In JSX:
<div>
  {getIcon('Shield', 24, 'text-green-500')}
</div>
```

#### 2. `useIcon(iconName)`
Returns the icon component class for dynamic rendering.

**Example:**
```tsx
import { useIcon } from '@/lib/iconResolver'

const Icon = useIcon('TrendingUp')
return <Icon size={20} className="text-blue-500" />
```

#### 3. `iconMap`
Direct mapping of icon names to components.

**Example:**
```tsx
import { iconMap } from '@/lib/iconResolver'

const ShieldIcon = iconMap['Shield']
return <ShieldIcon size={24} />
```

#### 4. `iconNames`
Type-safe constants for all icon names.

**Example:**
```tsx
import { iconNames } from '@/lib/iconResolver'

// Use for type-safe icon references
const icon = iconNames.food        // 'UtensilsCrossed'
const icon = iconNames.shield      // 'Shield'
const icon = iconNames.dashboard   // 'LayoutDashboard'
```

---

## Usage Examples

### In a Budget Category Component
```tsx
import { getIcon } from '@/lib/iconResolver'
import { budgetCategories } from '@/data/mockData'

function BudgetCard({ category }) {
  return (
    <div className="flex items-center gap-2">
      {getIcon(category.icon, 24)}
      <span>{category.name}</span>
    </div>
  )
}

// Usage:
<BudgetCard category={budgetCategories[0]} />
// Renders: 🥄 Food & Dining
```

### In a Savings Component
```tsx
import { useIcon } from '@/lib/iconResolver'
import { savings } from '@/data/mockData'

function SavingsItem({ asset }) {
  const Icon = useIcon(asset.icon)
  
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className="text-muted-foreground" />}
      <span>{asset.name}</span>
    </div>
  )
}
```

### Direct Import from iconMap
```tsx
import { iconMap } from '@/lib/iconResolver'

// Get icon and render with custom styling
const HomeIcon = iconMap['Home']

<HomeIcon size={32} className="text-purple-600" />
```

### Using Type-Safe Constants
```tsx
import { iconNames } from '@/lib/iconResolver'

// Always type-safe - no string typos
const goalIcon = iconNames.car        // 'Car' ✓
const budgetIcon = iconNames.food     // 'UtensilsCrossed' ✓
const navIcon = iconNames.dashboard   // 'LayoutDashboard' ✓
```

---

## Data Structure Updates

### mockData.ts
All icon fields updated from emoji to lucide-react icon names:

**Before:**
```tsx
export const budgetCategories = [
  { name: 'Food & Dining', budget: 15000, spent: 13240, icon: '🍽️', color: '#f97316' },
]
```

**After:**
```tsx
export const budgetCategories = [
  { name: 'Food & Dining', budget: 15000, spent: 13240, icon: 'UtensilsCrossed', color: '#f97316' },
]
```

### Benefits
✅ **Consistent**: All icons from one library (lucide-react)
✅ **Themeable**: Icons respect light/dark modes automatically
✅ **Scalable**: Easy to change icon size/color
✅ **Accessible**: Icons have semantic meaning
✅ **Type-Safe**: Use constants instead of magic strings
✅ **Maintainable**: Centralized mapping for easy updates

---

## Integration Checklist

- [x] Replaced all emoji in Loans page
- [x] Replaced all emoji in mockData.ts
- [x] Created icon resolver utility
- [x] Exported icon map and helper functions
- [x] Added type-safe icon name constants
- [ ] Integrate with Budget component
- [ ] Integrate with Goals component
- [ ] Integrate with Savings component
- [ ] Integrate with Summary cards component
- [ ] Add dynamic icon rendering to all relevant components

---

## Available Icons Reference

All icons from lucide-react are available. See https://lucide.dev/ for the complete icon library.

### Commonly Used in ZeroCost
```
TrendingUp        TrendingDown      PiggyBank         CreditCard
Wallet            BarChart3         UtensilsCrossed   Zap
ShoppingBag       Home              Pill              Book
Plane             Film              Shield            Car
Sun               Building2         Award             RotateCw
Briefcase         Building          Plus              Trash2
Edit2             AlertCircle       Bell              ChevronLeft
ChevronRight      LogOut            LayoutDashboard   Banknote
FileText
```

---

## Notes

- Icon sizes: Default is 20px, adjustable via `size` prop
- CSS classes: Pass custom Tailwind classes via `className`
- Colors: Use CSS variable system for theme-aware colors
- Fallback: `getIcon()` returns `null` for missing icons
- Performance: Icons are lazy-loaded via tree-shaking from lucide-react

---

## Future Enhancements

1. Create icon library component wrapper
2. Add animated icon variants
3. Build icon picker UI for dynamic category creation
4. Support custom icon selection by users
5. Create icon sprite sheet for performance optimization
