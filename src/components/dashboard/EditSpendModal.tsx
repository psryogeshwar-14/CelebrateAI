'use client';

import React, { useState } from 'react';
import { BudgetCategoryAllocation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';

interface EditSpendModalProps {
  allocations: BudgetCategoryAllocation[];
  actualSpends: Record<string, number>;
  onClose: () => void;
  onSave: (category: string, amount: number) => void;
}

export function EditSpendModal({
  allocations,
  actualSpends,
  onClose,
  onSave,
}: EditSpendModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(allocations[0]?.category || 'venue');
  const [amountStr, setAmountStr] = useState<string>(
    String(actualSpends[allocations[0]?.category?.toLowerCase()] || allocations[0]?.amount || 0)
  );

  const currentAlloc = allocations.find((a) => a.category === selectedCategory) || allocations[0];

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    const existing = actualSpends[catKey.toLowerCase()];
    const matched = allocations.find((a) => a.category === catKey);
    setAmountStr(String(existing !== undefined ? existing : matched?.amount || 0));
  };

  const handleSave = () => {
    const parsed = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
    onSave(selectedCategory, parsed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-spend-modal-title"
    >
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <h3 id="edit-spend-modal-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
            Record Actual Expenditure
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-bold p-1"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Category Picker */}
        <div className="space-y-1.5">
          <label htmlFor="spend-category" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Budget Category
          </label>
          <select
            id="spend-category"
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-medium"
          >
            {allocations.map((a) => (
              <option key={a.category} value={a.category}>
                {a.displayName} (Planned: {formatINR(a.amount)})
              </option>
            ))}
          </select>
        </div>

        {/* Actual Amount Input */}
        <div className="space-y-1.5">
          <label htmlFor="actual-amount" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Actual Amount Spent (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 font-bold text-stone-400 text-sm">₹</span>
            <input
              id="actual-amount"
              type="number"
              min={0}
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold font-mono focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Planned baseline: {formatINR(currentAlloc?.amount || 0)}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
          >
            Save Expenditure
          </button>
        </div>
      </div>
    </div>
  );
}
