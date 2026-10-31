'use client';

import React, { useState } from 'react';
import { VendorRecommendation } from '@/lib/engine/types';
import {
  Store,
  MapPin,
  HelpCircle,
  Edit2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

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

  const statusBadge = (status: string) => {
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
        {vendors.map((v) => {
          const status = getStatus(v);
          const quote = getQuote(v);

          return (
            <div
              key={v.id}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {v.vendorType}
                    </h4>
                    {statusBadge(status)}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                    {v.whyNeeded}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenEditVendor(v)}
                  className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label={`Edit ${v.vendorType} status and quote`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Deadline & Budget Row */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 dark:border-stone-800/80">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase text-stone-400 font-semibold">
                    Deadline
                  </div>
                  <div className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {v.bookingDeadline}
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

              {/* Action Buttons: Questions & Google Maps */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedQuestionsVendor(v)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-50 flex items-center justify-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Questions to Ask</span>
                </button>

                <a
                  href={v.googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-100 flex items-center space-x-1"
                  aria-label={`Search for ${v.vendorType} on Google Maps`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Vendor Key Questions */}
      {selectedQuestionsVendor && (
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
                  Interview Questions: {selectedQuestionsVendor.vendorType}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Hard-hitting questions to evaluate vendor capabilities before signing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuestionsVendor(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-bold text-sm p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
              {selectedQuestionsVendor.keyQuestions.map((q, idx) => (
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
                onClick={() => setSelectedQuestionsVendor(null)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
