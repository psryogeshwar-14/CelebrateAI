'use client';

import React from 'react';
import { formatINR } from '@/lib/utils/deterministic';
import type { BudgetCategoryAllocation } from '@/lib/engine/types';

export interface DonutSlice extends BudgetCategoryAllocation {
  strokeDasharray: string;
  strokeDashoffset: number;
  color: string;
}

interface DonutSvgViewProps {
  slices: DonutSlice[];
  totalBudget: number;
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
}

export function DonutSvgView({
  slices,
  totalBudget,
  hoveredIdx,
  onHover,
}: DonutSvgViewProps) {
  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="md:col-span-5 flex items-center justify-center relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 select-none"
        role="img"
        aria-label="Donut chart showing budget percentage distribution"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-100 dark:text-stone-800"
        />

        {slices.map((slice, idx) => (
          <circle
            key={slice.category}
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={slice.color}
            strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={slice.strokeDasharray}
            strokeDashoffset={slice.strokeDashoffset}
            strokeLinecap="butt"
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={() => onHover(idx)}
            onMouseLeave={() => onHover(null)}
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {activeItem ? activeItem.displayName : 'Total Budget'}
        </span>
        <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
          {activeItem ? formatINR(activeItem.amount) : formatINR(totalBudget)}
        </span>
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-500">
          {activeItem ? `${activeItem.percentage}%` : '100% Allocated'}
        </span>
      </div>
    </div>
  );
}
