import { ExportFeature } from '@/features/events';

export const metadata = {
  title: 'Export & Share - CelebrateAI',
  description: 'Download .ICS calendar files, copy WhatsApp summaries, or print master event briefs.',
};

export default function ExportPage() {
  return <ExportFeature />;
}
