import React from 'react';
import { HelpCircle } from 'lucide-react';

interface VendorQuestionsAccordionProps {
  questions: string[];
}

export function VendorQuestionsAccordion({ questions }: VendorQuestionsAccordionProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
      <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>Essential Questions to Ask Before Signing</span>
      </div>
      <ul className="space-y-1.5 pl-2 text-xs text-stone-600 dark:text-stone-300">
        {questions.map((q, qIdx) => (
          <li key={qIdx} className="flex items-start space-x-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
