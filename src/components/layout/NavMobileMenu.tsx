'use client';

import React from 'react';
import Link from 'next/link';
import { EventType } from '@/lib/engine/types';

interface NavLinkItem {
  href: string;
  label: string;
}

interface NavMobileMenuProps {
  isOpen: boolean;
  pathname: string;
  navLinks: NavLinkItem[];
  activeDemoId: string | null;
  onClose: () => void;
  onSelectDemo: (demoType: EventType) => void;
}

export function NavMobileMenu({
  isOpen,
  pathname,
  navLinks,
  activeDemoId,
  onClose,
  onSelectDemo,
}: NavMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden border-b border-stone-200 dark:border-stone-800 bg-[#fafaf9] dark:bg-[#0c0a09] px-4 pt-3 pb-5 space-y-3">
      <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`px-3 py-2 rounded-lg text-base font-medium ${
              pathname === link.href
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs font-semibold uppercase text-stone-500 dark:text-stone-400 block mb-2">
          Try Bengaluru Live Demos:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {(['wedding', 'birthday', 'community_event'] as const).map((demoKey) => {
            const label = demoKey === 'community_event' ? 'Community' : demoKey.charAt(0).toUpperCase() + demoKey.slice(1);
            return (
              <button
                key={demoKey}
                type="button"
                onClick={() => {
                  onSelectDemo(demoKey);
                  onClose();
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border text-center ${
                  activeDemoId === demoKey
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
