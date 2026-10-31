'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
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

export default function ExportPage() {
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

  // Format WhatsApp / Family Text Summary
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
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CelebrateAI//Event Planner//EN',
      'CALSCALE:GREGORIAN',
    ];

    for (const task of timeline) {
      const dateClean = task.dueDate.replace(/-/g, '');
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${task.id}-${dateClean}@celebrateai.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;VALUE=DATE:${dateClean}`,
        `SUMMARY:[CelebrateAI] ${task.title}`,
        `DESCRIPTION:${task.description || ''} | Owner: ${task.owner}`,
        'END:VEVENT'
      );
    }

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${input.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-timeline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-4 sm:py-8 max-w-4xl mx-auto">
      {/* Top Header Controls (Hidden during print) */}
      <div className="no-print flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDownloadICS}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-50 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Download .ICS Calendar</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Event Brief</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Summary Copy Card (Hidden during print) */}
      <div className="no-print rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Family & WhatsApp-Friendly Event Brief
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1.5 hover:bg-emerald-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 font-mono text-xs text-stone-800 dark:text-stone-300 whitespace-pre-wrap leading-relaxed border border-stone-200 dark:border-stone-800 max-h-56 overflow-y-auto">
          {whatsappSummary}
        </pre>
      </div>

      {/* Printable Sheet View (Optimized for both screen and @media print) */}
      <article className="card rounded-2xl p-8 bg-white text-stone-900 space-y-6 border border-stone-200 shadow-sm print:p-0 print:border-none print:shadow-none">
        {/* Printable Header */}
        <div className="border-b border-stone-200 pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {input.title}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold uppercase">
              {input.eventType.replace('_', ' ')}
            </span>
          </div>
          <div className="text-xs text-stone-600 flex flex-wrap gap-4 pt-1 font-medium">
            <span>Location: <strong>{input.city}</strong></span>
            <span>Date: <strong>{input.eventDate}</strong></span>
            <span>Guests: <strong>{input.guestCount}</strong></span>
            <span>Total Budget: <strong>{formatINR(budget.totalBudget)}</strong></span>
            <span>Contingency Buffer: <strong>{formatINR(budget.contingencyAmount)}</strong></span>
          </div>
        </div>

        {/* Budget Allocation Breakdown */}
        <section className="space-y-2">
          <h2 className="text-base font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
            Budget Allocations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {budget.allocations.map((a) => (
              <div key={a.category} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                <div className="font-semibold text-stone-800">{a.displayName}</div>
                <div className="text-sm font-bold font-mono text-amber-700">{formatINR(a.amount)}</div>
                <div className="text-[10px] text-stone-500">{a.percentage}% of total</div>
              </div>
            ))}
          </div>
        </section>

        {/* Critical Milestones */}
        <section className="space-y-2">
          <h2 className="text-base font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
            Back-Scheduled Milestones
          </h2>
          <table className="w-full text-xs text-left border border-stone-200">
            <thead className="bg-stone-100 text-stone-700 font-bold">
              <tr>
                <th className="p-2">Due Date</th>
                <th className="p-2">Milestone</th>
                <th className="p-2">Owner</th>
                <th className="p-2">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {timeline.slice(0, 14).map((m) => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="p-2 font-mono font-medium">{m.dueDate}</td>
                  <td className="p-2 font-semibold">{m.title}</td>
                  <td className="p-2 capitalize">{m.owner}</td>
                  <td className="p-2 capitalize">{m.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Vendor Checklist */}
        <section className="space-y-2">
          <h2 className="text-base font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
            Vendor Deadlines & Budget Ranges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {vendors.map((v) => (
              <div key={v.id} className="p-2.5 rounded-lg border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900">{v.vendorType}</div>
                <div className="text-stone-600">Deadline: <strong>{v.bookingDeadline}</strong></div>
                <div className="text-stone-600">
                  Target: <strong>{formatINR(v.estimatedBudgetRange.target)}</strong> ({formatINR(v.estimatedBudgetRange.min)} – {formatINR(v.estimatedBudgetRange.max)})
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Day-of Run Sheet */}
        {aiEnrichment?.runSheet && (
          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
              Event-Day Run Sheet
            </h2>
            <div className="space-y-1 text-xs">
              {aiEnrichment.runSheet.map((rs, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-1.5 border-b border-stone-100">
                  <span className="font-mono font-bold w-20 shrink-0">{rs.time}</span>
                  <span className="font-semibold flex-1">{rs.activity}</span>
                  <span className="text-stone-500 text-[11px]">{rs.owner}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-500 text-center">
          Generated deterministically by CelebrateAI • Printed on {new Date().toLocaleDateString()}
        </div>
      </article>
    </div>
  );
}
