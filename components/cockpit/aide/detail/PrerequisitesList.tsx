'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface PrerequisitesListProps {
  items: string[];
}

export function PrerequisitesList({ items }: PrerequisitesListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-400" />
        <span>Prérequis & Documents Indispensables</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((prereq, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-700"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E12B7B] mt-1.5 shrink-0" />
            <span className="leading-snug">{prereq}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
