'use client';

import React from 'react';
import { User } from 'lucide-react';

interface RunSheetItem {
  time: string;
  activity: string;
  owner: string;
}

interface RunSheetTimelineProps {
  runSheet: RunSheetItem[];
  eventTitle: string;
}

export function RunSheetTimeline({ runSheet, eventTitle }: RunSheetTimelineProps) {
  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Event-Day Run Sheet Itinerary
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Chronological minute-by-minute execution plan for {eventTitle}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {runSheet.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 text-xs"
          >
            {/* Time Badge */}
            <div className="w-24 shrink-0 font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-md border border-amber-200/50 dark:border-amber-800/40 text-center">
              {item.time}
            </div>

            {/* Activity Description */}
            <div className="flex-1 space-y-1">
              <div className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                {item.activity}
              </div>
              <div className="flex items-center space-x-1.5 text-stone-500 dark:text-stone-400 text-xs">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Lead Role: {item.owner}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
