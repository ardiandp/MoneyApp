/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Income Management Screen
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { FundingSource, IncomeTransaction } from '../../types/finance';

interface IncomeScreenProps {
  onOpenAddModal: (type?: 'income') => void;
}

export const IncomeScreen: React.FC<IncomeScreenProps> = ({ onOpenAddModal }) => {
  const { incomes, deleteIncome, updateIncome, formatCurrency, exportToCsv } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<IncomeTransaction | null>(null);

  const fundingSources: Array<FundingSource | 'ALL'> = [
    'ALL',
    'Client Payment',
    'Affiliate',
    'Business',
    'Freelance',
    'Investment',
    'Salary',
    'Rental',
    'Bonus',
    'Cashback',
    'Other',
  ];

  // Filtering
  const filteredIncomes = incomes.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fundingSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toString().includes(searchQuery);

    const matchesSource = selectedSource === 'ALL' || item.fundingSource === selectedSource;

    return matchesSearch && matchesSource;
  });

  const totalFilteredAmount = filteredIncomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header with Total Summary and Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Income Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredIncomes.length} records • Total {formatCurrency(totalFilteredAmount)}
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => exportToCsv('income')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center space-x-1 transition-colors"
            title="Export Income to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search client, source, description, or amount..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Funding Source Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {fundingSources.map((source) => (
          <button
            key={source}
            onClick={() => setSelectedSource(source)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedSource === source
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {source}
          </button>
        ))}
      </div>

      {/* Income Records List */}
      <div className="space-y-2.5">
        {filteredIncomes.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No income records matching your filter.</p>
          </div>
        ) : (
          filteredIncomes.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-300 transition-all shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.fundingSource}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {item.description}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(item.amount)}
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
                      const newDesc = prompt('Edit description:', item.description);
                      if (newDesc !== null) {
                        updateIncome(item.id, { description: newDesc });
                      }
                    }}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                    title="Edit Income"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this income record?')) {
                        deleteIncome(item.id);
                      }
                    }}
                    className="p-1 rounded-md hover:bg-red-50 text-red-500 dark:hover:bg-red-950/40"
                    title="Delete Income"
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
