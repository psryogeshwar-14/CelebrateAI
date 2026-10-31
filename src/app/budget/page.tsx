import { BudgetFeature } from '@/features/budget';

export const metadata = {
  title: 'Budget Manager - CelebrateAI',
  description: 'Manage deterministic allocations and track actual spends against Hamilton-Hare calculations.',
};

export default function BudgetPage() {
  return <BudgetFeature />;
}
