'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'nellimo_favorites_v1';
const FAVORITES_CHANGE_EVENT = 'nellimo_favorites_changed';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const loadFavorites = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    loadFavorites();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        loadFavorites();
      }
    };

    const handleCustomChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(FAVORITES_CHANGE_EVENT, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(FAVORITES_CHANGE_EVENT, handleCustomChange);
    };
  }, [loadFavorites]);

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
      setFavorites(updated);
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
    setFavorites([]);
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGE_EVENT));
  }, []);

  return {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    isReady
  };
}
