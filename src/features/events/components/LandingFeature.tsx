'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { LandingHero } from './LandingHero';
import { DemoEventCards } from './DemoEventCards';
import { FeaturesGrid } from './FeaturesGrid';
import { EngineVsAiComparison } from './EngineVsAiComparison';

export function LandingFeature() {
  const router = useRouter();
  const { loadDemoEvent } = useCelebrate();

  const handleLaunchDemo = (demoType: 'wedding' | 'birthday' | 'community_event') => {
    loadDemoEvent(demoType);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      <LandingHero onQuickDemo={() => handleLaunchDemo('wedding')} />
      <DemoEventCards onLaunchDemo={handleLaunchDemo} />
      <EngineVsAiComparison />
      <FeaturesGrid />
    </div>
  );
}
