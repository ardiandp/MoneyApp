/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Monthly Budget Planning Module
 */

import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BudgetScreen: React.FC = () => {
  const { budgets, setBudget, deleteBudget, getCategorySpent, formatCurrency } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  // Calculate totals
  const totalLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + getCategorySpent(b.category), 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(newLimit);
    if (!newCategory.trim() || isNaN(limitNum) || limitNum <= 0) {
      alert('Please enter a valid category name and budget limit');
      return;
    }
    setBudget(newCategory.trim(), limitNum);
    setNewCategory('');
    setNewLimit('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Monthly Budget Plan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            October 2026 Guardrails & Limits
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">TOTAL OCTOBER BUDGET</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              overallPercent > 100
                ? 'bg-red-500 text-white animate-pulse'
                : overallPercent > 75
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {overallPercent}% CONSUMED
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-black">{formatCurrency(totalSpent)}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Spent of {formatCurrency(totalLimit)} Limit
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-400">
              {formatCurrency(totalRemaining)}
            </div>
            <p className="text-[10px] text-slate-400">Available Remaining</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.min(100, overallPercent)}%` }}
            className={`h-full rounded-full transition-all ${
              overallPercent > 100
                ? 'bg-red-500'
                : overallPercent > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Category Budgets List */}
      <div className="space-y-3">
        {budgets.map((b) => {
          const spent = getCategorySpent(b.category);
          const percent = Math.round((spent / b.monthlyLimit) * 100);
          const remaining = b.monthlyLimit - spent;
          const isOverspent = percent > 100;
          const isWarning = percent >= 75 && percent <= 100;

          return (
            <div
              key={b.id}
              className={`p-4 rounded-3xl bg-white dark:bg-slate-800/90 border shadow-xs space-y-2.5 transition-all ${
                isOverspent
                  ? 'border-red-300 dark:border-red-800/80 bg-red-50/20'
                  : isWarning
                  ? 'border-amber-300 dark:border-amber-800/80'
                  : 'border-slate-200/70 dark:border-slate-800'
              }`}
            >
              {/* Category & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {b.category}
                    </h3>
                    {isOverspent && (
                      <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span>Over Budget!</span>
                      </span>
                    )}
                    {isWarning && (
                      <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span>Warning &gt;75%</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Limit: {formatCurrency(b.monthlyLimit)}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      const newAmount = prompt(`New limit for ${b.category}:`, b.monthlyLimit.toString());
                      if (newAmount && !isNaN(parseFloat(newAmount))) {
                        setBudget(b.category, parseFloat(newAmount));
                      }
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                    title="Edit Limit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove budget for ${b.category}?`)) {
                        deleteBudget(b.id);
                      }
                    }}
                    className="p-1 rounded-md hover:bg-red-50 text-red-500 dark:hover:bg-red-950/40"
                    title="Delete Budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress & Remaining */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">
                    Spent: <strong>{formatCurrency(spent)}</strong>
                  </span>
                  <span
                    className={`font-bold ${
                      isOverspent
                        ? 'text-red-600'
                        : isWarning
                        ? 'text-amber-500'
                        : 'text-emerald-600'
                    }`}
                  >
                    {percent}% used {remaining >= 0 ? `(${formatCurrency(remaining)} left)` : `(Over by ${formatCurrency(Math.abs(remaining))})`}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, percent)}%` }}
                    className={`h-full rounded-full transition-all ${
                      isOverspent
                        ? 'bg-red-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set Budget Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Set Category Monthly Budget
            </h3>

            <form onSubmit={handleSaveBudget} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Software & Cloud, Equipment, Food"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Limit (Rp)
                </label>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  placeholder="e.g. 2000000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
