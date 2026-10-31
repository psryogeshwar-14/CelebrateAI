'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';
import { KpiVendorsCard } from './KpiVendorsCard';

interface KpiCardsProps {
  totalBudget: number;
  totalPlanned: number;
  totalActual: number;
  completedTasks: number;
  totalTasks: number;
  bookedVendors: number;
  totalVendors: number;
  healthScore: 'healthy' | 'tight' | 'over_budget';
  healthDescription: string;
  onOpenEditSpend?: () => void;
}

export function KpiCards({
  totalBudget,
  totalPlanned,
  totalActual,
  completedTasks,
  totalTasks,
  bookedVendors,
  totalVendors,
  healthScore,
  healthDescription,
  onOpenEditSpend,
}: KpiCardsProps) {
  const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const vendorPercentage = totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0;
  const remainingBudget = totalBudget - totalActual;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Budget */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
        <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
          Total Budget
        </span>
        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
          {formatINR(totalBudget)}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Locked ceiling amount
        </p>
      </div>

      {/* 2. Planned Allocation */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
        <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
          Planned Spend
        </span>
        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
          {formatINR(totalPlanned)}
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>Allocated: 100%</span>
        </div>
      </div>

      {/* 3. Actual Spend (with Edit Button) */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1 relative group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Actual Spend
          </span>
          {onOpenEditSpend && (
            <button
              type="button"
              onClick={onOpenEditSpend}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center space-x-0.5"
            >
              <span>Edit</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">
          {formatINR(totalActual)}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Remaining: <span className="font-semibold text-stone-700 dark:text-stone-300">{formatINR(remainingBudget)}</span>
        </p>
      </div>

      {/* 4. Tasks Completed */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Tasks Completed
          </span>
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            {taskPercentage}%
          </span>
        </div>
        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
          {completedTasks} <span className="text-sm font-normal text-stone-400">/ {totalTasks}</span>
        </div>
        <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all"
            style={{ width: `${taskPercentage}%` }}
          />
        </div>
      </div>

      {/* 5. Vendors & Health Badge */}
      <KpiVendorsCard
        bookedVendors={bookedVendors}
        totalVendors={totalVendors}
        vendorPercentage={vendorPercentage}
        healthScore={healthScore}
        healthDescription={healthDescription}
      />
    </div>
  );
}
