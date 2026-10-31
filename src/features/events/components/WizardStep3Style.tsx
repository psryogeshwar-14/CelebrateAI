'use client';

import React from 'react';
import { StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { Check } from 'lucide-react';
import { DIETARY_OPTIONS, ACCESSIBILITY_OPTIONS } from '../constants/wizard.constants';

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

      {/* Style & Venue Preference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Style Selection */}
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

        {/* Venue Type */}
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

      {/* Dietary Requirements */}
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

      {/* Accessibility Accommodations */}
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

      {/* Special Requests */}
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
