'use client';

import React, { useState } from 'react';
import { BudgetCategoryAllocation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';

interface BudgetDonutChartProps {
  allocations: BudgetCategoryAllocation[];
  totalBudget: number;
}

// Tonal amber/gold palette (No rainbow colors!)
const TONAL_AMBER_SHADES = [
  '#b45309', // Amber-700
  '#d97706', // Amber-600
  '#f59e0b', // Amber-500
  '#fbbf24', // Amber-400
  '#fcd34d', // Amber-300
  '#92400e', // Amber-800
  '#78350f', // Amber-900
  '#a8a29e', // Stone-400 (Logistics/Contingency)
  '#78716c', // Stone-500 (Contingency)
];

export function BudgetDonutChart({ allocations, totalBudget }: BudgetDonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedOffset = 0;
  const slices = allocations.map((alloc, idx) => {
    const fraction = alloc.amount / totalBudget;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += fraction * circumference;

    return {
      ...alloc,
      strokeDasharray,
      strokeDashoffset,
      color: TONAL_AMBER_SHADES[idx % TONAL_AMBER_SHADES.length],
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Budget Allocation Breakdown
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Tonal distribution strictly allocated to {formatINR(totalBudget)}
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 font-semibold text-stone-700 dark:text-stone-300">
          {allocations.length} Categories
        </span>
      </div>

      {/* Accessible Table alternative for screen readers */}
      <table className="sr-only">
        <caption>Budget allocation breakdown by category and percentage</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((a) => (
            <tr key={a.category}>
              <td>{a.displayName}</td>
              <td>{formatINR(a.amount)}</td>
              <td>{a.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual Chart and Legend Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut SVG */}
        <div className="md:col-span-5 flex items-center justify-center relative">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 select-none"
            role="img"
            aria-label="Donut chart showing budget percentage distribution"
          >
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-stone-100 dark:text-stone-800"
            />

            {/* Slices */}
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
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Donut Center Display */}
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

        {/* Legend List */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={slice.category}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
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
      </div>
    </div>
  );
}
