/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Quick Add Transaction Bottom Sheet Modal
 */

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Scale,
  Calendar,
  Tag,
  FileText,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { FundingSource, ExpensePurpose, DebtType } from '../../types/finance';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense' | 'debt';
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'income',
}) => {
  const { addIncome, addExpense, addDebt } = useFinance();

  const [modalTab, setModalTab] = useState<'income' | 'expense' | 'debt'>(defaultType);

  // Common Fields
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-10-24');

  // Income Fields
  const [fundingSource, setFundingSource] = useState<FundingSource>('Client Payment');
  const [incomeCategory, setIncomeCategory] = useState('Client Work');
  const [incomeDesc, setIncomeDesc] = useState('');

  // Expense Fields
  const [expensePurpose, setExpensePurpose] = useState<ExpensePurpose>('Business');
  const [expenseCategory, setExpenseCategory] = useState('Software & Cloud');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseLocation, setExpenseLocation] = useState('Jakarta Studio');

  // Debt Fields
  const [debtType, setDebtType] = useState<DebtType>('DEBT');
  const [personName, setPersonName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+628');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [debtNotes, setDebtNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (modalTab === 'income') {
      addIncome({
        date,
        amount: parsedAmount,
        fundingSource,
        category: incomeCategory,
        description: incomeDesc.trim() || `${fundingSource} Income`,
      });
    } else if (modalTab === 'expense') {
      addExpense({
        date,
        amount: parsedAmount,
        expensePurpose,
        category: expenseCategory,
        notes: expenseNotes.trim() || `${expensePurpose} Expense`,
        location: expenseLocation,
      });
    } else {
      if (!personName.trim()) {
        alert('Please enter a contact name');
        return;
      }
      addDebt({
        type: debtType,
        personName: personName.trim(),
        phoneNumber: phoneNumber.trim(),
        amount: parsedAmount,
        paidAmount: 0,
        date,
        dueDate,
        notes: debtNotes.trim() || 'Recorded debt',
      });
    }

    onClose();
    setAmount('');
    setIncomeDesc('');
    setExpenseNotes('');
    setPersonName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Record Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setModalTab('income')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
              modalTab === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Income</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('expense')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
              modalTab === 'expense'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('debt')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
              modalTab === 'debt'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Debt</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tab Specific Fields */}
          {modalTab === 'income' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Funding Source
                </label>
                <select
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value as FundingSource)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="Client Payment">Client Payment</option>
                  <option value="Affiliate">Affiliate Commission</option>
                  <option value="Business">Business / Product Sales</option>
                  <option value="Freelance">Freelance Project</option>
                  <option value="Salary">Salary</option>
                  <option value="Investment">Investment Dividends</option>
                  <option value="Rental">Rental Income</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Cashback">Cashback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  placeholder="e.g. Brand Deals, Consulting, AdSense"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  placeholder="e.g. Milestone 1 payment for mobile UI"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
            </>
          )}

          {modalTab === 'expense' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Purpose
                </label>
                <select
                  value={expensePurpose}
                  onChange={(e) => setExpensePurpose(e.target.value as ExpensePurpose)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="Business">Business & Operations</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transport & Fuel</option>
                  <option value="Internet">Internet & Telecom</option>
                  <option value="Shopping">Shopping & Gear</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Education">Education & Courses</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Housing">Housing & Studio</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  placeholder="e.g. Software & Cloud, Equipment Rental"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="e.g. Figma annual seat renewal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={expenseLocation}
                  onChange={(e) => setExpenseLocation(e.target.value)}
                  placeholder="e.g. Senopati Cafe / Online"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </>
          )}

          {modalTab === 'debt' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDebtType('DEBT')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    debtType === 'DEBT'
                      ? 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  I Owe (Hutang)
                </button>
                <button
                  type="button"
                  onClick={() => setDebtType('RECEIVABLE')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    debtType === 'RECEIVABLE'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  They Owe Me (Piutang)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Person or Company Name
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="e.g. PT Nusantara Media or John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (for WhatsApp reminders)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+62812345678"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Due Maturity Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={debtNotes}
                  onChange={(e) => setDebtNotes(e.target.value)}
                  placeholder="e.g. Invoice #2026-88 milestone completion"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3 rounded-2xl text-white font-bold text-sm shadow-md transition-all ${
                modalTab === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  : modalTab === 'expense'
                  ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
              }`}
            >
              Save {modalTab.toUpperCase()} Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
