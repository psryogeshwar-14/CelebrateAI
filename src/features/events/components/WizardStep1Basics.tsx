'use client';

import React from 'react';
import { EventType } from '@/lib/engine/types';
import { Heart, Cake, Users2, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { CITY_SUGGESTIONS } from '../constants/wizard.constants';

interface WizardStep1BasicsProps {
  eventType: EventType;
  setEventType: (t: EventType) => void;
  title: string;
  setTitle: (t: string) => void;
  city: string;
  setCity: (c: string) => void;
  eventDate: string;
  setEventDate: (d: string) => void;
  formErrors: Record<string, string>;
}

export function WizardStep1Basics({
  eventType,
  setEventType,
  title,
  setTitle,
  city,
  setCity,
  eventDate,
  setEventDate,
  formErrors,
}: WizardStep1BasicsProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
          What are we celebrating?
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Select your event category, destination, and target date.
        </p>
      </div>

      {/* Event Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setEventType('wedding');
            if (title.includes('Birthday') || title.includes('Festival')) {
              setTitle('Grand Wedding Celebrations');
            }
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
            eventType === 'wedding'
              ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-600'
              : 'border-stone-200 dark:border-stone-800 hover:border-amber-400'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Wedding
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Muhurtham, Sangeet & Reception
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setEventType('birthday');
            if (title.includes('Wedding') || title.includes('Festival')) {
              setTitle('Milestone Birthday Party');
            }
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
            eventType === 'birthday'
              ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-600'
              : 'border-stone-200 dark:border-stone-800 hover:border-amber-400'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Birthday Party
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Rooftop, lounge or banquet
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setEventType('community_event');
            if (title.includes('Wedding') || title.includes('Birthday')) {
              setTitle('Community Cultural Festival');
            }
          }}
          className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
            eventType === 'community_event'
              ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-600'
              : 'border-stone-200 dark:border-stone-800 hover:border-amber-400'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Community Event
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              RWA, cultural festival or sports
            </div>
          </div>
        </button>
      </div>

      {/* Event Title */}
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

      {/* City & Date Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City Input */}
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

          {/* Quick city pill chips */}
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

        {/* Date Input */}
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
