/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Google Sheets Synchronization Center
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Cloud,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Clock,
  Settings,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const GoogleSheetsSyncScreen: React.FC = () => {
  const {
    user,
    updateUserProfile,
    syncLogs,
    isSyncing,
    triggerGoogleSync,
    incomes,
    expenses,
    debts,
    budgets,
    savingsGoals,
  } = useFinance();

  const [activeSheetTab, setActiveSheetTab] = useState<
    'Dashboard' | 'Income' | 'Expense' | 'Debt' | 'Receivable' | 'Budget' | 'Savings'
  >('Dashboard');

  const unsyncedCount =
    incomes.filter((i) => !i.synced).length +
    expenses.filter((e) => !e.synced).length +
    debts.filter((d) => !d.synced).length;

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Google Sheets Cloud Sync
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bidirectional Room & Sheets Cloud Engine
          </p>
        </div>

        <button
          onClick={triggerGoogleSync}
          disabled={isSyncing}
          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Connected Account & Workbook Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {user.spreadsheetName}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                ID: {user.spreadsheetId?.slice(0, 20)}...
              </p>
            </div>
          </div>

          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Connected</span>
          </span>
        </div>

        {/* Sync Status Info */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] text-slate-400">Last Synced Timestamp</span>
            <p className="font-semibold text-slate-700 dark:text-slate-300">{user.lastSyncTime}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Pending Local Changes</span>
            <p
              className={`font-semibold ${
                unsyncedCount > 0 ? 'text-amber-500 font-bold' : 'text-emerald-600'
              }`}
            >
              {unsyncedCount === 0 ? 'All 100% in Sync' : `${unsyncedCount} Records Queued`}
            </p>
          </div>
        </div>

        {/* Auto Sync Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              WorkManager Background Auto-Sync
            </h4>
            <p className="text-[10px] text-slate-500">Syncs immediately when internet connects</p>
          </div>
          <button
            onClick={() => updateUserProfile({ autoSyncEnabled: !user.autoSyncEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              user.autoSyncEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                user.autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Spreadsheet Tabs Structure Preview */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Live Google Sheets Structure
            </h3>
            <p className="text-[10px] text-slate-500">7 Connected Worksheets in Master Document</p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
            Sheets v4 API
          </span>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar text-[11px] font-medium">
          {(
            ['Dashboard', 'Income', 'Expense', 'Debt', 'Receivable', 'Budget', 'Savings'] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSheetTab(tab)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-colors ${
                activeSheetTab === tab
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mock Live Sheet Data Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/40 text-[11px]">
          {activeSheetTab === 'Dashboard' && (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                <tr>
                  <th className="p-2">Metric</th>
                  <th className="p-2">Formula / Value</th>
                  <th className="p-2">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="p-2 font-medium">Current Balance</td>
                  <td className="p-2 text-emerald-600 font-bold">=(Income!C:C - Expense!C:C)</td>
                  <td className="p-2 text-emerald-600">LIVE</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Total Income</td>
                  <td className="p-2 text-blue-600 font-bold">=SUM(Income!C2:C)</td>
                  <td className="p-2 text-emerald-600">LIVE</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Total Expense</td>
                  <td className="p-2 text-red-600 font-bold">=SUM(Expense!C2:C)</td>
                  <td className="p-2 text-emerald-600">LIVE</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Income' && (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {incomes.slice(0, 3).map((i) => (
                  <tr key={i.id}>
                    <td className="p-2 text-slate-400">{i.id}</td>
                    <td className="p-2">{i.date}</td>
                    <td className="p-2 font-bold text-emerald-600">Rp {i.amount.toLocaleString()}</td>
                    <td className="p-2">{i.fundingSource}</td>
                    <td className="p-2 truncate max-w-[120px]">{i.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Expense' && (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {expenses.slice(0, 3).map((e) => (
                  <tr key={e.id}>
                    <td className="p-2 text-slate-400">{e.id}</td>
                    <td className="p-2">{e.date}</td>
                    <td className="p-2 font-bold text-red-600">Rp {e.amount.toLocaleString()}</td>
                    <td className="p-2">{e.expensePurpose}</td>
                    <td className="p-2 truncate max-w-[120px]">{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(activeSheetTab === 'Debt' || activeSheetTab === 'Receivable') && (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                <tr>
                  <th className="p-2">Person</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {debts
                  .filter((d) => d.type === (activeSheetTab === 'Debt' ? 'DEBT' : 'RECEIVABLE'))
                  .slice(0, 3)
                  .map((d) => (
                    <tr key={d.id}>
                      <td className="p-2 font-semibold">{d.personName}</td>
                      <td className="p-2">Rp {d.amount.toLocaleString()}</td>
                      <td className="p-2">Rp {d.paidAmount.toLocaleString()}</td>
                      <td className="p-2">{d.dueDate}</td>
                      <td className="p-2 text-blue-600 font-bold">{d.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Budget' && (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                <tr>
                  <th className="p-2">Category</th>
                  <th className="p-2">Monthly Limit</th>
                  <th className="p-2">Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {budgets.slice(0, 3).map((b) => (
                  <tr key={b.id}>
                    <td className="p-2 font-semibold">{b.category}</td>
                    <td className="p-2">Rp {b.monthlyLimit.toLocaleString()}</td>
                    <td className="p-2">{b.monthYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'Savings' && (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[9px] font-bold">
                <tr>
                  <th className="p-2">Goal Title</th>
                  <th className="p-2">Target</th>
                  <th className="p-2">Saved</th>
                  <th className="p-2">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {savingsGoals.slice(0, 3).map((g) => (
                  <tr key={g.id}>
                    <td className="p-2 font-semibold">{g.title}</td>
                    <td className="p-2">Rp {g.targetAmount.toLocaleString()}</td>
                    <td className="p-2">Rp {g.currentAmount.toLocaleString()}</td>
                    <td className="p-2 text-emerald-600 font-bold">
                      {Math.round((g.currentAmount / g.targetAmount) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Sync Logs History */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Sync History Audit Log
        </h3>
        <div className="space-y-1.5">
          {syncLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 flex items-start justify-between text-xs"
            >
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{log.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600">
                {log.recordsSynced} records
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
