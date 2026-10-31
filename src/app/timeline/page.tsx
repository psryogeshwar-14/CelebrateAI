'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { EventSubNav } from '@/components/layout/EventSubNav';
import { TimelineGanttView } from '@/components/dashboard/TimelineGanttView';
import { TimelineMilestone } from '@/lib/engine/types';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Filter,
  Search,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function TimelinePage() {
  const { plan, completedTaskIds, toggleTask, isLoading } = useCelebrate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'completed' | 'overdue'>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');

  // Custom added tasks
  const [customMilestones, setCustomMilestones] = useState<TimelineMilestone[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskOwner, setNewTaskOwner] = useState<'host' | 'family' | 'vendor' | 'planner'>('host');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

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

  // Derived metrics
  const totalTasks = allMilestones.length;
  const completedCount = allMilestones.filter((t) => completedTaskIds.includes(t.id)).length;
  const overdueTasks = allMilestones.filter(
    (t) => t.isOverdue && !completedTaskIds.includes(t.id)
  );
  const overdueCount = overdueTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Filtered milestones
  const filteredMilestones = allMilestones.filter((milestone) => {
    const isCompleted = completedTaskIds.includes(milestone.id);
    const isOverdue = milestone.isOverdue && !isCompleted;

    // Search query
    if (
      searchQuery &&
      !milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !milestone.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (statusFilter === 'completed' && !isCompleted) return false;
    if (statusFilter === 'todo' && (isCompleted || isOverdue)) return false;
    if (statusFilter === 'overdue' && !isOverdue) return false;

    // Owner filter
    if (ownerFilter !== 'all' && milestone.owner !== ownerFilter) return false;

    return true;
  });

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newMilestone: TimelineMilestone = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: 'Custom milestone added by user',
      category: 'custom',
      dueDate: newTaskDueDate || plan.input.eventDate,
      daysBeforeEvent: 0,
      owner: newTaskOwner,
      priority: 'medium',
      isOverdue: false,
      isDoNow: false,
      dependencies: [],
    };

    setCustomMilestones((prev) => [...prev, newMilestone]);
    setNewTaskTitle('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Sub Nav */}
      <EventSubNav title="Milestone Timeline & Action Plan" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Total Milestones</span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-50">
            {totalTasks}
          </div>
          <p className="text-xs text-stone-500">Back-scheduled from event date</p>
        </div>

        {/* Completed Progress */}
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Progress Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {completedCount} <span className="text-sm font-normal text-stone-500">/ {totalTasks}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Overdue / Do Now */}
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Overdue (Do Now)</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div
            className={`text-2xl font-black ${
              overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'
            }`}
          >
            {overdueCount}
          </div>
          <p className="text-xs text-stone-500">
            {overdueCount > 0 ? 'Urgent attention required' : 'All schedule items on track'}
          </p>
        </div>

        {/* Days Remaining */}
        <div className="rounded-2xl p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Countdown</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400">
            {plan.summary.daysUntilEvent} <span className="text-sm font-normal text-stone-500">Days</span>
          </div>
          <p className="text-xs text-stone-500">Event date: {plan.input.eventDate}</p>
        </div>
      </div>

      {/* Overdue Alert Banner */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-red-900 dark:text-red-200">
              {overdueCount} {overdueCount === 1 ? 'task is' : 'tasks are'} overdue (&quot;Do Now&quot;)
            </h3>
            <p className="text-xs text-red-800 dark:text-red-300">
              The deterministic engine tagged these milestones because their back-scheduled deadlines have already passed relative to today. Please complete or reschedule them immediately.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Search, Filters, View Mode, Add Milestone */}
      <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milestones..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                List View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  viewMode === 'gantt'
                    ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Monthly Gantt
              </button>
            </div>

            {/* Add Milestone Trigger */}
            <button
              type="button"
              onClick={() => setIsAddOpen(!isAddOpen)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <span className="text-stone-500 font-semibold flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {(['all', 'todo', 'overdue', 'completed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                statusFilter === status
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {status === 'overdue' ? 'Do Now (Overdue)' : status}
            </button>
          ))}

          <span className="text-stone-300 dark:text-stone-700 mx-1">|</span>

          <span className="text-stone-500 font-semibold flex items-center space-x-1">
            <User className="w-3.5 h-3.5" />
            <span>Owner:</span>
          </span>
          {['all', 'host', 'family', 'vendor', 'planner'].map((owner) => (
            <button
              key={owner}
              type="button"
              onClick={() => setOwnerFilter(owner)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                ownerFilter === owner
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {owner}
            </button>
          ))}
        </div>

        {/* Add Milestone Form */}
        {isAddOpen && (
          <form
            onSubmit={handleAddMilestone}
            className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Create New Custom Milestone
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Confirm floral theme samples"
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Responsible Owner
                </label>
                <select
                  value={newTaskOwner}
                  onChange={(e) => setNewTaskOwner(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="host">Host</option>
                  <option value="family">Family</option>
                  <option value="vendor">Vendor</option>
                  <option value="planner">Planner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 text-xs rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700"
              >
                Save Milestone
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Main Content: List or Gantt */}
      {viewMode === 'gantt' ? (
        <TimelineGanttView
          timeline={allMilestones}
          completedTaskIds={completedTaskIds}
          onToggleTask={toggleTask}
        />
      ) : (
        <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Chronological Back-Scheduled Milestones ({filteredMilestones.length})
            </h3>
            <span className="text-xs text-stone-500">
              Sorted by due date leading up to event day
            </span>
          </div>

          {filteredMilestones.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              No milestones match the selected filters.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMilestones.map((milestone) => {
                const isCompleted = completedTaskIds.includes(milestone.id);
                const isOverdue = milestone.isOverdue && !isCompleted;

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 opacity-80'
                        : isOverdue
                        ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleTask(milestone.id)}
                        className="w-5 h-5 mt-0.5 rounded-md border-stone-300 dark:border-stone-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        id={`task-${milestone.id}`}
                        aria-label={`Mark ${milestone.title} as ${isCompleted ? 'incomplete' : 'completed'}`}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <label
                            htmlFor={`task-${milestone.id}`}
                            className={`text-sm font-semibold cursor-pointer ${
                              isCompleted
                                ? 'line-through text-stone-400 dark:text-stone-500'
                                : 'text-stone-900 dark:text-stone-100'
                            }`}
                          >
                            {milestone.title}
                          </label>

                          {/* Status badges */}
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
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
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Due Date & Owner */}
                    <div className="flex items-center space-x-3 text-xs sm:self-center shrink-0 pl-8 sm:pl-0">
                      <div className="text-right">
                        <div className="font-mono font-medium text-stone-900 dark:text-stone-100">
                          {milestone.dueDate}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {milestone.daysBeforeEvent === 0
                            ? 'Event Day'
                            : `T-${milestone.daysBeforeEvent}d`}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider ${
                          milestone.owner === 'host'
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                            : milestone.owner === 'family'
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                            : milestone.owner === 'vendor'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {milestone.owner}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
