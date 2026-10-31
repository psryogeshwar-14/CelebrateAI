import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Home, ArrowLeft, CalendarPlus } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Error 404</span>
        </div>

        {/* Icon & Heading */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Celebration Not Found
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
            The page or event plan you are looking for has been moved, completed, or does not exist in your active workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            href="/plan"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <CalendarPlus className="w-4 h-4 text-amber-600" />
            <span>Plan New Event</span>
          </Link>
        </div>

        {/* Small Home Link */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
          <Link
            href="/"
            className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 inline-flex items-center space-x-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to CelebrateAI Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
