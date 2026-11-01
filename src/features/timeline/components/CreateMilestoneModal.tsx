'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import type { TimelineMilestone } from '@/lib/engine/types';
import { MilestoneFormFields } from './MilestoneFormFields';

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

    const daysBefore = Math.max(
      0,
      Math.round(
        (new Date(eventDate).getTime() - new Date(dueDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

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
      daysBeforeEvent: daysBefore,
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
        <MilestoneFormFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          owner={owner}
          setOwner={setOwner}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          eventDate={eventDate}
        />

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
