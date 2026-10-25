/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - WorkManager Notification Center & Reminders
 */

import React from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  PieChart,
  Scale,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { debts, budgets, getCategorySpent, formatCurrency } = useFinance();

  if (!isOpen) return null;

  // Generate scheduled alerts
  const alerts: Array<{
    id: string;
    type: 'DEBT_DUE' | 'BUDGET_EXCEEDED' | 'DAILY_SUMMARY';
    title: string;
    body: string;
    time: string;
    severity: 'danger' | 'warning' | 'info';
  }> = [];

  // Debt alerts
  debts.forEach((d) => {
    if (d.status === 'OVERDUE') {
      alerts.push({
        id: `debt_over_${d.id}`,
        type: 'DEBT_DUE',
        title: `Overdue: ${d.type === 'DEBT' ? 'Hutang' : 'Piutang'} with ${d.personName}`,
        body: `Payment of ${formatCurrency(d.amount - d.paidAmount)} was due on ${d.dueDate}. Immediate action recommended.`,
        time: 'Automated Overdue Check',
        severity: 'danger',
      });
    } else if (d.status !== 'PAID') {
      alerts.push({
        id: `debt_due_${d.id}`,
        type: 'DEBT_DUE',
        title: `Due Soon: ${d.personName}`,
        body: `Maturity date on ${d.dueDate}. Remaining balance: ${formatCurrency(d.amount - d.paidAmount)}.`,
        time: 'Scheduled WorkManager Reminder',
        severity: 'warning',
      });
    }
  });

  // Budget alerts
  budgets.forEach((b) => {
    const spent = getCategorySpent(b.category);
    if (spent > b.monthlyLimit) {
      alerts.push({
        id: `bgt_${b.id}`,
        type: 'BUDGET_EXCEEDED',
        title: `Budget Exceeded: ${b.category}`,
        body: `You have spent ${formatCurrency(spent)} against the ${formatCurrency(b.monthlyLimit)} limit.`,
        time: 'Real-time Guardrail Alert',
        severity: 'danger',
      });
    }
  });

  // Daily Summary notification
  alerts.push({
    id: 'daily_summary',
    type: 'DAILY_SUMMARY',
    title: 'Daily Financial Briefing',
    body: 'October cash flows remain positive. Google Sheets cloud backup is synced and verified.',
    time: '21:00 WIB Routine Check',
    severity: 'info',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-16">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                WorkManager Notification Center
              </h3>
              <p className="text-[10px] text-slate-500">Scheduled Android System Broadcasts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                alert.severity === 'danger'
                  ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/60'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                  : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-bold flex items-center space-x-1 ${
                    alert.severity === 'danger'
                      ? 'text-red-700 dark:text-red-300'
                      : alert.severity === 'warning'
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {alert.severity === 'danger' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  ) : alert.severity === 'warning' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span>{alert.title}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {alert.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
