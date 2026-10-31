'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';
import { getErrorMessage } from '@/shared/lib/errors';
import { logger } from '@/shared/lib/logger';

export function useWizardForm() {
  const router = useRouter();
  const { setPlan } = useCelebrate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form State
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState<string>('Grand Celebrations in Bengaluru');
  const [city, setCity] = useState<string>('Bengaluru');
  const [eventDate, setEventDate] = useState<string>('2026-11-20');
  const [guestCount, setGuestCount] = useState<number>(200);
  const [totalBudget, setTotalBudget] = useState<number>(1500000);
  const [budgetDisplay, setBudgetDisplay] = useState<string>('15,00,000');
  const [style, setStyle] = useState<StylePreference>('balanced');
  const [venueType, setVenueType] = useState<VenueTypePreference>('indoor');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([
    'Pure Vegetarian (Udupi / Traditional)',
    'Strict Jain (No root vegetables)',
  ]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([
    'Wheelchair ramp to main stage / mandap',
    'Step-free dining hall & restroom access',
  ]);
  const [specialRequests, setSpecialRequests] = useState<string>(
    'Ensure senior citizen seating is reserved near the stage. Require live coffee counter.'
  );

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(rawVal, 10);
    if (isNaN(num)) {
      setTotalBudget(0);
      setBudgetDisplay('');
    } else {
      setTotalBudget(num);
      setBudgetDisplay(new Intl.NumberFormat('en-IN').format(num));
    }
  };

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleAccessibility = (item: string) => {
    setSelectedAccessibility((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];

    if (step === 1) {
      if (!title.trim()) errors.title = 'Please provide an event title';
      if (!city.trim()) errors.city = 'Please specify a city';
      if (!eventDate) {
        errors.eventDate = 'Event date is required';
      } else if (eventDate <= today) {
        errors.eventDate = 'Event date must be in the future';
      }
    }

    if (step === 2) {
      if (guestCount < 5) errors.guestCount = 'Guest count must be at least 5';
      if (totalBudget < 10000) errors.totalBudget = 'Total budget must be at least ₹10,000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setFormErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const payload = {
        eventType,
        title: title.trim(),
        city: city.trim(),
        eventDate,
        guestCount,
        totalBudget,
        currency: 'INR',
        style,
        venueType,
        dietaryRequirements: selectedDietary,
        accessibilityNeeds: selectedAccessibility,
        specialRequests: specialRequests.trim() || undefined,
      };

      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = (await res.json()) as { error?: string };
        throw new Error(errorJson.error || 'Failed to generate event plan');
      }

      const data = await res.json();
      setPlan(data.plan, data.aiEnrichment);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      logger.error('Error generating event plan', err, undefined, 'wizard');
      setFormErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    isSubmitting,
    formErrors,
    eventType,
    setEventType,
    title,
    setTitle,
    city,
    setCity,
    eventDate,
    setEventDate,
    guestCount,
    setGuestCount,
    totalBudget,
    budgetDisplay,
    handleBudgetChange,
    style,
    setStyle,
    venueType,
    setVenueType,
    selectedDietary,
    toggleDietary,
    selectedAccessibility,
    toggleAccessibility,
    specialRequests,
    setSpecialRequests,
    handleNext,
    handleBack,
    handleSubmit,
  };
}
