'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { ReplanModal } from '@/components/dashboard/ReplanModal';
import {
  LayoutDashboard,
  Wallet,
  CalendarDays,
  Store,
  Sparkles,
  Bot,
  Share2,
  RefreshCw,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';

interface EventSubNavProps {
  title?: string;
  showEventDetails?: boolean;
}

export function EventSubNav({ title, showEventDetails = true }: EventSubNavProps) {
  const pathname = usePathname();
  const { plan, aiEnrichment, replanEvent } = useCelebrate();
  const [isReplanOpen, setIsReplanOpen] = useState(false);

  if (!plan) return null;

  const tabs = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/budget', label: 'Budget', icon: Wallet },
    { href: '/timeline', label: 'Timeline', icon: CalendarDays },
    { href: '/vendors', label: 'Vendors', icon: Store },
    { href: '/ideas', label: 'Ideas & Menu', icon: Sparkles },
    { href: '/assistant', label: 'AI Assistant', icon: Bot },
    { href: '/export', label: 'Export', icon: Share2 },
  ];

  return (
    <>
      <div className="space-y-4 mb-6">
        {/* Event header card with details and replan trigger */}
        {showEventDetails && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                  {title || plan.input.title}
                </h1>
                {aiEnrichment?.isAIOffline && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    AI Offline Mode
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-stone-500 dark:text-stone-400 font-medium">
                <span className="inline-flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{plan.input.city}</span>
                </span>
                <span className="inline-flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{plan.input.eventDate}</span>
                </span>
                <span className="inline-flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>{plan.input.guestCount} Guests</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsReplanOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Adjust and replan event parameters"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                <span>Adjust & Replan</span>
              </button>

              <Link
                href="/export"
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Plan</span>
              </Link>
            </div>
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
        <nav
          className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-thin border-b border-stone-200 dark:border-stone-800"
          aria-label="Event sections"
        >
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-100/80 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-semibold border-b-2 border-amber-600 dark:border-amber-500'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Replan Modal */}
      {isReplanOpen && (
        <ReplanModal
          currentInput={plan.input}
          onClose={() => setIsReplanOpen(false)}
          onReplan={replanEvent}
        />
      )}
    </>
  );
}
