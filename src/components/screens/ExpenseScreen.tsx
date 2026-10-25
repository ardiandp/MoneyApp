/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Expense Management Screen
 */

import React, { useState } from 'react';
import {
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { ExpensePurpose, ExpenseTransaction } from '../../types/finance';

interface ExpenseScreenProps {
  onOpenAddModal: (type?: 'expense') => void;
}

export const ExpenseScreen: React.FC<ExpenseScreenProps> = ({ onOpenAddModal }) => {
  const { expenses, deleteExpense, updateExpense, formatCurrency, exportToCsv } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('ALL');

  const expensePurposes: Array<ExpensePurpose | 'ALL'> = [
    'ALL',
    'Food',
    'Transport',
    'Electricity',
    'Water',
    'Internet',
    'Education',
    'Healthcare',
    'Shopping',
    'Business',
    'Investment',
    'Entertainment',
    'Vehicle',
    'Housing',
    'Other',
  ];

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expensePurpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.amount.toString().includes(searchQuery);

    const matchesPurpose = selectedPurpose === 'ALL' || item.expensePurpose === selectedPurpose;

    return matchesSearch && matchesPurpose;
  });

  const totalFilteredAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Expense Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredExpenses.length} records • Total {formatCurrency(totalFilteredAmount)}
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => exportToCsv('expense')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center space-x-1 transition-colors"
            title="Export Expense to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-red-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search purpose, notes, category, location, or amount..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Purpose Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {expensePurposes.map((purpose) => (
          <button
            key={purpose}
            onClick={() => setSelectedPurpose(purpose)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedPurpose === purpose
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {purpose}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-2.5">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <TrendingDown className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No expense records matching your filter.</p>
          </div>
        ) : (
          filteredExpenses.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 hover:border-red-300 transition-all shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                      {item.expensePurpose}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {item.notes}
                  </h4>
                  {item.location && (
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-red-600 dark:text-red-400">
                    -{formatCurrency(item.amount)}
                  </div>
                  <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-blue-500" />
                  <span>{item.synced ? 'Synced to Sheets' : 'Local Queue'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const newNotes = prompt('Edit expense note:', item.notes);
                      if (newNotes !== null) {
                        updateExpense(item.id, { notes: newNotes });
                      }
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                    title="Edit Expense"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this expense record?')) {
                        deleteExpense(item.id);
                      }
                    }}
                    className="p-1 rounded-md hover:bg-red-50 text-red-500 dark:hover:bg-red-950/40"
                    title="Delete Expense"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
