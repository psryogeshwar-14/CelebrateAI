'use client';

import React, { useState } from 'react';
import { ComputedPlan } from '@/lib/engine/types';
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';
import { logger } from '@/shared/lib/logger';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

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
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          message: trimmed,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Assistant service unavailable');
      }

      const data = await res.json();
      const reply = data.reply;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply.answer,
          citations: reply.citations,
        },
      ]);

      if (reply.suggestedQuestions && reply.suggestedQuestions.length === 3) {
        setSuggestedQuestions(reply.suggestedQuestions);
      }
    } catch (err: unknown) {
      logger.warn('Chat assistant fallback triggered', { error: String(err) }, 'AskCelebrateAIChat');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I am currently operating in offline mode. For "${plan.input.title}", your budget is fixed at ${plan.budget.totalBudget} with ${plan.timeline.length} scheduled tasks.`,
          citations: ['Offline Baseline'],
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
    <div className="rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 flex flex-col h-[520px]">
      {/* Header */}
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

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 space-y-1.5 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-xs'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.citations && m.citations.length > 0 && (
                <div className="pt-1 border-t border-stone-200/50 dark:border-stone-700/50 flex flex-wrap gap-1">
                  {m.citations.map((c, i) => (
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

            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-stone-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            <span>Consulting grounded event plan...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions Pills */}
      <div className="space-y-1.5 shrink-0 pt-2 border-t border-stone-100 dark:border-stone-800">
        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
          Suggested queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(sq)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 border border-stone-200/60 dark:border-stone-700/60 transition-colors text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
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
