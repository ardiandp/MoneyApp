/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - More Menu Bottom Sheet
 */

import React from 'react';
import {
  Calendar,
  Target,
  FileBarChart,
  Cloud,
  Settings,
  Code2,
  X,
  FileText,
  Database,
  ArrowRight,
} from 'lucide-react';
import { NavTab } from './M3NavigationBar';

interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenArchitecture: () => void;
}

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenArchitecture,
}) => {
  if (!isOpen) return null;

  const items = [
    {
      id: 'calendar' as NavTab,
      label: 'Financial Calendar',
      desc: 'Day-by-day cash flow & debt due dates',
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      id: 'savings' as NavTab,
      label: 'Savings Goals',
      desc: 'Milestones, laptop upgrade, emergency fund',
      icon: <Target className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      id: 'reports' as NavTab,
      label: 'Financial Reports',
      desc: 'Daily, weekly, monthly & Excel/PDF export',
      icon: <FileBarChart className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      id: 'sheets_sync' as NavTab,
      label: 'Google Sheets Sync',
      desc: 'Connected cloud workbook & background sync',
      icon: <Cloud className="w-5 h-5 text-teal-500" />,
      color: 'bg-teal-50 dark:bg-teal-950/50',
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings & Security',
      desc: 'PIN, biometrics, currency IDR/USD, themes',
      icon: <Settings className="w-5 h-5 text-slate-500" />,
      color: 'bg-slate-100 dark:bg-slate-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Navigation & Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore all Creator Finance modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Architecture Blueprint */}
        <div
          onClick={() => {
            onClose();
            onOpenArchitecture();
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white cursor-pointer shadow-md shadow-blue-500/20 hover:opacity-95 transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  PRD & KOTLIN
                </span>
              </div>
              <h3 className="text-sm font-bold mt-0.5">Android Architecture Blueprint</h3>
              <p className="text-xs text-blue-100">Room DB, DAOs, Hilt, WorkManager & Compose code</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80" />
        </div>

        {/* Menu list */}
        <div className="grid grid-cols-1 gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${item.color}`}>{item.icon}</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">Open</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
