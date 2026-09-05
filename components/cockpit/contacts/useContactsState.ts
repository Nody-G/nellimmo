'use client';

import { useState, useMemo } from 'react';
import type { ContactItem, ContactRole } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';

export type RoleFilterOption = 'all' | ContactRole;

export function useContactsState(initialContactId?: string) {
  const { contacts } = useNellimoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<RoleFilterOption>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [selectedContactForDetail, setSelectedContactForDetail] = useState<ContactItem | null>(() => {
    if (initialContactId) {
      return contacts.find((c) => c.id === initialContactId) || null;
    }
    return null;
  });
  const [contactForEmailCompose, setContactForEmailCompose] = useState<ContactItem | null>(null);
  const [contactForEdit, setContactForEdit] = useState<ContactItem | null>(null);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isGoogleSyncModalOpen, setIsGoogleSyncModalOpen] = useState(false);

  // Counts by role
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: contacts.length, favoris: 0 };
    for (const c of contacts) {
      counts[c.role] = (counts[c.role] || 0) + 1;
      if (c.is_favorite) {
        counts.favoris++;
      }
    }
    return counts;
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return contacts.filter((c) => {
      // Role filter
      if (activeRole !== 'all' && c.role !== activeRole) {
        return false;
      }
      // Favorites filter
      if (onlyFavorites && !c.is_favorite) {
        return false;
      }
      // Search query
      if (!q) return true;

      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      const company = (c.company || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const phone = (c.phone || '').replace(/\s+/g, '');
      const city = (c.city || '').toLowerCase();
      const notes = (c.notes || '').toLowerCase();
      const specialty = (c.specialty || '').toLowerCase();
      const cleanQ = q.replace(/\s+/g, '');

      return (
        fullName.includes(q) ||
        company.includes(q) ||
        email.includes(q) ||
        phone.includes(cleanQ) ||
        city.includes(q) ||
        notes.includes(q) ||
        specialty.includes(q)
      );
    });
  }, [contacts, activeRole, onlyFavorites, searchQuery]);

  return {
    contacts,
    filteredContacts,
    roleCounts,
    searchQuery,
    setSearchQuery,
    activeRole,
    setActiveRole,
    onlyFavorites,
    setOnlyFavorites,
    viewMode,
    setViewMode,
    selectedContactForDetail,
    setSelectedContactForDetail,
    contactForEmailCompose,
    setContactForEmailCompose,
    contactForEdit,
    setContactForEdit,
    isNewContactModalOpen,
    setIsNewContactModalOpen,
    isGoogleSyncModalOpen,
    setIsGoogleSyncModalOpen,
  };
}
