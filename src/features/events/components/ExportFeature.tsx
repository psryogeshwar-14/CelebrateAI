'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { Printer, Calendar, Copy, Check } from 'lucide-react';
import { buildWhatsAppSummary, downloadIcsCalendar } from '../utils/export-formatters';
import { ExportBriefDocument } from './ExportBriefDocument';

export function ExportFeature() {
  const { plan, aiEnrichment } = useCelebrate();
  const [copied, setCopied] = useState(false);

  if (!plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">No Event Loaded</h2>
        <Link href="/" className="text-amber-600 underline">
          Return Home or Choose a Demo
        </Link>
      </div>
    );
  }

  const handleCopyWhatsApp = () => {
    const summary = buildWhatsAppSummary(plan, aiEnrichment);
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadICS = () => {
    downloadIcsCalendar(plan);
  };

  return (
    <div className="space-y-8 pb-16">
      <EventSubNav title="Export & Share Brief" />

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadICS}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-50 text-xs font-bold flex items-center space-x-2 shadow-xs transition-all"
        >
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>Download .ICS Calendar File</span>
        </button>

        <button
          type="button"
          onClick={handleCopyWhatsApp}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Summary'}</span>
        </button>
      </div>

      <ExportBriefDocument plan={plan} />
    </div>
  );
}
