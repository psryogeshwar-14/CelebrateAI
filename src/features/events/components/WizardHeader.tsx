'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

interface WizardHeaderProps {
  currentStep: number;
}

export function WizardHeader({ currentStep }: WizardHeaderProps) {
  const stepTitles = [
    'Core Details',
    'Budget & Scale',
    'Style & Customization',
  ];

  return (
    <div className="space-y-2">
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Create Your Event Plan
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Step {currentStep} of 3: {stepTitles[currentStep - 1]}
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label={`Step ${currentStep} of 3`}
          className="flex items-center space-x-1"
        >
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === currentStep
                  ? 'bg-amber-600 text-white shadow-xs'
                  : step < currentStep
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
              }`}
            >
              {step < currentStep ? <Check className="w-3.5 h-3.5" /> : step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
