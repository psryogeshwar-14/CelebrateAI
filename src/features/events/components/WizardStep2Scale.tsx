'use client';

import React from 'react';
import { EventType } from '@/lib/engine/types';
import { Users, IndianRupee, AlertCircle } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

interface WizardStep2ScaleProps {
  eventType: EventType;
  guestCount: number;
  setGuestCount: (g: number) => void;
  totalBudget: number;
  budgetDisplay: string;
  handleBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formErrors: Record<string, string>;
}

export function WizardStep2Scale({
  eventType,
  guestCount,
  setGuestCount,
  totalBudget,
  budgetDisplay,
  handleBudgetChange,
  formErrors,
}: WizardStep2ScaleProps) {
  const costPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;
  const isCateringTight =
    eventType === 'wedding'
      ? costPerGuest < 1500
      : eventType === 'birthday'
      ? costPerGuest < 600
      : costPerGuest < 250;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
          Scale & Total Budget
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          CelebrateAI uses Hamilton-Hare exact remainder allocation to divide your budget without rounding errors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Guest Count */}
        <div className="space-y-2">
          <label htmlFor="guest-count-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            Expected Guests ({guestCount})
          </label>
          <div className="relative">
            <Users className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              id="guest-count-input"
              type="number"
              min={5}
              max={5000}
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(5, parseInt(e.target.value, 10) || 5))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Quick presets */}
          <div className="flex gap-2 pt-1">
            {[50, 150, 250, 500].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setGuestCount(count)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium border ${
                  guestCount === count
                    ? 'border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {count} pax
              </button>
            ))}
          </div>
          {formErrors.guestCount && (
            <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{formErrors.guestCount}</span>
            </p>
          )}
        </div>

        {/* Total Budget */}
        <div className="space-y-2">
          <label htmlFor="budget-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            Total Target Budget (INR ₹)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              id="budget-input"
              type="text"
              value={budgetDisplay}
              onChange={handleBudgetChange}
              placeholder="15,00,000"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-medium"
            />
          </div>

          {/* Quick budget presets */}
          <div className="flex gap-2 pt-1">
            {[200000, 500000, 1000000, 2500000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  handleBudgetChange({
                    target: { value: String(amt) },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className={`flex-1 py-1 rounded-lg text-[11px] font-medium border truncate ${
                  totalBudget === amt
                    ? 'border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {amt >= 100000 ? `₹${amt / 100000}L` : `₹${amt / 1000}k`}
              </button>
            ))}
          </div>
          {formErrors.totalBudget && (
            <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{formErrors.totalBudget}</span>
            </p>
          )}
        </div>
      </div>

      {/* Real-time Math Feedback */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            Deterministic Budget Density
          </div>
          <div className="text-xs text-amber-800/80 dark:text-amber-300/80">
            Provides approx. <strong className="font-mono text-amber-950 dark:text-amber-100">{formatINR(costPerGuest)}</strong> per guest across all categories including contingency.
          </div>
          {isCateringTight && (
            <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center space-x-1 pt-1 font-medium">
              <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
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
    </div>
  );
}
