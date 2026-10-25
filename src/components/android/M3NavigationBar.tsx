/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Material Design 3 Navigation Bar
 */

import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Scale,
  PieChart,
  MoreHorizontal,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export type NavTab =
  | 'dashboard'
  | 'income'
  | 'expense'
  | 'debt_center'
  | 'budget'
  | 'savings'
  | 'calendar'
  | 'reports'
  | 'sheets_sync'
  | 'settings';

interface M3NavigationBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMoreMenu: () => void;
}

export const M3NavigationBar: React.FC<M3NavigationBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMoreMenu,
}) => {
  const { debts } = useFinance();

  const activeDebtCount = debts.filter(
    (d) => d.status === 'ACTIVE' || d.status === 'PARTIAL' || d.status === 'OVERDUE'
  ).length;

  const tabs: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'income',
      label: 'Income',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'expense',
      label: 'Expense',
      icon: <TrendingDown className="w-5 h-5" />,
    },
    {
      id: 'debt_center',
      label: 'Debts',
      icon: <Scale className="w-5 h-5" />,
      badge: activeDebtCount,
    },
    {
      id: 'budget',
      label: 'Budgets',
      icon: <PieChart className="w-5 h-5" />,
    },
  ];

  const isMoreActive =
    currentTab === 'calendar' ||
    currentTab === 'savings' ||
    currentTab === 'reports' ||
    currentTab === 'sheets_sync' ||
    currentTab === 'settings';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 relative group transition-all"
            >
              {/* Material 3 active pill indicator */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full text-[9px] font-bold px-1.5 py-0.2">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Tab */}
        <button
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center justify-center flex-1 py-1 relative group transition-all"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
              isMoreActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              isMoreActive
                ? 'text-blue-700 dark:text-blue-300 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
