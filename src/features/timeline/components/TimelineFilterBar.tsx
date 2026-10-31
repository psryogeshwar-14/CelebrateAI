'use client';

import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

interface TimelineFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: 'all' | 'todo' | 'completed' | 'overdue';
  setStatusFilter: (s: 'all' | 'todo' | 'completed' | 'overdue') => void;
  ownerFilter: string;
  setOwnerFilter: (o: string) => void;
  viewMode: 'list' | 'gantt';
  setViewMode: (v: 'list' | 'gantt') => void;
  onOpenAddModal: () => void;
}

export function TimelineFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  ownerFilter,
  setOwnerFilter,
  viewMode,
  setViewMode,
  onOpenAddModal,
}: TimelineFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search milestones by title or description..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | 'todo' | 'completed' | 'overdue')
          }
          className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 font-medium focus:outline-hidden"
        >
          <option value="all">All Statuses</option>
          <option value="todo">Pending (To-Do)</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue Deadlines</option>
        </select>

        {/* Owner Filter */}
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 font-medium focus:outline-hidden"
        >
          <option value="all">All Owners</option>
          <option value="host">Host</option>
          <option value="family">Family</option>
          <option value="vendor">Vendor</option>
          <option value="planner">Lead Coordinator</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('gantt')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'gantt'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Gantt
          </button>
        </div>

        {/* Add Milestone Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </div>
  );
}
