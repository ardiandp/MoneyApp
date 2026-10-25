/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Global Search Engine with Deep Date & Category Filters
 */

import React, { useState } from 'react';
import { Search, X, Calendar, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { incomes, expenses, debts, formatCurrency } = useFinance();
  const [query, setQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  if (!isOpen) return null;

  // Filter logic
  const results = React.useMemo(() => {
    if (!query.trim() && timeFilter === 'ALL') return [];

    const lowerQuery = query.toLowerCase();

    const matchesTime = (dateStr: string) => {
      if (timeFilter === 'ALL') return true;
      if (timeFilter === 'TODAY') return dateStr === '2026-10-24';
      if (timeFilter === 'WEEK') return dateStr >= '2026-10-18';
      if (timeFilter === 'MONTH') return dateStr.startsWith('2026-10');
      return true;
    };

    const incomeMatches = incomes
      .filter((i) => matchesTime(i.date))
      .filter(
        (i) =>
          !lowerQuery ||
          i.description.toLowerCase().includes(lowerQuery) ||
          i.category.toLowerCase().includes(lowerQuery) ||
          i.fundingSource.toLowerCase().includes(lowerQuery) ||
          i.amount.toString().includes(lowerQuery)
      )
      .map((i) => ({
        id: i.id,
        type: 'INCOME' as const,
        title: i.description,
        subtitle: `${i.fundingSource} • ${i.category}`,
        date: i.date,
        amount: i.amount,
      }));

    const expenseMatches = expenses
      .filter((e) => matchesTime(e.date))
      .filter(
        (e) =>
          !lowerQuery ||
          e.notes.toLowerCase().includes(lowerQuery) ||
          e.category.toLowerCase().includes(lowerQuery) ||
          e.expensePurpose.toLowerCase().includes(lowerQuery) ||
          (e.location && e.location.toLowerCase().includes(lowerQuery)) ||
          e.amount.toString().includes(lowerQuery)
      )
      .map((e) => ({
        id: e.id,
        type: 'EXPENSE' as const,
        title: e.notes,
        subtitle: `${e.expensePurpose} • ${e.category}`,
        date: e.date,
        amount: e.amount,
      }));

    const debtMatches = debts
      .filter((d) => matchesTime(d.date) || matchesTime(d.dueDate))
      .filter(
        (d) =>
          !lowerQuery ||
          d.personName.toLowerCase().includes(lowerQuery) ||
          d.notes.toLowerCase().includes(lowerQuery) ||
          d.phoneNumber.includes(lowerQuery) ||
          d.amount.toString().includes(lowerQuery)
      )
      .map((d) => ({
        id: d.id,
        type: d.type === 'DEBT' ? ('DEBT' as const) : ('RECEIVABLE' as const),
        title: `${d.personName} (${d.status})`,
        subtitle: `${d.notes} • Due: ${d.dueDate}`,
        date: d.date,
        amount: d.amount,
      }));

    return [...incomeMatches, ...expenseMatches, ...debtMatches];
  }, [incomes, expenses, debts, query, timeFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-16">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 max-h-[80vh] flex flex-col">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search amount, client, purpose, notes..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date Filter Chips */}
        <div className="flex items-center space-x-1.5 text-[11px] font-semibold">
          {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded-xl transition-colors ${
                timeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {filter === 'ALL'
                ? 'All Time'
                : filter === 'TODAY'
                ? 'Today'
                : filter === 'WEEK'
                ? 'This Week'
                : 'This Month'}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800">
          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {query || timeFilter !== 'ALL'
                ? 'No matching financial transactions found.'
                : 'Type to start searching across all Room tables.'}
            </div>
          ) : (
            results.map((r) => (
              <div key={r.id} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      r.type === 'INCOME'
                        ? 'bg-emerald-100 text-emerald-700'
                        : r.type === 'EXPENSE'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {r.type === 'INCOME' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : r.type === 'EXPENSE' ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <Scale className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {r.title}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {r.subtitle} • {r.date}
                    </p>
                  </div>
                </div>

                <div
                  className={`font-bold ${
                    r.type === 'INCOME'
                      ? 'text-emerald-600'
                      : r.type === 'EXPENSE'
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }`}
                >
                  {r.type === 'INCOME' ? '+' : r.type === 'EXPENSE' ? '-' : ''}{' '}
                  {formatCurrency(r.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
