/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Monthly Calendar View
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const CalendarScreen: React.FC = () => {
  const { incomes, expenses, debts, formatCurrency } = useFinance();

  // Anchor month: October 2026
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');

  const daysInMonth = 31;
  const startDayOfWeek = 4; // Oct 1, 2026 was a Thursday (0=Sun, 1=Mon, ..., 4=Thu)

  // Map events to date string 'YYYY-MM-DD'
  const dateMap: Record<
    string,
    {
      incomes: typeof incomes;
      expenses: typeof expenses;
      debts: typeof debts;
    }
  > = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `2026-10-${String(d).padStart(2, '0')}`;
    dateMap[dateStr] = {
      incomes: incomes.filter((i) => i.date === dateStr),
      expenses: expenses.filter((e) => e.date === dateStr),
      debts: debts.filter((deb) => deb.dueDate === dateStr || deb.date === dateStr),
    };
  }

  const selectedData = dateMap[selectedDate] || {
    incomes: [],
    expenses: [],
    debts: [],
  };

  const selectedDayTotalIncome = selectedData.incomes.reduce((acc, i) => acc + i.amount, 0);
  const selectedDayTotalExpense = selectedData.expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Financial Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            October 2026 Cash Flow Schedule
          </p>
        </div>

        <div className="flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>October 2026</span>
        </div>
      </div>

      {/* Calendar Grid Matrix */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty prefix cells */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/30" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
            const data = dateMap[dateStr];
            const hasIncome = data && data.incomes.length > 0;
            const hasExpense = data && data.expenses.length > 0;
            const hasDebt = data && data.debts.length > 0;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-11 rounded-xl p-1 flex flex-col items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 scale-105'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-[11px]">{dayNum}</span>

                {/* Event indicator dots */}
                <div className="flex items-center space-x-0.5">
                  {hasIncome && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                  {hasExpense && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-red-300' : 'bg-red-500'
                      }`}
                    />
                  )}
                  {hasDebt && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Income</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Expense</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Debt Due</span>
          </span>
        </div>
      </div>

      {/* Selected Day Details Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Transactions on {selectedDate}
            </h3>
            <p className="text-[11px] text-slate-500">
              Net Day Flow: {formatCurrency(selectedDayTotalIncome - selectedDayTotalExpense)}
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {selectedData.incomes.length + selectedData.expenses.length + selectedData.debts.length}{' '}
            Entries
          </span>
        </div>

        <div className="space-y-2">
          {selectedData.incomes.length === 0 &&
          selectedData.expenses.length === 0 &&
          selectedData.debts.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              No transactions recorded on this day.
            </p>
          ) : (
            <>
              {selectedData.incomes.map((inc) => (
                <div
                  key={inc.id}
                  className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {inc.description}
                      </p>
                      <p className="text-[10px] text-slate-500">{inc.fundingSource}</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">+{formatCurrency(inc.amount)}</span>
                </div>
              ))}

              {selectedData.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{exp.notes}</p>
                      <p className="text-[10px] text-slate-500">{exp.expensePurpose}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-600">-{formatCurrency(exp.amount)}</span>
                </div>
              ))}

              {selectedData.debts.map((deb) => (
                <div
                  key={deb.id}
                  className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {deb.type === 'DEBT' ? 'Debt Due: ' : 'Receivable Due: '}
                        {deb.personName}
                      </p>
                      <p className="text-[10px] text-slate-500">Status: {deb.status}</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-600">{formatCurrency(deb.amount)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
