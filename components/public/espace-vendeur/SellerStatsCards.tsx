'use client';

import React from 'react';
import { Eye, Users, Calendar, ThumbsUp } from 'lucide-react';

interface SellerStatsCardsProps {
  hasReport: boolean;
  totalViews: number | null;
  viewsLeboncoin: number | null;
  viewsSeloger: number | null;
  viewsBienici: number | null;
  viewsWebsite: number | null;
  leadsCount: number | null;
  visitsCount: number | null;
  satisfactionPct: number | null;
}

export function SellerStatsCards({
  hasReport,
  totalViews,
  viewsLeboncoin,
  viewsSeloger,
  viewsBienici,
  viewsWebsite,
  leadsCount,
  visitsCount,
  satisfactionPct,
}: SellerStatsCardsProps) {
  const safeTotalViews = totalViews && totalViews > 0 ? totalViews : 1;

  const display = (value: number | null): string =>
    value === null ? '—' : value.toLocaleString('fr-FR');

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            Bilan de Visibilité Portails
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
            Audience & Consultations de Votre Annonce
          </h2>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-[#F3E8EE]">
          {hasReport ? 'Données du dernier bilan' : 'Bilan en cours de préparation'}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Consultations</span>
            <Eye className="w-4 h-4 text-[#E12B7B]" />
          </div>
          <span className="text-3xl font-serif font-black text-[#131B26] block">
            {display(totalViews)}
          </span>
          <span className="text-[11px] text-gray-500">
            {hasReport ? 'Vues cumulées tous portails' : 'Disponible au prochain bilan'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Contacts Qualifiés</span>
            <Users className="w-4 h-4 text-[#C59A45]" />
          </div>
          <span className="text-3xl font-serif font-black text-[#131B26] block">
            {display(leadsCount)}
          </span>
          <span className="text-[11px] text-gray-500">
            Acheteurs solvables filtrés
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Visites Réalisées</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-serif font-black text-[#131B26] block">
            {display(visitsCount)}
          </span>
          <span className="text-[11px] text-gray-500">
            Sur rendez-vous accompagné
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F3E8EE] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Satisfaction / Avis</span>
            <ThumbsUp className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-serif font-black text-emerald-700 block">
            {satisfactionPct === null ? '—' : `${satisfactionPct}%`}
          </span>
          <span className="text-[11px] text-gray-500">
            Retours favorables qualifiés
          </span>
        </div>
      </div>

      {/* Breakdown by portal */}
      <div className="bg-white rounded-3xl p-6 border border-[#F3E8EE] shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Répartition de la diffusion par canal :
        </h3>
        {!hasReport ? (
          <p className="text-xs text-gray-400 font-semibold py-2">
            Les statistiques de consultation par portail seront disponibles dès la génération du premier bilan de commercialisation.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">LeBonCoin</span>
                <span className="text-xs font-mono font-bold text-[#E12B7B]">{display(viewsLeboncoin)} vues</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#E12B7B] h-full" style={{ width: `${((viewsLeboncoin ?? 0) / safeTotalViews) * 100}%` }} />
              </div>
              <span className="text-[10px] text-gray-400 block pt-1">Multidiffusion flux Poliris 4.08</span>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">SeLoger</span>
                <span className="text-xs font-mono font-bold text-blue-600">{display(viewsSeloger)} vues</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${((viewsSeloger ?? 0) / safeTotalViews) * 100}%` }} />
              </div>
              <span className="text-[10px] text-gray-400 block pt-1">Emplacement Premium régional</span>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Bien’ici</span>
                <span className="text-xs font-mono font-bold text-amber-600">{display(viewsBienici)} vues</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: `${((viewsBienici ?? 0) / safeTotalViews) * 100}%` }} />
              </div>
              <span className="text-[10px] text-gray-400 block pt-1">Cartographie 3D immersive</span>
            </div>

            <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Site Nell’Immo</span>
                <span className="text-xs font-mono font-bold text-emerald-600">{display(viewsWebsite)} vues</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full" style={{ width: `${((viewsWebsite ?? 0) / safeTotalViews) * 100}%` }} />
              </div>
              <span className="text-[10px] text-gray-400 block pt-1">Catalogue officiel direct</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
