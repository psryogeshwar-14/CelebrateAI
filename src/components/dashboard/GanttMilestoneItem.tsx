'use client';

import React from 'react';
import { TimelineMilestone } from '@/lib/engine/types';
import { CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react';

interface GanttMilestoneItemProps {
  task: TimelineMilestone;
  isDone: boolean;
  onToggle: (id: string) => void;
}

export function GanttMilestoneItem({ task, isDone, onToggle }: GanttMilestoneItemProps) {
  const isOverdue = task.isOverdue && !isDone;

  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
        isDone
          ? 'bg-stone-50 dark:bg-stone-950/30 border-stone-200/60 dark:border-stone-800/60 opacity-60'
          : isOverdue
          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400'
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          type="button"
          className="mt-0.5 text-stone-400 hover:text-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          aria-label={isDone ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <Circle className="w-5 h-5 text-stone-400 group-hover:text-amber-600" />
          )}
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span
              className={`text-sm font-semibold ${
                isDone
                  ? 'line-through text-stone-500 dark:text-stone-400'
                  : 'text-stone-900 dark:text-stone-100'
              }`}
            >
              {task.title}
            </span>

            {isOverdue && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 inline-flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Do now (Overdue)</span>
              </span>
            )}

            {task.priority === 'critical' && !isDone && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Critical Path
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
            {task.description}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 space-y-1">
        <div className="inline-flex items-center space-x-1 text-xs font-mono font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
          <Calendar className="w-3 h-3 text-stone-400" />
          <span>{task.dueDate}</span>
        </div>
        <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
          Owner: {task.owner}
        </div>
      </div>
    </div>
  );
}
