'use client';

import React from 'react';
import { Bot, User } from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 space-y-1.5 leading-relaxed ${
          isUser
            ? 'bg-amber-600 text-white rounded-tr-xs'
            : 'bg-stone-100 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 rounded-tl-xs'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {message.citations && message.citations.length > 0 && (
          <div className="pt-1 border-t border-stone-200/50 dark:border-stone-700/50 flex flex-wrap gap-1">
            {message.citations.map((c, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/20 text-stone-600 dark:text-stone-300 font-medium"
              >
                Ref: {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
