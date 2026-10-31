'use client';

import React from 'react';
import { TimelineMilestone } from '@/lib/engine/types';
import { CheckCircle2, Clock, User, AlertCircle } from 'lucide-react';

interface MilestoneCardProps {
  milestone: TimelineMilestone;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export function MilestoneCard({
  milestone,
  isCompleted,
  onToggle,
}: MilestoneCardProps) {
  const isOverdue = milestone.isOverdue && !isCompleted;

  const priorityColors = {
    critical: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    high: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    medium: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    low: 'text-stone-700 bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700',
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all flex items-start space-x-4 ${
        isCompleted
          ? 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 opacity-70'
          : isOverdue
          ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-300 dark:border-rose-900 shadow-xs'
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(milestone.id)}
        aria-label={`Mark task ${milestone.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
          isCompleted
            ? 'bg-emerald-600 text-white'
            : 'border-2 border-stone-300 dark:border-stone-700 hover:border-amber-500'
        }`}
      >
        {isCompleted && <CheckCircle2 className="w-4 h-4" />}
      </button>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h3
              className={`text-sm font-bold ${
                isCompleted
                  ? 'line-through text-stone-400 dark:text-stone-500'
                  : 'text-stone-900 dark:text-stone-100'
              }`}
            >
              {milestone.title}
            </h3>

            {/* Accessible Status Badges */}
            {isOverdue && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                Do Now
              </span>
            )}

            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Done
              </span>
            )}

            {milestone.priority === 'high' && !isCompleted && (
              <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                High Priority
              </span>
            )}

            {milestone.id.startsWith('ai_') && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                AI Custom
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Priority Badge */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                priorityColors[milestone.priority]
              }`}
            >
              {milestone.priority}
            </span>

            {/* Due Date */}
            <span
              className={`text-xs font-mono font-bold flex items-center space-x-1 ${
                isOverdue
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {isOverdue && <AlertCircle className="w-3.5 h-3.5 mr-0.5" />}
              <span>{milestone.dueDate}</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          {milestone.description}
        </p>

        {/* Footer Meta */}
        <div className="flex items-center space-x-4 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
          <span className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>Owner: <strong className="capitalize text-stone-700 dark:text-stone-300">{milestone.owner}</strong></span>
          </span>

          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{milestone.daysBeforeEvent} days before event</span>
          </span>
        </div>
      </div>
    </div>
  );
}
