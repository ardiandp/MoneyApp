/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Debt Center Module (Hutang & Piutang)
 */

import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Phone,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { DebtRecord, DebtType } from '../../types/finance';

interface DebtCenterScreenProps {
  onOpenAddModal: (type?: 'debt') => void;
}

export const DebtCenterScreen: React.FC<DebtCenterScreenProps> = ({ onOpenAddModal }) => {
  const {
    debts,
    deleteDebt,
    recordDebtPayment,
    formatCurrency,
    totalDebt,
    totalReceivable,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<DebtType>('DEBT');
  const [paymentModalDebt, setPaymentModalDebt] = useState<DebtRecord | null>(null);
  const [paymentInput, setPaymentInput] = useState('');

  // Filter current type
  const currentList = debts.filter((d) => d.type === activeTab);

  // Compute status metrics
  const activeCount = currentList.filter((d) => d.status === 'ACTIVE' || d.status === 'PARTIAL').length;
  const overdueCount = currentList.filter((d) => d.status === 'OVERDUE').length;
  const paidCount = currentList.filter((d) => d.status === 'PAID').length;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalDebt) return;
    const amount = parseFloat(paymentInput);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid repayment amount');
      return;
    }
    recordDebtPayment(paymentModalDebt.id, amount);
    setPaymentModalDebt(null);
    setPaymentInput('');
  };

  // Helper for due badge
  const getDueDaysBadge = (dueDateStr: string, status: string) => {
    if (status === 'PAID') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Settled
        </span>
      );
    }
    const today = new Date('2026-10-24');
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || status === 'OVERDUE') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          <span>{Math.abs(diffDays)}d Overdue</span>
        </span>
      );
    } else if (diffDays === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
          Due Today
        </span>
      );
    } else if (diffDays <= 3) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Due in {diffDays} days
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          Due in {diffDays} days
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Due in {diffDays} days
        </span>
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Debt Center</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hutang Piutang Ledger & Due Reminder Engine
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal('debt')}
          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Record {activeTab === 'DEBT' ? 'Debt' : 'Receivable'}</span>
        </button>
      </div>

      {/* Main Switcher Tabs (Hutang vs Piutang) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('DEBT')}
          className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'DEBT'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>I Owe (Hutang)</span>
        </button>

        <button
          onClick={() => setActiveTab('RECEIVABLE')}
          className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'RECEIVABLE'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>They Owe Me (Piutang)</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 font-medium">Outstanding</p>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {formatCurrency(activeTab === 'DEBT' ? totalDebt : totalReceivable)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 font-medium">Active / Partial</p>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {activeCount} Records
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 font-medium">Overdue</p>
          <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5">
            {overdueCount} Alerts
          </p>
        </div>
      </div>

      {/* List of Debt / Receivable Items */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <Scale className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              No {activeTab === 'DEBT' ? 'debt' : 'receivable'} records recorded yet.
            </p>
          </div>
        ) : (
          currentList.map((item) => {
            const remaining = Math.max(0, item.amount - item.paidAmount);
            const progress = Math.min(100, Math.round((item.paidAmount / item.amount) * 100));

            return (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3"
              >
                {/* Person Name & Due Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.personName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.notes}</p>
                  </div>
                  <div>{getDueDaysBadge(item.dueDate, item.status)}</div>
                </div>

                {/* Amount and Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">
                      Paid: {formatCurrency(item.paidAmount)} of {formatCurrency(item.amount)}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Remains: {formatCurrency(remaining)}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progress}%` }}
                      className={`h-full rounded-full transition-all ${
                        item.status === 'PAID'
                          ? 'bg-emerald-500'
                          : activeTab === 'DEBT'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Contact and Actions Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  {/* Direct Contact links */}
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://wa.me/${item.phoneNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${item.phoneNumber}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Repayment and Delete buttons */}
                  <div className="flex items-center space-x-2">
                    {item.status !== 'PAID' && (
                      <button
                        onClick={() => {
                          setPaymentModalDebt(item);
                          setPaymentInput(remaining.toString());
                        }}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-xs"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this record?')) {
                          deleteDebt(item.id);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-red-50 text-red-500 dark:hover:bg-red-950/40"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Repayment Record Modal */}
      {paymentModalDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Record Repayment for {paymentModalDebt.personName}
            </h3>
            <p className="text-xs text-slate-500">
              Remaining debt balance:{' '}
              <strong className="text-slate-900 dark:text-slate-100">
                {formatCurrency(paymentModalDebt.amount - paymentModalDebt.paidAmount)}
              </strong>
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (Rp)
                </label>
                <input
                  type="number"
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalDebt(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
