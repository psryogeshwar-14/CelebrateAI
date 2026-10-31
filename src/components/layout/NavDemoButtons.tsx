'use client';

import React from 'react';
import { EventType } from '@/lib/engine/types';

interface NavDemoButtonsProps {
  activeDemoId: string | null;
  onSelectDemo: (demoType: EventType) => void;
}

export function NavDemoButtons({ activeDemoId, onSelectDemo }: NavDemoButtonsProps) {
  return (
    <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80">
      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-stone-300 px-2">
        Demo:
      </span>
      <button
        type="button"
        onClick={() => onSelectDemo('wedding')}
        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
          activeDemoId === 'wedding'
            ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
      >
        Wedding
      </button>
      <button
        type="button"
        onClick={() => onSelectDemo('birthday')}
        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
          activeDemoId === 'birthday'
            ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
      >
        Birthday
      </button>
      <button
        type="button"
        onClick={() => onSelectDemo('community_event')}
        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
          activeDemoId === 'community_event'
            ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
        }`}
      >
        Community
      </button>
    </div>
  );
}
