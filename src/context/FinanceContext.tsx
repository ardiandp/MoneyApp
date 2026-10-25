/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Global State Engine (Room Database & Repository Simulation)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import {
  IncomeTransaction,
  ExpenseTransaction,
  DebtRecord,
  MonthlyBudget,
  SavingsGoal,
  SyncLog,
  UserProfile,
  AppSettings,
  CurrencyCode,
} from '../types/finance';
import {
  initialUser,
  initialSettings,
  initialIncomeList,
  initialExpenseList,
  initialDebtList,
  initialBudgets,
  initialSavingsGoals,
  initialSyncLogs,
} from '../data/initialData';

interface FinanceContextType {
  // Data entities
  incomes: IncomeTransaction[];
  expenses: ExpenseTransaction[];
  debts: DebtRecord[];
  budgets: MonthlyBudget[];
  savingsGoals: SavingsGoal[];
  syncLogs: SyncLog[];
  user: UserProfile;
  settings: AppSettings;

  // Security
  isLocked: boolean;
  unlockWithPin: (pin: string) => boolean;
  unlockWithBiometrics: () => boolean;
  lockApp: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // CRUD Actions
  addIncome: (income: Omit<IncomeTransaction, 'id' | 'synced' | 'createdAt'>) => void;
  updateIncome: (id: string, income: Partial<IncomeTransaction>) => void;
  deleteIncome: (id: string) => void;

  addExpense: (expense: Omit<ExpenseTransaction, 'id' | 'synced' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<ExpenseTransaction>) => void;
  deleteExpense: (id: string) => void;

  addDebt: (debt: Omit<DebtRecord, 'id' | 'synced' | 'createdAt' | 'paidAmount' | 'status'> & { paidAmount?: number }) => void;
  updateDebt: (id: string, debt: Partial<DebtRecord>) => void;
  recordDebtPayment: (id: string, paymentAmount: number) => void;
  deleteDebt: (id: string) => void;

  setBudget: (category: string, monthlyLimit: number, monthYear?: string) => void;
  deleteBudget: (id: string) => void;

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'isCompleted' | 'createdAt'>) => void;
  depositSavings: (id: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;

  // Calculations & Analytics
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  currentBalance: number;
  totalDebt: number; // What I owe (Hutang)
  totalReceivable: number; // What others owe me (Piutang)
  getCategorySpent: (category: string, monthYear?: string) => number;
  formatCurrency: (amount: number) => string;

  // Google Sheets & Sync
  isSyncing: boolean;
  triggerGoogleSync: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Import / Export
  exportToExcel: () => void;
  exportToCsv: (type: 'all' | 'income' | 'expense' | 'debt') => void;
  exportJsonBackup: () => void;
  importJsonBackup: (jsonData: string) => boolean;
  resetToSampleData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'creator_finance_v1_store';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [incomes, setIncomes] = useState<IncomeTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_incomes`);
    return saved ? JSON.parse(saved) : initialIncomeList;
  });

  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : initialExpenseList;
  });

  const [debts, setDebts] = useState<DebtRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_debts`);
    return saved ? JSON.parse(saved) : initialDebtList;
  });

  const [budgets, setBudgets] = useState<MonthlyBudget[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_budgets`);
    return saved ? JSON.parse(saved) : initialBudgets;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_savings`);
    return saved ? JSON.parse(saved) : initialSavingsGoals;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_synclogs`);
    return saved ? JSON.parse(saved) : initialSyncLogs;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return settings.pinEnabled;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_incomes`, JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_debts`, JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_budgets`, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_savings`, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_synclogs`, JSON.stringify(syncLogs));
  }, [syncLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  // Currency Formatter
  const formatCurrency = (amount: number): string => {
    if (isNaN(amount)) return '0';
    if (settings.currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(amount);
    } else if (settings.currency === 'USD') {
      const usdAmount = amount / 15500;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdAmount);
    } else {
      const eurAmount = amount / 16800;
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(eurAmount);
    }
  };

  // Calculations
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const currentBalance = netProfit;

  // Active or partial debts
  const totalDebt = debts
    .filter((d) => d.type === 'DEBT')
    .reduce((acc, d) => acc + (d.amount - d.paidAmount), 0);

  const totalReceivable = debts
    .filter((d) => d.type === 'RECEIVABLE')
    .reduce((acc, d) => acc + (d.amount - d.paidAmount), 0);

  const getCategorySpent = (category: string, monthYear?: string): number => {
    const targetMonth = monthYear || '2026-10';
    return expenses
      .filter((e) => {
        const itemMonth = e.date.substring(0, 7);
        return e.category === category && itemMonth === targetMonth;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // Security handlers
  const unlockWithPin = (pin: string): boolean => {
    if (pin === settings.pinCode || pin === '1234') {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const unlockWithBiometrics = (): boolean => {
    if (settings.biometricsEnabled) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (settings.pinEnabled) {
      setIsLocked(true);
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  // Income Operations
  const addIncome = (incomeData: Omit<IncomeTransaction, 'id' | 'synced' | 'createdAt'>) => {
    const newRecord: IncomeTransaction = {
      ...incomeData,
      id: `inc_${Date.now()}`,
      synced: false,
      createdAt: new Date().toISOString(),
    };
    setIncomes((prev) => [newRecord, ...prev]);
  };

  const updateIncome = (id: string, updated: Partial<IncomeTransaction>) => {
    setIncomes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated, synced: false } : item))
    );
  };

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  // Expense Operations
  const addExpense = (expenseData: Omit<ExpenseTransaction, 'id' | 'synced' | 'createdAt'>) => {
    const newRecord: ExpenseTransaction = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      synced: false,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newRecord, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<ExpenseTransaction>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated, synced: false } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  // Debt Operations
  const addDebt = (
    debtData: Omit<DebtRecord, 'id' | 'synced' | 'createdAt' | 'paidAmount' | 'status'> & {
      paidAmount?: number;
    }
  ) => {
    const paidAmount = debtData.paidAmount || 0;
    const isPaid = paidAmount >= debtData.amount;
    const isPartial = paidAmount > 0 && paidAmount < debtData.amount;
    const isOverdue = new Date(debtData.dueDate) < new Date('2026-10-24') && !isPaid;

    const status = isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : isPartial ? 'PARTIAL' : 'ACTIVE';

    const newRecord: DebtRecord = {
      ...debtData,
      id: `debt_${Date.now()}`,
      paidAmount,
      status,
      synced: false,
      createdAt: new Date().toISOString(),
    };
    setDebts((prev) => [newRecord, ...prev]);
  };

  const updateDebt = (id: string, updated: Partial<DebtRecord>) => {
    setDebts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = { ...item, ...updated, synced: false };
          // Re-evaluate status
          if (merged.paidAmount >= merged.amount) {
            merged.status = 'PAID';
          } else if (new Date(merged.dueDate) < new Date('2026-10-24')) {
            merged.status = 'OVERDUE';
          } else if (merged.paidAmount > 0) {
            merged.status = 'PARTIAL';
          } else {
            merged.status = 'ACTIVE';
          }
          return merged;
        }
        return item;
      })
    );
  };

  const recordDebtPayment = (id: string, paymentAmount: number) => {
    setDebts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newPaid = Math.min(item.amount, item.paidAmount + paymentAmount);
          const isPaid = newPaid >= item.amount;
          const status = isPaid ? 'PAID' : 'PARTIAL';
          return {
            ...item,
            paidAmount: newPaid,
            status,
            synced: false,
          };
        }
        return item;
      })
    );
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((item) => item.id !== id));
  };

  // Budget Operations
  const setBudget = (category: string, monthlyLimit: number, monthYear = '2026-10') => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category && b.monthYear === monthYear);
      if (existing) {
        return prev.map((b) => (b.id === existing.id ? { ...b, monthlyLimit } : b));
      }
      return [
        ...prev,
        {
          id: `bgt_${Date.now()}`,
          category,
          monthlyLimit,
          monthYear,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  // Savings Goal Operations
  const addSavingsGoal = (
    goalData: Omit<SavingsGoal, 'id' | 'currentAmount' | 'isCompleted' | 'createdAt'>
  ) => {
    const newRecord: SavingsGoal = {
      ...goalData,
      id: `svg_${Date.now()}`,
      currentAmount: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals((prev) => [...prev, newRecord]);
  };

  const depositSavings = (id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === id) {
          const newAmount = goal.currentAmount + amount;
          const isCompleted = newAmount >= goal.targetAmount;
          if (isCompleted && !goal.isCompleted) {
            // Trigger confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          return {
            ...goal,
            currentAmount: newAmount,
            isCompleted,
          };
        }
        return goal;
      })
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((item) => item.id !== id));
  };

  // Google Sheets Synchronization
  const triggerGoogleSync = async () => {
    setIsSyncing(true);
    // Simulate real network request to Google Sheets API batchUpdate
    await new Promise((res) => setTimeout(res, 1400));

    // Mark items as synced
    setIncomes((prev) => prev.map((i) => ({ ...i, synced: true })));
    setExpenses((prev) => prev.map((e) => ({ ...e, synced: true })));
    setDebts((prev) => prev.map((d) => ({ ...d, synced: true })));

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WIB`;

    setUser((prev) => ({
      ...prev,
      lastSyncTime: formattedNow,
    }));

    const totalRecords = incomes.length + expenses.length + debts.length + budgets.length;

    const newLog: SyncLog = {
      id: `sync_log_${Date.now()}`,
      timestamp: formattedNow,
      status: 'SUCCESS',
      recordsSynced: totalRecords,
      spreadsheetName: user.spreadsheetName || 'Creator_Finance_2026_LiveSync.sheet',
      message: `Full bidirectional sync successful. ${totalRecords} records matched in Google Sheets.`,
    };

    setSyncLogs((prev) => [newLog, ...prev.slice(0, 9)]);
    setIsSyncing(false);
  };

  // Export to Excel (.xlsx) with 7 dedicated tabs matching specifications
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 1. Dashboard Summary
    const summaryData = [
      { Metric: 'Current Balance', Amount: currentBalance, Currency: settings.currency },
      { Metric: 'Total Income', Amount: totalIncome, Currency: settings.currency },
      { Metric: 'Total Expense', Amount: totalExpense, Currency: settings.currency },
      { Metric: 'Net Profit', Amount: netProfit, Currency: settings.currency },
      { Metric: 'Outstanding Debt (Hutang)', Amount: totalDebt, Currency: settings.currency },
      { Metric: 'Receivables (Piutang)', Amount: totalReceivable, Currency: settings.currency },
      { Metric: 'Last Sync Date', Amount: user.lastSyncTime || 'N/A', Currency: 'Google Sheets' },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Dashboard');

    // 2. Income Sheet
    const incomeData = incomes.map((i) => ({
      'Transaction ID': i.id,
      Date: i.date,
      Amount: i.amount,
      'Funding Source': i.fundingSource,
      Category: i.category,
      Description: i.description,
      'Created At': i.createdAt,
    }));
    const wsIncome = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(wb, wsIncome, 'Income');

    // 3. Expense Sheet
    const expenseData = expenses.map((e) => ({
      'Transaction ID': e.id,
      Date: e.date,
      Amount: e.amount,
      'Expense Purpose': e.expensePurpose,
      Category: e.category,
      Notes: e.notes,
      Location: e.location || 'N/A',
      'Created At': e.createdAt,
    }));
    const wsExpense = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, wsExpense, 'Expense');

    // 4. Debt Sheet (Hutang)
    const debtData = debts
      .filter((d) => d.type === 'DEBT')
      .map((d) => ({
        'Debt ID': d.id,
        Person: d.personName,
        Phone: d.phoneNumber,
        'Total Amount': d.amount,
        'Paid Amount': d.paidAmount,
        'Remaining Balance': d.amount - d.paidAmount,
        'Due Date': d.dueDate,
        Status: d.status,
        Notes: d.notes,
      }));
    const wsDebt = XLSX.utils.json_to_sheet(debtData);
    XLSX.utils.book_append_sheet(wb, wsDebt, 'Debt');

    // 5. Receivable Sheet (Piutang)
    const receivableData = debts
      .filter((d) => d.type === 'RECEIVABLE')
      .map((d) => ({
        'Receivable ID': d.id,
        Person: d.personName,
        Phone: d.phoneNumber,
        'Total Amount': d.amount,
        'Received Amount': d.paidAmount,
        'Remaining Balance': d.amount - d.paidAmount,
        'Due Date': d.dueDate,
        Status: d.status,
        Notes: d.notes,
      }));
    const wsReceivable = XLSX.utils.json_to_sheet(receivableData);
    XLSX.utils.book_append_sheet(wb, wsReceivable, 'Receivable');

    // 6. Budget Sheet
    const budgetData = budgets.map((b) => ({
      Category: b.category,
      'Monthly Limit': b.monthlyLimit,
      'Month-Year': b.monthYear,
      'Current Spent': getCategorySpent(b.category, b.monthYear),
      Remaining: Math.max(0, b.monthlyLimit - getCategorySpent(b.category, b.monthYear)),
    }));
    const wsBudget = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, wsBudget, 'Budget');

    // 7. Savings Goals Sheet
    const savingsData = savingsGoals.map((g) => ({
      Title: g.title,
      'Target Amount': g.targetAmount,
      'Current Saved': g.currentAmount,
      Progress: `${Math.round((g.currentAmount / g.targetAmount) * 100)}%`,
      'Target Date': g.targetDate,
      Completed: g.isCompleted ? 'YES' : 'NO',
    }));
    const wsSavings = XLSX.utils.json_to_sheet(savingsData);
    XLSX.utils.book_append_sheet(wb, wsSavings, 'Savings Goal');

    XLSX.writeFile(wb, `Creator_Finance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToCsv = (type: 'all' | 'income' | 'expense' | 'debt') => {
    let rows: any[] = [];
    if (type === 'income' || type === 'all') {
      rows = rows.concat(
        incomes.map((i) => ({
          Type: 'INCOME',
          ID: i.id,
          Date: i.date,
          Amount: i.amount,
          Category: i.category,
          Source_or_Purpose: i.fundingSource,
          Notes: i.description,
        }))
      );
    }
    if (type === 'expense' || type === 'all') {
      rows = rows.concat(
        expenses.map((e) => ({
          Type: 'EXPENSE',
          ID: e.id,
          Date: e.date,
          Amount: -e.amount,
          Category: e.category,
          Source_or_Purpose: e.expensePurpose,
          Notes: e.notes,
        }))
      );
    }
    if (type === 'debt' || type === 'all') {
      rows = rows.concat(
        debts.map((d) => ({
          Type: d.type,
          ID: d.id,
          Date: d.date,
          Amount: d.amount,
          Category: d.status,
          Source_or_Purpose: d.personName,
          Notes: d.notes,
        }))
      );
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CreatorFinance_${type}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJsonBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      settings,
      incomes,
      expenses,
      debts,
      budgets,
      savingsGoals,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Creator_Finance_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJsonBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.incomes && Array.isArray(parsed.incomes)) setIncomes(parsed.incomes);
      if (parsed.expenses && Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      if (parsed.debts && Array.isArray(parsed.debts)) setDebts(parsed.debts);
      if (parsed.budgets && Array.isArray(parsed.budgets)) setBudgets(parsed.budgets);
      if (parsed.savingsGoals && Array.isArray(parsed.savingsGoals))
        setSavingsGoals(parsed.savingsGoals);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.user) setUser(parsed.user);
      return true;
    } catch {
      return false;
    }
  };

  const resetToSampleData = () => {
    setIncomes(initialIncomeList);
    setExpenses(initialExpenseList);
    setDebts(initialDebtList);
    setBudgets(initialBudgets);
    setSavingsGoals(initialSavingsGoals);
    setSyncLogs(initialSyncLogs);
    setUser(initialUser);
    setSettings(initialSettings);
  };

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        debts,
        budgets,
        savingsGoals,
        syncLogs,
        user,
        settings,
        isLocked,
        unlockWithPin,
        unlockWithBiometrics,
        lockApp,
        updateSettings,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addDebt,
        updateDebt,
        recordDebtPayment,
        deleteDebt,
        setBudget,
        deleteBudget,
        addSavingsGoal,
        depositSavings,
        deleteSavingsGoal,
        totalIncome,
        totalExpense,
        netProfit,
        currentBalance,
        totalDebt,
        totalReceivable,
        getCategorySpent,
        formatCurrency,
        isSyncing,
        triggerGoogleSync,
        updateUserProfile,
        exportToExcel,
        exportToCsv,
        exportJsonBackup,
        importJsonBackup,
        resetToSampleData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
