'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ComputedPlan, EventPlanningInput, EventType } from '../engine/types';
import { computePlan } from '../engine/planner';
import { ValidatedEnrichmentOutput, getOfflineFallbackEnrichment } from '../ai/validate';
import { BENGALURU_DEMO_EVENTS } from '../data/seeds';

interface CelebrateContextType {
  plan: ComputedPlan | null;
  aiEnrichment: ValidatedEnrichmentOutput | null;
  isLoading: boolean;
  error: string | null;
  completedTaskIds: string[];
  actualSpends: Record<string, number>;
  vendorOverrides: Record<string, { status: string; quoteAmount?: number; notes?: string }>;
  isDarkMode: boolean;
  activeDemoId: string | null;
  toggleTheme: () => void;
  loadDemoEvent: (demoType: EventType) => void;
  setPlan: (plan: ComputedPlan, ai?: ValidatedEnrichmentOutput) => void;
  toggleTask: (taskId: string) => void;
  updateCategoryActualSpend: (category: string, amount: number) => void;
  updateVendor: (vendorId: string, updates: { status: string; quoteAmount?: number; notes?: string }) => void;
  replanEvent: (updates: Partial<EventPlanningInput>) => Promise<void>;
}

const CelebrateContext = createContext<CelebrateContextType | undefined>(undefined);

export function CelebrateProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<ComputedPlan | null>(null);
  const [aiEnrichment, setAiEnrichment] = useState<ValidatedEnrichmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [actualSpends, setActualSpends] = useState<Record<string, number>>({});
  const [vendorOverrides, setVendorOverrides] = useState<
    Record<string, { status: string; quoteAmount?: number; notes?: string }>
  >({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeDemoId, setActiveDemoId] = useState<string | null>('wedding');

  // Initialize theme from system or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('celebrate_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('celebrate_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('celebrate_theme', 'light');
      }
      return next;
    });
  };

  /**
   * Helper to load a demo event bundle into the active state.
   */
  const loadDemoEvent = (demoType: EventType) => {
    setIsLoading(true);
    setError(null);
    try {
      const demoBundle =
        BENGALURU_DEMO_EVENTS.find((d) => d.event.event_type === demoType) ||
        BENGALURU_DEMO_EVENTS[0];

      const input: EventPlanningInput = {
        eventType: demoBundle.event.event_type,
        title: demoBundle.event.title,
        city: demoBundle.event.city,
        eventDate: demoBundle.event.event_date,
        guestCount: demoBundle.event.guest_count,
        totalBudget: demoBundle.event.total_budget,
        currency: demoBundle.event.currency,
        style: 'balanced',
        venueType: demoBundle.event.event_type === 'community_event' ? 'outdoor' : 'indoor',
        dietaryRequirements: demoBundle.event.dietary_needs,
        accessibilityRequirements: demoBundle.event.accessibility_needs,
        specialRequests: demoBundle.event.special_requests,
        currentDate: '2026-05-01', // Standardized baseline for rich countdown & overdue display
      };

      const computed = computePlan(input);
      const fallbackAi = getOfflineFallbackEnrichment(computed);

      // Populate demo actual spends
      const initialSpends: Record<string, number> = {};
      for (const item of demoBundle.budgetItems) {
        initialSpends[item.category] = item.actual_amount;
      }

      // Populate completed tasks from demo
      const completedIds = computed.timeline
        .filter((_, idx) => idx < 3) // First 3 milestones completed in demo
        .map((t) => t.id);

      // Populate vendor overrides
      const initialVendors: Record<string, { status: string; quoteAmount?: number; notes?: string }> = {};
      for (const v of demoBundle.vendors) {
        const matched = computed.vendors.find((cv) =>
          cv.vendorType.toLowerCase().includes(v.vendor_type.toLowerCase())
        );
        if (matched) {
          initialVendors[matched.id] = {
            status: v.status,
            quoteAmount: v.quote_amount,
            notes: v.notes,
          };
        }
      }

      setPlanState(computed);
      setAiEnrichment(fallbackAi);
      setActualSpends(initialSpends);
      setCompletedTaskIds(completedIds);
      setVendorOverrides(initialVendors);
      setActiveDemoId(demoType);
    } catch (err: any) {
      console.error('Failed to load demo event:', err);
      setError(err?.message || 'Error loading demo');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load Wedding demo on first mount
  useEffect(() => {
    if (!plan) {
      loadDemoEvent('wedding');
    }
  }, []);

  const setPlan = (newPlan: ComputedPlan, ai?: ValidatedEnrichmentOutput) => {
    setPlanState(newPlan);
    if (ai) {
      setAiEnrichment(ai);
    } else {
      setAiEnrichment(getOfflineFallbackEnrichment(newPlan));
    }
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

  const updateVendor = (
    vendorId: string,
    updates: { status: string; quoteAmount?: number; notes?: string }
  ) => {
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
      // 1. Recompute deterministic plan locally
      const updatedPlan = computePlan(mergedInput);
      setPlanState(updatedPlan);

      // 2. Fetch updated AI enrichment via /api/replan
      const res = await fetch('/api/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mergedInput,
          forceRefreshAI: true,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.ai) {
          setAiEnrichment(json.ai);
        }
      } else {
        // Fallback to local offline template
        setAiEnrichment(getOfflineFallbackEnrichment(updatedPlan));
      }
    } catch (err: any) {
      console.warn('Replan API call failed, applied local fallback:', err);
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
        plan,
        aiEnrichment,
        isLoading,
        error,
        completedTaskIds,
        actualSpends,
        vendorOverrides,
        isDarkMode,
        activeDemoId,
        toggleTheme,
        loadDemoEvent,
        setPlan,
        toggleTask,
        updateCategoryActualSpend,
        updateVendor,
        replanEvent,
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
