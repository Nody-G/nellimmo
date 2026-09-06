'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { ClientReview } from './reviews-types';

interface ReviewsScoreCardProps {
  onOpenModal: () => void;
  reviews: ClientReview[];
}

export function ReviewsScoreCard({ onOpenModal, reviews }: ReviewsScoreCardProps) {
  const total = reviews.length;
  const average =
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;
  const displayAverage = average.toFixed(1).replace('.', ',');

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#F3E8EE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] text-white flex flex-col items-center justify-center shadow-md shrink-0">
          <span className="text-2xl font-black font-serif">{total > 0 ? displayAverage : '—'}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">/ 5</span>
        </div>
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-[#131B26]">
            Avis Clients & Témoignages
          </h3>
          <p className="text-xs text-gray-600 max-w-xl">
            Retours d’expérience de propriétaires vendeurs et acquéreurs accompagnés par Nelly Fernandez. Chaque témoignage publié correspond à une mission réellement accompagnée par l’agence.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenModal}
          className="px-5 py-3 bg-[#131B26] hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <Star className="w-4 h-4 text-amber-400" />
          <span>Déposer un Témoignage</span>
        </button>

        <Link
          href="/estimation"
          className="px-6 py-3 bg-[#E12B7B] hover:bg-[#C71B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center gap-2"
        >
          <span>Confier mon projet</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
