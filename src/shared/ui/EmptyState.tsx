'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">{title}</h3>
      {description && (
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
