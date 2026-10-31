'use client';

import React from 'react';
import { EventType } from '@/lib/engine/types';
import { EventTypeSelector } from './EventTypeSelector';
import { EventTitleDateInputs } from './EventTitleDateInputs';

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

      <EventTypeSelector
        eventType={eventType}
        title={title}
        onSelectType={setEventType}
        onSetTitle={setTitle}
      />

      <EventTitleDateInputs
        title={title}
        setTitle={setTitle}
        city={city}
        setCity={setCity}
        eventDate={eventDate}
        setEventDate={setEventDate}
        formErrors={formErrors}
        todayStr={todayStr}
      />
    </div>
  );
}
