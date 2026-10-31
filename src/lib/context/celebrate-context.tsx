'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ComputedPlan, EventPlanningInput, EventType } from '../engine/types';
import { computePlan } from '../engine/planner';
import { ValidatedEnrichmentOutput, getOfflineFallbackEnrichment } from '../ai/validate';
import { getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';
import { CelebrateContextType, VendorOverride } from './celebrate-context.types';
import { useThemeState } from './useThemeState';
import { buildDemoEventState } from './demo-loader';

export * from './celebrate-context.types';

const CelebrateContext = createContext<CelebrateContextType | undefined>(undefined);

export function CelebrateProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<ComputedPlan | null>(null);
  const [aiEnrichment, setAiEnrichment] = useState<ValidatedEnrichmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [actualSpends, setActualSpends] = useState<Record<string, number>>({});
  const [vendorOverrides, setVendorOverrides] = useState<Record<string, VendorOverride>>({});
  const [activeDemoId, setActiveDemoId] = useState<string | null>('wedding');

  const { isDarkMode, toggleTheme } = useThemeState();

  const loadDemoEvent = (demoType: EventType) => {
    setIsLoading(true);
    setError(null);
    try {
      const demo = buildDemoEventState(demoType);
      setPlanState(demo.computed);
      setAiEnrichment(demo.fallbackAi);
      setActualSpends(demo.initialSpends);
      setCompletedTaskIds(demo.completedIds);
      setVendorOverrides(demo.initialVendors);
      setActiveDemoId(demoType);
    } catch (err: unknown) {
      logger.error('Failed to load demo event', err, { demoType }, 'celebrate-context');
      setError(getErrorMessage(err) || 'Error loading demo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!plan) loadDemoEvent('wedding');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPlan = (newPlan: ComputedPlan, ai?: ValidatedEnrichmentOutput) => {
    setPlanState(newPlan);
    setAiEnrichment(ai || getOfflineFallbackEnrichment(newPlan));
    setActiveDemoId(null);
    setCompletedTaskIds([]);
    setActualSpends({});
    setVendorOverrides({});
  };

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const updateCategoryActualSpend = (category: string, amount: number) => {
    setActualSpends((prev) => ({
      ...prev,
      [category.toLowerCase()]: Math.max(0, Math.round(amount)),
    }));
  };

  const updateVendor = (vendorId: string, updates: VendorOverride) => {
    setVendorOverrides((prev) => ({
      ...prev,
      [vendorId]: {
        ...(prev[vendorId] || {}),
        ...updates,
      },
    }));
  };

  const replanEvent = async (updates: Partial<EventPlanningInput>) => {
    if (!plan) return;
    setIsLoading(true);
    setError(null);

    const mergedInput: EventPlanningInput = {
      ...plan.input,
      ...updates,
    };

    try {
      const updatedPlan = computePlan(mergedInput);
      setPlanState(updatedPlan);

      const res = await fetch('/api/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mergedInput, forceRefreshAI: true }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.ai) setAiEnrichment(json.ai);
      } else {
        setAiEnrichment(getOfflineFallbackEnrichment(updatedPlan));
      }
    } catch (err: unknown) {
      logger.warn('Replan API call failed, applied local fallback', { error: String(err) }, 'celebrate-context');
      const fallbackPlan = computePlan(mergedInput);
      setPlanState(fallbackPlan);
      setAiEnrichment(getOfflineFallbackEnrichment(fallbackPlan));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CelebrateContext.Provider
      value={{
        plan, aiEnrichment, isLoading, error, completedTaskIds, actualSpends,
        vendorOverrides, isDarkMode, activeDemoId, toggleTheme, loadDemoEvent,
        setPlan, toggleTask, updateCategoryActualSpend, updateVendor, replanEvent,
      }}
    >
      {children}
    </CelebrateContext.Provider>
  );
}

export function useCelebrate() {
  const context = useContext(CelebrateContext);
  if (!context) {
    throw new Error('useCelebrate must be used within a CelebrateProvider');
  }
  return context;
}
