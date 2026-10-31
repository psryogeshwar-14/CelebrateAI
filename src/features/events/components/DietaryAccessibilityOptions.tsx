'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { DIETARY_OPTIONS, ACCESSIBILITY_OPTIONS } from '../constants/wizard.constants';

interface DietaryAccessibilityOptionsProps {
  selectedDietary: string[];
  toggleDietary: (d: string) => void;
  selectedAccessibility: string[];
  toggleAccessibility: (a: string) => void;
}

export function DietaryAccessibilityOptions({
  selectedDietary,
  toggleDietary,
  selectedAccessibility,
  toggleAccessibility,
}: DietaryAccessibilityOptionsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          Dietary Accommodations
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DIETARY_OPTIONS.map((item) => {
            const isSelected = selectedDietary.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleDietary(item)}
                className={`px-3 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                }`}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          Guest Accessibility Accommodations
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ACCESSIBILITY_OPTIONS.map((item) => {
            const isSelected = selectedAccessibility.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleAccessibility(item)}
                className={`px-3 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                }`}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
