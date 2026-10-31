'use client';

import React from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { AskCelebrateAIChat } from '@/features/ai';
import { formatINR } from '@/lib/utils/deterministic';
import {
  ShieldCheck,
  Calendar,
  Wallet,
  Users,
  MapPin,
} from 'lucide-react';

export function AssistantFeature() {
  const { plan, aiEnrichment, isLoading } = useCelebrate();

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading CelebrateAI Assistant...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Ask CelebrateAI - Grounded Event Concierge" />

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grounded Fact Base Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Grounded Plan Context</h3>
                <p className="text-[11px] text-stone-500">Immutable deterministic facts</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Every answer from CelebrateAI is strictly grounded in this event&apos;s mathematical calculations. The assistant will never hallucinate numbers, dates, or vendor deadlines.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-stone-500 flex items-center space-x-1.5">
                  <Wallet className="w-3.5 h-3.5 text-amber-600" />
                  <span>Total Budget:</span>
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {formatINR(plan.budget.totalBudget)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-stone-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Event Date:</span>
                </span>
                <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                  {plan.input.eventDate} ({plan.summary.daysUntilEvent}d left)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-stone-500 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Guest Scale:</span>
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {plan.input.guestCount} pax (~{formatINR(plan.summary.costPerGuest)}/head)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-stone-500 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Destination:</span>
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {plan.input.city}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
              <strong>Grounding Rule:</strong>
              <p className="text-amber-800/80 dark:text-amber-300/80">
                If asked to modify budget or dates, CelebrateAI directs you to the recalculation wizard.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Interface */}
        <div className="lg:col-span-8">
          <AskCelebrateAIChat plan={plan} />
        </div>
      </div>
    </div>
  );
}
