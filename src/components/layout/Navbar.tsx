'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCelebrate } from '@/lib/context/celebrate-context';
import {
  Sparkles,
  Calendar,
  Sun,
  Moon,
  Menu,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme, loadDemoEvent, activeDemoId, plan } = useCelebrate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/plan', label: 'Plan New Event' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/export', label: 'Export & Share' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-[#fafaf9]/90 dark:bg-[#0c0a09]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Demo Switcher & Controls */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-xs text-stone-500 dark:text-stone-400 mr-1 font-medium">
              Demo:
            </span>
            <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-0.5 rounded-lg border border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => loadDemoEvent('wedding')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  activeDemoId === 'wedding'
                    ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                aria-pressed={activeDemoId === 'wedding'}
              >
                Wedding
              </button>
              <button
                type="button"
                onClick={() => loadDemoEvent('birthday')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  activeDemoId === 'birthday'
                    ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                aria-pressed={activeDemoId === 'birthday'}
              >
                Birthday
              </button>
              <button
                type="button"
                onClick={() => loadDemoEvent('community_event')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  activeDemoId === 'community_event'
                    ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                aria-pressed={activeDemoId === 'community_event'}
              >
                Community
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-stone-200 dark:border-stone-800 bg-[#fafaf9] dark:bg-[#0c0a09] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
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
              <button
                type="button"
                onClick={() => {
                  loadDemoEvent('wedding');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border text-center ${
                  activeDemoId === 'wedding'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                Wedding
              </button>
              <button
                type="button"
                onClick={() => {
                  loadDemoEvent('birthday');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border text-center ${
                  activeDemoId === 'birthday'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                Birthday
              </button>
              <button
                type="button"
                onClick={() => {
                  loadDemoEvent('community_event');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border text-center ${
                  activeDemoId === 'community_event'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                Community
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
