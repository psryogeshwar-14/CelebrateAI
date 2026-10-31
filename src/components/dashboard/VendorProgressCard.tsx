'use client';

import React, { useState } from 'react';
import { VendorRecommendation } from '@/lib/engine/types';
import { VendorProgressItem } from './VendorProgressItem';
import { VendorQuestionsModal } from './VendorQuestionsModal';

interface VendorProgressCardProps {
  vendors: VendorRecommendation[];
  vendorOverrides: Record<string, { status: string; quoteAmount?: number; notes?: string }>;
  onOpenEditVendor: (vendor: VendorRecommendation) => void;
}

export function VendorProgressCard({
  vendors,
  vendorOverrides,
  onOpenEditVendor,
}: VendorProgressCardProps) {
  const [selectedQuestionsVendor, setSelectedQuestionsVendor] =
    useState<VendorRecommendation | null>(null);

  const getStatus = (v: VendorRecommendation) => {
    return vendorOverrides[v.id]?.status || 'shortlisted';
  };

  const getQuote = (v: VendorRecommendation) => {
    return vendorOverrides[v.id]?.quoteAmount || v.estimatedBudgetRange.target;
  };

  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Vendor Procurement & Booking Deadlines
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Lead times, estimated budget bands, and interview prompts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vendors.map((v) => (
          <VendorProgressItem
            key={v.id}
            vendor={v}
            status={getStatus(v)}
            quote={getQuote(v)}
            onOpenEdit={onOpenEditVendor}
            onOpenQuestions={setSelectedQuestionsVendor}
          />
        ))}
      </div>

      <VendorQuestionsModal
        vendor={selectedQuestionsVendor}
        onClose={() => setSelectedQuestionsVendor(null)}
      />
    </div>
  );
}
