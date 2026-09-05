'use client';

import React from 'react';
import type { ContactItem } from '@/lib/types';
import { ContactTableRow } from './table/ContactTableRow';

interface ContactsTableProps {
  contacts: ContactItem[];
  onOpenDetail: (contact: ContactItem) => void;
  onOpenEmailCompose: (contact: ContactItem) => void;
  onEditContact: (contact: ContactItem) => void;
  onDeleteContact: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function ContactsTable({
  contacts,
  onOpenDetail,
  onOpenEmailCompose,
  onEditContact,
  onDeleteContact,
  onToggleFavorite,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#F3E8EE] p-12 text-center text-gray-400 text-xs">
        Aucun contact ne correspond à votre recherche ou filtre.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#F3E8EE] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FCFAF7] border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400">
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Rôle</th>
              <th className="py-3 px-4">Entreprise &amp; Spécialité</th>
              <th className="py-3 px-4">Téléphone</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Ville</th>
              <th className="py-3 px-4">Biens liés</th>
              <th className="py-3 px-4 text-right">Actions rapides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {contacts.map((contact) => (
              <ContactTableRow
                key={contact.id}
                contact={contact}
                onOpenDetail={onOpenDetail}
                onOpenEmailCompose={onOpenEmailCompose}
                onEditContact={onEditContact}
                onDeleteContact={onDeleteContact}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
