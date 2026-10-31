'use client';

import React from 'react';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { CITY_SUGGESTIONS } from '../constants/wizard.constants';

interface EventTitleDateInputsProps {
  title: string;
  setTitle: (t: string) => void;
  city: string;
  setCity: (c: string) => void;
  eventDate: string;
  setEventDate: (d: string) => void;
  formErrors: Record<string, string>;
  todayStr: string;
}

export function EventTitleDateInputs({
  title,
  setTitle,
  city,
  setCity,
  eventDate,
  setEventDate,
  formErrors,
  todayStr,
}: EventTitleDateInputsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="event-title-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          Celebration Name / Title
        </label>
        <input
          id="event-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Aditi & Rahul's Wedding"
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        />
        {formErrors.title && (
          <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{formErrors.title}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="event-city-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            Host City (Tier-1, 2, or 3)
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              id="event-city-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Bengaluru, Pune, Goa"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {CITY_SUGGESTIONS.slice(0, 5).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                  city === c
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {formErrors.city && (
            <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{formErrors.city}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="event-date-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              id="event-date-input"
              type="date"
              min={todayStr}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <p className="text-[11px] text-stone-400">
            Milestones and vendor booking deadlines will be back-scheduled from this date.
          </p>
          {formErrors.eventDate && (
            <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{formErrors.eventDate}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
