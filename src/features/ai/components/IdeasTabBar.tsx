'use client';

import React from 'react';
import { Palette, Utensils, ShieldAlert, Clock } from 'lucide-react';

export type IdeaTabKey = 'themes' | 'menu' | 'risks' | 'run_sheet';

interface IdeasTabBarProps {
  activeTab: IdeaTabKey;
  onTabChange: (_tab: IdeaTabKey) => void;
}

const TABS: Array<{ key: IdeaTabKey; label: string; icon: React.ReactNode }> = [
  { key: 'themes', label: '3 Personalized Themes', icon: <Palette className="w-3.5 h-3.5" /> },
  { key: 'menu', label: 'Regional Menu', icon: <Utensils className="w-3.5 h-3.5" /> },
  { key: 'risks', label: 'Risk Matrix', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  { key: 'run_sheet', label: 'Day-Of Run Sheet', icon: <Clock className="w-3.5 h-3.5" /> },
];

export function IdeasTabBar({ activeTab, onTabChange }: IdeasTabBarProps) {
  return (
    <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto pb-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
