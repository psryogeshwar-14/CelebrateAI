'use client';

import React from 'react';

interface MilestoneFormFieldsProps {
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
  owner: 'host' | 'family' | 'vendor' | 'planner';
  setOwner: (o: 'host' | 'family' | 'vendor' | 'planner') => void;
  priority: 'low' | 'medium' | 'high' | 'critical';
  setPriority: (p: 'low' | 'medium' | 'high' | 'critical') => void;
  dueDate: string;
  setDueDate: (d: string) => void;
  eventDate: string;
}

export function MilestoneFormFields({
  title,
  setTitle,
  description,
  setDescription,
  owner,
  setOwner,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  eventDate,
}: MilestoneFormFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="block font-semibold text-stone-700 dark:text-stone-300">
          Task Title *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Schedule bridal hair trial"
          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-semibold text-stone-700 dark:text-stone-300">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Key reminders, notes, or checklist items..."
          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block font-semibold text-stone-700 dark:text-stone-300">
            Task Owner
          </label>
          <select
            value={owner}
            onChange={(e) =>
              setOwner(e.target.value as 'host' | 'family' | 'vendor' | 'planner')
            }
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100"
          >
            <option value="host">Host / Client</option>
            <option value="family">Family / Close Friends</option>
            <option value="vendor">Vendor</option>
            <option value="planner">Lead Coordinator</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block font-semibold text-stone-700 dark:text-stone-300">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as 'low' | 'medium' | 'high' | 'critical')
            }
            className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-semibold text-stone-700 dark:text-stone-300">
          Due Date *
        </label>
        <input
          type="date"
          required
          max={eventDate}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100"
        />
      </div>
    </>
  );
}
