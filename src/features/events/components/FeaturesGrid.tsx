import React from 'react';
import {
  Calculator,
  CalendarDays,
  Store,
  Palette,
  MessageSquare,
  Share2,
} from 'lucide-react';

export function FeaturesGrid() {
  const featureItems = [
    {
      icon: <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: 'Dynamic Budget',
      description:
        'Deterministic allocations guaranteed to sum to the exact rupee using Hamilton-Hare math, with a mandatory 10%+ contingency buffer.',
    },
    {
      icon: <CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: 'Back-Scheduled Timeline',
      description:
        '15–20 milestones back-scheduled from your event date. Compresses proportionally for short notices so dates never fall after the event.',
    },
    {
      icon: <Store className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: 'Vendor Checklist',
      description:
        'Lead-time deadlines, realistic budget allocations, hard-hitting questions to ask, and direct Google Maps local search links.',
    },
    {
      icon: <Palette className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: 'AI Creative Ideas',
      description:
        'Three cohesive themes with 4-swatch color palettes, regional dietary menus, contingency risk matrix, and day-of run sheets.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: 'Grounded Assistant',
      description:
        'Ask CelebrateAI answers questions strictly using your locked budget and timeline numbers. Zero invented facts or hallucinations.',
    },
    {
      icon: <Share2 className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      title: 'Export & Share',
      description:
        'Clean printable event brief, 1-click RFC 5545 .ics calendar export for Google and Apple calendars, and copyable WhatsApp summary.',
    },
  ];

  return (
    <section className="space-y-8 pt-6">
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50">
          Engineered for flawless execution
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Every number is calculated deterministically. AI enriches the plan with creativity without modifying critical dates or budgets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureItems.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 flex items-center justify-center">
              {f.icon}
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-50">
              {f.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
