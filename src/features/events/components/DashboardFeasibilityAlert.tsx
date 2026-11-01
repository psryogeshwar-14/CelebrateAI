'use client';

import React from 'react';
import type { FeasibilityConflict } from '@/lib/engine/types';
import { ShieldAlert } from 'lucide-react';

interface DashboardFeasibilityAlertProps {
  conflicts: FeasibilityConflict[];
}

export function DashboardFeasibilityAlert({ conflicts }: DashboardFeasibilityAlertProps) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
      <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Feasibility Advisory ({conflicts.length} Notes)</span>
      </div>
      <div className="space-y-1.5 pl-6">
        {conflicts.map((c) => (
          <div key={c.id} className="text-xs text-amber-900/80 dark:text-amber-300/80">
            <strong>{c.title}:</strong> {c.description}{' '}
            <span className="italic text-amber-700 dark:text-amber-400">({c.remediation})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
