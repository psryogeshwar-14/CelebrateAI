'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { BudgetDonutChart } from '@/components/dashboard/BudgetDonutChart';
import { EditSpendModal } from '@/components/dashboard/EditSpendModal';
import { formatINR } from '@/lib/utils/deterministic';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Edit3,
  Lightbulb,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export default function BudgetPage() {
  const { plan, aiEnrichment, actualSpends, updateCategoryActualSpend, isLoading } =
    useCelebrate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryNotes, setCategoryNotes] = useState<Record<string, string>>({});

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading Budget...
        </h2>
      </div>
    );
  }

  const { budget } = plan;
  const totalPlanned = budget.totalBudget;
  const totalActual = Object.values(actualSpends).reduce((acc, v) => acc + v, 0);
  const variance = totalPlanned - totalActual;
  const isOverBudget = variance < 0;

  // Contingency allocation
  const contingencyAlloc = budget.allocations.find((a) => a.category === 'contingency');
  const cateringAlloc = budget.allocations.find(
    (a) => a.category === 'catering' || a.category === 'food'
  );
  const perGuestCatering = cateringAlloc
    ? Math.round(cateringAlloc.amount / plan.input.guestCount)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Budget & Expense Manager" />

      {/* Top Budget KPIs */}
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
            Deterministic allocation for {plan.input.guestCount} guests
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
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0}% committed</span>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center space-x-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Actuals</span>
            </button>
          </div>
        </div>

        {/* Balance Remaining / Variance */}
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>{isOverBudget ? 'Over Budget By' : 'Remaining Balance'}</span>
            {isOverBudget ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div
            className={`text-2xl font-black ${
              isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {formatINR(Math.abs(variance))}
          </div>
          <p className="text-xs text-stone-500">
            {isOverBudget
              ? 'Exceeded baseline allocation'
              : `${formatINR(variance)} left in overall reserve`}
          </p>
        </div>

        {/* Budget Health Score */}
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>Health Status</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                budget.health.score === 'healthy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : budget.health.score === 'tight'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
              }`}
            >
              {budget.health.score}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Contingency: {contingencyAlloc?.percentage || 10}% ({formatINR(contingencyAlloc?.amount || 0)})
          </p>
        </div>
      </div>

      {/* Feasibility & Warnings Alerts */}
      {plan.feasibility.conflicts && plan.feasibility.conflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Budget Feasibility Observations</span>
          </div>
          <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
            {plan.feasibility.conflicts.map((conflict, idx) => (
              <li key={idx}>
                <strong>{conflict.title}:</strong> {conflict.description} ({conflict.remediation})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Donut Chart Visual Breakdown */}
      <BudgetDonutChart
        allocations={budget.allocations}
        totalBudget={budget.totalBudget}
      />

      {/* Interactive Category-by-Category Table */}
      <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Detailed Category Allocations & Actuals
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Strictly rounded using Hamilton-Hare Largest Remainder Method
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update All Actuals</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-xs uppercase font-semibold text-stone-600 dark:text-stone-400">
              <tr>
                <th scope="col" className="px-4 py-3 rounded-l-lg">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Share
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Planned (INR)
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Actual Spend
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Variance
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Spend Ratio
                </th>
                <th scope="col" className="px-4 py-3 rounded-r-lg text-right">
                  Quick Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {budget.allocations.map((alloc) => {
                const actual = actualSpends[alloc.category.toLowerCase()] || 0;
                const catVariance = alloc.amount - actual;
                const ratio = alloc.amount > 0 ? Math.min(100, Math.round((actual / alloc.amount) * 100)) : 0;
                const isCatOver = catVariance < 0;

                return (
                  <tr
                    key={alloc.category}
                    className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">
                      <div className="flex items-center space-x-2">
                        <span>{alloc.displayName}</span>
                        {alloc.category === 'contingency' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
                            buffer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600 dark:text-stone-400 font-mono text-xs">
                      {alloc.percentage}%
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-900 dark:text-stone-100 font-mono">
                      {formatINR(alloc.amount)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-stone-900 dark:text-stone-100 font-mono">
                      {formatINR(actual)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold font-mono text-xs ${
                        isCatOver
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {isCatOver ? `+${formatINR(Math.abs(catVariance))}` : `-${formatINR(catVariance)}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 mx-auto space-y-1">
                        <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCatOver
                                ? 'bg-red-500'
                                : ratio > 80
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-center text-stone-500 font-mono">
                          {ratio}%
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = actualSpends[alloc.category.toLowerCase()] || 0;
                          const input = window.prompt(
                            `Enter actual spend for ${alloc.displayName} (₹):`,
                            currentVal.toString()
                          );
                          if (input !== null) {
                            const parsed = parseInt(input.replace(/[^\d]/g, ''), 10);
                            if (!isNaN(parsed)) {
                              updateCategoryActualSpend(alloc.category, parsed);
                            }
                          }
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label={`Edit actual spend for ${alloc.displayName}`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-stone-50/80 dark:bg-stone-800/80 font-bold border-t-2 border-stone-200 dark:border-stone-700">
              <tr>
                <td className="px-4 py-3 rounded-l-lg text-stone-900 dark:text-stone-100">
                  Total
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">100%</td>
                <td className="px-4 py-3 text-right font-mono text-stone-900 dark:text-stone-100">
                  {formatINR(totalPlanned)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-stone-900 dark:text-stone-100">
                  {formatINR(totalActual)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono ${
                    isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {isOverBudget ? `+${formatINR(Math.abs(variance))}` : `-${formatINR(variance)}`}
                </td>
                <td className="px-4 py-3 text-center text-xs text-stone-500 font-mono">
                  {totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0}% total
                </td>
                <td className="px-4 py-3 rounded-r-lg"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* AI Savings Advice from Gemini */}
      {aiEnrichment?.savingsTips && aiEnrichment.savingsTips.length > 0 && (
        <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Category Savings Optimization
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Actionable tips with server-calculated rupee savings based on your specific budget
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {aiEnrichment.savingsTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {tip.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                      Save {tip.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {tip.advice}
                  </p>
                </div>

                {tip.calculatedSavingsAmount && (
                  <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Est. Rupee Savings:</span>
                    <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                      ~{formatINR(tip.calculatedSavingsAmount)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Spend Modal */}
      {isEditModalOpen && (
        <EditSpendModal
          allocations={budget.allocations}
          actualSpends={actualSpends}
          onClose={() => setIsEditModalOpen(false)}
          onSave={updateCategoryActualSpend}
        />
      )}
    </div>
  );
}
