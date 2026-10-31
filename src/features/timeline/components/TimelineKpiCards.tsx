import React from 'react';
import { CalendarDays, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface TimelineKpiCardsProps {
  totalTasks: number;
  completedCount: number;
  overdueCount: number;
  progressPercent: number;
}

export function TimelineKpiCards({
  totalTasks,
  completedCount,
  overdueCount,
  progressPercent,
}: TimelineKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Milestones */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Total Milestones</span>
          <CalendarDays className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
          {totalTasks}
        </div>
        <p className="text-xs text-stone-500">
          Back-scheduled from event date
        </p>
      </div>

      {/* Completed */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Completed</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {completedCount}
        </div>
        <p className="text-xs text-stone-500">
          {progressPercent}% of milestones done
        </p>
      </div>

      {/* Overdue */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Action Required (Overdue)</span>
          <AlertCircle className="w-4 h-4 text-rose-600" />
        </div>
        <div
          className={`text-2xl font-black ${
            overdueCount > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-stone-400'
          }`}
        >
          {overdueCount}
        </div>
        <p className="text-xs text-stone-500">
          {overdueCount > 0 ? 'Urgent attention needed' : 'All deadlines on track'}
        </p>
      </div>

      {/* Overall Progress */}
      <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Overall Readiness</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-black text-amber-600 dark:text-amber-500">
          {progressPercent}%
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
