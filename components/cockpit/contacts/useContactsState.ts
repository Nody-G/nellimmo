'use client';

import { useState, useMemo } from 'react';
import type { ContactItem, ContactRole } from '@/lib/types';
import { useNellimoStore } from '@/lib/store';

export type RoleFilterOption = 'all' | ContactRole;

export type ContactsSortOption =
  | 'favorites_first'
  | 'name_asc'
  | 'name_desc'
  | 'recent'
  | 'oldest'
  | 'role'
  | 'role_desc'
  | 'company'
  | 'company_desc'
  | 'city'
  | 'city_desc';

export function useContactsState(initialContactId?: string) {
  const { contacts } = useNellimoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<RoleFilterOption>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<ContactsSortOption>('favorites_first');

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

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = contacts.filter((c) => {
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

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'favorites_first': {
          if (a.is_favorite && !b.is_favorite) return -1;
          if (!a.is_favorite && b.is_favorite) return 1;
          return a.last_name.localeCompare(b.last_name, 'fr', { sensitivity: 'base' });
        }
        case 'name_asc': {
          const comp = a.last_name.localeCompare(b.last_name, 'fr', { sensitivity: 'base' });
          return comp !== 0 ? comp : a.first_name.localeCompare(b.first_name, 'fr', { sensitivity: 'base' });
        }
        case 'name_desc': {
          const comp = b.last_name.localeCompare(a.last_name, 'fr', { sensitivity: 'base' });
          return comp !== 0 ? comp : b.first_name.localeCompare(a.first_name, 'fr', { sensitivity: 'base' });
        }
        case 'recent': {
          const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
          const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
          return timeB - timeA;
        }
        case 'oldest': {
          const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
          const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
          return timeA - timeB;
        }
        case 'role': {
          const roleComp = a.role.localeCompare(b.role, 'fr');
          return roleComp !== 0 ? roleComp : a.last_name.localeCompare(b.last_name, 'fr');
        }
        case 'role_desc': {
          const roleComp = b.role.localeCompare(a.role, 'fr');
          return roleComp !== 0 ? roleComp : b.last_name.localeCompare(a.last_name, 'fr');
        }
        case 'company': {
          const compA = a.company || 'zzz';
          const compB = b.company || 'zzz';
          return compA.localeCompare(compB, 'fr', { sensitivity: 'base' });
        }
        case 'company_desc': {
          const compA = a.company || 'zzz';
          const compB = b.company || 'zzz';
          return compB.localeCompare(compA, 'fr', { sensitivity: 'base' });
        }
        case 'city': {
          const cityA = a.city || 'zzz';
          const cityB = b.city || 'zzz';
          return cityA.localeCompare(cityB, 'fr', { sensitivity: 'base' });
        }
        case 'city_desc': {
          const cityA = a.city || 'zzz';
          const cityB = b.city || 'zzz';
          return cityB.localeCompare(cityA, 'fr', { sensitivity: 'base' });
        }
        default:
          return 0;
      }
    });
  }, [contacts, activeRole, onlyFavorites, searchQuery, sortBy]);

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
    sortBy,
    setSortBy,
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
