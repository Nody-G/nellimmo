'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import type { AgencySettings, VendorReport } from '@/lib/types';

interface SellerAdvisorMessageProps {
  settings: AgencySettings;
  propertyReport?: VendorReport;
  whatsappUrl: string;
}

export function SellerAdvisorMessage({
  settings,
  propertyReport,
  whatsappUrl,
}: SellerAdvisorMessageProps) {
  return (
    <section className="bg-gradient-to-br from-[#131B26] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E12B7B] to-[#9F1239] flex items-center justify-center font-serif font-black text-xl text-white shadow-md">
            NF
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Nelly FERNANDEZ</h3>
            <span className="text-xs text-[#C59A45] font-semibold block">
              Directrice de l&apos;agence SASU Nell&apos;Immo • Votre interlocutrice dédiée
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.phone}`}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#C59A45]" />
            {settings.phone}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contacter par WhatsApp
          </a>
        </div>
      </div>

      <div className="space-y-3 text-xs leading-relaxed text-gray-300 font-sans">
        <p className="text-sm font-serif italic text-white">
          « Chers propriétaires, la commercialisation de votre bien se poursuit avec un flux soutenu de
          consultations sur SeLoger et LeBonCoin. »
        </p>
        <p>
          {propertyReport?.executive_summary ||
            `Votre maison bénéficie d’une excellente visibilité sur Pélissanne et le Pays Salonais. Notre sélection rigoureuse permet d’écarter les curieux pour ne vous présenter que des acheteurs disposant d’un accord bancaire de principe. Je reste à votre entière disposition pour tout échange complémentaire.`}
        </p>
      </div>
    </section>
  );
}
