import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
}

export function Card({
  className = '',
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all';
  const variantStyles = {
    default: 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs',
    flat: 'bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800',
    interactive: 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md cursor-pointer',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
