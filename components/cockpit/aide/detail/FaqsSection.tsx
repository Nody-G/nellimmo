'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

interface FaqsSectionProps {
  faqs: HelpGuide['faqs'];
}

export function FaqsSection({ faqs }: FaqsSectionProps) {
  return (
    <div className="space-y-3 border-t border-gray-100 pt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-gray-400" />
        <span>Questions Fréquentes sur cette Fonctionnalité</span>
      </h3>

      <div className="space-y-2">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 space-y-1"
          >
            <span className="text-xs font-bold text-gray-900 block">{faq.question}</span>
            <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
