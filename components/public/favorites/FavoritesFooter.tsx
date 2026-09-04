'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Trash2, ArrowRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatMandateRef } from '@/lib/hoguet';

interface FavoritesFooterProps {
  favoriteProperties: Property[];
  onClearFavorites: () => void;
  onClose: () => void;
}

export const FavoritesFooter: React.FC<FavoritesFooterProps> = ({
  favoriteProperties,
  onClearFavorites,
  onClose
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  if (favoriteProperties.length === 0) return null;

  const whatsappFavoritesSummary = favoriteProperties
    .map(
      (p) =>
        `- ${p.title} (${p.city}, Réf. ${formatMandateRef(p.mandate_number)}, ${p.price_fai.toLocaleString('fr-FR')} €)`
    )
    .join('\n');

  const whatsappUrl = `https://wa.me/33755686109?text=${encodeURIComponent(
    `Bonjour Nelly, je souhaiterais des renseignements ou organiser une visite pour mes biens favoris :\n${whatsappFavoritesSummary}`
  )}`;

  return (
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
              onClearFavorites();
              setConfirmClear(false);
            } else {
              setConfirmClear(true);
              setTimeout(() => setConfirmClear(false), 3000);
            }
          }}
          className={`text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer py-1 ${
            confirmClear ? 'text-rose-600 font-bold' : 'text-gray-400 hover:text-rose-600'
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
  );
};
