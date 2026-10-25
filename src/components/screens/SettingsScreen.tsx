/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Settings & Security Module
 */

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Fingerprint,
  Moon,
  Sun,
  Coins,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode } from '../../types/finance';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportJsonBackup,
    importJsonBackup,
    exportToExcel,
    resetToSampleData,
    lockApp,
  } = useFinance();

  const [pinInput, setPinInput] = useState(settings.pinCode);
  const [showPinEditor, setShowPinEditor] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importJsonBackup(content);
        if (success) {
          alert('Database restored successfully from JSON backup!');
        } else {
          alert('Failed to parse backup file. Please check JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">App Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Preferences, Currencies & Biometric Security
        </p>
      </div>

      {/* Currency & Localization */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Primary Currency
            </h3>
            <p className="text-[10px] text-slate-500">Format display across all screens</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['IDR', 'USD', 'EUR'] as CurrencyCode[]).map((cur) => (
            <button
              key={cur}
              onClick={() => updateSettings({ currency: cur })}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                settings.currency === cur
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cur === 'IDR' ? 'IDR (Rp)' : cur === 'USD' ? 'USD ($)' : 'EUR (€)'}
            </button>
          ))}
        </div>
      </div>

      {/* Security & Biometrics */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Hardware Security & Biometrics
            </h3>
            <p className="text-[10px] text-slate-500">Android BiometricPrompt & PIN Protection</p>
          </div>
        </div>

        {/* Enable PIN Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Enable 4-Digit Security PIN
            </h4>
            <p className="text-[10px] text-slate-500">Requires PIN on app launch or lock</p>
          </div>
          <button
            onClick={() => updateSettings({ pinEnabled: !settings.pinEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.pinEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.pinEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Change PIN Input */}
        {settings.pinEnabled && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Current PIN: ••••
              </span>
              <button
                onClick={() => setShowPinEditor(!showPinEditor)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold"
              >
                {showPinEditor ? 'Cancel' : 'Change PIN'}
              </button>
            </div>

            {showPinEditor && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs text-center font-bold tracking-widest text-slate-900 dark:text-slate-100 w-36"
                />
                <button
                  onClick={() => {
                    if (pinInput.length === 4) {
                      updateSettings({ pinCode: pinInput });
                      setShowPinEditor(false);
                      alert('PIN updated successfully!');
                    } else {
                      alert('PIN must be exactly 4 digits');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Save PIN
                </button>
              </div>
            )}

            <button
              onClick={lockApp}
              className="w-full mt-1 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Test Lock Now</span>
            </button>
          </div>
        )}

        {/* Biometrics Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Fingerprint & Face Unlock
            </h4>
            <p className="text-[10px] text-slate-500">Android BiometricManager integration</p>
          </div>
          <button
            onClick={() => updateSettings({ biometricsEnabled: !settings.biometricsEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.biometricsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Backup & Data Management */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Backup & Data Persistence
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={exportJsonBackup}
            className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export JSON</span>
          </button>

          <label className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>

        <button
          onClick={exportToExcel}
          className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-300"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export All Tables to Excel (.xlsx)</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Reset database to clean Creator & Freelancer sample seed data?')) {
              resetToSampleData();
              alert('Database reset to initial sample data.');
            }
          }}
          className="w-full flex items-center justify-center space-x-1.5 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Clean Creator Sample Data</span>
        </button>
      </div>

      {/* App Info Footer */}
      <div className="p-3 text-center text-slate-400 text-[11px] space-y-1">
        <p className="font-bold text-slate-500 dark:text-slate-400">Creator Finance v1.0.0 (Build 101)</p>
        <p>Offline First Room Architecture • Material Design 3 • Google Sheets API</p>
      </div>
    </div>
  );
};
