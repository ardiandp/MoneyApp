/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Dashboard Screen (Modern Fintech Analytics)
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Eye,
  EyeOff,
  PlusCircle,
  MinusCircle,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Target,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { NavTab } from '../android/M3NavigationBar';

interface DashboardScreenProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: (defaultType?: 'income' | 'expense' | 'debt') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenAddModal,
}) => {
  const {
    incomes,
    expenses,
    debts,
    budgets,
    savingsGoals,
    currentBalance,
    totalIncome,
    totalExpense,
    netProfit,
    totalDebt,
    totalReceivable,
    formatCurrency,
    getCategorySpent,
    triggerGoogleSync,
    isSyncing,
    user,
  } = useFinance();

  const [showBalance, setShowBalance] = useState(true);
  const [chartView, setChartView] = useState<'cashflow' | 'expense_breakdown'>('cashflow');

  // Calculate top expense categories
  const expenseCategories = React.useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // Combine recent transactions
  const recentTransactions = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      date: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
    }> = [];

    incomes.forEach((i) => {
      list.push({
        id: i.id,
        title: i.description || i.fundingSource,
        subtitle: `${i.fundingSource} • ${i.category}`,
        date: i.date,
        amount: i.amount,
        type: 'INCOME',
      });
    });

    expenses.forEach((e) => {
      list.push({
        id: e.id,
        title: e.notes || e.expensePurpose,
        subtitle: `${e.expensePurpose} • ${e.category}`,
        date: e.date,
        amount: e.amount,
        type: 'EXPENSE',
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [incomes, expenses]);

  // Total monthly budget usage
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + getCategorySpent(b.category), 0);
  const budgetPercent = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  return (
    <div className="p-4 space-y-4">
      {/* User Greeting & Status Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {user.isGoogleConnected ? 'Google Sheets Sync Active' : 'Offline Mode'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('sheets_sync')}
          className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Live Sheet</span>
        </button>
      </div>

      {/* Main Balance Card (Fintech Glassmorphism) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-5 shadow-lg shadow-blue-500/20">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-100 tracking-wide">
              CURRENT NET BALANCE
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded-full hover:bg-white/15 text-blue-100 transition-colors"
              title="Toggle visibility"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {showBalance ? formatCurrency(currentBalance) : '••••••••••••'}
          </div>

          {/* Income vs Expense Mini Stats */}
          <div className="pt-2 grid grid-cols-2 gap-2 border-t border-white/15 text-xs">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-blue-200">Total Income</p>
                <p className="font-semibold text-emerald-300">
                  {showBalance ? formatCurrency(totalIncome) : '••••'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-blue-200">Total Expense</p>
                <p className="font-semibold text-red-300">
                  {showBalance ? formatCurrency(totalExpense) : '••••'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onOpenAddModal('income')}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition-all border border-emerald-200/50 dark:border-emerald-800/40"
        >
          <PlusCircle className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">+ Income</span>
        </button>

        <button
          onClick={() => onOpenAddModal('expense')}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 transition-all border border-red-200/50 dark:border-red-800/40"
        >
          <MinusCircle className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">- Expense</span>
        </button>

        <button
          onClick={() => onNavigate('debt_center')}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 transition-all border border-amber-200/50 dark:border-amber-800/40"
        >
          <Scale className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold">Debts</span>
        </button>

        <button
          onClick={() => triggerGoogleSync()}
          disabled={isSyncing}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-all border border-blue-200/50 dark:border-blue-800/40"
        >
          <FileSpreadsheet className={`w-5 h-5 mb-1 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-[11px] font-semibold">{isSyncing ? 'Syncing' : 'Sync'}</span>
        </button>
      </div>

      {/* Debt & Receivable Quick Highlight */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => onNavigate('debt_center')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Outstanding Debt</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalDebt)}
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Hutang to Pay Back
          </p>
        </div>

        <div
          onClick={() => onNavigate('debt_center')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Receivables</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalReceivable)}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Piutang to Collect
          </p>
        </div>
      </div>

      {/* Analytics Visualization Toggle */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {chartView === 'cashflow' ? 'Daily Cash Flow & Margins' : 'Expense Breakdown'}
            </h3>
            <p className="text-[11px] text-slate-500">October 2026 Live Metrics</p>
          </div>
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700/60 p-0.5 text-[11px]">
            <button
              onClick={() => setChartView('cashflow')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                chartView === 'cashflow'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Cashflow
            </button>
            <button
              onClick={() => setChartView('expense_breakdown')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                chartView === 'expense_breakdown'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Visual Charts */}
        {chartView === 'cashflow' ? (
          <div className="space-y-2 pt-2">
            {/* Custom SVG Bar Chart */}
            <div className="h-36 w-full flex items-end justify-between gap-1.5 pt-4 pb-2 px-1 border-b border-slate-100 dark:border-slate-700">
              {[
                { day: 'Oct 05', inc: 4300000, exp: 0 },
                { day: 'Oct 09', inc: 0, exp: 350000 },
                { day: 'Oct 12', inc: 6500000, exp: 0 },
                { day: 'Oct 14', inc: 0, exp: 2200000 },
                { day: 'Oct 18', inc: 12000000, exp: 0 },
                { day: 'Oct 20', inc: 0, exp: 1750000 },
                { day: 'Oct 22', inc: 8200000, exp: 0 },
                { day: 'Oct 24', inc: 14500000, exp: 1470000 },
              ].map((item, idx) => {
                const maxVal = 15000000;
                const incHeight = Math.max(8, (item.inc / maxVal) * 95);
                const expHeight = Math.max(8, (item.exp / maxVal) * 95);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="w-full flex items-end justify-center space-x-0.5 h-28">
                      {item.inc > 0 && (
                        <div
                          style={{ height: `${incHeight}%` }}
                          className="w-2.5 bg-emerald-500 rounded-t-sm group-hover:bg-emerald-400 transition-all"
                          title={`Income: ${formatCurrency(item.inc)}`}
                        />
                      )}
                      {item.exp > 0 && (
                        <div
                          style={{ height: `${expHeight}%` }}
                          className="w-2.5 bg-red-500 rounded-t-sm group-hover:bg-red-400 transition-all"
                          title={`Expense: ${formatCurrency(item.exp)}`}
                        />
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono">{item.day.slice(4)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                <span>Income</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-red-500" />
                <span>Expense</span>
              </span>
              <span className="text-slate-400">• Net Margin: 86.8%</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {expenseCategories.slice(0, 4).map((cat, idx) => {
              const percent = Math.round((cat.amount / totalExpense) * 100);
              const colors = [
                'bg-blue-600',
                'bg-indigo-600',
                'bg-amber-500',
                'bg-violet-600',
              ];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(cat.amount)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full ${colors[idx % colors.length]} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Budget Guardrail Card */}
      <div
        onClick={() => onNavigate('budget')}
        className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs cursor-pointer hover:border-blue-400 transition-all space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              October Budget Guardrail
            </span>
            {budgetPercent > 100 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                OVERSPENT
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-baseline justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Spent {formatCurrency(totalBudgetSpent)} of {formatCurrency(totalBudgetLimit)}
          </span>
          <span
            className={`font-bold ${
              budgetPercent > 100
                ? 'text-red-600'
                : budgetPercent > 75
                ? 'text-amber-500'
                : 'text-emerald-600'
            }`}
          >
            {budgetPercent}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.min(100, budgetPercent)}%` }}
            className={`h-full rounded-full transition-all ${
              budgetPercent > 100
                ? 'bg-red-500'
                : budgetPercent > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Savings Goal Quick Glance */}
      {savingsGoals.length > 0 && (
        <div
          onClick={() => onNavigate('savings')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {savingsGoals[0].title}
              </h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {formatCurrency(savingsGoals[0].currentAmount)} / {formatCurrency(savingsGoals[0].targetAmount)} (
                {Math.round((savingsGoals[0].currentAmount / savingsGoals[0].targetAmount) * 100)}%)
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Recent Transactions List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Recent Transactions
          </h3>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            View All
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 overflow-hidden shadow-xs">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-xl ${
                    tx.type === 'INCOME'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  }`}
                >
                  {tx.type === 'INCOME' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {tx.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {tx.subtitle} • {tx.date}
                  </p>
                </div>
              </div>
              <div
                className={`text-xs font-bold ${
                  tx.type === 'INCOME'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
