/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Core Domain & Room Entity Types
 */

export type FundingSource =
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Client Payment'
  | 'Affiliate'
  | 'Investment'
  | 'Rental'
  | 'Bonus'
  | 'Cashback'
  | 'Other';

export type ExpensePurpose =
  | 'Food'
  | 'Transport'
  | 'Electricity'
  | 'Water'
  | 'Internet'
  | 'Education'
  | 'Healthcare'
  | 'Shopping'
  | 'Business'
  | 'Investment'
  | 'Entertainment'
  | 'Vehicle'
  | 'Housing'
  | 'Other';

export type DebtType = 'DEBT' | 'RECEIVABLE';

export type DebtStatus = 'ACTIVE' | 'PAID' | 'PARTIAL' | 'OVERDUE';

export interface IncomeTransaction {
  id: string;
  date: string; // ISO date 'YYYY-MM-DD'
  amount: number;
  fundingSource: FundingSource;
  category: string;
  description: string;
  attachment?: string;
  synced: boolean;
  createdAt: string;
}

export interface ExpenseTransaction {
  id: string;
  date: string; // ISO date 'YYYY-MM-DD'
  amount: number;
  expensePurpose: ExpensePurpose;
  category: string;
  notes: string;
  attachment?: string;
  location?: string;
  synced: boolean;
  createdAt: string;
}

export interface DebtRecord {
  id: string;
  type: DebtType; // DEBT (Hutang) or RECEIVABLE (Piutang)
  personName: string;
  phoneNumber: string;
  amount: number;
  paidAmount: number;
  date: string; // 'YYYY-MM-DD'
  dueDate: string; // 'YYYY-MM-DD'
  notes: string;
  status: DebtStatus;
  synced: boolean;
  createdAt: string;
}

export interface MonthlyBudget {
  id: string;
  category: string;
  monthlyLimit: number;
  monthYear: string; // 'YYYY-MM'
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // 'YYYY-MM-DD'
  category: string;
  icon?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'IN_PROGRESS';
  recordsSynced: number;
  spreadsheetName: string;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isGoogleConnected: boolean;
  spreadsheetId?: string;
  spreadsheetName?: string;
  autoSyncEnabled: boolean;
  lastSyncTime?: string;
}

export type CurrencyCode = 'IDR' | 'USD' | 'EUR';

export interface AppSettings {
  currency: CurrencyCode;
  theme: 'light' | 'dark' | 'system';
  pinEnabled: boolean;
  pinCode: string; // 4-digit PIN
  biometricsEnabled: boolean;
  autoLockMinutes: number;
  notificationsEnabled: boolean;
  notifyDebtDaysBefore: number;
}
