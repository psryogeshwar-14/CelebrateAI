'use client';

import React from 'react';
import { formatINR } from '@/lib/utils/deterministic';
import { DonutSlice } from './DonutSvgView';

interface BudgetLegendListProps {
  slices: DonutSlice[];
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
}

export function BudgetLegendList({
  slices,
  hoveredIdx,
  onHover,
}: BudgetLegendListProps) {
  return (
    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
      {slices.map((slice, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <div
            key={slice.category}
            onMouseEnter={() => onHover(idx)}
            onMouseLeave={() => onHover(null)}
            className={`p-2 rounded-xl border transition-all flex items-center justify-between ${
              isHovered
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40'
                : 'border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/50'
            }`}
          >
            <div className="flex items-center space-x-2 truncate">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                {slice.displayName}
              </span>
            </div>
            <div className="text-right shrink-0 ml-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                {formatINR(slice.amount)}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400">
                {slice.percentage}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
