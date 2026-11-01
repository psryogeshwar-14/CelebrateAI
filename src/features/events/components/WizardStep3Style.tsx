'use client';

import React from 'react';
import type { StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { DietaryAccessibilityOptions } from './DietaryAccessibilityOptions';

interface WizardStep3StyleProps {
  style: StylePreference;
  setStyle: (s: StylePreference) => void;
  venueType: VenueTypePreference;
  setVenueType: (v: VenueTypePreference) => void;
  selectedDietary: string[];
  toggleDietary: (d: string) => void;
  selectedAccessibility: string[];
  toggleAccessibility: (a: string) => void;
  specialRequests: string;
  setSpecialRequests: (r: string) => void;
}

export function WizardStep3Style({
  style,
  setStyle,
  venueType,
  setVenueType,
  selectedDietary,
  toggleDietary,
  selectedAccessibility,
  toggleAccessibility,
  specialRequests,
  setSpecialRequests,
}: WizardStep3StyleProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
          Style, Dietary & Accessibility
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Customize regional preferences, dietary requirements, and guest accessibility accommodations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            Aesthetic & Spend Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['budget', 'balanced', 'premium'] as StylePreference[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  style === s
                    ? 'border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 ring-1 ring-amber-600'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            Venue Setting (Contingency Impact)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['indoor', 'outdoor'] as VenueTypePreference[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVenueType(v)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  venueType === v
                    ? 'border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 ring-1 ring-amber-600'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-300'
                }`}
              >
                {v === 'indoor' ? 'Indoor (10% Buffer)' : 'Outdoor (12% Weather Buffer)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DietaryAccessibilityOptions
        selectedDietary={selectedDietary}
        toggleDietary={toggleDietary}
        selectedAccessibility={selectedAccessibility}
        toggleAccessibility={toggleAccessibility}
      />

      <div className="space-y-1.5">
        <label htmlFor="special-requests-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          Special Notes & Cultural Traditions
        </label>
        <textarea
          id="special-requests-input"
          rows={3}
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Mention specific ceremonies, family traditions, music genres, or unique requirements..."
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
  );
}
