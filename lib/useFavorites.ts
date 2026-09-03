'use client';

import { useSyncExternalStore, useCallback, useMemo } from 'react';

const FAVORITES_STORAGE_KEY = 'nellimo_favorites_v1';
const FAVORITES_CHANGE_EVENT = 'nellimo_favorites_changed';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(FAVORITES_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]';
}

function getServerSnapshot(): string {
  return '[]';
}

export function useFavorites() {
  const rawFavorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const favorites = useMemo<string[]>(() => {
    try {
      return JSON.parse(rawFavorites);
    } catch {
      return [];
    }
  }, [rawFavorites]);

  const toggleFavorite = useCallback((propertyId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      let updated: string[];

      if (currentList.includes(propertyId)) {
        updated = currentList.filter(id => id !== propertyId);
      } else {
        updated = [...currentList, propertyId];
      }

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(FAVORITES_CHANGE_EVENT));
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  }, []);

  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGE_EVENT));
  }, []);

  return {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isReady: true
  };
}
