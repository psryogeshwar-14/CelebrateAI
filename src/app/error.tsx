'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception safely server-side / to monitoring
    console.error('[CelebrateAI Application Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Error 500</span>
        </div>

        {/* Icon & Heading */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Calculation Interrupted
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
            Don&apos;t worry—your planning state and budget allocations are safe. CelebrateAI encountered a temporary glitch while processing your request.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Home className="w-4 h-4 text-stone-500" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Support hint */}
        <p className="text-xs text-stone-500 dark:text-stone-400 pt-2">
          If this issue persists, please check your network connection or switch to offline template mode.
        </p>
      </div>
    </div>
  );
}
