import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function EngineVsAiComparison() {
  return (
    <section className="rounded-3xl bg-stone-900 text-stone-100 p-8 sm:p-10 border border-stone-800 space-y-6">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Architectural Integrity</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Deterministic Engine + Grounded AI
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
          CelebrateAI strictly separates mathematical truth from generative creativity. The AI is never trusted with arithmetic or calendar calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Left: Deterministic Core */}
        <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Math Engine</span>
          </div>
          <ul className="text-xs text-stone-300 space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Hamilton-Hare Largest Remainder rounding eliminates sum discrepancy</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Reverse calendar back-scheduling prevents post-event deadlines</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Strict 10%+ contingency locked in before category distribution</span>
            </li>
          </ul>
        </div>

        {/* Right: Grounded AI */}
        <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Gemini 2.5 Creative Intelligence</span>
          </div>
          <ul className="text-xs text-stone-300 space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Structured JSON Schema guarantees type-safe cultural recommendations</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Grounded QA assistant answers strictly from computed context</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Zero hallucinations: dates and budget caps cannot be overridden by AI</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
