'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { BudgetDonutChart } from '@/components/dashboard/BudgetDonutChart';
import { EditSpendModal } from '@/components/dashboard/EditSpendModal';
import { BudgetKpiCards } from './BudgetKpiCards';
import { BudgetTable } from './BudgetTable';
import { SavingsTipsCard } from './SavingsTipsCard';

export function BudgetFeature() {
  const { plan, aiEnrichment, actualSpends, updateCategoryActualSpend, isLoading } =
    useCelebrate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading Budget...
        </h2>
      </div>
    );
  }

  const { budget } = plan;
  const totalPlanned = budget.totalBudget;
  const totalActual = Object.values(actualSpends).reduce((acc, v) => acc + v, 0);
  const variance = totalPlanned - totalActual;
  const isOverBudget = variance < 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Budget & Expense Manager" />

      {/* Top Budget KPIs */}
      <BudgetKpiCards
        totalPlanned={totalPlanned}
        totalActual={totalActual}
        variance={variance}
        isOverBudget={isOverBudget}
        contingencyAmount={budget.contingencyAmount}
        contingencyPercentage={budget.contingencyPercentage}
        guestCount={plan.input.guestCount}
      />

      {/* Visual Donut Chart */}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs">
        <BudgetDonutChart
          allocations={budget.allocations}
          totalBudget={budget.totalBudget}
        />
      </div>

      {/* Table of Allocations & Actuals */}
      <BudgetTable
        allocations={budget.allocations}
        actualSpends={actualSpends}
        onOpenEditModal={() => setIsEditModalOpen(true)}
      />

      {/* Savings Tips */}
      <SavingsTipsCard tips={aiEnrichment?.savingsTips || []} />

      {/* Edit Spends Modal */}
      {isEditModalOpen && (
        <EditSpendModal
          onClose={() => setIsEditModalOpen(false)}
          allocations={budget.allocations}
          actualSpends={actualSpends}
          onSave={updateCategoryActualSpend}
        />
      )}
    </div>
  );
}
