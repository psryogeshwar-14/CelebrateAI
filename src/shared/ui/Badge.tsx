import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'amber' | 'emerald' | 'rose' | 'stone' | 'sky';
  size?: 'sm' | 'md';
}

export function Badge({
  className = '',
  variant = 'amber',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40',
    emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40',
    rose: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300/40 dark:border-rose-700/40',
    stone: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700',
    sky: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300/40 dark:border-sky-700/40',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
