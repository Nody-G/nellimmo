'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import type { VisitSheet } from '@/lib/types';

interface SellerVisitsJournalProps {
  visits: VisitSheet[];
}

export function SellerVisitsJournal({ visits }: SellerVisitsJournalProps) {
  return (
    <section className="space-y-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
          Transparence & Retours Acquéreurs
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26]">
          Journal Détaillé des Visites Réalisées
        </h2>
        <p className="text-xs text-gray-500">
          Retours impartiaux et qualifiés collectés après chaque visite sur place par votre agence.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-xs space-y-6">
        {visits.length > 0 ? (
          <div className="space-y-4">
            {visits.map((visit, index) => (
              <div
                key={visit.id || index}
                className="p-5 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#131B26] text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        Visite du {new Date(visit.visit_date || visit.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      {visit.buyer && (
                        <span className="text-[11px] text-gray-500">
                          Acquéreur : {visit.buyer.first_name} {visit.buyer.last_name?.slice(0, 1)}.
                        </span>
                      )}
                    </div>
                  </div>

                  {visit.signature_data_url ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-center">
                      ✓ Bon de visite signé
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 self-start sm:self-center">
                      Bon de visite à signer
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  {visit.notes ? (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-900">
                      <span className="font-bold block text-[11px] mb-0.5">Compte-rendu de la visite :</span>
                      <p className="leading-relaxed">{visit.notes}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">
                      Compte-rendu de visite en cours de rédaction par votre agence.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#FCFAF7] rounded-2xl border border-[#F3E8EE] text-center space-y-2">
            <Calendar className="w-8 h-8 text-[#C59A45] mx-auto" />
            <h4 className="font-bold text-sm text-[#131B26]">Premières visites en cours de planification</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Les candidats acquéreurs sont en cours de qualification financière. Les comptes-rendus apparaîtront ici dès la première visite réalisée.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
