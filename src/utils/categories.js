export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income'
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Health',
  'Housing', 'Utilities', 'Education', 'Travel', 'Other Expense'
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const CATEGORY_COLORS = {
  'Food & Dining': '#FF6384',
  'Transport': '#36A2EB',
  'Shopping': '#FFCE56',
  'Entertainment': '#4BC0C0',
  'Health': '#9966FF',
  'Housing': '#FF9F40',
  'Utilities': '#FF6384',
  'Education': '#36A2EB',
  'Travel': '#4BC0C0',
  'Other Expense': '#aaa',
  'Salary': '#4caf50',
  'Freelance': '#8bc34a',
  'Investment': '#00bcd4',
  'Business': '#ff9800',
  'Gift': '#e91e63',
  'Other Income': '#9e9e9e',
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];