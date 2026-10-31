'use client';

import React, { useState } from 'react';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { TimelineGanttView } from '@/components/dashboard/TimelineGanttView';
import { TimelineMilestone } from '@/lib/engine/types';
import { TimelineKpiCards } from './TimelineKpiCards';
import { TimelineFilterBar } from './TimelineFilterBar';
import { MilestoneCard } from './MilestoneCard';
import { CreateMilestoneModal } from './CreateMilestoneModal';

export function TimelineFeature() {
  const { plan, completedTaskIds, toggleTask, isLoading } = useCelebrate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'completed' | 'overdue'>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');

  const [customMilestones, setCustomMilestones] = useState<TimelineMilestone[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isLoading || !plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Loading Timeline...
        </h2>
      </div>
    );
  }

  const allMilestones = [...plan.timeline, ...customMilestones];

  const totalTasks = allMilestones.length;
  const completedCount = allMilestones.filter((t) => completedTaskIds.includes(t.id)).length;
  const overdueTasks = allMilestones.filter(
    (t) => t.isOverdue && !completedTaskIds.includes(t.id)
  );
  const overdueCount = overdueTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const filteredMilestones = allMilestones.filter((milestone) => {
    const isCompleted = completedTaskIds.includes(milestone.id);
    const isOverdue = milestone.isOverdue && !isCompleted;

    if (
      searchQuery &&
      !milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !milestone.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'todo' && (isCompleted || isOverdue)) return false;
    if (statusFilter === 'overdue' && !isOverdue) return false;

    if (ownerFilter !== 'all' && milestone.owner !== ownerFilter) return false;

    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Back-Scheduled Timeline & Tasks" />

      {/* Top Timeline KPIs */}
      <TimelineKpiCards
        totalTasks={totalTasks}
        completedCount={completedCount}
        overdueCount={overdueCount}
        progressPercent={progressPercent}
      />

      {/* Filter and Mode Bar */}
      <TimelineFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ownerFilter={ownerFilter}
        setOwnerFilter={setOwnerFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => setIsAddOpen(true)}
      />

      {/* View Content: List vs Gantt */}
      {viewMode === 'gantt' ? (
        <TimelineGanttView
          timeline={filteredMilestones}
          completedTaskIds={completedTaskIds}
          onToggleTask={toggleTask}
        />
      ) : (
        <div className="space-y-3">
          {filteredMilestones.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
              No milestones match your current filter criteria.
            </div>
          ) : (
            filteredMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isCompleted={completedTaskIds.includes(milestone.id)}
                onToggle={toggleTask}
              />
            ))
          )}
        </div>
      )}

      {/* Add Milestone Modal */}
      <CreateMilestoneModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddMilestone={(m) => setCustomMilestones((prev) => [...prev, m])}
        eventDate={plan.input.eventDate}
      />
    </div>
  );
}
