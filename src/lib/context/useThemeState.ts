'use client';

import { useState, useEffect } from 'react';

export function useThemeState(): { isDarkMode: boolean; toggleTheme: () => void } {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('celebrate_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('celebrate_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('celebrate_theme', 'light');
      }
      return next;
    });
  };

  return { isDarkMode, toggleTheme };
}
