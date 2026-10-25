/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Main Application Root
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { AndroidDeviceFrame } from './components/android/AndroidDeviceFrame';
import { M3TopAppBar } from './components/android/M3TopAppBar';
import { M3NavigationBar, NavTab } from './components/android/M3NavigationBar';
import { MoreMenuSheet } from './components/android/MoreMenuSheet';
import { PinLockScreen } from './components/security/PinLockScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { IncomeScreen } from './components/screens/IncomeScreen';
import { ExpenseScreen } from './components/screens/ExpenseScreen';
import { DebtCenterScreen } from './components/screens/DebtCenterScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { SavingsGoalsScreen } from './components/screens/SavingsGoalsScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { GoogleSheetsSyncScreen } from './components/screens/GoogleSheetsSyncScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NotificationCenterModal } from './components/modals/NotificationCenterModal';
import { AndroidArchitectureViewer } from './components/docs/AndroidArchitectureViewer';
import { Plus } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isLocked, lockApp, settings } = useFinance();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [viewMode, setViewMode] = useState<'phone' | 'fullscreen'>('phone');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultType, setAddModalDefaultType] = useState<'income' | 'expense' | 'debt'>('income');

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Creator Finance';
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expenses';
      case 'debt_center':
        return 'Debt Center';
      case 'budget':
        return 'Budgets';
      case 'savings':
        return 'Savings Goals';
      case 'calendar':
        return 'Calendar';
      case 'reports':
        return 'Reports';
      case 'sheets_sync':
        return 'Google Sheets';
      case 'settings':
        return 'Settings';
      default:
        return 'Creator Finance';
    }
  };

  const handleOpenAddModal = (defaultType: 'income' | 'expense' | 'debt' = 'income') => {
    setAddModalDefaultType(defaultType);
    setIsAddModalOpen(true);
  };

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
      <AndroidDeviceFrame
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      >
        {/* If app is locked with PIN */}
        {isLocked ? (
          <PinLockScreen />
        ) : (
          <>
            {/* Material 3 Top App Bar */}
            <M3TopAppBar
              title={getTitle()}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenSync={() => setCurrentTab('sheets_sync')}
              onLockApp={lockApp}
            />

            {/* Active Screen View */}
            <main className="flex-1">
              {currentTab === 'dashboard' && (
                <DashboardScreen
                  onNavigate={setCurrentTab}
                  onOpenAddModal={handleOpenAddModal}
                />
              )}
              {currentTab === 'income' && (
                <IncomeScreen onOpenAddModal={() => handleOpenAddModal('income')} />
              )}
              {currentTab === 'expense' && (
                <ExpenseScreen onOpenAddModal={() => handleOpenAddModal('expense')} />
              )}
              {currentTab === 'debt_center' && (
                <DebtCenterScreen onOpenAddModal={() => handleOpenAddModal('debt')} />
              )}
              {currentTab === 'budget' && <BudgetScreen />}
              {currentTab === 'savings' && <SavingsGoalsScreen />}
              {currentTab === 'calendar' && <CalendarScreen />}
              {currentTab === 'reports' && <ReportsScreen />}
              {currentTab === 'sheets_sync' && <GoogleSheetsSyncScreen />}
              {currentTab === 'settings' && <SettingsScreen />}
            </main>

            {/* Floating Action Button (FAB) */}
            <button
              onClick={() => handleOpenAddModal('income')}
              className="fixed right-6 bottom-20 z-40 w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center m3-ripple"
              title="Quick Add Transaction"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Material 3 Bottom Navigation Bar */}
            <M3NavigationBar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
            />
          </>
        )}

        {/* Global Modals */}
        <MoreMenuSheet
          isOpen={isMoreMenuOpen}
          onClose={() => setIsMoreMenuOpen(false)}
          onSelectTab={setCurrentTab}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          defaultType={addModalDefaultType}
        />

        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />

        <NotificationCenterModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <AndroidArchitectureViewer
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </AndroidDeviceFrame>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
