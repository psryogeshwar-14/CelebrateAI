'use client';

import React from 'react';
import { VendorRecommendation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import { ExternalLink, Edit3, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { VendorQuestionsAccordion } from './VendorQuestionsAccordion';

interface VendorCardProps {
  vendor: VendorRecommendation;
  override?: {
    status: string;
    quoteAmount?: number;
    notes?: string;
  };
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
}

export function VendorCard({
  vendor,
  override,
  isExpanded,
  onToggleExpand,
  onEdit,
}: VendorCardProps) {
  const currentStatus = override?.status || 'shortlisted';

  const statusStyles: Record<string, string> = {
    shortlisted: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    quoted: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    booked: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4 hover:border-amber-400 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              {vendor.vendorType}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                statusStyles[currentStatus] || statusStyles.shortlisted
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {vendor.whyNeeded}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {vendor.googleMapsSearchUrl && (
            <a
              href={vendor.googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Search Maps</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      {/* Meta Grid: Target Budget, Deadline, Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs">
        <div>
          <span className="text-stone-400 font-semibold block text-[10px] uppercase">
            Estimated Range
          </span>
          <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
            {formatINR(vendor.estimatedBudgetRange.target)}{' '}
            <span className="text-[11px] font-normal text-stone-500">
              ({formatINR(vendor.estimatedBudgetRange.min)}–{formatINR(vendor.estimatedBudgetRange.max)})
            </span>
          </span>
        </div>

        <div>
          <span className="text-stone-400 font-semibold block text-[10px] uppercase">
            Booking Deadline
          </span>
          <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
            {vendor.bookingDeadline}{' '}
            <span className="text-stone-500 font-normal">
              ({vendor.daysBeforeEvent}d lead)
            </span>
          </span>
        </div>

        <div>
          <span className="text-stone-400 font-semibold block text-[10px] uppercase">
            Status & Notes
          </span>
          <span className="font-semibold text-stone-900 dark:text-stone-100 capitalize">
            {currentStatus} {override?.notes ? `— ${override.notes}` : ''}
          </span>
        </div>
      </div>

      {/* Toggle Questions Accordion */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
        >
          <span>{isExpanded ? 'Hide Questions' : 'Show Questions to Ask'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {isExpanded && (
          <VendorQuestionsAccordion questions={vendor.keyQuestions} />
        )}
      </div>
    </div>
  );
}
