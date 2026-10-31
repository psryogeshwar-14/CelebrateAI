import React from 'react';
import { Store, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';

interface VendorKpiCardsProps {
  totalVendors: number;
  bookedCount: number;
  quotedCount: number;
  totalCommitted: number;
}

export function VendorKpiCards({
  totalVendors,
  bookedCount,
  quotedCount,
  totalCommitted,
}: VendorKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Categories */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Total Categories</span>
          <Store className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
          {totalVendors}
        </div>
        <p className="text-xs text-stone-500">
          Tailored to your event type
        </p>
      </div>

      {/* Booked & Confirmed */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Booked & Locked</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {bookedCount}
        </div>
        <p className="text-xs text-stone-500">
          {totalVendors > 0 ? Math.round((bookedCount / totalVendors) * 100) : 0}% booked
        </p>
      </div>

      {/* Under Evaluation */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Quoted / Evaluating</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-amber-600 dark:text-amber-500">
          {quotedCount}
        </div>
        <p className="text-xs text-stone-500">Quotes under review</p>
      </div>

      {/* Committed Spend */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Committed Spend</span>
          <DollarSign className="w-4 h-4 text-stone-600" />
        </div>
        <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
          {formatINR(totalCommitted)}
        </div>
        <p className="text-xs text-stone-500">From actual quotes & bookings</p>
      </div>
    </div>
  );
}
