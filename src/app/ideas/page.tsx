'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { RunSheetTimeline } from '@/components/dashboard/RunSheetTimeline';
import {
  Sparkles,
  Palette,
  Utensils,
  ShieldAlert,
  Clock,
  Printer,
  Check,
  Copy,
  ChevronRight,
  Flame,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

export default function IdeasPage() {
  const { plan, aiEnrichment, isLoading } = useCelebrate();
  const [activeTab, setActiveTab] = useState<'themes' | 'menu' | 'risks' | 'run_sheet'>('themes');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading AI Ideas & Concepts...
        </h2>
      </div>
    );
  }

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const themes = aiEnrichment?.themes || [];
  const menu = aiEnrichment?.menu;
  const risks = aiEnrichment?.risks || [];
  const runSheet = aiEnrichment?.runSheet || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Personalized Themes, Menu, Risks & Run Sheet" />

      {/* Internal Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('themes')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'themes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>3 Personalized Themes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'menu'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Regional Menu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('risks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'risks'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Risk & Contingency ({risks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('run_sheet')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'run_sheet'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Day-of Run Sheet</span>
        </button>
      </div>

      {/* Tab 1: Themes */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Curated Aesthetics & Palettes
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Generated based on style: <span className="capitalize font-semibold">{plan.input.style}</span> & venue: <span className="capitalize font-semibold">{plan.input.venueType}</span>
              </p>
            </div>
            {aiEnrichment?.isAIOffline && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                Curated deterministic templates
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {themes.map((theme, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Theme Header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                        {theme.name}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* 4-Color Palette Swatch */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Color Palette:
                    </span>
                    <div className="flex items-center space-x-2">
                      {theme.palette.map((color, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleCopyHex(color)}
                          className="group relative flex-1 h-10 rounded-lg border border-stone-200/60 dark:border-stone-700/60 transition-transform hover:scale-105 focus:outline-hidden"
                          style={{ backgroundColor: color }}
                          aria-label={`Copy hex code ${color}`}
                          title={`Click to copy ${color}`}
                        >
                          <span className="sr-only">{color}</span>
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center text-[10px] text-white font-mono transition-opacity">
                            {copiedHex === color ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      {theme.palette.map((color, cIdx) => (
                        <span key={cIdx}>{color}</span>
                      ))}
                    </div>
                  </div>

                  {/* Decor Ideas */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Decor & Floral Elements:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                      {theme.decorIdeas.map((decor, dIdx) => (
                        <li key={dIdx} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{decor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Signature Moment Highlight */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 mt-4 space-y-1">
                  <div className="text-[10px] uppercase font-black tracking-wider text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Signature Moment</span>
                  </div>
                  <p className="text-xs text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
                    &quot;{theme.signatureMoment}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Regional Menu */}
      {activeTab === 'menu' && (
        <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Regional Catering & Banquet Plan
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Strictly tailored for {plan.input.guestCount} guests in {plan.input.city}
              </p>
            </div>

            {/* Dietary Tags */}
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-stone-500 mr-1">Compliance:</span>
              {plan.input.dietaryRequirements && plan.input.dietaryRequirements.length > 0 ? (
                plan.input.dietaryRequirements.map((d, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {d}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-500">Standard Regional</span>
              )}
            </div>
          </div>

          {menu ? (
            <div className="space-y-6">
              {/* Menu Summary */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                  Culinary Concept:
                </span>
                {menu.summary}
              </div>

              {/* Course Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menu.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3"
                  >
                    <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Utensils className="w-4 h-4" />
                      <span>{sec.name}</span>
                    </h3>

                    <ul className="space-y-2 text-xs text-stone-800 dark:text-stone-200">
                      {sec.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Dietary Notes */}
              {menu.dietaryNotes && menu.dietaryNotes.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    Catering Service Protocols & Cross-Contamination Guidelines
                  </h4>
                  <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-1 list-disc list-inside">
                    {menu.dietaryNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-stone-500 py-8 text-center">
              No menu suggestions generated.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Risk & Contingency */}
      {activeTab === 'risks' && (
        <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Risk Assessment & Contingency Protocol
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Proactive mitigation for high-impact disruptions in {plan.input.city}
            </p>
          </div>

          <div className="space-y-4">
            {risks.map((risk, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/30 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {risk.risk}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                      risk.impact.toLowerCase().includes('high')
                        ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    Impact: {risk.impact}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Preventative Mitigation:
                  </span>
                  <p className="leading-relaxed">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Day-of Run Sheet */}
      {activeTab === 'run_sheet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Event-Day Master Run Sheet
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Minute-by-minute execution schedule for event date: {plan.input.eventDate}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center space-x-1.5 focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Run Sheet</span>
            </button>
          </div>

          <RunSheetTimeline
            runSheet={runSheet}
            eventTitle={plan.input.title}
          />
        </div>
      )}
    </div>
  );
}
