'use client';

import React from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { AskCelebrateAIChat } from '@/components/dashboard/AskCelebrateAIChat';
import { formatINR } from '@/lib/utils/deterministic';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wallet,
  Users,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export default function AssistantPage() {
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
                  <span>Guest Count:</span>
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {plan.input.guestCount} guests
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                <span className="text-stone-500 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>City & Venue:</span>
                </span>
                <span className="font-semibold capitalize text-stone-900 dark:text-stone-100">
                  {plan.input.city} ({plan.input.venueType})
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 space-y-1.5">
              <span className="font-bold uppercase tracking-wider block text-stone-700 dark:text-stone-300">
                Active Safeguards:
              </span>
              <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Hamilton-Hare budget allocations</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Deterministic timeline milestones</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>City cost index & vendor bands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full-Height Chat Component */}
        <div className="lg:col-span-8">
          <AskCelebrateAIChat plan={plan} />
        </div>
      </div>
    </div>
  );
}
