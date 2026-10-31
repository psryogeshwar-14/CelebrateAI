import React from 'react';
import { Utensils, Leaf } from 'lucide-react';
import { ValidatedEnrichmentOutput } from '@/lib/ai/validate';

interface BanquetMenuSectionProps {
  menu?: ValidatedEnrichmentOutput['menu'];
}

export function BanquetMenuSection({ menu }: BanquetMenuSectionProps) {
  if (!menu) {
    return (
      <div className="text-center py-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
        No menu ideas generated yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Menu Header */}
      <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold">Curated Banquet Menu & Service Concept</h3>
            <p className="text-xs text-stone-500">Catering direction and courses</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {menu.summary}
        </p>

        {/* Dietary Notes Chips */}
        {menu.dietaryNotes && menu.dietaryNotes.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-1.5 border-t border-stone-100 dark:border-stone-800">
            {menu.dietaryNotes.map((note, nIdx) => (
              <span
                key={nIdx}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
              >
                <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{note}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Menu Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.sections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
          >
            <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-50">
                {section.name}
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
              {section.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
