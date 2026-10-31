'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface KpiVendorsCardProps {
  bookedVendors: number;
  totalVendors: number;
  vendorPercentage: number;
  healthScore: 'healthy' | 'tight' | 'over_budget';
  healthDescription: string;
}

export function KpiVendorsCard({
  bookedVendors,
  totalVendors,
  vendorPercentage,
  healthScore,
  healthDescription,
}: KpiVendorsCardProps) {
  const healthBadgeConfig = {
    healthy: {
      label: 'Budget Healthy',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    },
    tight: {
      label: 'Budget Tight',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    },
    over_budget: {
      label: 'Over Budget',
      icon: <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300',
    },
  }[healthScore];

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400">
          Vendors Booked
        </span>
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
          {vendorPercentage}%
        </span>
      </div>
      <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-mono">
        {bookedVendors} <span className="text-sm font-normal text-stone-400">/ {totalVendors}</span>
      </div>
      <div
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${healthBadgeConfig.bg}`}
        title={healthDescription}
      >
        {healthBadgeConfig.icon}
        <span>{healthBadgeConfig.label}</span>
      </div>
    </div>
  );
}
