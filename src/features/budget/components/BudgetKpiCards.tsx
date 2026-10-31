import React from 'react';
import { Wallet, DollarSign, TrendingDown, TrendingUp, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

interface BudgetKpiCardsProps {
  totalPlanned: number;
  totalActual: number;
  variance: number;
  isOverBudget: boolean;
  contingencyAmount: number;
  contingencyPercentage: number;
  guestCount: number;
}

export function BudgetKpiCards({
  totalPlanned,
  totalActual,
  variance,
  isOverBudget,
  contingencyAmount,
  contingencyPercentage,
  guestCount,
}: BudgetKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Planned */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Total Planned Budget</span>
          <Wallet className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
          {formatINR(totalPlanned)}
        </div>
        <p className="text-xs text-stone-500">
          Deterministic allocation for {guestCount} guests
        </p>
      </div>

      {/* Total Actual Spend */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Actual Spend to Date</span>
          <DollarSign className="w-4 h-4 text-stone-600" />
        </div>
        <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
          {formatINR(totalActual)}
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full ${
              isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.min(
                100,
                totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Variance */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Remaining / Variance</span>
          {isOverBudget ? (
            <TrendingUp className="w-4 h-4 text-rose-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          )}
        </div>
        <div
          className={`text-2xl font-black ${
            isOverBudget
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {formatINR(Math.abs(variance))}
        </div>
        <p className="text-xs text-stone-500">
          {isOverBudget
            ? 'Exceeding planned target'
            : `${Math.round(totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0)}% buffer left`}
        </p>
      </div>

      {/* Contingency Buffer */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Emergency Contingency</span>
          <ShieldCheck className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-amber-600 dark:text-amber-500">
          {formatINR(contingencyAmount)}
        </div>
        <p className="text-xs text-stone-500">
          {contingencyPercentage}% locked emergency cushion
        </p>
      </div>
    </div>
  );
}
