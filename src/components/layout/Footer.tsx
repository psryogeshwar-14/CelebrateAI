import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 dark:border-stone-800 bg-[#fafaf9] dark:bg-[#0c0a09] py-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand Info */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Celebrate<span className="text-amber-600">AI</span>
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              © {new Date().getFullYear()} PromptWars Virtual Challenge 5
            </span>
          </div>

          {/* Prompt Tech Stack Credit */}
          <div className="text-xs text-stone-500 dark:text-stone-400 max-w-xl">
            Built with <span className="font-medium text-stone-700 dark:text-stone-300">Google Antigravity</span>,{' '}
            <span className="font-medium text-stone-700 dark:text-stone-300">Gemini 3.8 Flash</span>,{' '}
            <span className="font-medium text-stone-700 dark:text-stone-300">Next.js 14 App Router</span>,{' '}
            <span className="font-medium text-stone-700 dark:text-stone-300">Supabase Postgres</span>, and{' '}
            <span className="font-medium text-stone-700 dark:text-stone-300">Google Cloud Run</span>.
          </div>
        </div>
      </div>
    </footer>
  );
}
