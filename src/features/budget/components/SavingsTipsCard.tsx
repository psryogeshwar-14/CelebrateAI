import React from 'react';
import { Lightbulb, Percent } from 'lucide-react';
import type { ValidatedSavingsTip } from '@/lib/ai/validate';
import { formatINR } from '@/lib/utils/deterministic';

interface SavingsTipsCardProps {
  tips: ValidatedSavingsTip[];
}

export function SavingsTipsCard({ tips }: SavingsTipsCardProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold">Smart Optimization & Savings Tips</h3>
          <p className="text-xs text-stone-500">
            Actionable strategies to stretch your budget without sacrificing guest experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-stone-900 dark:text-stone-100 capitalize">
                {tip.categoryDisplayName || tip.category}
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Percent className="w-2.5 h-2.5" />
                <span>Save ~{tip.percentage}% ({formatINR(tip.calculatedSavingsAmount)})</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {tip.advice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
