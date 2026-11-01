'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-2">
      <div className="flex items-center space-x-2 font-bold">
        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
        <span>{title}</span>
      </div>
      <p className="text-rose-700 dark:text-rose-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
