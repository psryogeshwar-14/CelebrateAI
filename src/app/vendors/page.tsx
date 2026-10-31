'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { EditVendorModal } from '@/components/dashboard/EditVendorModal';
import { VendorRecommendation } from '@/lib/engine/types';
import { formatINR } from '@/lib/utils/deterministic';
import {
  Store,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Edit3,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  DollarSign,
  Phone,
} from 'lucide-react';

export default function VendorsPage() {
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

  // Derive counts
  const totalVendors = vendors.length;
  const bookedCount = vendors.filter(
    (v) => (vendorOverrides[v.id]?.status || 'shortlisted') === 'booked'
  ).length;
  const quotedCount = vendors.filter(
    (v) => (vendorOverrides[v.id]?.status || 'shortlisted') === 'quoted'
  ).length;

  // Calculate total committed quotes
  const totalCommitted = vendors.reduce((acc, v) => {
    const override = vendorOverrides[v.id];
    if (override?.quoteAmount) return acc + override.quoteAmount;
    if (override?.status === 'booked') return acc + v.estimatedBudgetRange.target;
    return acc;
  }, 0);

  // Filter vendors
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
      <EventSubNav title="Vendor Checklist & Quote Management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Total Categories</span>
            <Store className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
            {totalVendors}
          </div>
          <p className="text-xs text-stone-500">Essential vendors for {plan.input.city}</p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Booked Vendors</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {bookedCount} <span className="text-sm font-normal text-stone-500">/ {totalVendors}</span>
          </div>
          <p className="text-xs text-stone-500">
            {totalVendors - bookedCount} pending final contract
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>In Negotiation / Quoted</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400">
            {quotedCount}
          </div>
          <p className="text-xs text-stone-500">Active quotes received</p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Total Quoted Commit</span>
            <DollarSign className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
            {formatINR(totalCommitted)}
          </div>
          <p className="text-xs text-stone-500">Sum of confirmed vendor quotes</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor types..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto text-xs pb-1 sm:pb-0">
            <span className="text-stone-500 font-semibold flex items-center space-x-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            {['all', 'shortlisted', 'contacted', 'quoted', 'booked', 'cancelled'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="space-y-4">
        {filteredVendors.map((vendor) => {
          const override = vendorOverrides[vendor.id];
          const currentStatus = override?.status || 'shortlisted';
          const quoteAmount = override?.quoteAmount;
          const isExpanded = expandedVendorId === vendor.id;

          return (
            <div
              key={vendor.id}
              className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 transition-all"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {vendor.vendorType}
                    </h3>

                    {/* Status dropdown */}
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        updateVendor(vendor.id, {
                          status: e.target.value,
                          quoteAmount,
                          notes: override?.notes,
                        })
                      }
                      className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                        currentStatus === 'booked'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : currentStatus === 'quoted'
                          ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          : currentStatus === 'contacted'
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <option value="shortlisted">Shortlisted</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="booked">Booked</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {vendor.whyNeeded}
                  </p>
                </div>

                {/* Right: Booking Deadline & Maps Search */}
                <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                  <a
                    href={vendor.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Find in {plan.input.city}</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setEditingVendor(vendor)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center space-x-1 focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Edit Quote</span>
                  </button>
                </div>
              </div>

              {/* Middle row: Financials & Booking Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 text-xs">
                <div>
                  <span className="text-stone-500 block mb-0.5 font-medium">
                    Estimated Budget Band:
                  </span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                    {formatINR(vendor.estimatedBudgetRange.min)} – {formatINR(vendor.estimatedBudgetRange.max)}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block mb-0.5 font-medium">
                    Confirmed Quote:
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      quoteAmount
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-stone-400 italic'
                    }`}
                  >
                    {quoteAmount ? formatINR(quoteAmount) : 'Pending quote entry'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block mb-0.5 font-medium">
                    Booking Deadline:
                  </span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                    {vendor.bookingDeadline}
                  </span>
                </div>
              </div>

              {/* Notes if any */}
              {override?.notes && (
                <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Vendor Notes:</span> {override.notes}
                </div>
              )}

              {/* Questions to Ask Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setExpandedVendorId(isExpanded ? null : vendor.id)}
                  className="flex items-center space-x-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 focus:outline-hidden"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>
                    {isExpanded ? 'Hide' : 'Show'} Interview Questions ({vendor.keyQuestions.length})
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
                    <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                      Key Verification Questions to Ask
                    </div>
                    <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                      {vendor.keyQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            id={`q-${vendor.id}-${idx}`}
                            className="w-4 h-4 mt-0.5 rounded-sm border-stone-300 dark:border-stone-600 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <label
                            htmlFor={`q-${vendor.id}-${idx}`}
                            className="cursor-pointer leading-relaxed"
                          >
                            {q}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
