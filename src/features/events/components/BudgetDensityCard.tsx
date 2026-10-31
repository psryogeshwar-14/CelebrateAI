'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

interface BudgetDensityCardProps {
  costPerGuest: number;
  totalBudget: number;
  isCateringTight: boolean;
}

export function BudgetDensityCard({
  costPerGuest,
  totalBudget,
  isCateringTight,
}: BudgetDensityCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-start justify-between">
      <div className="space-y-1">
        <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
          Deterministic Budget Density
        </div>
        <div className="text-xs text-amber-800/80 dark:text-amber-300/80">
          Provides approx.{' '}
          <strong className="font-mono text-amber-950 dark:text-amber-100">
            {formatINR(costPerGuest)}
          </strong>{' '}
          per guest across all categories including contingency.
        </div>
        {isCateringTight && (
          <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center space-x-1 pt-1 font-medium">
            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Catering budget is tight. Consider balanced or street food style.</span>
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="text-xs text-amber-800/80 dark:text-amber-300/80">Guaranteed Contingency</div>
        <div className="font-mono font-bold text-sm text-amber-900 dark:text-amber-100">
          {formatINR(Math.round(totalBudget * 0.1))} (10%)
        </div>
      </div>
    </div>
  );
}
