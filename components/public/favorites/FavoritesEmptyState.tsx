'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Home } from 'lucide-react';

interface FavoritesEmptyStateProps {
  onClose: () => void;
}

export const FavoritesEmptyState: React.FC<FavoritesEmptyStateProps> = ({ onClose }) => {
  return (
    <div className="text-center py-16 px-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#FDF2F8] text-[#E12B7B] flex items-center justify-center mx-auto shadow-inner">
        <Heart className="w-8 h-8 opacity-60" />
      </div>
      <div className="space-y-1.5">
        <p className="font-serif font-bold text-gray-800 text-base">
          Aucun bien dans vos favoris
        </p>
        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
          Explorez nos mandats à Pélissanne, Salon-de-Provence et Lambesc, et cliquez sur l&apos;icône cœur pour les retrouver ici.
        </p>
      </div>
      <Link
        href="/biens"
        onClick={onClose}
        className="inline-flex items-center gap-2 px-5 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <Home className="w-4 h-4" />
        <span>Explorer le catalogue</span>
      </Link>
    </div>
  );
};
