'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  Check,
  AlertCircle,
  Loader2,
  Heart,
  Cake,
  Users2,
} from 'lucide-react';
import { formatINR } from '@/lib/utils/deterministic';
import { EventType, StylePreference, VenueTypePreference } from '@/lib/engine/types';

const CITY_SUGGESTIONS = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Jaipur',
  'Kochi',
  'Goa',
  'Ahmedabad',
];

const DIETARY_OPTIONS = [
  'Pure Vegetarian (Udupi / Traditional)',
  'Strict Jain (No root vegetables)',
  'Vegan Options',
  'Halal Meat Options',
  'Gluten-Free Counter',
  'Nut-Free / Allergen Conscious',
  'Specialty Filter Coffee Bar',
];

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair ramp to main stage / mandap',
  'Step-free dining hall & restroom access',
  'Golf cart / buggy transit for elderly relatives',
  'Sign language interpreter for main stage',
  'Braille & high-contrast directional signage',
  'Dedicated quiet / sensory retreat room',
];

export default function PlannerWizardPage() {
  const router = useRouter();
  const { setPlan } = useCelebrate();

  // Step 1: Basics, Step 2: Logistics & Budget, Step 3: Style & Preferences
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

  const todayStr = new Date().toISOString().split('T')[0];

  // Budget input formatting handler
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
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const toggleAccessibility = (item: string) => {
    setSelectedAccessibility((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim() || title.trim().length < 3) {
        errors.title = 'Event title must be at least 3 characters.';
      }
      if (!city.trim()) {
        errors.city = 'Please enter a celebration city.';
      }
      if (!eventDate) {
        errors.eventDate = 'Please choose an event date.';
      } else if (eventDate < todayStr) {
        errors.eventDate = 'Event date cannot be in the past.';
      }
    }

    if (step === 2) {
      if (guestCount <= 0) {
        errors.guestCount = 'Guest count must be at least 1.';
      }
      if (totalBudget < 10000) {
        errors.totalBudget = 'Budget must be at least ₹10,000.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const payload = {
        eventType,
        title,
        city,
        eventDate,
        guestCount,
        totalBudget,
        currency: 'INR',
        style,
        venueType,
        dietaryRequirements: selectedDietary,
        accessibilityRequirements: selectedAccessibility,
        specialRequests: specialRequests || undefined,
        currentDate: todayStr,
      };

      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.error || 'Failed to generate event plan');
      }

      const json = await res.json();
      setPlan(json.plan, json.ai);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setFormErrors({ submit: err.message || 'Error creating plan. Please retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
          Design Your Celebration
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-lg mx-auto">
          Tell us about your event. CelebrateAI will back-schedule every task and allocate every rupee deterministically.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span className={currentStep >= 1 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
            1. Event Basics
          </span>
          <span className={currentStep >= 2 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
            2. Logistics & Budget
          </span>
          <span className={currentStep >= 3 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
            3. Style & Inclusivity
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label="Planning step progress"
          className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-amber-600 dark:bg-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
        {formErrors.submit && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formErrors.submit}</span>
          </div>
        )}

        {/* ================= STEP 1: EVENT BASICS ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              Step 1: Event Basics
            </h2>

            {/* Event Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Event Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setEventType('wedding')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    eventType === 'wedding'
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/20'
                      : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 mb-2 ${eventType === 'wedding' ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="font-bold text-sm">Wedding</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Mandap, feasts & rituals</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('birthday')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    eventType === 'birthday'
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/20'
                      : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <Cake className={`w-5 h-5 mb-2 ${eventType === 'birthday' ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="font-bold text-sm">Birthday</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Rooftop, cake & games</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('community_event')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    eventType === 'community_event'
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/20'
                      : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <Users2 className={`w-5 h-5 mb-2 ${eventType === 'community_event' ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span className="font-bold text-sm">Community Event</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Park fair & stage stalls</span>
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="event-title" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Event Title
              </label>
              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maya & Arjun's Coastal Fusion Wedding"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
              />
              {formErrors.title && <p className="text-xs text-rose-600">{formErrors.title}</p>}
            </div>

            {/* City Autocomplete with Quick Chips */}
            <div className="space-y-2">
              <label htmlFor="event-city" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Celebration City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="event-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Mumbai, Delhi..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CITY_SUGGESTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-2.5 py-0.5 rounded-full text-xs transition-colors ${
                      city.toLowerCase() === c.toLowerCase()
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {formErrors.city && <p className="text-xs text-rose-600">{formErrors.city}</p>}
            </div>

            {/* Event Date Picker */}
            <div className="space-y-1.5">
              <label htmlFor="event-date" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Event Date (YYYY-MM-DD)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="event-date"
                  type="date"
                  min={todayStr}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
              {formErrors.eventDate && <p className="text-xs text-rose-600">{formErrors.eventDate}</p>}
            </div>
          </div>
        )}

        {/* ================= STEP 2: LOGISTICS & BUDGET ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              Step 2: Logistics & Budget
            </h2>

            {/* Guest Count Stepper */}
            <div className="space-y-2">
              <label htmlFor="guest-count" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Expected Guest Count
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.max(10, prev - 25))}
                  className="w-10 h-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-lg hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-200"
                  aria-label="Decrease guest count by 25"
                >
                  -
                </button>
                <div className="relative flex-1">
                  <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    id="guest-count"
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-center font-bold text-base focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => prev + 25)}
                  className="w-10 h-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-lg hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-200"
                  aria-label="Increase guest count by 25"
                >
                  +
                </button>
              </div>
              {formErrors.guestCount && <p className="text-xs text-rose-600">{formErrors.guestCount}</p>}
            </div>

            {/* Total Budget with INR formatting */}
            <div className="space-y-2">
              <label htmlFor="total-budget" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Total Budget (INR)
              </label>
              <div className="relative">
                <span className="text-stone-400 absolute left-3.5 top-2.5 font-bold text-base">₹</span>
                <input
                  id="total-budget"
                  type="text"
                  value={budgetDisplay}
                  onChange={handleBudgetChange}
                  placeholder="e.g. 15,00,000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-base font-bold focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Calculated: {formatINR(totalBudget)}</span>
                <span>
                  Allocation per guest: {formatINR(Math.round(totalBudget / Math.max(1, guestCount)))}/guest
                </span>
              </div>
              {formErrors.totalBudget && <p className="text-xs text-rose-600">{formErrors.totalBudget}</p>}
            </div>

            {/* Venue Type: Indoor vs Outdoor */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Venue Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['indoor', 'outdoor', 'hybrid'] as VenueTypePreference[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVenueType(v)}
                    className={`py-2 px-3 rounded-xl border text-center capitalize text-sm font-semibold transition-all ${
                      venueType === v
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {venueType === 'outdoor' && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Note: Outdoor events automatically receive a minimum 12% contingency reserve for weather protection.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 3: STYLE & INCLUSIVITY ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
              Step 3: Style & Inclusivity
            </h2>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Celebration Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'budget', label: 'Budget Essential', sub: 'Maximize food & venue' },
                  { id: 'balanced', label: 'Balanced Classic', sub: 'Even distribution' },
                  { id: 'premium', label: 'Premium Luxury', sub: 'Elevated floral & decor' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id as StylePreference)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      style === s.id
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <div className="font-bold text-sm">{s.label}</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Needs Multi-Select */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Dietary Requirements
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIETARY_OPTIONS.map((item) => {
                  const isChecked = selectedDietary.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDietary(item)}
                      className={`p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{item}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessibility Needs Multi-Select */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Accessibility Provisions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ACCESSIBILITY_OPTIONS.map((item) => {
                  const isChecked = selectedAccessibility.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAccessibility(item)}
                      className={`p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{item}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label htmlFor="special-requests" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Special Requests & Notes
              </label>
              <textarea
                id="special-requests"
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Mention specific ritual timings, song choices, or cultural nuances..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold flex items-center space-x-1.5 shadow-xs"
            >
              <span>Next: {currentStep === 1 ? 'Logistics' : 'Style & Inclusivity'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white text-sm font-bold flex items-center space-x-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Plan & AI Enrichment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
