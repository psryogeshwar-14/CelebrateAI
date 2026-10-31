'use client';

import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNavigation({
  currentStep,
  isSubmitting,
  onBack,
  onNext,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>
      ) : (
        <div />
      )}

      {currentStep < 3 ? (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-7 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm shadow-amber-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Computing Plan & Gemini AI Enrichment...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Complete Event Plan</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
