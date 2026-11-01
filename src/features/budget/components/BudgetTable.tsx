import React from 'react';
import { Edit3 } from 'lucide-react';
import type { BudgetCategoryAllocation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';

interface BudgetTableProps {
  allocations: BudgetCategoryAllocation[];
  actualSpends: Record<string, number>;
  onOpenEditModal: () => void;
}

export function BudgetTable({
  allocations,
  actualSpends,
  onOpenEditModal,
}: BudgetTableProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50">
            Category Breakdown & Actuals
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Compare planned allocations against actual vendor invoices.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenEditModal}
          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update Actual Spends</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 font-semibold uppercase text-[10px] tracking-wider border-b border-stone-200 dark:border-stone-800">
              <th className="py-3 px-5">Category</th>
              <th className="py-3 px-4">Allocation %</th>
              <th className="py-3 px-4 text-right">Planned Amount</th>
              <th className="py-3 px-4 text-right">Actual Spend</th>
              <th className="py-3 px-4 text-right">Variance</th>
              <th className="py-3 px-5">Description & Guidelines</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {allocations.map((alloc) => {
              const actual = actualSpends[alloc.category] || 0;
              const catVariance = alloc.amount - actual;
              const isOver = catVariance < 0;

              return (
                <tr
                  key={alloc.category}
                  className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                >
                  <td className="py-3.5 px-5 font-bold text-stone-900 dark:text-stone-100 capitalize">
                    {alloc.displayName || alloc.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-stone-600 dark:text-stone-400">
                    {alloc.percentage}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900 dark:text-stone-50">
                    {formatINR(alloc.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-700 dark:text-stone-300">
                    {actual > 0 ? (
                      formatINR(actual)
                    ) : (
                      <span className="text-stone-400 italic">Not set</span>
                    )}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono font-bold ${
                      isOver
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {actual > 0 ? (
                      `${isOver ? '+' : '-'}${formatINR(Math.abs(catVariance))}`
                    ) : (
                      <span className="text-stone-400 font-normal">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-stone-500 dark:text-stone-400 max-w-xs truncate">
                    {alloc.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
