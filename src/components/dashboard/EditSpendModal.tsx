'use client';

import React, { useState } from 'react';
import { BudgetCategoryAllocation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import { Modal } from '@/shared/ui/Modal';

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Record Actual Expenditure"
      description="Track and update actual expenditures against your planned budget baseline."
      maxWidth="md"
    >
      <div className="space-y-4">
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
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Save Expenditure
          </button>
        </div>
      </div>
    </Modal>
  );
}
