'use client';

import React from 'react';
import { VendorRecommendation } from '@/lib/engine/types';

interface VendorQuestionsModalProps {
  vendor: VendorRecommendation | null;
  onClose: () => void;
}

export function VendorQuestionsModal({ vendor, onClose }: VendorQuestionsModalProps) {
  if (!vendor) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-questions-title"
    >
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <div className="flex items-start justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 id="vendor-questions-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
              Interview Questions: {vendor.vendorType}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Hard-hitting questions to evaluate vendor capabilities before signing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-bold text-sm p-1"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
          {vendor.keyQuestions.map((q, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold shrink-0 flex items-center justify-center text-[10px] mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
