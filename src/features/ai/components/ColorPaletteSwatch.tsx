'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorPaletteSwatchProps {
  palette: string[];
  copiedHex: string | null;
  onCopyHex: (hex: string) => void;
}

export function ColorPaletteSwatch({
  palette,
  copiedHex,
  onCopyHex,
}: ColorPaletteSwatchProps) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
        4-Swatch Color Palette
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {palette.map((hex, hexIdx) => {
          const isCopied = copiedHex === hex;
          return (
            <button
              key={hexIdx}
              type="button"
              onClick={() => onCopyHex(hex)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center space-x-2.5 hover:border-amber-400 transition-colors group text-left"
            >
              <span
                className="w-5 h-5 rounded-lg border border-black/10 shrink-0 shadow-xs"
                style={{ backgroundColor: hex }}
              />
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[11px] font-bold text-stone-900 dark:text-stone-100 block truncate">
                  {hex}
                </span>
              </div>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
