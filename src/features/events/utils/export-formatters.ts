import { ComputedPlan } from '@/lib/engine/types';
import { ValidatedEnrichmentOutput } from '@/lib/ai/validate';
import { formatINR } from '@/lib/utils/deterministic';

export function buildWhatsAppSummary(
  plan: ComputedPlan,
  aiEnrichment?: ValidatedEnrichmentOutput | null
): string {
  const { input, budget, timeline, vendors } = plan;

  return `
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
}

export function downloadIcsCalendar(plan: ComputedPlan): void {
  const { input, timeline } = plan;
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
}
