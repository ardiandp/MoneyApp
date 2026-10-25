/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Material Design 3 PIN Lock Screen & Biometric Authentication
 */

import React, { useState } from 'react';
import { Lock, Fingerprint, Delete, ShieldAlert } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const PinLockScreen: React.FC = () => {
  const { unlockWithPin, unlockWithBiometrics, settings } = useFinance();
  const [pinDigits, setPinDigits] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDigitPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const nextPin = pinDigits + digit;
      setPinDigits(nextPin);
      setErrorMsg(null);

      if (nextPin.length === 4) {
        // Attempt unlock
        const success = unlockWithPin(nextPin);
        if (!success) {
          setErrorMsg('Incorrect PIN. Please try again.');
          setTimeout(() => {
            setPinDigits('');
          }, 400);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinDigits((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleBiometricClick = () => {
    const success = unlockWithBiometrics();
    if (!success) {
      setErrorMsg('Biometric authentication failed. Use PIN.');
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="w-full flex flex-col items-center pt-8 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
          <Lock className="w-7 h-7" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold tracking-tight">Creator Finance</h2>
          <p className="text-xs text-slate-400 mt-0.5">Enter 4-Digit Security PIN</p>
        </div>

        {/* PIN Dot Indicators */}
        <div className="flex items-center space-x-4 pt-4">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinDigits.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-blue-500 scale-110 shadow-sm shadow-blue-500/50'
                    : 'bg-slate-700 border border-slate-600'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs text-red-400 font-medium animate-shake pt-1">{errorMsg}</p>
        )}
      </div>

      {/* Numeric Keypad (Material 3 style) */}
      <div className="w-full max-w-xs space-y-3 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigitPress(num)}
              className="h-16 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:bg-blue-600 text-xl font-semibold flex items-center justify-center transition-all m3-ripple"
            >
              {num}
            </button>
          ))}

          {/* Biometrics button */}
          <button
            onClick={handleBiometricClick}
            disabled={!settings.biometricsEnabled}
            className="h-16 rounded-full bg-slate-800/50 hover:bg-slate-700/60 active:bg-slate-600 flex items-center justify-center transition-all text-blue-400"
            title="Biometric Fingerprint"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* Zero */}
          <button
            onClick={() => handleDigitPress('0')}
            className="h-16 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:bg-blue-600 text-xl font-semibold flex items-center justify-center transition-all m3-ripple"
          >
            0
          </button>

          {/* Backspace Delete */}
          <button
            onClick={handleDelete}
            className="h-16 rounded-full bg-slate-800/50 hover:bg-slate-700/60 active:bg-slate-600 flex items-center justify-center transition-all text-slate-300"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-500 pt-2">
          Default seed PIN: <span className="text-blue-400 font-mono font-bold">1234</span>
        </p>
      </div>
    </div>
  );
};
