'use client';

import React from 'react';
import type { ContactItem } from '@/lib/types';
import { ContactTableRow } from './table/ContactTableRow';

import { SortableColumnHeader } from '../common/SortableColumnHeader';
import type { ContactsSortOption } from './useContactsState';

interface ContactsTableProps {
  contacts: ContactItem[];
  onOpenDetail: (contact: ContactItem) => void;
  onOpenEmailCompose: (contact: ContactItem) => void;
  onEditContact: (contact: ContactItem) => void;
  onDeleteContact: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  sortBy?: ContactsSortOption;
  onSortChange?: (newSort: ContactsSortOption) => void;
}

export function ContactsTable({
  contacts,
  onOpenDetail,
  onOpenEmailCompose,
  onEditContact,
  onDeleteContact,
  onToggleFavorite,
  sortBy = 'favorites_first',
  onSortChange,
}: ContactsTableProps) {
  const handleSort = (option: ContactsSortOption) => {
    if (onSortChange) onSortChange(option);
  };

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
              <th className="py-3 px-4 w-12 text-center">
                <SortableColumnHeader
                  label="★"
                  active={sortBy === 'favorites_first'}
                  direction="desc"
                  align="center"
                  title="Trier par favoris en tête"
                  onClick={() => handleSort('favorites_first')}
                />
              </th>
              <th className="py-3 px-4">
                <SortableColumnHeader
                  label="Contact"
                  active={sortBy === 'name_asc' || sortBy === 'name_desc'}
                  direction={sortBy === 'name_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'name_asc' ? 'name_desc' : 'name_asc')}
                />
              </th>
              <th className="py-3 px-4">
                <SortableColumnHeader
                  label="Rôle"
                  active={sortBy === 'role' || sortBy === 'role_desc'}
                  direction={sortBy === 'role_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'role' ? 'role_desc' : 'role')}
                />
              </th>
              <th className="py-3 px-4">
                <SortableColumnHeader
                  label="Entreprise & Spécialité"
                  active={sortBy === 'company' || sortBy === 'company_desc'}
                  direction={sortBy === 'company_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'company' ? 'company_desc' : 'company')}
                />
              </th>
              <th className="py-3 px-4">Téléphone</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">
                <SortableColumnHeader
                  label="Ville"
                  active={sortBy === 'city' || sortBy === 'city_desc'}
                  direction={sortBy === 'city_desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort(sortBy === 'city' ? 'city_desc' : 'city')}
                />
              </th>
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
