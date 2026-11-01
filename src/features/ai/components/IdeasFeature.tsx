'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { RunSheetTimeline } from '@/features/timeline';
import { ThemeCard } from './ThemeCard';
import { BanquetMenuSection } from './BanquetMenuSection';
import { RiskMitigationTable } from './RiskMitigationTable';
import { IdeasTabBar } from './IdeasTabBar';
import type { IdeaTabKey } from './IdeasTabBar';

export function IdeasFeature() {
  const { plan, aiEnrichment, isLoading } = useCelebrate();
  const [activeTab, setActiveTab] = useState<IdeaTabKey>('themes');
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
      <EventSubNav title="Personalized Themes, Menu, Risks & Run Sheet" />

      <IdeasTabBar activeTab={activeTab} onTabChange={setActiveTab} />

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

      {activeTab === 'menu' && <BanquetMenuSection menu={menu} />}

      {activeTab === 'risks' && <RiskMitigationTable risks={risks} />}

      {activeTab === 'run_sheet' && (
        <RunSheetTimeline
          runSheet={runSheet}
          eventTitle={plan.input.title}
        />
      )}
    </div>
  );
}
