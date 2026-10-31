'use client';

import React from 'react';
import { VendorRecommendation } from '@/lib/engine/types';
import { MapPin, HelpCircle, Edit2, ExternalLink } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

interface VendorProgressItemProps {
  vendor: VendorRecommendation;
  status: string;
  quote: number;
  onOpenEdit: (v: VendorRecommendation) => void;
  onOpenQuestions: (v: VendorRecommendation) => void;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string }> = {
    booked: { label: 'Booked', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300' },
    quoted: { label: 'Quoted', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300' },
    contacted: { label: 'Contacted', bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300' },
    shortlisted: { label: 'Shortlisted', bg: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200' },
  };
  const c = config[status.toLowerCase()] || config.shortlisted;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.bg}`}>
      {c.label}
    </span>
  );
}

export function VendorProgressItem({
  vendor,
  status,
  quote,
  onOpenEdit,
  onOpenQuestions,
}: VendorProgressItemProps) {
  return (
    <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {vendor.vendorType}
            </h4>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
            {vendor.whyNeeded}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenEdit(vendor)}
          className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label={`Edit ${vendor.vendorType} status and quote`}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 dark:border-stone-800/80">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase text-stone-400 font-semibold">
            Deadline
          </div>
          <div className="font-mono font-bold text-stone-800 dark:text-stone-200">
            {vendor.bookingDeadline}
          </div>
        </div>

        <div className="space-y-0.5 text-right">
          <div className="text-[10px] uppercase text-stone-400 font-semibold">
            Allocated Band
          </div>
          <div className="font-mono font-bold text-amber-700 dark:text-amber-400">
            {formatINR(quote)}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="button"
          onClick={() => onOpenQuestions(vendor)}
          className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-50 flex items-center justify-center space-x-1"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Questions to Ask</span>
        </button>

        <a
          href={vendor.googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-100 flex items-center space-x-1"
          aria-label={`Search for ${vendor.vendorType} on Google Maps`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Maps</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
        </a>
      </div>
    </div>
  );
}
