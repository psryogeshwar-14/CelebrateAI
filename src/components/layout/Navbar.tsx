'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import { Sparkles, Sun, Moon, Menu, X } from 'lucide-react';
import { NavDemoButtons } from './NavDemoButtons';
import { NavMobileMenu } from './NavMobileMenu';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/plan', label: 'Plan Event' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/budget', label: 'Budget' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/ideas', label: 'Ideas' },
  { href: '/assistant', label: 'Assistant' },
  { href: '/export', label: 'Export' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme, loadDemoEvent, activeDemoId } = useCelebrate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-[#fafaf9]/90 dark:bg-[#0c0a09]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2.5 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            aria-label="CelebrateAI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm shadow-amber-600/30">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                Celebrate<span className="text-amber-600 dark:text-amber-500">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium -mt-1">
                Deterministic Planner
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  pathname === link.href
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:flex items-center space-x-3">
            <NavDemoButtons activeDemoId={activeDemoId} onSelectDemo={loadDemoEvent} />

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>
          </div>

          <div className="flex sm:hidden items-center space-x-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <NavMobileMenu
        isOpen={isMobileMenuOpen}
        pathname={pathname}
        navLinks={NAV_LINKS}
        activeDemoId={activeDemoId}
        onClose={() => setIsMobileMenuOpen(false)}
        onSelectDemo={loadDemoEvent}
      />
    </header>
  );
}
