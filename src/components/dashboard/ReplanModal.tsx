'use client';

import React, { useState } from 'react';
import { EventPlanningInput } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import { Sparkles, Loader2 } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';

interface ReplanModalProps {
  currentInput: EventPlanningInput;
  onClose: () => void;
  onReplan: (updates: Partial<EventPlanningInput>) => Promise<void>;
}

export function ReplanModal({ currentInput, onClose, onReplan }: ReplanModalProps) {
  const [budgetNum, setBudgetNum] = useState<number>(currentInput.totalBudget);
  const [guestCount, setGuestCount] = useState<number>(currentInput.guestCount);
  const [eventDate, setEventDate] = useState<string>(currentInput.eventDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExecute = async () => {
    setIsSubmitting(true);
    try {
      await onReplan({
        totalBudget: budgetNum,
        guestCount,
        eventDate,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Trigger Plan Recalibration"
      description="Deterministic engine recomputes allocations & Gemini regenerates ideas based on updated parameters."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Total Budget */}
        <div className="space-y-1.5">
          <label htmlFor="replan-budget" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Updated Total Budget (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 font-bold text-stone-400 text-sm">₹</span>
            <input
              id="replan-budget"
              type="number"
              min={10000}
              value={budgetNum}
              onChange={(e) => setBudgetNum(parseInt(e.target.value, 10) || 10000)}
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold font-mono focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Current: {formatINR(currentInput.totalBudget)}
          </p>
        </div>

        {/* Guest Count */}
        <div className="space-y-1.5">
          <label htmlFor="replan-guests" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Updated Guest Count
          </label>
          <input
            id="replan-guests"
            type="number"
            min={1}
            value={guestCount}
            onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold font-mono focus-visible:ring-2 focus-visible:ring-amber-500"
          />
        </div>

        {/* Event Date */}
        <div className="space-y-1.5">
          <label htmlFor="replan-date" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Updated Event Date (YYYY-MM-DD)
          </label>
          <input
            id="replan-date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium focus-visible:ring-2 focus-visible:ring-amber-500"
          />
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Recomputing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recalculate & Replan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
