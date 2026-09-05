'use client';

import React from 'react';
import { Mail, MessageSquare, Star, Edit2, Trash2, Download } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { ROLE_CONFIGS } from '../contacts-constants';
import { downloadVCard } from '@/lib/gmail';

interface ContactTableRowProps {
  contact: ContactItem;
  onOpenDetail: (contact: ContactItem) => void;
  onOpenEmailCompose: (contact: ContactItem) => void;
  onEditContact: (contact: ContactItem) => void;
  onDeleteContact: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function ContactTableRow({
  contact,
  onOpenDetail,
  onOpenEmailCompose,
  onEditContact,
  onDeleteContact,
  onToggleFavorite,
}: ContactTableRowProps) {
  const roleConfig = ROLE_CONFIGS[contact.role] || ROLE_CONFIGS.autre;
  const RoleIcon = roleConfig.icon;
  const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;

  return (
    <tr className="hover:bg-[#FCFAF7]/80 transition group">
      {/* Favorite star */}
      <td className="py-3 px-4 text-center">
        <button
          type="button"
          onClick={() => onToggleFavorite(contact.id, !!contact.is_favorite)}
          className="cursor-pointer"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              contact.is_favorite
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-200 hover:text-amber-400'
            }`}
          />
        </button>
      </td>

      {/* Contact Name & Civility */}
      <td className="py-3 px-4 font-bold text-gray-900">
        <button
          type="button"
          onClick={() => onOpenDetail(contact)}
          className="hover:text-[#E12B7B] text-left transition flex items-center gap-2 cursor-pointer"
        >
          <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700 shrink-0">
            {contact.first_name?.[0]}
            {contact.last_name?.[0]}
          </span>
          <span>
            {contact.civility ? `${contact.civility} ` : ''}
            {contact.first_name} {contact.last_name}
          </span>
        </button>
      </td>

      {/* Role Badge */}
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${roleConfig.badgeClass}`}
        >
          <RoleIcon className="w-2.5 h-2.5" />
          {roleConfig.label}
        </span>
      </td>

      {/* Company & Specialty */}
      <td className="py-3 px-4 text-gray-600">
        <div className="font-semibold text-gray-800">{contact.company || '—'}</div>
        {contact.specialty && (
          <div className="text-[10px] text-gray-400 truncate max-w-[180px]">
            {contact.specialty}
          </div>
        )}
      </td>

      {/* Phone */}
      <td className="py-3 px-4 font-mono text-gray-700">
        {contact.phone ? (
          <a href={`tel:${contact.phone}`} className="hover:text-[#E12B7B] transition">
            {contact.phone}
          </a>
        ) : (
          '—'
        )}
      </td>

      {/* Email */}
      <td className="py-3 px-4 text-gray-600">
        {contact.email ? (
          <button
            type="button"
            onClick={() => onOpenEmailCompose(contact)}
            className="hover:text-red-600 transition flex items-center gap-1 cursor-pointer"
          >
            <Mail className="w-3 h-3 text-red-500" />
            <span className="truncate max-w-[160px]">{contact.email}</span>
          </button>
        ) : (
          '—'
        )}
      </td>

      {/* City */}
      <td className="py-3 px-4 text-gray-600">{contact.city || '—'}</td>

      {/* Associated Properties */}
      <td className="py-3 px-4">
        {contact.associated_property_ids && contact.associated_property_ids.length > 0 ? (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md">
            {contact.associated_property_ids.length} bien(s)
          </span>
        ) : (
          <span className="text-gray-300 text-[10px]">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {contact.email && (
            <button
              type="button"
              onClick={() => onOpenEmailCompose(contact)}
              title="Composer dans Gmail"
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>
          )}
          {contact.phone && (
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => downloadVCard(contact)}
            title="Télécharger vCard"
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEditContact(contact)}
            title="Modifier le contact"
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteContact(contact.id)}
            title="Supprimer le contact"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
