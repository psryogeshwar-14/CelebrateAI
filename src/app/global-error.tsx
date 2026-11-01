'use client';

import React from 'react';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fafaf9] text-[#1c1917] flex items-center justify-center min-h-screen p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-sm text-stone-600">
            A critical application error occurred. Click below to reload CelebrateAI.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
