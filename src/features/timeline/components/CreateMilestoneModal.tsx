'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { TimelineMilestone } from '@/lib/engine/types';

interface CreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMilestone: (m: TimelineMilestone) => void;
  eventDate: string;
}

export function CreateMilestoneModal({
  isOpen,
  onClose,
  onAddMilestone,
  eventDate,
}: CreateMilestoneModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState<'host' | 'family' | 'vendor' | 'planner'>('host');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const newMilestone: TimelineMilestone = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Custom user task',
      category: 'general',
      dueDate,
      owner,
      priority,
      dependencies: [],
      isDoNow: false,
      daysBeforeEvent: Math.max(
        0,
        Math.round(
          (new Date(eventDate).getTime() - new Date(dueDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),
      isOverdue: new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0),
    };

    onAddMilestone(newMilestone);
    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Milestone Task"
      description="Create an actionable task back-scheduled before your event date."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

        <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-semibold hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
          >
            Save Milestone
          </button>
        </div>
      </form>
    </Modal>
  );
}
