'use client';

import React from 'react';
import Link from 'next/link';
import { Palette } from 'lucide-react';
import { ThemeRecommendation } from '@/features/ai/types';

interface DashboardThemesPreviewProps {
  themes?: ThemeRecommendation[];
}

export function DashboardThemesPreview({ themes = [] }: DashboardThemesPreviewProps) {
  return (
    <div className="lg:col-span-6 rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold">Personalized Themes</h3>
        </div>
        <Link
          href="/ideas"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
        >
          <span>View All</span>
        </Link>
      </div>

      <div className="space-y-3">
        {themes.slice(0, 2).map((t, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">{t.name}</h4>
              <div className="flex items-center space-x-1">
                {t.palette.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
              {t.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
