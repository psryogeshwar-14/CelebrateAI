'use client';

import React, { useState } from 'react';
import { VendorRecommendation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import { Modal } from '@/shared/ui/Modal';

interface EditVendorModalProps {
  vendor: VendorRecommendation;
  currentStatus: string;
  currentQuote?: number;
  currentNotes?: string;
  onClose: () => void;
  onSave: (updates: { status: string; quoteAmount?: number; notes?: string }) => void;
}

export function EditVendorModal({
  vendor,
  currentStatus,
  currentQuote,
  currentNotes,
  onClose,
  onSave,
}: EditVendorModalProps) {
  const [status, setStatus] = useState<string>(currentStatus || 'shortlisted');
  const [quoteStr, setQuoteStr] = useState<string>(
    String(currentQuote || vendor.estimatedBudgetRange.target)
  );
  const [notes, setNotes] = useState<string>(currentNotes || '');

  const handleSave = () => {
    const quoteNum = parseInt(quoteStr.replace(/[^0-9]/g, ''), 10) || vendor.estimatedBudgetRange.target;
    onSave({
      status,
      quoteAmount: quoteNum,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Update Vendor: ${vendor.vendorType}`}
      description={`Booking Deadline: ${vendor.bookingDeadline}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="vendor-status" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Booking Status
          </label>
          <select
            id="vendor-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold"
          >
            <option value="shortlisted">Shortlisted (To Research)</option>
            <option value="contacted">Contacted (In Discussion)</option>
            <option value="quoted">Quoted (Reviewing Contract)</option>
            <option value="booked">Booked (Deposit Paid / Locked)</option>
          </select>
        </div>

        {/* Agreed / Quoted Amount */}
        <div className="space-y-1.5">
          <label htmlFor="vendor-quote" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Vendor Quote / Contract Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 font-bold text-stone-400 text-sm">₹</span>
            <input
              id="vendor-quote"
              type="number"
              min={0}
              value={quoteStr}
              onChange={(e) => setQuoteStr(e.target.value)}
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold font-mono focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Budget Target: {formatINR(vendor.estimatedBudgetRange.target)} (Range: {formatINR(vendor.estimatedBudgetRange.min)} – {formatINR(vendor.estimatedBudgetRange.max)})
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label htmlFor="vendor-notes" className="block text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
            Internal Notes
          </label>
          <textarea
            id="vendor-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Spoke with vendor, agreed on 50% advance check due next week..."
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
          />
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
            Save Vendor
          </button>
        </div>
      </div>
    </Modal>
  );
}
