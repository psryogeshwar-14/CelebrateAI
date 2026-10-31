'use client';

import React from 'react';

interface ChatSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  onSelect: (question: string) => void;
}

export function ChatSuggestions({ suggestions, isLoading, onSelect }: ChatSuggestionsProps) {
  return (
    <div className="space-y-1.5 shrink-0 pt-2 border-t border-stone-100 dark:border-stone-800">
      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
        Suggested queries:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((sq, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(sq)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 border border-stone-200/60 dark:border-stone-700/60 transition-colors text-left"
          >
            {sq}
          </button>
        ))}
      </div>
    </div>
  );
}
