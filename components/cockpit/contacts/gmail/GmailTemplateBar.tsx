'use client';

import React from 'react';
import type { Property } from '@/lib/types';
import { EMAIL_TEMPLATES } from '@/lib/gmail';

interface GmailTemplateBarProps {
  selectedTemplateId: string;
  selectedPropertyId: string;
  properties: Property[];
  onTemplateChange: (templateId: string) => void;
  onPropertyChange: (propertyId: string) => void;
}

export function GmailTemplateBar({
  selectedTemplateId,
  selectedPropertyId,
  properties,
  onTemplateChange,
  onPropertyChange,
}: GmailTemplateBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Modèle d’email métier
        </label>
        <select
          value={selectedTemplateId}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-bold text-gray-900"
        >
          {EMAIL_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              [{t.role.toUpperCase()}] {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
          Mandat rattaché (variables dynamiques)
        </label>
        <select
          value={selectedPropertyId}
          onChange={(e) => onPropertyChange(e.target.value)}
          className="w-full p-2.5 bg-[#FCFAF7] border border-gray-200 rounded-xl font-semibold text-gray-900"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.mandate_number} — {p.title} ({p.city})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
