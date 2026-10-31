'use client';

import React, { useState } from 'react';
import { TimelineMilestone } from '@/lib/engine/types';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Calendar,
  Filter,
} from 'lucide-react';

interface TimelineGanttViewProps {
  timeline: TimelineMilestone[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}

export function TimelineGanttView({
  timeline,
  completedTaskIds,
  onToggleTask,
}: TimelineGanttViewProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');

  // Group milestones by Month (e.g. "May 2026", "June 2026")
  const groupedByMonth = timeline.reduce((acc, m) => {
    const dateObj = new Date(`${m.dueDate}T00:00:00Z`);
    const monthKey = isNaN(dateObj.getTime())
      ? 'Milestones'
      : dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(m);
    return acc;
  }, {} as Record<string, TimelineMilestone[]>);

  const filteredTimeline = timeline.filter((m) => {
    const isCompleted = completedTaskIds.includes(m.id);
    if (filter === 'completed') return isCompleted;
    if (filter === 'pending') return !isCompleted;
    if (filter === 'overdue') return m.isOverdue && !isCompleted;
    return true;
  });

  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Back-Scheduled Timeline & Gantt View
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {completedTaskIds.length} of {timeline.length} milestones checked off
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            All ({timeline.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('overdue')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'overdue'
                ? 'bg-rose-500 text-white font-semibold'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
            }`}
          >
            Overdue ({timeline.filter((m) => m.isOverdue && !completedTaskIds.includes(m.id)).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            Done ({completedTaskIds.length})
          </button>
        </div>
      </div>

      {/* Monthly Grouped View */}
      <div className="space-y-6">
        {Object.entries(groupedByMonth).map(([month, tasks]) => {
          const visibleTasks = tasks.filter((t) => filteredTimeline.includes(t));
          if (visibleTasks.length === 0) return null;

          return (
            <div key={month} className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                  {month}
                </span>
                <div className="flex-1 h-px bg-stone-100 dark:bg-stone-800" />
              </div>

              <div className="space-y-2">
                {visibleTasks.map((task) => {
                  const isDone = completedTaskIds.includes(task.id);
                  const isOverdue = task.isOverdue && !isDone;

                  return (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
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
                                <AlertCircle className="w-3 h-3" />
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

                      {/* Right Meta Pill */}
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
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
