'use client';

import React from 'react';

export type GanttFilterType = 'all' | 'pending' | 'overdue' | 'completed';

interface GanttFilterButtonsProps {
  filter: GanttFilterType;
  totalCount: number;
  pendingCount: number;
  overdueCount: number;
  completedCount: number;
  onFilterChange: (f: GanttFilterType) => void;
}

export function GanttFilterButtons({
  filter,
  totalCount,
  pendingCount,
  overdueCount,
  completedCount,
  onFilterChange,
}: GanttFilterButtonsProps) {
  return (
    <div className="flex items-center space-x-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
      <button
        type="button"
        onClick={() => onFilterChange('all')}
        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
          filter === 'all'
            ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
            : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        All ({totalCount})
      </button>
      <button
        type="button"
        onClick={() => onFilterChange('pending')}
        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
          filter === 'pending'
            ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
            : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        Pending ({pendingCount})
      </button>
      <button
        type="button"
        onClick={() => onFilterChange('overdue')}
        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
          filter === 'overdue'
            ? 'bg-white dark:bg-stone-900 text-rose-600 font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        Overdue ({overdueCount})
      </button>
      <button
        type="button"
        onClick={() => onFilterChange('completed')}
        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
          filter === 'completed'
            ? 'bg-white dark:bg-stone-900 text-emerald-600 font-bold shadow-xs'
            : 'text-stone-600 dark:text-stone-400'
        }`}
      >
        Done ({completedCount})
      </button>
    </div>
  );
}
