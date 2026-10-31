'use client';

import React, { useState } from 'react';
import { ComputedPlan } from '@/lib/engine/types';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { logger } from '@/shared/lib/logger';
import { ChatMessage, ChatMessageItem } from './ChatMessageItem';
import { ChatSuggestions } from './ChatSuggestions';

interface AskCelebrateAIChatProps {
  plan: ComputedPlan;
}

export function AskCelebrateAIChat({ plan }: AskCelebrateAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I am your grounded CelebrateAI assistant for "${plan.input.title}". Ask me anything about your ${plan.input.city} celebration, budget breakdown, upcoming milestones, or vendor checklist.`,
      citations: ['Plan Overview'],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'Which vendors have the tightest booking deadline?',
    'How is our contingency reserve allocated?',
    'What tasks are overdue right now?',
  ]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, plan, history }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.answer, citations: data.citations || ['Grounded Plan'] },
        ]);
        if (data.suggestedQuestions?.length) {
          setSuggestedQuestions(data.suggestedQuestions);
        }
      } else {
        throw new Error('Assistant API returned non-OK status');
      }
    } catch (err: unknown) {
      logger.warn('Failed to query grounded assistant', { error: String(err) }, 'ask-celebrate-ai');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Here are the key facts from your plan: Budget is ₹${plan.budget.totalBudget.toLocaleString('en-IN')}, and ${plan.timeline.length} milestones are scheduled.`,
          citations: ['Local Plan Data'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex flex-col h-[520px] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
              <span>Ask CelebrateAI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Answers strictly using your locked budget and timeline
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <ChatMessageItem key={idx} message={m} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-stone-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            <span>Consulting grounded event plan...</span>
          </div>
        )}
      </div>

      <ChatSuggestions suggestions={suggestedQuestions} isLoading={isLoading} onSelect={handleSendMessage} />

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about budget, vendors, run sheet..."
          disabled={isLoading}
          className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus-visible:ring-2 focus-visible:ring-amber-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white transition-colors"
          aria-label="Send message to assistant"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
