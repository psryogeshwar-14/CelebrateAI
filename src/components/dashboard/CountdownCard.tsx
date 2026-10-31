'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface CountdownCardProps {
  targetDate: string; // YYYY-MM-DD
  eventTitle: string;
}

export function CountdownCard({ targetDate, eventTitle }: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(`${targetDate}T09:00:00Z`).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div
      className="rounded-2xl p-6 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white shadow-md relative overflow-hidden"
      role="region"
      aria-label={`Countdown to ${eventTitle}`}
    >
      {/* Subtle background ornamentation */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Event Countdown</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white line-clamp-1">
            {eventTitle}
          </h2>
          <div className="flex items-center space-x-1.5 text-xs text-amber-100/80">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target Date: {targetDate}</span>
          </div>
        </div>

        {/* Time Units Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center" aria-live="polite">
          <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2 sm:px-3 sm:py-2 border border-white/10">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              {timeLeft.days}
            </div>
            <div className="text-[10px] sm:text-xs uppercase font-medium text-amber-200">Days</div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2 sm:px-3 sm:py-2 border border-white/10">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs uppercase font-medium text-amber-200">Hours</div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2 sm:px-3 sm:py-2 border border-white/10">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs uppercase font-medium text-amber-200">Mins</div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs rounded-xl p-2 sm:px-3 sm:py-2 border border-white/10">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs uppercase font-medium text-amber-200">Secs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
