'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LegalDates } from '@/components/cockpit/aide/aide-types';

interface LegalDeadlinesTimelineProps {
  dates: LegalDates;
}

export function LegalDeadlinesTimeline({ dates }: LegalDeadlinesTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
        Chronologie Officielle des Échéances
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Étape 1 : SRU */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/80 to-white border-2 border-[#E12B7B]/30 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#E12B7B] text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Priorité 1
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#E12B7B]/10 text-[#E12B7B] flex items-center justify-center font-bold">
              10j
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E12B7B] block">
                Purge Rétractation SRU
              </span>
              <span className="text-[11px] text-gray-400">J+10 ouvré</span>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 mt-2">
            {dates.sru}
          </div>
          <div className="text-[11px] font-bold text-[#E12B7B] mt-0.5">
            à 24h00 précises
          </div>
          <p className="text-[11px] text-gray-500 mt-2 leading-tight">
            Si l’acquéreur ne s’est pas rétracté par écrit, la vente devient ferme et le dépôt de garantie est acquis.
          </p>
        </div>

        {/* Étape 2 : Dépôt Prêt */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              30j
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Dépôt Dossier Prêt
              </span>
              <span className="text-[11px] text-gray-400">J+30 contractuel</span>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 mt-2">
            {dates.loanApp}
          </div>
          <p className="text-[11px] text-gray-500 mt-3 leading-tight">
            L’acquéreur doit justifier d’au moins une demande de prêt conforme aux stipulations du compromis.
          </p>
        </div>

        {/* Étape 3 : Accord de Prêt */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white border border-blue-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              60j
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Accord de Prêt Définitif
              </span>
              <span className="text-[11px] text-gray-400">J+60 suspensif</span>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 mt-2">
            {dates.loanApproval}
          </div>
          <p className="text-[11px] text-gray-500 mt-3 leading-tight">
            Date butoir de réception de l’offre de prêt bancaire ou du refus motivé de financement.
          </p>
        </div>

        {/* Étape 4 : Acte Authentique */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              90j
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Signature Notaire
              </span>
              <span className="text-[11px] text-gray-400">J+90 cible</span>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 mt-2">
            {dates.finalDeed}
          </div>
          <p className="text-[11px] text-gray-500 mt-3 leading-tight">
            Rendez-vous de signature de l’acte authentique, remise des clés et virement du prix de vente.
          </p>
        </div>
      </div>

      {/* Rappels Juridiques & Jurisprudence */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Règles de Computation du Délai SRU (Article L271-1 CCH & Jurisprudence Cour de Cassation)</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-gray-600 text-[11px]">
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E12B7B] shrink-0 mt-0.5" />
            <span><strong>Lendemain du 1er jour :</strong> Le jour de la notification ne compte jamais (dies a quo).</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E12B7B] shrink-0 mt-0.5" />
            <span><strong>Prorogation week-end :</strong> Si le 10e jour expire un samedi, dimanche ou jour férié, il est prorogé au premier jour ouvrable suivant à 24h00.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E12B7B] shrink-0 mt-0.5" />
            <span><strong>Conditions d’exercice :</strong> La rétractation doit être notifiée par lettre recommandée ou moyen équivalent présentant des garanties de date certaine.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
