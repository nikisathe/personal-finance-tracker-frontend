import { Category, GoalCategory } from './types'; // In JS, you can just import normally if needed

export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary', icon: '💼' },
  { value: 'freelance', label: 'Freelance', icon: '💻' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'bonus', label: 'Bonus', icon: '🎁' },
  { value: 'other', label: 'Other', icon: '🧩' },
];

export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'rent', label: 'Rent', icon: '🏠' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'health', label: 'Health', icon: '❤️‍🩹' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'other', label: 'Other', icon: '🧾' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const GOAL_CATEGORIES = [
  { value: 'vacation', label: 'Vacation', icon: '✈️' },
  { value: 'home_renovation', label: 'Home Renovation', icon: '🛠️' },
  { value: 'emergency_fund', label: 'Emergency Fund', icon: '🚑' },
  { value: 'new_car', label: 'New Car', icon: '🚗' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'debt_repayment', label: 'Debt Repayment', icon: '💳' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'other', label: 'Other', icon: '🎯' },
];
