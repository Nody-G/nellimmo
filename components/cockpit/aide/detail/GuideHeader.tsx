'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import type { HelpGuide } from '@/lib/help-content';

export function GuideHeader({ guide }: { guide: HelpGuide }) {
  return (
    <div className="space-y-3 border-b border-gray-100 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF5F8] text-[#E12B7B] text-[11px] font-bold uppercase tracking-wider">
            {guide.categoryLabel}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {guide.readTimeMinutes} minutes
          </span>
        </div>

        <Link
          href={guide.toolRoute}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E12B7B] hover:bg-[#C71B62] text-white text-xs font-bold shadow-xs transition"
        >
          <span>Accéder à : {guide.toolLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
        {guide.title}
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">{guide.summary}</p>
    </div>
  );
}
