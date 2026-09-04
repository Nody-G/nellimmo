'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ReviewsHighlightSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3E8EE] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Témoignages Vérifiés
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#131B26] mt-1">
            Ce que disent nos clients de Nell’Immo
          </h2>
        </div>
        <Link
          href="/avis-clients"
          className="text-xs font-bold uppercase text-[#E12B7B] hover:text-[#C71B62] flex items-center gap-1"
        >
          <span>Consulter tous les avis (98%)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex text-amber-400 text-sm">★★★★★</div>
          <strong className="text-sm font-bold text-gray-900 block">Vente rapide et prix respecté</strong>
          <p className="text-xs text-gray-600 leading-relaxed italic">
            « Nelly a su positionner notre villa au prix parfait. Vente conclue en moins d’un mois avec des acquéreurs finançables. Merci pour tout ! »
          </p>
          <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100">
            Michel & Claire D. • Pélissanne
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex text-amber-400 text-sm">★★★★★</div>
          <strong className="text-sm font-bold text-gray-900 block">Accompagnement de A à Z</strong>
          <p className="text-xs text-gray-600 leading-relaxed italic">
            « Premier achat pour nous : Nelly nous a guidés avec clarté, pédagogie et une grande disponibilité chez le notaire. »
          </p>
          <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100">
            Thomas & Sophie V. • Salon-de-Provence
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F3E8EE] shadow-xs space-y-3">
          <div className="flex text-amber-400 text-sm">★★★★★</div>
          <strong className="text-sm font-bold text-gray-900 block">Transparence et honoraires justes</strong>
          <p className="text-xs text-gray-600 leading-relaxed italic">
            « Une écoute attentive, aucune pression commerciale, et des honoraires compétitifs. C’est le vrai luxe d’une agence indépendante. »
          </p>
          <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100">
            Gilles F. • Lambesc
          </div>
        </div>
      </div>
    </section>
  );
}
