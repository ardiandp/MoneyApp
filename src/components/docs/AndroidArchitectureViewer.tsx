/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Comprehensive Android Architecture, PRD, ERD & Kotlin Source Code Viewer
 */

import React, { useState } from 'react';
import {
  FileText,
  Database,
  Layers,
  Code2,
  FolderTree,
  Copy,
  Check,
  Download,
  X,
  Workflow,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { prdDocument, erdSchemaSql, kotlinCodeLibrary, CodeFile } from '../../data/androidBlueprint';

interface AndroidArchitectureViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidArchitectureViewer: React.FC<AndroidArchitectureViewerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'prd' | 'userflow' | 'schema' | 'arch' | 'code'>('prd');
  const [selectedFile, setSelectedFile] = useState<CodeFile>(kotlinCodeLibrary[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Creator Finance — Android Architecture & Codebase
              </h2>
              <p className="text-xs text-slate-400">
                Production-grade Android specifications, SQLite Room ERD & Kotlin Jetpack Compose
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'prd'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. PRD Document</span>
          </button>

          <button
            onClick={() => setActiveTab('userflow')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'userflow'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>2. User Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'schema'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>3. Database ERD & SQLite</span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'arch'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Android Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>5. Kotlin Code Library ({kotlinCodeLibrary.length} Files)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-300 leading-relaxed font-sans">
          {/* TAB 1: PRD */}
          {activeTab === 'prd' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Product Requirement Document</h3>
                  <p className="text-slate-300 mt-1">
                    Formal technical and functional specification for the Creator Finance Android
                    application.
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-mono text-xs bg-slate-950 p-5 rounded-2xl border border-slate-800">
                {prdDocument}
              </div>
            </div>
          )}

          {/* TAB 2: USER FLOW */}
          {activeTab === 'userflow' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50">
                <h3 className="font-bold text-white text-sm">Application User Flow & State Machine</h3>
                <p className="text-slate-300 mt-1">
                  How users navigate between Authentication, Offline-First Room DB, Actions, and Google
                  Sheets background sync.
                </p>
              </div>

              {/* Visual Flow diagram cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-bold text-[10px]">
                    STAGE 1: AUTH & SECURITY
                  </span>
                  <h4 className="font-bold text-white text-sm">App Launch & Lock</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                    <li>Google Sign-In via Play Services Auth</li>
                    <li>Token exchange & Google Sheets ID binding</li>
                    <li>BiometricPrompt / 4-Digit PIN authentication</li>
                    <li>EncryptedSharedPreferences verification</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-400 font-bold text-[10px]">
                    STAGE 2: CORE CRUD & ROOM DB
                  </span>
                  <h4 className="font-bold text-white text-sm">Offline First Execution</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                    <li>Record Income / Expense / Debt / Budget</li>
                    <li>Instant insertion into SQLite Room DB (WAL mode)</li>
                    <li>Flag set to <code className="text-emerald-400">is_synced = 0</code></li>
                    <li>Flow emits new UI State to ViewModel instantly</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-teal-600/30 text-teal-400 font-bold text-[10px]">
                    STAGE 3: BACKGROUND SYNC
                  </span>
                  <h4 className="font-bold text-white text-sm">WorkManager Cloud Sync</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                    <li>NetworkState constraint triggers SyncWorker</li>
                    <li>Batches unsynced records to Google Sheets API</li>
                    <li>7 worksheets updated (Dashboard, Income, etc.)</li>
                    <li>Room marked <code className="text-blue-400">is_synced = 1</code></li>
                  </ul>
                </div>
              </div>

              {/* Detailed Flow Step Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">User Action</th>
                      <th className="p-3">Android Component</th>
                      <th className="p-3">Database / Network Operation</th>
                      <th className="p-3">UI Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-3 font-semibold text-white">Record Invoice Payment</td>
                      <td className="p-3 text-blue-400">IncomeViewModel.kt</td>
                      <td className="p-3 text-emerald-400">IncomeDao.insertIncome(entity)</td>
                      <td className="p-3">Toast notification + Dashboard balance recalculation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Record Debt Repayment</td>
                      <td className="p-3 text-blue-400">DebtViewModel.kt</td>
                      <td className="p-3 text-emerald-400">DebtDao.updatePayment(id, paid, status)</td>
                      <td className="p-3">Progress bar updates, settled badge applied</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Internet Reconnected</td>
                      <td className="p-3 text-blue-400">WorkManager</td>
                      <td className="p-3 text-teal-400">GoogleSheetsSyncWorker.doWork()</td>
                      <td className="p-3">Top bar status changes from "Queued" to "100% Synced"</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Debt Due in 3 Days</td>
                      <td className="p-3 text-blue-400">NotificationScheduler.kt</td>
                      <td className="p-3 text-amber-400">Query debts WHERE due_date &lt;= 3 days</td>
                      <td className="p-3">System tray heads-up notification with WhatsApp action</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA & ERD */}
          {activeTab === 'schema' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/50">
                <h3 className="font-bold text-white text-sm">Room Database Schema & ERD Specifications</h3>
                <p className="text-slate-300 mt-1">
                  Complete SQLite DDL, primary keys, foreign keys, index recommendations, and exportable
                  Room schema.
                </p>
              </div>

              {/* Table entities visual cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'users', count: '1 record', desc: 'Google Auth & Workbook Metadata' },
                  { name: 'income_transactions', count: 'Indexed', desc: '10 Funding Sources + Category' },
                  { name: 'expense_transactions', count: 'Indexed', desc: '14 Expense Purposes + Location' },
                  { name: 'debts', count: 'Indexed', desc: 'Hutang & Piutang with Due Dates' },
                  { name: 'budgets', count: 'Unique', desc: 'Monthly limits with Guardrails' },
                  { name: 'savings_goals', count: 'Milestones', desc: 'Targets with Projected Dates' },
                  { name: 'categories', count: 'Master', desc: 'Visual icons & color hexes' },
                  { name: 'sync_logs', count: 'Audit', desc: 'Google Sheets sync history' },
                ].map((tbl, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-teal-400 font-mono font-bold uppercase">
                      {tbl.count}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{tbl.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{tbl.desc}</p>
                  </div>
                ))}
              </div>

              {/* Raw SQL DDL */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-300">
                <pre>{erdSchemaSql}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: ARCHITECTURE & FOLDER TREE */}
          {activeTab === 'arch' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-800/50">
                <h3 className="font-bold text-white text-sm">Clean Architecture & Package Structure</h3>
                <p className="text-slate-300 mt-1">
                  Unidirectional Data Flow (UDF), Hilt Dependency Injection, Room Single Source of Truth,
                  and APK folder layout.
                </p>
              </div>

              {/* Folder Tree Diagram */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300">
                <pre className="text-blue-300">
{`app/
├── src/main/
│   ├── AndroidManifest.xml
│   ├── java/com/creatorfinance/app/
│   │   ├── CreatorFinanceApp.kt           # @HiltAndroidApp
│   │   ├── MainActivity.kt                # ComponentActivity & Compose Root
│   │   ├── data/
│   │   │   ├── local/
│   │   │   │   ├── AppDatabase.kt         # RoomDatabase with MIGRATION
│   │   │   │   ├── dao/
│   │   │   │   │   ├── IncomeDao.kt
│   │   │   │   │   ├── ExpenseDao.kt
│   │   │   │   │   ├── DebtDao.kt
│   │   │   │   │   ├── BudgetDao.kt
│   │   │   │   │   └── SavingsGoalDao.kt
│   │   │   │   └── entity/
│   │   │   │       ├── IncomeEntity.kt
│   │   │   │       ├── ExpenseEntity.kt
│   │   │   │       ├── DebtEntity.kt
│   │   │   │       ├── BudgetEntity.kt
│   │   │   │       └── SavingsGoalEntity.kt
│   │   │   ├── repository/
│   │   │   │   └── FinanceRepositoryImpl.kt # Implements Room + Sheets sync
│   │   │   └── remote/
│   │   │       └── GoogleSheetsApiHelper.kt # Google API Client batchUpdate
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   │   └── FinanceRepository.kt   # Clean domain contract
│   │   │   └── usecase/
│   │   ├── di/
│   │   │   ├── DatabaseModule.kt          # Hilt Room DI
│   │   │   └── RepositoryModule.kt        # Hilt Repository DI
│   │   ├── sync/
│   │   │   ├── GoogleSheetsSyncWorker.kt  # WorkManager CoroutineWorker
│   │   │   └── NotificationScheduler.kt   # Debt & Budget Threshold Worker
│   │   └── ui/
│   │       ├── navigation/
│   │       │   ├── NavGraph.kt            # Type-Safe Compose Navigation
│   │       │   └── Screen.kt
│   │       ├── screens/
│   │       │   ├── DashboardScreen.kt
│   │       │   ├── IncomeScreen.kt
│   │       │   ├── ExpenseScreen.kt
│   │       │   ├── DebtCenterScreen.kt
│   │       │   ├── BudgetScreen.kt
│   │       │   ├── CalendarScreen.kt
│   │       │   ├── ReportsScreen.kt
│   │       │   └── SettingsScreen.kt
│   │       ├── viewmodel/
│   │       │   ├── DashboardViewModel.kt
│   │       │   ├── DebtViewModel.kt
│   │       │   └── BudgetViewModel.kt
│   │       └── theme/
│   │           ├── Color.kt               # #2563EB, #10B981, #F59E0B, #EF4444
│   │           ├── Theme.kt               # Material 3 DynamicTheme
│   │           └── Type.kt
│   └── res/
│       ├── values/
│       └── mipmap/
└── build.gradle.kts                       # Compose, Room, Hilt, WorkManager`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: KOTLIN CODE LIBRARY */}
          {activeTab === 'code' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
              {/* File list sidebar */}
              <div className="md:col-span-1 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 overflow-y-auto max-h-[600px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                  Production Kotlin Files
                </span>
                {kotlinCodeLibrary.map((file) => (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedFile.filename === file.filename
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{file.filename}</span>
                    <span className="text-[9px] uppercase px-1 rounded bg-black/20 text-slate-300">
                      {file.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Code display pane */}
              <div className="md:col-span-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs">{selectedFile.filename}</span>
                    <p className="text-[10px] text-slate-400">{selectedFile.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadFile}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      title="Download Kotlin File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 font-mono text-xs overflow-auto text-emerald-300 bg-slate-950">
                  <pre>{selectedFile.code}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
