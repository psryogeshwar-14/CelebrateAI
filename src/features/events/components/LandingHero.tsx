import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onQuickDemo: () => void;
}

export function LandingHero({ onQuickDemo }: LandingHeroProps) {
  return (
    <section className="text-center max-w-4xl mx-auto space-y-6">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-300/40 dark:border-amber-700/40">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>PromptWars Virtual Challenge 5</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.15]">
        Plan every celebration with <span className="text-amber-600 dark:text-amber-500">clarity</span>, not chaos.
      </h1>

      <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
        CelebrateAI turns your event brief into a budget that adds up, a timeline that works backwards from the big day, and a vendor checklist you can actually follow.
      </p>

      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/plan"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base shadow-sm shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <span>Plan My Event Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={onQuickDemo}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold text-base border border-stone-200 dark:border-stone-800 shadow-xs transition-all"
        >
          Explore Wedding Demo
        </button>
      </div>
    </section>
  );
}
