'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { CountdownCard, KpiCards, ReplanModal } from '@/features/events';
import { BudgetDonutChart, EditSpendModal } from '@/features/budget';
import { TimelineGanttView, RunSheetTimeline } from '@/features/timeline';
import { VendorProgressCard, EditVendorModal } from '@/features/vendors';
import { AskCelebrateAIChat } from '@/features/ai';
import { VendorRecommendation } from '@/lib/engine/types';
import { DashboardFeasibilityAlert } from './DashboardFeasibilityAlert';
import { DashboardThemesPreview } from './DashboardThemesPreview';

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
  const totalActual = Object.values(actualSpends).reduce((acc, val) => acc + val, 0);
  const totalVendors = plan.vendors.length;
  const bookedVendors = plan.vendors.filter(
    (v) => (vendorOverrides[v.id]?.status || 'shortlisted') === 'booked'
  ).length;

  return (
    <div className="space-y-8 pb-16">
      <EventSubNav />

      <CountdownCard targetDate={plan.input.eventDate} eventTitle={plan.input.title} />

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

      <DashboardFeasibilityAlert conflicts={plan.feasibility.conflicts} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs">
          <BudgetDonutChart allocations={plan.budget.allocations} totalBudget={plan.budget.totalBudget} />
        </div>
        <div className="lg:col-span-7">
          <TimelineGanttView timeline={plan.timeline} completedTaskIds={completedTaskIds} onToggleTask={toggleTask} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <VendorProgressCard vendors={plan.vendors} vendorOverrides={vendorOverrides} onOpenEditVendor={setEditingVendor} />
        </div>
        <div className="lg:col-span-7">
          <RunSheetTimeline runSheet={aiEnrichment?.runSheet || []} eventTitle={plan.input.title} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DashboardThemesPreview themes={aiEnrichment?.themes} />
        <div className="lg:col-span-6">
          <AskCelebrateAIChat plan={plan} />
        </div>
      </div>

      {isEditSpendOpen && (
        <EditSpendModal
          allocations={plan.budget.allocations}
          actualSpends={actualSpends}
          onClose={() => setIsEditSpendOpen(false)}
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
