'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useWizardForm } from '../hooks/useWizardForm';
import { WizardNavigation } from './WizardNavigation';
import { WizardStep1Basics } from './WizardStep1Basics';
import { WizardStep2Scale } from './WizardStep2Scale';
import { WizardStep3Style } from './WizardStep3Style';

export function EventWizard() {
  const {
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
  } = useWizardForm();

  const stepTitles = ['Core Details', 'Budget & Scale', 'Style & Customization'];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8">
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
              Create Your Event Plan
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Step {currentStep} of 3: {stepTitles[currentStep - 1]}
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${currentStep} of 3`}
            className="flex items-center space-x-1"
          >
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === currentStep
                    ? 'bg-amber-600 text-white shadow-xs'
                    : step < currentStep
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                }`}
              >
                {step < currentStep ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && (
            <WizardStep1Basics
              eventType={eventType} setEventType={setEventType}
              title={title} setTitle={setTitle}
              city={city} setCity={setCity}
              eventDate={eventDate} setEventDate={setEventDate}
              formErrors={formErrors}
            />
          )}

          {currentStep === 2 && (
            <WizardStep2Scale
              eventType={eventType}
              guestCount={guestCount} setGuestCount={setGuestCount}
              totalBudget={totalBudget}
              budgetDisplay={budgetDisplay} handleBudgetChange={handleBudgetChange}
              formErrors={formErrors}
            />
          )}

          {currentStep === 3 && (
            <WizardStep3Style
              style={style} setStyle={setStyle}
              venueType={venueType} setVenueType={setVenueType}
              selectedDietary={selectedDietary} toggleDietary={toggleDietary}
              selectedAccessibility={selectedAccessibility} toggleAccessibility={toggleAccessibility}
              specialRequests={specialRequests} setSpecialRequests={setSpecialRequests}
            />
          )}

          {formErrors.submit && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formErrors.submit}</span>
            </div>
          )}

          <WizardNavigation
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onNext={handleNext}
          />
        </form>
      </div>
    </div>
  );
}
