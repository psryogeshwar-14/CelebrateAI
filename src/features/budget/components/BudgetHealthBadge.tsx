import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface BudgetHealthBadgeProps {
  score: number;
  description: string;
}

export function BudgetHealthBadge({ score, description }: BudgetHealthBadgeProps) {
  const isHealthy = score >= 80;
  const isWarning = score >= 50 && score < 80;

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
        isHealthy
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
          : isWarning
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
      }`}
    >
      {isHealthy ? (
        <ShieldCheck className="w-3.5 h-3.5" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5" />
      )}
      <span>
        Health: {score}/100 ({description})
      </span>
    </div>
  );
}
