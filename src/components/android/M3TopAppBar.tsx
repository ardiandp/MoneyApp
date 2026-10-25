/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Android Material Design 3 Top App Bar
 */

import React from 'react';
import { RefreshCw, Search, Bell, ShieldCheck, Cloud, CloudOff } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface M3TopAppBarProps {
  title: string;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSync: () => void;
  onLockApp: () => void;
}

export const M3TopAppBar: React.FC<M3TopAppBarProps> = ({
  title,
  onOpenSearch,
  onOpenNotifications,
  onOpenSync,
  onLockApp,
}) => {
  const { isSyncing, triggerGoogleSync, debts, budgets, getCategorySpent, settings } = useFinance();

  // Notification count (overdue debts + budgets near or over limit)
  const overdueCount = debts.filter((d) => d.status === 'OVERDUE').length;
  const dueSoonCount = debts.filter(
    (d) => d.status === 'ACTIVE' && new Date(d.dueDate) <= new Date('2026-10-31')
  ).length;
  const overbudgetCount = budgets.filter((b) => getCategorySpent(b.category) > b.monthlyLimit).length;
  const totalAlerts = overdueCount + dueSoonCount + overbudgetCount;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Title & Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <span className="font-bold text-sm tracking-tighter">CF</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {title}
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              ROOM DB • OFFLINE FIRST
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Google Sheets Sync Pill */}
          <button
            onClick={triggerGoogleSync}
            disabled={isSyncing}
            title="Google Sheets Auto-Sync"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-[11px] font-medium text-slate-700 dark:text-slate-300"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="hidden xs:inline">{isSyncing ? 'Syncing...' : 'Sheets'}</span>
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications with Badge */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Alerts & Reminders"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Quick Lock if PIN enabled */}
          {settings.pinEnabled && (
            <button
              onClick={onLockApp}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Lock Application"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
