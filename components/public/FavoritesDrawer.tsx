'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useNellimoStore } from '@/lib/public-store';
import { useFavorites } from '@/lib/useFavorites';
import { X, Heart, Trash2, ArrowRight, Home, MessageCircle, Eye } from 'lucide-react';
import { formatMandateRef } from '@/lib/hoguet';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
  const { properties } = useNellimoStore();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const [confirmClear, setConfirmClear] = useState(false);

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

  // Generate WhatsApp message for all favorites
  const whatsappFavoritesSummary = favoriteProperties
    .map(p => `- ${p.title} (${p.city}, Réf. ${formatMandateRef(p.mandate_number)}, ${p.price_fai.toLocaleString('fr-FR')} €)`)
    .join('\n');
  const whatsappUrl = `https://wa.me/33755686109?text=${encodeURIComponent(
    `Bonjour Nelly, je souhaiterais des renseignements ou organiser une visite pour mes biens favoris :\n${whatsappFavoritesSummary}`
  )}`;

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
          ) : (
            favoriteProperties.map((prop) => {
              const coverImage =
                prop.images?.find((img) => img.is_cover)?.image_url ||
                prop.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
              const mandateRef = formatMandateRef(prop.mandate_number);

              return (
                <div
                  key={prop.id}
                  className="p-3 bg-white rounded-2xl border border-[#F3E8EE] hover:border-[#E12B7B]/40 shadow-xs hover:shadow-md transition-all group flex gap-3.5 items-center relative"
                >
                  {/* Property Image Thumbnail */}
                  <Link
                    href={`/biens/${prop.id}`}
                    onClick={onClose}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 relative bg-gray-100 block"
                  >
                    <Image
                      src={coverImage}
                      alt={prop.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                  </Link>

                  {/* Property Summary */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        Réf. {mandateRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(prop.id)}
                        className="text-gray-400 hover:text-rose-600 transition p-1 rounded-full hover:bg-rose-50 cursor-pointer"
                        title="Retirer ce bien des favoris"
                        aria-label={`Retirer ${prop.title} des favoris`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      href={`/biens/${prop.id}`}
                      onClick={onClose}
                      className="block font-bold text-xs sm:text-sm text-[#131B26] hover:text-[#E12B7B] transition truncate leading-snug"
                    >
                      {prop.title}
                    </Link>

                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span>{prop.living_area} m²</span>
                      <span>•</span>
                      <span>{prop.bedrooms_count} ch.</span>
                      <span>•</span>
                      <span className="font-semibold text-gray-700">{prop.city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <div className="font-serif font-black text-xs sm:text-sm text-[#E12B7B]">
                        {prop.price_fai.toLocaleString('fr-FR')} € <span className="text-[9px] font-sans font-normal text-gray-400">FAI</span>
                      </div>
                      <Link
                        href={`/biens/${prop.id}`}
                        onClick={onClose}
                        className="text-[11px] font-bold text-gray-600 hover:text-[#E12B7B] flex items-center gap-0.5 transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Voir</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {favoriteProperties.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#F3E8EE] bg-[#FCFAF7] space-y-2.5 shrink-0">
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-gray-500 font-medium">Sélection</span>
              <span className="font-bold text-gray-900">
                {favoriteProperties.length} bien{favoriteProperties.length > 1 ? 's' : ''} au catalogue
              </span>
            </div>

            {/* WhatsApp Direct Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Demander une visite via WhatsApp</span>
            </a>

            {/* Bottom row actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirmClear) {
                    clearFavorites();
                    setConfirmClear(false);
                  } else {
                    setConfirmClear(true);
                    setTimeout(() => setConfirmClear(false), 3000);
                  }
                }}
                className={`text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer py-1 ${confirmClear ? 'text-rose-600 font-bold' : 'text-gray-400 hover:text-rose-600'
                  }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmClear ? 'Confirmer la suppression ?' : 'Tout effacer'}</span>
              </button>

              <Link
                href="/contact"
                onClick={onClose}
                className="px-4 py-2 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Nous contacter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
