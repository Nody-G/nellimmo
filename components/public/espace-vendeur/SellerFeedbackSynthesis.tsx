'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { AvisDonutChart } from '@/components/cockpit/comptes-rendus/AvisDonutChart';

interface SellerFeedbackSynthesisProps {
  positiveFeedbacks: number;
  neutralFeedbacks: number;
  negativeFeedbacks: number;
  verbatims: string[];
}

export function SellerFeedbackSynthesis({
  positiveFeedbacks,
  neutralFeedbacks,
  negativeFeedbacks,
  verbatims,
}: SellerFeedbackSynthesisProps) {
  return (
    <section className="space-y-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          Perception Acquéreurs & Retours Terrain
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
          Synthèse des Impressions & Verbatim Anonymisés
        </h2>
        <p className="text-xs text-gray-500">
          Retours recueillis auprès des visiteurs après chaque visite, présentés en totale transparence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#131B26]">
            Répartition des Avis Visiteurs
          </h3>
          <AvisDonutChart
            positive={positiveFeedbacks}
            neutral={neutralFeedbacks}
            negative={negativeFeedbacks}
          />
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#131B26] flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#E12B7B]" />
            <span>Verbatim Anonymisés des Visiteurs</span>
          </h3>
          {verbatims.length === 0 ? (
            <p className="text-xs text-gray-400 font-semibold py-4">
              Aucun commentaire textuel saisi pour le moment.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {verbatims.map((v, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-700 italic leading-relaxed p-3.5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE]"
                >
                  « {v} »
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
