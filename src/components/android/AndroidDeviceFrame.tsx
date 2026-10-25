/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creator Finance - Android Device Frame (Pixel 8 Pro Mockup & Responsive Wrapper)
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Monitor } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  viewMode: 'phone' | 'fullscreen';
  onChangeViewMode: (mode: 'phone' | 'fullscreen') => void;
  onOpenArchitecture: () => void;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  children,
  viewMode,
  onChangeViewMode,
  onOpenArchitecture,
}) => {
  const [currentTime, setCurrentTime] = useState('21:07');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (viewMode === 'fullscreen') {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
        {/* Top bar controls */}
        <div className="bg-slate-900 text-slate-300 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-tight">Creator Finance</span>
            <span className="bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded text-[10px] font-semibold border border-blue-500/30">
              Responsive Mode
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenArchitecture}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
            >
              PRD & Kotlin Code
            </button>
            <button
              onClick={() => onChangeViewMode('phone')}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-200 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Switch to Android Phone</span>
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-2xl w-full mx-auto bg-white dark:bg-slate-900 shadow-xl min-h-screen flex flex-col relative pb-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-4 sm:py-8 px-2 flex flex-col items-center justify-center">
      {/* Top Controller Bar */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 text-xs">Pixel 8 Pro (API 35)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenArchitecture}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm transition-all"
          >
            PRD & Kotlin Blueprint
          </button>
          <button
            onClick={() => onChangeViewMode('fullscreen')}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg transition-colors"
            title="Expand to Fullscreen View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Android Device Mockup Chassis */}
      <div className="relative w-full max-w-[400px] h-[840px] bg-slate-900 rounded-[44px] p-3 shadow-2xl shadow-blue-500/10 ring-1 ring-slate-800 ring-offset-2 ring-offset-slate-950 flex flex-col overflow-hidden">
        {/* Device screen bezel inner */}
        <div className="relative flex-1 w-full bg-white dark:bg-slate-900 rounded-[34px] overflow-hidden flex flex-col">
          {/* Android Status Bar */}
          <div className="h-7 w-full bg-slate-900 text-slate-200 px-5 flex items-center justify-between text-[11px] font-medium z-40 select-none">
            {/* Clock */}
            <span>{currentTime}</span>

            {/* Camera punch hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800" />

            {/* Status Icons */}
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center space-x-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Screen Content Scrollable Container */}
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col pb-20">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="absolute bottom-1 left-0 right-0 h-4 flex items-center justify-center pointer-events-none z-40">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full opacity-60" />
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[11px] text-slate-500">
          Jetpack Compose Material Design 3 • Room Database Engine • Google Sheets Cloud
        </p>
      </div>
    </div>
  );
};
