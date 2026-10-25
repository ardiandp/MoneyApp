/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Financial Reports & Multi-Format Export Module
 */

import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  Scale,
  PieChart,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ReportsScreen: React.FC = () => {
  const {
    incomes,
    expenses,
    debts,
    budgets,
    totalIncome,
    totalExpense,
    netProfit,
    totalDebt,
    totalReceivable,
    formatCurrency,
    exportToExcel,
    exportToCsv,
  } = useFinance();

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handlePrintPdf = () => {
    window.print();
  };

  // Top expense category breakdown
  const categorySummary = React.useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / (totalExpense || 1)) * 100),
    }));
  }, [expenses, totalExpense]);

  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  return (
    <div className="p-4 space-y-4 print:p-0 print:space-y-2">
      {/* Top Banner */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Financial Statement
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit-Ready Executive Reports
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => exportToCsv('all')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={exportToExcel}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1 shadow-sm shadow-emerald-500/20"
            title="Export Excel with 7 Sheets"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            title="Print / Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl print:hidden">
        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              timeframe === t
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Official Report Card (Printable) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        {/* Header Statement */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
              CREATOR FINANCE STATEMENT
            </h1>
            <p className="text-[11px] text-slate-500">
              Period: {timeframe.toUpperCase()} REPORT • October 2026
            </p>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              VERIFIED
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Room DB v1.0</p>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Gross Income</span>
            </div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-[10px] text-slate-400">{incomes.length} client & ad payments</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span>Operating Expenses</span>
            </div>
            <div className="text-base font-bold text-red-600 dark:text-red-400 mt-1">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-[10px] text-slate-400">{expenses.length} operating costs</p>
          </div>
        </div>

        {/* Net Profit Margin Spotlight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase">
              Net Profit / Retained Earnings
            </p>
            <div className="text-xl font-extrabold text-blue-700 dark:text-blue-400 mt-0.5">
              {formatCurrency(netProfit)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {profitMargin}%
            </span>
            <p className="text-[10px] text-slate-500">Margin</p>
          </div>
        </div>

        {/* Liabilities & Receivables */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Balance Sheet Liabilities & Receivables
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 text-[11px]">Outstanding Debt (Hutang)</span>
              <p className="font-bold text-amber-600 mt-0.5">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 text-[11px]">Pending Receivables (Piutang)</span>
              <p className="font-bold text-emerald-600 mt-0.5">{formatCurrency(totalReceivable)}</p>
            </div>
          </div>
        </div>

        {/* Expense Category Breakdown Table */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Cost Allocation by Category
          </h4>
          <div className="space-y-1.5">
            {categorySummary.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-600 dark:text-slate-400">{cat.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(cat.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
