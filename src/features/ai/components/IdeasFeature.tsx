'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { RunSheetTimeline } from '@/components/dashboard/RunSheetTimeline';
import { Palette, Utensils, ShieldAlert, Clock } from 'lucide-react';
import { ThemeCard } from './ThemeCard';
import { BanquetMenuSection } from './BanquetMenuSection';
import { RiskMitigationTable } from './RiskMitigationTable';

export function IdeasFeature() {
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
          <span>Risk Matrix</span>
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
          <span>Day-Of Run Sheet</span>
        </button>
      </div>

      {/* Tab 1: Themes */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          {themes.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
              No theme ideas available.
            </div>
          ) : (
            themes.map((theme, idx) => (
              <ThemeCard
                key={idx}
                theme={theme}
                themeIndex={idx}
                copiedHex={copiedHex}
                onCopyHex={handleCopyHex}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 2: Menu */}
      {activeTab === 'menu' && <BanquetMenuSection menu={menu} />}

      {/* Tab 3: Risks */}
      {activeTab === 'risks' && <RiskMitigationTable risks={risks} />}

      {/* Tab 4: Day-of Run Sheet */}
      {activeTab === 'run_sheet' && (
        <RunSheetTimeline
          runSheet={runSheet}
          eventTitle={plan.input.title}
        />
      )}
    </div>
  );
}
