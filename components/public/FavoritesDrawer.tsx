'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useNellimoStore } from '@/lib/public-store';
import { useFavorites } from '@/lib/useFavorites';
import { X, Heart } from 'lucide-react';
import { FavoriteItemCard, FavoritesEmptyState, FavoritesFooter } from './favorites';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { properties } = useNellimoStore();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const drawerContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-drawer-title"
    >
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-overlay transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-drawer border-l border-[#F3E8EE]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#F3E8EE] flex items-center justify-between bg-[#FCFAF7] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-[#E12B7B]" />
            </div>
            <div>
              <h2 id="favorites-drawer-title" className="text-lg font-serif font-bold text-[#131B26]">
                Mes Biens Favoris
              </h2>
              <span className="text-xs text-gray-500 font-semibold">
                {favoriteProperties.length} bien{favoriteProperties.length > 1 ? 's' : ''} sauvegardé{favoriteProperties.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Fermer le volet des favoris"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Properties List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {favoriteProperties.length === 0 ? (
            <FavoritesEmptyState onClose={onClose} />
          ) : (
            favoriteProperties.map((prop) => (
              <FavoriteItemCard
                key={prop.id}
                property={prop}
                onClose={onClose}
                onRemove={toggleFavorite}
              />
            ))
          )}
        </div>

        {/* Footer Actions */}
        <FavoritesFooter
          favoriteProperties={favoriteProperties}
          onClearFavorites={clearFavorites}
          onClose={onClose}
        />
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
