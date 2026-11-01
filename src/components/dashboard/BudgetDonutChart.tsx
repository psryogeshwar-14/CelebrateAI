'use client';

import React, { useState } from 'react';
import type { BudgetCategoryAllocation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import type { DonutSlice } from './DonutSvgView';
import { DonutSvgView } from './DonutSvgView';
import { BudgetLegendList } from './BudgetLegendList';

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

  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;
  const slices: DonutSlice[] = allocations.map((alloc, idx) => {
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

      <div
        role="img"
        aria-label="Donut chart showing budget percentage distribution"
        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
      >
        <DonutSvgView
          slices={slices}
          totalBudget={totalBudget}
          hoveredIdx={hoveredIdx}
          onHover={setHoveredIdx}
        />
        <BudgetLegendList
          slices={slices}
          hoveredIdx={hoveredIdx}
          onHover={setHoveredIdx}
        />
      </div>
    </div>
  );
}
