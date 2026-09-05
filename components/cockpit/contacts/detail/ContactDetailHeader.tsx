'use client';

import React from 'react';
import { X, Star, Edit2 } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { ROLE_CONFIGS } from '../contacts-constants';

interface ContactDetailHeaderProps {
  contact: ContactItem;
  onClose: () => void;
  onEditContact: (contact: ContactItem) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function ContactDetailHeader({
  contact,
  onClose,
  onEditContact,
  onToggleFavorite,
}: ContactDetailHeaderProps) {
  const roleConfig = ROLE_CONFIGS[contact.role] || ROLE_CONFIGS.autre;

  return (
    <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FCFAF7] border-2 border-gray-100 flex items-center justify-center font-bold text-lg text-[#131B26]">
          {contact.first_name?.[0]}
          {contact.last_name?.[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border ${roleConfig.badgeClass}`}
            >
              {roleConfig.label}
            </span>
            <button
              type="button"
              onClick={() => onToggleFavorite(contact.id, !!contact.is_favorite)}
              className="cursor-pointer"
            >
              <Star
                className={`w-4 h-4 ${
                  contact.is_favorite
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300 hover:text-amber-400'
                }`}
              />
            </button>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#131B26] mt-1">
            {contact.civility ? `${contact.civility} ` : ''}
            {contact.first_name} {contact.last_name}
          </h2>
          <p className="text-xs text-gray-500">
            {contact.company ? `${contact.company} — ` : ''}
            {contact.specialty || roleConfig.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEditContact(contact)}
          className="p-2 rounded-xl text-gray-500 hover:text-[#E12B7B] hover:bg-gray-100 transition cursor-pointer"
          title="Modifier"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
