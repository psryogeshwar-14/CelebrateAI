'use client';

import React from 'react';
import { EventType } from '@/lib/engine/types';
import { Heart, Cake, Users2 } from 'lucide-react';

interface EventTypeSelectorProps {
  eventType: EventType;
  title: string;
  onSelectType: (t: EventType) => void;
  onSetTitle: (t: string) => void;
}

export function EventTypeSelector({
  eventType,
  title,
  onSelectType,
  onSetTitle,
}: EventTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button
        type="button"
        onClick={() => {
          onSelectType('wedding');
          if (title.includes('Birthday') || title.includes('Festival')) {
            onSetTitle('Grand Wedding Celebrations');
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
          <div className="font-bold text-sm text-stone-900 dark:text-stone-100">Wedding</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Muhurtham, sangeet, reception
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          onSelectType('birthday');
          if (title.includes('Wedding') || title.includes('Festival')) {
            onSetTitle('Celebration Birthday Party');
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
          <div className="font-bold text-sm text-stone-900 dark:text-stone-100">Birthday</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Milestone, kid, or adult party
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          onSelectType('community_event');
          if (title.includes('Wedding') || title.includes('Birthday')) {
            onSetTitle('Community Festival & Mela');
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
          <div className="font-bold text-sm text-stone-900 dark:text-stone-100">Community</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            RWA, cultural festival or sports
          </div>
        </div>
      </button>
    </div>
  );
}
