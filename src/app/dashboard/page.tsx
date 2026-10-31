'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { CountdownCard } from '@/components/dashboard/CountdownCard';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { BudgetDonutChart } from '@/components/dashboard/BudgetDonutChart';
import { TimelineGanttView } from '@/components/dashboard/TimelineGanttView';
import { VendorProgressCard } from '@/components/dashboard/VendorProgressCard';
import { RunSheetTimeline } from '@/components/dashboard/RunSheetTimeline';
import { AskCelebrateAIChat } from '@/components/dashboard/AskCelebrateAIChat';
import { EditSpendModal } from '@/components/dashboard/EditSpendModal';
import { EditVendorModal } from '@/components/dashboard/EditVendorModal';
import { ReplanModal } from '@/components/dashboard/ReplanModal';
import { VendorRecommendation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import {
  Sparkles,
  Palette,
  Utensils,
  TrendingDown,
  ShieldAlert,
  Share2,
  RefreshCw,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
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
    loadDemoEvent,
  } = useCelebrate();

  // Modals state
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

  // Calculate actual total spend from overrides or fallback
  const totalPlanned = plan.budget.totalBudget;
  const totalActual = Object.values(actualSpends).reduce(
    (acc, val) => acc + val,
    0
  );

  // Count booked vendors
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

      {/* Main Grid: Left (Deterministic Facts) & Right (Creative AI Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 7 Cols (Budget Donut, Timeline Gantt, Vendors, Run Sheet) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Budget Donut Chart */}
          <BudgetDonutChart
            allocations={plan.budget.allocations}
            totalBudget={plan.budget.totalBudget}
          />

          {/* Timeline Gantt View */}
          <TimelineGanttView
            timeline={plan.timeline}
            completedTaskIds={completedTaskIds}
            onToggleTask={toggleTask}
          />

          {/* Vendor Checklist Card */}
          <VendorProgressCard
            vendors={plan.vendors}
            vendorOverrides={vendorOverrides}
            onOpenEditVendor={(v) => setEditingVendor(v)}
          />

          {/* Run Sheet Timeline */}
          {aiEnrichment?.runSheet && (
            <RunSheetTimeline
              runSheet={aiEnrichment.runSheet}
              eventTitle={plan.input.title}
            />
          )}
        </div>

        {/* Right Column: 5 Cols (AI Ideas, Menus, Savings, Risks & Grounded Chat) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Creative Themes */}
          {aiEnrichment?.themes && aiEnrichment.themes.length > 0 && (
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <Palette className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Personalized Theme Concepts
                </h3>
              </div>

              <div className="space-y-4">
                {aiEnrichment.themes.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-600 uppercase">
                        Theme {idx + 1}
                      </span>
                    </div>

                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                      {t.description}
                    </p>

                    {/* 4-Swatch Color Palette */}
                    <div className="pt-1">
                      <div className="text-[10px] uppercase font-semibold text-stone-400 mb-1">
                        Palette
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {t.palette.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-7 h-7 rounded-md border border-stone-300 dark:border-stone-700 shadow-2xs"
                            style={{ backgroundColor: color.startsWith('#') ? color : '#d97706' }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 border-t border-stone-200/50 dark:border-stone-800 text-stone-500 dark:text-stone-400">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">Highlight:</span> {t.signatureMoment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Regional Menu */}
          {aiEnrichment?.menu && (
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <Utensils className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Curated Regional Menu & Dietary Notes
                </h3>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300">
                {aiEnrichment.menu.summary}
              </p>

              <div className="space-y-3">
                {aiEnrichment.menu.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {section.name}
                    </span>
                    <ul className="list-disc list-inside text-xs text-stone-700 dark:text-stone-300 space-y-0.5">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {aiEnrichment.menu.dietaryNotes && aiEnrichment.menu.dietaryNotes.length > 0 && (
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 space-y-1">
                  <span className="font-bold">Dietary Safeguards:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {aiEnrichment.menu.dietaryNotes.map((dn, idx) => (
                      <li key={idx}>{dn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AI Category Savings Advice (Server-Calculated Amounts) */}
          {aiEnrichment?.savingsTips && aiEnrichment.savingsTips.length > 0 && (
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Targeted Category Savings Advice
                </h3>
              </div>

              <div className="space-y-2.5">
                {aiEnrichment.savingsTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {tip.categoryDisplayName}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                        Save ~{formatINR(tip.calculatedSavingsAmount)} ({tip.percentage}%)
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {tip.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Risk Matrix */}
          {aiEnrichment?.risks && aiEnrichment.risks.length > 0 && (
            <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Risk & Contingency Safeguards
                </h3>
              </div>

              <div className="space-y-2.5">
                {aiEnrichment.risks.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {r.risk}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                        Impact: {r.impact}
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">Mitigation:</span> {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grounded Assistant Chat Panel */}
          <AskCelebrateAIChat plan={plan} />
        </div>
      </div>

      {/* Edit Spend Modal */}
      {isEditSpendOpen && (
        <EditSpendModal
          allocations={plan.budget.allocations}
          actualSpends={actualSpends}
          onClose={() => setIsEditSpendOpen(false)}
          onSave={updateCategoryActualSpend}
        />
      )}

      {/* Edit Vendor Modal */}
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

      {/* Replan Modal */}
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
