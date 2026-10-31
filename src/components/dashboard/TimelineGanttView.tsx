'use client';

import React, { useState } from 'react';
import { TimelineMilestone } from '@/lib/engine/types';
import { GanttMilestoneItem } from './GanttMilestoneItem';
import { GanttFilterButtons, GanttFilterType } from './GanttFilterButtons';

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
  const [filter, setFilter] = useState<GanttFilterType>('all');

  const groupedByMonth = timeline.reduce((acc, m) => {
    const dateObj = new Date(`${m.dueDate}T00:00:00Z`);
    const monthKey = isNaN(dateObj.getTime())
      ? 'Milestones'
      : dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(m);
    return acc;
  }, {} as Record<string, TimelineMilestone[]>);

  const overdueCount = timeline.filter((m) => m.isOverdue && !completedTaskIds.includes(m.id)).length;
  const pendingCount = timeline.length - completedTaskIds.length;

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

        <GanttFilterButtons
          filter={filter}
          totalCount={timeline.length}
          pendingCount={pendingCount}
          overdueCount={overdueCount}
          completedCount={completedTaskIds.length}
          onFilterChange={setFilter}
        />
      </div>

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
                {visibleTasks.map((task) => (
                  <GanttMilestoneItem
                    key={task.id}
                    task={task}
                    isDone={completedTaskIds.includes(task.id)}
                    onToggle={onToggleTask}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
