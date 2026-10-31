'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import {
  Sparkles,
  ArrowRight,
  Calculator,
  CalendarDays,
  Store,
  Palette,
  MessageSquare,
  Share2,
  CheckCircle2,
  Heart,
  Cake,
  Users2,
  ShieldCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

export default function LandingPage() {
  const router = useRouter();
  const { loadDemoEvent } = useCelebrate();

  const handleLaunchDemo = (demoType: 'wedding' | 'birthday' | 'community_event') => {
    loadDemoEvent(demoType);
    router.push('/dashboard');
  };

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
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
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
            onClick={() => handleLaunchDemo('wedding')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-base border border-stone-200 dark:border-stone-800 shadow-xs transition-all hover:scale-[1.02]"
          >
            Try Live Demo (Palace Grounds Wedding)
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs font-medium text-stone-500 dark:text-stone-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>100% Deterministic Math</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Grounded Gemini 3.8 Flash</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Zero Hallucinated Budgets</span>
          </div>
        </div>
      </section>

      {/* 3 Interactive Event Type Demo Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Engineered for Celebrations of All Scales
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Click any scenario to explore the pre-computed plan with live budget, timeline, and AI recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Wedding */}
          <div
            onClick={() => handleLaunchDemo('wedding')}
            className="group cursor-pointer rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                Wedding
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Ananya &amp; Vikram&apos;s Heritage Wedding
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Palace Grounds, Bengaluru • 350 Guests
              </p>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2">
              Traditional Udupi plantain leaf feast, Hoysala carved mandap, Mysore jasmine styling, and live Nadaswaram.
            </p>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900 dark:text-stone-200">
                Budget: {formatINR(2500000)}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                Open Demo &rarr;
              </span>
            </div>
          </div>

          {/* Card 2: Birthday */}
          <div
            onClick={() => handleLaunchDemo('birthday')}
            className="group cursor-pointer rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/30">
                <Cake className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                Birthday
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Rohan&apos;s 30th Cyberpunk Rooftop
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Indiranagar 100 Ft Rd, Bengaluru • 50 Guests
              </p>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2">
              Boutique microbrewery craft kegs, neon Bengaluru tech aesthetic, retro arcade tournaments, and sourdough pizza.
            </p>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900 dark:text-stone-200">
                Budget: {formatINR(150000)}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                Open Demo &rarr;
              </span>
            </div>
          </div>

          {/* Card 3: Community Event */}
          <div
            onClick={() => handleLaunchDemo('community_event')}
            className="group cursor-pointer rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
                <Users2 className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                Community
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                HSR Sustainability & Green Fair
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                BBMP Park & Amphitheater • 600 Guests
              </p>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2">
              Zero-waste carnival with reusable plate bank, solar sound system, composting masterclasses, and 600 sapling gifts.
            </p>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900 dark:text-stone-200">
                Budget: {formatINR(350000)}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                Open Demo &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            A Complete Planning System
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Every feature is designed to reduce stress, prevent budget blowouts, and eliminate last-minute vendor panic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
