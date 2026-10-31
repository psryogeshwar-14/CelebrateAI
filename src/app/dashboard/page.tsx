import { DashboardFeature } from '@/features/events';

export const metadata = {
  title: 'Event Dashboard - CelebrateAI',
  description: 'Track budget health, back-scheduled milestones, and vendor booking progress.',
};

export default function DashboardPage() {
  return <DashboardFeature />;
}
