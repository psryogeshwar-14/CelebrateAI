'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { ColorPaletteSwatch } from './ColorPaletteSwatch';

interface ThemeCardProps {
  theme: {
    name: string;
    description: string;
    palette: string[];
    decorIdeas: string[];
    signatureMoment: string;
  };
  themeIndex: number;
  copiedHex: string | null;
  onCopyHex: (hex: string) => void;
}

export function ThemeCard({
  theme,
  themeIndex,
  copiedHex,
  onCopyHex,
}: ThemeCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
            0{themeIndex + 1}
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              {theme.name}
            </h3>
            <p className="text-xs text-stone-500">
              Personalized aesthetic concept
            </p>
          </div>
        </div>

        {/* Color Palette preview dots */}
        <div className="flex items-center space-x-1.5">
          {theme.palette.map((color, idx) => (
            <span
              key={idx}
              className="w-5 h-5 rounded-full border border-black/10 inline-block shadow-xs"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        {theme.description}
      </p>

      {/* Palette Interactive Swatches */}
      <ColorPaletteSwatch
        palette={theme.palette}
        copiedHex={copiedHex}
        onCopyHex={onCopyHex}
      />

      {/* Decor Execution Ideas */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
          Decor & Floral Ideas
        </span>
        <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
          {theme.decorIdeas.map((idea, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Signature Moment */}
      <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 space-y-1">
        <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-200 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Signature Highlight Moment</span>
        </div>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
          {theme.signatureMoment}
        </p>
      </div>
    </div>
  );
}
