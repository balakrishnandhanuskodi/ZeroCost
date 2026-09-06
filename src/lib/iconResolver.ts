import {
  TrendingUp, TrendingDown, PiggyBank, CreditCard, Wallet, BarChart3,
  UtensilsCrossed, Zap, ShoppingBag, Home, Pill, Book, Plane, Film,
  Shield, Car, Sun, Building2, Building, Award, RotateCw, Briefcase,
  Plus, Trash2, Edit2, AlertCircle, Bell, ChevronLeft, ChevronRight,
  LogOut, LayoutDashboard, Banknote, FileText, Home as HomeIcon
} from 'lucide-react'

type IconName = string

// Map of icon name strings to their corresponding lucide-react components
export const iconMap: Record<IconName, React.ComponentType<{ size?: number; className?: string }>> = {
  // Summary cards
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Wallet,
  BarChart3,

  // Budget categories
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Home: HomeIcon,
  Pill,
  Book,
  Plane,
  Film,

  // Goals
  Shield,
  Car,
  Sun,

  // Savings
  Building2,
  Award,
  RotateCw,
  Briefcase,
  Building,

  // Navigation & UI
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Banknote,
  FileText,
}

/**
 * Get lucide-react icon component by name string
 * @param iconName - Name of the icon (e.g., "TrendingUp", "Home", "Shield")
 * @param size - Icon size in pixels (default: 20)
 * @param className - Additional CSS classes
 * @returns React component or null if icon not found
 */
export function getIcon(
  iconName: IconName | null,
  size: number = 20,
  className: string = ''
) {
  if (!iconName || !iconMap[iconName]) {
    return null
  }

  const Icon = iconMap[iconName]
  return <Icon size={size} className={className} />
}

/**
 * Get icon component directly for use in JSX
 * @param iconName - Name of the icon
 * @returns Icon component or null
 */
export function useIcon(iconName: IconName | null) {
  return iconName ? iconMap[iconName] : null
}

/**
 * Icon name constants for type-safe usage
 */
export const iconNames = {
  // Summary & Stats
  trendingUp: 'TrendingUp',
  trendingDown: 'TrendingDown',
  piggyBank: 'PiggyBank',
  creditCard: 'CreditCard',
  wallet: 'Wallet',
  barChart: 'BarChart3',

  // Categories
  food: 'UtensilsCrossed',
  fuel: 'Zap',
  shopping: 'ShoppingBag',
  home: 'Home',
  medical: 'Pill',
  education: 'Book',
  travel: 'Plane',
  entertainment: 'Film',

  // Goals
  shield: 'Shield',
  car: 'Car',
  sun: 'Sun',

  // Savings
  bank: 'Building2',
  mutualFunds: 'TrendingUp',
  gold: 'Award',
  stocks: 'BarChart3',
  pf: 'Briefcase',
  nps: 'Building',
  sip: 'RotateCw',

  // Navigation
  plus: 'Plus',
  delete: 'Trash2',
  edit: 'Edit2',
  alert: 'AlertCircle',
  bell: 'Bell',
  chevronLeft: 'ChevronLeft',
  chevronRight: 'ChevronRight',
  logout: 'LogOut',
  dashboard: 'LayoutDashboard',
  loans: 'Banknote',
  file: 'FileText',
} as const
