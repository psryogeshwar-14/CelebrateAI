'use client';

import React from 'react';
import type { ComputedPlan } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';

interface ExportBriefDocumentProps {
  plan: ComputedPlan;
}

export function ExportBriefDocument({ plan }: ExportBriefDocumentProps) {
  const { input, budget, timeline, vendors } = plan;

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
            CelebrateAI Master Event Brief
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
            {input.title}
          </h1>
          <p className="text-xs text-stone-500">
            Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 capitalize">
            {input.eventType.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs">
        <div>
          <div className="text-stone-400 font-bold uppercase text-[10px]">Date</div>
          <div className="font-semibold text-stone-900 dark:text-stone-100">{input.eventDate}</div>
        </div>
        <div>
          <div className="text-stone-400 font-bold uppercase text-[10px]">Location</div>
          <div className="font-semibold text-stone-900 dark:text-stone-100">{input.city}</div>
        </div>
        <div>
          <div className="text-stone-400 font-bold uppercase text-[10px]">Guests</div>
          <div className="font-semibold text-stone-900 dark:text-stone-100">{input.guestCount} pax</div>
        </div>
        <div>
          <div className="text-stone-400 font-bold uppercase text-[10px]">Total Budget</div>
          <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
            {formatINR(budget.totalBudget)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Deterministic Budget Allocations
        </h2>
        <table className="w-full text-xs text-left">
          <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase text-[10px]">
            <tr>
              <th className="py-2">Category</th>
              <th className="py-2">Allocated %</th>
              <th className="py-2 text-right">Planned Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {budget.allocations.map((a) => (
              <tr key={a.category}>
                <td className="py-2 font-medium text-stone-800 dark:text-stone-200 capitalize">
                  {a.displayName || a.category}
                </td>
                <td className="py-2 text-stone-500">{a.percentage}%</td>
                <td className="py-2 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                  {formatINR(a.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Back-Scheduled Milestones ({timeline.length})
        </h2>
        <div className="space-y-2 text-xs">
          {timeline.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 dark:border-stone-800"
            >
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100">{m.title}</span>
                <span className="text-stone-400 ml-2">({m.owner})</span>
              </div>
              <div className="font-mono text-stone-500 font-medium">{m.dueDate}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Vendor Lead Times & Guidelines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {vendors.map((v) => (
            <div key={v.id} className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                <span>{v.vendorType}</span>
                <span className="text-[10px] text-amber-600 font-mono">Due: {v.bookingDeadline}</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Target: {formatINR(v.estimatedBudgetRange.target)} ({formatINR(v.estimatedBudgetRange.min)}–{formatINR(v.estimatedBudgetRange.max)})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
