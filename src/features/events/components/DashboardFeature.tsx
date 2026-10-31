'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { CountdownCard, KpiCards, ReplanModal } from '@/features/events';
import { BudgetDonutChart, EditSpendModal } from '@/features/budget';
import { TimelineGanttView, RunSheetTimeline } from '@/features/timeline';
import { VendorProgressCard, EditVendorModal } from '@/features/vendors';
import { AskCelebrateAIChat } from '@/features/ai';
import { VendorRecommendation } from '@/lib/engine/types';
import {
  Palette,
  ShieldAlert,
} from 'lucide-react';

export function DashboardFeature() {
  const {
    plan,
    aiEnrichment,
    isLoading,
    completedTaskIds,
    actualSpends,
    vendorOverrides,
    toggleTask,
    updateCategoryActualSpend,
    updateVendor,
    replanEvent,
  } = useCelebrate();

  const [isEditSpendOpen, setIsEditSpendOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRecommendation | null>(null);
  const [isReplanOpen, setIsReplanOpen] = useState(false);

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading Event Dashboard...
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Computing deterministic allocations and loading AI recommendations
        </p>
      </div>
    );
  }

  const totalPlanned = plan.budget.totalBudget;
  const totalActual = Object.values(actualSpends).reduce(
    (acc, val) => acc + val,
    0
  );

  const totalVendors = plan.vendors.length;
  const bookedVendors = plan.vendors.filter(
    (v) => (vendorOverrides[v.id]?.status || 'shortlisted') === 'booked'
  ).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Navigation Tabs & Controls */}
      <EventSubNav />

      {/* 1. Countdown Card */}
      <CountdownCard targetDate={plan.input.eventDate} eventTitle={plan.input.title} />

      {/* 2. KPI Cards */}
      <KpiCards
        totalBudget={plan.budget.totalBudget}
        totalPlanned={totalPlanned}
        totalActual={totalActual}
        completedTasks={completedTaskIds.length}
        totalTasks={plan.timeline.length}
        bookedVendors={bookedVendors}
        totalVendors={totalVendors}
        healthScore={plan.budget.health.score}
        healthDescription={plan.budget.health.description}
        onOpenEditSpend={() => setIsEditSpendOpen(true)}
      />

      {/* 3. Feasibility Warnings (if any) */}
      {plan.feasibility.conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Feasibility Advisory ({plan.feasibility.conflicts.length} Notes)</span>
          </div>
          <div className="space-y-1.5 pl-6">
            {plan.feasibility.conflicts.map((c) => (
              <div key={c.id} className="text-xs text-amber-900/80 dark:text-amber-300/80">
                <strong>{c.title}:</strong> {c.description}{' '}
                <span className="italic text-amber-700 dark:text-amber-400">({c.remediation})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Split: Budget Chart & Timeline Gantt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs">
          <BudgetDonutChart
            allocations={plan.budget.allocations}
            totalBudget={plan.budget.totalBudget}
          />
        </div>
        <div className="lg:col-span-7">
          <TimelineGanttView
            timeline={plan.timeline}
            completedTaskIds={completedTaskIds}
            onToggleTask={toggleTask}
          />
        </div>
      </div>

      {/* 5. Split: Vendor Progress & Day-Of Run Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <VendorProgressCard
            vendors={plan.vendors}
            vendorOverrides={vendorOverrides}
            onOpenEditVendor={(v) => setEditingVendor(v)}
          />
        </div>
        <div className="lg:col-span-7">
          <RunSheetTimeline
            runSheet={aiEnrichment?.runSheet || []}
            eventTitle={plan.input.title}
          />
        </div>
      </div>

      {/* 6. AI Enrichment Teaser & Quick Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creative Themes Preview */}
        <div className="lg:col-span-6 rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold">Personalized Themes</h3>
            </div>
            <Link
              href="/ideas"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="space-y-3">
            {(aiEnrichment?.themes || []).slice(0, 2).map((theme, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {theme.name}
                  </span>
                  <div className="flex space-x-1">
                    {theme.palette.map((color, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-4 h-4 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grounded Assistant Chat */}
        <div className="lg:col-span-6">
          <AskCelebrateAIChat plan={plan} />
        </div>
      </div>

      {/* Floating Action Modals */}
      {isEditSpendOpen && (
        <EditSpendModal
          onClose={() => setIsEditSpendOpen(false)}
          allocations={plan.budget.allocations}
          actualSpends={actualSpends}
          onSave={updateCategoryActualSpend}
        />
      )}

      {editingVendor && (
        <EditVendorModal
          vendor={editingVendor}
          currentStatus={vendorOverrides[editingVendor.id]?.status || 'shortlisted'}
          currentQuote={vendorOverrides[editingVendor.id]?.quoteAmount}
          currentNotes={vendorOverrides[editingVendor.id]?.notes}
          onClose={() => setEditingVendor(null)}
          onSave={(updates) => updateVendor(editingVendor.id, updates)}
        />
      )}

      {isReplanOpen && (
        <ReplanModal
          currentInput={plan.input}
          onClose={() => setIsReplanOpen(false)}
          onReplan={replanEvent}
        />
      )}
    </div>
  );
}
