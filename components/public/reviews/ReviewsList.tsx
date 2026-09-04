'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ClientReview } from './reviews-types';

interface ReviewsListProps {
  reviews: ClientReview[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-4 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex text-amber-400 text-sm mb-1">
                {'★'.repeat(rev.rating)}
              </div>
              <h4 className="font-serif font-bold text-base text-[#131B26]">
                {rev.title}
              </h4>
            </div>
            <span className="text-[11px] text-gray-400">{rev.date}</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
            « {rev.comment} »
          </p>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <div>
              <strong className="block text-gray-900 font-bold">{rev.author}</strong>
              <span className="text-[11px] text-[#E12B7B]">{rev.role}</span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Vérifié
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
