import React from 'react';
import { Heart, Cake, Users2, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

interface DemoEventCardsProps {
  onLaunchDemo: (demoType: 'wedding' | 'birthday' | 'community_event') => void;
}

export function DemoEventCards({ onLaunchDemo }: DemoEventCardsProps) {
  const demos = [
    {
      type: 'wedding' as const,
      icon: <Heart className="w-5 h-5 text-rose-600" />,
      badge: 'Tier-1 Wedding',
      title: 'Traditional Wedding in Bengaluru',
      city: 'Bengaluru',
      guests: 200,
      budget: 1500000,
      description:
        'Includes Kalyana Mantapa venue, Udupi catering, traditional Nadaswaram, and jasmine floral mandap decor.',
    },
    {
      type: 'birthday' as const,
      icon: <Cake className="w-5 h-5 text-amber-600" />,
      badge: 'Rooftop Party',
      title: 'Milestone 30th Birthday Bash',
      city: 'Mumbai',
      guests: 40,
      budget: 80000,
      description:
        'Private cafe terrace, custom artisanal cake, DJ setup, finger foods, and interactive photo booth.',
    },
    {
      type: 'community_event' as const,
      icon: <Users2 className="w-5 h-5 text-emerald-600" />,
      badge: 'Public Gathering',
      title: 'Community Green Fair & Eco-Fest',
      city: 'Delhi NCR',
      guests: 500,
      budget: 350000,
      description:
        'BBMP/Police clearances, acoustic sound, eco-canopies, drinking water stations, and waste management.',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50">
          Try an instant pre-loaded event demo
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Click any card to inspect its real-time budget breakdown, back-scheduled timeline, and Gemini creative suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <div
            key={demo.type}
            onClick={() => onLaunchDemo(demo.type)}
            className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between shadow-xs hover:border-amber-500/60 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:scale-110 transition-transform">
                  {demo.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {demo.badge}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-50 group-hover:text-amber-600 transition-colors">
                  {demo.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  {demo.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                <div>
                  <div className="text-stone-400 text-[10px] uppercase font-bold">Location & Scale</div>
                  <div className="font-semibold text-stone-700 dark:text-stone-300">
                    {demo.city} • {demo.guests} pax
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-[10px] uppercase font-bold">Planned Budget</div>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-500">
                    {formatINR(demo.budget)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Demo Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
