'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { EditVendorModal } from '@/components/dashboard/EditVendorModal';
import { VendorRecommendation } from '@/lib/engine/types';
import { Search } from 'lucide-react';
import { VendorKpiCards } from './VendorKpiCards';
import { VendorCard } from './VendorCard';

export function VendorsFeature() {
  const { plan, vendorOverrides, updateVendor, isLoading } = useCelebrate();
  const [editingVendor, setEditingVendor] = useState<VendorRecommendation | null>(null);
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading Vendors...
        </h2>
      </div>
    );
  }

  const { vendors } = plan;

  const totalVendors = vendors.length;
  const bookedCount = vendors.filter(
    (v) => (vendorOverrides[v.id]?.status || 'shortlisted') === 'booked'
  ).length;
  const quotedCount = vendors.filter(
    (v) => (vendorOverrides[v.id]?.status || 'shortlisted') === 'quoted'
  ).length;

  const totalCommitted = vendors.reduce((acc, v) => {
    const override = vendorOverrides[v.id];
    if (override?.quoteAmount) return acc + override.quoteAmount;
    if (override?.status === 'booked') return acc + v.estimatedBudgetRange.target;
    return acc;
  }, 0);

  const filteredVendors = vendors.filter((vendor) => {
    const currentStatus = vendorOverrides[vendor.id]?.status || 'shortlisted';

    if (
      searchQuery &&
      !vendor.vendorType.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vendor.whyNeeded.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (statusFilter !== 'all' && currentStatus !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Vendor Recommendations & Checklists" />

      {/* Top Vendor KPIs */}
      <VendorKpiCards
        totalVendors={totalVendors}
        bookedCount={bookedCount}
        quotedCount={quotedCount}
        totalCommitted={totalCommitted}
      />

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by category or requirements..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="booked">Booked</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards List */}
      <div className="space-y-4">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
            No vendors match your search criteria.
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              override={vendorOverrides[vendor.id]}
              isExpanded={expandedVendorId === vendor.id}
              onToggleExpand={() =>
                setExpandedVendorId((prev) => (prev === vendor.id ? null : vendor.id))
              }
              onEdit={() => setEditingVendor(vendor)}
            />
          ))
        )}
      </div>

      {/* Edit Vendor Modal */}
      {editingVendor && (
        <EditVendorModal
          vendor={editingVendor}
          currentStatus={vendorOverrides[editingVendor.id]?.status || 'shortlisted'}
          currentQuote={vendorOverrides[editingVendor.id]?.quoteAmount}
          currentNotes={vendorOverrides[editingVendor.id]?.notes}
          onClose={() => setEditingVendor(null)}
          onSave={(updates) => updateVendor(editingVendor.id, updates)}
        />
      )}
    </div>
  );
}
