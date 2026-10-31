'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { formatINR } from '@/lib/utils/deterministic';
import {
  Printer,
  Calendar,
  Share2,
  Copy,
  Check,
  Download,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

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

  const { input, budget, timeline, vendors } = plan;

  const whatsappSummary = `
🎉 *${input.title}*
📍 *City:* ${input.city}
📅 *Date:* ${input.eventDate} (${plan.summary.daysUntilEvent} days remaining)
👥 *Guests:* ${input.guestCount}
💰 *Total Budget:* ${formatINR(budget.totalBudget)}
🛡️ *Contingency Buffer:* ${formatINR(budget.contingencyAmount)} (${budget.contingencyPercentage}%)

📋 *Top Upcoming Milestones:*
${timeline
  .slice(0, 5)
  .map((t) => `• [${t.dueDate}] ${t.title} (Owner: ${t.owner})`)
  .join('\n')}

🏢 *Key Vendor Deadlines:*
${vendors
  .slice(0, 4)
  .map((v) => `• ${v.vendorType}: Due ${v.bookingDeadline} (~${formatINR(v.estimatedBudgetRange.target)})`)
  .join('\n')}

✨ *Themes:*
${(aiEnrichment?.themes || [])
  .map((t, idx) => `${idx + 1}. ${t.name}: ${t.description}`)
  .join('\n')}

Created with CelebrateAI (https://celebrate-ai.web.app)
`.trim();

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CelebrateAI//Event Planner//EN',
      'CALSCALE:GREGORIAN',
    ];

    for (const task of timeline) {
      const dateClean = task.dueDate.replace(/-/g, '');
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:milestone-${task.id}@celebrateai.app`);
      icsContent.push(`DTSTAMP:${dateClean}T090000Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${dateClean}`);
      icsContent.push(`DTEND;VALUE=DATE:${dateClean}`);
      icsContent.push(`SUMMARY:${task.title}`);
      icsContent.push(`DESCRIPTION:${task.description} (Owner: ${task.owner})`);
      icsContent.push('END:VEVENT');
    }

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${input.title.toLowerCase().replace(/\s+/g, '-')}-milestones.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Export & Share Brief" />

      {/* Top Action Buttons */}
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

      {/* Printable Event Brief Document */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 sm:p-12 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
              CelebrateAI Master Event Brief
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
              {input.title}
            </h1>
            <p className="text-xs text-stone-500">
              Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 capitalize">
              {input.eventType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Core Parameters Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs">
          <div>
            <div className="text-stone-400 font-bold uppercase text-[10px]">Date</div>
            <div className="font-semibold text-stone-900 dark:text-stone-100">{input.eventDate}</div>
          </div>
          <div>
            <div className="text-stone-400 font-bold uppercase text-[10px]">Location</div>
            <div className="font-semibold text-stone-900 dark:text-stone-100">{input.city}</div>
          </div>
          <div>
            <div className="text-stone-400 font-bold uppercase text-[10px]">Guests</div>
            <div className="font-semibold text-stone-900 dark:text-stone-100">{input.guestCount} pax</div>
          </div>
          <div>
            <div className="text-stone-400 font-bold uppercase text-[10px]">Total Budget</div>
            <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {formatINR(budget.totalBudget)}
            </div>
          </div>
        </div>

        {/* Budget Allocations Table */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Deterministic Budget Allocations
          </h2>
          <table className="w-full text-xs text-left">
            <thead className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase text-[10px]">
              <tr>
                <th className="py-2">Category</th>
                <th className="py-2">Allocated %</th>
                <th className="py-2 text-right">Planned Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {budget.allocations.map((a) => (
                <tr key={a.category}>
                  <td className="py-2 font-medium text-stone-800 dark:text-stone-200 capitalize">
                    {a.displayName || a.category}
                  </td>
                  <td className="py-2 text-stone-500">{a.percentage}%</td>
                  <td className="py-2 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                    {formatINR(a.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back-Scheduled Timeline Tasks */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Back-Scheduled Milestones ({timeline.length})
          </h2>
          <div className="space-y-2 text-xs">
            {timeline.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 dark:border-stone-800"
              >
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{m.title}</span>
                  <span className="text-stone-400 ml-2">({m.owner})</span>
                </div>
                <div className="font-mono text-stone-500 font-medium">{m.dueDate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Checklist */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Vendor Lead Times & Guidelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>{v.vendorType}</span>
                  <span className="text-[10px] text-amber-600 font-mono">
                    Due: {v.bookingDeadline}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Target: {formatINR(v.estimatedBudgetRange.target)} ({formatINR(v.estimatedBudgetRange.min)}–{formatINR(v.estimatedBudgetRange.max)})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
