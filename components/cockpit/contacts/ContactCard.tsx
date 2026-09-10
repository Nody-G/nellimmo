'use client';

import React from 'react';
import { Mail, Phone, MapPin, Star, Building, Briefcase, FileText } from 'lucide-react';
import type { ContactItem } from '@/lib/types';
import { ROLE_CONFIGS } from './contacts-constants';
import { ContactCardActions } from './card/ContactCardActions';

interface ContactCardProps {
  contact: ContactItem;
  rankIndex?: number;
  onOpenDetail: (contact: ContactItem) => void;
  onOpenEmailCompose: (contact: ContactItem) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function ContactCard({
  contact,
  rankIndex,
  onOpenDetail,
  onOpenEmailCompose,
  onToggleFavorite,
}: ContactCardProps) {
  const roleConfig = ROLE_CONFIGS[contact.role] || ROLE_CONFIGS.autre;
  const RoleIcon = roleConfig.icon;

  const firstName = (contact.first_name || '').trim();
  const lastName = (contact.last_name || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Contact sans nom';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  const phone = (contact.phone || '').trim();
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const waNumber = cleanPhone.startsWith('0') ? `33${cleanPhone.slice(1)}` : cleanPhone;

  // Rank styling
  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 ring-1 ring-amber-300 shadow-xs font-black';
    }
    if (rank === 2) {
      return 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 shadow-xs font-black';
    }
    if (rank === 3) {
      return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-xs font-black';
    }
    return 'bg-slate-100 text-slate-700 font-bold border border-slate-200';
  };

  return (
    <div className="bg-white rounded-3xl border border-[#F3E8EE] hover:border-[#E12B7B]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      {/* Top Accent bar based on Role */}
      <div className={`h-1 w-full ${roleConfig.badgeClass.split(' ')[0] || 'bg-gray-200'}`} />

      {/* Top Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#FCFAF7] border-2 border-[#F3E8EE] flex items-center justify-center font-bold text-sm text-[#131B26] group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                {initials || <RoleIcon className="w-5 h-5 text-gray-400" />}
              </div>
              <span className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-xs border ${roleConfig.borderClass}`}>
                <RoleIcon className="w-2.5 h-2.5 text-gray-700" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {rankIndex !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[9px] ${getRankBadgeClass(rankIndex)}`}
                    title={`Rang n°${rankIndex}`}
                  >
                    #{rankIndex}
                  </span>
                )}
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border ${roleConfig.badgeClass}`}>
                  {roleConfig.label}
                </span>
                {contact.status === 'vip' && (
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                    VIP
                  </span>
                )}
              </div>
              <h3
                onClick={() => onOpenDetail(contact)}
                className="text-base font-bold font-serif text-[#131B26] mt-1 group-hover:text-[#E12B7B] transition-colors cursor-pointer"
              >
                {contact.civility ? `${contact.civility} ` : ''}
                {fullName}
              </h3>
            </div>
          </div>

          {/* Favorite Star */}
          <button
            type="button"
            onClick={() => onToggleFavorite(contact.id, !!contact.is_favorite)}
            title={contact.is_favorite ? 'Retirer des favoris' : 'Marquer comme favori'}
            className="text-gray-300 hover:text-amber-500 p-1.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-4 h-4 ${contact.is_favorite ? 'fill-amber-400 text-amber-400 drop-shadow-xs' : 'text-gray-300'
                }`}
            />
          </button>
        </div>

        {/* Company & Specialty */}
        <div className="mt-3 space-y-1">
          {contact.company && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{contact.company}</span>
            </div>
          )}
          {contact.specialty && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{contact.specialty}</span>
            </div>
          )}
          {contact.city && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {contact.city} {contact.postal_code ? `(${contact.postal_code})` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Contact direct coordinates */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5 text-xs">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-gray-800 hover:text-[#E12B7B] font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{phone}</span>
            </a>
          )}
          {contact.email && (
            <button
              type="button"
              onClick={() => onOpenEmailCompose(contact)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 truncate transition-colors text-left cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{contact.email}</span>
            </button>
          )}
        </div>

        {/* Notes preview if available */}
        {contact.notes && (
          <div className="mt-2.5 p-2 bg-[#FCFAF7] border border-[#F3E8EE] rounded-xl flex items-start gap-1.5 text-[11px] text-gray-600">
            <FileText className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 italic">{contact.notes}</p>
          </div>
        )}

        {/* Associated properties count */}
        {contact.associated_property_ids && contact.associated_property_ids.length > 0 && (
          <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600">
            <span>{contact.associated_property_ids.length} bien(s) / mandat(s) associé(s)</span>
          </div>
        )}
      </div>

      {/* Card Action Bar */}
      <ContactCardActions
        contact={contact}
        waNumber={waNumber}
        onOpenDetail={onOpenDetail}
        onOpenEmailCompose={onOpenEmailCompose}
      />
    </div>
  );
}
