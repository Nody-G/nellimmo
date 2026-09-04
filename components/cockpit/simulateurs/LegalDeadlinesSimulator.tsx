'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react';
import { computeLegalDates } from '@/components/cockpit/aide/aide-types';

export function LegalDeadlinesSimulator() {
  const [compromiseDate, setCompromiseDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notificationType, setNotificationType] = useState<string>('ar24');
  const [copied, setCopied] = useState<boolean>(false);

  const calculatedDates = useMemo(() => {
    return computeLegalDates(compromiseDate);
  }, [compromiseDate]);

  const copyDeadlinesSummary = () => {
    if (!calculatedDates) return;
    const summary = `📅 CALENDRIER DES DÉLAIS LÉGAUX DU COMPROMIS — NELL'IMMO
------------------------------------------------------
• Date de notification (${notificationType.toUpperCase()}) : ${new Date(compromiseDate).toLocaleDateString('fr-FR')}

1. ⚖️ PURGE DU DÉLAI SRU (10 JOURS) :
   Expiration : ${calculatedDates.sru} à 24h00
   (Passé ce délai, le compromis est ferme et définitif pour l'acquéreur)

2. 🏦 DÉPÔT DU DOSSIER DE PRÊT (J+30) :
   Date limite : ${calculatedDates.loanApp}
   (Justificatif de dépôt à fournir à l'agence et au notaire)

3. 📜 ACCORD DE PRÊT DÉFINITIF (J+60) :
   Date limite : ${calculatedDates.loanApproval}
   (Offre de prêt éditée et acceptée après délai Scrivener de 11 jours)

4. ✒️ SIGNATURE DE L'ACTE AUTHENTIQUE (J+90) :
   Date cible chez le Notaire : ${calculatedDates.finalDeed}
   (Remise des clés et paiement du prix net vendeur)

Suivi du dossier assuré par l'agence Nell'Immo (Nelly Fernandez - 07 55 68 61 09).`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EE] shadow-2xs space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E12B7B]">
            <Scale className="w-4 h-4" />
            <span>Sécurité Juridique & Calendrier Notarial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#131B26] mt-1">
            Calculateur de Délais Légaux & Purge SRU
          </h2>
          <p className="text-xs text-gray-500">
            Calculez instantanément la purge du droit de rétractation SRU (Art. L271-1 CCH) et les échéances suspensives du compromis.
          </p>
        </div>

        <button
          onClick={copyDeadlinesSummary}
          disabled={!calculatedDates}
          className="px-4 py-2.5 bg-gradient-to-r from-[#131B26] to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Calendrier copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#C59A45]" />
              <span>Copier Calendrier Notaire / Clients</span>
            </>
          )}
        </button>
      </div>

      {/* Inputs Bar */}
      <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C59A45]" />
            Date de notification du compromis :
          </label>
          <input
            type="date"
            value={compromiseDate}
            onChange={(e) => setCompromiseDate(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20 shadow-2xs"
          />
          <span className="text-[11px] text-gray-400 mt-1.5 block">
            Le délai commence à courir le lendemain de la 1ère présentation du recommandé ou du récépissé électronique.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#C59A45]" />
            Mode de notification légal :
          </label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E12B7B]/20 shadow-2xs"
          >
            <option value="ar24">Lettre Recommandée Électronique (AR24 Notaire certifiée eIDAS)</option>
            <option value="lrar">Lettre Recommandée avec AR Postale (LRAR papier)</option>
            <option value="huissier">Signification par Commissaire de Justice (Huissier)</option>
            <option value="recipisse">Remise en main propre contre récépissé (Art. L271-1)</option>
          </select>
          <span className="text-[11px] text-gray-400 mt-1.5 block">
            AR24 : le délai court dès le lendemain de l&apos;envoi de l&apos;avis de mise à disposition.
          </span>
        </div>
      </div>

      {/* Deadlines Step-by-step display */}
      {calculatedDates ? (
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
                {calculatedDates.sru}
              </div>
              <div className="text-[11px] font-bold text-[#E12B7B] mt-0.5">
                à 24h00 précises
              </div>
              <p className="text-[11px] text-gray-500 mt-2 leading-tight">
                Si l&apos;acquéreur ne s&apos;est pas rétracté par écrit, la vente devient ferme et le dépôt de garantie est acquis.
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
                {calculatedDates.loanApp}
              </div>
              <p className="text-[11px] text-gray-500 mt-3 leading-tight">
                L&apos;acquéreur doit justifier d&apos;au moins une demande de prêt conforme aux stipulations du compromis.
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
                {calculatedDates.loanApproval}
              </div>
              <p className="text-[11px] text-gray-500 mt-3 leading-tight">
                Date butoir de réception de l&apos;offre de prêt bancaire ou du refus motivé de financement.
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
                {calculatedDates.finalDeed}
              </div>
              <p className="text-[11px] text-gray-500 mt-3 leading-tight">
                Rendez-vous de signature de l&apos;acte authentique, remise des clés et virement du prix de vente.
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
                <span><strong>Conditions d&apos;exercice :</strong> La rétractation doit être notifiée par lettre recommandée ou moyen équivalent présentant des garanties de date certaine.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
