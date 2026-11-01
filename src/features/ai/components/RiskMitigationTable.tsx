import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { ValidatedEnrichmentOutput } from '@/lib/ai/validate';

interface RiskMitigationTableProps {
  risks?: ValidatedEnrichmentOutput['risks'];
}

export function RiskMitigationTable({ risks }: RiskMitigationTableProps) {
  if (!risks || risks.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
        No operational risks identified.
      </div>
    );
  }

  const impactStyles: Record<string, string> = {
    high: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300/40',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300/40',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300/40',
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold">Proactive Risk Mitigation Matrix</h3>
            <p className="text-xs text-stone-500">
              Anticipate weather, vendor, logistics, and guest challenges with clear contingency plans
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((item, idx) => {
          const impactKey = item.impact.toLowerCase();
          const impactBadgeClass =
            impactStyles[impactKey] ||
            'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300';

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-50">
                  {item.risk}
                </h4>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${impactBadgeClass}`}
                >
                  {item.impact}
                </span>
              </div>

              <div className="space-y-1 pt-1 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Mitigation Strategy
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.mitigation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
