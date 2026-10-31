import { AssistantFeature } from '@/features/ai';

export const metadata = {
  title: 'Ask CelebrateAI - Grounded Assistant',
  description: 'AI event concierge strictly grounded in your deterministic event plan data.',
};

export default function AssistantPage() {
  return <AssistantFeature />;
}
